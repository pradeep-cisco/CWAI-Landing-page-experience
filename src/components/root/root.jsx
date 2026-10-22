import Shell from "../shell";
import "./magnetic-web-loader";
import PhosphorLibrary from "./phosphor-icon-library";
import { Outlet } from "react-router";
import { AppearanceProvider } from "../../theme/appearance-context";

export default function Root({ navConfig }) {
  return (
    <>
      <PhosphorLibrary />
      <AppearanceProvider>
        <Shell navConfig={navConfig}>
          <Outlet />
        </Shell>
      </AppearanceProvider>
    </>
  );
}
