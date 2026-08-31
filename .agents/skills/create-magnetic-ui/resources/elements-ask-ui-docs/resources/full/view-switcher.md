# View Switcher

View Switcher is implemented using the web component: <hbr-view-switcher>.

## Description
Segmented control for switching between discrete views.

## Usage
```jsx
export default function ViewSwitcher() {
	return (
		<hbr-view-switcher label="Select an option" name="swc1">
			<hbr-radio-button value="1">Option 1</hbr-radio-button>
			<hbr-radio-button value="2">Option 2</hbr-radio-button>
			<hbr-radio-button value="3">Option 3</hbr-radio-button>
		</hbr-view-switcher>
	);
}

```

## API Reference

### Props
`disabled`: Set to true to disable the view switcher. (boolean)
`error`: Set to true to display the view switcher with an error red label in a hbr form (boolean)
`helpText`: The view switcher helpText that works with hbr form control (string)
`helpTextId`: The view switcher helpText id that works with hbr form control (string)
`label`: The view switcher label. Required for proper accessibility. Alternatively, you can use the label slot. (string)
`noFieldset`: Hides the fieldset and legend that is used by view switcher. The label will still be read by screen readers. (boolean)
`required`: Set to true to indicate that the user must select a value before submitting a hbr form. (boolean)
`size`: The view switcher's size. ("large" | "medium" | "small" | "xsmall")
`value`: The current value of the view switcher, submitted as a name/value pair with form data. (string)

### Methods
`reportValidity()`
`setCustomValidity()`

### Events
`hbr-change`: Emitted when the control's value changes.
`hbr-input`: Emitted when the control receives input.

### Slots
`The default slot where `<hbr-radio-button>` element is placed..`:
`help-text`: The radio group help-text.
`label`: The view switcher label. Required for proper accessibility. Alternatively, you can use the `label` attribute.
`label-suffix`: The radio group label-suffix.

### Custom CSS Properties
--form-control-asterisk-display: Controls whether the required-field asterisk is displayed. Set to `block` to show the asterisk. Defaults to `none`.

### Parts
`asterisk`: The asterisk in the label if required is true.
`base`: The component's base wrapper.
`button-group`: The button group that wraps radio buttons.
`button-group__base`: The button group's `base` part.
`children`: The wrapper of the default slot.
`help-text`: The help-text wrapper.
`label`: The label wrapper.
`legend`: The legend element.