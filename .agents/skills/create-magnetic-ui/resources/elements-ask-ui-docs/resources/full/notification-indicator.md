# Notification Indicator

Notification Indicator is implemented using the web component: <hbr-badge>.

## Description
Notification indicator component showing status or count information, typically attached to another object.

## Generation Guidance
These rules govern generation of badges using <hbr-badge>.

## WHEN TO USE
- Badges may be used as notification indicators to show counts or presence of new items
- Badges may also show the count of items associated with a parent component, such as tabs

##  WHEN NOT TO USE
- As labels or tags for categorization
- In table cells to represent attributes or statuses

## Usage
```jsx
export default function NotificationIndicator() {
	const styles = {
		base: {
			backgroundColor: "var(--hbr-color-neutral-bg-weak)",
			borderRadius: "var(--hbr-control-border-radius-sm)",
			height: "3rem",
			width: "3rem",
			display: "inline-flex",
			position: "relative",
			marginRight: "var(--hbr-spacing-xl)",
		},
	};

	return (
		<>
			{/* BEGIN: Badge with Tab */}
			<hbr-tab>
				Tab
				<hbr-badge
					pill
					style={{
						marginLeft: "calc(var(--hbr-spacing-2xs) + var(--hbr-spacing-3xs))",
					}}
				>
					9
				</hbr-badge>
			</hbr-tab>
			{/* END: Badge with Tab */}
			{/* START: Notification Badge */}
			<div style={styles.base}>
				<hbr-badge
					pill
					sentiment="negative"
					style={{
						position: "absolute",
						top: "0",
						right: "0",
						transform: "translateY(-50%) translateX(50%)",
					}}
				>
					99+
				</hbr-badge>
			</div>
			{/* END: Notification Badge */}
			{/* START: Notification Dot Badge */}
			<div style={styles.base}>
				<hbr-badge
					dot
					sentiment="negative"
					style={{
						position: "absolute",
						top: "0",
						right: "0",
						transform: "translateY(-50%) translateX(50%)",
					}}
				/>
			</div>
			{/* END: Notification Dot Badge */}
		</>
	);
}

```

## API Reference

### Props
`disabled`: Disables the badge. (boolean)
`dot`: Draws a small dot to the top-right of the badge. (boolean)
`inline`: Displays the badge inline with the content around it. (boolean)
`pill`: Draws a pill-style badge with rounded edges. (boolean)
`pulse`: Makes the badge pulsate to draw attention. (boolean)
`sentiment`: The badge's sentiment. ("danger" | "info" | "interact" | "neutral" | "success" | "warning")
`size`: The badge's size. ("large" | "medium" | "small")
`square`: Draws a square badge. (boolean)
`status`: Removes the extra anchored badge border for status icon usage where the asset already contains its own border. (boolean)

### Slots
`[default]`: The badge's content for non-superscript usage.
`badge`: The badge indicator content for an anchored badge.
`base`: The anchor element for an anchored badge.

### Custom CSS Properties
--bg-color: background color
--bg-color-hover: Background color on hover
--border: Border style
--border-radius: Border radius
--dot-size: dot size
--outline: Outline style
--padding: Paddings around the badge
--pulse-color: Pulsating with a subtle animation color
--text-color: text color

### Parts
`base`: The base wrapper
`indicator`: The anchored badge indicator