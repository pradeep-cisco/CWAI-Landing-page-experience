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