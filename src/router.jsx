import { createBrowserRouter } from "react-router-dom";
import Root from "./components/root";
import Home from "./pages/home";
import Table from "./pages/table";
import Wireless from "./pages/wireless";

const navConfig = [{
  value: "/",
  type: "item",
  icon: "nav-home",
  label: "Home",
}, {
  value: "/table",
  type: "item",
  icon: "nav-fabrics",
  label: "Table",
}, {
  value: "/wireless",
  type: "item",
  icon: "nav-wireless",
  label: "Wireless",
}]

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <Root navConfig={navConfig} />,
      children: [
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "table",
          element: <Table />,
        },
        {
          path: "wireless",
          element: <Wireless />,
        }
      ],
    }
  ],
  {
    basename: import.meta.env.BASE_URL,
  },
);

export default router;
