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

## API Reference

### Props
`disabled`: Disabled attirbute for the button. (boolean)
`href`: Optional URL to direct the user to when the breadcrumb item is activated. When set, a link will be rendered
internally. When unset, a button will be rendered instead. (string)
`rel`: The `rel` attribute to use on the link. Only used when `href` is set. (string)
`target`: Tells the browser where to open the link. Only used when `href` is set. ("_blank" | "_parent" | "_self" | "_top")

### Events
`hbr-breadcrumb-change`: Emitted when the slot label changes.

### Slots
`[default]`: The breadcrumb item's label.
`prefix`: An optional prefix, usually an icon or icon button.
`separator`: The separator to use for the breadcrumb item. This will only change the separator for this item. If
you want to change it for all items in the group, set the separator on `<hbr-breadcrumb>` instead.
`suffix`: An optional suffix, usually an icon or icon button.

### Parts
`base`: The component's internal wrapper.
`clickable`
`label`: The breadcrumb item's label.
`prefix`: The container that wraps the prefix slot.
`separator`: The container that wraps the separator slot.
`suffix`: The container that wraps the suffix slot.