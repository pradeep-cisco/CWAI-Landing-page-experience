# Key Value Pairs

Key Value Pairs is implemented using the web component: <hbr-key-value-pairs>.

## Description
Displays labeled data pairs using semantic dl/dt/dd markup.

Automatically styles dt (secondary text) and dd (primary text) elements.
Multiple dl elements create a grouped layout with consistent spacing.

## Generation Guidance
- REQUIRED: Always wrap dt/dd pairs in dl elements for proper semantics.
- Do NOT wrap dt/dd in hbr-text - the component auto-applies secondary/primary styling.
- Use direction='row' for metadata displays, direction='column' for descriptions.
- Use align='end' for right-aligned values (e.g., currency, numbers).

## Usage
```jsx
export default function KeyValuePairsWidget() {
	// Can be used standalone or as a dashboard widget
	return (
		<>
			{/* Key next to value - Emphasis: keys, Best for long list or limited vertical space */}
			<hbr-card container>
				<hbr-key-value-pairs direction="row">
					<dl>
						<dt>Name</dt>
						<dd>Evan Hansen</dd>
						<dt>Email</dt>
						<dd>evanhansen123@meraki.net</dd>
						<dt>Phone number</dt>
						<dd>123-456-7890</dd>
					</dl>
				</hbr-key-value-pairs>
			</hbr-card>

			{/* Key above value - Emphasis: values, Best for short list or limited horizontal space */}
			<hbr-card container>
				<hbr-key-value-pairs direction="column">
					<dl>
						<dt>Name</dt>
						<dd>Evan Hansen</dd>
						<dt>Email</dt>
						<dd>evanhansen123@meraki.net</dd>
						<dt>Phone number</dt>
						<dd>123-456-7890</dd>
					</dl>
				</hbr-key-value-pairs>
			</hbr-card>

			{/* Grouped (implicit) - Multiple dl elements = automatic group */}
			<hbr-card container>
				<hbr-key-value-pairs direction="row">
					<dl>
						<dt>Name</dt>
						<dd>Evan Hansen</dd>
						<dt>Email</dt>
						<dd>evanhansen123@meraki.net</dd>
						<dt>Phone number</dt>
						<dd>123-456-7890</dd>
					</dl>
					<dl>
						<dt>Company</dt>
						<dd>Cisco Systems, Inc.</dd>
						<dt>Job title</dt>
						<dd>Software engineer</dd>
					</dl>
				</hbr-key-value-pairs>
			</hbr-card>

			{/* Grouped (implicit) - Column layout with multiple sections */}
			<hbr-card container>
				<hbr-key-value-pairs direction="column">
					<dl>
						<dt>Name</dt>
						<dd>Evan Hansen</dd>
						<dt>Email</dt>
						<dd>evanhansen123@meraki.net</dd>
						<dt>Phone number</dt>
						<dd>123-456-7890</dd>
					</dl>
					<dl>
						<dt>Company</dt>
						<dd>Cisco Systems, Inc.</dd>
						<dt>Job title</dt>
						<dd>Software engineer</dd>
						<dt>Address</dt>
						<dd>123 Main St, San Francisco, CA 94105</dd>
					</dl>
					<dl>
						<dt>Time zone</dt>
						<dd>PST</dd>
						<dt>Hobbies</dt>
						<dd>Hiking, Riding</dd>
					</dl>
				</hbr-key-value-pairs>
			</hbr-card>
		</>
	);
}

```

## API Reference

### Props
`align`: Value alignment in row direction: 'start' (left) or 'end' (right). ("end" | "start")
`direction`: Layout: 'row' for horizontal key-value, 'column' for stacked. Default: row. ("column" | "row")
`noGap`: Removes gap between pairs when true. (boolean)
`size`: Spacing preset: 'sm' for compact, 'md' for standard. Default: md. ("md" | "sm")