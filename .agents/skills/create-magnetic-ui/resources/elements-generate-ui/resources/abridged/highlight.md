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