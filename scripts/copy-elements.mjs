import { cp, rm } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const source = new URL("../vendor/harbor-elements/dist/harbor-elements/", import.meta.url);
const destination = new URL("../public/harbor-elements/", import.meta.url);

await rm(destination, { recursive: true, force: true });
await cp(source, destination, { recursive: true });
console.log(`Copied cached Elements assets to ${fileURLToPath(destination)}`);
