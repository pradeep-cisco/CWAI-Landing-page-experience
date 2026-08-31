# List

List is implemented using the web component: <hbr-list>.

## Description
Semantic list container for grouped list items.

## API Reference

### Props
`anchor`: Indicates used as an anchor link menu. (boolean)
`arialabel`:  (string)
`nested`: Indicates used as a nested list. (boolean)
`ordered`: The Ordered List "ol" element. (boolean)
`size`: The list container size. since v2.15.1.
Moving from "xl", "lg", "md", "sm" to "xlarge", "large", "medium", "small" ("large" | "medium" | "small" | "xlarge")
`spacing`: The list container spacing. since v2.14.12 ("compact" | "spacious")
`variant`: The list container styles like "outline" or "list". ("interactive" | "list" | "outline")

### Events
`hbr-click`: Emitted when clicking the list.

### Slots
`[default]`: The list container's content.

### Custom CSS Properties
--bg-color: background color
--border: border
--border-radius: border radius
--box-shadow: box shadow
--list-style-type: list(li) style type
--margin: margin
--padding: padding
--width: width

### Parts
`base`: The component's base wrapper.
`line`