# Heatmap Chart

Heatmap Chart is implemented using the web component: <hbr-heatmap-chart>.

## Description
Visual representation of data using color intensity to show patterns and relationships across two dimensions. Used for cross-examination of data.

## Usage
```jsx
import { useRef, useEffect } from "react";

const data = [
	{
		id: "Japan",
		data: [
			{
				x: "Train",
				y: -99816,
			},
			{
				x: "Subway",
			},
		],
	},
	{
		id: "France",
		data: [
			{
				x: "Train",
				y: 35848,
			},
			{
				x: "Subway",
				y: -10521,
			},
		],
	},
];

const config = {
	data: data,
	isInteractive: false,
	isFocusable: false,
}
// Can be used standalone or as a dashboard widget
export default function HeatmapChartWidget() {
	const chartRef = useRef(null);

	useEffect(() => {
		if (!chartRef.current) return;
		chartRef.current.config = config;
	}, []);

	const handleExport = (event) => {
		event.target.closest("hbr-heatmap-chart").download("Export.csv");
	};

	return (
		<hbr-card container col="2/3">
			<div style={{ width: "100%", minHeight: "360px" }}>
				<hbr-heatmap-chart ref={chartRef}>
					<hbr-text slot="header-title" variant="sub-section-title">Heatmap Chart</hbr-text>
					<div slot="header-action">
						<hbr-tooltip content="This is a download feature">
							<hbr-button
								variant="text"
								onClick={handleExport}
							>
								<hbr-icon name="file-csv" label="Download Data" />
							</hbr-button>
						</hbr-tooltip>
					</div>
				</hbr-heatmap-chart>
			</div>
		</hbr-card>
	);
}

```

## API Reference

### Props
`config`: Abridged chart config ({data?: readonly RawDatum[]; isInteractive: boolean; isFocusable: boolean;}) 
`height`: Chart height (string) 
`width`: Chart width (string) 