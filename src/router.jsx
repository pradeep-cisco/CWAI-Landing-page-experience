import { createBrowserRouter, Navigate } from "react-router-dom";
import Root from "./components/root";
import Home from "./pages/home";
import NetworkHealth from "./pages/network-health";

const navConfig = [
  {
    value: "/network-health",
    type: "item",
    icon: "nav-network-devices",
    label: "Network Health",
  },
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
        {
          index: true,
          element: <Navigate to="/network-health" replace />,
        },
        {
          path: "network-health",
          element: <NetworkHealth />,
        },
        {
          path: "home",
          element: <Home />,
        },
      ],
    },
  ],
  {
    basename: import.meta.env.BASE_URL,
  },
);

export default router;
