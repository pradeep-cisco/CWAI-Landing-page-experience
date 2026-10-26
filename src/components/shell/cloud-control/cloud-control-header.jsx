import { useRef, useState } from "react";
import AppearanceSelector from "../appearance-selector";
import PlatformNavigator from "./platform-navigator";
import navMeraki from "./assets/nav-meraki.svg?raw";

const pinnedProducts = [
  { label: "Home", icon: "nav-home" },
  { label: "Meraki", iconAsset: navMeraki },
  { label: "Security", icon: "nav-security" },
];

export default function CloudControlHeader({
  activeProduct,
  onProductSelect,
}) {
  const [navigatorOpen, setNavigatorOpen] = useState(false);
  const [tenant, setTenant] = useState("APJ Production");
  const launcherRef = useRef(null);

  const handleTenantSelect = (event) => {
    setTenant(event.detail.item.value);
  };

  const restoreLauncherFocus = () => {
    launcherRef.current?.element?.setFocus?.();
  };

  return (
    <div className="cloud-control-header">
      <hbr-shell-header data-theme="onecd">
        <a href="/" aria-label="Cloud Control home" slot="logo-name">
          <hbr-icon name="cisco" />
          <div>Cloud Control</div>
        </a>

        <div className="cloud-control-header-tools" slot="utilities">
          <div className="cloud-control-brand-divider" aria-hidden="true" />

          <hbr-dropdown
            className="cloud-control-tenant"
            hoist
            menu
            sentiment="header"
            distance="12"
          >
            <hbr-button
              caret
              sentiment="header"
              slot="trigger"
              variant="text"
            >
              {tenant}
            </hbr-button>
            <hbr-menu onhbr-select={handleTenantSelect}>
              <hbr-menu-item value="APJ Production">APJ Production</hbr-menu-item>
              <hbr-menu-item value="US Production">US Production</hbr-menu-item>
              <hbr-menu-item value="EU Sandbox">EU Sandbox</hbr-menu-item>
            </hbr-menu>
          </hbr-dropdown>

          <hbr-button
            aria-expanded={navigatorOpen ? "true" : "false"}
            aria-label={
              navigatorOpen
                ? "Close platform navigator"
                : "Open platform navigator"
            }
            className="cloud-control-launcher"
            data-testid="platform-navigator-trigger"
            no-padding
            onClick={() => setNavigatorOpen((current) => !current)}
            ref={launcherRef}
            sentiment="header"
            size="small"
            variant="text"
          >
            <hbr-icon
              size="20px"
              name="dots-nine"
            />
          </hbr-button>

          <div className="cloud-control-pinned-products">
            {pinnedProducts.map(({ icon, iconAsset, label }) => (
              <hbr-button
                aria-pressed={activeProduct === label}
                className="cloud-control-pinned-product"
                data-active={activeProduct === label ? "true" : "false"}
                key={label}
                onClick={() => onProductSelect({ icon, iconAsset, label })}
                sentiment="header"
                size="small"
              >
                {icon && <hbr-icon name={icon} size="16px" slot="prefix" />}
                {iconAsset && <hbr-icon asset={iconAsset} size="16px" slot="prefix" />}
                {label}
              </hbr-button>
            ))}
          </div>
        </div>

        <AppearanceSelector compact triggerVariant="text" />
      </hbr-shell-header>

      <PlatformNavigator
        activeProduct={activeProduct}
        onAfterHide={restoreLauncherFocus}
        onClose={() => setNavigatorOpen(false)}
        onProductSelect={onProductSelect}
        open={navigatorOpen}
      />
    </div>
  );
}
