# Popover

Popover is implemented using the web component: <hbr-popover>.

## Description
Contextual floating layer anchored to a trigger element.

## Generation Guidance
- For informational popovers attached to an info/help icon, use hover and focus triggers when the design expects the content to appear on hover. Use click only when the design or task asks for click-to-open behavior.
- Avoid scrollable hover popovers. Keep content concise, choose an appropriate popover size.
- Use semantic lists for multi-point explanatory content instead of indentation-only text.
- Do not add another info/help icon inside the popover body unless it is explicitly shown in the design.
- Use hoist or the documented overlay-safe pattern when popovers are inside scrollable, drawer, or modal containers.

## Usage
```jsx
export default function Popover() {
	return (
		<hbr-popover size="large" open={true} style={{ paddingLeft: "240px" }}>
			<hbr-button variant="text">Small</hbr-button>
			<div slot="content">
				Laboris nisi ut aliquip ex ea commodo consequat.
				<hbr-button size="small" variant="text">
					OptionalTextLink
				</hbr-button>
			</div>
		</hbr-popover>
	);
}

```