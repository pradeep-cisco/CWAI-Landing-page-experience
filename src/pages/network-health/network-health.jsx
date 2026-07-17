import { useEffect, useRef } from "react";

const devices = [
  { name: "SEA-DT-CORE-01", type: "Router", site: "Downtown", status: "Healthy", availability: 99.99 },
  { name: "SEA-DT-SW-01", type: "Switch", site: "Downtown", status: "Healthy", availability: 99.97 },
  { name: "SEA-DT-AP-01", type: "Access point", site: "Downtown", status: "Warning", availability: 98.72 },
  { name: "SEA-SLU-CORE-01", type: "Router", site: "South Lake Union", status: "Healthy", availability: 99.99 },
  { name: "SEA-SLU-SW-01", type: "Switch", site: "South Lake Union", status: "Healthy", availability: 99.96 },
  { name: "SEA-SLU-AP-01", type: "Access point", site: "South Lake Union", status: "Healthy", availability: 99.91 },
  { name: "SEA-CH-CORE-01", type: "Router", site: "Capitol Hill", status: "Healthy", availability: 99.98 },
  { name: "SEA-CH-SW-01", type: "Switch", site: "Capitol Hill", status: "Healthy", availability: 99.93 },
  { name: "SEA-CH-AP-01", type: "Access point", site: "Capitol Hill", status: "Critical", availability: 93.41 },
  { name: "SEA-BAL-CORE-01", type: "Router", site: "Ballard", status: "Healthy", availability: 99.99 },
  { name: "SEA-BAL-SW-01", type: "Switch", site: "Ballard", status: "Healthy", availability: 99.95 },
  { name: "SEA-BAL-AP-01", type: "Access point", site: "Ballard", status: "Healthy", availability: 99.88 },
  { name: "SEA-FRE-CORE-01", type: "Router", site: "Fremont", status: "Healthy", availability: 99.98 },
  { name: "SEA-FRE-SW-01", type: "Switch", site: "Fremont", status: "Warning", availability: 98.94 },
  { name: "SEA-FRE-AP-01", type: "Access point", site: "Fremont", status: "Healthy", availability: 99.87 },
  { name: "SEA-QA-CORE-01", type: "Router", site: "Queen Anne", status: "Healthy", availability: 99.99 },
  { name: "SEA-QA-SW-01", type: "Switch", site: "Queen Anne", status: "Healthy", availability: 99.94 },
  { name: "SEA-QA-AP-01", type: "Access point", site: "Queen Anne", status: "Healthy", availability: 99.89 },
  { name: "SEA-SODO-CORE-01", type: "Router", site: "SODO", status: "Healthy", availability: 99.97 },
  { name: "SEA-SODO-SW-01", type: "Switch", site: "SODO", status: "Warning", availability: 98.81 },
  { name: "SEA-SODO-AP-01", type: "Access point", site: "SODO", status: "Healthy", availability: 99.86 },
  { name: "SEA-WS-CORE-01", type: "Router", site: "West Seattle", status: "Healthy", availability: 99.98 },
  { name: "SEA-WS-SW-01", type: "Switch", site: "West Seattle", status: "Warning", availability: 98.67 },
  { name: "SEA-WS-AP-01", type: "Access point", site: "West Seattle", status: "Healthy", availability: 99.84 },
];

const statusOrder = ["Healthy", "Warning", "Critical"];
const statusCounts = statusOrder.map((status) => ({
  id: status,
  value: devices.filter((device) => device.status === status).length,
}));

const siteHealth = [...new Set(devices.map((device) => device.site))].map((site) => {
  const siteDevices = devices.filter((device) => device.site === site);
  return {
    site,
    Healthy: siteDevices.filter((device) => device.status === "Healthy").length,
    Attention: siteDevices.filter((device) => device.status !== "Healthy").length,
  };
});

const attentionDevices = devices.filter((device) => device.status !== "Healthy");
const healthyCount = statusCounts.find((entry) => entry.id === "Healthy").value;
const averageAvailability = (
  devices.reduce((total, device) => total + device.availability, 0) / devices.length
).toFixed(2);

const donutConfig = {
  data: statusCounts,
  margin: { top: 30, bottom: 80, left: 30, right: 30 },
  innerRadius: 0.7,
  arcLinkLabelsHtml: {
    width: 160,
    height: 24,
    labelTemplate: (datum, createElement) =>
      createElement(
        "div",
        { className: "--categorical-donut-link-label" },
        datum.label,
        createElement("hbr-tag", { size: "small" }, datum.value),
      ),
  },
};

const siteChartConfig = {
  layout: "horizontal",
  keys: ["Healthy", "Attention"],
  margin: { top: 20, right: 20, bottom: 60, left: 110 },
  data: siteHealth,
  labelSkipWidth: 0,
  indexBy: "site",
  enableGridX: true,
  enableGridY: false,
  gridXValues: [0, 1, 2, 3],
  axisLeft: { tickRotation: -45, legendOffset: -96, legend: "Seattle area" },
  axisBottom: { legend: "Devices" },
  legends: [{ translateY: 60 }],
  itemTooltip: (bar) => `${bar.id}: ${bar.data.formattedValue} devices`,
};

const statusPresentation = {
  Critical: { sentiment: "negative", icon: "status-negative" },
  Warning: { sentiment: "warning", icon: "status-warning" },
};

