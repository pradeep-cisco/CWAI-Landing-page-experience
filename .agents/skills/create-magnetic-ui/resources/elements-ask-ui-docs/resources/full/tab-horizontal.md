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

## API Reference

### Props
`active`: Set to true to draw the tab in an active state. (boolean)
`aria`: Attributes related to screen readers. ({ role?: string; labelledby?: string; describedby?: string; })
`ariahidden`: aria-hidden (boolean | string)
`arialabelledby`: deprecated (string)
`ariarole`: role (string)
`closable`: When true, the tab will be rendered with a close icon. (boolean)
`collapsed`: collapsed state (boolean)
`disabled`: Set to true to draw the tab in a disabled state. (boolean)
`focusEvent`: If the tab -> active by focus, not mouse event (boolean)
`hover`: Used to notify that tab-popover opened (boolean)
`name`: The name of the tab (string)
`nav`: It's deprecated since v2.0.0. the Global side nav tab (boolean)
`nested`: nested tab (boolean)
`panel`: The name of the tab panel the tab will control. The panel must be located in the same tab group. (string)
`popOver`: reflect: false so it doesn't collide with the popover attribute, https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/popover (boolean)
`sentiment`: The tabs's color sentiment. (any)
`vertical`: vertical tab (boolean)

### Methods
`removeFocus()`
`setFocus()`
`setTabindex()`

### Events
`hbr-active`: Emitted when the tab is activated.
`hbr-click`: Emitted to handle uncontrolled component use cases
`hbr-close`: Emitted when the tab is closable and the close button is activated.

### Slots
`[default]`: The tab's content.
`label`: The tab's label
`prefix`: tab's prefix
`suffix`: tab's suffix

### Custom CSS Properties
--active-background-color: background color of a selected tab
--active-color: active state tab color
--border-radius: roundness
--color: Color of tab label text
--focus-color: focus color
--focus-ring: The focus ring's box shadow.
--font-size: label font size
--font-weight: label font weight
--font-weight-active: label font weight when selected
--height: Tab's height
--hover-color: hover state tab color
--indicator-color: indicator background color
--indicator-hover-color: indicator background color on hover
--letter-spacing: label letter spacing
--line-height: label line height
--margin-right: margin right of label
--padding: spacing around the tab
--prefix-margin-right: margin right of prefix slot
--suffix-margin-left: margin left of suffix slot
--width: Tab's width

### Parts
`base`: The component's base wrapper.
`close-button`: The close button, which is the icon button's base wrapper.
`indicator`
`label`
`menu`: part that renders the menu slot
`menu-indicator`
`prefix`
`suffix`