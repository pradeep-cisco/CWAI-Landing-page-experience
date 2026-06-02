import { useEffect, useState } from "react";

const iconsURL = "https://hbr.cisco.com/packages/phosphor";
const modes = [
  { name: "light", label: "Light", icon: `${iconsURL}/sun-bold.svg` },
  { name: "dark", label: "Dark", icon: `${iconsURL}/moon-stars-bold.svg` },
  {
    name: "system",
    label: "System",
    icon: `${iconsURL}/monitor-bold.svg`,
  },
];

function ModeSelector() {
  const detectMode = () => {
    if (typeof document !== "undefined" && document.body.classList.contains("hbr-mode-dark")) {
      return "dark";
    }

    return typeof window !== "undefined" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
  };

  const [mode, setMode] = useState(detectMode);

  useEffect(() => {
    document.body.classList.toggle("hbr-mode-dark", mode === "dark");
  }, [mode]);

  // Toggle between light and dark
  const toggle = () => {
    setMode(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const nextMode = mode === 'light' ? 'dark' : 'light';
  const nextIcon = modes.find(m => m.name === nextMode)?.icon;

  return (
    <hbr-button
      aria-label={`Switch to ${nextMode} mode`}
      noPadding
      sentiment="header"
      slot="trigger"
      variant="context"
      onClick={toggle}
    >
      <hbr-icon
        src={nextIcon}
        sentiment="header"
        library="phosphor"
        size="24px"
      />
    </hbr-button>
  );
}

function setOneCdThemeEnabled(enabled) {
  if (typeof document === "undefined") {
    return;
  }

  if (enabled) {
    document.body.setAttribute("data-theme", "onecd");
  } else {
    document.body.removeAttribute("data-theme");
  }
}

function OneCdThemeToggle() {
  const [oneCdEnabled, setOneCdEnabled] = useState(true);

  useEffect(() => {
    setOneCdThemeEnabled(oneCdEnabled);

    const observer = new MutationObserver(() => {
      setOneCdThemeEnabled(oneCdEnabled);
    });

    observer.observe(document.head, { childList: true });

    return () => observer.disconnect();
  }, [oneCdEnabled]);

  const nextTheme = oneCdEnabled ? "Magnetic" : "OneCD";
  const icon = oneCdEnabled ? "magnet" : "rocket";

  return (
    <hbr-button
      aria-label={`Switch to ${nextTheme} theme`}
      aria-pressed={oneCdEnabled}
      sentiment="header"
      variant="context"
      onClick={() => setOneCdEnabled((enabled) => !enabled)}
    >
      <hbr-icon slot="prefix" name={icon} size="20px" />
      {nextTheme}
    </hbr-button>
  );
}

export default function Header({
}) {
  return (
    <>
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

          <div slot="utilities">
            <OneCdThemeToggle />
            <ModeSelector />
          </div>
        </hbr-shell-header>
      </div>
    </>
  );
}
