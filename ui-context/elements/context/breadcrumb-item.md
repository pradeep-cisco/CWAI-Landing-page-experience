# Breadcrumb Item

Breadcrumb Item is implemented using the web component: <hbr-breadcrumb-item>.

## Description
Breadcrumb items are used as children of hbr-breadcrumb.

## Usage
```jsx
export default function BreadcrumbItem() {
	return (
		<hbr-layout direction="column" gap="2xs">
			<hbr-breadcrumb>
				<hbr-breadcrumb-item>Crumb</hbr-breadcrumb-item>
			</hbr-breadcrumb>
		</hbr-layout>
	);
}

```