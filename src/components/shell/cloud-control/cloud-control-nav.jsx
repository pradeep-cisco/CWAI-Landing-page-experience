import React from "react";
import { useNavigate } from "react-router-dom";
import Switcher from "../switcher";

const Item = ({ item, selected }) => (
  <hbr-nav-item value={item.value} selected={selected}>
    <hbr-icon name={item.icon || "nav-placeholder"} slot="prefix" />
    <div slot="content">{item.label}</div>
  </hbr-nav-item>
);

const Group = ({ item, renderItems }) => (
  <React.Fragment>
    <hbr-menu-divider />
    <hbr-text
      type="secondary"
      size="xs"
      weight="semibold"
      style={{ paddingLeft: "8px" }}
    >
      {item.label}
    </hbr-text>
    {renderItems(item.children)}
  </React.Fragment>
);

function isDescendantSelected(item, selected) {
  if (item.value === selected) return true;
  return item.children?.some((child) =>
    child.type === "section"
      ? child.children?.some((sectionChild) =>
          isDescendantSelected(sectionChild, selected),
        )
      : isDescendantSelected(child, selected),
  );
}

const Submenu = ({ item, renderItems, selected }) => (
  <hbr-nav-item
    value={item.value}
    selected={isDescendantSelected(item, selected)}
  >
    <hbr-icon name={item.icon || "nav-placeholder"} slot="prefix" />
    <div slot="content">{item.label}</div>
    <div slot="drawerHeader">{item.label}</div>
    <div slot="menu">{renderItems(item.children)}</div>
  </hbr-nav-item>
);

const Section = ({ item, selected }) => (
  <hbr-menu shell-nav>
    <hbr-text type="secondary" size="xs" weight="semibold">
      {item.label}
    </hbr-text>
    {item.children.map((child) => (
      <hbr-menu-item
        check-mark={child.value === selected}
        checked={child.value === selected}
        key={child.value}
        shell-nav
        value={child.value}
      >
        {child.icon && <hbr-icon name={child.icon} slot="prefix" />}
        {child.label}
      </hbr-menu-item>
    ))}
  </hbr-menu>
);

export default function CloudControlNav({
  collapsed,
  config = [],
  selected,
  setCollapsed,
  setSelected,
}) {
  const navigate = useNavigate();

  const handleNavItemClick = (event) => {
    const selectedItem =
      event.detail.selectedMenuItem ?? event.detail.selectedItem;

    if (!selectedItem?.value) return;

    setSelected(selectedItem.value);
    navigate(selectedItem.value);
  };

  const renderNavItems = (items) =>
    items.map((item) => {
      switch (item.type) {
        case "item":
          return (
            <Item
              item={item}
              key={item.value}
              selected={selected === item.value}
            />
          );
        case "submenu":
          return (
            <Submenu
              item={item}
              key={item.value}
              renderItems={renderNavItems}
              selected={selected}
            />
          );
        case "group":
          return (
            <Group
              item={item}
              key={item.label}
              renderItems={renderNavItems}
            />
          );
        case "section":
          return <Section item={item} key={item.label} selected={selected} />;
        default:
          return null;
      }
    });

  return (
    <nav className="cloud-control-nav" aria-label="Product navigation">
      <hbr-shell-nav
        data-theme="onecd"
        collapsed={collapsed}
        collapse-tooltip-label={collapsed ? "Expand" : "Collapse"}
        no-responsive
        onhbr-collapse={() => setCollapsed(true)}
        onhbr-collapse-click={() => setCollapsed((current) => !current)}
        onhbr-expand={() => setCollapsed(false)}
        onhbr-nav-item-click={handleNavItemClick}
      >
        <div className="cloud-control-product-identity">
          <hbr-icon name="nav-security" size="24px" />
          <hbr-text variant="section-title">Product name</hbr-text>
        </div>

        <div className="cloud-control-switcher">
          <Switcher initialLabel="Magnetic Co." />
        </div>

        {renderNavItems(config)}
      </hbr-shell-nav>
    </nav>
  );
}
