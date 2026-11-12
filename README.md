# Magnetic Boilerplate

A React 19 + Vite 8 starter using cached Cisco Magnetic / Harbor Elements web
components. This branch installs all npm dependencies from the public registry.
Elements runtime assets, module imports, and agent context ship as committed
snapshots. Main keeps its existing agent usage reporting, which targets internal
Harbor services; package installation and builds do not require those services.

## Branches

All three branches use committed Elements and Context snapshots:

| Branch | UI profile | Agent reporting |
|--------|------------|-----------------|
| `main` | Full Magnetic 2.0, Original, and Cloud Control presets | Retained |
| `external` | Full appearance presets | Removed |
| `wireframe` | oneCD only, grayscale, sharp corners | Removed |

## Quick start

Use Node.js 22.12+ (or 20.19+) and pnpm:

```bash
pnpm install --frozen-lockfile
pnpm dev
```

Or use npm:

```bash
npm ci
npm run dev
```

Open <http://localhost:5173/>. Edit `src/pages/home/home.jsx` to get started.
Installation still needs the public npm registry (or a populated local cache).
No Cisco VPN, private registry credentials, or internal CA is required for the
package install, development server, or production build.

## Cached Elements and context

| Path | Purpose |
|------|---------|
| `vendor/harbor-elements/` | Committed Elements runtime, component modules, utilities, and icons. |
| `vendor/versions.json` | Package versions used to generate the snapshots. |
| `public/harbor-elements/` | Generated runtime assets copied from `vendor/` by dev/build; ignored by Git. |
| `.agents/skills/create-magnetic-ui/` | Agent instructions and cached component docs for UI generation. |
| `.agents/skills/setup-boilerplate/` | Repository setup instructions and cached installation-profile reference. |
| `src/components/root/magnetic-web-loader.jsx` | Elements bootstrap and local runtime asset path. |
| `vite.config.js` | Resolves `@harbor/elements` imports to the committed vendor snapshot. |

Keep using documented imports such as `@harbor/elements` and
`@harbor/elements/dom-table` in app code. Vite resolves them locally; they are not
npm dependencies. `@stencil/core` is a public dependency required by the cached
component modules. The React custom-element/autoloading profile is unchanged.

Keep `vendor/` and the generated skill resources in Git so a fresh clone or zip
includes them. `node_modules/`, `public/`, and `dist/` stay ignored. Do not delete
`vendor/` as part of cleaning dependencies.

## Scripts

| Command | What it does |
|---------|--------------|
| `pnpm dev` | Copies cached runtime assets and starts Vite. |
| `pnpm build` | Copies cached runtime assets and builds `dist/`. |
| `pnpm preview` | Serves the built app. |
| `pnpm copy-elements` | Recreates `public/harbor-elements/` from the committed snapshot. |
| `pnpm test` | Checks cache consistency, public-only dependency locks, and the existing reporting contracts. |
| `pnpm vendor:update -- /path/to/internal-install/node_modules` | Maintainer-only refresh of both cached Elements and context. |
| `pnpm context:update -- /path/to/internal-install/node_modules/@harbor/context` | Maintainer-only refresh of Context resources. |

## Refreshing snapshots (maintainers)

Normal users never need this step. On an internal machine, install the desired
Harbor versions into a separate temporary folder, then pass its `node_modules`
to the update script. For example, to reproduce the current snapshot:

```bash
cache_install="$(mktemp -d)"
npm install --prefix "$cache_install" --ignore-scripts --no-audit --no-fund \
  --registry=https://registry.npmjs.org/ \
  --@harbor:registry=https://nexus.tesseractinternal.com/repository/dfly-npm-group \
  @harbor/elements@2.19.7 @harbor/context@0.2.13
npm run vendor:update -- "$cache_install/node_modules"
rm -rf -- "$cache_install"
npm test
npm run build
```

Use the usual trusted Cisco CA configuration on the internal machine. Keep
credentials in your user configuration. The temporary install is separate from
this project's manifest and lockfiles. An existing internal project's installed
`node_modules` works too.

The update command copies the required Elements modules and assets, regenerates
context for React custom elements with autoloading, and records package versions.
Main retains generated reporting instructions and helpers; the external and
wireframe refresh commands strip them. Installed source packages are left
untouched. The snapshot includes
`dist/docs.json` and `dist/types/components.d.ts` as agent API references; source
maps and other type declarations are omitted.

If Elements changes its required `@stencil/core` version, first update that public
dependency and both lockfiles. The script checks that the versions match. Review
and commit `vendor/`, `.agents/skills/`, and any lockfile changes together. Refresh
snapshots as needed. All branches use cached dependencies; preserve each branch's
theme profile and reporting policy when carrying updates between them.

## Generating UI with an agent

Open this folder in an editor that reads `.agents/skills/` and ask, for example:

```text
Generate a network health dashboard for this app.
```

The `create-magnetic-ui` skill uses the bundled component map, design guidance,
and component docs. Context updates are a maintainer task. The setup skill uses
`upstream/main` from the canonical CTO repository,
`https://cto-github.cisco.com/magnetic/boilerplate-web`. Preserve local work and
check the configured remotes before running a Git update. External and wireframe
setup workflows require an explicitly selected distribution source when updating.

## GitHub Pages

The existing publishing command remains available for maintainers who have
access to the CTO repository:

```bash
npm run deploy:pages -- git@cto-github.cisco.com:magnetic/boilerplate-web.git
```

It builds from the cached snapshot and publishes `dist/` to `gh-pages` with the
base path `/pages/magnetic/boilerplate-web/`. Other hosting environments can build
with their own `VITE_BASE_PATH` and deploy `dist/`.

### Protohost previews

Protohost exposes the app at `/preview/<slug>/` and serves the build's files
from `/preview-assets/<version>/`. Routing resolves the visible preview mount
separately from Vite's asset base so the preview opens the Crosswork AI dashboard
and its Home, Admin, and Incidents links stay within that preview. Local routes
and conventional deployments retain their existing behavior.

For other hosts with separate app and asset paths, set `VITE_ROUTER_BASE_PATH`
to the app's path when building. `VITE_BASE_PATH` continues to control asset URLs.

## Using as a template

Rename `name` in `package.json`, update this README, and choose an appropriate
license for your project. Preserve the committed snapshots when distributing a
clone or zip. The older editor setup walkthrough is in
[`docs/legacy-setup-guide.md`](docs/legacy-setup-guide.md).
