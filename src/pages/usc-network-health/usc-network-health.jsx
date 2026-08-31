import { useEffect, useMemo, useRef, useState } from "react";
import "@harbor/elements/dom-table";

const devices = [
  { id: "usc-upc-core-01", name: "USC-UPK-CORE-01", type: "Router", site: "University Park", status: "Healthy", availability: 99.99, ip: "10.42.10.1", lastCheck: "2 min ago" },
  { id: "usc-upc-dist-01", name: "USC-UPK-DIST-01", type: "Switch", site: "University Park", status: "Healthy", availability: 99.98, ip: "10.42.10.11", lastCheck: "2 min ago" },
  { id: "usc-upc-lib-01", name: "USC-UPK-LIB-01", type: "Access point", site: "University Park", status: "Healthy", availability: 99.94, ip: "10.42.21.31", lastCheck: "3 min ago" },
  { id: "usc-upc-viterbi-01", name: "USC-UPK-VIT-01", type: "Switch", site: "University Park", status: "Warning", availability: 98.61, ip: "10.42.32.14", lastCheck: "2 min ago" },
  { id: "usc-upc-doheny-01", name: "USC-UPK-DOH-01", type: "Access point", site: "University Park", status: "Healthy", availability: 99.87, ip: "10.42.27.44", lastCheck: "4 min ago" },
  { id: "usc-hsc-core-01", name: "USC-HSC-CORE-01", type: "Router", site: "Health Sciences", status: "Healthy", availability: 99.99, ip: "10.43.10.1", lastCheck: "1 min ago" },
  { id: "usc-hsc-dist-01", name: "USC-HSC-DIST-01", type: "Switch", site: "Health Sciences", status: "Healthy", availability: 99.97, ip: "10.43.10.12", lastCheck: "2 min ago" },
  { id: "usc-hsc-hospital-01", name: "USC-HSC-HOS-01", type: "Access point", site: "Health Sciences", status: "Healthy", availability: 99.92, ip: "10.43.24.18", lastCheck: "2 min ago" },
  { id: "usc-hsc-lab-01", name: "USC-HSC-LAB-01", type: "Switch", site: "Health Sciences", status: "Critical", availability: 94.12, ip: "10.43.51.7", lastCheck: "1 min ago" },
  { id: "usc-hsc-clinic-01", name: "USC-HSC-CLI-01", type: "Access point", site: "Health Sciences", status: "Healthy", availability: 99.83, ip: "10.43.36.22", lastCheck: "3 min ago" },
  { id: "usc-keck-core-01", name: "USC-KEC-CORE-01", type: "Router", site: "Keck Medicine", status: "Healthy", availability: 99.98, ip: "10.44.10.1", lastCheck: "2 min ago" },
  { id: "usc-keck-west-01", name: "USC-KEC-WEST-01", type: "Switch", site: "Keck Medicine", status: "Healthy", availability: 99.96, ip: "10.44.13.9", lastCheck: "2 min ago" },
  { id: "usc-keck-east-01", name: "USC-KEC-EAST-01", type: "Access point", site: "Keck Medicine", status: "Healthy", availability: 99.91, ip: "10.44.18.26", lastCheck: "4 min ago" },
  { id: "usc-keck-data-01", name: "USC-KEC-DATA-01", type: "Switch", site: "Keck Medicine", status: "Warning", availability: 97.84, ip: "10.44.41.16", lastCheck: "1 min ago" },
  { id: "usc-marina-core-01", name: "USC-MDR-CORE-01", type: "Router", site: "Marina del Rey", status: "Healthy", availability: 99.97, ip: "10.45.10.1", lastCheck: "2 min ago" },
  { id: "usc-marina-studio-01", name: "USC-MDR-STU-01", type: "Switch", site: "Marina del Rey", status: "Healthy", availability: 99.89, ip: "10.45.15.7", lastCheck: "3 min ago" },
  { id: "usc-marina-ap-01", name: "USC-MDR-AP-01", type: "Access point", site: "Marina del Rey", status: "Healthy", availability: 99.76, ip: "10.45.24.12", lastCheck: "2 min ago" },
  { id: "usc-upc-annenberg-01", name: "USC-UPK-ANN-01", type: "Access point", site: "University Park", status: "Healthy", availability: 99.88, ip: "10.42.29.13", lastCheck: "4 min ago" },
  { id: "usc-upc-sca-01", name: "USC-UPK-SCA-01", type: "Switch", site: "University Park", status: "Healthy", availability: 99.95, ip: "10.42.34.5", lastCheck: "3 min ago" },
  { id: "usc-hsc-research-01", name: "USC-HSC-RES-01", type: "Access point", site: "Health Sciences", status: "Warning", availability: 98.22, ip: "10.43.62.8", lastCheck: "2 min ago" },
  { id: "usc-keck-arc-01", name: "USC-KEC-ARC-01", type: "Access point", site: "Keck Medicine", status: "Healthy", availability: 99.86, ip: "10.44.22.34", lastCheck: "3 min ago" },
  { id: "usc-marina-lab-01", name: "USC-MDR-LAB-01", type: "Switch", site: "Marina del Rey", status: "Healthy", availability: 99.93, ip: "10.45.32.21", lastCheck: "1 min ago" },
  { id: "usc-upc-gateway-01", name: "USC-UPK-GW-01", type: "Router", site: "University Park", status: "Healthy", availability: 99.99, ip: "10.42.1.1", lastCheck: "2 min ago" },
  { id: "usc-hsc-gateway-01", name: "USC-HSC-GW-01", type: "Router", site: "Health Sciences", status: "Healthy", availability: 99.99, ip: "10.43.1.1", lastCheck: "1 min ago" },
  { id: "usc-keck-gateway-01", name: "USC-KEC-GW-01", type: "Router", site: "Keck Medicine", status: "Healthy", availability: 99.98, ip: "10.44.1.1", lastCheck: "2 min ago" },
  { id: "usc-marina-gateway-01", name: "USC-MDR-GW-01", type: "Router", site: "Marina del Rey", status: "Healthy", availability: 99.97, ip: "10.45.1.1", lastCheck: "2 min ago" },
];

