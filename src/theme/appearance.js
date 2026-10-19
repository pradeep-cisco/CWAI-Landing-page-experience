export const colorModes = [
  { name: "light", label: "Light" },
  { name: "dark", label: "Dark" },
  { name: "system", label: "System" },
];

export const presets = [
  { name: "magnetic", label: "Magnetic" },
  { name: "onecd", label: "oneCD" },
];

const colorModeStorageKey = "hbr-color-scheme";
const presetStorageKey = "hbr-preset";
const colorModeNames = new Set(colorModes.map(({ name }) => name));
const presetNames = new Set(presets.map(({ name }) => name));

function getStoredPreference(key, allowedValues, fallback) {
  if (typeof window === "undefined") return fallback;

  const storedValue = window.localStorage.getItem(key);
  return allowedValues.has(storedValue) ? storedValue : fallback;
}

export function getColorMode() {
  return getStoredPreference(colorModeStorageKey, colorModeNames, "system");
}

export function applyColorMode(mode) {
  if (typeof document === "undefined" || typeof window === "undefined") return;

  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  document.body.classList.toggle(
    "hbr-mode-dark",
    mode === "dark" || (mode === "system" && prefersDark),
  );
}

export function persistColorMode(mode) {
  window.localStorage.setItem(colorModeStorageKey, mode);
}

export function getPreset() {
  return getStoredPreference(presetStorageKey, presetNames, "onecd");
}

export function applyPreset(preset) {
  if (typeof document === "undefined") return;

  if (preset === "onecd") {
    document.body.setAttribute("data-theme", "onecd");
  } else {
    document.body.removeAttribute("data-theme");
  }
}

export function persistPreset(preset) {
  window.localStorage.setItem(presetStorageKey, preset);
}

export function initializeAppearance() {
  applyColorMode(getColorMode());
  applyPreset(getPreset());
}
