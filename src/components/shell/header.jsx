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
          {/* Note to Agent: Update the name according to the current branding */}
          <div>Magnetic</div>
        </a>

        <AppearanceSelector />
      </hbr-shell-header>
    </div>
  );
}