const statusConfig = {
  Healthy: { sentiment: "positive", icon: "status-positive" },
  Warning: { sentiment: "warning", icon: "status-warning" },
  Critical: { sentiment: "negative", icon: "status-negative" },
};

const columns = [
  { id: "name", name: "Device", sortable: true, width: "180px", pin: "left" },
  { id: "type", name: "Type", sortable: true, width: "130px" },
  { id: "site", name: "Campus location", sortable: true, width: "160px" },
  { id: "status", name: "Health", sortable: true, width: "120px" },
  { id: "availability", name: "Availability", sortable: true, width: "130px" },
  { id: "ip", name: "IP address", width: "135px" },
  { id: "lastCheck", name: "Last check", sortable: true, width: "110px" },
  { id: "empty", width: "100%" },
];

const statusOrder = ["Healthy", "Warning", "Critical"];

const donutConfig = {
  data: statusOrder.map((status) => ({
    id: status,
    value: devices.filter((device) => device.status === status).length,
  })),
  margin: { top: 24, bottom: 74, left: 24, right: 24 },
  innerRadius: 0.7,
  arcLinkLabelsHtml: {
    width: 160,
    height: 24,
    labelTemplate: (datum, createElement) => createElement(
      "div",
      { className: "--categorical-donut-link-label" },
      datum?.label || "Unknown",
      createElement("hbr-tag", { size: "small" }, datum?.value ?? 0),
    ),
  },
  centerContent: (data) => {
    const total = Array.isArray(data)
      ? data.reduce((sum, item) => sum + (Number(item?.value) || 0), 0)
      : 0;
    return `<div style="display:flex;flex-direction:column;height:100%;align-items:center;justify-content:center;"><div style="color:var(--base-text-default);font-size:var(--hbr-font-size-2xl);font-weight:var(--hbr-font-weight-bold);text-align:center;line-height:1;">${total}</div><div style="color:var(--base-text-medium-default);font-size:var(--hbr-font-size-md);text-align:center;">devices</div></div>`;
  },
};

