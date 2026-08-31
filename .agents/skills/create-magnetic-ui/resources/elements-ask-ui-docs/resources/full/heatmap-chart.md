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
`categorical`: New Magnetic UX chart type (boolean)
`config`: Chart configuration object. Refer to https://nivo.rocks/heatmap (Partial<HeatMapSvgProps<HeatMapDatum, Record<string, unknown>>> & { labelStyle?: CSSProperties; })
`height`: Chart height (string)
`loading`: Chart loading flag (boolean)
`modifyHbrConfig`: Final config before rendering, param1 is the final config, your customization should be done here ((config: BaseHeatmapConfig, createElement: { (type: "input", props?: InputHTMLAttributes<HTMLInputElement> & ClassAttributes<HTMLInputElement>, ...children: ReactNode[]): DetailedReactHTMLElement<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>; <P extends HTMLAttributes<T>, T extends HTMLElement>(type: keyof ReactHTML, props?: ClassAttributes<T> & P, ...children: ReactNode[]): DetailedReactHTMLElement<P, T>; <P extends SVGAttributes<T>, T extends SVGElement>(type: keyof ReactSVG, props?: ClassAttributes<T> & P, ...children: ReactNode[]): ReactSVGElement; <P extends DOMAttributes<T>, T extends Element>(type: string, props?: ClassAttributes<T> & P, ...children: ReactNode[]): DOMElement<P, T>; <P extends {}>(type: FunctionComponent<P>, props?: Attributes & P, ...children: ReactNode[]): FunctionComponentElement<P>; <P extends {}>(type: ClassType<P, ClassicComponent<P, any>, ClassicComponentClass<P>>, props?: ClassAttributes<ClassicComponent<P, any>> & P, ...children: ReactNode[]): CElement<P, ClassicComponent<P, any>>; <P extends {}, T extends Component<P, any, any>, C extends ComponentClass<P, any>>(type: ClassType<P, T, C>, props?: ClassAttributes<T> & P, ...children: ReactNode[]): CElement<P, T>; <P extends {}>(type: string | FunctionComponent<P> | ComponentClass<P, any>, props?: Attributes & P, ...children: ReactNode[]): ReactElement<P, string | JSXElementConstructor<any>>; }, util: { getHeatmapBaseConfig: (config: any, { itemsEventHandlers }: Partial<MagneticChartConfigEventHandlerObject>) => BasicConfig; getHeatmapCategoricalConfig: (config: HeatmapConfig, { itemsEventHandlers }: Partial<MagneticChartConfigEventHandlerObject>) => BasicConfig; }) => BaseHeatmapConfig)
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