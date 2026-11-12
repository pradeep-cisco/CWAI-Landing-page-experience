import { createBrowserRouter, Navigate } from "react-router-dom";
import Root from "./components/root";
import Home from "./pages/home";
import TeaSales from "./pages/tea-sales";
import USCNetworkHealth from "./pages/usc-network-health";
import NetworkMonitoring from "./pages/network-monitoring";
import { resolveDeploymentRouting } from "./routing/deployment";

const deployment = resolveDeploymentRouting({
  pathname: window.location.pathname,
  assetBase: import.meta.env.BASE_URL,
  routerBase: import.meta.env.VITE_ROUTER_BASE_PATH,
});

const navConfig = [
  {
    value: "/home",
    type: "item",
    icon: "nav-home",
    label: "Home",
  },
];

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <Root navConfig={navConfig} />,
      children: [
        { path: "network-monitoring/:section?", element: <NetworkMonitoring /> },
        {
          index: true,
          element: <Navigate to={deployment.landingPath} replace />,
        },
        {
          path: "usc-network-health",
          element: <USCNetworkHealth />,
        },
        {
          path: "tea-sales",
          element: <TeaSales />,
        },
        {
          path: "home",
          element: <Home />,
        },
      ],
    },
  ],
  {
    basename: deployment.basename,
  },
);

export default router;
