import { colorModes, presets } from "../../theme/appearance";
import { useAppearance } from "../../theme/appearance-context";

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

export default function AppearanceSelector({ compact = false, triggerVariant }) {
  const { mode, preset, setMode, setPreset } = useAppearance();
  const modeSelectionDisabled = preset === "cloud-control";

  return (
    <hbr-dropdown
      distance="12"
      hoist
      menu
      sentiment="header"
      slot="user-profile"
    >
      <hbr-button
        aria-label={compact ? "Appearance settings" : undefined}
        caret={!compact}
        data-testid="appearance-selector-trigger"
        no-padding
        sentiment="header"
        size={compact ? "small" : undefined}
        slot="trigger"
        variant={triggerVariant}
      >
        <hbr-icon name="user" size="24px" slot="prefix" />
        {!compact && (
          <>
            <div style={profileStyles.labelBold}>{placeholderUser.username}</div>
            <div style={profileStyles.label}>{placeholderUser.organization}</div>
          </>
        )}
      </hbr-button>

      <hbr-menu
        data-testid="appearance-selector-popover"
        style={{ "--minwidth": "min(380px, calc(100vw - 24px))" }}
      >
        <hbr-menu-item noninteractive style={{ "--align-items": "center" }}>
          <hbr-icon
            library="phosphor"
            slot="prefix"
            src={`${iconsURL}/circle-half-bold.svg`}
          />
          <div style={profileStyles.labelBold}>Theme</div>
          <hbr-view-switcher
            disabled={modeSelectionDisabled}
            name="theme"
            onhbr-change={(event) => setMode(event.currentTarget.value)}
            slot="suffix"
            value={mode}
          >
            {colorModes.map(({ label, name }) => (
              <hbr-radio-button
                disabled={modeSelectionDisabled}
                key={name}
                size="small"
                value={name}
              >
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
