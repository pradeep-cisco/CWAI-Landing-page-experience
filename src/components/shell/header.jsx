import { useState } from "react";
import { useEffect } from "react";

const iconsURL = "https://hbr.cisco.com/packages/phosphor"
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
  const detectSystem = () =>
    typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';

  const [mode, setMode] = useState(detectSystem);

  const applyMode = (m) => {
    if (typeof document === "undefined") return;
    const body = document.body;
    if (m === "dark") body.classList.add("hbr-mode-dark");
    else body.classList.remove("hbr-mode-dark");
  };

  useEffect(() => {
    applyMode(mode);
  }, [mode]);

  // Toggle between light and dark
  const toggle = () => {
    setMode(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const nextMode = mode === 'light' ? 'dark' : 'light';
  const nextIcon = modes.find(m => m.name === nextMode)?.icon;

  return (
    <hbr-button noPadding sentiment="header" slot="trigger" onClick={toggle}>
      <hbr-icon
        src={nextIcon}
        sentiment="header"
        library="phosphor"
        size="24px"
      />
    </hbr-button>
  );
}

export default function Header({
}) {
  return (
    <>
      <div
        style={{
          width: "100%",
          minHeight: "56px",
        }}
      >
        <hbr-shell-header>
          <a href="/" slot="logo-name">
            <hbr-icon name="cisco" />
            <div>Magnetic</div>
          </a>

          <div slot="utilities">
            <ModeSelector />
          </div>
        </hbr-shell-header>
      </div>
    </>
  );
}
