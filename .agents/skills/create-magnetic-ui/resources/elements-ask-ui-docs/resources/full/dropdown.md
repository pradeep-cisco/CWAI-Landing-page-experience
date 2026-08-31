# Dropdown

Dropdown is implemented using the web component: <hbr-dropdown>.

## Description
Trigger and panel pattern for choosing an action or option list.

## Usage
```jsx
import { useState } from "react";

export default function Dropdown() {
	const [trigger, setTrigger] = useState("Select a dessert");
	const [triggerValue, setTriggerValue] = useState("");
	const [multiTriggerDropdownValue, setMultiTriggerDropdownValue] = useState([
		"Flan",
		"Frozen Yogurt",
	]);
	const [multiTriggerButtonValue, setMultiTriggerButtonValue] =
		useState("Desserts");
	const handleSelect = (e) => {
		console.log("dropdown.value: ", e.detail.item.value);
	};
	const handleTriggerSelect = (e) => {
		setTrigger(e.detail.item.value);
		setTriggerValue(e.detail.item.value);
	};
	const handleMultiTriggerSelect = (e) => {
		let trigger;
		const value = e.target.value;
		if (value.length > 1) {
			trigger = `${value.length} selected`;
		} else if (value.length === 1) {
			trigger = value[0];
		} else {
			trigger = "Deserts";
		}
		console.log("dropdown.value: ", e, value);
		setMultiTriggerButtonValue(trigger);
		setMultiTriggerDropdownValue(value);
	};
	return (
		<>
			<hbr-dropdown menu>
				<hbr-button slot="trigger" variant="outline" caret>
					Dropdown
				</hbr-button>
				<hbr-menu onhbr-select={handleSelect}>
					<hbr-menu-item value="1">Dropdown Item 1</hbr-menu-item>
					<hbr-menu-item value="2">Dropdown Item 2</hbr-menu-item>
				</hbr-menu>
			</hbr-dropdown>
			<hbr-dropdown menu>
				<hbr-button slot="trigger" caret>
					Dropdown
				</hbr-button>
				<hbr-menu onhbr-select={handleSelect}>
					<hbr-menu-item value="1">Dropdown Item 1</hbr-menu-item>
					<hbr-menu-item value="2">Dropdown Item 2</hbr-menu-item>
				</hbr-menu>
			</hbr-dropdown>
			<hbr-dropdown menu>
				<hbr-button slot="trigger" variant="text" caret>
					Dropdown
				</hbr-button>
				<hbr-menu onhbr-select={handleSelect}>
					<hbr-menu-item value="1">Dropdown Item 1</hbr-menu-item>
					<hbr-menu-item value="2">Dropdown Item 2</hbr-menu-item>
				</hbr-menu>
			</hbr-dropdown>
			<hbr-dropdown menu>
				<hbr-button slot="trigger" sentiment="negative" caret>
					Dropdown
				</hbr-button>
				<hbr-menu onhbr-select={handleSelect}>
					<hbr-menu-item value="1">Dropdown Item 1</hbr-menu-item>
					<hbr-menu-item value="2" disabled>
						Dropdown Item 2
					</hbr-menu-item>
					<hbr-menu-item value="3" sentiment="negative">
						Dropdown Item 3
					</hbr-menu-item>
					<hbr-menu-item value="4" sentiment="admin">
						Dropdown Item 4
					</hbr-menu-item>
				</hbr-menu>
			</hbr-dropdown>
			<hbr-dropdown menu disabled>
				<hbr-button slot="trigger" caret disabled>
					Dropdown
				</hbr-button>
				<hbr-menu onhbr-select={handleSelect}>
					<hbr-menu-item value="1">Dropdown Item 1</hbr-menu-item>
					<hbr-menu-item value="2">Dropdown Item 2</hbr-menu-item>
				</hbr-menu>
			</hbr-dropdown>
			<hbr-layout
				direction="row"
				gap="xl"
				align="start"
				style={{ height: "120px" }}
			>
				<hbr-dropdown menu open>
					<hbr-button slot="trigger" caret>
						Label
					</hbr-button>
					<hbr-menu onhbr-select={handleSelect}>
						<hbr-menu-item value="1">
							<hbr-icon slot="prefix" name="envelope-simple" />
							Option 1
						</hbr-menu-item>
						<hbr-menu-item value="2">
							<hbr-icon slot="prefix" name="envelope-simple" />
							Option 2
						</hbr-menu-item>
					</hbr-menu>
				</hbr-dropdown>
				<hbr-dropdown menu open size="small">
					<hbr-button slot="trigger" caret size="small">
						Label
					</hbr-button>
					<hbr-menu onhbr-select={handleSelect}>
						<hbr-menu-item value="1" size="small">
							<hbr-icon slot="prefix" name="envelope-simple" />
							Option 1
						</hbr-menu-item>
						<hbr-menu-item value="2" size="small">
							<hbr-icon slot="prefix" name="envelope-simple" />
							Option 2
						</hbr-menu-item>
					</hbr-menu>
				</hbr-dropdown>
			</hbr-layout>
			<hbr-dropdown>
				<hbr-button slot="trigger" variant="outline" caret>
					Label
				</hbr-button>
				<hbr-menu onhbr-select={handleSelect}>
					<hbr-menu-label>Group Title 1</hbr-menu-label>
					<hbr-menu-item value="1" size="small">
						Option 1
					</hbr-menu-item>
					<hbr-menu-item value="2" size="small">
						Option 2
					</hbr-menu-item>
					<hbr-menu-divider />
					<hbr-menu-label>Group Title 2</hbr-menu-label>
					<hbr-menu-item value="3" size="small">
						Option 3
					</hbr-menu-item>
					<hbr-menu-item value="4" size="small">
						Option 4
					</hbr-menu-item>
				</hbr-menu>
			</hbr-dropdown>

			<hbr-dropdown nested menu onhbr-select={handleSelect}>
				<hbr-button variant="text" slot="trigger" caret>
					Dropdown
				</hbr-button>
				<hbr-menu>
					<hbr-menu-item value="Option 1">Option 1</hbr-menu-item>
					<hbr-menu-item value="Option 2">Option 2</hbr-menu-item>
					<hbr-menu-item nested level="1">
						Submenu
						<hbr-icon slot="suffix" name="dropdown-caret-right" />
						<hbr-menu
							slot="nested"
							nested
							style={{ paddingRight: "8px", transform: "translateX(-200px)" }}
						>
							<hbr-menu-item value="Option 3">Option 3</hbr-menu-item>
							<hbr-menu-item value="Option 4">Option 4</hbr-menu-item>
						</hbr-menu>
					</hbr-menu-item>
				</hbr-menu>
			</hbr-dropdown>
			<hbr-dropdown
				value={triggerValue}
				menu
				onhbr-select={handleTriggerSelect}
			>
				<hbr-button slot="trigger" variant="text" caret>
					{trigger}
				</hbr-button>
				<hbr-menu>
					<hbr-menu-item value="Chocolate Pie">Chocolate Pie</hbr-menu-item>
					<hbr-menu-item value="Flan">Flan</hbr-menu-item>
					<hbr-menu-item value="Frozen Yogurt">Frozen Yogurt</hbr-menu-item>
					<hbr-menu-item value="Ice Cream">Ice Cream</hbr-menu-item>
					<hbr-menu-item disabled value="Mint Chocolate Chip Ice Cream">
						Mint Chocolate Chip Ice Cream
					</hbr-menu-item>
				</hbr-menu>
			</hbr-dropdown>
			<hbr-dropdown
				class="hbr-dropdown-sample"
				value={multiTriggerDropdownValue}
				hoist
				menu
				multiple
				closeonselect={false}
				onhbr-select={handleMultiTriggerSelect}
			>
				<hbr-button slot="trigger" variant="text" caret>
					{multiTriggerButtonValue}
				</hbr-button>
				<hbr-menu>
					<hbr-menu-item checkbox value="Chocolate Pie">
						<hbr-checkbox>Chocolate Pie</hbr-checkbox>
					</hbr-menu-item>
					<hbr-menu-item checkbox value="Flan">
						<hbr-checkbox>Flan</hbr-checkbox>
					</hbr-menu-item>
					<hbr-menu-item checkbox value="Frozen Yogurt">
						<hbr-checkbox>Frozen Yogurt</hbr-checkbox>
					</hbr-menu-item>
					<hbr-menu-item checkbox value="Ice Cream">
						<hbr-checkbox>Ice Cream</hbr-checkbox>
					</hbr-menu-item>
					<hbr-menu-item
						disabled
						checkbox
						value="Mint Chocolate Chip Ice Cream"
					>
						<hbr-checkbox>Mint Chocolate Chip Ice Cream</hbr-checkbox>
					</hbr-menu-item>
				</hbr-menu>
			</hbr-dropdown>
			<hbr-dropdown menu>
				<hbr-button slot="trigger" variant="text" caret>
					<hbr-icon name="clock" slot="prefix" />
					Dropdown
				</hbr-button>
				<hbr-menu>
					<hbr-menu-item value="1">Dropdown Item 1</hbr-menu-item>
					<hbr-menu-item value="2">Dropdown Item 2</hbr-menu-item>
					<hbr-menu-item value="3">Dropdown Item 3</hbr-menu-item>
				</hbr-menu>
			</hbr-dropdown>
			<hbr-dropdown menu>
				<hbr-button slot="trigger" variant="text">
					<hbr-icon name="more-horizontal" style={{ fontSize: "20px" }} />
				</hbr-button>
				<hbr-menu>
					<hbr-menu-item value="1">Dropdown Item 1</hbr-menu-item>
					<hbr-menu-item value="2">Dropdown Item 2</hbr-menu-item>
					<hbr-menu-item value="3">Dropdown Item 3</hbr-menu-item>
				</hbr-menu>
			</hbr-dropdown>
			{/* enable-popover uses HTML popover global attribute  */}
			<hbr-dropdown menu enable-popover>
				<hbr-button slot="trigger" variant="outline" caret>
					Dropdown
				</hbr-button>
				<hbr-menu>
					<hbr-menu-item value="1">Dropdown Item 1</hbr-menu-item>
					<hbr-menu-item value="2">Dropdown Item 2</hbr-menu-item>
				</hbr-menu>
			</hbr-dropdown>
		</>
	);
}

```

