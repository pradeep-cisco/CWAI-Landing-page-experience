import { useState } from "react"
import { useMatches } from "react-router-dom";
import Header from "./header";
import Footer from "./footer";
import Nav from "./nav";
import "./shell.css";

export default function Shell({ children, navConfig }) {
  const matches = useMatches();
  const currentPath = matches[matches.length - 1]?.pathname || "/";
  console.log("Current Path:", currentPath);
  const [navCollapsed, setNavCollapsed] = useState(true);
  const [selected, setSelected] = useState(currentPath || (navConfig.length > 0 ? navConfig[0].value : null));
  const Page = children || null;
  return (
    <div
      className={`n-root ${navCollapsed ? "navCollapsed" : ""}`}
    >
      <Header />
      <div className="n-container">
        <Nav
          collapsed={navCollapsed}
          setCollapsed={setNavCollapsed}
          selected={selected}
          setSelected={setSelected}
          config={navConfig}
        />
        <main className="n-content">
          <div className="n-page">
            {Page}
          </div>
          <Footer />
        </main>
      </div>
    </div>
  );
}
