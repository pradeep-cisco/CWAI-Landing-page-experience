# Anchor Link Menu 

## Description
Menu of in‑page anchor links for quick section navigation.

## Usage
```jsx
import { useState } from "react";

export default function AnchorLinkMenu() {
	const [selected, setSelected] = useState(1);
	const list = [
		{ name: "Lions", id: "lions", children: [] },
		{ name: "Tigers", id: "tigers" },
		{
			name: "Bears",
			id: "bears",
			children: [
				{ name: "Grizzly", id: "grizzly" },
				{ name: "Polar", id: "polar" },
			],
		},
	];

	const handleSelect = (event) => {
		event.preventDefault();
		console.log(event.target);
		const dataId = event.target.getAttribute("data-testid").slice(5);
		setSelected(dataId);
	};

	const handleClick = (event) => {
		const dataId = event.target.id;
		setSelected(dataId);
	};

	return (
		<hbr-layout direction="row" gap="lg" align="start" style={{ justifyContent: "space-between" }}>
			<hbr-layout direction="column">
				<hbr-button
					id="lions"
					variant={selected !== "lions" ? "text" : "fill"}
					onClick={handleClick}
				>
					Lions
				</hbr-button>
				<hbr-button
					id="tigers"
					variant={selected !== "tigers" ? "text" : "fill"}
					onClick={handleClick}
				>
					Tigers
				</hbr-button>
				<hbr-button
					id="bears"
					variant={selected !== "bears" ? "text" : "fill"}
					onClick={handleClick}
				>
					Bears
				</hbr-button>
				<hbr-layout
					direction="row"
					gap="lg"
					style={{ paddingLeft: "var(--hbr-spacing-lg)" }}
				>
					<hbr-button
						id="grizzly"
						variant={selected !== "grizzly" ? "text" : "fill"}
						onClick={handleClick}
					>
						Grizzly
					</hbr-button>
					<hbr-button
						id="polar"
						variant={selected !== "polar" ? "text" : "fill"}
						onClick={handleClick}
					>
						Polar
					</hbr-button>
				</hbr-layout>
			</hbr-layout>

			{/* Anchor Link Menu */}
			<div>
				<hbr-list anchor={true}>
					{list.map((item, idx) => {
						return (
							<hbr-list-item
								key={idx.toString()}
								variant="anchor"
								active={item.id === selected}
							>
								<hbr-link
									href={`#${item.id}`}
									onClick={handleSelect}
									data-id={item.id}
									data-testid={`link-${item.id}`}
								>
									{item.name}
								</hbr-link>
								{item.children &&
									item.children.length > 0 &&
									item.children.map((child, idx) => {
										return (
											<hbr-list-item
												key={idx.toString()}
												variant="anchor"
												active={child.id === selected}
												slot="children"
											>
												<hbr-link
													href="#"
													onClick={handleSelect}
													data-testid={`link-${child.id}`}
												>
													{child.name}
												</hbr-link>
											</hbr-list-item>
										);
									})}
							</hbr-list-item>
						);
					})}
				</hbr-list>
			</div>
		</hbr-layout>
	);
}

```