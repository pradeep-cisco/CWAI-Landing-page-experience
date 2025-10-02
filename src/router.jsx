import { createBrowserRouter } from "react-router-dom";
import Root from "./components/root";
import Home from "./pages/home";
import Table from "./pages/table";

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
        }
      ],
    }
  ],
  {
    basename: import.meta.env.BASE_URL,
  },
);

export default router;
