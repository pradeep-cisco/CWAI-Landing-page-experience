import { spawnSync } from "node:child_process";
import { access, cp, mkdir, mkdtemp, readFile, readdir, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = fileURLToPath(new URL("../", import.meta.url));
const sourceModules = process.argv[2];
if (!sourceModules || process.argv.length !== 3) {
  console.error("Usage: npm run vendor:update -- /path/to/internal-install/node_modules");
  process.exit(1);
}

const elementsRoot = path.resolve(sourceModules, "@harbor/elements");
const contextRoot = path.resolve(sourceModules, "@harbor/context");
const elementsPackage = JSON.parse(await readFile(path.join(elementsRoot, "package.json"), "utf8"));
const contextPackage = JSON.parse(await readFile(path.join(contextRoot, "package.json"), "utf8"));
const publicPackage = JSON.parse(await readFile(path.join(repoRoot, "package.json"), "utf8"));
if (elementsPackage.name !== "@harbor/elements" || contextPackage.name !== "@harbor/context") {
  throw new Error("The source must contain installed @harbor/elements and @harbor/context packages.");
}
if (elementsPackage.dependencies?.["@stencil/core"] !== publicPackage.dependencies["@stencil/core"]) {
  throw new Error("Update the public @stencil/core dependency to match Elements before refreshing the snapshot.");
}

const paths = ["dist/harbor-elements", "dist/components", "dist/docs.json", "dist/types/components.d.ts", "utils", "icons"];
for (const entry of paths) await access(path.join(elementsRoot, entry));
await access(path.join(contextRoot, "bin/harbor-context.js"));

const vendorRoot = path.join(repoRoot, "vendor");
await mkdir(vendorRoot, { recursive: true });
const stagingRoot = await mkdtemp(path.join(os.tmpdir(), "boilerplate-vendor-"));

async function removeSourceMapReferences(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const filename = path.join(directory, entry.name);
    if (entry.isDirectory()) await removeSourceMapReferences(filename);
    else if (/\.(?:js|css)$/.test(entry.name)) {
      const content = await readFile(filename, "utf8");
      const normalized = content
        .replace(/^\/\/[#@] sourceMappingURL=.*$/gm, "")
        .replace(/\/\*[#@]\s*sourceMappingURL=[\s\S]*?\*\//g, "");
      if (content !== normalized) await writeFile(filename, normalized);
    }
  }
}

try {
  const snapshot = path.join(stagingRoot, "harbor-elements");
  for (const entry of paths) {
    await cp(path.join(elementsRoot, entry), path.join(snapshot, entry), {
      recursive: true,
      dereference: true,
      filter: source => !source.endsWith(".map") && (!source.endsWith(".d.ts") || source === path.join(elementsRoot, "dist/types/components.d.ts")),
    });
  }
  await removeSourceMapReferences(snapshot);
  // Preserve provenance without copying upstream development dependencies or scripts.
  await writeFile(path.join(snapshot, "package.json"), JSON.stringify({
    name: elementsPackage.name,
    version: elementsPackage.version,
    license: elementsPackage.license,
    type: "module",
    main: elementsPackage.main,
    module: elementsPackage.module,
  }, null, 2) + "\n");

  const result = spawnSync(process.execPath, [path.join(repoRoot, "scripts/update-context.mjs"), contextRoot], {
    cwd: repoRoot,
    stdio: "inherit",
  });
  if (result.status !== 0) throw new Error("Context refresh failed; Elements snapshot was not replaced.");

  const destination = path.join(vendorRoot, "harbor-elements");
  await rm(destination, { recursive: true, force: true });
  await cp(snapshot, destination, { recursive: true });
  await writeFile(path.join(vendorRoot, "versions.json"), JSON.stringify({
    "@harbor/elements": elementsPackage.version,
    "@harbor/context": contextPackage.version,
    "@stencil/core": elementsPackage.dependencies["@stencil/core"],
  }, null, 2) + "\n");
  console.log("Updated cached Elements and context. Review and commit vendor/ and .agents/skills/ together.");
} finally {
  await rm(stagingRoot, { recursive: true, force: true });
}
