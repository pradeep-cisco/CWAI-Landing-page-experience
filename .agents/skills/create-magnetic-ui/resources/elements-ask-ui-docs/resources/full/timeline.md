# Timeline

Timeline is implemented using the web component: <hbr-timeline>.

## Description
Chronological sequence of events or steps.

## Usage
```jsx
export default function Timeline() {
	const tenMinsAgo = new Date(new Date().getTime() - 600000);
	const timestamp = new Intl.DateTimeFormat("en-US", {
		dateStyle: "medium",
		timeStyle: "long",
		hour12: false,
	}).format(tenMinsAgo);

	return (
		<hbr-layout direction="column" gap="xl">
			<hbr-timeline>
				<hbr-timeline-panel
					variant="complete"
					label="Header"
					subtext={timestamp}
					aria={{ level: 3 }}
				/>
				<hbr-timeline-panel
					variant="progress"
					label="Header"
					subtext={timestamp}
					open={true}
					aria={{ level: 3 }}
				>
					<hbr-text length="md">
						Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet
						sint. Velit officia consequat duis enim velit mollit.
					</hbr-text>
				</hbr-timeline-panel>
				<hbr-timeline-panel
					variant="inactive"
					label="Header"
					subtext="Not started"
					aria={{ level: 3 }}
				/>
				<hbr-timeline-panel
					variant="error"
					label="Header"
					subtext="Error"
					aria={{ level: 3 }}
				/>
			</hbr-timeline>

			<hbr-timeline>
				<hbr-timeline-panel
					label="Header"
					subtext={timestamp}
					aria={{ level: 3 }}
				/>
				<hbr-timeline-panel
					label="Header"
					subtext={timestamp}
					aria={{ level: 3 }}
				/>
			</hbr-timeline>
		</hbr-layout>
	);
}

```

## API Reference

### Slots
`[default]`: The activity timeline default content for all panels.