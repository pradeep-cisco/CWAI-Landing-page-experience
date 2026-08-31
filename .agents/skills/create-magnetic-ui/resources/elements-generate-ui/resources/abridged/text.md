# Text

Text is implemented using the web component: <hbr-text>.

## Generation Guidance
- PREFER variants for titles: 'page-title' (xl), 'section-title' (lg), 'sub-section-title' (md), 'smallest-title' (sm).
- For accessibility, wrap semantic HTML: <hbr-text variant='page-title'><h1>Title</h1></hbr-text>.
- Text-only mode auto-adds ARIA: <hbr-text variant='section-title'>Overview</hbr-text>.
- Use type='secondary' for metadata/labels, type='primary' for body content.
- Truncation: truncate='multiline' lines={N} for line clamping in cards/lists.

## Usage
```jsx
export default function TextExample() {
	return (
		<hbr-layout direction="column" gap="xl">
			{/* Two Modes: With Elements vs Text-Only */}
			<section>
				<hbr-text type="heading" size="md" weight="bold">
					<h2>Two Modes</h2>
				</hbr-text>
				<hbr-layout direction="column" gap="md">
					<div>
						<hbr-text type="secondary" size="xs">
							With semantic HTML element (uses display: contents)
						</hbr-text>
						<hbr-text variant="page-title">
							<h1>Dashboard Overview</h1>
						</hbr-text>
					</div>
					<div>
						<hbr-text type="secondary" size="xs">
							Text-only mode (adds role="heading" aria-level="1" automatically)
						</hbr-text>
						<br />
						<hbr-text variant="page-title">Dashboard Overview</hbr-text>
					</div>
				</hbr-layout>
			</section>

			{/* Heading Variants */}
			<section>
				<hbr-text type="heading" size="md" weight="bold">
					<h2>Heading Variants</h2>
				</hbr-text>
				<hbr-layout direction="column" gap="lg">
					{/* Primary title variants (24px) */}
					<div>
						<hbr-text type="secondary" size="xs">
							page-title / modal-title / drawer-title (24px, bold)
						</hbr-text>
						<hbr-layout direction="column" gap="xs">
							<hbr-text variant="page-title">
								<h1>Page Title</h1>
							</hbr-text>
							<hbr-text variant="modal-title">
								<h1>Modal title</h1>
							</hbr-text>
							<hbr-text variant="drawer-title">
								<h1>Drawer title</h1>
							</hbr-text>
						</hbr-layout>
					</div>

					{/* Section title (18px) */}
					<div>
						<hbr-text type="secondary" size="xs">
							section-title (18px, bold)
						</hbr-text>
						<hbr-text variant="section-title">
							<h2>Section Title</h2>
						</hbr-text>
					</div>

					{/* Sub-section title (16px) */}
					<div>
						<hbr-text type="secondary" size="xs">
							sub-section-title (16px, bold)
						</hbr-text>
						<hbr-text variant="sub-section-title">
							<h3>Sub-section Title</h3>
						</hbr-text>
					</div>

					{/* Smallest title (14px) */}
					<div>
						<hbr-text type="secondary" size="xs">
							smallest-title (14px, bold)
						</hbr-text>
						<hbr-text variant="smallest-title">
							<h4>Smallest Title</h4>
						</hbr-text>
					</div>
				</hbr-layout>
			</section>

			{/* Type: heading */}
			<section>
				<hbr-text type="heading" size="md" weight="bold">
					<h2>Type: heading</h2>
				</hbr-text>
				<hbr-layout direction="column" gap="sm">
					<hbr-text type="heading" size="xl" weight="bold">
						<h1>Heading XL Bold</h1>
					</hbr-text>
					<hbr-text type="heading" size="lg" weight="bold">
						<h2>Heading LG Bold</h2>
					</hbr-text>
					<hbr-text type="heading" size="md" weight="bold">
						<h3>Heading MD Bold</h3>
					</hbr-text>
					<hbr-text type="heading" size="sm" weight="bold">
						<h4>Heading SM Bold</h4>
					</hbr-text>
				</hbr-layout>
			</section>

			{/* Types: primary, secondary, placeholder */}
			<section>
				<hbr-text type="heading" size="md" weight="bold">
					<h2>Types: primary, secondary, placeholder</h2>
				</hbr-text>
				<hbr-layout direction="column" gap="sm">
					{/* Text-only mode */}
					<hbr-text type="primary" size="md">
						Primary MD - Default text for main content
					</hbr-text>
					<hbr-text type="secondary" size="md">
						Secondary MD - Subdued text for descriptions
					</hbr-text>
					<hbr-text type="placeholder" size="md">
						Placeholder MD - Weakest text for hints
					</hbr-text>
				</hbr-layout>
			</section>

			{/* Sizes */}
			<section>
				<hbr-text type="heading" size="md" weight="bold">
					<h2>Sizes</h2>
				</hbr-text>
				<hbr-layout direction="column" gap="sm">
					{/* Text-only mode */}
					<hbr-text type="primary" size="xl">
						Size XL - Extra large text
					</hbr-text>
					<hbr-text type="primary" size="lg">
						Size LG - Large text
					</hbr-text>
					<hbr-text type="primary" size="md">
						Size MD - Medium text
					</hbr-text>
					<hbr-text type="primary" size="sm">
						Size SM - Small text (default)
					</hbr-text>
					<hbr-text type="primary" size="xs">
						Size XS - Extra small text
					</hbr-text>
				</hbr-layout>
			</section>

			{/* Weights */}
			<section>
				<hbr-text type="heading" size="md" weight="bold">
					<h2>Weights</h2>
				</hbr-text>
				<hbr-layout direction="column" gap="sm">
					<hbr-text type="primary" size="md" weight="normal">
						<span>Normal weight - Regular text</span>
					</hbr-text>
					<hbr-text type="primary" size="md" weight="semibold">
						<span>Semibold weight - Emphasized text</span>
					</hbr-text>
					<hbr-text type="primary" size="md" weight="bold">
						<span>Bold weight - Strong emphasis</span>
					</hbr-text>
				</hbr-layout>
			</section>

			{/* Type: mono */}
			<section>
				<hbr-text type="heading" size="md" weight="bold">
					<h2>Type: mono</h2>
				</hbr-text>
				<hbr-layout direction="column" gap="sm">
					<hbr-text type="mono" size="lg">
						<code>192.168.1.1</code>
					</hbr-text>
					<hbr-text type="mono" size="md">
						<code>const value = "Hello World";</code>
					</hbr-text>
					<hbr-text type="mono" size="sm">
						<code>/usr/local/bin/node</code>
					</hbr-text>
					<hbr-text type="mono" size="xs">
						<code>SHA256:a1b2c3d4e5f6...</code>
					</hbr-text>
				</hbr-layout>
			</section>

			{/* Type: number */}
			<section>
				<hbr-text type="heading" size="md" weight="bold">
					<h2>Type: number (large display)</h2>
				</hbr-text>
				<hbr-layout direction="row" gap="xl">
					<hbr-layout direction="column" gap="2xs" align="center">
						<hbr-text type="number" size="xl" weight="bold">
							<span>128</span>
						</hbr-text>
						<hbr-text type="secondary" size="xs">
							<span>XL</span>
						</hbr-text>
					</hbr-layout>
					<hbr-layout direction="column" gap="2xs" align="center">
						<hbr-text type="number" size="lg" weight="bold">
							<span>256</span>
						</hbr-text>
						<hbr-text type="secondary" size="xs">
							<span>LG</span>
						</hbr-text>
					</hbr-layout>
					<hbr-layout direction="column" gap="2xs" align="center">
						<hbr-text type="number" size="md" weight="bold">
							<span>512</span>
						</hbr-text>
						<hbr-text type="secondary" size="xs">
							<span>MD</span>
						</hbr-text>
					</hbr-layout>
					<hbr-layout direction="column" gap="2xs" align="center">
						<hbr-text type="number" size="sm" weight="bold">
							<span>1024</span>
						</hbr-text>
						<hbr-text type="secondary" size="xs">
							<span>SM</span>
						</hbr-text>
					</hbr-layout>
					<hbr-layout direction="column" gap="2xs" align="center">
						<hbr-text type="number" size="xs" weight="bold">
							<span>2048</span>
						</hbr-text>
						<hbr-text type="secondary" size="xs">
							<span>XS</span>
						</hbr-text>
					</hbr-layout>
				</hbr-layout>
			</section>

			{/* Truncation */}
			<section>
				<hbr-text type="heading" size="md" weight="bold">
					<h2>Truncation</h2>
				</hbr-text>
				<hbr-layout direction="column" gap="md">
					<div style={{ width: "300px" }}>
						<hbr-text type="secondary" size="xs">
							<span>truncate="end"</span>
						</hbr-text>
						<hbr-text type="primary" size="sm" truncate="end">
							<p>
								This is a very long text that will be truncated at the end with
								an ellipsis when it overflows the container.
							</p>
						</hbr-text>
					</div>
					<div style={{ width: "300px" }}>
						<hbr-text type="secondary" size="xs">
							<span>truncate="start"</span>
						</hbr-text>
						<hbr-text type="mono" size="sm" truncate="start">
							<code>
								/Users/username/Documents/projects/my-app/src/components
							</code>
						</hbr-text>
					</div>
					<div style={{ width: "300px" }}>
						<hbr-text type="secondary" size="xs">
							<span>truncate="multiline" lines=&#123;2&#125;</span>
						</hbr-text>
						<hbr-text type="primary" size="sm" truncate="multiline" lines={2}>
							<p>
								This is a longer paragraph that will be clamped to two lines.
								When the text exceeds two lines, it will show an ellipsis at the
								end. This is useful for card descriptions or preview text.
							</p>
						</hbr-text>
					</div>
					<div style={{ width: "300px" }}>
						<hbr-text type="secondary" size="xs">
							<span>truncate="multiline" lines=&#123;3&#125;</span>
						</hbr-text>
						<hbr-text type="primary" size="sm" truncate="multiline" lines={3}>
							<p>
								This is an even longer paragraph that will be clamped to three
								lines. When the text exceeds three lines, it will show an
								ellipsis at the end. This gives more content visibility while
								still maintaining a consistent card height.
							</p>
						</hbr-text>
					</div>
				</hbr-layout>
			</section>

			{/* Common patterns */}
			<hbr-layout variant="dashboard">
				<hbr-text type="heading" size="md" weight="bold">
					<h2>Common Patterns</h2>
				</hbr-text>
				<hbr-layout variant="dashboard:widgets:basic-statistics">
					{/* KPI Card pattern */}
					<hbr-card>
						<hbr-layout direction="column" gap="xs">
							<hbr-text type="secondary" size="sm">
								<span>Total Users</span>
							</hbr-text>
							<hbr-layout direction="row" gap="sm" align="end">
								<hbr-text type="primary" size="md" weight="bold">
									<span>1,234</span>
								</hbr-text>
								<hbr-text type="secondary" size="xs" weight="semibold">
									<span>+12% from last month</span>
								</hbr-text>
							</hbr-layout>
						</hbr-layout>
					</hbr-card>

					{/* Widget header pattern */}
					<hbr-card>
						<hbr-layout direction="column" gap="sm">
							<hbr-layout direction="row" gap="xs">
								<hbr-text type="primary" size="sm" weight="semibold">
									<span>Network Health</span>
								</hbr-text>
								<hbr-text type="secondary" size="xs">
									<span>42 devices</span>
								</hbr-text>
							</hbr-layout>
							<hbr-text type="secondary" size="sm">
								<p>All systems operating normally</p>
							</hbr-text>
						</hbr-layout>
					</hbr-card>

					{/* Code/Technical info pattern */}
					<hbr-card>
						<hbr-layout direction="column" gap="xs">
							<hbr-text type="primary" size="sm" weight="semibold">
								<span>Device Info</span>
							</hbr-text>
							<hbr-layout direction="row" gap="sm">
								<hbr-text type="secondary" size="sm">
									<span>MAC Address:</span>
								</hbr-text>
								<hbr-text type="mono" size="sm">
									<code>00:1A:2B:3C:4D:5E</code>
								</hbr-text>
							</hbr-layout>
							<hbr-layout direction="row" gap="sm">
								<hbr-text type="secondary" size="sm">
									<span>IP Address:</span>
								</hbr-text>
								<hbr-text type="mono" size="sm">
									<code>192.168.1.100</code>
								</hbr-text>
							</hbr-layout>
						</hbr-layout>
					</hbr-card>
				</hbr-layout>
			</hbr-layout>
		</hbr-layout>
	);
}

```

## API Reference

### Props
`length`: Max line length for readability: sm (~60ch), md (~75ch), lg (~90ch). ("lg" | "md" | "sm")
`lines`: Number of lines for multiline truncation. Default: 2. (number)
`size`: Font size from design token scale. ("lg" | "md" | "sm" | "xl" | "xs")
`truncate`: Truncation mode: 'end' (ellipsis), 'start' (clip start), 'multiline' (line clamp). ("end" | "multiline" | "start")
`type`: Text role determining font family and color. ("heading" | "mono" | "number" | "placeholder" | "primary" | "secondary")
`variant`: Semantic variant bundling type, size, and weight.
Maps to: page-title/modal-title/drawer-title (xl bold), section-title (lg bold),
sub-section-title (md bold), smallest-title (sm bold). ("drawer-title" | "modal-title" | "page-title" | "section-title" | "smallest-title" | "sub-section-title")
`weight`: Font weight. ("bold" | "normal" | "semibold")
