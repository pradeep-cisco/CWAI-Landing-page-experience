import { useState } from "react";
const globalBranchesData = {
  label: "Global",
  id: "0",
  children: [
    {
      id: "1",
      label: "North America",
      iconName: "globe",
      children: [
        {
          id: "1-1",
          label: "United States",
          iconName: "building",
          children: [
            {
              id: "1-1-1",
              label: "New York Office",
              iconName: "house-line",
              children: [
                {
                  id: "1-1-1-1",
                  label: "Manhattan",
                  iconName: "stack-simple",
                  children: [],
                },
                {
                  id: "1-1-1-2",
                  label: "Brooklyn",
                  iconName: "stack-simple",
                  children: [],
                },
              ],
            },
            {
              id: "1-1-2",
              label: "California Office",
              iconName: "house-line",
              children: [
                {
                  id: "1-1-2-1",
                  label: "San Francisco",
                  iconName: "stack-simple",
                  children: [],
                },
                {
                  id: "1-1-2-2",
                  label: "Los Angeles",
                  iconName: "stack-simple",
                  children: [],
                },
              ],
            },
          ],
        },
        {
          id: "1-2",
          label: "Canada",
          iconName: "building",
          children: [
            {
              id: "1-2-1",
              label: "Toronto Office",
              iconName: "house-line",
              children: [],
            },
            {
              id: "1-2-2",
              label: "Vancouver Branch",
              iconName: "house-line",
              children: [],
            },
          ],
        },
      ],
    },
    {
      id: "2",
      label: "Europe",
      iconName: "globe",
      children: [
        {
          id: "2-1",
          label: "United Kingdom",
          iconName: "building",
          children: [
            {
              id: "2-1-1",
              label: "London Headquarters",
              iconName: "house-line",
              children: [],
            },
            {
              id: "2-1-2",
              label: "Manchester Office",
              iconName: "house-line",
              children: [],
            },
          ],
        },
        {
          id: "2-2",
          label: "Germany",
          iconName: "building",
          children: [
            {
              id: "2-2-1",
              label: "Berlin Central Office",
              iconName: "house-line",
              children: [],
            },
            {
              id: "2-2-2",
              label: "Munich Regional Office",
              iconName: "house-line",
              children: [],
            },
          ],
        },
      ],
    },
    {
      id: "3",
      label: "Asia",
      iconName: "globe",
      children: [
        {
          id: "3-1",
          label: "India",
          iconName: "building",
          children: [
            {
              id: "3-1-1",
              label: "Bangalore Tech Hub",
              iconName: "house-line",
              children: [],
            },
            {
              id: "3-1-2",
              label: "Mumbai Sales Office",
              iconName: "house-line",
              children: [],
            },
          ],
        },
        {
          id: "3-2",
          label: "China",
          iconName: "building",
          children: [
            {
              id: "3-2-1",
              label: "Shanghai Regional Office",
              iconName: "house-line",
              children: [],
            },
            {
              id: "3-2-2",
              label: "Beijing Headquarters",
              iconName: "house-line",
              children: [],
            },
          ],
        },
      ],
    },
    {
      id: "4",
      label: "Australia",
      iconName: "globe",
      children: [
        {
          id: "4-1",
          label: "Sydney Office",
          iconName: "building",
          children: [],
        },
        {
          id: "4-2",
          label: "Melbourne Branch",
          iconName: "building",
          children: [],
        },
      ],
    },
  ],
};

function createHashMap(treeData) {
  const map = {};

  function traverse(node) {
    if (!node) return;

    // Add the current node to the map
    map[node.id] = node;

    // Recursively traverse the children
    if (node.children && node.children.length > 0) {
      node.children.forEach((child) => traverse(child));
    }
  }

  // Start traversal with the root's children
  if (treeData.children && treeData.children.length > 0) {
    treeData.children.forEach((child) => traverse(child));
  }

  return map;
}

const officesMap = createHashMap(globalBranchesData);

function Tree({ selected }) {
  const [data, setData] = useState(globalBranchesData);
  const [input, setInput] = useState("");
  const [query, setQuery] = useState("");

  const handleInput = (e) => {
    setInput(e.target.value);
    setQuery(e.target.value);
  };

  const renderTreeItems = (data, query) => {
    return data?.children?.map((item) => {
      return (
        <hbr-tree-item
          key={item.id}
          id={item.id}
          name={item.label}
          unselectable={item.id === "1-2-1" || item.id === "1-2-2"}
          selected={selected.id === item.id}
          style={{
            "--tree-item-padding": "6px 10px 6px 6px",
            "--indent-guide-width": "0px",
          }}
        >
          <div className="hbr-css__layout-row-xs">
            <hbr-icon
              library="phosphor"
              size="20px"
              src={`/assets/phosphor/${item.iconName}.svg`}
              style={{ color: "var(--hbr-color-neutral-icon, #7E868F)" }}
            />
            <hbr-highlight
              variant="underline"
              caseSensitive={false}
              text={item.label}
              queryText={query}
            />
          </div>
          {selected.id === item.id ? (
            <div
              slot="suffix"
              className="hbr-css__layout-row-2xs hbr-css__layout-align-center"
            >
              <hbr-icon
                name="check"
                size="16px"
                style={{ color: "var(--control-icon-default, #1D69CC)" }}
              />
            </div>
          ) : null}
          {item.children && renderTreeItems(item, query)}
        </hbr-tree-item>
      );
    });
  };

  return (
    <div style={{ width: "320px" }}>
      <hbr-input
        type="search"
        placeholder="Search hierarchy"
        onhbr-input={handleInput}
        clearable={true}
        style={{ padding: "12px", backgroundColor: "var(--hbr-color-neutral-bg, #F2F4F7)" }}
      >
        <div
          slot="prefix"
          style={{
            display: "flex",
            padding: "1px 0px",
            alignItems: "flexStart",
          }}
        >
          <hbr-icon
            size="20px"
            name="magnifying-glass"
            className="search-sample-icon"
            style={{ color: "var(--hbr-color-neutral-icon, #7E868F)" }}
          />
        </div>
      </hbr-input>
      <hbr-tree
        selection="single"
        style={{
          "--color-bg-selected":
            "var(--control-background-weak-active, #E3EEFF)",
        }}
      >
        {renderTreeItems(data, query)}
      </hbr-tree>
    </div>
  );
}

export default function Switcher() {
  const [selected, setSelected] = useState({ name: "Global", id: null });
  return (
    <hbr-nav-item
      id="my-nav-item-id"
      switcher={true}
      tooltipText="Selected Site"
      switcherArrowDown={true}
      onhbr-click={(e) => {
        e.stopPropagation();
      }}
    >
      <hbr-icon slot="prefix" name="nav-organization-switcher" />
      <div slot="content-header">Organization</div>
      <div slot="content">{selected.name}</div>
      <hbr-portal target="body">
        <hbr-dropdown
          menu={true}
          anchor="#my-nav-item-id"
          style={{
            "--panel-border":
              "2px solid var(--control-border-default, #889099)",
            "--panel-border-radius": "6px",
            "--panel-box-shadow": "0px",
          }}
          auto-size="vertical"
          id="my-dropdown"
          onhbr-selection-change={(e) => {
            const selected = e.detail.selection[0];
            setSelected(selected);
            selected.closest("hbr-dropdown").hide();
          }}
        >
          <Tree selected={selected} />
        </hbr-dropdown>
      </hbr-portal>
    </hbr-nav-item>
  );
}
