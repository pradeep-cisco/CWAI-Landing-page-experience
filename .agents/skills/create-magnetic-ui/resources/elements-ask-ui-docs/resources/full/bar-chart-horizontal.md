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

## API Reference

### Props
`categorical`: New Magnetic UX chart type (boolean)
`config`: Chart configuration object. Refer to https://nivo.rocks/bar ({ indexBy?: PropertyAccessor<BarDatum, string>; keys?: readonly string[]; maxValue?: number | "auto"; minValue?: number | "auto"; margin?: Partial<Margin>; innerPadding?: number; padding?: number; valueScale?: ScaleSpec; indexScale?: ScaleBandSpec; enableGridX?: boolean; gridXValues?: GridValues<string | number>; enableGridY?: boolean; gridYValues?: GridValues<string | number>; borderColor?: InheritedColorConfig<ComputedBarDatumWithValue<BarDatum>>; borderRadius?: number; borderWidth?: number; enableLabel?: boolean; label?: PropertyAccessor<ComputedDatum<BarDatum>, string>; labelFormat?: string | LabelFormatter; labelSkipWidth?: number; labelSkipHeight?: number; labelTextColor?: InheritedColorConfig<ComputedBarDatumWithValue<BarDatum>>; isInteractive?: boolean; tooltip?: FC<BarTooltipProps<BarDatum>>; valueFormat?: ValueFormat<number>; legendLabel?: PropertyAccessor<LegendLabelDatum<BarDatum>, string>; tooltipLabel?: PropertyAccessor<ComputedDatum<BarDatum>, string>; groupMode?: "stacked" | "grouped"; layout?: "vertical" | "horizontal"; reverse?: boolean; colorBy?: "id" | "indexValue"; colors?: OrdinalColorScaleConfig<ComputedDatum<BarDatum>>; theme?: Partial<{ background: string; text: Partial<TextStyle>; axis: Partial<{ domain: Partial<{ line: Partial<Partial<CSSProperties>>; }>; ticks: Partial<{ line: Partial<Partial<CSSProperties>>; text: Partial<TextStyle>; }>; legend: Partial<{ text: Partial<TextStyle>; }>; }>; grid: Partial<{ line: Partial<Partial<CSSProperties>>; }>; crosshair: Partial<{ line: Partial<{ stroke: string; strokeWidth: number; strokeOpacity: number; strokeDasharray: string; }>; }>; legends: Partial<{ hidden: Partial<{ symbol: Partial<{ fill: string; opacity: number; }>; text: TextStyle; }>; title: Partial<{ text: Partial<TextStyle>; }>; text: Partial<TextStyle>; ticks: Partial<{ line: Partial<Partial<CSSProperties>>; text: Partial<TextStyle>; }>; }>; labels: Partial<{ text: Partial<Partial<CSSProperties>>; }>; markers: Partial<{ lineColor: string; lineStrokeWidth: number; textColor: string; fontSize: string | 0; text: TextStyle; }>; dots: Partial<{ text: Partial<TextStyle>; }>; tooltip: Partial<{ container: Partial<CSSProperties>; basic: Partial<CSSProperties>; chip: Partial<CSSProperties>; table: Partial<CSSProperties>; tableCell: Partial<CSSProperties>; tableCellValue: Partial<CSSProperties>; }>; annotations: Partial<{ text: Partial<{ fill: string; outlineWidth: number; outlineColor: string; outlineOpacity: number; } & Partial<Omit<CSSProperties, "fill">>>; link: Partial<{ stroke: string; strokeWidth: number; outlineWidth: number; outlineColor: string; outlineOpacity: number; } & Partial<Omit<CSSProperties, "stroke" | "strokeWidth">>>; outline: Partial<{ stroke: string; strokeWidth: number; outlineWidth: number; outlineColor: string; outlineOpacity: number; } & Partial<Omit<CSSProperties, "stroke" | "strokeWidth">>>; symbol: Partial<{ fill: string; outlineWidth: number; outlineColor: string; outlineOpacity: number; } & Partial<Omit<CSSProperties, "fill">>>; }>; }>; annotations?: readonly AnnotationMatcher<ComputedBarDatum<BarDatum>>[]; legends?: readonly BarLegendProps[]; renderWrapper?: boolean; initialHiddenIds?: readonly (string | number)[]; data?: readonly BarDatum[]; onClick?: (datum: ComputedDatum<BarDatum> & { color: string; }, event: MouseEvent<SVGRectElement, MouseEvent>) => void; onMouseEnter?: (datum: ComputedDatum<BarDatum>, event: MouseEvent<SVGRectElement, MouseEvent>) => void; onMouseLeave?: (datum: ComputedDatum<BarDatum>, event: MouseEvent<SVGRectElement, MouseEvent>) => void; onFocus?: (datum: ComputedDatum<BarDatum>, event: FocusEvent<SVGRectElement, Element>) => void; onBlur?: (datum: ComputedDatum<BarDatum>, event: FocusEvent<SVGRectElement, Element>) => void; defs?: { [key: string]: any; id: string; }[]; fill?: { id: string; match: Record<string, unknown> | "*" | SvgFillMatcher<ComputedBarDatum<BarDatum>>; }[]; height?: number; width?: number; animate?: boolean; motionConfig?: string | Partial<AnimationConfig>; axisBottom?: AxisProps<any>; axisLeft?: AxisProps<any>; axisRight?: AxisProps<any>; axisTop?: AxisProps<any>; barComponent?: FC<BarItemProps<BarDatum>>; markers?: readonly CartesianMarkerProps<DatumValue>[]; layers?: readonly BarLayer<BarDatum>[]; role?: string; ariaLabel?: string; ariaLabelledBy?: string; ariaDescribedBy?: string; isFocusable?: boolean; barAriaLabel?: (data: ComputedDatum<BarDatum>) => string; barAriaLabelledBy?: (data: ComputedDatum<BarDatum>) => string; barAriaDescribedBy?: (data: ComputedDatum<BarDatum>) => string; barAriaHidden?: (data: ComputedDatum<BarDatum>) => Booleanish; barAriaDisabled?: (data: ComputedDatum<BarDatum>) => Booleanish; })
`height`: Chart height (string)
`loading`: Chart loading flag (boolean)
`modifyHbrConfig`: Final config before rendering, param1 is the final config, your customization should be done here ((config: Partial<BarSvgProps<BarDatum>>, createElement: { (type: "input", props?: InputHTMLAttributes<HTMLInputElement> & ClassAttributes<HTMLInputElement>, ...children: ReactNode[]): DetailedReactHTMLElement<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>; <P extends HTMLAttributes<T>, T extends HTMLElement>(type: keyof ReactHTML, props?: ClassAttributes<T> & P, ...children: ReactNode[]): DetailedReactHTMLElement<P, T>; <P extends SVGAttributes<T>, T extends SVGElement>(type: keyof ReactSVG, props?: ClassAttributes<T> & P, ...children: ReactNode[]): ReactSVGElement; <P extends DOMAttributes<T>, T extends Element>(type: string, props?: ClassAttributes<T> & P, ...children: ReactNode[]): DOMElement<P, T>; <P extends {}>(type: FunctionComponent<P>, props?: Attributes & P, ...children: ReactNode[]): FunctionComponentElement<P>; <P extends {}>(type: ClassType<P, ClassicComponent<P, any>, ClassicComponentClass<P>>, props?: ClassAttributes<ClassicComponent<P, any>> & P, ...children: ReactNode[]): CElement<P, ClassicComponent<P, any>>; <P extends {}, T extends Component<P, any, any>, C extends ComponentClass<P, any>>(type: ClassType<P, T, C>, props?: ClassAttributes<T> & P, ...children: ReactNode[]): CElement<P, T>; <P extends {}>(type: string | FunctionComponent<P> | ComponentClass<P, any>, props?: Attributes & P, ...children: ReactNode[]): ReactElement<P, string | JSXElementConstructor<any>>; }, util: { getBarBaseConfig: (configInput: Partial<BarSvgProps<BarDatum>>, { legendsEventHandlers, itemsEventHandlers, }: MagneticChartConfigEventHandlerObject) => BasicConfig; getBarCategoricalConfig: (configInput: Partial<BarSvgProps<BarDatum>>, { legendsEventHandlers, itemsEventHandlers, }: MagneticChartConfigEventHandlerObject) => BasicConfig; postUpdateMergedBarConfig: (configInput: Partial<BarSvgProps<BarDatum>>) => Partial<BarSvgProps<BarDatum>>; getBarColorsFromConfig: (config: { keys?: readonly Primitive[]; }) => string[]; getBarCategoricalColorsFromConfig: (config: { keys?: readonly Primitive[]; }, cssGradientOrientation?: string | boolean) => string[]; keysHasNoValueColumn: (keys: readonly Primitive[]) => boolean; isNoValueBarData: (data: Pick<BarValueData, "id"> & { value?: unknown; }) => boolean; getBarLabelText: (value: unknown) => string; generateBarFillAttributeForNoDataColumn: () => PatternFillRule[]; toggleBarIndividualHoverClass: (event: BarInteractionEvent, highLighting: boolean) => void; toggleBarGroupHoverClass: (event: BarInteractionEvent, filterObj: BarFilter) => void; toggleBarIndividualClickingClass: (event: BarInteractionEvent, clickingOnEachBar: boolean) => void; resetBarCategoricalClickActiveClass: (svgRef: ParentNode) => void; resetBarCategoricalVisualClasses: (svgRef: ParentNode) => void; }) => Partial<BarSvgProps<BarDatum>>)
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