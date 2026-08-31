# Tab Horizontal

Tab Horizontal is implemented using the web component: <hbr-tab>.

## Description
Horizontal tab trigger controlling an associated panel.

## Generation Guidance
These rules govern generation of badges using <hbr-tab>.

## Primary vs. Secondary Tabs
- **Primary Tabs:** Use for main navigation within a view or section. Typically placed at the top. Denoted with the "primary" attribute on <hbr-tab-group>.
- **Secondary Tabs:** Use for sub-navigation within a primary tab's content area.

## Tab Structure
- Tabs with Secondary Tabs must place the tab group and panels within a container card such as <hbr-card container={true}>. Refer to `container-card.md` for more details

## Active and Disabled States
- Use the "active" attribute on <hbr-tab> to indicate the currently selected tab.
- Use the "disabled" attribute on <hbr-tab> to make a tab non-interactive.

## Usage
```jsx
export default function TabHorizontal() {
	return (
		<div>
			{/* Primary Tabs */}
			<hbr-tab-group primary>
				<hbr-tab slot="nav" panel="general" active={true}>
					General
				</hbr-tab>
				<hbr-tab slot="nav" panel="custom">
					Custom
				</hbr-tab>
				<hbr-tab slot="nav" panel="disabled" disabled>
					Disabled
				</hbr-tab>

				{/** Render tab panels for each tab or listen to click events and render only the view based on selected tab, in which case the "panel" prop is not required */}

				<hbr-tab-panel name="general">
					{/* Secondary Tabs */}
					<hbr-card style={{ width: "480px" }} container={true}>
						<hbr-tab-group>
							<hbr-tab slot="nav" panel="general" active={true}>
								General
							</hbr-tab>
							<hbr-tab slot="nav" panel="custom">
								Custom
							</hbr-tab>
							<hbr-tab slot="nav" panel="disabled" disabled>
								Disabled
							</hbr-tab>
							<hbr-tab-panel name="general"></hbr-tab-panel>
							<hbr-tab-panel name="custom"></hbr-tab-panel>
							<hbr-tab-panel name="disabled"></hbr-tab-panel>
						</hbr-tab-group>
					</hbr-card>
				</hbr-tab-panel>
				<hbr-tab-panel name="custom">
					This is the custom tab panel.
				</hbr-tab-panel>

				<hbr-tab-panel name="disabled">
					This is a disabled tab panel.
				</hbr-tab-panel>
			</hbr-tab-group>
			<style>
				{`
          /** TEMPLATE STRING STYLES NOT RECOMMENDED - FOR SAMPLE ONLY **/
          hbr-tab-panel {
            padding-top: var(--hbr-spacing-lg);
          }
        `}
			</style>
		</div>
	);
}

```