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

## API Reference

### Props
`anchor`: The element the popup will be anchored to. If the anchor is external, you can provide a reference to an element or CSS selector via this prop. If the anchor lives inside the popover, donot pass this prop (HTMLElement | SVGElement | string)
`content`: The popover's content. If you need to display HTML, use the `content` slot instead. (string)
`disabled`: Disables the popover so it won't show when triggered. (boolean)
`distance`: The distance in pixels from which to offset the popover away from its target. (number)
`enablePopover`: Enable the native popover feature so that the popover layers above clipping containers. (boolean)
`hoist`: Enable this option to prevent the popover from being clipped when the component is placed inside a container with
`overflow: auto|hidden|scroll`. Hoisting uses a fixed positioning strategy that works in many, but not all,
scenarios. (boolean)
`open`: Indicates whether or not the popover is open. You can use this in lieu of the show/hide methods. (boolean)
`placement`: The preferred placement of the popover. Note that the actual placement may vary as needed to keep the popover
inside of the viewport. ("bottom" | "bottom-end" | "bottom-start" | "left" | "left-end" | "left-start" | "right" | "right-end" | "right-start" | "top" | "top-end" | "top-start")
`sentiment`: Supports brand sentiment for feature highlight popover ("brand")
`size`: sizes correspond to max-width of popover ("large" | "medium" | "small")
`skidding`: The distance in pixels from which to offset the popover along its target. (number)
`trigger`: Controls how the popover is activated. Possible options include `click`, `hover`, `focus`, and `manual`. Multiple
options can be passed by separating them with a space. When manual is used, the popover must be activated
programmatically. (string)
`variant`: Use confirm variant for popconfirm styles, chart variant for chart/ dataviz popovers ("chart" | "confirm" | "default" | "map")
`widthExpand`: set min-width to max-width available for that size even if content is shorter, and max-width unbounded (boolean)

### Methods
`hide()`
`show()`

### Events
`hbr-after-hide`: Emitted after the popover has hidden and all animations are complete.
`hbr-after-show`: Emitted after the popover has shown and all animations are complete.
`hbr-dismiss`: Emitted when body is clicked. Calling `event.preventDefault()` will prevent the popover from closing.
`hbr-hide`: Emitted when the popover begins to hide.
`hbr-show`: Emitted when the popover begins to show.

### Slots
`[default]`: The popover's target element. Avoid slotting in more than one element, as subsequent ones will be ignored.
`content`: The content to render in the popover. Alternatively, you can use the `content` attribute.

### Custom CSS Properties
--hide-delay: The amount of time to wait before hiding the tooltip when hovering.
--max-width: The maximum width of the tooltip before its content will wrap.
--show-delay: The amount of time to wait before showing the tooltip when hovering.

### Parts
`base`: The component's base wrapper, an `<hbr-popup>` element.
`base__arrow`: The popup's exported `arrow` part. Use this to target the popover's arrow.
`base__popup`: The popup's exported `popup` part. Use this to target the popover's popup container.
`body`: The popover's body where its content is rendered.