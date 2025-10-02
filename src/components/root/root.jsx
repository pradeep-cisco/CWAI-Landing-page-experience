import Shell from "../shell";
import MagneticWebLoader from "./magnetic-web-loader";
import PhosphorLibrary from "./phosphor-icon-library";
import { Outlet } from "react-router";

export default function Root({ navConfig }) {
  return (
    <>
      <MagneticWebLoader />
      <PhosphorLibrary />
      <Shell navConfig={navConfig}>
        <Outlet />
      </Shell>
    </>
  );
}