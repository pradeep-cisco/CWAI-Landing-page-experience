# Radio Button

Radio Button is implemented using the web component: <hbr-radio-button>.

## Description
Radio styled as a button for exclusive selection.

## API Reference

### Props
`aria`: Attributes related to screen readers. ({ label?: string; })
`disabled`: Disables the radio button. (boolean)
`pill`: Draws a pill-style radio button with rounded edges. (boolean)
`size`: The radio button's size. ("large" | "medium" | "small")
`tooltip`: Tooltip content if the icon button serves as a tooltip reference. (string)
`value`: The radio's value. When selected, the radio group will receive this value. (string)

### Events
`hbr-blur`: Emitted when the button loses focus.
`hbr-focus`: Emitted when the button gains focus.

### Slots
`[default]`: The radio button's label.
`prefix`: A presentational prefix icon or similar element.
`suffix`: A presentational suffix icon or similar element.

### Custom CSS Properties
--bg-color
--bg-color-active
--bg-color-hover
--border
--border-color
--border-color-active
--border-color-hover
--border-style
--border-width
--label-affix-padding-lg: padding between prefix and label on large size button.
--label-affix-padding-md: padding between prefix and label on medium size button.
--label-affix-padding-sm: padding between prefix and label on small size button.
--label-color
--label-color-active
--label-color-hover
--label-font-size
--label-font-weight
--label-icon-color
--label-icon-color-hover
--palm-width: button width on responsive design palm.

### Parts
`base`: The component's base wrapper.
`caret`: The button's caret.
`error`: The component's base wrapper with the error state.
`label`: The button's label.
`prefix`: The prefix container.
`suffix`: The suffix container.
`text`: The component's base wrapper for the text button.