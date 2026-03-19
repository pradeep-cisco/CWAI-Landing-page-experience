# Input

Input is implemented using the web component: <hbr-input>.

## Description
Single-line text or number entry field.

## Usage
```jsx
export default function InputExample() {
	const handleInput = (e) => {
		console.log(e.target.label, ": ", e.target.value);
	};
	return (
		<>
			<hbr-input value="Default value" onInput={handleInput} label="Name">
				<hbr-text slot="label-suffix" type="secondary" size="sm">
					(Optional)
				</hbr-text>
				{/* Optional error message on validation */}
				<div slot="rear">
					<hbr-banner variant="fill" sentiment="negative" open>
						<hbr-icon slot="icon" name="status-negative" sentiment="negative" />
						This is an error message.
					</hbr-banner>
				</div>
			</hbr-input>
			<hbr-input onInput={handleInput} type="date" label="Date of birth" />
			<hbr-input onInput={handleInput} type="time" label="Appointment time" />
		</>
	);
}

```