# Highlight

Highlight is implemented using the web component: <hbr-highlight>.

## Description
Inline wrapper emphasizing matched or important text.

## Usage
```jsx
export default function Highlight() {
	return (
		<hbr-highlight
			text="This is a key value pair."
			query-text="This"
			case-sensitive={true}
		/>
	);
}

```

## API Reference

### Props
`caseSensitive`: Whether to differentiate between upper and lower case as distinct (true) or equivalent (false). Default is false. (boolean)
`continuous`: Whether to treat queryText as an exact match (true), or to treat each term in the queryText as separate terms which will all be highlighted irrespective of order (false). Default is true. (boolean)
`queryText`: Terms to highlight. (string)
`text`: Text containing the substring(s), instead of using the text prop, using the default slot for the CSS Custom Highlight API, since 2.19.0 (string)
`variant`: Variant of the highlight. ("underline")

### Methods
`getText()`

### Slots
`[default]`: The text to be highlighted, it's using CSS Custom Highlight API when default slot is provided, otherwise it falls back to a legacy implementation that wraps matched text with a span. https://caniuse.com/?search=css-highlight

### Parts
`base`: The component's internal wrapper.
`highlight`: Matching text to be highlighted (bold by default). If using a background color instead, ensure background color:text color ratio has contrast requirement of 4.5:1 to meet accessibility standards. You can verify with this tool https://www.tpgi.com/color-contrast-checker/