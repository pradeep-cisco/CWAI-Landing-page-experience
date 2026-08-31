# Option

Option is implemented using the web component: <hbr-option>.

## Description
component for use within hbr-select.

## API Reference

### Props
`allowSpace`: Set to true to allow spaces in the option's value. (boolean)
`custom`: Set to true to indicate a custom option. (boolean)
`disabled`: Set to true to draw the menu item in a disabled state. (boolean)
`display`: The displayed label when an option is selected. since v2.9.18 (string)
`noCheckMark`: Set to true to hide the check mark. (boolean)
`selected`: selected prop for select component to add (boolean)
`sentiment`: The Option's sentiment. (any)
`size`: The Option's size. ("large" | "medium" | "small")
`truncate`: Truncates the label if it is longer than 3 lines, showing only 3 lines with truncation. (boolean)
`value`: value prop for storing value (any)

### Methods
`getTextLabel()`

### Events
`hbr-option-click`: Emitted when the option is clicked.

### Slots
`[default]`: The option's label. Make sure to use only string text. No other elements are allowed. If you need to use other elements, use the prefix or suffix slot.
`prefix`: An optional prefix, usually an icon or icon button.
`suffix`: An optional suffix, usually an icon or icon button.

### Parts
`base`: The component's base wrapper.
`checked-icon`: The container that wraps the selected icon. 'noCheckMark' prop should be set to false to show the icon.
`label`: The option's label.
`prefix`: The container that wraps the prefix.
`suffix`: The container that wraps the suffix.
`wrapper`: The container that wraps the option. For admin sentiment only.