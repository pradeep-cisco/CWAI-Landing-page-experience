# Slider

Slider is implemented using the web component: <hbr-slider>.

## Description
Control for selecting a numeric value or range along a track.

## Usage
```jsx
export default function Select() {
	return (
		<>
			<hbr-slider
				min="0"
				max="100"
				step="1"
				value="50"
				label="Slider with label"
				onhbr-change={(e) => console.log(e.target.value)}
			/>
			<hbr-slider
				min="0"
				max="100"
				step="1"
				value="50"
				label="Slider with label, tooltip, and disabled state"
				disabled
			/>
			<hbr-slider
				min="0"
				max="100"
				step="1"
				start="20"
				end="50"
				label="Double"
				double
			/>
		</>
	);
}

```

## API Reference

### Props
`aria`: Attributes related to screen readers. ({ label: string; labelStart: string; labelEnd: string; })
`disabled`: Disables the slider. (boolean)
`discrete`: Graduated increments allow users to select from specified incremental values. (boolean)
`double`: Use  double range slider (boolean)
`end`: End pointer of slider. It defaults to max (number)
`helpText`: The slider's help text. If you need to display HTML, use the help-text slot instead. (string)
`helpTextId`: The slider's help text id. (string)
`label`: The slider's label. If you need to display HTML, use the `label` slot instead. (string)
`max`: The maximum acceptable value of the slider. (number)
`min`: The minimum acceptable value of the slider. (number)
`name`: The name of the slider, submitted as a name/value pair with form data. (string)
`required`: Makes the slider a required field. (boolean)
`start`: Start pointer of slider. It defaults to min (number)
`step`: The interval at which the slider will increase and decrease. (number)
`tooltip`: The preferred placement of the slider's tooltip. ("bottom" | "none" | "top")
`tooltipFormatter`: A function used to format the tooltip's value. The slider's value is passed as the first and only argument. The
function should return a string to display in the tooltip. ((value: number) => string)
`uneven`: Slider with uneven steps. (boolean)
`value`: The current value of the slider, submitted as a name/value pair with form data.
Use event.target.value to retrieve values on change event. (number | number[])
`values`: Value mark labels allow users to see minimum values, maximum values, and step values in between to guide user input. (number[])

### Methods
`removeFocus()`
`reportValidity()`
`setFocus()`

### Events
`hbr-blur`: Emitted when the control loses focus.
`hbr-change`: Emitted when the control's value changes and mouse is released.
`hbr-focus`: Emitted when the control gains focus.
`hbr-input`: Emitted when the control's value changes.

### Slots
`help-text`: Help text that describes how to use the slider. Alternatively, you can use the help-text prop.
`label`: The slider's label. Alternatively, you can use the `label` attribute..
`label-info`: Interactive informational content, such as a tooltip trigger, displayed next to the slider label.
`label-suffix`: Non-interactive content to display inline with the slider label.

### Custom CSS Properties
--form-control-asterisk-display: Controls whether the required-field asterisk is displayed. Set to `block` to show the asterisk. Defaults to `none`.
--slider-track-height: The height of the slider track and hidden track hit area.
--slider-track-hit-area-height: The height of the hidden track hit area.
--thumb-size: The width of the slider thumb.
--thumb-size-hover: The width of the slider thumb when hovering.
--tooltip-offset-y: The height of the slider thumb.

### Parts
`base`: The component's base wrapper.
`inputend`: The native end slider input for double slider.
`inputstart`: The native start slider input.
`pips`
`ticks`
`tooltipend`: The slider tooltip for end position.
`tooltipstart`: The slider tooltip for start position.
`track`: The slider's track.