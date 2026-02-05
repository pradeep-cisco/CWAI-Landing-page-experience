/**
 * uses hbr-card component because health cards could be interactive
 */
const HealthCard = ({ trend = "up" }) => {
	const trendIcon = trend === "up" ? "trend-up" : "trend-down";
	return (
		<hbr-card style={{ "--min-width": "200px" }}>
			<hbr-layout direction="column" gap="2xs">
				<hbr-text type="secondary" size="sm">Label</hbr-text>
				<hbr-layout direction="row" gap="2xs">
					<hbr-text type="primary" size="md" weight="bold">100%</hbr-text>
					<hbr-icon
						name={trendIcon}
						style={{
							fontSize: "16px",
							color: `var(--hbr-color-${
								trend === "up" ? "success" : "danger"
							}-active)`,
						}}
					/>
					<hbr-layout direction="row" gap="2xs">
						<hbr-text type="primary" size="xs" weight="semibold">1%</hbr-text>
						<hbr-text type="secondary" size="xs" weight="semibold">yesterday</hbr-text>
					</hbr-layout>
				</hbr-layout>
			</hbr-layout>
		</hbr-card>
	);
};

// Dummy content for widgets
const Content = () => (
	<hbr-layout direction="column" gap="md">
		<hbr-layout direction="row" gap="md">
			<hbr-text variant="sub-section-title">Sub-section title</hbr-text>
			<hbr-button variant="text" style={{ marginInlineStart: "auto" }}>
				Button
			</hbr-button>
		</hbr-layout>
		<div
			style={{
				height: "160px",
				backgroundColor: "var(--hbr-color-neutral-bg-medium)",
				borderRadius: "2px",
			}}
		/>
	</hbr-layout>
);

// Three widgets in a desktop row: one-third | one-third | one-third
// Replace with actual widgets like donut-chart, pie-chart, key-value-pairs
const SmallWidget = () => {
	return <hbr-card container col="1/3">
		<Content />
	</hbr-card>
}

// Two widgets in a desktop row: half | half
// Replace with actual widgets like bar-chart, line-chart, key-value-pairs etc
const MediumWidget = () => {
	return <hbr-card container col="1/2">
		<Content />
	</hbr-card>
}

// Two-thirds widget, goes with a small widget in a desktop row: two-thirds | one-third
// Replace with actual widgets like large line-chart, small table etc.
const LargeWidget = () => {
	return <hbr-card container col="2/3">
		<Content />
	</hbr-card>
}

// Full width widget
// Replace with actual widgets like large table, large chart etc.
const ExtraLargeWidget = () => {
	return <hbr-card container col="full">
		<Content />
	</hbr-card>
}

export default function Dashboard() {
	return (
		<hbr-layout variant="page">
			{/* Page title section */}
			<hbr-layout variant="page:header">
				<hbr-layout direction="row" gap="sm">
					<hbr-text variant="page-title">Home</hbr-text>
				</hbr-layout>
				<hbr-tab-group id="tab-group" primary>
					<hbr-tab slot="nav" active>
						Tab
					</hbr-tab>
					<hbr-tab slot="nav">Tab</hbr-tab>
				</hbr-tab-group>
			</hbr-layout>

			<hbr-layout variant="dashboard">
				{/* Health cards section */}
				<hbr-layout variant="dashboard:section">
					<hbr-text variant="section-title">Section title</hbr-text>
					<hbr-layout variant="dashboard:widgets:basic-health">
						<HealthCard />
						<HealthCard trend="down" />
						<HealthCard />
					</hbr-layout>
				</hbr-layout>

				{/* Container cards section */}
				<hbr-layout variant="dashboard:section">
					<hbr-text variant="section-title">Section title</hbr-text>
					<hbr-layout variant="dashboard:widgets:container">
						{/* Three cards in a desktop row: one-third | one-third | one-third */}
						<SmallWidget />
						<SmallWidget />
						<SmallWidget />
					</hbr-layout>
				</hbr-layout>

				{/* Container cards section */}
				<hbr-layout variant="dashboard:section">
					<hbr-text variant="section-title">Section title</hbr-text>
					<hbr-layout variant="dashboard:widgets:container">
						<MediumWidget />
						<MediumWidget />
						<ExtraLargeWidget />
						<LargeWidget />
						<SmallWidget />
					</hbr-layout>
				</hbr-layout>
			</hbr-layout>
		</hbr-layout>
	);
}
