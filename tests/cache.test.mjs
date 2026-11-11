import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const root = new URL("../", import.meta.url);
const json = async file => JSON.parse(await readFile(new URL(file, root), "utf8"));

test("normal installation has no private Harbor packages or registry references", async () => {
  const manifest = await json("package.json");
  const dependencies = Object.keys({ ...manifest.dependencies, ...manifest.devDependencies });
  assert.equal(dependencies.some(name => /^@harbor(?:-charts)?\//.test(name)), false);
  for (const file of ["package-lock.json", "pnpm-lock.yaml"]) {
    const content = await readFile(new URL(file, root), "utf8");
    assert.equal(/@harbor(?:-charts)?[\/+]|nexus\.|tesseractinternal/i.test(content), false, `${file} contains a private dependency or registry`);
  }
});

test("cached runtime provenance and its public Stencil dependency agree", async () => {
  const [manifest, versions, elements] = await Promise.all([
    json("package.json"), json("vendor/versions.json"), json("vendor/harbor-elements/package.json"),
  ]);
  assert.equal(versions["@harbor/elements"], elements.version);
  assert.equal(versions["@stencil/core"], manifest.dependencies["@stencil/core"]);
});
