# Radio

Radio is implemented using the web component: <hbr-radio>.

## Description
Single-choice selection control within a radio group.

## Usage
```jsx
export default function Radios() {
	const handleClick = (e) => {
		console.log(e.target.name, " : ", e.target.checked);
	};
	return (
		<>
			<hbr-radio-group
				direction="column"
				label="Column orientation with medium size"
				onhbr-click={handleClick}
			>
				<hbr-radio name="one">One</hbr-radio>
				<hbr-radio name="two">Two</hbr-radio>
				{/* Optional error message on validation */}
				<div slot="rear">
					<hbr-banner variant="fill" sentiment="negative" open>
						<hbr-icon slot="icon" name="status-negative" sentiment="negative" />
						This is an error message.
					</hbr-banner>
				</div>
			</hbr-radio-group>
			<hbr-radio-group
				direction="row"
				label="Row orientation samll size"
				size="small"
				onhbr-click={handleClick}
			>
				<hbr-radio size="small" name="small-one">
					One
				</hbr-radio>
				<hbr-radio size="small" name="small-two">
					Two
				</hbr-radio>
			</hbr-radio-group>
			<hbr-radio name="license-agreement" onhbr-click={handleClick}>
				I agree to the terms and conditions
			</hbr-radio>
			<hbr-radio>Unselected</hbr-radio>
			<hbr-radio disabled>Disabled</hbr-radio>
		</>
	);
}

```