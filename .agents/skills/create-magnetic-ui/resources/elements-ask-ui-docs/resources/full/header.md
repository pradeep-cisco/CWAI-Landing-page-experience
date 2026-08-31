# Header

Header is implemented using the web component: <hbr-shell-header>.

## Description
Application shell header with branding, navigation and global actions.

## Usage
```jsx
export default function ShellHeader() {
	const Brand = (
		<a href="#" slot="logo-name" onClick={e => e.preventDefault()}>
			<hbr-icon name="cisco" />
			<div>Analytics</div>
		</a>
	);

	const Settings = (
		<>
			<hbr-dropdown hoist menu sentiment="header" distance="12">
				<hbr-button id="header-setting-button" noPadding sentiment="header" slot="trigger">
                <hbr-icon name="gear-six" style={{ fontSize: "24px" }}/>
					{/* <Gear size={20} weight="bold" /> */}
				</hbr-button>
				<hbr-menu>
					<hbr-menu-item value="1">Content</hbr-menu-item>
				</hbr-menu>
			</hbr-dropdown>
			<hbr-tooltip dismissOnClick anchor="#header-setting-button">
				<div slot="content">
					Setting
				</div>
			</hbr-tooltip>
		</>
	);

	const Notifications = (
		<>
		<hbr-dropdown hoist menu sentiment="header" distance="12">
			<hbr-button id="header-notification-button" noPadding sentiment="header" slot="trigger">
				<hbr-icon name="bell" style={{ fontSize: "24px" }}></hbr-icon>
				<hbr-badge
					style={{ "--border": "2px solid var(--hbr-color-neutral-vivid-text, #FFFFFF)" }}
					inline pill slot="suffix" sentiment="negative">
					99+
				</hbr-badge>
			</hbr-button>
			<hbr-menu>
				<hbr-menu-item value="1">Content</hbr-menu-item>
			</hbr-menu>
		</hbr-dropdown>
		<hbr-tooltip dismissOnClick anchor="#header-notification-button">
				<div slot="content">
					Content
				</div>
			</hbr-tooltip>
		</>
	);

	const userProfileStyles = {
		heading: {
			fontSize: "var(--hbr-font-size-sm, 14px)",
			color: "var(--hbr-color-neutral-text-weak, #596069)",
			padding: "0 12px",
		},
		labelBold: {
			fontWeight: "600",
			fontSize: "var(--hbr-font-size-sm, 14px)",
			textAlign: "left",
			lineHeight: "20px",
			padding: "0 12px",
		},
		label: {
			fontWeight: "400",
			textAlign: "left",
			lineHeight: "14px",
			padding: "0 12px",
		},
		menuBody: {
			flex: "1 1 auto",
		},
		menu: {
			display: "flex",
			flexDirection: "column",
			width: "fit-content",
			minWidth: "fit-content",
			maxWidth: "fit-content",
			padding: "0px",
			boxShadow: "var(--hbr-shadow-xs)",
			borderRadius: "6px",
			border: "2px solid var(--hbr-color-neutral-border)",
		},
		menuItem: {
			backgroundColor: "var(--background)",
			position: "relative",
			display: "flex",
			alignItems: "stretch",
			fontFamily: "var(--hbr-font-body)",
			fontSize: "var(--hbr-font-size-sm)",
			fontWeight: "var(--hbr-font-weight-normal)",
			lineHeight: "var(--hbr-font-line-height-normal)",
			letterSpacing: "var(--hbr-font-letter-spacing-normal)",
			textAlign: "left",
			color: "var(--hbr-control-color, #23282e)",
			padding: "14px",
			transition: "var(--hbr-transition-fast) fill",
			userSelect: "none",
			whiteSpace: "nowrap",
		},
		prefix: {
			flex: "0 0 auto",
			display: "flex",
			alignItems: "center",
			color: "var(--hbr-color-neutral-icon, #7E868F)",
		},
		suffix: {
			flex: "0 0 auto",
			display: "flex",
		},
		devider: {
			borderTop: "solid 1px var(--hbr-color-neutral-border-weak)",
		},
	};
	const UserProfile = (
		<hbr-dropdown
			slot="user-profile"
			hoist
			menu
			sentiment="header"
			distance="12"
		>
			<hbr-button noPadding sentiment="header" slot="trigger" data-testid="user-profile-trigger" caret>
				<hbr-icon name="user" slot="prefix" style={{ fontSize: "24px" }}></hbr-icon>
				<div style={userProfileStyles.labelBold}>Alexander</div>
				<div style={userProfileStyles.label}>Business Corp, Inc</div>
			</hbr-button>
			<div style={userProfileStyles.menu} data-testid="user-profile-popover">
				<div style={userProfileStyles.menuItem}>
					<hbr-icon name="users"></hbr-icon>
					<div style={userProfileStyles.menuBody}>
						<div style={userProfileStyles.heading}>Logged in as</div>
						<div style={userProfileStyles.labelBold}>Alexander</div>
						<div style={userProfileStyles.labelBold}>alexander@bizcorp.com</div>
					</div>
					<hbr-button style={userProfileStyles.suffix} variant="outline">
						Log Out
					</hbr-button>
				</div>
				<div style={userProfileStyles.devider} />
				<div style={userProfileStyles.menuItem}>
                    <hbr-icon name="users"></hbr-icon>
					{/* <Users style={userProfileStyles.prefix} size={20} weight="bold" /> */}
					<div style={userProfileStyles.menuBody}>
						<div style={userProfileStyles.heading}>Organization selected</div>
						<div style={userProfileStyles.labelBold}>Business Corp, Inc.</div>
						<div style={userProfileStyles.labelBold}>alexander@bizcorp.com</div>
					</div>
					<hbr-button style={userProfileStyles.suffix} variant="outline">
						Switch
					</hbr-button>
				</div>
				<div style={userProfileStyles.devider} />
				<div style={userProfileStyles.menuItem}>
                    <hbr-icon name="lightning"></hbr-icon>
					{/* <Lightning  size={20} weight="bold" /> */}
					<div style={userProfileStyles.menuBody}>
						<div style={userProfileStyles.labelBold}>System Status</div>
					</div>
					<hbr-tag sentiment="positive" style={userProfileStyles.suffix}>
						<hbr-icon
							name="status-positive"
							sentiment="positive"
							slot="prefix"
						/>
						Healthy
					</hbr-tag>
				</div>
			</div>
		</hbr-dropdown>
	);

	const appLauncher = (
		<hbr-dropdown
			slot="application-launcher"
			hoist
			menu
			sentiment="header"
			distance="12"
		>
			<hbr-button noPadding sentiment="header" slot="trigger">
				<hbr-icon name="dots-nine" style={{ fontSize: "24px" }} />
			</hbr-button>
			<hbr-menu>
				<hbr-menu-item>Apps</hbr-menu-item>
			</hbr-menu>
		</hbr-dropdown>
	);
	return (
		<div>
			<hbr-shell-header
				style={{
					flexWrap: "wrap",
					display: "flex",
					zIndex: "var(--zindex-header, 1000)",
					top: "0px",
					position: "sticky",
				}}
			>
				{Brand}
				<div slot="utilities">
					{Settings}
					{Notifications}
					<hbr-menu-divider vertical sentiment="header" />
				</div>
				{UserProfile}
				{appLauncher}
				<style>
					{`
        hbr-shell-header hbr-button[sentiment="header"]::part(base) {
          padding: 0 8px;
          height: 36px;
          display: flex;
          align-items: center;
        }
        hbr-menu-divider[sentiment="header"] {
            height: 24px;
        }
		hbr-icon: {
			font-size: 24px;
			}
        }`}
				</style>
			</hbr-shell-header>
		</div>
	);
}

```

## API Reference

### Events
`hbr-height-changed`: Emitted when height of the header changes due to focus entering or leaving the skip slot.

### Slots
`application-launcher`: Application Launcher
`logo-name`: Company's logo and Product Name.
`menu`: Main menu nav.
`search`: Search input-field to perform global search.
`skip`: Skip navigation links for accessibility (since version 2.18.24).
`user-profile`: Set of element to display user profile.
`utilities`: Set of element to display utilities for user. Normally contain icons and dropdowns.

### Parts
`base`
`skip`
`wrapper`