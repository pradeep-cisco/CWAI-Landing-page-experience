# Select

Select is implemented using the web component: <hbr-select>.

## Description
Form control presenting a list of options for single or multiple selection.

## Usage
```jsx
import { useState } from "react";

export default function Select() {
	const initialData = [
		{ text: "Chocolate Pie", value: "chocolatePie" },
		{ text: "Flan", value: "flan" },
		{ text: "Frozen Yogurt", value: "frozenYogurt" },
		{ text: "Ice Cream", value: "iceCream" },
		{
			text: "Mint Chocolate Chip Ice Cream",
			value: "mintChocolateChipIceCream",
		},
		{ text: "Rainbow Birthday Cake", value: "rainbowBirthdayCake" },
	];
	const [data, setData] = useState(initialData);
	const [value, setValue] = useState("");

	const handleChange = (event) => {
		alert(`Selected: ${event.target.value}`);
	};

	const onSearchableChange = (event) => {
		setData(initialData);
		setValue(event.detail.option.value);
	};

	const onSearchableSearch = (event) => {
		const searchText = event.detail?.value?.toLocaleLowerCase?.() || "";
		const filtered = initialData
			.filter((item) => item.text.toLocaleLowerCase().includes(searchText))
			.map((item) => ({ ...item, query: event.detail?.value || "" }));
		setData(filtered);
	};

	const onSearchableClear = () => {
		setData(initialData);
		setValue("");
	};

	return (
		<>
			{/* Most basic version of the select component with placeholder, change event handler, and clearable option. */}
			<hbr-select
				placeholder="Dessert Type"
				onhbr-change={handleChange}
				clearable
			>
				<hbr-option value="chocolatePie">Chocolate Pie</hbr-option>
				<hbr-option value="flan">Flan</hbr-option>
				<hbr-option value="frozenYogurt">Frozen Yogurt</hbr-option>
				<hbr-option value="iceCream">Ice Cream</hbr-option>
				<hbr-option value="rainbowBirthdayCake">
					Rainbow Birthday Cake
				</hbr-option>
				{/* Optional error message on validation */}
				<div slot="rear">
					<hbr-banner variant="fill" sentiment="negative" open>
						<hbr-icon slot="icon" name="status-negative" sentiment="negative" />
						This is an error message.
					</hbr-banner>
				</div>
			</hbr-select>

			{/* Multiple select variant. */}
			<hbr-select
				placeholder="Dessert Type"
				onhbr-change={handleChange}
				clearable
				variant="multiple"
			>
				<hbr-option value="chocolatePie">Chocolate Pie</hbr-option>
				<hbr-option value="flan">Flan</hbr-option>
				<hbr-option value="frozenYogurt">Frozen Yogurt</hbr-option>
				<hbr-option value="iceCream">Ice Cream</hbr-option>
				<hbr-option value="rainbowBirthdayCake">
					Rainbow Birthday Cake
				</hbr-option>
			</hbr-select>

			{/* Searchable and clearable select with local filtering and controlled value. */}
			<hbr-select
				placeholder="Dessert Type"
				name="searchable-3"
				searchable
				clearable
				onhbr-search={onSearchableSearch}
				onhbr-change={onSearchableChange}
				onhbr-clear={onSearchableClear}
				className="hbr-css__form-section-md"
				value={value}
			>
				{data.length ? (
					data.map((option) => (
						<hbr-option value={option.value} key={option.value}>
							<hbr-highlight
								text={option.text}
								query-text={option.query}
								continuous={false}
							/>
						</hbr-option>
					))
				) : (
					<div
						style={{ padding: "var(--hbr-spacing-sm)", textAlign: "center" }}
					>
						<hbr-illustration size="small">
							<div slot="body">No matches found.</div>
						</hbr-illustration>
					</div>
				)}
			</hbr-select>
		</>
	);
}

```

## API Reference

