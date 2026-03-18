import { createBrowserRouter } from "react-router-dom";
import Root from "./components/root";
import Home from "./pages/home";

const navConfig = [{
  value: "/",
  type: "item",
  icon: "nav-home",
  label: "Home",
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
      ],
    }
  ],
  {
    basename: import.meta.env.BASE_URL,
  },
);

export default router;
