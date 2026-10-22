import AppearanceSelector from "./appearance-selector";

export default function Header() {
  return (
    <div
      className="n-header"
      style={{
        width: "100%",
        minHeight: "56px",
      }}
    >
      <hbr-shell-header>
        <a href="/" slot="logo-name">
          <hbr-icon name="cisco" />
          <div>Meraki</div>
        </a>

        <AppearanceSelector />
      </hbr-shell-header>
    </div>
  );
}
