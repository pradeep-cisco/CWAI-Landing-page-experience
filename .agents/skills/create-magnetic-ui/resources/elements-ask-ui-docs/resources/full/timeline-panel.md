# Timeline Panel

Timeline Panel is implemented using the web component: <hbr-timeline-panel>.

## Description
Section of a timeline detailing a single event.

## API Reference

### Props
`aria`: Attributes related to screen readers. ({ level?: number; })
`collapsible`: Make the activity timeline panel collapsible to display additional content (boolean)
`label`:
The label to show in the activity timeline header. If you need to display HTML, use the `header` slot instead. (string)
`open`: Indicates whether or not the activity panel is open (boolean)
`progress`:  (number)
`subtext`: Subtitle of the activity timeline header. (string)
`variant`: variant of the panel. Possible values are default, progress, error, complete and inactive ("complete" | "default" | "error" | "inactive" | "progress")

### Methods
`show()`

### Events
`hbr-after-hide`: Emitted after the activity closes and all transitions are complete.
`hbr-after-show`: Emitted after the activity opens and all transitions are complete.
`hbr-hide`: Emitted when the activity closes. Calling `event.preventDefault()` will prevent it from being closed.
`hbr-show`: Emitted when the activity panel opens. Calling `event.preventDefault()` will prevent it from being opened.

### Slots
`[default]`: The panel' content.
`header`: The panel's header. Alternatively, you can use the label and subtext prop.
`icon`: The icon status for the activity timeline.
`trigger`: The expand/collapse trigger icon.

### Parts
`base`: The component's base wrapper.
`content`: The timeline panel's content.
`header`: The label header.
`label`: The panel's label.
`subtext`: The panel's subtitle.
`trigger`: The expand/collapse trigger icon.