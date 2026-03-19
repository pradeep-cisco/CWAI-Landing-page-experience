# Pie Chart 

## Description
Graph showing parts of a whole as segments of a circle.

## Generation Guidance
# BASIC PIE CHART CONFIGURATION GUIDE

Every pie chart must have the 'categorical' prop set to true. 

Every hbr-donut-chart that is used as a pie chart needs a config object, follow these rules when creating one:
- 'innerRadius' should be set to 0
- Must have this 'arcLinkLabelsHtml' property so that the labels that fit the design system:
    arcLinkLabelsHtml: {
                width: 160,
                height: 24,
                labelTemplate: (datum, createElement) => {
                    return createElement(
                        "div",
                        {
                            className: "--categorical-donut-link-label",
                        },
                        datum.label,
                        createElement(
                            "hbr-tag",
                            {
                                size: "small",
                            },
                            datum.value,
                        ),
                    );
                },
            },

Use exact casing when referencing these examples.

## Usage
```jsx
import { useEffect, useRef } from "react";
export default function PieChart() {
	const chartRef = useRef(null);
	const data = [
		{ id: "Category 1", value: 100 },
		{ id: "Category 2", value: 80 },
		{ id: "Category 3", value: 40 },
		{ id: "Category 4", value: 88 },
		{ id: "Category 5", value: 190 },
	];

	// Base config that remains stable (avoid reassigning object each render)
	const config = {
		data: data,
		margin: { top: 30, bottom: 80, left: 30, right: 30 },
		innerRadius: 0,
		arcLinkLabelsHtml: {
			width: 160,
			height: 24,
			labelTemplate: (datum, createElement) => {
				return createElement(
					"div",
					{
						className: "--categorical-donut-link-label",
					},
					datum.label,
					createElement(
						"hbr-tag",
						{
							size: "small",
						},
						datum.value,
					),
				);
			},
		},
	};

	// Effect to (re)apply config whenever dependencies change
	useEffect(() => {
		if (!chartRef.current) return;
		chartRef.current.config = config;
	}, [config]);

	const handleExport = (event) => {
		event.target.closest("hbr-donut-chart").download("Export.csv");
	};

	return (
		<hbr-card container={true} col="2/3">
			<div style={{ width: "100%", minHeight: "360px" }}>
				<hbr-donut-chart ref={chartRef} categorical>
					<hbr-text slot="header-title" variant="sub-section-title">Pie Chart</hbr-text>
					<div slot="header-action" style={{ display: "flex" }}>
						<hbr-tooltip content="This is a download feature">
							<hbr-button variant="text" onClick={handleExport}>
								<hbr-icon name="file-csv" label="Download Data" />
							</hbr-button>
						</hbr-tooltip>
					</div>
				</hbr-donut-chart>
			</div>
		</hbr-card>
	);
}

```