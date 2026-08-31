# Checkbox

Checkbox is implemented using the web component: <hbr-checkbox>.

## Description
Binary selection control allowing multiple independent choices.

## Usage
```jsx
export default function Checkboxes() {
	const handleChange = (e) => {
		console.log(e.target.name, " : ", e.target.checked);
	};
	return (
		<>
			<hbr-checkbox-group
				direction="column"
				label="Column orientation with medium size"
				onhbr-change={handleChange}
			>
				<hbr-checkbox name="one">One</hbr-checkbox>
				<hbr-checkbox name="two">Two</hbr-checkbox>
			</hbr-checkbox-group>
			<hbr-checkbox-group
				direction="row"
				label="Row orientation samll size"
				size="small"
				onhbr-change={handleChange}
			>
				<hbr-checkbox size="small" name="small-one">
					One
				</hbr-checkbox>
				<hbr-checkbox size="small" name="small-two">
					Two
				</hbr-checkbox>
				{/* Optional error message on validation */}
				<div slot="rear">
					<hbr-banner variant="fill" sentiment="negative" open>
						<hbr-icon slot="icon" name="status-negative" sentiment="negative" />
						This is an error message.
					</hbr-banner>
				</div>
			</hbr-checkbox-group>
			<hbr-checkbox name="license-agreement" onhbr-change={handleChange}>
				I agree to the terms and conditions
			</hbr-checkbox>
			<hbr-checkbox>Unselected</hbr-checkbox>
			<hbr-checkbox indeterminate>Indeterminate</hbr-checkbox>
			<hbr-checkbox disabled>Disabled</hbr-checkbox>
		</>
	);
}

```

## API Reference

### Props
`aria`: Attributes related to screen readers. ({ label?: string; })
`autofocus`: Indicates that the checkbox should receive focus on page load. (boolean)
`checked`: Set to true to draw the checkbox in a checked state. (boolean)
`disabled`: Set to true to disable the checkbox. (boolean)
`error`: Set to true to make the checkbox to error state. (boolean)
`helpText`: The checkbox's help text. (string)
`helpTextId`: The checkbox's help text id. (string)
`indeterminate`: Set to true to draw the checkbox in an indeterminate state. (boolean)
`invalid`: This will be true when the control is in an invalid state. Validity is determined by the `required` prop. (boolean)
`label`: The checkbox's label attribute. (string)
`name`: The checkbox's name attribute. (string)
`required`: Set to true to make the checkbox a required field. (boolean)
`sentiment`:  (string)
`size`: Checkbox size ("large" | "medium" | "small")
`tooltip`: Tooltip content if the icon button serves as a tooltip reference. (string)
`value`: The checkbox's value attribute. (string)

### Methods
`removeFocus()`
`reportValidity()`
`setCheck()`
`setClick()`
`setCustomValidity()`
`setFocus()`

### Events
`hbr-blur`: Emitted when the control loses focus.
`hbr-change`: Emitted when the control's checked state changes.
`hbr-click`: Emitted when clicking the checkbox.
`hbr-focus`: Emitted when the control gains focus.

### Slots
`[default]`: The checkbox's content.
`description`: The checkbox's description text (v2.14.11)
`help-text`: The checkbox's help text.
`label`: The checkbox's top label.
`label-info`: Interactive informational content, such as a tooltip trigger, displayed next to the checkbox label.
`label-suffix`: Non-interactive content to display inline with the checkbox label.

### Custom CSS Properties
--form-control-asterisk-display: Controls whether the required-field asterisk is displayed. Set to `block` to show the asterisk. Defaults to `none`.
--size: size of the checkbox icon.

### Parts
`base`: The component's base wrapper.
`checked-icon`: The container the wraps the checked icon.
`checked-icon-wrapper`
`content`: The checkbox content wrapper.
`control`: The checkbox control.
`default-icon`: The container the wraps the default icon.
`default-icon-wrapper`
`description`: The description text element (v2.14.11)
`error-icon`: The container the wraps the error icon.
`error-icon-wrapper`
`form-control`: The root wrapper element
`help-text`: The help text wrapper element
`indeterminate-icon`: The container that wraps the indeterminate icon.
`indeterminate-icon-wrapper`
`input`: The input element.
`label`: The checkbox label.