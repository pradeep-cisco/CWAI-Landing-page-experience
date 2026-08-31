# Divider

Divider is implemented using the web component: <hbr-divider>.

## Description
Thin rule separating groups of content.

## Usage
```jsx
export default function Divider() {
	return (
		<div style={{ padding: "var(--hbr-spacing-lg)", background: "var(--hbr-color-neutral-bg)", borderRadius: "var(--hbr-border-radius-md)" }}>
			<hbr-divider />
		</div>
	);
}

```

## API Reference

### Props
`grow`: Adjust this prop to make the divider spill out the parent (no position styles) and fill to its grandparent's (position: relative) length (boolean)
`noPadding`: Removes spacing around the divider (boolean)
`prominence`: Adjust this to get dark to light border color for the divider ("medium" | "strong" | "weak")
`size`: Adjust this prop to get thin to thick divider ("medium" | "small")
`vertical`: Draws the divider in a vertical orientation (boolean)

### Custom CSS Properties
--color - The color of the divider.
--margin - Margin around the divider
--size - The size of the divider.

### Parts
`base`: The component's base wrapper.