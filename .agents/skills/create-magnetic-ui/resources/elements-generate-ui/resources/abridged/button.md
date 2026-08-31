# Button

Button is implemented using the web component: <hbr-button>.

## Description
Primary interactive element triggering an immediate action.

## Usage
```jsx
export default function ButtonExample() {
	const handleClick = () => {
		alert("Button clicked");
	};

	return (
		<>
			<hbr-button onClick={handleClick}>Primary</hbr-button>
			<hbr-button variant="outline">Secondary</hbr-button>
			<hbr-button variant="text">Text</hbr-button>
			<hbr-button sentiment="negative">Destructive</hbr-button>
			<hbr-button>
				<hbr-icon name="placeholder" />
			</hbr-button>
			<hbr-button>
				<hbr-icon slot="prefix" name="placeholder" />
				With Prefix
			</hbr-button>
			<hbr-button>
				<hbr-icon slot="suffix" name="placeholder" />
				With Suffix
			</hbr-button>
			<hbr-button size="small">Small</hbr-button>
			<hbr-button disabled>Disabled</hbr-button>
			<hbr-button sentiment="interact" disabled>
				<hbr-spinner slot="prefix" />
				Loading state
			</hbr-button>
		</>
	);
}

```

## API Reference

### Props
`disabled`: Set to true to disable - disable the primary action button once it has been clicked and the action is being performed to prevent duplication of the action with a second click. (boolean)
`error`: Indicates if error state (boolean)
`loading`: Set to true to draw the button in a loading state. (boolean)
`sentiment`: Not required. Sets the sentiment of the button to negative (red) for destructive actions. (negative)
`size`: Sets the size of the button. (small | medium)
`variant`: The button styles. Primary buttons use "fill" (default), secondary buttons use "outline" and tertiary buttons use "text". "context" button fits into current context, inherits color styles from parent. ("context" | "fill" | "outline" | "text")