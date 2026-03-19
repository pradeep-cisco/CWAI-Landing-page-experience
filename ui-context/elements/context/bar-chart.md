# Bar Chart

Bar Chart is implemented using the web component: <hbr-bar-chart>.

## Description
vertical bar chart for comparing discrete values among categories

## Generation Guidance
Bar chart is a web component wrapper around the nivo.rocks/bar chart library.
The "config" object accepts the same properties as the nivo.rocks/bar library.

## Orientation Rules
- Vertical layout: Best for ≤7 data items
- Horizontal layout: Best for >7 data items (labels fit on y-axis)

## Required Config by Orientation

### Vertical Bar Chart
- `layout: "vertical"`
- `enableGridY: true`, `enableGridX: false`
- `axisBottom: { tickRotation: -30 }` (mandatory for label readability)

### Horizontal Bar Chart  
- `layout: "horizontal"`
- `enableGridX: true`, `enableGridY: false`
- `axisLeft: { tickRotation: -45 }` (mandatory for label readability)
- `margin.left`: Increase to ~120 to fit y-axis labels

## Container
- Width: 100%
- Height: Use `min-height` (e.g., 360px) on the wrapper div

See code examples for complete working configurations.

## Usage
```jsx
import { useRef, useEffect } from "react";

// Can be used standalone or as a dashboard widget
export default function BarChartWidget() {
  const chartRef = useRef(null);

  const maxValue = 1000;
  const data = [
    {
      name: "Football",
      value: 237,
    },
    {
      name: "Golf",
      value: 500,
    },
    {
      name: "Tennis",
      value: 700,
    },
    // No Data spans the max height of the chart
    {
      name: "cricket",
      "No Data": maxValue
    },
    {
      name: "Baseball",
      value: 600,
    },
  ];

  const config = {
    data: data,
    layout: "vertical",
    indexBy: "name",
    keys: ["value", "No Data"],
    margin: { top: 20, right: 20, bottom: 20, left: 50 },
    labelSkipWidth: 0,
    maxValue: maxValue,
    padding: 0.35,
    gridYValues: [0, 250, 500, 750, 1000],
    axisLeft: {
      tickValues: [0, 250, 500, 750, 1000],
      legendOffset: -44,
    },

    legends: [],
    tooltip: (bar) => `$${bar.formattedValue} / ${bar.formattedValue}%`,
  };
  
  useEffect(() => {
    if (!chartRef.current) return;
    chartRef.current.config = config;
  }, []);

  const handleExport = (event) => {
    event.target.closest("hbr-bar-chart").download("Export.csv");
  };

  return <hbr-card container col="2/3">
    {/* Card wrapper should have width: 100% and min-height to render consistently */}
    <div style={{ width: "100%", minHeight: "360px" }}>
      <hbr-bar-chart ref={chartRef} categorical>
        <hbr-text slot="header-title" variant="sub-section-title">Bar Chart - Basic</hbr-text>
        <div slot="header-action">
          <hbr-tooltip content="Download CSV">
            <hbr-button variant="text" onClick={handleExport}>
              <hbr-icon name="file-csv" label="Download Data" />
            </hbr-button>
          </hbr-tooltip>
        </div>
      </hbr-bar-chart>
    </div>
  </hbr-card>
}

```

## API Reference

### Props
`categorical`: New Magnetic UX chart type (boolean) 
`config`: Abridged chart config. ({data?: []; indexBy: string; keys: readonly string[]; margin: {top: number; right: number; bottom: number; left: number;}; innerPadding: number; padding: number; enableGridX: boolean; gridXValues?: string[] | number[]; enableGridY: boolean; gridYValues?: string[] | number[]; enableLabel: boolean; barItemTopLabel: boolean; barItemRightLabel: boolean; label: string; groupMode: 'grouped' | 'stacked'; layout: 'horizontal' | 'vertical'; legends: readonly string[];}) 
`height`: Chart height (string) 
`width`: Chart width (string) 