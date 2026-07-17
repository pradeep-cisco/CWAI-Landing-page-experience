# Progress Loading Indicators 

## Description
Inline indicators conveying ongoing loading or progress state.

## Usage
```jsx
export default function ProgressLoadingIndicators() {
	return (
		<hbr-layout direction="column" gap="lg">
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
					<hbr-progress-ring percentage="50" size="180" />
				</hbr-layout>
			</hbr-card>
		</hbr-layout>
	);
}

```