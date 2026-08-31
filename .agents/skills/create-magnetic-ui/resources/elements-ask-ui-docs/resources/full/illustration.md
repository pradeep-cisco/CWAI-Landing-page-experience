# Illustration

Illustration is implemented using the web component: <hbr-illustration>.

## Description
Decorative or explanatory graphic asset.

## API Reference

### Props
`asset`: Asset used as icon for non autoloading components ((() => string) | string)
`direction`: Alignment column or row ("column" | "row")
`height`: Height of the illustrated icon - deprecated (string)
`name`: Name of icon used as illustration (any)
`sentiment`: Sentiment of the illustrated icon ("danger" | "info" | "interact" | "neutral" | "success" | "warning")
`size`: Size of the illustration ("large" | "medium" | "small")
`staticColors`: Retain static colors hardcoded in the svg file of the icon instead of replacing them with css properties by default (boolean)
`width`: Width of the illustrated icon - deprecated (string)

### Slots
`body`:
`footer`:
`heading`:
`image`:

### Custom CSS Properties
--content-width: width of content below illustration

### Parts
`content`: heading, body and footer parts of the illustration
`image`: hero image of the illustration