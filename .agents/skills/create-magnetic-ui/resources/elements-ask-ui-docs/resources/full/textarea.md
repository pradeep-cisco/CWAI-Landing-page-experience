# Textarea

Textarea is implemented using the web component: <hbr-textarea>.

## Description
Multi-line text entry field.

## Usage
```jsx
export default function Textarea() {
	return (
		<hbr-textarea
			label="Optional Label"
			style={{ width: "360px" }}
			value="Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint."
		/>
	);
}

```

## API Reference

### Props
`arialabel`: aria-label When no label  is set (string)
`autocapitalize`: The textarea's autocapitalize attribute. ("characters" | "none" | "off" | "on" | "sentences" | "words")
`autocomplete`: The textarea's autocomplete attribute. (string)
`autocorrect`: The textarea's autocorrect attribute. (string)
`autofocus`: The textarea's autofocus attribute. (boolean)
`counter`: Show character counter. Default to display a character counter for text area inputs when a character limit is set.
v2.14.5 (boolean)
`disabled`: Set to true to disable the textarea. (boolean)
`error`: Set style for error state (boolean)
`helpText`: The textarea's help text. Alternatively, you can use the help-text slot. (string)
`inputmode`: The textarea's inputmode attribute. ("decimal" | "email" | "none" | "numeric" | "search" | "tel" | "text" | "url")
`invalid`: This will be true when the control is in an invalid state. Validity is determined by props such as `required`,
`minlength`, and `maxlength` using the browser's constraint validation API. (boolean)
`label`: The textarea's label. Alternatively, you can use the label slot. (string)
`maxlength`: The maximum length of input that will be considered valid. (number)
`minlength`: The minimum length of input that will be considered valid. (number)
`name`: The textarea's name attribute. (string)
`placeholder`: The textarea's placeholder text. (string)
`readonly`: Set to true for a readonly textarea. (boolean)
`required`: The textarea's required attribute. (boolean)
`resize`: Controls how the textarea can be resized. ("auto" | "none" | "vertical")
`rows`: Specifies the number of visible text rows. Defaults to 3 rows (80px height). (number)
`size`: The textarea's size. ("large" | "medium" | "small")
`spellcheck`: The textarea's spellcheck attribute. (boolean)
`value`: The textarea's value attribute. (string)

### Methods
`removeFocus()`
`reportValidity()`
`scrollToBottom()`
`select()`
`setCustomValidity()`
`setFocus()`
`setRangeText()`
`setSelectionRange()`

### Events
`hbr-blur`: Emitted when the control loses focus.
`hbr-change`: Emitted when the control's value changes.
`hbr-focus`: Emitted when the control gains focus.
`hbr-input`: Emitted when the control receives input.

### Slots
`help-text`: Help text that describes how to use the input.
`label`: The textarea's label. Alternatively, you can use the label prop.
`label-info`: Interactive informational content, such as a tooltip trigger, displayed next to the textarea label.
`label-suffix`: Non-interactive content to display inline with the textarea label.

### Custom CSS Properties
--focus-ring: The focus ring style to use when the control receives focus, a `box-shadow` property.
--form-control-asterisk-display: Controls whether the required-field asterisk is displayed. Set to `block` to show the asterisk. Defaults to `none`.

### Parts
`base`: The component's base wrapper.
`char-counter`
`form-control`: The form control that wraps the label, textarea, and help text.
`help-text`: The textarea help text.
`help-text-right`
`label`: The textarea label.
`label-container`: The container that wraps the label and label-info slot.
`prefix`
`suffix`
`textarea`: The textarea control.