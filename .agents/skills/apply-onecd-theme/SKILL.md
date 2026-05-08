---
name: apply-onecd-theme
description: Explicit opt-in for applying One Cisco Design (OneCD) to this React @harbor/elements autoloading app, and the downstream reference workflow for create-magnetic-ui when OneCD is already applied. Use when the user invokes $apply-onecd-theme, names apply-onecd-theme, directly asks to apply OneCD, or when create-magnetic-ui detects this repo already has OneCD applied and needs to generate OneCD-compliant UI. Do not apply OneCD implicitly to an unthemed repo.
---

# Apply OneCD Theme

This repository keeps OneCD disabled until this skill is explicitly invoked. After OneCD has been applied, `create-magnetic-ui` may use this skill as a downstream reference so new frontend code stays compliant with the existing OneCD setup.

## Invocation Modes

- **Apply mode**: Use when the user explicitly asks to apply OneCD or invokes `$apply-onecd-theme`. Make the app code changes in the workflow below.
- **Reference mode**: Use when `create-magnetic-ui` detects OneCD is already applied. Do not re-apply the shell or bootstrap setup. Use the Core Rules and Scope Rules to generate or edit UI that fits the existing OneCD implementation.
- **Question mode**: If the user only asks whether the skill exists or how it works, explain the opt-in behavior and do not edit app files.

## Preflight

Before editing in apply mode, confirm all of these are true:

- `package.json` has React and `@harbor/elements`.
- A Harbor loader calls `bootstrap(...)` from `@harbor/elements` or the Harbor autoloading bundle. In this repo it is usually `src/components/root/magnetic-web-loader.jsx`.
- Harbor assets are copied or served from `@harbor/elements/dist/harbor-elements`, commonly into `public/harbor-elements`.
- The React root imports the Harbor loader before rendering `hbr-*` components. In this repo, `src/components/root/root.jsx` imports `./magnetic-web-loader`.
- OneCD CSS assets exist under `public/harbor-elements/styles/themes/onecd*.css`, or will exist after the repo's `copy-elements` script runs.

If any check fails, stop and say this skill is only for React Harbor autoloading setups.

## Detection For Reference Mode

Treat OneCD as already applied when the repo has the bootstrap flags enabled and the app-level theme shell markers:

- `injectOneCDTokens: true`, `injectOneCDDarkTokens: true`, `injectOneCDTheme: true`, and `injectOneCDDarkTheme: true` in the Harbor loader.
- `<body data-theme="onecd">` in `index.html`.
- `hbr-css__base-bg-gradient-layer` and `hbr-css__glow-layer` in the shell scroll container.

If signals are partial, preserve the existing pattern and do not broaden OneCD application unless the user explicitly asks.

## Core Rules

- Preserve existing app layout and user changes.
- Do not apply OneCD during ordinary Magnetic UI generation in an unthemed repo.
- Enable OneCD CSS injection in the Harbor loader only in apply mode.
- In reference mode, assume the shell/theme infrastructure already exists and only make generated or touched UI compliant.
- Scope OneCD from the app body with `<body data-theme="onecd">` so supported OneCD Harbor components inherit the same theme island from the composed HTML.
- Do not add `data-theme="onecd"` to individual components in this repo. The body owns OneCD scope for the starter shell.
- Preserve existing dark mode behavior. Dark mode should activate by setting `hbr-mode-dark` on the body tag; do not mirror `hbr-mode-dark` onto individual Harbor components or React wrapper nodes.

Supported OneCD components:

- `hbr-shell-header`
- `hbr-shell-nav`
- `hbr-card[container]`
- `hbr-global-search`
- `hbr-modal`
- `hbr-tooltip`
- `hbr-popover`
- `hbr-drawer`

## Scope Rules For Generated UI

When generating new frontend code in an already OneCD-themed repo:

