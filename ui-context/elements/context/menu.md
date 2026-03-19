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