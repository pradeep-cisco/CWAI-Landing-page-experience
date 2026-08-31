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

## API Reference

### Props
`advanced`: [Deprecated, mode now changes automatically based on the number of pages] Enable advanced mode (boolean)
`aria`: Attributes related to screen readers. ({ label: { pagination: string; firstPage: string; lastPage: string; nextPage: string; previousPage: string; pageNumber: string; goTo: string; }; role: string; })
`basic`: Enable basic (default) mode (boolean)
`disabled`: disabled the pagination (boolean)
`hoist`:  (boolean)
`i18n`: The i18n (internationalization) key-value pairs. (I18n)
`itemCount`: Total number of records (number)
`nonnumerical`: Toggle between numerical and non-numerical pagination. Available starting from (boolean)
`orderArray`: Arrange configured props. {"0": main_paginator, "1": counts, "2": pageNumberOptions} (number[])
`page`: Current page number (number)
`pageInfo`: Determine whether to show detailed page information (like the first and last record number on the page and total number of records) (boolean)
`pageOptions`: Page Length options for the page length selector (number[])
`pageSize`: The total number of records in the page - default (number)
`placement`: Placement of the select dropdown ("bottom" | "bottom-end" | "bottom-start" | "left" | "left-end" | "left-start" | "right" | "right-end" | "right-start" | "top" | "top-end" | "top-start")
`showAll`: Show all configured props (boolean)
`showJumper`: Jump to the specified page number directly (boolean)
`size`:  ("medium" | "small")
`sizeChanger`: Determine whether to show pageSize select (boolean)

### Events
`hbr-page-changed`: Event emitted when the current page has been changed
`hbr-size-changed`: Event emitted when page size changes

### Custom CSS Properties
--padding: The padding around the pagination component.
--page-bg-control-disabled: The background color of the disabled page control.
--page-bg-hover: The background color when the page number is hovered upon.
--page-bg-hover-active: The background color when the active page is hovered upon.
--page-color: The color of the page number.
--page-color-active-border: The border color of the active page.
--page-color-control: The color of the page control arrows.
--page-color-control-disabled: The color of the disabled page control.
--page-color-hover: The color of the page number when hovered upon.
--page-color-hover-active-border: The border color when the active page is hovered.
--page-font-size: The font size of the page numbers.
--page-info-font-size: The font size of the page count information.
--select-padding: The padding inside the select component for page changing page size.

### Parts
`base`
`jumper`
`menu-item`
`select`
`size`
`size-description`
