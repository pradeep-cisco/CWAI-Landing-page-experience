import { useMemo, useState } from "react";

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
      { label: "Meraki", icon: "nav-meraki-insight" },
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

const moreProducts = [
  { label: "Cisco IQ", icon: "nav-intelligence" },
  { label: "Splunk", icon: "nav-analytics" },
  { label: "AppDynamics", icon: "nav-monitor" },
];

export default function PlatformNavigator({ onAfterHide, onClose, open }) {
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
            placeholder="Search for products and favorites..."
            type="search"
            value={query}
          >
            <hbr-icon name="magnifying-glass" slot="prefix" />
          </hbr-input>

          <hbr-button
            aria-label="Close platform navigator"
            className="cloud-control-platform-close"
            no-padding
            onClick={onClose}
            variant="context"
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
                    className="cloud-control-platform-item"
                    key={item.label}
                    onClick={onClose}
                    size="small"
                    variant="context"
                  >
                    <hbr-icon name={item.icon} size="16px" slot="prefix" />
                    {item.label}
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

        <hbr-divider className="cloud-control-platform-divider" />

        <div className="cloud-control-more-products">
          <hbr-button
            aria-expanded={showMoreProducts}
            onClick={() => setShowMoreProducts((current) => !current)}
            size="small"
            variant="text"
          >
            More Cisco products
            <hbr-icon
              name={showMoreProducts ? "caret-up" : "caret-down"}
              size="16px"
              slot="suffix"
            />
          </hbr-button>

          {showMoreProducts && (
            <div className="cloud-control-more-product-items">
              {moreProducts.map((item) => (
                <hbr-button
                  className="cloud-control-platform-item"
                  key={item.label}
                  onClick={onClose}
                  size="small"
                  variant="context"
                >
                  <hbr-icon name={item.icon} size="16px" slot="prefix" />
                  {item.label}
                </hbr-button>
              ))}
            </div>
          )}
        </div>
      </div>
    </hbr-modal>
  );
}
