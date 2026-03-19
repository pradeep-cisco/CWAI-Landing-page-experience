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