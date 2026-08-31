import { useEffect, useRef } from "react";
import "@harbor/elements/dom-table";

const weeklySales = [
  {
    id: "net-sales",
    data: [
      { x: "Aug 5", y: 38.4 },
      { x: "Aug 12", y: 41.7 },
      { x: "Aug 19", y: 44.3 },
      { x: "Aug 26", y: 48.1 },
      { x: "Sep 2", y: 52.6 },
      { x: "Sep 9", y: 56.8 },
    ],
  },
];

const salesByLocation = [
  { location: "New York", sales: 18.4 },
  { location: "Los Angeles", sales: 14.8 },
  { location: "San Jose", sales: 11.9 },
  { location: "Irvine", sales: 10.6 },
  { location: "Seattle", sales: 9.8 },
  { location: "Boston", sales: 8.7 },
  { location: "San Diego", sales: 7.9 },
  { location: "Las Vegas", sales: 6.7 },
];

const locationRows = [
  { id: "new-york", location: "New York", state: "NY", sales: "$18.4k", orders: "2,364", aov: "$7.79", topDrink: "Grapefruit Tea", growth: "+18.4%" },
  { id: "los-angeles", location: "Los Angeles", state: "CA", sales: "$14.8k", orders: "1,852", aov: "$7.99", topDrink: "Cheese Foam Tea", growth: "+12.7%" },
  { id: "san-jose", location: "San Jose", state: "CA", sales: "$11.9k", orders: "1,469", aov: "$8.10", topDrink: "Mango Grapefruit", growth: "+9.8%" },
  { id: "irvine", location: "Irvine", state: "CA", sales: "$10.6k", orders: "1,312", aov: "$8.08", topDrink: "Brown Sugar Boba", growth: "+7.4%" },
  { id: "seattle", location: "Seattle", state: "WA", sales: "$9.8k", orders: "1,180", aov: "$8.31", topDrink: "Jasmine Green Tea", growth: "+6.1%" },
  { id: "boston", location: "Boston", state: "MA", sales: "$8.7k", orders: "1,095", aov: "$7.95", topDrink: "Strawberry Tea", growth: "+4.9%" },
  { id: "san-diego", location: "San Diego", state: "CA", sales: "$7.9k", orders: "986", aov: "$8.01", topDrink: "Peach Oolong Tea", growth: "+3.6%" },
  { id: "las-vegas", location: "Las Vegas", state: "NV", sales: "$6.7k", orders: "812", aov: "$8.25", topDrink: "Passion Fruit Tea", growth: "+2.8%" },
];

const lineChartConfig = {
  data: weeklySales,
  xScale: { type: "point" },
  yScale: { type: "linear", min: 30, max: 60 },
  enableGridX: false,
  enableGridY: true,
  margin: { top: 20, right: 20, bottom: 44, left: 52 },
  axisLeft: { legend: "Sales ($k)", legendOffset: -42, tickValues: [30, 40, 50, 60] },
  axisBottom: { tickRotation: -25 },
  enablePoints: true,
  pointSize: 7,
  pointBorderWidth: 2,
  useMesh: true,
  enableArea: true,
  areaOpacity: 0.12,
  colors: ["var(--brand-accent-icon-active)"],
};

const barChartConfig = {
  data: salesByLocation,
  layout: "horizontal",
  indexBy: "location",
  keys: ["sales"],
  margin: { top: 12, right: 24, bottom: 32, left: 98 },
  padding: 0.3,
  enableGridX: true,
  enableGridY: false,
  axisBottom: { legend: "Sales ($k)", legendOffset: 28 },
  axisLeft: { tickRotation: 0 },
  enableLabel: false,
  colors: ["var(--brand-accent-icon-active)"],
  tooltip: (bar) => `${bar.indexValue}: $${bar.formattedValue}k`,
};

const tableColumns = [
  { id: "location", name: "Location", width: "150px", sortable: false },
  { id: "state", name: "State", width: "76px", sortable: false },
  { id: "sales", name: "Net sales", width: "120px", sortable: false },
  { id: "orders", name: "Orders", width: "110px", sortable: false },
  { id: "aov", name: "Avg. order", width: "120px", sortable: false },
  { id: "topDrink", name: "Top drink", width: "190px", sortable: false },
  { id: "growth", name: "Growth", width: "110px", sortable: false },
  { id: "empty", width: "100%", sortable: false },
];

function StatCard({ label, value, delta, description }) {
  return (
    <hbr-card>
      <hbr-layout direction="column" gap="2xs">
        <hbr-text type="secondary" size="sm">{label}</hbr-text>
        <hbr-layout direction="row" gap="2xs" align="end">
          <hbr-text type="primary" size="md" weight="bold">{value}</hbr-text>
          <hbr-icon name="trend-up" style={{ fontSize: "16px", color: "var(--positive-icon-active)" }} />
          <hbr-text type="primary" size="xs" weight="semibold">{delta}</hbr-text>
        </hbr-layout>
        <hbr-text type="secondary" size="xs" weight="semibold">{description}</hbr-text>
      </hbr-layout>
    </hbr-card>
  );
}