- Use the normal Magnetic component docs for component APIs.
- Do not add per-component `data-theme="onecd"` or `hbr-mode-dark` attributes. The composed HTML body owns OneCD scope and dark mode.
- Keep Harbor components unchanged unless the component API or page behavior requires otherwise.
- Prefer existing OneCD shell classes and scroll behavior over inventing new wrappers.
- Do not add the OneCD glow layer, root class, or bootstrap flags from page-level feature work if they already exist in the shell.

## Apply Mode Workflow

1. Enable OneCD bootstrap injection in the Harbor loader.

   In `src/components/root/magnetic-web-loader.jsx`, set the OneCD flags to `true` inside the existing `bootstrap({ ... })` call:

   ```js
   bootstrap({
     // existing options...
     injectOneCDTokens: true,
     injectOneCDDarkTokens: true,
     injectOneCDTheme: true,
     injectOneCDDarkTheme: true,
   });
   ```

2. Apply the reference app's shell treatment unless the user asks for a narrower island-only application.

   Body:

   - In `index.html`, set the body tag to `<body data-theme="onecd">`.
   - Dark mode should be controlled only by adding/removing `hbr-mode-dark` on `document.body`.
   - Do not mirror `data-theme` or `hbr-mode-dark` to individual components.

   Header:

   - In `src/components/shell/header.jsx`, add `className="n-header"` to the header wrapper.
   - Do not add `data-theme="onecd"` to `hbr-shell-header`; body owns the theme scope.

   Nav:

   - In `src/components/shell/nav.jsx`, import `./nav.css`.
   - Set the wrapper to `<nav className="shell__nav">`.
   - Do not add `data-theme="onecd"` to `hbr-shell-nav`; body owns the theme scope.
   - If `src/components/shell/nav.css` does not exist, create it:

   ```css
   .shell__nav {
     padding-top: var(--hbr-app-shift-top, 56px);
   }
   ```

   Main shell:

   - In `src/components/shell/shell.css`, make the header fixed and make the content scroll container account for the header offset:

   ```css
   .n-header {
     position: fixed;
     inset: 0 0 auto 0;
     z-index: var(--hbr-z-index-header, 1000);
   }

   .n-container {
     min-height: 100vh;
     height: 100vh;
   }

   .n-content {
     position: relative;
     min-height: 100vh;
     height: 100vh;
     padding: var(--hbr-app-shift-top, 0px) 36px 0 24px;
   }
   ```

3. Add OneCD scroll behavior when using the full shell treatment.

   In `src/components/shell/shell.jsx`, use `useCallback` and keep the glow layer aligned while scrolling:

   ```jsx
   const handleOneCdScroll = useCallback((event) => {
     const target = event.currentTarget;
     const header = document.querySelector("hbr-shell-header");
     const glowLayer = target.querySelector(".hbr-css__glow-layer");

     if (target.scrollTop > 160) {
       header?.classList.add("scrolled");
     } else {
       header?.classList.remove("scrolled");
     }

     if (glowLayer) {
       glowLayer.style.top = `-${target.scrollTop}px`;
     }
   }, []);
   ```

   Then set the root and main markup like the reference app:

   ```jsx
   <div className={`n-root ${navCollapsed ? "navCollapsed" : ""}`}>
     ...
     <main
       className="n-content hbr-css__base-bg-gradient-layer"
       onScroll={handleOneCdScroll}
     >
       <div className="hbr-css__glow-layer" aria-hidden="true" />
       ...
     </main>
   </div>
   ```

   If the user asks for island-only OneCD, skip the body class, gradient class, glow layer, and scroll handler.

4. Keep page and feature components body-scoped.

   Do not add OneCD theme attributes to individual components:

   ```jsx
   <hbr-shell-header />
   <hbr-shell-nav />
   <hbr-card container />
   ```

5. Verify.

   Search supported OneCD components and confirm theme ownership remains on the body:

   ```bash
   rg "hbr-(shell-header|shell-nav|card|global-search|modal|tooltip|popover|drawer)" src
   rg 'data-theme="onecd"|hbr-mode-dark' index.html src
   ```

   Run the repo's normal build command:

   ```bash
   npm run build
   ```

   If the user asks to view it, start the dev server. Otherwise, do not leave a long-running server running.
