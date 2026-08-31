# Page Title

## Description
Page title and content container.

## Generation Guidance
- All pages should have a page title, use this component to render the page title. and content below it.
- Use the Default Page Title below by default, unless the user asks for something simpler
- Do not use breadcrumbs in your chosen Page Title unless the page is a descendant/child of another page
- DO NOT put other contents aside from the elements in this Usage section under `hbr-css__page-title-container`, this container is only for the page title. Putting other page content inside it will violate the harbor elements design system.

## Usage
```jsx
// NOTE FOR LLMs:
// This file contains SIX page title layout examples demonstrating different configurations of page title.
// Keep each example small & focused when generating new code. Prefer cloning
// one pattern that best matches the requested scenario instead of mixing concerns.
// When asked for "a page title" etc., return ONLY the corresponding component JSX, not the whole group.
//
// Page Title Anatomy (top to bottom):
// 1. Top line - breadcrumbs and actions that can impact the entire page
// 2. Page title - may contain tags, filters, loading status, and page-level actions like "Add XXX"
// 3. Page description - Key top-level information to highlight
// 4. Page label like MAC details - can be placed next to primary tabs
// 5. Primary tabs - switch contents below it
//

/* ===================== DEFAULT PAGE TITLE ===================== */
// BEGIN: DefaultPageTitleExample
// Purpose: Shows elements #2, #3 - page title and description
export function DefaultPageTitleExample() {
	return (
		<hbr-layout variant="page:header">
			{/** Title */}
			<hbr-layout direction="row" gap="sm">
				<hbr-text variant="page-title">Page title</hbr-text>

				{/** Tags */}
				<hbr-layout direction="row" gap="2xs">
					<hbr-tag sentiment="positive">
						<hbr-icon
							slot="prefix"
							name="alerts-positive-large"
							style={{ fontSize: "18px" }}
							sentiment="positive"
						/>
						Online
					</hbr-tag>
					<hbr-tag
						style={{
							"--bg-color": "#EBEDFF",
							"--border-color": "#EBEDFF",
						}}
					>
						Tag
					</hbr-tag>
				</hbr-layout>
			</hbr-layout>
			{/** Description */}
			<hbr-text type="secondary" size="sm" length="md">
				Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet
				sint. Velit officia consequat duis enim velit mollit. Exercitation
				veniam consequat sunt nostrud amet.
			</hbr-text>
		</hbr-layout>
	);
}
// END: DefaultPageTitleExample

/* ===================== BREADCRUMB PAGE TITLE ===================== */
// BEGIN: BreadcrumbPageTitleExample
// Purpose: Shows elements #1 and #2 - top line with breadcrumbs plus page title.
export function BreadcrumbPageTitleExample() {
	return (
		<hbr-layout variant="page:header">
			{/** Top line */}
			<hbr-layout direction="row" gap="sm">
				<hbr-breadcrumb>
					<hbr-breadcrumb-item>
						<hbr-icon slot="prefix" name="arrow-left" />
						Level 1 page
					</hbr-breadcrumb-item>
				</hbr-breadcrumb>
			</hbr-layout>
			{/** Title */}
			<hbr-layout direction="row" gap="sm">
				<hbr-text variant="page-title">Page title</hbr-text>
			</hbr-layout>
		</hbr-layout>
	);
}
// END: BreadcrumbPageTitleExample

/* ===================== DESCRIPTIVE PAGE TITLE ===================== */
// BEGIN: DescriptivePageTitleExample
// Purpose: Shows elements #1, #2, and #3 - top line, page title, and description text.
export function DescriptivePageTitleExample() {
	return (
		<hbr-layout variant="page:header">
			{/** Top line */}
			<hbr-layout direction="row" gap="sm">
				<hbr-breadcrumb>
					<hbr-breadcrumb-item>
						<hbr-icon slot="prefix" name="arrow-left" />
						Level 1 page
					</hbr-breadcrumb-item>
				</hbr-breadcrumb>
			</hbr-layout>
			{/** Title */}
			<hbr-layout direction="row" gap="sm">
				<hbr-text variant="page-title">Page title</hbr-text>
			</hbr-layout>
			{/** Description */}
			<hbr-text type="secondary" size="sm" length="md">
				Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet
				sint. Velit officia consequat duis enim velit mollit. Exercitation
				veniam consequat sunt nostrud amet.
			</hbr-text>
		</hbr-layout>
	);
}
// END: DescriptivePageTitleExample

/* ===================== INFORMATIVE PAGE TITLE ===================== */
// BEGIN: InformativePageTitleExample
// Purpose: Shows elements #1, #2, #3, and #4 - top line, page title, description, and page label.
export function InformativePageTitleExample() {
	return (
		<hbr-layout variant="page:header">
			{/** Top line */}
			<hbr-layout direction="row" gap="sm">
				<hbr-breadcrumb>
					<hbr-breadcrumb-item>
						<hbr-icon slot="prefix" name="arrow-left" />
						Level 1 page
					</hbr-breadcrumb-item>
				</hbr-breadcrumb>
			</hbr-layout>
			{/** Title */}
			<hbr-layout direction="row" gap="sm">
				<hbr-text variant="page-title">Page title</hbr-text>
			</hbr-layout>
			{/** Description */}
			<hbr-text type="secondary" size="sm" length="md">
				Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet
				sint. Velit officia consequat duis enim velit mollit. Exercitation
				veniam consequat sunt nostrud amet.
			</hbr-text>
			{/** Key information */}
			<hbr-layout direction="row" gap="xs">
				<hbr-text type="secondary" size="sm" weight="semibold">MX450</hbr-text>
				<hbr-text type="secondary" size="sm" mono>
					e0:cb:bc:a3:03:48
				</hbr-text>
			</hbr-layout>
		</hbr-layout>
	);
}
// END: InformativePageTitleExample

/* ===================== TAGGED PAGE TITLE ===================== */
// BEGIN: TaggedPageTitleExample
// Purpose: Shows elements #1, #2, #3, #4, and #5 - complete anatomy with top line, page title with tags, description, page label, and primary tabs.
export function TaggedPageTitleExample() {
	return (
		<hbr-layout variant="page:header">
			{/** Top line */}
			<hbr-layout direction="row" gap="sm">
				<hbr-breadcrumb>
					<hbr-breadcrumb-item>
						<hbr-icon slot="prefix" name="arrow-left" />
						Level 1 page
					</hbr-breadcrumb-item>
				</hbr-breadcrumb>
			</hbr-layout>
			{/** Title */}
			<hbr-layout direction="row" gap="sm">
				<hbr-text variant="page-title">Page title</hbr-text>

				{/** Tags */}
				<hbr-layout direction="row" gap="2xs">
					<hbr-tag sentiment="positive">
						<hbr-icon
							slot="prefix"
							name="alerts-positive-large"
							style={{ fontSize: "18px" }}
							sentiment="positive"
						/>
						Online
					</hbr-tag>
					<hbr-tag
						style={{
							"--bg-color": "#EBEDFF",
							"--border-color": "#EBEDFF",
						}}
					>
						Tag
					</hbr-tag>
				</hbr-layout>
			</hbr-layout>
			{/** Description */}
			<hbr-text type="secondary" size="sm" length="md">
				Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet
				sint. Velit officia consequat duis enim velit mollit. Exercitation
				veniam consequat sunt nostrud amet.
			</hbr-text>
			{/** Key information */}
			<hbr-layout direction="row" gap="xs">
				<hbr-text type="secondary" size="sm" weight="semibold">MX450</hbr-text>
				<hbr-text type="secondary" size="sm" mono>
					e0:cb:bc:a3:03:48
				</hbr-text>
			</hbr-layout>
			{/** Tabs */}
			<hbr-tab-group
				id="tab-group-1"
				primary
				sentiment="positive"
				style={{ marginTop: "4px" }}
			>
				<hbr-tab slot="nav" active>
					Tab
				</hbr-tab>
				<hbr-tab slot="nav">Tab</hbr-tab>
			</hbr-tab-group>
		</hbr-layout>
	);
}
// END: TaggedPageTitleExample

/* ===================== ACCENT PAGE TITLE ===================== */
// BEGIN: AccentPageTitleExample
// Purpose: Shows all 5 elements plus banner - complete anatomy with top line, page title with accent tags, description, page label, and primary tabs.
export function AccentPageTitleExample() {
	return (
		<hbr-layout variant="page:header">
			{/** Top line */}
			<hbr-layout direction="row" gap="sm">
				<hbr-breadcrumb>
					<hbr-breadcrumb-item>
						<hbr-icon slot="prefix" name="arrow-left" />
						Level 1 page
					</hbr-breadcrumb-item>
				</hbr-breadcrumb>
			</hbr-layout>
			{/** Title */}
			<hbr-layout direction="row" gap="sm">
				<hbr-text variant="page-title">Page title</hbr-text>

				<hbr-layout direction="row" gap="2xs">
					<hbr-tag sentiment="positive">
						<hbr-icon
							slot="prefix"
							name="alerts-positive-large"
							style={{ fontSize: "18px" }}
							sentiment="positive"
						/>
						Online
					</hbr-tag>
					<hbr-tag
						style={{
							"--bg-color": "var(--hbr-color-accent-a-weak)",
							"--border-color": "var(--hbr-color-accent-a-weak)",
						}}
					>
						Tag
					</hbr-tag>
				</hbr-layout>
			</hbr-layout>
			{/** Description */}
			<hbr-text type="secondary" size="sm" length="md">
				Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet
				sint. Velit officia consequat duis enim velit mollit. Exercitation
				veniam consequat sunt nostrud amet.
			</hbr-text>
			{/** Key information */}
			<hbr-layout direction="row" gap="xs">
				<hbr-text type="secondary" size="sm" weight="semibold">MX450</hbr-text>
				<hbr-text type="secondary" size="sm" mono>
					e0:cb:bc:a3:03:48
				</hbr-text>
			</hbr-layout>
			{/** Banner */}
			<hbr-banner sentiment="info" open closable style={{ marginTop: "4px" }}>
				<hbr-icon slot="icon" name="alerts-info-large" />
				This node has overriding custom configuration settings applied by a
				Cisco Meraki support or systems engineer, most likely as part of a
				previous support case. To upgrade your network please contact support.
			</hbr-banner>
			{/** Tabs */}
			<hbr-tab-group
				id="tab-group-2"
				primary
				sentiment="positive"
				style={{ marginTop: "4px" }}
			>
				<hbr-tab slot="nav" active>
					Tab
				</hbr-tab>
				<hbr-tab slot="nav">Tab</hbr-tab>
			</hbr-tab-group>
		</hbr-layout>
	);
}
// END: AccentPageTitleExample

/* ===================== MASTER DEMO EXPORT ===================== */
// The default export renders all six page title patterns together.
// LLMs: When asked for "a default page title" etc., return ONLY the corresponding component JSX, not the whole group.
export default function PageTitle() {
	return (
		<>
			<div className="m-10">
				<hbr-layout direction="column">
					<section>
						<DefaultPageTitleExample />
					</section>

					<section>
						<BreadcrumbPageTitleExample />
					</section>

					<section>
						<DescriptivePageTitleExample />
					</section>

					<section>
						<InformativePageTitleExample />
					</section>

					<section>
						<TaggedPageTitleExample />
					</section>

					<section>
						<AccentPageTitleExample />
					</section>
				</hbr-layout>
			</div>
			<style>{`
            #tab-group-1::part(nav), #tab-group-2::part(nav) {
                padding: 0;
            }
            #tab-group-1::part(tabs), #tab-group-1::part(base),
            #tab-group-2::part(tabs), #tab-group-2::part(base) {
                border: 0;
            }
        `}</style>
		</>
	);
}

```