function renderTableCells() {
  return locationRows.flatMap((row) =>
    tableColumns.map((column) => {
      const cellId = `row-${row.id}-column-${column.id}`;
      return (
        <div key={cellId} slot={cellId}>
          {column.id === "growth" ? (
            <hbr-layout direction="row" gap="2xs" align="center">
              <hbr-icon name="trend-up" size="14px" />
              <span>{row.growth}</span>
            </hbr-layout>
          ) : (
            row[column.id] || ""
          )}
        </div>
      );
    }),
  );
}

export default function TeaSales() {
  const lineChartRef = useRef(null);
  const barChartRef = useRef(null);

  useEffect(() => {
    if (lineChartRef.current) lineChartRef.current.config = lineChartConfig;
    if (barChartRef.current) barChartRef.current.config = barChartConfig;
  }, []);

  const handleDownload = () => {
    const rows = [
      ["Location", "State", "Net sales", "Orders", "Average order", "Top drink", "Growth"],
      ...locationRows.map((row) => [row.location, row.state, row.sales, row.orders, row.aov, row.topDrink, row.growth]),
    ];
    const csv = rows.map((row) => row.map((value) => `"${value}"`).join(",")).join("\n");
    const link = document.createElement("a");
    link.href = `data:text/csv;charset=utf-8,${encodeURIComponent(csv)}`;
    link.download = "hey-tea-us-sales.csv";
    link.click();
  };

  return (
    <hbr-layout variant="page">
      <hbr-layout variant="page:header">
        <hbr-layout direction="row" gap="sm" align="center">
          <hbr-text variant="page-title">
            <h1>Hey Tea US sales network</h1>
          </hbr-text>
          <hbr-tag>
            <hbr-icon slot="prefix" name="map-trifold" size="16px" />
            United States
          </hbr-tag>
        </hbr-layout>
        <hbr-layout direction="row" gap="md" align="center">
          <hbr-text type="secondary" size="sm" length="md">
            Store sales performance across the Hey Tea US network for the last 30 days.
          </hbr-text>
          <hbr-button variant="outline" size="small" onClick={handleDownload} style={{ marginInlineStart: "auto" }}>
            <hbr-icon slot="prefix" name="download-simple" size="16px" />
            Download report
          </hbr-button>
        </hbr-layout>
      </hbr-layout>

      <hbr-layout variant="dashboard">
        <hbr-layout variant="dashboard:section">
          <hbr-text variant="section-title"><h2>Network snapshot</h2></hbr-text>
          <hbr-layout variant="dashboard:widgets:basic-statistics">
            <StatCard label="Net sales" value="$88.8k" delta="+11.6%" description="vs. previous 30 days" />
            <StatCard label="Orders" value="11,070" delta="+8.9%" description="Across 8 locations" />
            <StatCard label="Average order value" value="$8.02" delta="+2.5%" description="vs. previous 30 days" />
          </hbr-layout>
        </hbr-layout>

        <hbr-layout variant="dashboard:section">
          <hbr-text variant="section-title"><h2>Sales performance</h2></hbr-text>
          <hbr-layout variant="dashboard:widgets:container">
            <hbr-card container col="2/3">
              <hbr-line-chart ref={lineChartRef} categorical width="100%" height="360px">
                <hbr-text slot="header-title" variant="sub-section-title">Weekly net sales</hbr-text>
                <hbr-text slot="header-subtitle" type="secondary" size="sm">USD thousands · six-week trend</hbr-text>
              </hbr-line-chart>
            </hbr-card>
            <hbr-card container col="1/3">
              <hbr-bar-chart ref={barChartRef} categorical width="100%" height="360px">
                <hbr-text slot="header-title" variant="sub-section-title">Sales by location</hbr-text>
              </hbr-bar-chart>
            </hbr-card>
          </hbr-layout>
        </hbr-layout>

        <hbr-layout variant="dashboard:section">
          <hbr-text variant="section-title"><h2>Location detail</h2></hbr-text>
          <hbr-layout variant="dashboard:widgets:container">
            <hbr-card container col="full">
              <hbr-layout slot="header" direction="column" gap="2xs">
                <hbr-text variant="sub-section-title">US locations</hbr-text>
                <hbr-text type="secondary" size="sm">Ranked by net sales for the selected period.</hbr-text>
              </hbr-layout>
              <hbr-dom-table columns={tableColumns} data={locationRows} aria={{ label: "Hey Tea US location sales" }}>
                {renderTableCells()}
              </hbr-dom-table>
            </hbr-card>
          </hbr-layout>
        </hbr-layout>
      </hbr-layout>
    </hbr-layout>
  );
}
