# Pagination

Pagination is implemented using the web component: <hbr-pagination>.

## Description
Use as a sibling to the hbr-dom-table component for navigating large datasets split across multiple pages.

When pagination follows a table in the same card, place both components in an explicit parent layout with the required gap for that content stack.

## Usage
```jsx
export default function Pagination() {
	return (
		<hbr-pagination
			advanced
			sizeChanger
			pageInfo
			pageSize={30}
			itemCount={211}
			orderArray={[2, 1, 0]}
		/>
	);
}

```
