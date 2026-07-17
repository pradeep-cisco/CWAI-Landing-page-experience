# Tooltip

Tooltip is implemented using the web component: <hbr-tooltip>.

## Description
Brief contextual label that appears on hover or focus.

## Generation Guidance
- Use one hbr-tooltip per trigger. Do not pair hbr-tooltip with a second custom tooltip for the same icon or control.
- When the trigger is inside a drawer, modal, table cell, or scrollable container, use hoist or the documented overlay-safe pattern so the tooltip is not clipped or rendered behind the containing overlay.
- Use hbr-tooltip for short labels/help text. Use hbr-popover for richer explanatory content with multiple sentences or lists.

## Usage
```jsx
export default function Tooltip() {
	return (
		<hbr-tooltip
			content="Laboris nisi ut aliquip ex ea commodo cillum dolore eu fugiat nulla pariatur."
			onhbr-show={() => {
				console.log("Show");
			}}
			onhbr-after-show={() => {
				console.log("After Show");
			}}
			onhbr-hide={() => {
				console.log("Hide");
			}}
			onhbr-after-hide={() => {
				console.log("After Hide");
			}}
		>
			<hbr-icon-button noPadding name="info" arialabel="information" />
		</hbr-tooltip>
	);
}

```