### Props
`anchor`: The element the popup will be anchored to. If the anchor lives outside of the popup, you can provide its `id` or a
reference to it here. If the anchor lives inside the popup, use the `anchor` slot instead. (HTMLElement | string)
`arialabel`: For SR when there is no label (any)
`autocomplete`: A text input with selectable suggestions. (boolean)
`autofocus`: Indicates that the select trigger should receive focus on page load. (boolean)
`clearable`: Adds a clear button when the select is not empty. (boolean)
`custom`: Allow adding custom tags, only on variant="tag" flow. (boolean)
`disabled`: Disables the select control. (boolean)
`enablePopover`: Enable the native popover feature so that the listbox layers above clipping containers. (boolean)
`error`: error state (boolean)
`filled`: Draws a filled select. (boolean)
`helpText`: The select's help text. If you need to display HTML, use the `help-text` slot instead. (string)
`hoist`: Enable this option to prevent the listbox from being clipped when the component is placed inside a container with
`overflow: auto|scroll`. Hoisting uses a fixed positioning strategy that works in many, but not all, scenarios. (boolean)
`i18n`: The i18n (internationalization) key-value pairs. (object)
`label`: The select's label. If you need to display HTML, use the `label` slot instead. (any)
`lines`: Limits `variant="tag"` to a maximum number of visible tag rows before the combobox scrolls.
Omit to show all tags with no max height.
When setting this prop, `3` is the recommended default. (number)
`multiple`: Allows more than one option to be selected. (boolean)
`name`: The name of the select, submitted as a name/value pair with form data. (string)
`open`: Indicates whether or not the select is open. You can toggle this attribute to show and hide the menu, or you can
use the `show()` and `hide()` methods and this attribute will reflect the select's open state. (boolean)
`pill`: Draws a pill-style select with rounded edges. (boolean)
`placeholder`: Placeholder text to show as a hint when the select is empty. (string)
`placement`: The preferred placement of the select's menu. Note that the actual placement may vary as needed to keep the listbox
inside of the viewport. ("bottom" | "bottom-end" | "bottom-start" | "left" | "left-end" | "left-start" | "right" | "right-end" | "right-start" | "top" | "top-end" | "top-start")
`readonly`: Multi select with the basic tags. Only used with variant="tag" (boolean)
`required`: The select's required attribute. (boolean)
`search`: Search string (string)
`searchable`: Allow search the items(s) from the list. (boolean)
`size`: The select's size. ("large" | "medium" | "small")
`skidding`: The distance in pixels from which to offset the listbox along its select anchor. (number)
`sync`: Syncs the Listbox's width or height to match the anchor element.
Use "none" to prevent resizing if the anchor is smaller than the longest option's text.
since v2.11.2 ("both" | "height" | "none" | "width")
`tagWrap`: Allow tag wrap for multiline tag as selected value. (boolean)
`tooltip`: Tooltip content if the icon button serves as a tooltip reference. (string)
`truncate`:  (boolean)
`uncontrolled`: Set to true to control the select's state from the application / framework's side (boolean)
`value`:  (string | string[])
`variant`: variant "multi select or tag". With this enabled, value will be an array. ("multiple" | "single" | "tag")

### Methods
`setFocus()`

### Events
`hbr-after-hide`: Emitted after the select's menu closes and all animations are complete.
`hbr-after-show`: Emitted after the select's menu opens and all animations are complete.
`hbr-blur`: Emitted when the control loses focus.
`hbr-change`: Emitted when the control's value changes.
`hbr-clear`: Emitted when the control's value is cleared.
`hbr-combo-input`: Emitted when the combobox receives input
`hbr-focus`: Emitted when the control gains focus.
`hbr-hide`: Emitted when the select's menu closes.
`hbr-input`: Emitted when the control receives input.
`hbr-invalid`: Emitted when the form control has been checked for validity and its constraints aren't satisfied.
`hbr-search`: Emitted when the search input value change.
`hbr-show`: Emitted when the select's menu opens.

### Custom CSS Properties
--box-bg-color: The background color of the select box.
--box-bg-color-focus: The background color of the select box when focused.
--color: The color of the text in the select box.
--form-control-asterisk-display: Controls whether the required-field asterisk is displayed. Set to `block` to show the asterisk. Defaults to `none`.
--hover-color: The color of the text when hovered.

### Parts
`listbox`