import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useAppearance } from "../../theme/appearance-context";

const shellStateStorageKey = "hbr-shell-state";
const ShellStateContext = createContext(null);

function getDefaultShellState(preset) {
  return {
    navCollapsed:
      preset === "cloud-control"
        ? window.matchMedia("(max-width: 980px)").matches
        : true,
    organization: {
      id: null,
      name: preset === "cloud-control" ? "Magnetic Co." : "Global",
    },
  };
}

function normalizeShellState(value, fallback) {
  const organization = value?.organization;

  return {
    navCollapsed:
      typeof value?.navCollapsed === "boolean"
        ? value.navCollapsed
        : fallback.navCollapsed,
    organization:
      organization && typeof organization.name === "string"
        ? {
            id:
              typeof organization.id === "string" ? organization.id : null,
            name: organization.name,
          }
        : fallback.organization,
  };
}

function getInitialShellState(preset) {
  const fallback = getDefaultShellState(preset);

  try {
    const storedState = window.localStorage.getItem(shellStateStorageKey);
    return storedState
      ? normalizeShellState(JSON.parse(storedState), fallback)
      : fallback;
  } catch {
    return fallback;
  }
}

export function ShellStateProvider({ children }) {
  const { preset } = useAppearance();
  const [shellState, setShellState] = useState(() =>
    getInitialShellState(preset),
  );

  const setNavCollapsed = useCallback((nextValue) => {
    setShellState((current) => ({
      ...current,
      navCollapsed:
        typeof nextValue === "function"
          ? nextValue(current.navCollapsed)
          : nextValue,
    }));
  }, []);

  const setOrganization = useCallback((nextOrganization) => {
    setShellState((current) => {
      const id =
        nextOrganization?.id || nextOrganization?.getAttribute?.("id") || null;
      const name =
        nextOrganization?.name ||
        nextOrganization?.getAttribute?.("name") ||
        current.organization.name;

      return {
        ...current,
        organization: { id, name },
      };
    });
  }, []);

  useEffect(() => {
    window.localStorage.setItem(
      shellStateStorageKey,
      JSON.stringify(shellState),
    );
  }, [shellState]);

  useEffect(() => {
    const handleStorage = (event) => {
      if (event.key !== shellStateStorageKey || !event.newValue) return;

      try {
        setShellState((current) =>
          normalizeShellState(JSON.parse(event.newValue), current),
        );
      } catch {
        // Ignore malformed state written outside this application.
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const value = useMemo(
    () => ({
      navCollapsed: shellState.navCollapsed,
      organization: shellState.organization,
      setNavCollapsed,
      setOrganization,
    }),
    [setNavCollapsed, setOrganization, shellState],
  );

  return (
    <ShellStateContext.Provider value={value}>
      {children}
    </ShellStateContext.Provider>
  );
}

export function useShellState() {
  const context = useContext(ShellStateContext);

  if (!context) {
    throw new Error("useShellState must be used within ShellStateProvider");
  }

  return context;
}
