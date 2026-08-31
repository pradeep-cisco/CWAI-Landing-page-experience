# Bar Chart Horizontal

Bar Chart Horizontal is implemented using the web component: <hbr-bar-chart>.

## Description
horizontal bar chart for comparing discrete values among categories

## Usage
```jsx
import { useEffect, useRef } from "react";

export default function BarChartHorizontalBasicWidget() {
	const data = [
		{ country: "AD", Value: 20 },
		{ country: "AE", Value: 40 },
		{ country: "AF", Value: 50 },
		{ country: "AG", Value: 100 },
		{ country: "AI", Value: 70 },
		{ country: "AL", Value: 60 },
		{ country: "AM", Value: 40 },
		{ country: "FD", "No Data": 100 },
		{ country: "JP", Value: 40 },
		{ country: "KR", Value: 58 },
		{ country: "US", Value: 84 },
	];

	const config = {
		layout: "horizontal",
		keys: ["Value", "No Data"],
		margin: { top: 20, right: 20, bottom: 60, left: 50 },
		data,
		labelSkipWidth: 0,
		indexBy: "country",
		gridYValues: [0, 50, 100],
		axisLeft: { legendOffset: -44, legend: "Y axis Description (unit)" },
		axisBottom: { legend: "X axis Description" },
		legends: [{ translateY: 60 }],
		itemTooltip: (bar) =>
			`$${bar.data.formattedValue} / ${bar.data.formattedValue}%`,
	};

	const chartRef = useRef(null);
	useEffect(() => {
		if (chartRef.current) chartRef.current.config = config;
	}, [config]);

	return (
		<hbr-card container col="full">
			{/* Card wrapper should have width: 100% and a constant height to render consistently */}
			<div style={{ width: "100%", minHeight: "360px" }}>
				<hbr-bar-chart ref={chartRef} categorical>
					<hbr-text slot="header-title" variant="sub-section-title">Bar Chart - Horizontal</hbr-text>
					<div slot="loading-state">This is a custom loading state</div>
				</hbr-bar-chart>
			</div>
		</hbr-card>
	);
}

```