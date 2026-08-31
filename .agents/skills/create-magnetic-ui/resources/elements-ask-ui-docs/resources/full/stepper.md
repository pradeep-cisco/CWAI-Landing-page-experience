# Stepper

Stepper is implemented using the web component: <hbr-stepper>.

## Description
Wizard component for guided multi-step workflows requiring sequential completion. Use when: (1) tasks have 3+ dependent steps that must be completed in order, (2) each step needs validation before proceeding, (3) users need to review before final submission. Ideal for: device provisioning (add/claim/replace devices), network configuration (VLAN, VPN, wireless setup), security workflows (firewall rules, access policies, 802.1X), scheduled report configuration, firmware upgrades, bulk imports, and any create/configure flow requiring step-by-step guidance. NOT for: viewing data, simple forms, or independent settings. Includes sidebar navigation, step status tracking (disabled/active/done), and action bar (Cancel/Back/Next/Submit).

## Usage
```jsx
import { useEffect, useRef, useState } from "react";

function EnterCredentials({ activeStep, steps, setState }) {
	function handleCompleteClick() {
		const activeIndex = steps.findIndex((step) => step.id === activeStep.id);
		const nextIndex = activeIndex + 1 < steps.length ? activeIndex + 1 : null;
		const updates = {
			// Updates for current step
			[activeStep.id]: {
				// mark this step as done
				status: "done",
				// enable primary button
				layoutProps: { primaryEnabled: true },
			},
		};

		// Updates for next step
		if (typeof nextIndex === "number") {
			// update status of next step as "not" disabled
			updates[steps[nextIndex].id] = { status: "" };
		}
		setState(updates);
	}

	return (
		<div
			style={{
				padding: "var(--hbr-spacing-lg)",
			}}
		>
			<hbr-layout direction="column" gap="md">
				<hbr-layout direction="column" gap="2xs">
					<hbr-text variant="section-title">Enter Credentials</hbr-text>
					<hbr-text type="secondary" size="sm">Subtitle</hbr-text>
				</hbr-layout>
				<div>
					<hbr-button onClick={handleCompleteClick}>Mark complete</hbr-button>
				</div>
			</hbr-layout>
		</div>
	);
}

function NameDevice({ activeStep, steps, setState }) {
	function handleCompleteClick() {
		const activeIndex = steps.findIndex((step) => step.id === activeStep.id);
		const nextIndex = activeIndex + 1 < steps.length ? activeIndex + 1 : null;
		const updates = {
			// Updates for current step
			[activeStep.id]: {
				// mark this step as done
				status: "done",
				// enable primary button
				layoutProps: { primaryEnabled: true },
			},
		};
		// console.log(activeStep, steps, nextIndex);
		// Updates for next step
		if (typeof nextIndex === "number") {
			// update status of next step as "not" disabled
			updates[steps[nextIndex].id] = { status: "" };
		}
		// console.log("NameDevice updates:", updates);
		setState(updates);
	}

	return (
		<div
			style={{
				padding: "var(--hbr-spacing-lg)",
			}}
		>
			<hbr-layout direction="column" gap="md">
				<hbr-layout direction="column" gap="2xs">
					<hbr-text variant="section-title">Name device</hbr-text>
					<hbr-text type="secondary" size="sm">Subtitle</hbr-text>
				</hbr-layout>
				<div>
					<hbr-button onClick={handleCompleteClick}>Mark complete</hbr-button>
				</div>
			</hbr-layout>
		</div>
	);
}

function Precheck({ activeStep, steps, setState }) {
	function handleCompleteClick() {
		const activeIndex = steps.findIndex((step) => step.id === activeStep.id);
		const nextIndex = activeIndex + 1 < steps.length ? activeIndex + 1 : null;
		const updates = {
			// Updates for current step
			[activeStep.id]: {
				// mark this step as done
				status: "done",
				// enable primary button
				layoutProps: { primaryEnabled: true },
			},
		};

		// Updates for next step
		if (typeof nextIndex === "number") {
			// update status of next step as "not" disabled
			updates[steps[nextIndex].id] = { status: "" };
		}
		setState(updates);
	}

	return (
		<div
			style={{
				padding: "var(--hbr-spacing-lg)",
			}}
		>
			<hbr-layout direction="column" gap="md">
				<hbr-layout direction="column" gap="2xs">
					<hbr-text variant="section-title">
						Configure precheck settings
					</hbr-text>
					<hbr-text type="secondary" size="sm">Subtitle</hbr-text>
				</hbr-layout>
				<div>
					<hbr-button onClick={handleCompleteClick}>Mark complete</hbr-button>
				</div>
			</hbr-layout>
		</div>
	);
}

function Summary() {
	return (
		<div
			style={{
				padding: "var(--hbr-spacing-lg)",
			}}
		>
			<hbr-layout direction="column" gap="md">
				<hbr-layout direction="column" gap="2xs">
					<hbr-text variant="section-title">Summary</hbr-text>
					<hbr-text type="secondary" size="sm">Subtitle</hbr-text>
				</hbr-layout>
				<div>Summary of all selections.</div>
			</hbr-layout>
		</div>
	);
}

const defaultProps = {
	cancelLabel: "Cancel",
	cancelEnabled: true,

	secondaryVisible: true,
	secondaryLabel: "Back",

	primaryEnabled: false,
	primaryVisible: true,
	primaryLabel: "Next",

	changesSavedVisible: false,
};

// Init steps
const defaultSteps = [
	{
		label: "Name the device",
		id: "name-device",
		layoutProps: {
			...defaultProps,
			secondaryVisible: false,
			primaryLabel: "Forward",
		},
	},
	{
		label: "Enter Credentials",
		id: "enter-credentials",
		status: "disabled",
		layoutProps: { ...defaultProps },
	},
	{
		label: "Configure pre-check",
		id: "precheck",
		status: "disabled",
		layoutProps: { ...defaultProps },
	},
	{
		label: "Summary",
		id: "summary",
		status: "disabled",
		layoutProps: {
			...defaultProps,
			primaryEnabled: true,
			primaryLabel: "Submit",
		},
	},
];

const views = {
	"name-device": NameDevice,
	"enter-credentials": EnterCredentials,
	precheck: Precheck,
	summary: Summary,
	// completed: Completed,
};

export default function Stepper(props) {
	const [steps, setSteps] = useState(defaultSteps);
	const [activeStepId, setActiveStepId] = useState(defaultSteps[0].id);
	const stepperRef = useRef(null);
	const activeStep = steps.find((step) => step.id === activeStepId);
	const { layoutProps } = activeStep;

	// Handle click event on Stepper shell buttons (re-created when dependencies change)
	function handleStepChange(e) {
		const { type, step } = e.detail;
		const activeIndex = steps.findIndex((s) => s.id === activeStepId);
		let newActiveId = activeStepId;

		// Side nav selection
		if (type === "side-nav" && step && step.id) newActiveId = step.id;
		// Next
		if (
			type === "next" &&
			steps[activeIndex + 1] &&
			steps[activeIndex + 1].status !== "disabled"
		) {
			newActiveId = steps[activeIndex + 1].id;
		}
		// Back
		if (
			type === "back" &&
			steps[activeIndex - 1] &&
			steps[activeIndex - 1].status !== "disabled"
		) {
			newActiveId = steps[activeIndex - 1].id;
		}

		const updates = {};
		const target = steps.find((s) => s.id === newActiveId);
		if (target?.type === "exit") {
			steps.forEach((s) => {
				updates[s.id] = { status: s.id === newActiveId ? "" : "done-disabled" };
			});
		}

		setActiveStepId(newActiveId);
		setSteps((prev) =>
			prev.map((s) => ({
				...s,
				active: s.id === newActiveId,
				...(updates[s.id] || null),
			})),
		);
	}

	// Pass setState mutator to child views
	function setState(updates) {
		setSteps((prev) =>
			prev.map((step) => {
				const stepUpdates = updates[step.id] || {};
				const layoutProps = {
					...(step.layoutProps || {}),
					...(stepUpdates.layoutProps || {}),
				};
				return { ...step, ...stepUpdates, layoutProps };
			}),
		);
	}

	const View = views[activeStepId];

	// Bridge React state to raw custom element since we replaced <HbrStepper /> wrapper.
	useEffect(() => {
		const el = stepperRef.current;
		if (!el) return;
		// Assign complex props as element properties (NOT attributes) so the web component can use them.
		el.steps = steps;
		el.activeStepId = activeStepId;
		// Apply layout props individually as properties (spreading as attributes previously broke behavior).
		if (layoutProps) {
			Object.entries(layoutProps).forEach(([k, v]) => {
				try {
					el[k] = v;
				} catch (_) {
					/* no-op */
				}
			});
		}
	}, [steps, activeStepId, layoutProps]);

	return (
		<div
			style={{
				maxWidth: "960px",
				height: "500px",
				background: "var(--hbr-color-neutral-bg)",
				borderRadius: "var(--hbr-border-radius-xl)",
				boxShadow: "var(--hbr-shadow-sm)",
			}}
			data-testid="stepper"
		>
			{/* Raw web component: complex props & events handled via refs/effects above */}
			<hbr-stepper ref={stepperRef} onhbr-step-change={handleStepChange}>
				<div slot="content" style={{ height: "1500px" }}>
					<View steps={steps} activeStep={activeStep} setState={setState} />
				</div>
			</hbr-stepper>
		</div>
	);
}

```

