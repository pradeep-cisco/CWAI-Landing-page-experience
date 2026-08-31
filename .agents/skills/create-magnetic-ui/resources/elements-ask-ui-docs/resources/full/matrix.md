# Matrix

Matrix is implemented using the web component: <hbr-matrix-chart>.

## Description
Chart for comparing information between multiple categories, across two dimensions, where intersections represent relationships.

## Usage
```jsx
export default function MatrixWidget() {
  // Can be used standalone or as a dashboard widget
  const data = [
  {
    row: "ST 1 (1/0001)",
    data: [
      {
        col: "ST 1 (1/0001)",
        status: "disabled",
      },
      {
        col: "ST 2 (2/0002)",
      },
      {
        col: "ST 3 (3/0003)",
        status: "warning",
      },
      {
        col: "ST 4 (4/0004)",
        status: "negative",
      },
      {
        col: "ST 5 (5/0005)",
        status: "in-progress",
      },
      {
        col: "ST 6 (6/0006)",
        status: "custom",
      },
      {
        col: "ST 7 (7/0007)",
        status: "excellent",
      },
      {
        col: "ST 8 (8/0008)",
        status: "positive",
      },
      {
        col: "ST 9 (9/0009)",
        status: "low-warning",
      },
      {
        col: "ST 10 (10/0010)",
      },
      {
        col: "ST 11 (11/0011)",
      },
      {
        col: "ST 12 (12/0012)",
      },
    ],
  },
  {
    row: "ST 2 (2/0002)",
    data: [
      {
        col: "ST 1 (1/0001)",
        status: "warning",
      },
      {
        col: "ST 2 (2/0002)",
        status: "severe-warning",
      },
      {
        col: "ST 3 (3/0003)",
        status: "dormant",
      },
      {
        col: "ST 4 (4/0004)",
        status: "info",
      },
      {
        col: "ST 5 (5/0005)",
      },
      {
        col: "ST 6 (6/0006)",
      },
      {
        col: "ST 7 (7/0007)",
      },
      {
        col: "ST 8 (8/0008)",
      },
      {
        col: "ST 9 (9/0009)",
      },
      {
        col: "ST 10 (10/0010)",
      },
      {
        col: "ST 11 (11/0011)",
      },
      {
        col: "ST 12 (12/0012)",
      },
    ],
  },
  {
    row: "ST 3 (3/0003)",
    data: [
      {
        col: "ST 1 (1/0001)",
      },
      {
        col: "ST 2 (2/0002)",
      },
      {
        col: "ST 3 (3/0003)",
      },
      {
        col: "ST 4 (4/0004)",
      },
      {
        col: "ST 5 (5/0005)",
      },
      {
        col: "ST 6 (6/0006)",
      },
      {
        col: "ST 7 (7/0007)",
      },
      {
        col: "ST 8 (8/0008)",
      },
      {
        col: "ST 9 (9/0009)",
        status: "disabled",
      },
      {
        col: "ST 10 (10/0010)",
      },
      {
        col: "ST 11 (11/0011)",
      },
      {
        col: "ST 12 (12/0012)",
      },
    ],
  },
  {
    row: "ST 4 (4/0004)",
    data: [
      {
        col: "ST 1 (1/0001)",
      },
      {
        col: "ST 2 (2/0002)",
      },
      {
        col: "ST 3 (3/0003)",
      },
      {
        col: "ST 4 (4/0004)",
      },
      {
        col: "ST 5 (5/0005)",
      },
      {
        col: "ST 6 (6/0006)",
      },
      {
        col: "ST 7 (7/0007)",
      },
      {
        col: "ST 8 (8/0008)",
      },
      {
        col: "ST 9 (9/0009)",
      },
      {
        col: "ST 10 (10/0010)",
      },
      {
        col: "ST 11 (11/0011)",
      },
      {
        col: "ST 12 (12/0012)",
      },
    ],
  },
  {
    row: "ST 5 (5/0005)",
    data: [
      {
        col: "ST 1 (1/0001)",
      },
      {
        col: "ST 2 (2/0002)",
      },
      {
        col: "ST 3 (3/0003)",
      },
      {
        col: "ST 4 (4/0004)",
      },
      {
        col: "ST 5 (5/0005)",
      },
      {
        col: "ST 6 (6/0006)",
      },
      {
        col: "ST 7 (7/0007)",
      },
      {
        col: "ST 8 (8/0008)",
      },
      {
        col: "ST 9 (9/0009)",
      },
      {
        col: "ST 10 (10/0010)",
      },
      {
        col: "ST 11 (11/0011)",
      },
      {
        col: "ST 12 (12/0012)",
      },
    ],
  },
  {
    row: "ST 6 (6/0006)",
    data: [
      {
        col: "ST 1 (1/0001)",
      },
      {
        col: "ST 2 (2/0002)",
      },
      {
        col: "ST 3 (3/0003)",
      },
      {
        col: "ST 4 (4/0004)",
      },
      {
        col: "ST 5 (5/0005)",
      },
      {
        col: "ST 6 (6/0006)",
      },
      {
        col: "ST 7 (7/0007)",
      },
      {
        col: "ST 8 (8/0008)",
      },
      {
        col: "ST 9 (9/0009)",
      },
      {
        col: "ST 10 (10/0010)",
      },
      {
        col: "ST 11 (11/0011)",
      },
      {
        col: "ST 12 (12/0012)",
      },
    ],
  },
  {
    row: "ST 7 (7/0007)",
    data: [
      {
        col: "ST 1 (1/0001)",
      },
      {
        col: "ST 2 (2/0002)",
      },
      {
        col: "ST 3 (3/0003)",
      },
      {
        col: "ST 4 (4/0004)",
      },
      {
        col: "ST 5 (5/0005)",
      },
      {
        col: "ST 6 (6/0006)",
      },
      {
        col: "ST 7 (7/0007)",
      },
      {
        col: "ST 8 (8/0008)",
      },
      {
        col: "ST 9 (9/0009)",
      },
      {
        col: "ST 10 (10/0010)",
      },
      {
        col: "ST 11 (11/0011)",
      },
      {
        col: "ST 12 (12/0012)",
      },
    ],
  },
  {
    row: "ST 8 (8/0008)",
    data: [
      {
        col: "ST 1 (1/0001)",
      },
      {
        col: "ST 2 (2/0002)",
      },
      {
        col: "ST 3 (3/0003)",
      },
      {
        col: "ST 4 (4/0004)",
      },
      {
        col: "ST 5 (5/0005)",
      },
      {
        col: "ST 6 (6/0006)",
      },
      {
        col: "ST 7 (7/0007)",
      },
      {
        col: "ST 8 (8/0008)",
      },
      {
        col: "ST 9 (9/0009)",
      },
      {
        col: "ST 10 (10/0010)",
      },
      {
        col: "ST 11 (11/0011)",
      },
      {
        col: "ST 12 (12/0012)",
      },
    ],
  },
  {
    row: "ST 9 (9/0009)",
    data: [
      {
        col: "ST 1 (1/0001)",
      },
      {
        col: "ST 2 (2/0002)",
      },
      {
        col: "ST 3 (3/0003)",
      },
      {
        col: "ST 4 (4/0004)",
      },
      {
        col: "ST 5 (5/0005)",
      },
      {
        col: "ST 6 (6/0006)",
      },
      {
        col: "ST 7 (7/0007)",
      },
      {
        col: "ST 8 (8/0008)",
      },
      {
        col: "ST 9 (9/0009)",
      },
      {
        col: "ST 10 (10/0010)",
      },
      {
        col: "ST 11 (11/0011)",
      },
      {
        col: "ST 12 (12/0012)",
      },
    ],
  },
  {
    row: "ST 10 (10/0010)",
    data: [
      {
        col: "ST 1 (1/0001)",
      },
      {
        col: "ST 2 (2/0002)",
      },
      {
        col: "ST 3 (3/0003)",
      },
      {
        col: "ST 4 (4/0004)",
      },
      {
        col: "ST 5 (5/0005)",
      },
      {
        col: "ST 6 (6/0006)",
      },
      {
        col: "ST 7 (7/0007)",
      },
      {
        col: "ST 8 (8/0008)",
      },
      {
        col: "ST 9 (9/0009)",
      },
      {
        col: "ST 10 (10/0010)",
      },
      {
        col: "ST 11 (11/0011)",
      },
      {
        col: "ST 12 (12/0012)",
      },
    ],
  },
  {
    row: "ST 11 (11/0011)",
    data: [
      {
        col: "ST 1 (1/0001)",
      },
      {
        col: "ST 2 (2/0002)",
      },
      {
        col: "ST 3 (3/0003)",
      },
      {
        col: "ST 4 (4/0004)",
      },
      {
        col: "ST 5 (5/0005)",
      },
      {
        col: "ST 6 (6/0006)",
      },
      {
        col: "ST 7 (7/0007)",
      },
      {
        col: "ST 8 (8/0008)",
      },
      {
        col: "ST 9 (9/0009)",
      },
      {
        col: "ST 10 (10/0010)",
      },
      {
        col: "ST 11 (11/0011)",
      },
      {
        col: "ST 12 (12/0012)",
      },
    ],
  },
  {
    row: "ST 12 (12/0012)",
    data: [
      {
        col: "ST 1 (1/0001)",
      },
      {
        col: "ST 2 (2/0002)",
      },
      {
        col: "ST 3 (3/0003)",
      },
      {
        col: "ST 4 (4/0004)",
      },
      {
        col: "ST 5 (5/0005)",
      },
      {
        col: "ST 6 (6/0006)",
      },
      {
        col: "ST 7 (7/0007)",
      },
      {
        col: "ST 8 (8/0008)",
      },
      {
        col: "ST 9 (9/0009)",
      },
      {
        col: "ST 10 (10/0010)",
      },
      {
        col: "ST 11 (11/0011)",
      },
      {
        col: "ST 12 (12/0012)",
      },
    ],
  },
  {
    row: "ST 13 (13/0013)",
    data: [
      {
        col: "ST 1 (1/0001)",
      },
      {
        col: "ST 2 (2/0002)",
      },
      {
        col: "ST 3 (3/0003)",
      },
      {
        col: "ST 4 (4/0004)",
      },
      {
        col: "ST 5 (5/0005)",
      },
      {
        col: "ST 6 (6/0006)",
      },
      {
        col: "ST 7 (7/0007)",
      },
      {
        col: "ST 8 (8/0008)",
      },
      {
        col: "ST 9 (9/0009)",
      },
      {
        col: "ST 10 (10/0010)",
      },
      {
        col: "ST 11 (11/0011)",
      },
      {
        col: "ST 12 (12/0012)",
      },
    ],
  },
  {
    row: "ST 14 (14/0014)",
    data: [
      {
        col: "ST 1 (1/0001)",
      },
      {
        col: "ST 2 (2/0002)",
      },
      {
        col: "ST 3 (3/0003)",
      },
      {
        col: "ST 4 (4/0004)",
      },
      {
        col: "ST 5 (5/0005)",
      },
      {
        col: "ST 6 (6/0006)",
      },
      {
        col: "ST 7 (7/0007)",
      },
      {
        col: "ST 8 (8/0008)",
      },
      {
        col: "ST 9 (9/0009)",
      },
      {
        col: "ST 10 (10/0010)",
      },
      {
        col: "ST 11 (11/0011)",
      },
      {
        col: "ST 12 (12/0012)",
      },
    ],
  },
  {
    row: "ST 15 (15/0015)",
    data: [
      {
        col: "ST 1 (1/0001)",
      },
      {
        col: "ST 2 (2/0002)",
      },
      {
        col: "ST 3 (3/0003)",
      },
      {
        col: "ST 4 (4/0004)",
      },
      {
        col: "ST 5 (5/0005)",
      },
      {
        col: "ST 6 (6/0006)",
      },
      {
        col: "ST 7 (7/0007)",
      },
      {
        col: "ST 8 (8/0008)",
      },
      {
        col: "ST 9 (9/0009)",
      },
      {
        col: "ST 10 (10/0010)",
      },
      {
        col: "ST 11 (11/0011)",
      },
      {
        col: "ST 12 (12/0012)",
      },
    ],
  },
];
	const config = {
		data: data,
		eventListeners: {
			onMouseLeave: (event) => {
				console.log(event);
			},
		},
		onSelect: (event, data) => {
			console.log(event);
			console.log(data);
		},
		onFinishModeSelect: (data, gridClearFunction) => {
			gridClearFunction();
		},
		axis: {
			rowLabel: "Source",
			colLabel: "Destination",
			left: {
				enabled: true,
				width: 100,
				render: (data, index) => {
					return `<hbr-popover content="${data}" trigger="hover">
					${data}</hbr-popover>`;
				},
			},
			right: {
				enabled: false,
			},
			top: {
				enabled: true,
				height: 80,
				axisTemplate: (createElement, props, i) => {
					return createElement(
						"span",
						{
							style: {
								fontSize: "12px",
							},
						},
						`${i}.${props}`,
					);
				},
			},
			bottom: {
				enabled: false,
				height: 40,
			},
		},
	};
	return (
		<hbr-card container col="full">
			<style>
				{`
        #matrix1::part(--axis-left) {
          width: 100%;
          height: 100%;
          font-size: 12px;
          display: flex;
          align-items: center;
        }

          #matrix1::part(control) {
            right: 60px;
          }
      `}
			</style>
			<hbr-matrix-chart height="500px" id="matrix1" config={config} />
		</hbr-card>
	);
}
```

