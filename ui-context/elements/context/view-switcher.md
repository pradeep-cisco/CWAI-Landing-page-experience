# View Switcher

View Switcher is implemented using the web component: <hbr-view-switcher>.

## Description
Segmented control for switching between discrete views.

## Usage
```jsx
export default function ViewSwitcher() {
	return (
		<hbr-view-switcher label="Select an option" name="swc1">
			<hbr-radio-button value="1">Option 1</hbr-radio-button>
			<hbr-radio-button value="2">Option 2</hbr-radio-button>
			<hbr-radio-button value="3">Option 3</hbr-radio-button>
		</hbr-view-switcher>
	);
}

```