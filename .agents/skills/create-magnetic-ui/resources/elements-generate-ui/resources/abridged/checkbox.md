# Checkbox

Checkbox is implemented using the web component: <hbr-checkbox>.

## Description
Binary selection control allowing multiple independent choices.

## Usage
```jsx
export default function Checkboxes() {
	const handleChange = (e) => {
		console.log(e.target.name, " : ", e.target.checked);
	};
	return (
		<>
			<hbr-checkbox-group
				direction="column"
				label="Column orientation with medium size"
				onhbr-change={handleChange}
			>
				<hbr-checkbox name="one">One</hbr-checkbox>
				<hbr-checkbox name="two">Two</hbr-checkbox>
			</hbr-checkbox-group>
			<hbr-checkbox-group
				direction="row"
				label="Row orientation samll size"
				size="small"
				onhbr-change={handleChange}
			>
				<hbr-checkbox size="small" name="small-one">
					One
				</hbr-checkbox>
				<hbr-checkbox size="small" name="small-two">
					Two
				</hbr-checkbox>
				{/* Optional error message on validation */}
				<div slot="rear">
					<hbr-banner variant="fill" sentiment="negative" open>
						<hbr-icon slot="icon" name="status-negative" sentiment="negative" />
						This is an error message.
					</hbr-banner>
				</div>
			</hbr-checkbox-group>
			<hbr-checkbox name="license-agreement" onhbr-change={handleChange}>
				I agree to the terms and conditions
			</hbr-checkbox>
			<hbr-checkbox>Unselected</hbr-checkbox>
			<hbr-checkbox indeterminate>Indeterminate</hbr-checkbox>
			<hbr-checkbox disabled>Disabled</hbr-checkbox>
		</>
	);
}

```