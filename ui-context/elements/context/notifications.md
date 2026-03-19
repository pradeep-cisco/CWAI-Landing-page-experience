# Notifications 

## Description
Container surface displaying system or user-triggered messages.

## Usage
```jsx
export default function Notifications() {
	const data = [
		{
			sentiment: "info",
			icon: "status-info",
			message: "This is an info message",
			closable: true,
		},
		{
			sentiment: "warning",
			icon: "status-warning",
			message: "This is a warning message",
			closable: true,
		},
		{
			sentiment: "danger",
			icon: "status-negative",
			message: "This is an error message",
			closable: true,
		},
		{
			sentiment: "positive",
			icon: "status-positive",
			message: "This is a success message",
			closable: true,
		},
		{
			sentiment: "info",
			icon: "status-info",
			message:
				"This is an info message with multiple lines of text to show how the icon is centered on the first line of text",
			closable: false,
		},
	];

	return <>
		{data.map((item, index) => (
			<hbr-banner
				key={index.toString()}
				sentiment={item.sentiment}
				variant="fill"
				open
				closable={item.closable}
			>
				<hbr-icon slot="icon" sentiment={item.sentiment} name={item.icon} />
				{item.message}
			</hbr-banner>
		))}
	</>
}

```