# Toggle

Toggle is implemented using the web component: <hbr-switch>.

## Description
Switch control representing an on/off state.

## Usage
```jsx
export default function Toggle() {
	return (
		<hbr-switch
			name="approved"
			onhbr-change={(e) => {
				console.log(e.target.name, ": ", e.target.checked);
			}}
		>
			Approved
		</hbr-switch>
	);
}

```

## API Reference

### Props
`aria`: Attributes related to screen readers. ({ label?: string; })
`arialabel`: Prop that enables users to pass a custom aria label prop. (boolean | string)
`autofocus`: Indicates that the switch should receive focus on page load. (boolean)
`checked`: Set to true to draw the switch in a checked state. (boolean)
`disabled`: Set to true to disable the switch. (boolean)
`error`: Set to true to make the switch to error state. (boolean)
`helpText`: The switch's help text. (string)
`helpTextId`: The switch's help text id. (string)
`invalid`: This will be true when the control is in an invalid state. Validity is determined by the `required` prop. (boolean)
`label`: The switch's label attribute. (string)
`name`: The switch's name attribute. (string)
`required`: Set to true to make the switch a required field. (boolean)
`size`: Switch size ("large" | "medium" | "small")
`tooltip`: Tooltip content if the icon button serves as a tooltip reference. (string)
`value`: The switch's value attribute. (string)

### Methods
`removeFocus()`
`reportValidity()`
`setCustomValidity()`
`setFocus()`

### Events
`hbr-blur`: Emitted when the control loses focus.
`hbr-change`: Emitted when the control's checked state changes.
`hbr-click`: Emitted when clicking the switch.
`hbr-focus`: Emitted when the control gains focus.

### Slots
`[default]`: The switch's label.
`description`: The switch's description text. (v2.14.12)
`help-text`: The switch's help text.
`label`: The switch's top label.
`label-info`: Interactive informational content, such as a tooltip trigger, displayed next to the switch label.
`label-suffix`: Non-interactive content to display inline with the switch label.

### Custom CSS Properties
--control-checked-color: The checked color of the control .
--control-checked-focus-color: The checked-focus color of the control.
--control-checked-hover-color: The checked-hover color of the control .
--control-color: The color of the control.
--control-disabled-color: The disabled color of the control.
--control-hover-color: The hover color of the control.
--font-size: The font-size of the label.
--font-weight: The label of the font-weight.
--form-control-asterisk-display: Controls whether the required-field asterisk is displayed. Set to `block` to show the asterisk. Defaults to `none`.
--form-control-width: form control wrapper.
--height: The height of the switch.
--label-checked-color: The checked color of the label.
--label-color: The color of the label.
--label-margin: The margin of the label.
--label-white-space: The white-space of the label.
--thumb-box-shadow: The box-shadow of the thumb.
--thumb-color: The color of the thumb.
--thumb-disabled-color: The disabled color of the thumb.
--thumb-size: The size of the thumb.
--width: The width of the switch.

### Parts
`base`: The component's base wrapper.
`content`: The switch content wrapper.
`control`: The switch control.
`description`: The description text element (v2.14.12)
`form-control`: The root wrapper element
`help-text`: The help text wrapper element
`input`: The input element.
`label`: The switch label.
`thumb`: The switch position indicator.