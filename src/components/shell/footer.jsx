export default function Footer() {
  return (
    <hbr-layout
      variant="page:footer"
      direction="row"
      gap="md"
      style={{
        justifyContent: "space-between",
        borderTop: "1px solid var(--hbr-color-neutral-border-weak)",
        paddingTop: "var(--hbr-spacing-md)",
        marginTop: "var(--hbr-spacing-sm)",
      }}
    >
      <hbr-text type="secondary" size="xs">
        © 2026 Cisco Systems, Inc.
      </hbr-text>
      <hbr-layout direction="row" gap="sm">
        <hbr-button size="small" variant="text">
          Privacy Policy
        </hbr-button>
        <hbr-button size="small" variant="text">
          Terms of service
        </hbr-button>
      </hbr-layout>
    </hbr-layout>
  );
}
