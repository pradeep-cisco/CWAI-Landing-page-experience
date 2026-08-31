# List Item

List Item is implemented using the web component: <hbr-list-item>.

## Description
Item within a list providing aligned content and optional interaction.

## API Reference

### Props
`active`: Indicates whether the list item is active. (boolean)
`disabled`: Disables the list item. (boolean)
`variant`: The list item's variant styles such as anchor link menu(anchor). (string)

### Slots
`[default]`: The list item's label.
`prefix`: The list item's prefix content.
`suffix`: The list item's suffix content.

### Custom CSS Properties
--border: border
--border-bottom-active: item border bottom color on hover
--border-left-active: item border left color on hover
--border-left-hover: border left color on hover
--border-right-active: item border right color on hover
--border-top-active: item border top color on hover
--color-bg: background color
--color-bg-medium-hover: background color on hover
--color-text-active: item text color color on hover
--font-size: font size
--line-height: line height
--list-style-type: list(li) style type
--margin: margin
--padding: padding
--pointer: cursor
--width: width

### Parts
`base`: The component's base wrapper.
`children`
`indentation`
`line`
`prefix`
`suffix`