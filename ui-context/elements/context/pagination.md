# Pagination

Pagination is implemented using the web component: <hbr-pagination>.

## Description
Use as a sibling to the hbr-dom-table component for navigating large datasets split across multiple pages.

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