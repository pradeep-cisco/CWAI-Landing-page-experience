# Tag

Tag is implemented using the web component: <hbr-tag>.

## Description
Tags are compact elements that represent attributes, keywords, or categories. They help users identify, filter, or organize content quickly. Tags can also indicate status or selections in a concise manner.

## Generation Guidance
- Use tags to label items with relevant keywords or categories.
- Use it as table cell content to represent attributes or statuses. Tags in table cells MUST be small size.
- Tags can be used next to page titles to indicate applied filters or selections.

## Usage
```jsx
export default function Tag() {
	return (
		<>
			{/* Basic Tags: Read-only tags used for categorization. */}
			<hbr-layout direction="row" gap="2xs">
				<hbr-tag>Tag 1</hbr-tag>
				<hbr-tag>Tag 2</hbr-tag>
			</hbr-layout>
			{/* Removable Tags: Allow users to remove tags */}
			<hbr-layout direction="row" gap="2xs">
				<hbr-tag removable onhbr-remove={() => alert("Tag 1 removed")}>
					Tag 1
				</hbr-tag>
				<hbr-tag removable onhbr-remove={() => alert("Tag 2 removed")}>
					Tag 2
				</hbr-tag>
			</hbr-layout>
			{/* Selectable Tags: Allow users to select or deselect tags */}
			<hbr-layout direction="row" gap="2xs">
				<hbr-tag variant="selectable">Tag 1</hbr-tag>
				<hbr-tag variant="selectable" selected>
					Tag 2
				</hbr-tag>
			</hbr-layout>
			{/* Status Tags: Indicate status using color coding. */}
			<hbr-layout direction="row" gap="2xs">
				<hbr-tag sentiment="positive">
					<hbr-icon
						name="status-positive"
						sentiment="positive"
						size="16px"
						slot="prefix"
					/>
					Success
				</hbr-tag>
				<hbr-tag sentiment="negative">
					<hbr-icon
						name="status-negative"
						sentiment="negative"
						size="16px"
						slot="prefix"
					/>
					Error
				</hbr-tag>
				<hbr-tag sentiment="warning">
					<hbr-icon
						name="status-warning"
						sentiment="warning"
						size="16px"
						slot="prefix"
					/>{" "}
					Warning
				</hbr-tag>
				<hbr-tag sentiment="inactive">
					<hbr-icon
						name="status-general-dormant"
						sentiment="inactive"
						size="16px"
						slot="prefix"
					/>{" "}
					Inactive
				</hbr-tag>
			</hbr-layout>
			{/* Size Variants: Different sizes for various UI needs. */}
			<hbr-layout direction="row" gap="2xs">
				<hbr-tag size="small">Small Tag</hbr-tag>
				<hbr-tag size="medium">Medium Tag</hbr-tag>
				<hbr-tag size="large">Large Tag</hbr-tag>
			</hbr-layout>
			{/* Monochrome Tags: For a more subtle appearance. */}
			<hbr-layout direction="row" gap="2xs">
				<hbr-tag mono>Mono</hbr-tag>
			</hbr-layout>
			{/* Tags with Icons: Enhance tags with icons for better visual context. Use neutral sentiment for default tags. */}
			<hbr-layout direction="row" gap="2xs">
				<hbr-tag size="small">
					<hbr-icon
						name="wifi-high"
						sentiment="neutral"
						size="12px"
						slot="prefix"
					/>
					Icon Tag
				</hbr-tag>
				<hbr-tag>
					<hbr-icon
						name="wifi-high"
						sentiment="neutral"
						size="14px"
						slot="prefix"
					/>
					Icon Tag
				</hbr-tag>
				<hbr-tag size="large">
					<hbr-icon
						name="wifi-high"
						sentiment="neutral"
						size="16px"
						slot="prefix"
					/>
					Icon Tag
				</hbr-tag>
			</hbr-layout>
		</>
	);
}

```

## API Reference

### Props
`mono`: Set to true if tag is a uses monospace font family. (boolean) 
`sentiment`: The tag's sentiment. ("danger" | "disabled" | "excellent" | "in-progress" | "inactive" | "info" | "low-warning" | "negative" | "positive" | "severe-warning" | "success" | "warning") 
`size`: The tag's size. ("large" | "medium" | "small") 
`status`: Set to true to get status tag styles like larger prefix icons, lesser margin (boolean) 
`variant`: The tag's type. ("add" | "label" | "selectable") 