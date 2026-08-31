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
`aria`: Attributes related to screen readers. ({ label?: string; haspopup?: boolean; expanded?: string | boolean; controls?: string; role?: string; pressed?: boolean; })
`ariacontrols`: aria-controls (string)
`ariaexpanded`: aria-expanded (string)
`ariahaspopup`: aria-haspopup (string)
`arialabel`: aria-label (string)
`ariapressed`: aria-pressed (string)
`ariarole`: role (string)
`caret`: Set to true to draw the button with a caret for use with dropdowns, popovers, etc. (boolean)
`circle`: Set to true to draw a circle button. (boolean)
`disabled`: Set to true to disable - disable the primary action button once it has been clicked and the action is being performed to prevent duplication of the action with a second click. (boolean)
`error`: Indicates if error state (boolean)
`floating`: Floating action button (boolean)
`loading`: Set to true to draw the button in a loading state. (boolean)
`name`: An optional name for the button (string)
`noPadding`: The no padding on tertiary text link button. (boolean)
`pill`: Set to true to draw a pill-style button with rounded edges. (boolean)
`requestSubmit`: [deprecated] use type=submit (boolean)
`sentiment`: The button's color scheme. "danger" is used to indicate destructive actions. (string)
`size`: The button's size. ("large" | "medium" | "small" | "xsmall")
`submit`: [deprecated] use type=submit (boolean)
`tabidx`: tabindex (string)
`tooltip`: Tooltip content if the button serves as a tooltip reference. (string)
`type`: The type of button. When the type is `submit`, the button will submit the surrounding form. Note that the default
value is `button` instead of `submit`, which is opposite of how native `<button>` elements behave. ("button" | "submit")
`value`: An optional value for the button. (string)
`variant`: The button styles. Primary buttons use "fill" (default), secondary buttons use "outline" and tertiary buttons use "text". "context" button fits into current context, inherits color styles from parent. ("context" | "fill" | "outline" | "text")

### Methods
`removeFocus()`
`setFocus()`
`setSplitPosition()`

### Events
`hbr-blur`: Emitted when the button loses focus.
`hbr-focus`: Emitted when the button gains focus.

### Slots
`[default]`: The button's label.
`prefix`: Used to prepend an icon or similar element to the button.
`suffix`: Used to append an icon or similar element to the button.

### Custom CSS Properties
--bg-color
--bg-color-active
--bg-color-hover
--border
--border-color
--border-color-active
--border-color-hover
--border-style
--border-width
--label-affix-padding-lg: padding between prefix and label on large size button.
--label-affix-padding-md: padding between prefix and label on medium size button.
--label-affix-padding-sm: padding between prefix and label on small size button.
--label-color
--label-color-active
--label-color-hover
--label-font-size
--label-font-weight
--label-icon-color
--label-icon-color-hover
--palm-width: button width on responsive design palm.

### Parts
`base`: The component's base wrapper.
`caret`: The button's caret.
`error`: The component's base wrapper with the error state.
`label`: The button's label.
`prefix`: The prefix container.
`suffix`: The suffix container.
`text`: The component's base wrapper for the text button.