# Sticky Action Bar

Sticky Action Bar is implemented using the web component: <hbr-sticky-action-bar>.

## Description
Used in inline forms (body-content) and drawer/modal forms (drawer). Refer form template examples for usage. It can also be outside of forms as button groups.

## Generation Guidance
- ALWAYS use variant='body-content' for page forms, variant='drawer' for drawer/modal forms.
- Button order: secondary actions first, primary action LAST (rightmost).
- Use size='sm' only for popovers and compact contexts.
- Individual props (raised, rounded, sticky, align) are for rare custom cases only.

## Usage
```jsx
export default function StickyActionBar() {
	return (
		<hbr-layout direction="column" gap="lg">
			<div
				style={{
					width: "500px",
					height: "400px",
					background: "var(--hbr-color-neutral-bg-medium)",
					overflow: "scroll",
					boxSizing: "border-box",
					position: "relative",
				}}
			>
				<div
					style={{
						width: "100%",
						height: "160%",
						padding: "var(--hbr-spacing-xl)",
						boxSizing: "border-box",
					}}
				>
					<div
						style={{
							width: "100%",
							height: "100%",
							background: "var(--base-bg-weak-default)",
						}}
					/>
				</div>

				{/* Sticky action bar with raised style for scroll awareness */}
				<hbr-sticky-action-bar raised sticky>
					<hbr-button>Action</hbr-button>
					<hbr-button variant="text">Cancel</hbr-button>
				</hbr-sticky-action-bar>
			</div>
		</hbr-layout>
	);
}

```

## API Reference

### Props
`align`: Button alignment: 'start' (left) or 'end' (right). ("end" | "start")
`raised`: Shows shadow when stuck and overlapping content. (boolean)
`rounded`: Rounded top corners when stuck (use for page content, not drawers). (boolean)
`size`: Button spacing: 'md' (8px), 'sm' (4px compact). Default: md. ("md" | "sm")
`sticky`: Enables sticky positioning at container bottom. (boolean)
`variant`: 'body-content' (page footer: rounded, left-aligned, sticky with shadow) or 'drawer' (drawer/modal: no rounding, right-aligned, sticky with shadow). Overrides individual props. ('body-content' | 'drawer')