import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  applyColorMode,
  applyPreset,
  getColorMode,
  getPreset,
  persistColorMode,
  persistPreset,
} from "./appearance";

const AppearanceContext = createContext(null);

export function AppearanceProvider({ children }) {
  const [initialPreset] = useState(getPreset);
  const [preset, setPresetState] = useState(initialPreset);
  const [mode, setModeState] = useState(() => getColorMode(initialPreset));

  const setMode = useCallback(
    (nextMode) => {
      setModeState(preset === "cloud-control" ? "dark" : nextMode);
    },
    [preset],
  );

  const setPreset = useCallback((nextPreset) => {
    setPresetState(nextPreset);
    setModeState(
      nextPreset === "cloud-control" ? "dark" : getColorMode(nextPreset),
    );
  }, []);

  useEffect(() => {
    applyColorMode(mode);
    persistColorMode(mode, preset);

    if (mode !== "system") return undefined;

    const systemColorMode = window.matchMedia("(prefers-color-scheme: dark)");
    const handleSystemColorModeChange = () => applyColorMode("system");
    systemColorMode.addEventListener("change", handleSystemColorModeChange);

    return () => {
      systemColorMode.removeEventListener("change", handleSystemColorModeChange);
    };
  }, [mode, preset]);

  useEffect(() => {
    applyPreset(preset);
    persistPreset(preset);
  }, [preset]);

  const value = useMemo(
    () => ({ mode, preset, setMode, setPreset }),
    [mode, preset],
  );

  return (
    <AppearanceContext.Provider value={value}>
      {children}
    </AppearanceContext.Provider>
  );
}

export function useAppearance() {
  const context = useContext(AppearanceContext);

  if (!context) {
    throw new Error("useAppearance must be used within AppearanceProvider");
  }

  return context;
}
