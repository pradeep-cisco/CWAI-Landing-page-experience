import { createBrowserRouter, Navigate } from "react-router-dom";
import Root from "./components/root";
import Home from "./pages/home";
import TeaSales from "./pages/tea-sales";
import USCNetworkHealth from "./pages/usc-network-health";

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
        {
          index: true,
          element: <Navigate to="/home" replace />,
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
    basename: import.meta.env.BASE_URL,
  },
);

export default router;
