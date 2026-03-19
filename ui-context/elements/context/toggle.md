# Toggle

Toggle is implemented using the web component: <hbr-switch>.

## Description
Switch control representing an on/off state.

## Usage
```jsx
export default function Toggle() {
	return (
		<hbr-switch
			name="approved"
			onhbr-change={(e) => {
				console.log(e.target.name, ": ", e.target.checked);
			}}
		>
			Approved
		</hbr-switch>
	);
}

```