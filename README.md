# Magnetic Boilerplate

A bare-bones starter for building React UIs with the Cisco Magnetic
design system. Includes:

- React 19
- Vite 8
- [Harbor Elements](https://magnetic-web.cisco.com/) (web components,
  `<hbr-*>`) from the internal `@harbor/elements` package
- React Router 7
- ESLint
- A `.agents/skills/create-magnetic-ui` skill that teaches agents
  (Cursor, Claude Code, etc.) how to use Magnetic components

## Prerequisites

- **Node.js 20+** (latest LTS recommended).
- **Cisco network access.** `@harbor/*` packages are served from
  Cisco's internal Nexus registry; `npm install` will fail without
  VPN or office network.
- **Cisco internal CA trusted by Node.** If `npm install` fails with a
  TLS error like `unable to verify the first certificate`, your machine
  is missing the Cisco root + intermediate CA. See `.npmrc` in this
  repo for one-time setup instructions — do **not** disable TLS
  verification with `strict-ssl=false`.

## Quick start

Keep the canonical repository configured as `upstream` so the
`$setup-boilerplate` skill can update from `upstream/main`. The skill
also disables pushes to the canonical repository so local prototype work
is not accidentally pushed upstream.

```bash
git remote add upstream https://wwwin-github.cisco.com/kabimany/magnetic-boilerplate
```

```bash
pnpm install
pnpm dev
```

Opens at <http://localhost:5173/> with hot reload. Edit
`src/pages/home/home.jsx` and save — the browser refreshes
automatically.

## Project layout

| Path | Purpose |
|------|---------|
| `src/pages/home/home.jsx` | Home page — start editing here. |
| `src/components/shell/` | App shell (header, nav, footer). |
| `src/router.jsx` | Route definitions. |
| `src/main.jsx` | App entry point. |
| `public/harbor-elements/` | Vendored Harbor Elements assets, regenerated on every install/build from `node_modules/@harbor/elements`. Not committed; safe to delete. |
| `.agents/skills/create-magnetic-ui/SKILL.md` | Instructions for AI coding assistants on how to use Magnetic components in this repo. |

## Available scripts

| Command | What it does |
|---------|--------------|
| `pnpm dev` | Copies the Harbor Elements assets into `public/`, then starts the Vite dev server. |
| `pnpm build` | Copies the Harbor Elements assets, then builds to `dist/`. |
| `pnpm preview` | Serves the built `dist/` for local sanity checks. |
| `pnpm copy-elements` | Manually re-copy Harbor Elements from `node_modules/` into `public/` (also run automatically by `dev` and `build`). |
| `pnpm context:update` | Regenerates the package-managed Elements skill resources and Magnetic component map. |

## Generating UI with an AI assistant

Open this repo in Cursor (or any agent that reads `.agents/skills/`),
and the `create-magnetic-ui` skill activates automatically for
frontend tasks. Try:

```
Generate a network health dashboard for this app.
```

The `create-magnetic-ui` skill is a repository adapter for the canonical
`elements-generate-ui` skill. Update `@harbor/context`, then run:

```bash
pnpm context:update
```

The command generates the canonical Elements skills and their resources under
`.agents/skills/create-magnetic-ui/resources/`. This includes the
Magnetic-to-Harbor component map and Figma layout guidance. The
`setup-boilerplate` routes to its package-generated Elements setup resource.
Other `elements-*` skills are not exposed as top-level repository skills. The
generated resource bundles are managed by `@harbor/context` and tracked in
Git.

For paste-from-Figma workflows, see
<https://magnetic-web.cisco.com/docs/ai/guides/code-generation>.

## Forking / using as a template

This repo is intended to be copied (or scaffolded via tooling like the
`create-app` skill at
<https://wwwin-github.cisco.com/holger-experiments/agentic-ux>). After
copying, you'll typically want to:

1. Rename `name` in `package.json` to your project's name.
2. Update this README to describe your specific app.
3. Add a `LICENSE` file appropriate to your project (see
   `LICENSE` in this repo for the placeholder used in the upstream).

The legacy step-by-step setup guide that used to live in this README
(for users receiving the project as a zip handoff) has been moved to
[`docs/legacy-setup-guide.md`](docs/legacy-setup-guide.md).
