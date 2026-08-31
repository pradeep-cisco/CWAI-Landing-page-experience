# Input

Input is implemented using the web component: <hbr-input>.

## Description
Single-line text or number entry field.

## Usage
```jsx
export default function InputExample() {
	const handleInput = (e) => {
		console.log(e.target.label, ": ", e.target.value);
	};
	return (
		<>
			<hbr-input value="Default value" onInput={handleInput} label="Name">
				<hbr-text slot="label-suffix" type="secondary" size="sm">
					(Optional)
				</hbr-text>
				{/* Optional error message on validation */}
				<div slot="rear">
					<hbr-banner variant="fill" sentiment="negative" open>
						<hbr-icon slot="icon" name="status-negative" sentiment="negative" />
						This is an error message.
					</hbr-banner>
				</div>
			</hbr-input>
			<hbr-input onInput={handleInput} type="date" label="Date of birth" />
			<hbr-input onInput={handleInput} type="time" label="Appointment time" />
		</>
	);
}

```

## API Reference

### Props
`aria`: Attributes related to screen readers. (Aria)
`ariaexpanded`: Aria expanded attribute. Use "aria={expanded: value}" instead. (string)
`arialabel`: 'aria-label' attribute when a label is not set. Use "aria={label: value}" instead. (string)
`ariarole`: Aria role attribute like role="combobox". Use "aria={role: value}" instead. (string)
`attr`: optional attributes since v.2.14.13 ({ [key: string]: string | number | boolean; })
`autocapitalize`: Controls whether and how text input is automatically capitalized as it is entered by the user. ("characters" | "none" | "off" | "on" | "sentences" | "words")
`autocomplete`: Specifies what permission the browser has to provide assistance in filling out form field values. Refer to
[this page on MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete) for available values. (string)
`autocorrect`: Indicates whether the browser's autocorrect feature is on or off. (string)
`autofocus`: Indicates that the input should receive focus on page load. (boolean)
`clearable`: Adds a clear button when the input is not empty. (boolean)
`disabled`: Disables the input. (boolean)
`error`: Indicates that the input has an error (boolean)
`helpText`: The input's help text. If you need to display HTML, use the `help-text` slot instead. (string)
`i18n`: The i18n (internationalization) key-value pairs. (i18n)
`inputmode`: Tells the browser what type of data will be entered by the user, allowing it to display the appropriate virtual
keyboard on supportive devices. ("decimal" | "email" | "none" | "numeric" | "search" | "tel" | "text" | "url")
`invalid`: This will be true when the control is in an invalid state. Validity is determined by props such as `type`,
`required`, `minlength`, `maxlength`, and `pattern` using the browser's constraint validation API. (boolean)
`label`: The input's label. If you need to display HTML, use the `label` slot instead. (string)
`max`: The input's maximum value. Only applies to date and number input types. (number | string)
`maxlength`: The maximum length of input that will be considered valid. (number)
`min`: The input's minimum value. Only applies to date and number input types. (number | string)
`minlength`: The minimum length of input that will be considered valid. (number)
`name`: The name of the input, submitted as a name/value pair with form data. (string)
`pattern`: A regular expression pattern to validate input against. (string)
`pill`: Draws a pill-style input with rounded edges. (boolean)
`placeholder`: Placeholder text to show as a hint when the input is empty. (string)
`readonly`: Makes the input readonly. (boolean)
`required`: Makes the input a required field. (boolean)
`size`: The input's size. ("large" | "medium" | "small")
`spellcheck`: Enables spell checking on the input. (boolean)
`step`: Specifies the granularity that the value must adhere to, or the special value `any` which means no stepping is
implied, allowing any numeric value. Only applies to date and number input types. ("any" | number)
`togglePassword`: Set to true to add a password toggle button for password inputs. (boolean)
`tooltip`: Tooltip content if the icon button serves as a tooltip reference. (string)
`type`: The type of input. Works the same as a native `<input>` element, but only a subset of types are supported. Defaults
to `text`. Use a number input field to input a number within a certain range using the mouse or keyboard. ("date" | "datetime-local" | "email" | "number" | "password" | "search" | "tel" | "text" | "time" | "url")
`value`: The current value of the input, submitted as a name/value pair with form data. (string)

### Methods
`checkValidity()`
`removeFocus()`
`reportValidity()`
`select()`
`setCustomValidity()`
`setFocus()`
`setRangeText()`
`setSelectionRange()`

### Events
`hbr-blur`: Emitted when the control loses focus.
`hbr-change`: Emitted when the control's value changes.
`hbr-clear`: Emitted when the clear button is activated.
`hbr-focus`: Emitted when the control gains focus.
`hbr-input`: Emitted when the control receives input.

### Slots
`clear-icon`: An icon to use in lieu of the default clear icon.
`help-text`: Help text that describes how to use the input. Alternatively, you can use the help-text prop.
`hide-password-icon`: An icon to use in lieu of the default hide password icon.
`label`: The input's label. Alternatively, you can use the label prop.
`label-info`: Interactive informational content, such as a tooltip trigger, displayed next to the input label.
`label-suffix`: Non-interactive content to display inline with the input label.
`prefix`: Used to prepend an icon or similar element to the input.
`show-password-icon`: An icon to use in lieu of the default show password icon.
`suffix`: Used to append an icon or similar element to the input.
`trailing`: Used to place content to the side of the input within the same row.

### Custom CSS Properties
--box-bg-color: The input background color.
--box-border: The input border style, the css `border` property.
--color: The input font color.
--focus-ring: The focus ring style to use when the control receives focus, a `box-shadow` property.
--focus-ring-error: The focus ring style to use when the control receives focus on error state, a `box-shadow` property.
--form-control-asterisk-display: Controls whether the required-field asterisk is displayed. Set to `block` to show the asterisk. Defaults to `none`.
--height-large: The input height for large size.
--height-medium: The input height for medium size.
--height-small: The input height for small size.
--icon-color: The input icon color (suffix) when using slots.
--placeholder-color: The input placeholder color.
--spacing-icon-top: The distance from top to icon for error state.
--spacing-large: The input's margin for large size..
--spacing-medium: The input's margin for medium size.
--spacing-small: The input's margin for small size.

### Parts
`base`: The component's base wrapper.
`clear-button`: The clear button.
`form-control`: The form control that wraps the label, input, and help-text.
`help-text`: The input help text.
`input`: The input control.
`label`: The input label.
`label-container`: The container that wraps the label and label-info slot.
`password-toggle-button`: The password toggle button.
`prefix`: The input prefix container.
`suffix`: The input suffix container.
`trailing`: The input trailing container.