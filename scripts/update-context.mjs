import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { mkdtemp, cp, mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const skillsRoot = path.join(repoRoot, ".agents", "skills");
const packageCli = path.join(repoRoot, "node_modules", "@harbor", "context", "bin", "harbor-context.js");
const generatedSkillNames = [
  "elements-generate-ui",
  "elements-ask-ui-docs",
  "elements-custom-dashboard",
  "elements-project-setup",
];

const resourceBundles = {
  "create-magnetic-ui": [
    "elements-generate-ui",
    "elements-ask-ui-docs",
    "elements-custom-dashboard",
  ],
  "setup-boilerplate": ["elements-project-setup"],
};

const temporaryRoot = await mkdtemp(path.join(os.tmpdir(), "boilerplate-context-"));

function runContextInstall() {
  const result = spawnSync(
    process.execPath,
    [
      packageCli,
      "--capability", "elements",
      "--editor", "codex",
      "--framework", "react",
      "--component-usage", "custom-elements",
      "--installation-type", "autoloading",
      "--dir", temporaryRoot,
      "--allow-outside",
      "--force",
      "--quiet",
    ],
    {
      cwd: repoRoot,
      env: {
        ...process.env,
        HARBOR_CONTEXT_STATIC_TELEMETRY_HELPERS: "1",
      },
      encoding: "utf8",
    },
  );

  if (result.stdout) process.stdout.write(result.stdout);
  if (result.stderr) process.stderr.write(result.stderr);
  if (result.status !== 0) {
    throw new Error(`harbor-context exited with status ${result.status ?? "unknown"}`);
  }
}

async function normalizeGeneratedFiles(skillName, directory, ownerName) {
  const entries = await readdir(directory, { withFileTypes: true });

  for (const entry of entries) {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      await normalizeGeneratedFiles(skillName, entryPath, ownerName);
      continue;
    }

    let content = await readFile(entryPath, "utf8");
    let normalized = content
      .replaceAll(
        `__HARBOR_CONTEXT_SKILLS_DIR__/${skillName}/resources/`,
        "./resources/",
      )
      .replaceAll("ui-context/elements/ui/icons-magnetic.md", "icons-magnetic.md")
      .replaceAll("ui-context/elements/ui/icons-phosphor.md", "icons-phosphor.md")
      .replace(/[ \t]+$/gm, "");

    if (ownerName === "create-magnetic-ui") {
      normalized = normalized
        .replaceAll(
          "If the target repo evidence contradicts this profile, or the user asks to install/bootstrap/detect Elements, use `elements-project-setup` first and follow the resolved profile.",
          "The boilerplate profile is fixed as React custom elements with autoloading. Do not route setup work from this skill.",
        )
        .replaceAll(
          "If the project already uses Harbor Elements, follow its existing import style and component model. If the install profile is unknown, use `elements-project-setup` first.",
          "Use the fixed boilerplate React custom-elements profile and its existing import style.",
        );
    }

    if (ownerName === "setup-boilerplate" && skillName === "elements-project-setup") {
      normalized = normalized.replaceAll(
        "Use `elements-color-token-migration` for application-owned `--hbr-color-*` migration; it can use the profile to locate relevant source and validation commands but chooses colors from semantic intent.",
        "Use the documented Magnetic color tokens for application-owned color work.",
      );
    }

    if (normalized !== content) await writeFile(entryPath, normalized);
  }
}

async function refreshBundle(ownerName, skillNames) {
  const ownerResources = path.join(skillsRoot, ownerName, "resources");
  await mkdir(ownerResources, { recursive: true });

  for (const entry of await readdir(ownerResources, { withFileTypes: true })) {
    if (entry.isDirectory() && entry.name.startsWith("elements-") && !skillNames.includes(entry.name)) {
      await rm(path.join(ownerResources, entry.name), { recursive: true, force: true });
    }
  }

  for (const skillName of skillNames) {
    const source = path.join(temporaryRoot, skillName);
    const destination = path.join(ownerResources, skillName);
    await rm(destination, { recursive: true, force: true });
    await cp(source, destination, { recursive: true });
    await normalizeGeneratedFiles(skillName, destination, ownerName);
  }
}

async function removeTopLevelGeneratedSkills() {
  for (const entry of await readdir(skillsRoot, { withFileTypes: true })) {
    if (entry.isDirectory() && entry.name.startsWith("elements-")) {
      await rm(path.join(skillsRoot, entry.name), { recursive: true, force: true });
    }
  }
}

try {
  runContextInstall();
  await removeTopLevelGeneratedSkills();

  for (const [ownerName, skillNames] of Object.entries(resourceBundles)) {
    await refreshBundle(ownerName, skillNames);
  }

  await rm(path.join(skillsRoot, "harbor-context.manifest.json"), { force: true });
  console.log("Updated package-generated Elements resources under the repository skill wrappers.");
} finally {
  await rm(temporaryRoot, { recursive: true, force: true });
}
