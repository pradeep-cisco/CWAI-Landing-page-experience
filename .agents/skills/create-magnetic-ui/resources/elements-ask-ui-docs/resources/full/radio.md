# Radio

Radio is implemented using the web component: <hbr-radio>.

## Description
Single-choice selection control within a radio group.

## Usage
```jsx
export default function Radios() {
	const handleClick = (e) => {
		console.log(e.target.name, " : ", e.target.checked);
	};
	return (
		<>
			<hbr-radio-group
				direction="column"
				label="Column orientation with medium size"
				onhbr-click={handleClick}
			>
				<hbr-radio name="one">One</hbr-radio>
				<hbr-radio name="two">Two</hbr-radio>
				{/* Optional error message on validation */}
				<div slot="rear">
					<hbr-banner variant="fill" sentiment="negative" open>
						<hbr-icon slot="icon" name="status-negative" sentiment="negative" />
						This is an error message.
					</hbr-banner>
				</div>
			</hbr-radio-group>
			<hbr-radio-group
				direction="row"
				label="Row orientation samll size"
				size="small"
				onhbr-click={handleClick}
			>
				<hbr-radio size="small" name="small-one">
					One
				</hbr-radio>
				<hbr-radio size="small" name="small-two">
					Two
				</hbr-radio>
			</hbr-radio-group>
			<hbr-radio name="license-agreement" onhbr-click={handleClick}>
				I agree to the terms and conditions
			</hbr-radio>
			<hbr-radio>Unselected</hbr-radio>
			<hbr-radio disabled>Disabled</hbr-radio>
		</>
	);
}

```

## API Reference

### Props
`aria`: Attributes related to screen readers. ({ label?: string; })
`autofocus`: Indicates that the radio button should receive focus on page load. (boolean)
`checked`: Set to true to draw the radio in a checked state. (boolean)
`disabled`: Set to true to disable the radio. (boolean)
`error`: Set to true to make the radio to error state. (boolean)
`helpText`: The radio's help text. (string)
`helpTextId`: The radio's help text id. (string)
`indeterminate`:  (boolean)
`invalid`: This will be true when the control is in an invalid state. Validity in range inputs is determined by the message
provided by the `setCustomValidity` method. (boolean)
`label`: The radio's label attribute. (string)
`name`: The radio's name attribute. (string)
`required`: Set to true to make the radio a required field. (boolean)
`sentiment`:  (string)
`size`:  ("large" | "medium" | "small")
`tabidx`:  (boolean | string)
`tooltip`: Tooltip content if the icon button serves as a tooltip reference. (string)
`value`: The radio's value attribute. (string)

### Methods
`removeFocus()`
`reportValidity()`
`setClick()`
`setCustomValidity()`
`setFocus()`

### Events
`hbr-blur`: Emitted when the control loses focus.
`hbr-change`: Emitted when the control's checked state changes.
`hbr-click`: Emitted when click.
`hbr-focus`: Emitted when the control gains focus.

### Slots
`[default]`: The radio's label.
`description`: The radio's description text (v2.14.11)
`help-text`: The radio's help text.
`label`: The radio's top label.
`label-info`: Interactive informational content, such as a tooltip trigger, displayed next to the radio label.
`label-suffix`: Non-interactive content to display inline with the radio label.

### Custom CSS Properties
--form-control-asterisk-display: Controls whether the required-field asterisk is displayed. Set to `block` to show the asterisk. Defaults to `none`.
--size: size of the radio.

### Parts
`base`: The component's base wrapper.
`checked-icon`: The container the wraps the checked icon.
`checked-icon-wrapper`
`content`: The radio content wrapper.
`control`: The radio control.
`default-icon`: The container the wraps the default icon.
`default-icon-wrapper`
`description`: The description text element (v2.14.11)
`error-icon`
`error-icon-wrapper`
`form-control`: The root wrapper element
`help-text`: The help text wrapper element
`indeterminate-icon`: The container the wraps the indeterminate icon.
`indeterminate-icon-wrapper`
`input`: The input element.
`label`: The radio label.