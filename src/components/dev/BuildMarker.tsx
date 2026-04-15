'use client';

import { useEffect } from 'react';

/**
 * Temporary build marker — logs to console when the page mounts.
 * Open DevTools → Console: if you see this line, the browser has the
 * latest bundle. If you don't, it's serving a stale cache and you
 * need a hard refresh (Cmd+Shift+R).
 *
 * Remove this component once the desktop scroll regression is
 * confirmed fixed across browsers.
 */
export function BuildMarker() {
  useEffect(() => {
    const ts = new Date().toISOString();
    // eslint-disable-next-line no-console
    console.log(
      '%c[gluhoman build] scroll-fix v4 — ' + ts,
      'background:#1a3d2e;color:#e6d9b8;padding:4px 8px;border-radius:4px;font-weight:600'
    );
  }, []);
  return null;
}
