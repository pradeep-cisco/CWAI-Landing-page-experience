import { useEffect, useState } from "react";
import {
  applyColorMode,
  applyPreset,
  colorModes,
  getColorMode,
  getPreset,
  persistColorMode,
  persistPreset,
  presets,
} from "../../theme/appearance";

const iconsURL = "https://hbr.cisco.com/packages/phosphor";
const placeholderUser = {
  username: "username",
  organization: "Cisco Systems, Inc",
};

const profileStyles = {
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
};

function AppearanceSelector() {
  const [mode, setMode] = useState(getColorMode);
  const [preset, setPreset] = useState(getPreset);

  useEffect(() => {
    applyColorMode(mode);
    persistColorMode(mode);

    if (mode !== "system") return undefined;

    const systemColorMode = window.matchMedia("(prefers-color-scheme: dark)");
    const handleSystemColorModeChange = () => applyColorMode("system");
    systemColorMode.addEventListener("change", handleSystemColorModeChange);

    return () => {
      systemColorMode.removeEventListener("change", handleSystemColorModeChange);
    };
  }, [mode]);

  useEffect(() => {
    applyPreset(preset);
    persistPreset(preset);
  }, [preset]);

  return (
    <hbr-dropdown
      distance="12"
      hoist
      menu
      sentiment="header"
      slot="user-profile"
    >
      <hbr-button
        caret
        data-testid="appearance-selector-trigger"
        no-padding
        sentiment="header"
        slot="trigger"
      >
        <hbr-icon name="user" size="24px" slot="prefix" />
        <div style={profileStyles.labelBold}>{placeholderUser.username}</div>
        <div style={profileStyles.label}>{placeholderUser.organization}</div>
      </hbr-button>

      <hbr-menu
        data-testid="appearance-selector-popover"
        style={{ "--minwidth": "400px" }}
      >
        <hbr-menu-item noninteractive style={{ "--align-items": "center" }}>
          <hbr-icon
            library="phosphor"
            slot="prefix"
            src={`${iconsURL}/circle-half-bold.svg`}
          />
          <div style={profileStyles.labelBold}>Theme</div>
          <hbr-view-switcher
            name="theme"
            onhbr-change={(event) => setMode(event.currentTarget.value)}
            slot="suffix"
            value={mode}
          >
            {colorModes.map(({ label, name }) => (
              <hbr-radio-button key={name} size="small" value={name}>
                {label}
              </hbr-radio-button>
            ))}
          </hbr-view-switcher>
        </hbr-menu-item>

        <hbr-divider />

        <hbr-menu-item noninteractive style={{ "--align-items": "center" }}>
          <hbr-icon name="magnet" slot="prefix" />
          <div style={profileStyles.labelBold}>Preset</div>
          <hbr-view-switcher
            name="preset"
            onhbr-change={(event) => setPreset(event.currentTarget.value)}
            slot="suffix"
            value={preset}
          >
            {presets.map(({ label, name }) => (
              <hbr-radio-button key={name} size="small" value={name}>
                {label}
              </hbr-radio-button>
            ))}
          </hbr-view-switcher>
        </hbr-menu-item>
      </hbr-menu>
    </hbr-dropdown>
  );
}

export default function Header() {
  return (
    <div
      className="n-header"
      style={{
        width: "100%",
        minHeight: "56px",
      }}
    >
      <hbr-shell-header>
        <a href="/" slot="logo-name">
          <hbr-icon name="cisco" />
          <div>Meraki</div>
        </a>

        <AppearanceSelector />
      </hbr-shell-header>
    </div>
  );
}
