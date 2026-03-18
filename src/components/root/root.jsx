import Shell from "../shell";
import "./magnetic-web-loader";
import PhosphorLibrary from "./phosphor-icon-library";
import { Outlet } from "react-router";

export default function Root({ navConfig }) {
  return (
    <>
      <PhosphorLibrary />
      <Shell navConfig={navConfig}>
        <Outlet />
      </Shell>
    </>
  );
}