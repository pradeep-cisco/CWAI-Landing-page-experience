# Modal

Modal is implemented using the web component: <hbr-modal>.

## Description
Focused overlay displaying information that requires user attention or input.

## Usage
```jsx
import { useRef, useState } from "react";

export default function Modal() {
	const [open, setOpen] = useState(false);
	const [openConfirmation, setOpenConfirmation] = useState(false);
	const [openAnnouncement, setOpenAnnouncement] = useState(false);
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

	return (
		<div>
			{/* Use the following modal code for the most atomic version of the hbr-modal component. */}
			<hbr-modal
				label="Modal Header"
				open={open}
				onhbr-after-hide={_onHide}
				onhbr-after-show={_onShow}
			>
				<div>
					Modals are overlays that focus a users attention on information or a
					task without taking them out of context. They require an interaction
					for the user to see the rest of the page.
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