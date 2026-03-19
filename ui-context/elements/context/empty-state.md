# Empty State 

## Description
Message and visuals shown when a dataset has no items.

## Usage
```jsx
export default function EmptyState() {
	return (
		<hbr-layout
			direction="row"
			style={{ justifyContent: "center", maxWidth: "960px" }}
		>
			<hbr-illustration size="medium">
				<div slot="heading">Optional title</div>
				<div slot="body">Required brief description</div>
				<hbr-button slot="footer">Optional button</hbr-button>
			</hbr-illustration>
		</hbr-layout>
	);
}

```