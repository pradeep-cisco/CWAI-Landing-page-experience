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