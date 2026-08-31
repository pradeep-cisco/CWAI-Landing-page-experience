# Accordion

Accordion is implemented using the web component: <hbr-accordion>.

## Description
Expandable list that shows or hides sections of related content.

## Generation Guidance
These rules govern generation of collapse/accordion components using <hbr-accordion>.
- The accordion component (also known as collapse) is used to create expandable and collapsible content areas to save space or shift focus.

## Anatomy & Structure

- Each accordion has a clear, visible panel header title at all times, regardless of the state (expanded/collapsed).
- Consistent icons are positioned in line with the header to provide toggles for showing or hiding content.
- The expandable/collapsible content area can include text, lists, forms, diagrams, or other content types.

## Interaction Behavior

- **Default Behavior**: By default, accordion panels disclose independently, allowing multiple panels to expand simultaneously for comparison.
- **Single Panel Mode**: To allow only one panel to expand at a time (focusing user attention), listen to the `hbr-show` event and programmatically close other panels when one expands.

## Variants/Styles

Use the `variant` attribute/prop to change the accordion component's appearance:
- `stacked` - DEFAULT and the MOST USED accordion variant. Accordions stacked on top of each other without shared borders
- `borderless` - Two or more accordions displayed with no border on either sides but shared borders between panels
- `contained` - Two or more accordions displayed with shared borders between panels.

**Important**: Group similar variants inside a parent div WITHOUT additional styling to ensure consistent appearance.

## Density/Sizes

Use the `size` attribute/prop to change the component's density:
- `large` - Large density (more spacing)
- `medium` - Medium density (default)
- `small` - Small density (compact)

## Disabled State

Use the `disabled` attribute to prevent panels from expanding and collapsing.

Use exact casing when referencing these examples.

## Usage
```jsx
export default function Accordion() {
	return (
		<div>
			<hbr-accordion summary="First">
				Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
				tempor incididunt ut labore et dolore magna
			</hbr-accordion>
			<hbr-accordion summary="Second">
				Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do eiusmod
				tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
				veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
				commodo consequat.
			</hbr-accordion>
			<hbr-accordion summary="Third">
				Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do eiusmod
				tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
				veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
				commodo consequat.
			</hbr-accordion>
		</div>
	);
}

```

## API Reference

### Props
`aria`:  ({ triggerButtonLabel: string; expandButton: string; collapseButton: string; })
`disabled`: Set to true to prevent the user from toggling the accordion. (boolean)
`interactive`: Set to true for preventing header from triggering the accordion open or close, if there are interactive elements rendered on the header. (boolean)
`label`: The label to show in the accordion header. If you need to display HTML, use the `label` slot instead. (string)
`open`: Indicates whether or not the accordion is open. You can use this in lieu of the show/hide methods. (boolean)
`size`: The accordion's size. ("large" | "medium" | "small")
`summary`: Deprecated. Use label instead (string)
`triggerposition`: The header's icon position. ("left" | "none" | "right")
`uncontrolled`: Set to true to control the accordion's state from the application / framework's side (boolean)
`variant`: The accordion's type. ("borderless" | "card" | "contained" | "stacked")

### Methods
`hide()`
`show()`

### Events
`hbr-after-hide`: Emitted after the accordion closes and all transitions are complete.
`hbr-after-show`: Emitted after the accordion opens and all transitions are complete.
`hbr-header-click`: Emitted when the accordion's header is clicked
`hbr-hide`: Emitted when the accordion closes. Calling `event.preventDefault()` will prevent it from being closed.
`hbr-show`: Emitted when the accordion opens. Calling `event.preventDefault()` will prevent it from being opened.

### Slots
`[default]`: The accordions' content.
`label`: The accordion's label. Alternatively, you can use the label prop.

### Custom CSS Properties
--header-border-bottom
--header-padding-bottom
--header-padding-left
--header-padding-right
--header-padding-top
--hide-duration: The length of the hide transition.
--hide-timing-function: The timing function (easing) to use for the hide transition.
--label-font-size
--label-line-height
--show-duration: The length of the show transition.
--show-timing-function: The timing function (easing) to use for the show transition.

### Parts
`base`: The component's base wrapper.
`content`: The accordion content.
`header`: The label header.
`label`: The accordion label.
`trigger`: The expand/collapse trigger icon.