const campusHealth = ["University Park", "Health Sciences", "Keck Medicine", "Marina del Rey"].map((site) => {
  const siteDevices = devices.filter((device) => device.site === site);
  return {
    site,
    Healthy: siteDevices.filter((device) => device.status === "Healthy").length,
    Attention: siteDevices.filter((device) => device.status !== "Healthy").length,
  };
});

const campusChartConfig = {
  data: campusHealth,
  layout: "horizontal",
  indexBy: "site",
  keys: ["Healthy", "Attention"],
  margin: { top: 20, right: 20, bottom: 60, left: 128 },
  labelSkipWidth: 0,
  enableGridX: true,
  enableGridY: false,
  axisLeft: { tickRotation: -45 },
  axisBottom: { legend: "Devices", legendOffset: 42 },
  legends: [{ translateY: 58 }],
};

const availabilityChartConfig = {
  data: [
    {
      id: "Campus availability",
      data: [
        { x: "Mon", y: 99.79 },
        { x: "Tue", y: 99.84 },
        { x: "Wed", y: 99.81 },
        { x: "Thu", y: 99.88 },
        { x: "Fri", y: 99.86 },
        { x: "Sat", y: 99.91 },
        { x: "Sun", y: 99.89 },
      ],
    },
  ],
  xScale: { type: "point" },
  yScale: { type: "linear", min: 99.5, max: 100 },
  margin: { top: 20, right: 20, bottom: 46, left: 52 },
  enableGridX: false,
  enableGridY: true,
  enablePoints: true,
  pointSize: 7,
  axisLeft: { tickValues: [99.5, 99.7, 99.9, 100], format: (value) => `${value}%` },
  axisBottom: { legend: "Past 7 days", legendOffset: 36 },
};

function MetricCard({ label, value, detail, icon, sentiment = "positive" }) {
  return (
    <hbr-card>
      <hbr-layout direction="column" gap="2xs">
        <hbr-text type="secondary" size="sm">{label}</hbr-text>
        <hbr-layout direction="row" gap="sm" align="end">
          <hbr-text type="number" size="lg" weight="bold">{value}</hbr-text>
          <hbr-icon name={icon} sentiment={sentiment} size="16px" />
        </hbr-layout>
        <hbr-text type="secondary" size="xs">{detail}</hbr-text>
      </hbr-layout>
    </hbr-card>
  );
}

function renderStatus(status) {
  const config = statusConfig[status] || statusConfig.Healthy;
  return (
    <hbr-tag sentiment={config.sentiment} size="small">
      <hbr-icon slot="prefix" name={config.icon} sentiment={config.sentiment} size="12px" />
      {status}
    </hbr-tag>
  );
}

function renderCells(rows) {
  return rows.flatMap((row) => columns.map((column) => {
    if (column.id === "empty") return null;
    let content = row[column.id] ?? "";
    if (column.id === "status") content = renderStatus(row.status);
    if (column.id === "availability") content = `${row.availability}%`;
    if (column.id === "ip") {
      content = <span style={{ fontFamily: "var(--hbr-font-family-mono)" }}>{row.ip}</span>;
    }
    return (
      <div key={`row-${row.id}-column-${column.id}`} slot={`row-${row.id}-column-${column.id}`}>
        {content}
      </div>
    );
  }).filter(Boolean));
}

