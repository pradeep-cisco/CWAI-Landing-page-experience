# Progress Loading Indicators 

## Description
Inline indicators conveying ongoing loading or progress state.

## Usage
```jsx
export default function ProgressLoadingIndicators() {
	return (
		<hbr-layout direction="column" gap="lg">
			{/* Spinner */}
			<hbr-card container>
				<hbr-text slot="header" variant="section-title">
					Spinner
				</hbr-text>
				<hbr-layout direction="row" gap="xl" align="center">
					<hbr-spinner size="small" />
					<hbr-spinner />
					<hbr-spinner size="large" />
				</hbr-layout>
			</hbr-card>

			{/* Progress Bar */}
			<hbr-card container>
				<hbr-text slot="header" variant="section-title">
					Progress Bar
				</hbr-text>
				<hbr-layout direction="column" gap="md">
					<hbr-progress-bar percentage="25" label="25% Complete" />
					<hbr-progress-bar percentage="50" label="50% Complete" />
					<hbr-progress-bar percentage="75" label="75% Complete" />
					<hbr-progress-bar
						percentage="100"
						label="Complete"
						sentiment="positive"
					/>
				</hbr-layout>
			</hbr-card>

			{/* Loading States */}
			<hbr-card container>
				<hbr-text slot="header" variant="section-title">
					Loading States
				</hbr-text>
				<hbr-layout direction="row" gap="lg" align="center">
					<hbr-button disabled>
						<hbr-spinner slot="prefix" size="small" />
						Loading...
					</hbr-button>
					<hbr-layout direction="column" gap="xs" align="center">
						<hbr-spinner />
						<hbr-text type="secondary" size="sm">
							Loading data...
						</hbr-text>
					</hbr-layout>
				</hbr-layout>
			</hbr-card>

			{/* Base skeleton */}
			<hbr-card container style={{ width: "400px" }}>
				<hbr-layout direction="column" gap="lg">
					<div className="hbr-css__skeleton hbr-css__skeleton-sm" />
					<div className="hbr-css__skeleton hbr-css__skeleton-md" />
					<div className="hbr-css__skeleton hbr-css__skeleton-lg" />
					<div
						className="hbr-css__skeleton hbr-css__skeleton-custom"
						style={{ height: "160px" }}
					/>
				</hbr-layout>
			</hbr-card>
			<hbr-card container style={{ width: "400px" }}>
				<hbr-layout direction="column" gap="lg">
					<div className="hbr-css__skeleton-strong hbr-css__skeleton-sm" />
					<div className="hbr-css__skeleton-strong hbr-css__skeleton-md" />
					<div className="hbr-css__skeleton-strong hbr-css__skeleton-lg" />
					<div
						className="hbr-css__skeleton-strong hbr-css__skeleton-custom"
						style={{ height: "160px" }}
					/>
				</hbr-layout>
			</hbr-card>

			{/* Skeleton patterns */}

			<hbr-card container style={{ width: "480px" }}>
				<hbr-layout direction="column" gap="lg">
					<div className="hbr-css__skeleton hbr-css__skeleton-sm" />
					<div className="hbr-css__skeleton hbr-css__skeleton-sm" />
					<div
						className="hbr-css__skeleton hbr-css__skeleton-sm"
						style={{ width: "75%" }}
					/>
				</hbr-layout>
			</hbr-card>
		</hbr-layout>
	);
}

```