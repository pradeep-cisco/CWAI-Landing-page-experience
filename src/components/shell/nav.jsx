import Switcher from "./switcher";
import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';

// Define the navigation data structure
// This array contains objects that represent different navigation items
// Each item can be of type: "item", "submenu", "group", or "section"
// 	item: leaf nodes that has a corresponding page attached to it
//  group: Root nodes at the first level are organized as "groups"
//	submenu: nodes, that have a child menu opening in a sidebar
//  section: children of "submenus" are organized as "sections"
const navigationData = [
  {
    value: "home",
    type: "item",
    icon: "nav-home",
    label: "Home",
  },
  {
    value: "form",
    type: "item",
    icon: "nav-settings",
    label: "Form",
  },
  {
    value: "table",
    type: "item",
    icon: "nav-servers",
    label: "Table",
  },
  {
    value: "components",
    type: "submenu",
    icon: "nav-inventory",
    label: "Components",
    children: [
      {
        label: "Core Elements",
        type: "section",
        children: [
          { label: "Badge", value: "components/badge", type: "item" },
          { label: "Button", value: "components/button", type: "item" },
        ],
      },
      {
        label: "Charts",
        type: "section",
        children: [
          { label: "Bar", value: "components/bar", type: "item" },
          { label: "Donut", value: "components/donut", type: "item" },
        ],
      },
    ],
  },
  {
    label: "Administration",
    type: "group",
    children: [
      {
        label: "Applications",
        type: "submenu",
        icon: "nav-applications",
        children: [
          {
            label: "Productivity software",
            type: "section",
            children: [
              {
                label: "Google Suite",
                value: "applications/google",
                type: "item",
              },
              { label: "Notion", value: "applications/notion", type: "item" },
            ],
          },
          {
            label: "HR software",
            type: "section",
            children: [
              { label: "Workday", value: "applications/workday", type: "item" },
              { label: "ADP", value: "applications/adp", type: "item" },
            ],
          },
          {
            type: "section",
            children: [
              {
                label: "Internal",
                type: "submenu",
                children: [
                  {
                    label: "Benefits",
                    value: "applications/internal/benefits",
                    type: "item",
                  },
                  {
                    label: "Referrals",
                    value: "applications/internal/referrals",
                    type: "item",
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        label: "User Management",
        value: "user-management",
        type: "item",
        icon: "nav-admin",
      },
      {
        label: "Group Management",
        value: "group-management",
        type: "item",
        icon: "nav-users",
      },
    ],
  },
];

// Component to render a single navigation item
const Item = ({ item, selected, onSelect }) => (
  <hbr-nav-item value={item.value} selected={selected}>
    {item.icon && <hbr-icon slot="prefix" name={item.icon} />}
    <div slot="content">
      {item.label}
    </div>
  </hbr-nav-item>
);

// Component to render a group of navigation items at the root level
const Group = ({ item, renderItems }) => (
  <React.Fragment>
    <hbr-menu-divider />
    <div
      className="hbr-css__text-secondary-xs-semibold"
      style={{ paddingLeft: "8px" }}
    >
      {item.label}
    </div>
    {/** 
			<hbr-divider />
			<hbr-label variant="nav-group">
				<hbr-truncate>{item.label}</hbr-truncate>
			</hbr-label>
		*/}
    {renderItems(item.children)}
  </React.Fragment>
);

// Component to render a submenu
// This component handles nested navigation items
const Submenu = ({ item, selected, onSelect, renderItems }) => {
  const isDescendantSelected = (item) => {
    if (item.value === selected) return true;
    if (item.children) {
      return item.children.some((child) => {
        if (child.type === "item" || child.type === "submenu") {
          return isDescendantSelected(child);
        }
        if (child.type === "section") {
          return child.children.some((sectionChild) =>
            isDescendantSelected(sectionChild),
          );
        }
        return false;
      });
    }
    return false;
  };
  const isSelected = isDescendantSelected(item);

  return (
    <hbr-nav-item value={item.value} selected={isSelected}>
      {item.icon && <hbr-icon slot="prefix" name={item.icon} />}
      <div slot="content">{item.label}</div>
      <div slot="drawerHeader">{item.label}</div>
      <div slot="menu">{renderItems(item.children)}</div>
    </hbr-nav-item>
  );
};

// Component to render a section of navigation items at branch level in sidebar
const Section = ({ item, selected, onSelect }) => {
  return (
    <hbr-menu shell-nav>
      <hbr-label variant="nav-menu-group">{item.label}</hbr-label>
      {/* <hbr-menuLabel shellNav={true}>{item.label}</hbr-menuLabel> */}
      {item.children.map((child) => (
        <hbr-menu-item
          key={child.value}
          shell-nav
          value={child.value}
          checked={child.value === selected}
          checkMark={child.value === selected}
        >
          {child.icon && <hbr-icon slot="prefix" name={child.icon} />}
          {child.label}
        </hbr-menu-item>
      ))}
    </hbr-menu>
  );
};

// Main navigation component
const Nav = ({ selected, setSelected, config = [], collapsed, setCollapsed }) => {
  const navigate = useNavigate();
  // Handle click events on navigation items
  const handleNavItemClick = (event) => {
    const _selected = event.detail.selectedMenuItem
      ? event.detail.selectedMenuItem.value
      : event.detail.selectedItem.value;
    setSelected(_selected);
    navigate(_selected);
  };

  // Handle collapse/expand button click
  const handleCollapseClick = () => {
    setCollapsed(!collapsed);
  };

  // Recursive function to render navigation items
  const renderNavItems = (items) => {
    return items.map((item) => {
      switch (item.type) {
        case "item":
          return (
            <Item
              key={item.value}
              item={item}
              selected={selected === item.value}
              onSelect={setSelected}
            />
          );
        case "submenu":
          return (
            <Submenu
              key={item.value}
              item={item}
              selected={selected}
              onSelect={setSelected}
              renderItems={renderNavItems}
            />
          );
        case "group":
          return (
            <Group key={item.label} item={item} renderItems={renderNavItems} />
          );
        case "section":
          return (
            <Section
              key={item.label}
              item={item}
              selected={selected}
              onSelect={setSelected}
            />
          );
        default:
          return null;
      }
    });
  };

  return (
    <nav>
      <hbr-shell-nav
        class="side-nav"
        onhbr-nav-item-click={handleNavItemClick}
        collapsed={collapsed}
        collapseTooltipLabel={collapsed ? "Expand" : "Collapse"}
        onhbr-collapse-click={handleCollapseClick}
      >
        <div>
          <div>
            <Switcher />
          </div>
        </div>

        {renderNavItems(config)}
      </hbr-shell-nav>
    </nav>
  );
};

export default Nav;