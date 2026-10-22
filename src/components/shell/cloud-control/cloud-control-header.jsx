import { useRef, useState } from "react";
import AppearanceSelector from "../appearance-selector";
import PlatformNavigator from "./platform-navigator";

const pinnedProducts = [
  { label: "Home", icon: "nav-home" },
  { label: "Meraki", icon: "nav-meraki-insight" },
  { label: "Security", icon: "nav-security" },
];

export default function CloudControlHeader() {
  const [activeProduct, setActiveProduct] = useState("Home");
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
              variant="context"
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
            aria-label="Open platform navigator"
            className="cloud-control-launcher"
            data-testid="platform-navigator-trigger"
            no-padding
            onClick={() => setNavigatorOpen(true)}
            ref={launcherRef}
            sentiment="header"
            variant="context"
          >
            <hbr-icon
              library="phosphor"
              size="20px"
              src="https://hbr.cisco.com/packages/phosphor/dots-nine-bold.svg"
            />
          </hbr-button>

          <div className="cloud-control-pinned-products">
            {pinnedProducts.map(({ icon, label }) => (
              <hbr-button
                aria-pressed={activeProduct === label}
                className="cloud-control-pinned-product"
                data-active={activeProduct === label ? "true" : "false"}
                key={label}
                onClick={() => setActiveProduct(label)}
                sentiment="header"
                size="small"
                variant={activeProduct === label ? "outline" : "context"}
              >
                <hbr-icon name={icon} size="16px" slot="prefix" />
                {label}
              </hbr-button>
            ))}
          </div>

          <hbr-dropdown hoist menu sentiment="header" distance="12">
            <hbr-button
              aria-label="Notifications"
              className="cloud-control-notifications"
              no-padding
              sentiment="header"
              slot="trigger"
              variant="context"
            >
              <hbr-icon name="bell" size="20px" />
            </hbr-button>
            <hbr-menu>
              <hbr-menu-item noninteractive>No new notifications</hbr-menu-item>
            </hbr-menu>
          </hbr-dropdown>
        </div>

        <AppearanceSelector compact />
      </hbr-shell-header>

      <PlatformNavigator
        onAfterHide={restoreLauncherFocus}
        onClose={() => setNavigatorOpen(false)}
        open={navigatorOpen}
      />
    </div>
  );
}
