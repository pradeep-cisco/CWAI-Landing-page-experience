import { useCallback, useState } from "react"
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

  const handleOneCdScroll = useCallback((event) => {
    const target = event.currentTarget;
    const header = document.querySelector("hbr-shell-header");
    const glowLayer = target.querySelector(".hbr-css__glow-layer");

    if (target.scrollTop > 160) {
      header?.classList.add("scrolled");
    } else {
      header?.classList.remove("scrolled");
    }

    if (glowLayer) {
      glowLayer.style.top = `-${target.scrollTop}px`;
    }
  }, []);

  return (
    <div
      className={`n-root ${navCollapsed ? "navCollapsed" : ""}`}
    >
      <Header />
      <div className="n-container hbr-css__base-bg-gradient-layer">
        <Nav
          collapsed={navCollapsed}
          setCollapsed={setNavCollapsed}
          selected={selected}
          setSelected={setSelected}
          config={navConfig}
        />
        <main
          className="n-content"
          onScroll={handleOneCdScroll}
        >
          <div className="hbr-css__glow-layer" aria-hidden="true" />
          <div className="n-page">
            {Page}
          </div>
          <Footer />
        </main>
      </div>
    </div>
  );
}
