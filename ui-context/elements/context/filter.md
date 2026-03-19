# Filter

Filter is implemented using the web component: <hbr-filter-bar>.

## Description
Composable bar of inputs for narrowing a data set. Used within tables and occasionally other data-driven components to filter the data. Displays as a responsive row of inputs.

## Usage
```jsx
import { useState } from "react";
export default function Filter() {
	const [filters, setFilters] = useState("");
	const [filters1, setFilters1] = useState("");
	const [filters2, setFilters2] = useState("");
	const [filters3, setFilters3] = useState("");
	const [filters4, setFilters4] = useState("");

	return (
		<hbr-layout direction="column">
			<hbr-filter-bar>
				<hbr-input slot="start" placeholder="Search">
					<hbr-icon slot="prefix" name="magnifying-glass" sentiment="neutral" />
				</hbr-input>
				<hbr-select
					clearable
					placeholder={"Time"}
					style={{ width: "100px" }}
					value={filters}
					onhbr-change={(evt) => {
						setFilters(evt.target.value);
					}}
				>
					<hbr-option value="one">Option 1</hbr-option>
					<hbr-option value="two">Option 2</hbr-option>
					<hbr-option value="three">Option 3</hbr-option>
				</hbr-select>
				<hbr-select
					placeholder={"Filter 1"}
					value={filters1}
					style={{ width: "100px" }}
					onhbr-change={(evt) => {
						setFilters1(evt.target.value);
					}}
				>
					<hbr-option value="one">Option 1</hbr-option>
					<hbr-option value="two">Option 2</hbr-option>
					<hbr-option value="three">Option 3</hbr-option>
				</hbr-select>
				<hbr-select
					placeholder={"Filter 2"}
					value={filters2}
					style={{ width: "100px" }}
					onhbr-change={(evt) => {
						setFilters2(evt.target.value);
					}}
				>
					<hbr-option value="one">Option1</hbr-option>
					<hbr-option value="two">Option 2</hbr-option>
					<hbr-option value="three">Option 3</hbr-option>
				</hbr-select>
				<hbr-select
					placeholder={"Filter 3"}
					value={filters4}
					style={{ width: "100px" }}
					onhbr-change={(evt) => {
						setFilters4(evt.target.value);
					}}
				>
					<hbr-option value="one">Option 1</hbr-option>
					<hbr-option value="two">Option 2</hbr-option>
					<hbr-option value="three">Option 3</hbr-option>
				</hbr-select>
				<hbr-select
					placeholder={"Filter 4"}
					value={filters3}
					style={{ width: "100px" }}
					onhbr-change={(evt) => {
						setFilters3(evt.target.value);
					}}
				>
					<hbr-option value="one">Option 1</hbr-option>
					<hbr-option value="two">Option 2</hbr-option>
					<hbr-option value="three">Option 3</hbr-option>
				</hbr-select>
				<hbr-checkbox slot="fixed">Gateway</hbr-checkbox>
				<hbr-button slot="overflow" variant="text">
					<hbr-icon name="funnel-simple" slot="prefix" />
					All filters
				</hbr-button>

				<hbr-text type="secondary" size="sm" slot="fixed-suffix">
					123 results
				</hbr-text>
				<hbr-button
					slot="fixed-suffix"
					variant="text"
					onClick={() => {
						console.log("Resetting filters");
						setFilters("");
						setFilters1("");
						setFilters2("");
						setFilters3("");
						setFilters4("");
					}}
				>
					Clear All
				</hbr-button>
				<hbr-button slot="end" variant="outline">
					Download
				</hbr-button>
			</hbr-filter-bar>

			<hbr-filter-bar>
				<hbr-select placeholder={"Last day"} style={{ width: "100px" }}>
					<hbr-option value="one">Option 1</hbr-option>
					<hbr-option value="two">Option 2</hbr-option>
					<hbr-option value="three">Option 3</hbr-option>
				</hbr-select>
				<hbr-select placeholder={"Filter 1"} style={{ width: "100px" }}>
					<hbr-option value="one">Option 1</hbr-option>
					<hbr-option value="two">Option 2</hbr-option>
					<hbr-option value="three">Option 3</hbr-option>
				</hbr-select>
				<hbr-select placeholder={"Filter 2"} style={{ width: "100px" }}>
					<hbr-option value="one">Option 1</hbr-option>
					<hbr-option value="two">Option 2</hbr-option>
					<hbr-option value="three">Option 3</hbr-option>
				</hbr-select>
				<hbr-select placeholder={"Filter 3"} style={{ width: "100px" }}>
					<hbr-option value="one">Option 1</hbr-option>
					<hbr-option value="two">Option 2</hbr-option>
					<hbr-option value="three">Option 3</hbr-option>
				</hbr-select>
				<hbr-select placeholder={"Filter 4"} style={{ width: "100px" }}>
					<hbr-option value="one">Option 1</hbr-option>
					<hbr-option value="two">Option 2</hbr-option>
					<hbr-option value="three">Option 3</hbr-option>
				</hbr-select>
				<hbr-button slot="fixed" variant="text">
					<hbr-icon name="funnel-simple" slot="prefix" />
					All filters
				</hbr-button>
			</hbr-filter-bar>
		</hbr-layout>
	);
}

```