## API Reference

### Props
`activeStepId`: id of the active step (string)
`aria`: aria accessibility attributes for the stepper
defaults to:
aria={role: "tablist", collapseBtnAriaExpand: "Expand panel", collapseBtnAriaCollapse: "Collapse panel"}
From Starting from version v2.10.3, the Multi-Page Form will support the aria role="list". The external panel can be designated as a region using  or as a form landmark with , with the aria-labelledby attribute appropriately linked to the active step. ({ collapseBtnAriaExpand?: string; collapseBtnAriaCollapse?: string; role?: string; step?: string; completed?: string; })
`cancelEnabled`: enabled state of Cancel button in the footer (boolean)
`cancelLabel`: Label of Cancel button in the footer (string)
`cancelVisible`: visibility state of Cancel button in the footer (boolean)
`changesSavedLabel`: Label of Cancel button in the footer (string)
`changesSavedVisible`: visibility state of Cancel button in the footer (boolean)
`collapsed`: Is the nav in collapsed state (boolean)
`collapsible`: Show the button that collapses left bar (boolean)
`direction`:  ("column" | "row")
`hideLeft`:  (boolean)
`primaryEnabled`: enabled state of Cancel button in the footer (boolean)
`primaryLabel`: Label of Cancel button in the footer (string)
`primaryVisible`: visibility state of Cancel button in the footer (boolean)
`raisedFooter`:  (boolean)
`secondaryEnabled`: enabled state of Cancel button in the footer (boolean)
`secondaryLabel`: Label of Cancel button in the footer (string)
`secondaryVisible`: visibility state of Cancel button in the footer (boolean)
`stepPanelWidth`: Width of the expanded step panel in pixels.
Values are clamped to the approved 200px-400px range. (number)
`steps`: List of steps to be rendered by the stepper (Step[])

### Events
`hbr-collapse`: the sidenav is collapsed
`hbr-expand`: the sidenav is collapsed
`hbr-step-change`: event emitted when any of navigational elements are clicked. event.detail has the "type" of change event and clicked "step"

### Slots
`content`: Step view
`footer`: header slot of the main area, usually renders nav buttons
`header`: header slot of the main area
`left`: Left side nav area

### Parts
`base`
`collapse-button`