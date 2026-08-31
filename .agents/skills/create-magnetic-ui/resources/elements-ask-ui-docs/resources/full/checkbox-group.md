# Checkbox Group

Checkbox Group is implemented using the web component: <hbr-checkbox-group>.

## Description
Group of checkboxes for selecting multiple options.

## Usage
```jsx
export default function CheckboxGroup() {
	return (
		<>
			<hbr-checkbox-group
				direction="column"
				label="Column orientation with medium size"
			>
				<hbr-checkbox name="one">One</hbr-checkbox>
				<hbr-checkbox name="two">Two</hbr-checkbox>
			</hbr-checkbox-group>
		</>
	);
}

```

## API Reference

### Props
`direction`: direction of the checkbox group ("column" | "row")
`disabled`:  (boolean)
`error`:  (boolean)
`helpText`: The checkbox group helpText. (string)
`helpTextId`:  (string)
`label`: The checkbox group label. Required for proper accessibility. Alternatively, you can use the label slot. (string)
`noFieldset`: Hides the fieldset and legend that the checkbox group. The label will still be read by screen readers. (boolean)
`required`:  (boolean)
`size`:  ("large" | "medium" | "small" | "xsmall")

### Slots
`[default]`: The default slot where checkbox are placed.
`help-text`: The radio group help-text.
`label`: The checkbox group label. Required for proper accessibility.
`label-suffix`: Non-interactive content to display inline with the checkbox group label.

### Custom CSS Properties
--asterisk-color: asterisk color.
--asterisk-font-weight: asterisk font-weight.
--asterisk-margin: asterisk margin.
--checkbox-margin-column: column margin of the checkbox.
--checkbox-margin-row: row margin of the checkbox.
--form-control-asterisk-display: Controls whether the required-field asterisk is displayed. Set to `block` to show the asterisk. Defaults to `none`.
--help-text-color: help text color.
--help-text-font-size: help text font-size.
--help-text-font-weight: help text font-weight.
--help-text-margin: help text margin.
--label-color: label color.
--label-font-size: label font size.
--label-font-weight: label font weight.
--label-margin: label margin.
--width: width of the checkbox group.

### Parts
`asterisk`: The asterisk in the label.
`base`: The component's base wrapper.
`children`: The wrapper of the default slot.
`help-text`: The help-text wrapper.
`label`: The label wrapper.
`legend`: The legend element.