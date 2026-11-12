import AppearanceSelector from "./appearance-selector";
import { Link } from "react-router-dom";

export default function Header({ productName = "Magnetic", homeHref = "/" }) {
  return (
    <div
      className="n-header"
      style={{
        width: "100%",
        minHeight: "56px",
      }}
    >
      <hbr-shell-header>
        <Link to={homeHref} slot="logo-name">
          <hbr-icon name="cisco" />
          <div>{productName}</div>
        </Link>

        <AppearanceSelector compact={productName === "Crosswork AI"} />
      </hbr-shell-header>
    </div>
  );
}
