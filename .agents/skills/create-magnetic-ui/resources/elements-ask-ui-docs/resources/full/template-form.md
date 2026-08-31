# Form (Template)

## Description
Single-section form template. Use when form has one logical group of fields. Sticky action bar goes INSIDE the section.

## Generation Guidance
- Use for simple forms with a single logical section.
- Structure: form > card > form:section > [form:section:header + form:section:body + sticky-action-bar].
- Sticky action bar goes INSIDE the form:section (after form:section:body).
- Each section has form:section:header (title/description) and form:section:body (fields).
- For forms with multiple sections, use form-multi-section template instead.

## Usage
```jsx
import { useState } from "react";

export default function App() {
	const [name, setName] = useState("");
	const [city, setCity] = useState("SF");
	const handleSelect = (event) => {
		setCity(event.target.value);
	};
	const handleInput = (event) => {
		setName(event.target.value);
	};
	const handleSubmit = (event) => {
		event.preventDefault();
		alert(`Name: ${name}, City: ${city}`);
	};
	return (
		<form onSubmit={handleSubmit}>
			<hbr-layout variant="form">
				<hbr-card container>
					<hbr-layout variant="form:section">
						<hbr-layout variant="form:section:header">
							<hbr-text variant="section-title">Form title</hbr-text>
							<hbr-text type="secondary" size="sm">
								Subtitle optionally describing the form
							</hbr-text>
						</hbr-layout>

						<hbr-layout variant="form:section:body">
							<hbr-select label="City" value={city} onhbr-change={handleSelect}>
								<hbr-option value="SF">San Francisco</hbr-option>
								<hbr-option value="Berlin">Berlin</hbr-option>
							</hbr-select>

							{/* <help-text-pattern> All form elements support an optional "help-text" attribute to show contextual copy </help-text-pattern> */}
							<hbr-input
								help-text="Enter your full name"
								value={name}
								onInput={handleInput}
								label="Name"
							>
								<hbr-text slot="label-suffix" type="secondary" size="sm">
									(Optional)
								</hbr-text>
								{/*  <validation-pattern> All form elements support an optional "rear" slot to show error message banners, this pattern is used for required and regex validations </validation-pattern> */}
								<div slot="rear">
									<hbr-banner variant="fill" sentiment="danger" open>
										<hbr-icon
											slot="icon"
											name="status-negative"
											sentiment="danger"
										/>
										This is an error message.
									</hbr-banner>
								</div>
							</hbr-input>

							<hbr-switch checked>
								<div slot="label">
									<span>Label</span>
									<hbr-icon
										name="info"
										style={{ color: "var(--base-text-medium-default)" }}
									/>
								</div>
								Toggle
								<hbr-text slot="rear" type="secondary" size="sm">
									Amet minim mollit non deserunt ullamco est sit aliqua dolor do
									amet sint. Velit officia consequat duis enim velit mollit.
									Exercitation veniam consequat.
								</hbr-text>
							</hbr-switch>

							{/* <form-grouping> Optional form grouping for closely related form elements separated by a hbr-divider </form-grouping> */}
							<hbr-divider no-padding />
							<hbr-layout direction="column" gap="xs">
								<hbr-text variant="sub-section-title">
									Optional section label
								</hbr-text>
								<hbr-text type="secondary" size="xs">
									Optional contextual copy about this section.
								</hbr-text>
							</hbr-layout>
							<hbr-input value={name} onInput={handleInput} label="Name">
								<hbr-text slot="label-suffix" type="secondary" size="sm">
									(Optional)
								</hbr-text>
							</hbr-input>
						</hbr-layout>

						{/* In a form with a single section, to render action buttons, the sticky action bar should be placed at the bottom of the form section */}
						<hbr-sticky-action-bar variant="body-content">
							<hbr-button type="submit">Submit</hbr-button>
							<hbr-button variant="text">Cancel</hbr-button>
						</hbr-sticky-action-bar>
					</hbr-layout>
				</hbr-card>
			</hbr-layout>
		</form>
	);
}

```