# Copy To Clipboard

Copy To Clipboard is implemented using the web component: <hbr-copyclipboard>.

## Description
Element that displays the provided text value and a button that copies the text value to the clipboard.

## Usage
```jsx
export default function CopyToClipboard() {
	return (
		<div style={{ width: "320px", padding: "10px" }}>
			<hbr-copyclipboard value="TTDRiY77CSEKUmvzV5P46FT" />
		</div>
	);
}

```

## API Reference

### Props
`aria`: Attributes related to screen readers. ({ label: string; })
`arialabel`: aria-label. deprecated candidate. use aria instead. (string)
`i18n`: The i18n (internationalization) key-value pairs. ({ copy: string; copyToClipboard: string; copiedToClipboard: string; })
`iconOnly`: To show clipboard with icon only. (boolean)
`label`: The clipboard's label. Alternatively, you can use the label slot. (string)
`size`: The clipboard's size. ("large" | "medium" | "small")
`truncate`: To use hbr-truncate component in label (boolean)
`value`: value to be copied (string)

### Events
`hbr-copy`: Emitted when the content is copied.

### Custom CSS Properties
--hide-delay: The amount of time to wait before hiding the tooltip when hovering.
--max-width: The maximum width of the tooltip before the content wraps.
--show-delay: The amount of time to wait before showing the tooltip when hovering.