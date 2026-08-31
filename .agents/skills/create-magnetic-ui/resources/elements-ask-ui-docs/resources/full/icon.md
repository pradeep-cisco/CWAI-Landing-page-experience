# Icon

Icon is implemented using the web component: <hbr-icon>.

## Description
Visual symbol representing an action, object, state, or status.

## Generation Guidance
- Do not skip or assume you know the Selection Workflow or Implementation Rules sections below or else you will write broken code and incorrect harbor elements design

### Icon Name Selection Workflow
- workflow for implementing hbr-icon (`<hbr-icon name="">`) correctly
1. Determine semantic role: status | navigation | device | action
2. Read `icons-magnetic.md` for exact icons names:
    - **IMPORTANT:** Only use icons that are explicitly listed in `icons-magnetic.md` or `icons-phosphor.md`. Using non-existent icon names will cause rendering failures.
3. Choose the closest icon based on the list, if there are no exact matches, skip to step 4:
   1. **Navigation Icons:** Only use Magnetic `nav-*` icons (e.g., `nav-home`, `nav-network-devices`)
   2. **Status Icons:** Use Magnetic `status-*` icons (e.g., `status-positive`, `status-warning`)
   3. **Device Icons:** Use Magnetic `device-*` icons (e.g., `device-camera`, `device-mx`)
4. Open `icons-phosphor.md` ONLY if no Magnetic equivalent exists
5. **Fallback:** If no suitable icon exists, use the closest icon, or use `nav-placeholder` or `placeholder`

### Icon Implementation Rules:
- **IMPORTANT:** Only use navigation icons (`nav-*` eg. `nav-home`, `nav-network-devices` ) inside the app shell (ie. app header, footer, navigation/sidebar). Never use them inside page content (ie. cards, tables, dashboards, forms, etc.).
- **IMPORTANT:** ALWAYS use sentiment colors while using status icons (see below for proper usage)
- **ALWAYS verify icon names** in the documentation before using them
- **NEVER use non-existent icons** - the component will fail to render
- Failure to comply with the rules will result in incorrect styling inconsistent with Harbor Elements

### Accessibility
Add aria-label for icon-only buttons/controls. Omit aria-label if text label already present (avoid redundancy). Status icons inside labeled regions may be treated as decorative.

### Status Icon Usage (status-* icon with sentiment):
```jsx
<hbr-icon name="status-positive" sentiment="positive" />
<hbr-icon name="status-excellent" sentiment="excellent"></hbr-icon>
<hbr-icon name="status-disabled" sentiment="dormant"></hbr-icon>
<hbr-icon name="status-dormant" ></hbr-icon>
<hbr-icon name="status-in-progress" sentiment="in-progress"></hbr-icon>
<hbr-icon name="status-info-square" sentiment="info"></hbr-icon>
<hbr-icon name="status-low-warning" sentiment="low-warning"></hbr-icon>
<hbr-icon name="status-negative" sentiment="negative"></hbr-icon>
<hbr-icon name="status-positive" sentiment="positive"></hbr-icon>
<hbr-icon name="status-severe-warning" sentiment="severe-warning"></hbr-icon>
<hbr-icon name="status-warning" sentiment="warning"></hbr-icon>
```

## Usage
```jsx
export default function Icon() {
	return <hbr-icon name="file-csv" label="Download Data" />;
}

```

## API Reference

### Props
`asset`: Raw svg source code as string ((() => string) | string)
`colors`: A list of Colors for the paths (string[])
`fetchOptions`: Options to pass to the fetch request when fetching the icon from a URL. since 2.13.5 ({})
`height`: Height of the icon, takes priority over size and css font-size. Set this prop when width and height are not same. (string)
`label`: An alternative description to use for accessibility. If omitted, the name or src will be used to generate it. (string)
`library`: The name of a registered custom icon library. (string)
`name`: The name of the icon to draw. (string)
`sentiment`: The icons's sentiment. (string)
`size`: Size of the icon, by default icons are sized relative to the current font size (string)
`src`: An external URL of an SVG file. (string)
`staticColors`: Retain static colors hardcoded in the svg file instead of replacing them with css properties by default (boolean)
`width`: Width of the icon, takes priority over size and css font-size. Set this prop when width and height are not same. (string)

### Events
`hbr-error`: Emitted when the icon failed to load.
`hbr-load`: Emitted when the icon has loaded.

### Custom CSS Properties
--path-color-[i]: Color applied as fill to the i path in a multi-tone icon.
--path-color-contrast: Color of icon path within a emphasized background
--path-secondary-color: Color applied as fill to the secondary path in a dual-tone icon. Set this css property at a parent level to set the secondary-color for all icons contained by that parent.

### Parts
`base`: The component's base wrapper.