# Code Snippet

Code Snippet is implemented using the web component: <hbr-code-snippet>.

## Description
Preformatted code block with optional copy affordances.

## Usage
```jsx
export default function CodeSnippet() {
	const value = `function resolveAfter2Seconds(x) {
	return new Promise((resolve) => {
		setTimeout(() => {
			resolve(x);
		}, 2000);
	});
    }

    // this comment is here to demonstrate an extremely long line length, well beyond what you should probably allow in your own code
    const add = async function (x) {
        const a = await resolveAfter2Seconds(20);
        const b = await resolveAfter2Seconds(30);
        return x + a + b;
    };

    add(10).then((v) => {
        console.log(v); // prints 60 after 4 seconds.
    });

    // async function expression used as an IIFE
    (async function (x) {
        const p1 = resolveAfter2Seconds(20);
        const p2 = resolveAfter2Seconds(30);
        return x + (await p1) + (await p2);
    })(10).then((v) => {
        console.log(v); // prints 60 after 2 seconds.
    });`;

	return (
		<div>
			<hbr-code-snippet code={value} />
		</div>
	);
}

```

## API Reference

### Props
`code`: The code string display in the component (string)
`inline`: Turn on the inline mode (boolean)
`lineNumber`: Show the line number (boolean)
`maxCharacters`: The max characters per line (number)
`size`: The size of the component ("auto" | "medium" | "small")
`syntax`: it's not turning on the syntax of the component, but to work with styling of syntax (boolean)

### Methods
`copy()`
`export()`

### Slots
`tools`: Used to display copy and export buttons

### Parts
`base`: The component's base wrapper.
`code`
`content`: The component's content wrapper.
`inline`: The component's inline wrapper when inline prop is true.
`line`
`line-content`
`line-number`
`pre`
`tools`: The component's tools wrapper.