# Drawer

Drawer is implemented using the web component: <hbr-drawer>.

## Description
Panel that slides in from an edge to reveal supplemental content.

## Generation Guidance
These rules govern generation of drawers using <hbr-drawer>.
- Drawer is a web component that slides out from the edge of the viewport or its containing element.

## Slots

The drawer component supports three slots:

1. **Default slot (unnamed)**: The drawer's main content.
   - Usage: Place content directly between the opening and closing tags
   - Example: <hbr-drawer>Main content here</hbr-drawer>

2. **label slot**: The drawer's label/title displayed in the header.
   - Usage: <span slot="label">Drawer Title</span>
   - Alternative: Can use the 'label' prop instead
   - Note: Always include a relevant label for accessibility, even when using 'no-header'

3. **footer slot**: The drawer's footer area, typically for action buttons.
   - Usage: <div slot="footer">Footer content or buttons</div>
   - Common use case: Button groups representing various options

Use exact casing when referencing these examples.

## Usage
```jsx
import { useState } from "react";

export default function Drawer() {
	const [open, setOpen] = useState(true);
	const drawerID = "base-sample-drawer";
	function handleCloseClick(event) {
		// check to avoid syncing state close of non drawer elements that bubble up
		if (event.target.id === drawerID) setOpen(false);
	}
	return (
		<div>
			<hbr-drawer
				scrollAware={true}
				open={open}
				id={drawerID}
				onhbr-hide={handleCloseClick}
			>
				{/* Title */}
				<hbr-layout slot="label" direction="column" gap="2xs">
					<hbr-text variant="drawer-title">Drawer title</hbr-text>
					<hbr-text type="secondary" size="sm">
						Optional descriptor goes here.
					</hbr-text>
				</hbr-layout>

				{/* Content */}
				<div
					style={{
						width: "100%",
						minHeight: "150%",
						background: "var(--hbr-color-neutral-bg-weak)",
						padding: "var(--hbr-spacing-md)",
					}}
				>
					Drawer Content
				</div>

				{/* Footer */}
				<hbr-sticky-action-bar slot="footer" align="end" raised sticky>
					<hbr-button variant="text" onClick={() => setOpen(false)}>
						Cancel
					</hbr-button>
					<hbr-button variant="fill">Save</hbr-button>
				</hbr-sticky-action-bar>
			</hbr-drawer>

			<hbr-button onClick={() => setOpen(true)}>Open drawer</hbr-button>
			<br />
			<br />
			<div
				style={{
					width: "100%",
					minHeight: "240px",
					background: "var(--hbr-color-neutral-bg-weak)",
					padding: "var(--hbr-spacing-md)",
				}}
			>
				Page Content
			</div>
		</div>
	);
}

```

## API Reference

### Props
`label`: The drawer's label as displayed in the header. You should always include a relevant label even when using
`no-header`, as it is required for proper accessibility. (string) 
`open`: Indicates whether or not the drawer is open. You can use this in lieu of the show/hide methods. (boolean) 
`size`: The drawer's width. Use the css prop --size for custom sizes. ("large" | "medium" | "small" | "xlarge") 