export default function NetworkHealth() {
  const donutRef = useRef(null);
  const siteChartRef = useRef(null);

  useEffect(() => {
    if (donutRef.current) donutRef.current.config = donutConfig;
    if (siteChartRef.current) siteChartRef.current.config = siteChartConfig;
  }, []);

  return (
    <hbr-layout variant="page">
      <hbr-layout variant="page:header">
        <hbr-layout direction="row" gap="sm" align="center">
          <hbr-text variant="page-title">
            <h1>Seattle Network Health</h1>
          </hbr-text>
          <hbr-tag>
            <hbr-icon slot="prefix" name="map-trifold" size="16px" />
            Seattle metro
          </hbr-tag>
        </hbr-layout>
        <hbr-text type="secondary" size="sm" length="md">
          Current health and availability across network devices in eight
          Seattle-area sites.
        </hbr-text>
      </hbr-layout>

      <hbr-layout variant="dashboard">
        <hbr-layout variant="dashboard:section">
          <hbr-text variant="section-title">
            <h2>Fleet summary</h2>
          </hbr-text>
          <hbr-layout variant="dashboard:widgets:basic-statistics">
            <hbr-card>
              <hbr-layout direction="column" gap="2xs">
                <hbr-text type="secondary" size="sm">Healthy devices</hbr-text>
                <hbr-layout direction="row" gap="2xs" align="end">
                  <hbr-text type="primary" size="lg" weight="bold">{healthyCount}</hbr-text>
                  <hbr-icon name="trend-up" size="16px" />
                  <hbr-text type="primary" size="xs" weight="semibold">+2</hbr-text>
                  <hbr-text type="secondary" size="xs" weight="semibold">
                    vs yesterday
                  </hbr-text>
                </hbr-layout>
              </hbr-layout>
            </hbr-card>

            <hbr-card>
              <hbr-layout direction="column" gap="2xs">
                <hbr-text type="secondary" size="sm">Average availability</hbr-text>
                <hbr-layout direction="row" gap="2xs" align="end">
                  <hbr-text type="primary" size="lg" weight="bold">{averageAvailability}%</hbr-text>
                  <hbr-icon name="trend-up" size="16px" />
                  <hbr-text type="primary" size="xs" weight="semibold">+0.08%</hbr-text>
                  <hbr-text type="secondary" size="xs" weight="semibold">
                    vs yesterday
                  </hbr-text>
                </hbr-layout>
              </hbr-layout>
            </hbr-card>

            <hbr-card>
              <hbr-layout direction="column" gap="2xs">
                <hbr-text type="secondary" size="sm">Needs attention</hbr-text>
                <hbr-layout direction="row" gap="2xs" align="end">
                  <hbr-text type="primary" size="lg" weight="bold">{attentionDevices.length}</hbr-text>
                  <hbr-icon name="trend-down" size="16px" />
                  <hbr-text type="primary" size="xs" weight="semibold">-2</hbr-text>
                  <hbr-text type="secondary" size="xs" weight="semibold">
                    vs yesterday
                  </hbr-text>
                </hbr-layout>
              </hbr-layout>
            </hbr-card>
          </hbr-layout>
        </hbr-layout>

        <hbr-layout variant="dashboard:section">
          <hbr-text variant="section-title">
            <h2>Regional health</h2>
          </hbr-text>
          <hbr-layout variant="dashboard:widgets:container">
            <hbr-card container col="1/2">
              <hbr-donut-chart ref={donutRef} categorical width="100%" height="360px">
                <hbr-text slot="header-title" variant="sub-section-title">
                  Device health
                </hbr-text>
              </hbr-donut-chart>
            </hbr-card>

            <hbr-card container col="1/2">
              <hbr-bar-chart ref={siteChartRef} categorical width="100%" height="360px">
                <hbr-text slot="header-title" variant="sub-section-title">
                  Health by neighborhood
                </hbr-text>
              </hbr-bar-chart>
            </hbr-card>
          </hbr-layout>
        </hbr-layout>

        <hbr-layout variant="dashboard:section">
          <hbr-text variant="section-title">
            <h2>Devices needing attention</h2>
          </hbr-text>
          <hbr-layout variant="dashboard:widgets:container">
            <hbr-card container col="full">
              <hbr-layout slot="header" direction="column" gap="2xs">
                <hbr-text variant="sub-section-title">Active health issues</hbr-text>
                <hbr-text type="secondary" size="sm">
                  Prioritized by severity across the Seattle metro fleet.
                </hbr-text>
              </hbr-layout>
              <hbr-layout direction="column" gap="md">
                {attentionDevices.map((device) => {
                  const presentation = statusPresentation[device.status];
                  return (
                    <hbr-layout key={device.name} direction="row" gap="md" align="center">
                      <hbr-icon
                        name={presentation.icon}
                        sentiment={presentation.sentiment}
                        size="20px"
                      />
                      <hbr-layout direction="column" gap="2xs">
                        <hbr-text type="mono" size="sm">
                          <code>{device.name}</code>
                        </hbr-text>
                        <hbr-text type="secondary" size="xs">
                          {device.type} · {device.site} · {device.availability}% availability
                        </hbr-text>
                      </hbr-layout>
                      <hbr-tag size="small" sentiment={presentation.sentiment}>
                        {device.status}
                      </hbr-tag>
                    </hbr-layout>
                  );
                })}
              </hbr-layout>
            </hbr-card>
          </hbr-layout>
        </hbr-layout>
      </hbr-layout>
    </hbr-layout>
  );
}
