# Navigation

## Description
Primary navigation component, expandable side panel for app sections.

## Usage
```jsx
import { useState } from "react";


const organizations = [
	"Acme Org",
	"Org 2",
	"Org 3",
	"Org 4",
	"Org 5",
	"Org 6",
	"Org 7",
	"Org 8",
	"Org 9",
	"Org 10",
	"Org 11",
	"Org 12",
	"Org 13",
];


export default function Navigation() {
	const [selectedItem, setSelectedItem] = useState("Home");
	const [switcherItem, setSwitcherItem] = useState(organizations[0]);

	const handleNavItemClick = (event) => {
		console.log("Navigation item clicked:", event.detail);
		setSelectedItem(
			event.detail.selectedMenuItem
				? event.detail.selectedMenuItem.value
				: event.detail.selectedItem.value,
		);
	};

	return (
		<div className="app_wrapper">
			<hbr-shell-nav onhbr-nav-item-click={handleNavItemClick}>
				<hbr-nav-item switcher tooltip-text={switcherItem} style={{ "--drawer-left": "460px" }}>
					<hbr-icon slot="prefix" name="nav-organization-switcher" />
					<div slot="content-header">Organization</div>
					<div slot="content">{switcherItem}</div>
					<div slot="drawerHeader">Select an organization</div>
					<div slot="menu">
						<hbr-input
							placeholder="Search for network"
							size="medium"
							type="search"
							hbr-input={(event) => console.log(event.target.value)}
						>
							<div slot="prefix">
								<hbr-icon
									name="magnifying-glass"
									className="leading-icon-sample-icon"
									style={{
										color: "#7E868F",
										padding: "2px",
										paddingTop: "8px",
										fontSize: "16px",
									}}
								/>
							</div>
						</hbr-input>
						<hbr-button
							variant="text"
							style={{ paddingBottom: "16px", paddingTop: "12px" }}
						>
							<hbr-icon slot="prefix" name="plus" /> Add an Organization
						</hbr-button>
						<hbr-menu>
							{organizations.map((item, key) => {
								return (
									<hbr-menu-item
										density="comfy"
										key={key}
										checked={switcherItem === item}
										check-mark={switcherItem === item}
										value={item}
									>
										{item}
									</hbr-menu-item>
								);
							})}
						</hbr-menu>
					</div>
				</hbr-nav-item>
				<hbr-nav-item value="Home" selected={selectedItem === "Home"} style={{ "--drawer-left": "464px" }}>
					<hbr-icon slot="prefix" name="nav-home" />
					<div slot="content">Home</div>
				</hbr-nav-item>

				<hbr-nav-item style={{ "--drawer-left": "464px" }}>
					<hbr-icon slot="prefix" name="nav-applications" />
					<div slot="content">Applications Software</div>
					<div slot="drawerHeader">Applications Software</div>
					<div slot="menu">
						<hbr-menu nav>
							<hbr-menu-label nav>Productivity software</hbr-menu-label>
							<hbr-menu-item nav value="Google Suite">
								Google Suite
							</hbr-menu-item>
							<hbr-menu-item nav value="Notion">
								Notion
							</hbr-menu-item>
							<hbr-menu-item nav value="Microsoft 365">
								Microsoft 365
							</hbr-menu-item>
							<hbr-menu-item nav value="Dropbox">
								Dropbox
							</hbr-menu-item>
							<hbr-menu-item nav value="Trello">
								Trello
							</hbr-menu-item>
							<hbr-menu-item nav value="Box">
								Box
							</hbr-menu-item>
						</hbr-menu>
						<hbr-menu nav>
							<hbr-menu-label nav>HR software</hbr-menu-label>
							<hbr-menu-item nav value="Workday">
								Workday
							</hbr-menu-item>
							<hbr-menu-item nav value="Gusto">
								Gusto
							</hbr-menu-item>
							<hbr-menu-item nav value="15Five">
								15Five
							</hbr-menu-item>
							<hbr-menu-item nav value="ADP">
								ADP
							</hbr-menu-item>
						</hbr-menu>
					</div>
				</hbr-nav-item>

				<hbr-nav-item style={{ "--drawer-left": "464px" }}>
					<hbr-icon slot="prefix" name="nav-inventory" />
					<div slot="content">Inventory</div>
					<div slot="drawerHeader">Inventory</div>
					<div slot="menu">
						<hbr-menu nav>
							<hbr-menu-item nav value="Software assets">
								Software assets
							</hbr-menu-item>
							<hbr-menu-item nav value="Hardware assets">
								Hardware assets
							</hbr-menu-item>
							<hbr-menu-item nav value="Data assets">
								Data assets
							</hbr-menu-item>
							<hbr-menu-item nav value="IoT devices">
								IoT devices
							</hbr-menu-item>
							<hbr-menu-item nav value="Physical security assets">
								Physical security assets
							</hbr-menu-item>
						</hbr-menu>
					</div>
				</hbr-nav-item>
				<hbr-nav-item value="Access management" style={{ "--drawer-left": "464px" }}>
					<hbr-icon slot="prefix" name="nav-access-management" />
					<div slot="content">Access management</div>
				</hbr-nav-item>
			</hbr-shell-nav>
			<hbr-text variant="page-title" class="h1">
				{selectedItem}
			</hbr-text>
			<style>
				{`
      .app_wrapper {
        display: flex;
      }

      .h1 {
        padding-left: 20px
      }

      hbr-shell-nav {
        height: 500px;
      }

      hbr-nav-item {
        --drawer-collapsed-left: 160px;
        --header-offset: 66px;
      }`}
			</style>
		</div>
	);
}

```