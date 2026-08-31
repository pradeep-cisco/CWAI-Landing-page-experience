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

## API Reference

### Props
`anchor`: The element the popup will be anchored to. If the anchor lives outside of the popup, you can provide its `id` or a
reference to it here. If the anchor lives inside the popup, the default (HTMLElement | string)
`content`: The tooltip's content. If you need to display HTML, use the `content` slot instead. (string)
`disabled`: Disables the tooltip so it won't show when triggered. (boolean)
`dismissOnClick`: dismiss the tooltip when clicking on the trigger element, in terms of the "trigger = hover" (boolean)
`distance`: The distance in pixels from which to offset the tooltip away from its target. (number)
`enablePopover`: Enable the native popover feature so that the tooltip layers above clipping containers. (boolean)
`hoist`: Enable this option to prevent the tooltip from being clipped when the component is placed inside a container with
`overflow: auto|hidden|scroll`. Hoisting uses a fixed positioning strategy that works in many, but not all,
scenarios. (boolean)
`open`: Indicates whether or not the tooltip is open. You can use this in lieu of the show/hide methods. (boolean)
`placement`: The preferred placement of the tooltip. Note that the actual placement may vary as needed to keep the tooltip
inside of the viewport. ("bottom" | "bottom-end" | "bottom-start" | "left" | "left-end" | "left-start" | "right" | "right-end" | "right-start" | "top" | "top-end" | "top-start")
`size`: sizes correspond to max-width of tooltip ("large" | "medium" | "small")
`skidding`: The distance in pixels from which to offset the tooltip along its target. (number)
`trigger`: Controls how the tooltip is activated. Possible options include `click`, `hover`, `focus`, and `manual`. Multiple
options can be passed by separating them with a space. When manual is used, the tooltip must be activated
programmatically. (string)

### Methods
`hide()`
`show()`

### Events
`hbr-after-hide`: Emitted after the tooltip has hidden and all animations are complete.
`hbr-after-show`: Emitted after the tooltip has shown and all animations are complete.
`hbr-hide`: Emitted when the tooltip begins to hide.
`hbr-show`: Emitted when the tooltip begins to show.
`hbr-tooltip-dismiss`: Emitted when body is clicked. Calling `event.preventDefault()` will prevent the tooltip from closing.

### Slots
`[default]`: The tooltip's target element. Avoid slotting in more than one element, as subsequent ones will be ignored.
`content`: The content to render in the tooltip. Alternatively, you can use the `content` attribute.

### Custom CSS Properties
--hide-delay: The amount of time to wait before hiding the tooltip when hovering.
--max-width: The maximum width of the tooltip before the content wraps.
--show-delay: The amount of time to wait before showing the tooltip when hovering.

### Parts
`base`: The component's base wrapper, an `<hbr-popup>` element.
`base__arrow`: The popup's exported `arrow` part. Use this to target the tooltip's arrow.
`base__popup`: The popup's exported `popup` part. Use this to target the tooltip's popup container.
`body`: The tooltip's body where its content is rendered.