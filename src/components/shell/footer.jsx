export default function Footer() {
  return (
    <div
      className="hbr-css__footer-container"
      style={{ marginTop: "var(--hbr-spacing-sm)" }}
    >
      <div className="hbr-css__footer-copyright">
        © 2025 Cisco Systems, Inc.
      </div>
      <hbr-button
        class="hbr-css__layout-justify-self-end"
        size="small"
        variant="text"
      >
        Privacy Policy
      </hbr-button>
      <hbr-button size="small" variant="text">
        Terms of service
      </hbr-button>
    </div>
  );
}
