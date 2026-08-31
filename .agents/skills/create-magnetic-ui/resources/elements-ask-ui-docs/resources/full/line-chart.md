# Line Chart

Line Chart is implemented using the web component: <hbr-line-chart>.

## Description
Chart displaying data points connected by lines to show trends and changes over time or continuous variables.

## Generation Guidance

### Tooltip and callback safety
- Omit `config.tooltip` unless custom point content is required. Harbor provides the default point, slice, keyboard, and axis tooltip behavior.
- Harbor wraps Nivo. Do not infer Harbor callback arguments from Nivo or another chart library.
- When `config.tooltip` is required, the callback receives an object with `point`. It does not receive the point directly.
- Guard nested values in every chart callback. A callback must return valid content or `null` and must not throw.

```jsx
tooltip: ({ point }) => {
	if (!point?.data) return null;
	return `${point.data.xFormatted}: ${point.data.yFormatted}`;
},
```

Do not use `tooltip: (point) => point.data.x`.

### Interaction validation
After rendering a chart, test pointer move, pointer leave, keyboard focus, keyboard navigation, click, page scroll, and resize. Confirm that the chart SVG remains present and that the browser logs contain no errors.

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
`categorical`: New Magnetic UX chart type (boolean)
`config`: Chart configuration object. Refer to https://nivo.rocks/line ({ enablePointLabel?: boolean; pointLabel?: string | AccessorFunc; pointLabelYOffset?: number; areaBlendMode?: string; role?: string; useMesh?: boolean; isFocusable?: boolean; data?: Serie[]; xScale?: ScaleSpec; xFormat?: ValueFormat<DatumValue>; yScale?: ScaleSpec; yFormat?: ValueFormat<DatumValue>; layers?: Layer[]; margin?: Partial<Margin>; curve?: "linear" | "basis" | "cardinal" | "catmullRom" | "monotoneX" | "monotoneY" | "natural" | "step" | "stepAfter" | "stepBefore"; lineWidth?: number; colors?: OrdinalColorScaleConfig; theme?: Partial<{ background: string; text: Partial<TextStyle>; axis: Partial<{ domain: Partial<{ line: Partial<Partial<CSSProperties>>; }>; ticks: Partial<{ line: Partial<Partial<CSSProperties>>; text: Partial<TextStyle>; }>; legend: Partial<{ text: Partial<TextStyle>; }>; }>; grid: Partial<{ line: Partial<Partial<CSSProperties>>; }>; crosshair: Partial<{ line: Partial<{ stroke: string; strokeWidth: number; strokeOpacity: number; strokeDasharray: string; }>; }>; legends: Partial<{ hidden: Partial<{ symbol: Partial<{ fill: string; opacity: number; }>; text: TextStyle; }>; title: Partial<{ text: Partial<TextStyle>; }>; text: Partial<TextStyle>; ticks: Partial<{ line: Partial<Partial<CSSProperties>>; text: Partial<TextStyle>; }>; }>; labels: Partial<{ text: Partial<Partial<CSSProperties>>; }>; markers: Partial<{ lineColor: string; lineStrokeWidth: number; textColor: string; fontSize: string | 0; text: TextStyle; }>; dots: Partial<{ text: Partial<TextStyle>; }>; tooltip: Partial<{ container: Partial<CSSProperties>; basic: Partial<CSSProperties>; chip: Partial<CSSProperties>; table: Partial<CSSProperties>; tableCell: Partial<CSSProperties>; tableCellValue: Partial<CSSProperties>; }>; annotations: Partial<{ text: Partial<{ fill: string; outlineWidth: number; outlineColor: string; outlineOpacity: number; } & Partial<Omit<CSSProperties, "fill">>>; link: Partial<{ stroke: string; strokeWidth: number; outlineWidth: number; outlineColor: string; outlineOpacity: number; } & Partial<Omit<CSSProperties, "stroke" | "strokeWidth">>>; outline: Partial<{ stroke: string; strokeWidth: number; outlineWidth: number; outlineColor: string; outlineOpacity: number; } & Partial<Omit<CSSProperties, "stroke" | "strokeWidth">>>; symbol: Partial<{ fill: string; outlineWidth: number; outlineColor: string; outlineOpacity: number; } & Partial<Omit<CSSProperties, "fill">>>; }>; }>; axisTop?: AxisProps<any>; axisRight?: AxisProps<any>; axisBottom?: AxisProps<any>; axisLeft?: AxisProps<any>; enableGridX?: boolean; gridXValues?: TicksSpec<DatumValue>; enableGridY?: boolean; gridYValues?: TicksSpec<DatumValue>; enablePoints?: boolean; pointSymbol?: (props: Readonly<PointSymbolProps>) => ReactNode; pointSize?: number; pointColor?: any; pointBorderWidth?: number; pointBorderColor?: any; enableArea?: boolean; areaOpacity?: number; areaBaselineValue?: DatumValue; markers?: CartesianMarkerProps<DatumValue>[]; isInteractive?: boolean; onMouseEnter?: PointMouseHandler; onMouseMove?: PointMouseHandler; onMouseLeave?: PointMouseHandler; onClick?: PointMouseHandler; debugMesh?: boolean; enableSlices?: false | "x" | "y"; debugSlices?: boolean; sliceTooltip?: SliceTooltip; tooltipFormat?: ValueFormat<DatumValue>; tooltip?: PointTooltip; enableCrosshair?: boolean; crosshairType?: CrosshairType; legends?: LegendProps[]; animate?: boolean; motionConfig?: string | Partial<AnimationConfig>; defs?: { [key: string]: any; id: string; }[]; fill?: { id: string; match: Record<string, unknown> | "*" | SvgFillMatcher<Datum>; }[]; })
`height`: Chart height (string)
`loading`: Chart loading flag (boolean)
`modifyHbrConfig`: Final config before rendering, param1 is the final config, your customization should be done here ((config: Partial<LineSvgProps>, createElement: { (type: "input", props?: InputHTMLAttributes<HTMLInputElement> & ClassAttributes<HTMLInputElement>, ...children: ReactNode[]): DetailedReactHTMLElement<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>; <P extends HTMLAttributes<T>, T extends HTMLElement>(type: keyof ReactHTML, props?: ClassAttributes<T> & P, ...children: ReactNode[]): DetailedReactHTMLElement<P, T>; <P extends SVGAttributes<T>, T extends SVGElement>(type: keyof ReactSVG, props?: ClassAttributes<T> & P, ...children: ReactNode[]): ReactSVGElement; <P extends DOMAttributes<T>, T extends Element>(type: string, props?: ClassAttributes<T> & P, ...children: ReactNode[]): DOMElement<P, T>; <P extends {}>(type: FunctionComponent<P>, props?: Attributes & P, ...children: ReactNode[]): FunctionComponentElement<P>; <P extends {}>(type: ClassType<P, ClassicComponent<P, any>, ClassicComponentClass<P>>, props?: ClassAttributes<ClassicComponent<P, any>> & P, ...children: ReactNode[]): CElement<P, ClassicComponent<P, any>>; <P extends {}, T extends Component<P, any, any>, C extends ComponentClass<P, any>>(type: ClassType<P, T, C>, props?: ClassAttributes<T> & P, ...children: ReactNode[]): CElement<P, T>; <P extends {}>(type: string | FunctionComponent<P> | ComponentClass<P, any>, props?: Attributes & P, ...children: ReactNode[]): ReactElement<P, string | JSXElementConstructor<any>>; }, util: { getColors: (num: any) => string[]; getCategoricalColors: (num: any) => string[]; getLineSymbols: () => { type: string; symbol: ({ size, fill, opacity, borderWidth, borderColor, tabIndex, pointAriaDescribedBy, pointAriaLabel, pointAriaLabelledBy, pointAriaHidden, pointAriaDisabled, }: SymbolProps & { opacity?: number; tabIndex: number; ariaLabel?: "string"; } & { pointAriaLabel?: string; pointAriaDescribedBy?: string; pointAriaLabelledBy?: string; pointAriaHidden?: boolean; pointAriaDisabled?: boolean; }) => ReactSVGElement; svg: (color: any) => string; reactFregment: (color: any, margin: any) => ReactSVGElement; }[]; toggleLinePointHoverClass: (curPoint: any, ref?: any, event?: any, categorical?: any) => void; toggleLineClickingClass: (curPoint: any, ref?: any, event?: any) => void; getLineBaseConfig: (config: any, { legendsEventHandlers, itemsEventHandlers, }: MagneticLineChartConfigEventHandlerObject) => BasicConfig; getLineCategoricalConfig: (config: any, { legendsEventHandlers, itemsEventHandlers, }: MagneticLineChartConfigEventHandlerObject) => BasicConfig; HarborCustomDashedLine: ({ series, lineGenerator, xScale, yScale }: { series: any; lineGenerator: any; xScale: any; yScale: any; }) => any; }) => Partial<LineSvgProps>)
`popoverOptions`: Default popover props, check hbr-popover page for all available options ({ host?: HTMLHbrPopoverElement; anchor?: string | HTMLElement | SVGElement; content?: string; placement?: "bottom" | "left" | "right" | "top" | "top-start" | "top-end" | "right-start" | "right-end" | "bottom-start" | "bottom-end" | "left-start" | "left-end"; disabled?: boolean; distance?: number; open?: boolean; skidding?: number; trigger?: string; hoist?: boolean; enablePopover?: boolean; size?: "small" | "medium" | "large"; variant?: "map" | "default" | "confirm" | "chart"; sentiment?: "brand"; widthExpand?: boolean; featureHighlight?: boolean; hbrShow?: EventEmitter<any>; hbrAfterShow?: EventEmitter<any>; hbrHide?: EventEmitter<any>; hbrAfterHide?: EventEmitter<any>; hbrDismiss?: EventEmitter<any>; handleOpenChange?: () => Promise<void>; handleOptionsChange?: () => Promise<void>; handleDisabledChange?: () => void; handleSentimentChange?: () => void; handleAnchorChange?: () => void; show?: () => Promise<any>; hide?: () => Promise<any>; connectedCallback?: () => void; componentDidLoad?: () => void; render?: () => any; })
`width`: Chart width (string)

### Methods
`download()`
`getPopoverRef()`

### Slots
`content`: Slot for popover content
`empty-state`: Slot for empty state
`footer`: Slot for footer
`header`: Slot for header
`header-action`: Slot for header action
`header-title`: Slot for header title
`loading-state`: Slot for loading state

### Parts
`chart`: The chart element
`header`: The header element
`popover-arrow`: The popover arrow element,  check hbr-popover for more details
`popover-body`: The popover body element, check hbr-popover for more details
`popover-popup`: The popover popup element,  check hbr-popover for more details
