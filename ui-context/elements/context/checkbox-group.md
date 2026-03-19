# Checkbox Group

Checkbox Group is implemented using the web component: <hbr-checkbox-group>.

## Description
Group of checkboxes for selecting multiple options.

## Usage
```jsx
export default function CheckboxGroup() {
	return (
		<>
			<hbr-checkbox-group
				direction="column"
				label="Column orientation with medium size"
			>
				<hbr-checkbox name="one">One</hbr-checkbox>
				<hbr-checkbox name="two">Two</hbr-checkbox>
			</hbr-checkbox-group>
		</>
	);
}

```