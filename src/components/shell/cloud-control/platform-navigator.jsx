import { useMemo, useState } from "react";
import navMeraki from "./assets/nav-meraki.svg?raw";

const navigatorSections = [
  {
    title: "Platform",
    items: [
      { label: "Home", icon: "nav-home" },
      { label: "Admin Console", icon: "nav-admin" },
      { label: "Agent Studio", icon: "nav-agents" },
      { label: "Inventory", icon: "nav-inventory" },
      { label: "Topology", icon: "nav-topology" },
      { label: "Identity", icon: "nav-identity" },
      { label: "Licensing", icon: "nav-licensing" },
      { label: "Workflows", icon: "nav-workflows" },
    ],
  },
  {
    title: "Products",
    items: [
      { label: "Collaboration Control Hub", icon: "nav-applications" },
      { label: "Intersight", icon: "nav-monitor" },
      { label: "Meraki", iconAsset: navMeraki },
      { label: "Nexus Dashboard", icon: "nav-overview" },
      { label: "Nexus Hyperfabric", icon: "nav-fabrics" },
      { label: "Security", icon: "nav-security" },
      { label: "ThousandEyes", icon: "nav-assurance" },
    ],
  },
  {
    title: "Apps",
    items: [
      { label: "Unified Cisco Fabric", icon: "nav-suite" },
      { label: "Multicloud Fabric", icon: "nav-multicloud" },
    ],
  },
  {
    title: "Bookmarks",
    items: [
      { label: "ThousandEyes users", icon: "nav-bookmarks" },
      { label: "ThousandEyes admin", icon: "nav-bookmarks" },
      { label: "Meraki users", icon: "nav-bookmarks" },
    ],
  },
];

const moreProductSections = [
  {
    title: "Networking",
    items: [
      {
        label: "IoT Operations Dashboard",
        href: "https://www.cisco.com/c/en/us/support/cloud-systems-management/iot-operations-dashboard/series.html",
      },
      { label: "Spaces", href: "https://spaces.cisco.com/" },
    ],
  },
  {
    title: "Security",
    items: [
      { label: "Application Portal", href: "https://apps.security.cisco.com/" },
      { label: "Duo Security", href: "https://duo.com/" },
      {
        label: "Email Threat Defense",
        href: "https://www.cisco.com/site/us/en/products/security/secure-email/index.html",
      },
      {
        label: "XDR",
        href: "https://www.cisco.com/site/us/en/products/security/xdr/index.html",
      },
      {
        label: "Secure Endpoint",
        href: "https://www.cisco.com/site/us/en/products/security/endpoint-security/secure-endpoint/index.html",
      },
    ],
  },
];

export default function PlatformNavigator({
  activeProduct,
  onAfterHide,
  onClose,
  onProductSelect,
  open,
}) {
  const [query, setQuery] = useState("");
  const [showMoreProducts, setShowMoreProducts] = useState(false);

  const sections = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return navigatorSections;

    return navigatorSections.map((section) => ({
      ...section,
      items: section.items.filter((item) =>
        item.label.toLowerCase().includes(normalizedQuery),
      ),
    }));
  }, [query]);

  const handleAfterHide = () => {
    setQuery("");
    setShowMoreProducts(false);
    onClose();
    onAfterHide();
  };

  const handleProductSelect = (product) => {
    onProductSelect(product);
    onClose();
  };

  return (
    <hbr-modal
      className="cloud-control-platform-navigator"
      data-testid="platform-navigator"
      label="Platform navigator"
      no-header
      onhbr-after-hide={handleAfterHide}
      open={open}
      size="large"
    >
      <div className="cloud-control-platform-content">
        <div className="cloud-control-platform-toolbar">
          <div aria-hidden="true" />
          <hbr-input
            aria-label="Search products and favorites"
            className="cloud-control-platform-search"
            clearable
            onhbr-input={(event) => setQuery(event.currentTarget.value)}
            pill
            placeholder="Search for products and favorites..."
            size="large"
            type="search"
            value={query}
          >
            {!query && (
              <span className="cloud-control-platform-search-shortcut" slot="suffix">
                ⌘+F
              </span>
            )}
          </hbr-input>

          <hbr-button
            aria-label="Close platform navigator"
            className="cloud-control-platform-close"
            no-padding
            onClick={onClose}
            size="small"
            variant="text"
          >
            <hbr-icon name="x" size="20px" />
          </hbr-button>
        </div>

        <div className="cloud-control-platform-grid">
          {sections.map((section) => (
            <section className="cloud-control-platform-section" key={section.title}>
              <hbr-text variant="smallest-title">
                {section.title}
              </hbr-text>

              <div className="cloud-control-platform-items">
                {section.items.map((item) => (
                  <hbr-button
                    aria-pressed={activeProduct === item.label}
                    className="cloud-control-platform-item"
                    data-active={activeProduct === item.label ? "true" : "false"}
                    key={item.label}
                    onClick={() => handleProductSelect(item)}
                    size="small"
                  >
                    {item.icon && (
                      <hbr-icon name={item.icon} size="16px" slot="prefix" />
                    )}
                    {item.iconAsset && (
                      <hbr-icon
                        asset={item.iconAsset}
                        size="16px"
                        slot="prefix"
                      />
                    )}
                    <span
                      className="cloud-control-platform-item-label"
                      title={item.label}
                    >
                      {item.label}
                    </span>
                    <hbr-icon name="push-pin-simple" size="16px" slot="suffix" />
                  </hbr-button>
                ))}
                {section.items.length === 0 && (
                  <hbr-text type="placeholder" size="sm">
                    No matches
                  </hbr-text>
                )}
              </div>
            </section>
          ))}
        </div>

        <div
          className="cloud-control-more-products"
          data-expanded={showMoreProducts ? "true" : "false"}
        >
          <button
            aria-controls="cloud-control-more-product-items"
            aria-expanded={showMoreProducts}
            className="cloud-control-more-products-toggle"
            onClick={() => setShowMoreProducts((current) => !current)}
            type="button"
          >
            <hbr-text variant="smallest-title">
              <span>More Cisco products</span>
            </hbr-text>
            <hbr-icon
              name={showMoreProducts ? "caret-up" : "caret-down"}
              size="16px"
            />
          </button>

          {showMoreProducts && (
            <div
              className="cloud-control-more-product-items"
              id="cloud-control-more-product-items"
            >
              {moreProductSections.map((section) => (
                <section
                  className="cloud-control-more-product-column"
                  key={section.title}
                >
                  <hbr-text variant="smallest-title">{section.title}</hbr-text>
                  <div className="cloud-control-more-product-links">
                    {section.items.map((item) => (
                      <hbr-link
                        className="cloud-control-more-product-link"
                        href={item.href}
                        key={item.label}
                        size="medium"
                        target="_blank"
                      >
                        <span className="cloud-control-more-product-link-label">
                          {item.label}
                        </span>
                        <hbr-icon
                          name="arrow-square-out"
                          size="16px"
                          slot="suffix"
                        />
                      </hbr-link>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          )}
        </div>
      </div>
    </hbr-modal>
  );
}
