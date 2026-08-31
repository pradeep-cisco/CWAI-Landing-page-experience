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
`open`: Indicates whether or not the accordion is open. You can use this in lieu of the show/hide methods. (boolean)
`variant`: The accordion's type. ("borderless" | "card" | "contained" | "stacked")