## API Reference

### Props
`config`: Chart configuration ({ data: { row: string; data: { col: string; status?: string; }[]; }[]; tooltipItemTemplate?: (createElement: any, row: string, col: string, obj: unknown, fullConfig: MatrixChartConfig) => HTMLElement; eventListeners?: { onClick?: (event: MouseEvent) => void; onMouseEnter?: (event: MouseEvent) => void; onMouseLeave?: (event: MouseEvent) => void; onMouseMove?: (event: MouseEvent) => void; onFocus?: (event: FocusEvent) => void; onBlur?: (event: FocusEvent) => void; view?: { onClick?: (event: MouseEvent) => void; onMouseEnter?: (event: MouseEvent) => void; onMouseLeave?: (event: MouseEvent) => void; onMouseMove?: (event: MouseEvent) => void; onFocus?: (event: FocusEvent) => void; onBlur?: (event: FocusEvent) => void; onKeyDown?: (event: KeyboardEvent) => void; onKeyUp?: (event: KeyboardEvent) => void; }; edit?: { onClick?: (event: MouseEvent, data: any) => void; onMouseEnter?: (event: MouseEvent) => void; onMouseLeave?: (event: MouseEvent) => void; onMouseMove?: (event: MouseEvent) => void; onFocus?: (event: FocusEvent) => void; onBlur?: (event: FocusEvent) => void; onKeyDown?: (event: KeyboardEvent, data: any) => void; onKeyUp?: (event: KeyboardEvent, data: any) => void; }; }; onSwitchMode?: (event: any, mode: any, data?: any) => void; onSelect?: (event: any, data: any) => void; statuses: { [key: string]: { iconAsset?: () => string; iconName?: string; iconSrc?: string; label?: string; edit: { default: cellStyles; hover?: cellStyles; selected?: cellStyles; "selected-hover"?: cellStyles; focused?: cellStyles; }; view: { default: cellStyles; hover?: cellStyles; focused?: cellStyles; disabled?: cellStyles; }; }; }; grid?: { gapSizes?: [number]; itemSizes?: [number]; iconSizes?: [number]; defaultSize?: number; }; axis: { rowLabel?: string; colLabel?: string; left: MatrixAxisConfig; right: MatrixAxisConfig; top: MatrixAxisConfig; bottom: MatrixAxisConfig; }; accessibility: { ariaLabel: (row: any, col: any) => string; }; })
`height`: Chart height (string)
`loading`: Chart loading flag (boolean)
`mode`:  ("edit" | "view")
`popoverOptions`: grid item popover props, check hbr-popover page for all available options ({ host?: HTMLHbrPopoverElement; anchor?: string | HTMLElement | SVGElement; content?: string; placement?: "bottom" | "left" | "right" | "top" | "top-start" | "top-end" | "right-start" | "right-end" | "bottom-start" | "bottom-end" | "left-start" | "left-end"; disabled?: boolean; distance?: number; open?: boolean; skidding?: number; trigger?: string; hoist?: boolean; enablePopover?: boolean; size?: "small" | "medium" | "large"; variant?: "map" | "default" | "confirm" | "chart"; sentiment?: "brand"; widthExpand?: boolean; featureHighlight?: boolean; hbrShow?: EventEmitter<any>; hbrAfterShow?: EventEmitter<any>; hbrHide?: EventEmitter<any>; hbrAfterHide?: EventEmitter<any>; hbrDismiss?: EventEmitter<any>; handleOpenChange?: () => Promise<void>; handleOptionsChange?: () => Promise<void>; handleDisabledChange?: () => void; handleSentimentChange?: () => void; handleAnchorChange?: () => void; show?: () => Promise<any>; hide?: () => Promise<any>; connectedCallback?: () => void; componentDidLoad?: () => void; render?: () => any; })
`selectedItems`:  ({ [key: string]: { status: string; }; })
`width`: Chart width (string)

### Methods
`deselectAll()`
`selectAll()`

### Slots
`axis-label-bottom`: Slot for bottom axis description
`axis-label-left`: Slot for left axis description
`axis-label-right`: Slot for right axis description
`axis-label-top`: Slot for top axis description
`content`: Slot for popover content
`control-panel`: Slot for control panel on the right
`empty-state`: Slot for empty state
`footer`: Slot for footer
`header`: Slot for header
`header-action`: Slot for header action
`header-title`: Slot for header title
`loading-state`: Slot for loading state

### Parts
`chart`: The chart element
`container`: The container svg element
`header`: The header element
`popover-arrow`: The popover arrow element,  check hbr-popover for more details
`popover-body`: The popover body element, check hbr-popover for more details
`popover-popup`: The popover popup element,  check hbr-popover for more details