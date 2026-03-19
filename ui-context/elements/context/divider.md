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