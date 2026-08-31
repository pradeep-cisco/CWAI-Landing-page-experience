# Menu

Menu is implemented using the web component: <hbr-menu>.

## Description
Container listing options for user selection.

## Usage
```jsx
export default function Menu() {
	return (
		<hbr-menu>
			<hbr-menu-item value="undo">Undo</hbr-menu-item>
			<hbr-menu-item value="redo">Redo</hbr-menu-item>
			<hbr-menu-divider />
			<hbr-menu-item value="cut">Cut</hbr-menu-item>
			<hbr-menu-item value="copy">Copy</hbr-menu-item>
			<hbr-menu-item value="paste">Paste</hbr-menu-item>
			<hbr-menu-item value="delete">Delete</hbr-menu-item>
		</hbr-menu>
	);
}

```

## API Reference

### Props
`cascading`: Set this to true in case of using inside the hbr-cascader. (boolean)
`last`: Deprecated, Set this to true if this is the last menu in a hbr-shell-nav. This is to set padding bottom to 0. (boolean)
`nav`: Set this to true when you are use menu on navigation (boolean)
`nested`: Set this to true in case of using inside another hbr-menu. (boolean)
`textWrap`: Set this to true to enable text wrapping for menu items. (boolean)
`variant`: Defines the menu's visual style. ("context")

### Methods
`getMenuItems()`
`typeToSelect()`

### Events
`hbr-select`: Emitted when a menu item is selected.

### Slots
`[default]`: The menu's content, including menu items, menu dividers, and menu labels.

### Custom CSS Properties
--background: background color
--border: border
--border-radius: border radius
--box-shadow: box shadow
--max-width: max width
--min-width: min width
--padding: padding
--width: width

### Parts
`base`: The component's base wrapper.