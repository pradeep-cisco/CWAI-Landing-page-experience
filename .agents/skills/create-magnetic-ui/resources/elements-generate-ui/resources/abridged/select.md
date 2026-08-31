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
`disabled`: Disables the select control. (boolean)
`searchable`: Allow search the items(s) from the list. (boolean)
`size`: The select's size. ("large" | "medium" | "small")
`value`:  (string | string[])