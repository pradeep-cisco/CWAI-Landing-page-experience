# Form Multi Section (Template)

## Description
Multi-section form template. Use when form has multiple distinct sections (e.g., Basic Info, Preferences, Settings). Sticky action bar goes OUTSIDE sections at the form level.

## Generation Guidance
- Use for complex forms with multiple logical sections.
- Structure: form > [card > form:section]* + sticky-action-bar.
- Each section is wrapped in its own hbr-card container.
- Sticky action bar goes OUTSIDE all sections (at form level, as last child).
- Use hbr-divider within sections to group related fields.
- Sections are responsive: column layout on mobile, row layout on larger screens.

## Usage
```jsx
// MULTI-SECTION FORM TEMPLATE
// Use when form has multiple distinct sections
// Sticky action bar goes OUTSIDE sections (at form level)

import { useState } from "react";

// Reusable form section component
function FormSection({ title, subtitle, children }) {
	return (
		<hbr-card container>
			<hbr-layout variant="form:section">
				<hbr-layout variant="form:section:header">
					<hbr-text variant="section-title">{title}</hbr-text>
					{subtitle && (
						<hbr-text type="secondary" size="sm">
							{subtitle}
						</hbr-text>
					)}
				</hbr-layout>
				<hbr-layout variant="form:section:body">{children}</hbr-layout>
			</hbr-layout>
		</hbr-card>
	);
}

export default function FormMultiSection() {
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		department: "",
		role: "",
		notifications: true,
		newsletter: false,
	});

	const handleSubmit = (e) => {
		e.preventDefault();
		alert(JSON.stringify(formData, null, 2));
	};

	return (
		<form onSubmit={handleSubmit}>
			<hbr-layout variant="form">
				{/* Section 1: Basic Information */}
				<FormSection
					title="Basic Information"
					subtitle="Enter your personal details"
				>
					<hbr-input
						label="Full Name"
						value={formData.name}
						onhbr-input={(e) =>
							setFormData({ ...formData, name: e.target.value })
						}
					/>
					<hbr-input
						label="Email"
						type="email"
						value={formData.email}
						onhbr-input={(e) =>
							setFormData({ ...formData, email: e.target.value })
						}
					/>
				</FormSection>

				{/* Section 2: Work Details */}
				<FormSection
					title="Work Details"
					subtitle="Configure your work profile"
				>
					<hbr-select
						label="Department"
						value={formData.department}
						onhbr-change={(e) =>
							setFormData({ ...formData, department: e.target.value })
						}
					>
						<hbr-option value="engineering">Engineering</hbr-option>
						<hbr-option value="design">Design</hbr-option>
						<hbr-option value="product">Product</hbr-option>
						<hbr-option value="marketing">Marketing</hbr-option>
					</hbr-select>

					<hbr-radio-group
						label="Role"
						direction="column"
						onhbr-change={(e) =>
							setFormData({ ...formData, role: e.target.value })
						}
					>
						<hbr-radio value="individual">Individual Contributor</hbr-radio>
						<hbr-radio value="lead">Team Lead</hbr-radio>
						<hbr-radio value="manager">Manager</hbr-radio>
					</hbr-radio-group>
				</FormSection>

				{/* Section 3: Preferences */}
				<FormSection
					title="Preferences"
					subtitle="Configure notification settings"
				>
					<hbr-switch
						label="Notifications"
						checked={formData.notifications}
						onhbr-change={(e) =>
							setFormData({ ...formData, notifications: e.target.checked })
						}
					>
						Enable email notifications
						<hbr-text slot="rear" type="secondary" size="sm">
							Receive updates about your account activity and important
							announcements.
						</hbr-text>
					</hbr-switch>

					<hbr-divider />

					<hbr-checkbox
						checked={formData.newsletter}
						onhbr-change={(e) =>
							setFormData({ ...formData, newsletter: e.target.checked })
						}
					>
						Subscribe to newsletter
					</hbr-checkbox>
				</FormSection>

				{/* Sticky action bar OUTSIDE sections for multi-section forms */}
				<hbr-sticky-action-bar variant="body-content">
					<hbr-button type="submit">Save Changes</hbr-button>
					<hbr-button variant="text" type="button">
						Cancel
					</hbr-button>
				</hbr-sticky-action-bar>
			</hbr-layout>
		</form>
	);
}

```