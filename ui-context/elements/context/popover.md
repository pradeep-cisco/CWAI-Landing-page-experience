# Popover

Popover is implemented using the web component: <hbr-popover>.

## Description
Contextual floating layer anchored to a trigger element.

## Usage
```jsx
export default function Popover() {
	return (
		<hbr-popover size="small" open={true}>
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