# Breadcrumb

Breadcrumb is implemented using the web component: <hbr-breadcrumb>.

## Description
Navigation trail showing the user's hierarchical location.

## Usage
```jsx
export default function Breadcrumb() {
	const crumbs = [
		"Level 1 page",
		"Level 2 page",
		"Level 3 page",
		"Level 4 page",
		"Level 5 page",
	];
	return (
		<hbr-layout direction="column" gap="2xs">
			<hbr-breadcrumb>
				{crumbs.map((crumb) => (
					<hbr-breadcrumb-item
						onClick={(event) => {
							console.log(event, crumb);
						}}
						key={crumb}
					>
						{crumb}
					</hbr-breadcrumb-item>
				))}
			</hbr-breadcrumb>
			<hbr-text variant="page-title">Level 6 Page Title</hbr-text>
		</hbr-layout>
	);
}

```

## API Reference

### Props
`label`: The input's type for a11y purposes (aria-label). (string)
`truncate`: auto truncate with ellipsis based on container width (boolean)

### Slots
`[default]`: The default slot for breadcrumb items(s).
`separator`: The breadcrumb item's separator slot that is cloned and appended to each breadcrumb item.

### Parts
`base`: The component's internal wrapper.
`list`