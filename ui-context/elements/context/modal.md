# Modal

Modal is implemented using the web component: <hbr-modal>.

## Description
Focused overlay displaying information that requires user attention or input.

## Generation Guidance
- For the Magnetic design theme, map design size names to the modal `size` prop as follows: use `size="xsmall"` for design small, `size="small"` for design medium, `size="medium"` for design large, and `size="large"` for design xlarge.
- For long modal content, constrain the modal to the viewport and scroll the content/body area vertically rather than the full page. A common target is max-height around 80vh when the design calls for viewport-constrained modals.
- Prefer wrapping long table/text content inside modals before introducing horizontal scrolling.
- Informational and data-review modals should include an explicit footer action such as Close unless the design shows a different dismissal pattern.
- Use hbr-modal's built-in centered overlay behavior. Do not create a custom modal overlay when hbr-modal can provide the required panel, overlay, title, body, and footer structure.

## Usage
```jsx
import { useRef, useState } from "react";

function FormSection({ title, subtitle, children }) {
	return (
		<hbr-card container>
			<hbr-layout variant="form:section">
				<hbr-layout variant="form:section:header">
					<hbr-text variant="section-title">{title}</hbr-text>
					{subtitle ? (
						<hbr-text type="secondary" size="sm">
							{subtitle}
						</hbr-text>
					) : null}
				</hbr-layout>
				<hbr-layout variant="form:section:body">{children}</hbr-layout>
			</hbr-layout>
		</hbr-card>
	);
}

export default function Modal() {
	const [open, setOpen] = useState(false);
	const [openConfirmation, setOpenConfirmation] = useState(false);
	const [openAnnouncement, setOpenAnnouncement] = useState(false);
	const [formData, setFormData] = useState({
		firstName: "Casey",
		lastName: "Morgan",
		email: "casey.morgan@example.com",
		title: "Product Designer",
		department: "design",
		workspace: "hybrid",
		notifications: true,
		weeklyDigest: false,
		reviewNotes:
			"Use this modal to validate header and footer behavior while the body content scrolls through a realistic form layout.",
	});
	const refTrigger = useRef(null);
	const refTriggerConfirmation = useRef(null);
	const refTriggerAnnouncement = useRef(null);
	const refSave = useRef(null);
	const refConfirmationAction = useRef(null);
	const refAnnouncementAction = useRef(null);

	const _onClickOpen = () => {
		setOpen(true);
	};
	const _onClickOpenConfirmation = () => {
		setOpenConfirmation(true);
	};
	const _onClickOpenAnnouncement = () => {
		setOpenAnnouncement(true);
	};
	const _onClickClose = () => {
		setOpen(false);
	};
	const _onClickCloseConfirmation = () => {
		setOpenConfirmation(false);
	};
	const _onClickCloseAnnouncement = () => {
		setOpenAnnouncement(false);
	};
	const _onHide = (event) => {
		event.preventDefault();
		refTrigger.current.element.setFocus();
	};
	const _onShow = (event) => {
		event.preventDefault();
		refSave.current.element.setFocus();
	};
	const _onHideConfirmation = (event) => {
		event.preventDefault();
		refTriggerConfirmation.current.element.setFocus();
	};
	const _onShowConfirmation = (event) => {
		event.preventDefault();
		refConfirmationAction.current.element.setFocus();
	};
	const _onHideAnnouncement = (event) => {
		event.preventDefault();
		refTriggerAnnouncement.current.element.setFocus();
	};
	const _onShowAnnouncement = (event) => {
		event.preventDefault();
		refAnnouncementAction.current.element.setFocus();
	};
	const setField = (field) => (event) => {
		const nextValue =
			event?.target?.type === "checkbox"
				? event.target.checked
				: event?.target?.value;

		setFormData((current) => ({
			...current,
			[field]: nextValue,
		}));
	};

	return (
		<div>
			{/* Use the following modal code for the most atomic version of the hbr-modal component. */}
			<hbr-modal
				data-theme="onecd"
				label="Modal title"
				open={open}
				size="medium"
				scrollAware={true}
				style={{ "--height": "560px" }}
				onhbr-after-hide={_onHide}
				onhbr-after-show={_onShow}
			>
				<div className="hbr-css__layout-col-md">
					<hbr-text type="secondary" size="sm">
						This demo intentionally includes a longer, interactive form so the
						modal body overflows and you can inspect the scroll-aware header and
						footer treatments.
					</hbr-text>

					<FormSection
						title="Profile Details"
						subtitle="Primary information used for account and workspace settings."
					>
						<hbr-input
							label="First Name"
							value={formData.firstName}
							onhbr-input={setField("firstName")}
						/>
						<hbr-input
							label="Last Name"
							value={formData.lastName}
							onhbr-input={setField("lastName")}
						/>
						<hbr-input
							label="Email"
							type="email"
							value={formData.email}
							onhbr-input={setField("email")}
						/>
						<hbr-input
							label="Job Title"
							value={formData.title}
							onhbr-input={setField("title")}
						/>
					</FormSection>

					<FormSection
						title="Workspace Preferences"
						subtitle="Use a mix of controls so the scrolling state feels closer to a production modal."
					>
						<hbr-select
							label="Department"
							value={formData.department}
							onhbr-change={setField("department")}
						>
							<hbr-option value="design">Design</hbr-option>
							<hbr-option value="engineering">Engineering</hbr-option>
							<hbr-option value="product">Product</hbr-option>
							<hbr-option value="marketing">Marketing</hbr-option>
						</hbr-select>

						<hbr-radio-group
							label="Workspace Type"
							direction="column"
							onhbr-change={setField("workspace")}
						>
							<hbr-radio
								value="remote"
								checked={formData.workspace === "remote"}
							>
								Remote
							</hbr-radio>
							<hbr-radio
								value="hybrid"
								checked={formData.workspace === "hybrid"}
							>
								Hybrid
							</hbr-radio>
							<hbr-radio
								value="onsite"
								checked={formData.workspace === "onsite"}
							>
								On-site
							</hbr-radio>
						</hbr-radio-group>

						<hbr-switch
							label="Notifications"
							checked={formData.notifications}
							onhbr-change={setField("notifications")}
						>
							Enable proactive workflow notifications
							<hbr-text slot="rear" type="secondary" size="sm">
								This control helps test multi-line supporting text inside the
								scrollable body.
							</hbr-text>
						</hbr-switch>

						<hbr-checkbox
							checked={formData.weeklyDigest}
							onhbr-change={setField("weeklyDigest")}
						>
							Send a weekly activity digest
						</hbr-checkbox>
					</FormSection>

					<FormSection
						title="Review Notes"
						subtitle="Longer fields add more vertical space and make the scroll transition easier to inspect."
					>
						<hbr-input
							label="Implementation Notes"
							value={formData.reviewNotes}
							onhbr-input={setField("reviewNotes")}
						/>
						<hbr-text type="secondary" size="sm">
							Check the modal at the top, mid-scroll, and near the bottom. The
							header and footer should stay visually integrated with the panel
							surface as content moves beneath them.
						</hbr-text>
						<hbr-text type="secondary" size="sm">
							The chart behind the overlay is also useful here because it makes
							it easier to judge blur, contrast, and any unwanted seams that
							appear only after the content area starts scrolling.
						</hbr-text>
					</FormSection>

					<FormSection
						title="Approval Checklist"
						subtitle="Additional content to guarantee overflow for footer and header inspection."
					>
						<hbr-checkbox checked>
							Border and panel surface feel consistent through the full scroll
							range
						</hbr-checkbox>
						<hbr-checkbox checked>
							Footer actions remain anchored and visually seamless
						</hbr-checkbox>
						<hbr-checkbox checked>
							Header spacing and close affordance stay stable while scrolling
						</hbr-checkbox>
						<hbr-checkbox checked>
							Overlay blur and panel translucency remain readable over chart
							content
						</hbr-checkbox>
						<hbr-text type="secondary" size="sm">
							This extra section is intentionally verbose so the modal body
							exceeds the available height on typical laptop screens.
						</hbr-text>
					</FormSection>
				</div>
				<hbr-layout
					slot="footer"
					direction="row"
					gap="md"
					style={{ justifyContent: "flex-end" }}
				>
					<hbr-button variant="text" onClick={_onClickClose}>
						Cancel
					</hbr-button>
					<hbr-button variant="fill" onClick={_onClickClose} ref={refSave}>
						Save
					</hbr-button>
				</hbr-layout>
			</hbr-modal>

			{/* Use the following code for confirmation modals that need to adhere to the Magnetic Design Guidelines. For a destructive confirmation modal, use hbr-button with danger sentiment to confirm the deletion action */}
			<hbr-modal
				open={openConfirmation}
				size="xsmall"
				aria={{ role: "alertdialog" }}
				onhbr-after-hide={_onHideConfirmation}
				onhbr-after-show={_onShowConfirmation}
			>
				<div slot="label" className="hbr-css__layout-row-sm">
					<hbr-icon name="alerts-warning-large" sentiment="warning" />
					Confirmation Title
				</div>
				<div>
					Modals are overlays that focus a users attention on information or a
					task without taking them out of context.
				</div>
				<div
					slot="footer"
					className="hbr-css__layout-row-md hbr-css__layout-justify-end"
				>
					<hbr-button variant="text" onClick={_onClickCloseConfirmation}>
						Cancel
					</hbr-button>
					<hbr-button
						variant="fill"
						onClick={_onClickCloseConfirmation}
						ref={refConfirmationAction}
					>
						Got it
					</hbr-button>
				</div>
			</hbr-modal>

			{/* Use the following code for announcement modals that need to adhere to the Magnetic Design Guidelines. Announcement modals should be used for important information that users need to be aware of but do not require an action to be taken. */}
			<hbr-modal
				size="small"
				id="announcement"
				noHeader={true}
				open={openAnnouncement}
				style={{ "--padding": "0" }}
				aria={{
					labelledby: "carousel-title-id",
					describedby: "carousel-content-id",
				}}
				onhbr-after-hide={_onHideAnnouncement}
				onhbr-after-show={_onShowAnnouncement}
			>
				<div
					className="hbr-css__container-empty"
					style={{ width: "100%", height: "232px" }}
				/>
				<div
					className="hbr-css__layout-col-xs hbr-css__layout-align-center"
					style={{ padding: "24px 60px 0" }}
				>
					<div
						className="hbr-css__text-heading-xl-bold"
						role="heading"
						aria-level={3}
						style={{ textAlign: "center" }}
						id="carousel-title-id"
					>
						Announcement Title
					</div>
					<div
						className="hbr-css__text-primary-md"
						style={{ textAlign: "center" }}
						id="carousel-content-id"
					>
						Commodo sed egestas egestas fringilla phasellus faucibus scelerisque
						eleifend. Diam ut venenatis tellus in metus vulputate eu.
					</div>
				</div>
				<div slot="footer" style={{ textAlign: "center" }}>
					<hbr-button
						onClick={_onClickCloseAnnouncement}
						ref={refAnnouncementAction}
					>
						Save
					</hbr-button>
				</div>
			</hbr-modal>

			<hbr-layout
				direction="column"
				gap="md"
				style={{ alignItems: "flex-start" }}
			>
				<hbr-button onClick={_onClickOpen} ref={refTrigger}>
					Open Modal
				</hbr-button>
				<hbr-button
					onClick={_onClickOpenConfirmation}
					ref={refTriggerConfirmation}
				>
					Open confirmation modal
				</hbr-button>
				<hbr-button
					onClick={_onClickOpenAnnouncement}
					ref={refTriggerAnnouncement}
				>
					Open announcement modal
				</hbr-button>
			</hbr-layout>
		</div>
	);
}

```

## API Reference

### Props
`label`: The modal's label as displayed in the header. You should always include a relevant label even when using
`no-header`, as it is required for proper accessibility. (string) 
`open`: Indicates whether or not the modal is open. You can use this in lieu of the show/hide methods. (boolean) 
`size`: The modal's width. Use the css prop --width for custom sizes. ("large" | "medium" | "small" | "xsmall") 