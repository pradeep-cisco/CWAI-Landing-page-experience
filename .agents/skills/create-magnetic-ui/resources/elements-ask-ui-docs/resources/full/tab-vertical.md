# Tab Vertical

Tab Vertical is implemented using the web component: <hbr-tab-vertical>.

## Description
Vertical tab container coordinating tab navigation and panels.

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
export default function Component() {
	return (
		<div>
			<hbr-tab-vertical arialabel="basic">
				<hbr-tab vertical panel="tab_1">
					Tab 1
				</hbr-tab>
				<hbr-tab vertical panel="tab_2" active={true}>
					Tab 2
				</hbr-tab>
				<hbr-tab vertical panel="tab_3">
					Tab 3
				</hbr-tab>
				<hbr-tab vertical panel="tab_4">
					Tab 4
				</hbr-tab>
				<hbr-tab vertical panel="tab_5">
					Tab 5
				</hbr-tab>
				<hbr-tab vertical panel="tab_6">
					Tab 6
				</hbr-tab>
				<hbr-tab vertical panel="tab_7">
					Tab 7
				</hbr-tab>
				<hbr-tab vertical panel="tab_8">
					Tab 8
				</hbr-tab>
				<hbr-tab vertical panel="tab_9">
					Tab 9
				</hbr-tab>
				<hbr-tab vertical panel="tab_10" sentiment="warning">
					Tab 10
				</hbr-tab>
				<hbr-tab vertical panel="disabled" disabled>
					Disabled
				</hbr-tab>
				<hbr-tab vertical panel="last">
					Last
				</hbr-tab>

				<hbr-tab-panel slot="content" name="tab_1">
					This is the Tab 1 panel.
				</hbr-tab-panel>
				<hbr-tab-panel slot="content" name="tab_2">
					This is the Tab 2 panel.
				</hbr-tab-panel>
				<hbr-tab-panel slot="content" name="tab_3">
					This is the Tab 3 panel.
				</hbr-tab-panel>
				<hbr-tab-panel slot="content" name="tab_4">
					This is the Tab 4 panel.
				</hbr-tab-panel>
				<hbr-tab-panel slot="content" name="tab_5">
					This is the Tab 5 panel.
				</hbr-tab-panel>
				<hbr-tab-panel slot="content" name="tab_6">
					This is the Tab 6 panel.
				</hbr-tab-panel>
				<hbr-tab-panel slot="content" name="tab_7">
					This is the Tab 7 panel.
				</hbr-tab-panel>
				<hbr-tab-panel slot="content" name="tab_8">
					This is the Tab 8 panel.
				</hbr-tab-panel>
				<hbr-tab-panel slot="content" name="tab_9">
					This is a Tab 9 panel.
				</hbr-tab-panel>
				<hbr-tab-panel slot="content" name="tab_10">
					This is the Tab 10 panel.
				</hbr-tab-panel>
				<hbr-tab-panel slot="content" name="disabled">
					This is a disabled tab panel.
				</hbr-tab-panel>
				<hbr-tab-panel slot="content" name="last">
					This is the Last tab panel.
				</hbr-tab-panel>
			</hbr-tab-vertical>
			<style>
				{`
          /** TEMPLATE STRING STYLES NOT RECOMMENDED - FOR SAMPLE ONLY **/
          hbr-tab-panel {
            padding: var(--hbr-spacing-lg);
          }
        `}
			</style>
		</div>
	);
}

```

## API Reference

### Props
`aria`: Attributes related to screen readers. ({ role?: string; label?: string; })
`arialabel`: arialabel (boolean | string)
`ariarole`: role (string)
`border`: Enable tab border (boolean)
`collapsable`: Enables and shows the collapse button (boolean)
`collapsed`: Vertical tabs in collapsed state (boolean)
`maxWidth`: Maximum allowed width when resizing (number)
`minWidth`: Minimum allowed width when resizing (number)
`navigation`:  (boolean)
`resizable`: Enables drag resizing (boolean)
`responsive`:  (boolean)
`sentiment`:  (string)
`uncontrolled`: make this component uncontrolled (boolean)
`variant`:  ("" | "nested" | "tab")
`width`: Current width applied to the component (number)

### Methods
`getTabFolds()`
`getTabs()`
`show()`

### Events
`hbr-tab-hide`: Emitted when a tab is hidden.
`hbr-tab-show`: Emitted when a tab is shown.

### Slots
`[default]`: Used for grouping tab panels in the tab group.
`nav`: Used for grouping tabs in the tab group.

### Custom CSS Properties
--min-width: Preventing it from becoming narrower than the specified value.

### Parts
`active-tab-indicator`: An element that displays the currently selected tab. This is a child of the tabs container.
`base`: The component's base wrapper.
`body`: The tab group body where tab panels are slotted in.
`border`
`nav`: The tab group navigation container.
`nav-container`
`panel`
`prefix`
`suffix`
`tabs`: The container that wraps the slotted tabs.