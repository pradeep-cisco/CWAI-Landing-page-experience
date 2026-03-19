# Donut Chart

Donut Chart is implemented using the web component: <hbr-donut-chart>.

## Description
Graph showing parts of a whole as segments of a circle, with a central cutout.

## Generation Guidance
# BASIC DONUT CHART CONFIGURATION GUIDE

Every donut chart must have the 'categorical' prop set to true.

Every hbr-donut-chart that is used as a donut chart needs a config object, follow these rules when creating one:
- set the 'innerRadius' property
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

// Can be used standalone or as a dashboard widget
export default function DonutChartWidget() {
	const data = [
		{
			id: "Category 1",
			value: 100,
		},
		{
			id: "Category 2",
			value: 80,
		},
		{
			id: "Category 3",
			value: 40,
		},
		{
			id: "Category 4",
			value: 88,
		},
		{
			id: "Category 5",
			value: 190,
		},
	];

	const config = {
		data: data,
		margin: { top: 30, bottom: 80, left: 30, right: 30 },
		innerRadius: 0.7,
		centerContent: (data) => {
			const total = data.reduce((acc, curr) => acc + curr.value, 0);
			return `
		<div style="display: flex; flex-direction: column; height: 100%; align-items: center; justify-content: center;">
		  <div style="color: var(--base-text-default); font-size: var(--hbr-font-size-2xl); font-weight: var(--hbr-font-weight-bold); text-align: center; line-height: 1;">${total}</div>
		  <div style="color: var(--base-text-medium-default); font-size: var(--hbr-font-size-md); font-weight: var(--hbr-font-weight-normal); text-align: center;">clients</div>
		</div>`;
		},
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

	const chartRef = useRef(null);
	useEffect(() => {
		if (!chartRef.current) return;
		chartRef.current.config = config;
	}, [config]);
	const handleExport = (event) => {
		event.target.closest("hbr-donut-chart").download("Export.csv");
	};
	return (
		<hbr-card container col="2/3">
			<div style={{ width: "100%", minHeight: "360px" }}>
				<hbr-donut-chart ref={chartRef} categorical>
					<hbr-text slot="header-title" variant="sub-section-title">Donut Chart</hbr-text>
					<div slot="header-action">
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

## API Reference

### Props
`config`: Abridged chart config ({data?: []; innerRadius?: number; centerContent?: (datum) => string;}) 
`height`: Chart height (string) 
`width`: Chart width (string) 