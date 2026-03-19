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