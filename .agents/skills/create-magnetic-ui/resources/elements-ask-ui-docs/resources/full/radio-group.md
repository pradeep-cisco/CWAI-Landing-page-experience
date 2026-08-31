# Radio Group

Radio Group is implemented using the web component: <hbr-radio-group>.

## Description
Group of radio buttons for selecting a single option.

## API Reference

### Props
`direction`: direction of the radio group ("column" | "row")
`disabled`:  (boolean)
`error`:  (boolean)
`helpText`: The radio group helpText. (string)
`helpTextId`:  (string)
`label`: The radio group label. Required for proper accessibility. Alternatively, you can use the label slot. (string)
`noFieldset`: Hides the fieldset and legend that the radio group. The label will still be read by screen readers. (boolean)
`required`:  (boolean)
`size`:  ("large" | "medium" | "small" | "xsmall")

### Methods
`getRadioTabindexStatus()`

### Slots
`[default]`: The default slot where radio are placed.
`help-text`: The radio group help-text.
`label`: The radio group label. Required for proper accessibility.
`label-suffix`: Non-interactive content to display inline with the radio group label.

### Custom CSS Properties
--asterisk-color: asterisk color.
--asterisk-font-weight: asterisk font-weight.
--asterisk-margin: asterisk margin.
--form-control-asterisk-display: Controls whether the required-field asterisk is displayed. Set to `block` to show the asterisk. Defaults to `none`.
--help-text-color: help text color.
--help-text-font-size: help text font-size.
--help-text-font-weight: help text font-weight.
--help-text-margin: help text margin.
--label-color: label color.
--label-font-size: label font size.
--label-font-weight: label font weight.
--label-margin: label margin.
--radio-margin-column: column margin of the radio.
--radio-margin-row: row margin of the radio.
--width: width of the radio group.

### Parts
`asterisk`: The asterisk in the label.
`base`: The component's base wrapper.
`children`: The wrapper of the default slot.
`help-text`: The help-text wrapper.
`label`: The label wrapper.
`legend`: The legend element.