## API Reference

### Props
`anchor`: The element the dropdown will be anchored to. If the anchor is external, you can provide a reference to an element or CSS selector via this prop. If the anchor lives inside the popover, donot pass this prop (HTMLElement | string)
`autoSize`: When set, this will cause the popup to automatically resize itself to prevent it from overflowing. ("both" | "horizontal" | "off" | "vertical")
`autoSizePadding`: The amount of padding, in pixels, to exceed before the auto-size behavior will occur. (any)
`closeOnScroll`: close the menu when scroll (boolean)
`closeOnSelect`: Determines whether the dropdown should hide when a menu item is selected. (boolean)
`containingElement`: The dropdown will close when the user interacts outside of this element (e.g. clicking). (HTMLElement)
`contentId`: User assigned or self generated dropdown Id for reference (string)
`disabled`: Disables the dropdown so the panel will not open. (boolean)
`distance`: The distance in pixels from which to offset the panel away from its trigger. (number)
`enablePopover`: Enable the native popover feature so that it layers above all other elements, it needs hoist true, since 2.15.0 (boolean)
`flipBoundary`: The flip boundary describes clipping element(s) that overflow will be checked relative to when flipping. By
default, the boundary includes overflow ancestors that will cause the element to be clipped. If needed, you can
change the boundary by passing a reference to one or more elements to this property. (HTMLElement)
`flipPadding`: The amount of padding, in pixels, to exceed before the flip behavior will occur. (number)
`hoist`: Enable this option to prevent the panel from being clipped when the component is placed inside a container with `overflow: auto|scroll` (boolean | string)
`manualTrigger`:  (boolean)
`menu`: Shows an arrow next to the label (boolean)
`menuFitTrigger`: The dropdown menu fits the width of the trigger if the menu is too small (boolean)
`multiple`: Enables multi select. With this enabled, value will be an array. (boolean)
`nested`: Used for cascading menus. (boolean)
`noFocusoutTillPanelClose`:  (boolean)
`open`: Indicates whether or not the dropdown is open. You can use this in lieu of the show/hide methods. (boolean)
`panelFitTrigger`:  (boolean)
`placement`: The preferred placement of the dropdown panel. Note that the actual placement may vary as needed to keep the panel
inside of the viewport. ("bottom" | "bottom-end" | "bottom-start" | "left" | "left-end" | "left-start" | "right" | "right-end" | "right-start" | "top" | "top-end" | "top-start")
`sentiment`: Sentiment for dropdown. (string)
`size`: Dropdown size ("large" | "medium" | "small")
`skidding`: The distance in pixels from which to offset the panel along its trigger. (number)
`trigger`: trigger by click or hover ("click" | "hover")
`uncontrolled`: Set to true to control the dropdown's state from the application / framework's side (boolean)
`value`:  (any[] | string)

### Methods
`hide()`
`reposition()`
`show()`

### Events
`hbr-after-hide`: Emitted after the dropdown closes and all transitions are complete.
`hbr-after-show`: Emitted after the dropdown opens and all transitions are complete.
`hbr-dismiss`: Emitted when body is clicked. Calling `event.preventDefault()` will prevent the popover from closing.
`hbr-hide`: Emitted when the dropdown closes. Calling `event.preventDefault()` will prevent it from being closed.
`hbr-select`: Emitted when a menu item is selected
`hbr-show`: Emitted when the dropdown opens. Calling `event.preventDefault()` will prevent it from being opened.

### Slots
`[default]`: The dropdown's content.
`trigger`: The dropdown's trigger.

### Custom CSS Properties
--panel-border: border of the dropdown panel.
--panel-border-radius: the border radius of the dropdown panel.
--panel-box-shadow: the box shadow of the dropdown panel.

### Parts
`base`: The component's base wrapper.
`panel`: The panel that gets shown when the dropdown is open.
`trigger`: The container that wraps the trigger.