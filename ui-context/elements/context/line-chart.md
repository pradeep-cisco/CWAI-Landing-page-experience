# Line Chart

Line Chart is implemented using the web component: <hbr-line-chart>.

## Description
Chart displaying data points connected by lines to show trends and changes over time or continuous variables.

## Usage
```jsx
import { useEffect, useRef } from "react";

export default function LineChartWidget() {
	// Can be used standalone or as a dashboard widget
	const data = [
		{
			id: "japan",
			data: [
				{
					x: "plane",
					y: 165,
				},
				{
					x: "helicopter",
					y: 206,
				},
				{
					x: "boat",
					y: 168,
				},
				{
					x: "train",
					y: 258,
				},
			],
		},
		{
			id: "france",
			data: [
				{
					x: "plane",
					y: 102,
				},
				{
					x: "helicopter",
					y: 107,
				},
				{
					x: "boat",
					y: 113,
				},
				{
					x: "train",
					y: 6,
				},
			],
		},
		{
			id: "us",
			data: [
				{
					x: "plane",
					y: 52,
				},
				{
					x: "helicopter",
					y: 288,
				},
				{
					x: "boat",
					y: 38,
				},
				{
					x: "train",
					y: 232,
				},
			],
		},
		{
			id: "germany",
			data: [
				{
					x: "plane",
					y: 276,
				},
				{
					x: "helicopter",
					y: 118,
				},
				{
					x: "boat",
					y: 65,
				},
				{
					x: "train",
					y: 179,
				},
			],
		},
	];
	const config = {
		data: data,
		xScale: { type: "point" },
		yScale: {
			type: "linear",
			min: "auto",
			max: "auto",
		},
	};

	const chartRef = useRef(null);

	useEffect(() => {
		if (chartRef.current) {
			chartRef.current.config = config;
		}
	}, [config]);

	const onExportBtn = () => {
		chartRef.current?.download("Export.csv");
	};
	return <hbr-card container col="2/3">
		<div style={{ width: "100%", minHeight: "360px" }}>
			<hbr-line-chart ref={chartRef}>
				<hbr-text slot="header-title" variant="sub-section-title">Line Chart</hbr-text>
				<div slot="header-action">
					<hbr-tooltip content="Download CSV">
						<hbr-button variant="text" onClick={onExportBtn}>
							<hbr-icon name="file-csv" label="Download Data" />
						</hbr-button>
					</hbr-tooltip>
				</div>
			</hbr-line-chart>
		</div>
	</hbr-card>
}

```

## API Reference

### Props
`config`: Abridged chart config ({data?: []; isInteractive: boolean; xScale: {type: 'linear' | 'point'; min?: 'auto' | number; max?: 'auto' | number;}; enableGridX: boolean; enableGridY: boolean;}) 
`height`: Chart height (string) 
`width`: Chart width (string) 