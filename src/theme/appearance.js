export const colorModes = [
  { name: "light", label: "Light" },
  { name: "dark", label: "Dark" },
  { name: "system", label: "System" },
];

export const presetDefinitions = {
  onecd: {
    label: "oneCD",
    shell: "standard",
    theme: "onecd",
  },
  "cloud-control": {
    label: "Cloud Control",
    shell: "cloud-control",
    theme: "onecd",
  },
  magnetic: {
    label: "Magnetic",
    shell: "standard",
    theme: "magnetic",
  },
};

export const presets = Object.entries(presetDefinitions).map(
  ([name, { label }]) => ({ name, label }),
);

const colorModeStorageKey = "hbr-color-scheme";
const cloudControlColorModeStorageKey = `${colorModeStorageKey}:cloud-control`;
const presetStorageKey = "hbr-preset";
const colorModeNames = new Set(colorModes.map(({ name }) => name));
const presetNames = new Set(presets.map(({ name }) => name));

function getStoredPreference(key, allowedValues, fallback) {
  if (typeof window === "undefined") return fallback;

  const storedValue = window.localStorage.getItem(key);
  return allowedValues.has(storedValue) ? storedValue : fallback;
}

function getColorModePreference(preset) {
  return preset === "cloud-control"
    ? {
        fallback: "dark",
        storageKey: cloudControlColorModeStorageKey,
      }
    : {
        fallback: "system",
        storageKey: colorModeStorageKey,
      };
}

export function getColorMode(preset = getPreset()) {
  if (preset === "cloud-control") return "dark";

  const { fallback, storageKey } = getColorModePreference(preset);
  return getStoredPreference(storageKey, colorModeNames, fallback);
}

export function applyColorMode(mode) {
  if (typeof document === "undefined" || typeof window === "undefined") return;

  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  document.body.classList.toggle(
    "hbr-mode-dark",
    mode === "dark" || (mode === "system" && prefersDark),
  );
}

export function persistColorMode(mode, preset = getPreset()) {
  const { storageKey } = getColorModePreference(preset);
  window.localStorage.setItem(
    storageKey,
    preset === "cloud-control" ? "dark" : mode,
  );
}

export function getPreset() {
  return getStoredPreference(presetStorageKey, presetNames, "onecd");
}

export function applyPreset(preset) {
  if (typeof document === "undefined") return;

  const normalizedPreset = presetDefinitions[preset] ? preset : "onecd";
  const definition = presetDefinitions[normalizedPreset];
  document.body.dataset.preset = normalizedPreset;

  if (definition.theme === "onecd") {
    document.body.setAttribute("data-theme", "onecd");
  } else {
    document.body.removeAttribute("data-theme");
  }
}

export function persistPreset(preset) {
  window.localStorage.setItem(presetStorageKey, preset);
}

export function getPresetShell(preset) {
  return presetDefinitions[preset]?.shell ?? presetDefinitions.onecd.shell;
}

export function initializeAppearance() {
  const preset = getPreset();
  applyPreset(preset);
  applyColorMode(getColorMode(preset));
}
