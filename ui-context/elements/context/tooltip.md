# Tooltip

Tooltip is implemented using the web component: <hbr-tooltip>.

## Description
Brief contextual label that appears on hover or focus.

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