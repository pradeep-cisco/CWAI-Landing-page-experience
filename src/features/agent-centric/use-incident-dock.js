import { useLayoutEffect, useRef } from 'react';

/** Reserve the shell's existing right-hand slot, restoring it outside Option 4. */
export default function useIncidentDock(rootRef, { active, open, width }) {
  const reservation = useRef(null);

  useLayoutEffect(() => {
    if (!active) return undefined;
    const shell = rootRef.current?.closest('.n-root');
    if (!shell) return undefined;
    const property = '--hbr-app-shift-right';
    const previous = {
      value: shell.style.getPropertyValue(property),
      priority: shell.style.getPropertyPriority(property),
      workspace: shell.getAttribute('data-agent-incident-workspace'),
      docked: shell.getAttribute('data-agent-incident-docked'),
    };
    const restoreWidth = () => {
      if (previous.value) shell.style.setProperty(property, previous.value, previous.priority);
      else shell.style.removeProperty(property);
    };
    reservation.current = { shell, property, restoreWidth };
    shell.setAttribute('data-agent-incident-workspace', 'true');
    return () => {
      restoreWidth();
      for (const [name, value] of [['data-agent-incident-workspace', previous.workspace], ['data-agent-incident-docked', previous.docked]]) {
        if (value === null) shell.removeAttribute(name);
        else shell.setAttribute(name, value);
      }
      reservation.current = null;
    };
  }, [active, rootRef]);

  useLayoutEffect(() => {
    const current = reservation.current;
    if (!active || !current) return;
    if (open) {
      current.shell.style.setProperty(current.property, `${Math.max(1, Math.round(width || 480))}px`);
      current.shell.setAttribute('data-agent-incident-docked', 'true');
    } else {
      current.restoreWidth();
      current.shell.removeAttribute('data-agent-incident-docked');
    }
  }, [active, open, width]);
}
