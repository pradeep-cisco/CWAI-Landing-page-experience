# Link

Link is implemented using the web component: <hbr-link>.

## Description
Navigational text element linking to another location.

## API Reference

### Props
`aria`: Attributes related to screen readers. ({ label?: string; })
`circle`: Set to true to draw a circle link. (boolean)
`disabled`: Set to true to disable the link. (boolean)
`download`: Tells the browser to download the linked file as this filename. (string)
`error`: Indicates if error state (boolean)
`href`: URL of the link. (string)
`inline`: Set to true to make the link inline element. since v2.9.12 (boolean)
`linkTitle`:  (string)
`noPadding`: The no padding. (boolean)
`pill`: Set to true to draw a pill-style link with rounded edges. (boolean)
`rel`: When using `href`, this attribute will map to the underlying link's `rel` attribute. Unlike regular links, the
default is `noreferrer noopener` to prevent security exploits. However, if you're using `target` to point to a
specific tab/window, this will prevent that from working correctly. You can remove or change the default value by
setting the attribute to an empty string or a value of your choice, respectively. (string)
`sentiment`: The link's color scheme. ("admin" | "danger" | "default" | "info" | "interact" | "neutral" | "success" | "warning")
`size`: The link's size. ("large" | "medium" | "small")
`target`: Tells the browser where to open the link. ("_blank" | "_parent" | "_self" | "_top")
`variant`: The link styles. ("fill" | "outline" | "text")

### Methods
`removeFocus()`
`setFocus()`

### Events
`hbr-blur`: Emitted when the link loses focus.
`hbr-focus`: Emitted when the link gains focus.

### Slots
`[default]`: The link's label.
`prefix`: Used to prepend an icon or similar element to the link.
`suffix`: Used to append an icon or similar element to the link.

### Custom CSS Properties
--align-items: align items property.
--bg-color-hover: background color on hover.
--border-style: border style property.
--display: display property.
--font-weight: font weight property.
--justify-content: justify content property.
--label-affix-padding-lg: padding between prefix and label on large size link.
--label-affix-padding-md: padding between prefix and label on medium size link.
--label-affix-padding-sm: padding between prefix and label on small size link.
--link-interact-color: link interact color.
--link-interact-color-active: link interact color on active.
--link-interact-color-disabled: link interact color when disabled.
--link-interact-color-hover: link interact color on hover.
--padding: padding property.
--palm-width: link width on responsive design palm.
--text-decoration: text decoration property.
--transition: transition property.
--white-space: white space.
--width: link width.

### Parts
`base`: The component's base wrapper.
`error`: The component's base wrapper with the error state.
`label`: The link's label.
`prefix`: The prefix container.
`suffix`: The suffix container.
`text`: The component's base wrapper for the text link.