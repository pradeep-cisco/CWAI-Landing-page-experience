import { useCallback, useState } from "react";
import { useMatches } from "react-router-dom";
import Footer from "../footer";
import CloudControlHeader from "./cloud-control-header";
import CloudControlNav from "./cloud-control-nav";
import backgroundGlowLeft from "./assets/background-glow-left.svg";
import backgroundGlowRight from "./assets/background-glow-right.svg";
import navMeraki from "./assets/nav-meraki.svg?raw";
import { useShellState } from "../shell-state-context";
import "./cloud-control.css";

export default function CloudControlShell({ children, navConfig }) {
  const matches = useMatches();
  const currentPath = matches[matches.length - 1]?.pathname || "/";
  const { navCollapsed, setNavCollapsed } = useShellState();
  const [selectedProduct, setSelectedProduct] = useState({
    iconAsset: navMeraki,
    label: "Meraki",
  });
  const [selected, setSelected] = useState(
    currentPath || (navConfig.length > 0 ? navConfig[0].value : null),
  );

  const handleScroll = useCallback((event) => {
    const target = event.currentTarget;
    const header = target
      .closest(".cloud-control-root")
      ?.querySelector("hbr-shell-header");

    header?.classList.toggle("scrolled", target.scrollTop > 160);
  }, []);

  return (
    <div
      className={`cloud-control-root ${navCollapsed ? "navCollapsed" : ""}`}
      data-testid="cloud-control-shell"
    >
      <CloudControlHeader
        activeProduct={selectedProduct.label}
        onProductSelect={setSelectedProduct}
      />
      <div className="cloud-control-container hbr-css__base-bg-gradient-layer">
        <CloudControlNav
          collapsed={navCollapsed}
          config={navConfig}
          product={selectedProduct}
          selected={selected}
          setCollapsed={setNavCollapsed}
          setSelected={setSelected}
        />
        <main className="cloud-control-content" onScroll={handleScroll}>
          <div
            className="cloud-control-background-glow hbr-css__glow-layer"
            aria-hidden="true"
          >
            <div className="cloud-control-background-glow-shape cloud-control-background-glow-shape--left">
              <div className="cloud-control-background-glow-rotation">
                <div className="cloud-control-background-glow-canvas">
                  <div className="cloud-control-background-glow-image-frame">
                    <img alt="" src={backgroundGlowLeft} />
                  </div>
                </div>
              </div>
            </div>

            <div className="cloud-control-background-glow-shape cloud-control-background-glow-shape--right">
              <div className="cloud-control-background-glow-rotation">
                <div className="cloud-control-background-glow-canvas">
                  <div className="cloud-control-background-glow-image-frame">
                    <img alt="" src={backgroundGlowRight} />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="cloud-control-page">{children}</div>
          <Footer />
        </main>
      </div>
    </div>
  );
}
