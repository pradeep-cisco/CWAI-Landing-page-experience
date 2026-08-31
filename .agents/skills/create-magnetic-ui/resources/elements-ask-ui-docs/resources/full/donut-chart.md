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
`categorical`: New Magnetic UX chart type (boolean)
`config`: Chart configuration object. Refer to https://nivo.rocks/pie (Partial<PieSvgProps<DefaultRawDatum>> & { isChartFocusable?: boolean; })
`gauge`: Enable gauge behavior with one focusable SVG and no per-sector interactivity/popovers. (boolean)
`height`: Chart height (string)
`loading`: Chart loading flag (boolean)
`modifyHbrConfig`: Final config before rendering, param1 is the final config, your customization should be done here ((config: DonutChartConfig, createElement: { (type: "input", props?: InputHTMLAttributes<HTMLInputElement> & ClassAttributes<HTMLInputElement>, ...children: ReactNode[]): DetailedReactHTMLElement<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>; <P extends HTMLAttributes<T>, T extends HTMLElement>(type: keyof ReactHTML, props?: ClassAttributes<T> & P, ...children: ReactNode[]): DetailedReactHTMLElement<P, T>; <P extends SVGAttributes<T>, T extends SVGElement>(type: keyof ReactSVG, props?: ClassAttributes<T> & P, ...children: ReactNode[]): ReactSVGElement; <P extends DOMAttributes<T>, T extends Element>(type: string, props?: ClassAttributes<T> & P, ...children: ReactNode[]): DOMElement<P, T>; <P extends {}>(type: FunctionComponent<P>, props?: Attributes & P, ...children: ReactNode[]): FunctionComponentElement<P>; <P extends {}>(type: ClassType<P, ClassicComponent<P, any>, ClassicComponentClass<P>>, props?: ClassAttributes<ClassicComponent<P, any>> & P, ...children: ReactNode[]): CElement<P, ClassicComponent<P, any>>; <P extends {}, T extends Component<P, any, any>, C extends ComponentClass<P, any>>(type: ClassType<P, T, C>, props?: ClassAttributes<T> & P, ...children: ReactNode[]): CElement<P, T>; <P extends {}>(type: string | FunctionComponent<P> | ComponentClass<P, any>, props?: Attributes & P, ...children: ReactNode[]): ReactElement<P, string | JSXElementConstructor<any>>; }, util: { getDonutBaseConfig: (config: DonutUserConfig, { legendsEventHandlers, itemsEventHandlers, }: MagneticDonutChartConfigEventHandlerObject) => DonutBaseConfig; getDonutCategoricalConfig: (config: DonutUserConfig, { legendsEventHandlers, itemsEventHandlers, }: MagneticDonutChartConfigEventHandlerObject) => DonutBaseConfig; keyIsNoValueItem: (key: string | number) => boolean; getDonutColorsFromConfig: (config: Pick<DonutUserConfig, "data" | "id">) => string[]; itemTogglePathHover: (event: DonutInteractionEvent, node: Pick<DonutLegendDatum, "color">, isLeaving?: boolean) => void; itemTogglePathSelect: (event: MouseEvent<Element, MouseEvent>, node: Pick<DonutLegendDatum, "color">) => void; itemTogglePathUnselect: (_event: Event, chartRef: ParentNode) => void; resetAllCategoricalArcSelection: (chartSvg: ParentNode) => void; legendTogglePathHover: (targetElement: Element, color: string, leaving?: boolean) => void; generateDonutFillAttributeForNoDataColumn: () => DonutPatternFillRule[]; }) => DonutChartConfig)
`popoverOptions`: Default popover props, check hbr-popover page for all available options ({ host?: HTMLHbrPopoverElement; anchor?: string | HTMLElement | SVGElement; content?: string; placement?: "bottom" | "left" | "right" | "top" | "top-start" | "top-end" | "right-start" | "right-end" | "bottom-start" | "bottom-end" | "left-start" | "left-end"; disabled?: boolean; distance?: number; open?: boolean; skidding?: number; trigger?: string; hoist?: boolean; enablePopover?: boolean; size?: "small" | "medium" | "large"; variant?: "map" | "default" | "confirm" | "chart"; sentiment?: "brand"; widthExpand?: boolean; featureHighlight?: boolean; hbrShow?: EventEmitter<any>; hbrAfterShow?: EventEmitter<any>; hbrHide?: EventEmitter<any>; hbrAfterHide?: EventEmitter<any>; hbrDismiss?: EventEmitter<any>; handleOpenChange?: () => Promise<void>; handleOptionsChange?: () => Promise<void>; handleDisabledChange?: () => void; handleSentimentChange?: () => void; handleAnchorChange?: () => void; show?: () => Promise<any>; hide?: () => Promise<any>; connectedCallback?: () => void; componentDidLoad?: () => void; render?: () => any; })
`variant`:  ("donut" | "gauge" | "pie")
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