export default function USCNetworkHealth() {
  const [search, setSearch] = useState("");
  const [site, setSite] = useState("");
  const [status, setStatus] = useState("");
  const [type, setType] = useState("");
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(8);
  const [sort, setSort] = useState(null);
  const donutRef = useRef(null);
  const campusChartRef = useRef(null);
  const availabilityChartRef = useRef(null);

  useEffect(() => {
    if (donutRef.current) donutRef.current.config = donutConfig;
    if (campusChartRef.current) campusChartRef.current.config = campusChartConfig;
    if (availabilityChartRef.current) availabilityChartRef.current.config = availabilityChartConfig;
  }, []);

  const filteredDevices = useMemo(() => {
    const term = search.trim().toLowerCase();
    const filtered = devices.filter((device) => {
      const searchable = `${device.name} ${device.type} ${device.site} ${device.ip}`.toLowerCase();
      return (!term || searchable.includes(term))
        && (!site || device.site === site)
        && (!status || device.status === status)
        && (!type || device.type === type);
    });
    if (!sort) return filtered;
    return [...filtered].sort((left, right) => {
      const leftValue = left[sort.id];
      const rightValue = right[sort.id];
      if (typeof leftValue === "number" && typeof rightValue === "number") {
        return sort.order === "desc" ? rightValue - leftValue : leftValue - rightValue;
      }
      return sort.order === "desc"
        ? String(rightValue).localeCompare(String(leftValue))
        : String(leftValue).localeCompare(String(rightValue));
    });
  }, [search, site, status, type, sort]);

  const visibleDevices = filteredDevices.slice(page * pageSize, (page + 1) * pageSize);
  const totalDevices = devices.length;
  const healthyDevices = devices.filter((device) => device.status === "Healthy").length;
  const attentionDevices = totalDevices - healthyDevices;
  const averageAvailability = (devices.reduce((sum, device) => sum + device.availability, 0) / totalDevices).toFixed(2);

  const clearFilters = () => {
    setSearch("");
    setSite("");
    setStatus("");
    setType("");
    setPage(0);
  };

  const handleSort = (event) => {
    const detail = event.detail || {};
    const columnId = detail.column?.id || detail.column;
    if (!detail.order || !columnId || columnId === "empty") {
      setSort(null);
      return;
    }
    setSort({ id: columnId, order: detail.order === "desc" ? "desc" : "asc" });
    setPage(0);
  };

  return (
    <hbr-layout variant="page">
      <hbr-layout variant="page:header">
        <hbr-layout direction="row" gap="sm" align="center">
          <hbr-text variant="page-title"><h1>USC campus network health</h1></hbr-text>
          <hbr-tag sentiment="positive">
            <hbr-icon slot="prefix" name="status-positive" sentiment="positive" size="16px" />
            Monitoring active
          </hbr-tag>
        </hbr-layout>
        <hbr-text type="secondary" size="sm" length="md">
          Live device health and availability across University Park, Health Sciences, Keck Medicine, and Marina del Rey.
        </hbr-text>
      </hbr-layout>

      <hbr-layout variant="dashboard">
        <hbr-layout variant="dashboard:section">
          <hbr-text variant="section-title"><h2>Campus overview</h2></hbr-text>
          <hbr-layout variant="dashboard:widgets:basic-statistics">
            <MetricCard label="Monitored devices" value={totalDevices} detail="Across 4 USC locations" icon="devices" />
            <MetricCard label="Healthy devices" value={healthyDevices} detail={`${((healthyDevices / totalDevices) * 100).toFixed(1)}% of monitored fleet`} icon="trend-up" />
            <MetricCard label="Average availability" value={`${averageAvailability}%`} detail="Rolling 24-hour average" icon="trend-up" />
            <MetricCard label="Needs attention" value={attentionDevices} detail="2 critical · 3 warning" icon="warning" sentiment="warning" />
          </hbr-layout>
        </hbr-layout>

        <hbr-layout variant="dashboard:section">
          <hbr-text variant="section-title"><h2>Health trends</h2></hbr-text>
          <hbr-layout variant="dashboard:widgets:container">
            <hbr-card container col="1/3">
              <hbr-donut-chart ref={donutRef} categorical width="100%" height="320px">
                <hbr-text slot="header-title" variant="sub-section-title">Device health</hbr-text>
              </hbr-donut-chart>
            </hbr-card>
            <hbr-card container col="2/3">
              <div style={{ width: "100%", minHeight: "320px" }}>
                <hbr-line-chart ref={availabilityChartRef} width="100%" height="320px">
                  <hbr-text slot="header-title" variant="sub-section-title">Campus availability</hbr-text>
                </hbr-line-chart>
              </div>
            </hbr-card>
          </hbr-layout>
        </hbr-layout>

        <hbr-layout variant="dashboard:section">
          <hbr-text variant="section-title"><h2>Health by location</h2></hbr-text>
          <hbr-layout variant="dashboard:widgets:container">
            <hbr-card container col="full">
              <div style={{ width: "100%", minHeight: "320px" }}>
                <hbr-bar-chart ref={campusChartRef} categorical width="100%" height="320px">
                  <hbr-text slot="header-title" variant="sub-section-title">Devices by USC location</hbr-text>
                </hbr-bar-chart>
              </div>
            </hbr-card>
          </hbr-layout>
        </hbr-layout>

        <hbr-layout variant="dashboard:section">
          <hbr-layout direction="row" justify="space-between" align="center">
            <hbr-text variant="section-title"><h2>Device inventory</h2></hbr-text>
            <hbr-text type="secondary" size="sm">Updated 2 minutes ago</hbr-text>
          </hbr-layout>
          <hbr-card container col="full">
            <hbr-filter-bar>
              <hbr-input
                slot="start"
                aria={{ label: "Search USC devices" }}
                placeholder="Search devices"
                clearable
                value={search}
                onhbr-input={(event) => { setSearch(event.target.value); setPage(0); }}
                onhbr-clear={() => { setSearch(""); setPage(0); }}
              >
                <hbr-icon slot="prefix" name="magnifying-glass" sentiment="neutral" />
              </hbr-input>
              <hbr-select clearable placeholder="Location" value={site} onhbr-change={(event) => { setSite(event.target.value || ""); setPage(0); }}>
                {campusHealth.map((location) => <hbr-option key={location.site} value={location.site}>{location.site}</hbr-option>)}
              </hbr-select>
              <hbr-select clearable placeholder="Health" value={status} onhbr-change={(event) => { setStatus(event.target.value || ""); setPage(0); }}>
                {statusOrder.map((item) => <hbr-option key={item} value={item}>{item}</hbr-option>)}
              </hbr-select>
              <hbr-select clearable placeholder="Type" value={type} onhbr-change={(event) => { setType(event.target.value || ""); setPage(0); }}>
                {["Router", "Switch", "Access point"].map((item) => <hbr-option key={item} value={item}>{item}</hbr-option>)}
              </hbr-select>
              <hbr-text type="secondary" size="sm" slot="fixed-suffix">{filteredDevices.length} results</hbr-text>
              <hbr-button slot="fixed-suffix" variant="text" onClick={clearFilters}>Clear all</hbr-button>
            </hbr-filter-bar>
            {visibleDevices.length ? (
              <hbr-dom-table
                columns={columns}
                data={visibleDevices}
                aria={{ label: "USC campus network devices" }}
                density="comfy"
                stickyHeader
                onhbr-sort={handleSort}
              >
                {renderCells(visibleDevices)}
              </hbr-dom-table>
            ) : (
              <hbr-layout direction="column" align="center" gap="sm" style={{ padding: "32px" }}>
                <hbr-icon name="magnifying-glass" size="24px" sentiment="neutral" />
                <hbr-text variant="sub-section-title">No devices found</hbr-text>
                <hbr-text type="secondary" size="sm">Adjust the filters to see more devices.</hbr-text>
              </hbr-layout>
            )}
            <hbr-pagination
              size="small"
              page={page}
              pageSize={pageSize}
              itemCount={filteredDevices.length}
              pageInfo
              sizeChanger
              pageOptions={[8, 16, 24]}
              onhbr-page-changed={(event) => setPage(event.detail)}
              onhbr-size-changed={(event) => { setPageSize(event.detail.pageSize); setPage(0); }}
            />
          </hbr-card>
        </hbr-layout>
      </hbr-layout>
    </hbr-layout>
  );
}
