"use client";

import { useEffect, useState, useCallback } from "react";
import { FONT_PAIRINGS, DEFAULT_PAIRING_ID, type FontPairing } from "@/constants/fontPairings";

const STORAGE_KEY = "gluhoman:font-pairing";
const LOADED_FAMILIES = new Set<string>();

function familyToHref(family: string): string {
  // Load all standard weights with cyrillic + latin subset, swap display.
  const fam = family.trim().replace(/\s+/g, "+");
  return `https://fonts.googleapis.com/css2?family=${fam}:wght@300;400;500;600;700&display=swap&subset=cyrillic,latin`;
}

function ensureFontLoaded(family: string) {
  if (typeof document === "undefined") return;
  if (LOADED_FAMILIES.has(family)) return;
  const id = `font-switcher-${family.replace(/\s+/g, "-").toLowerCase()}`;
  if (document.getElementById(id)) {
    LOADED_FAMILIES.add(family);
    return;
  }
  const link = document.createElement("link");
  link.id = id;
  link.rel = "stylesheet";
  link.href = familyToHref(family);
  document.head.appendChild(link);
  LOADED_FAMILIES.add(family);
}

function applyPairing(p: FontPairing) {
  ensureFontLoaded(p.heading);
  ensureFontLoaded(p.body);
  const root = document.documentElement;
  root.style.setProperty("--font-heading", `"${p.heading}", serif`);
  root.style.setProperty("--font-body", `"${p.body}", system-ui, sans-serif`);
}

function resetPairing() {
  const root = document.documentElement;
  root.style.removeProperty("--font-heading");
  root.style.removeProperty("--font-body");
}

export default function FontSwitcher() {
  const [open, setOpen] = useState(false);
  const [activeId, setActiveId] = useState<string>(DEFAULT_PAIRING_ID);

  // Re-apply persisted choice on mount.
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved || saved === DEFAULT_PAIRING_ID) return;
      const pairing = FONT_PAIRINGS.find((p) => p.id === saved);
      if (pairing) {
        applyPairing(pairing);
        setActiveId(pairing.id);
      }
    } catch {
      /* ignore */
    }
  }, []);

  // Preload preview fonts (lightly) when panel opens so the cards show real previews.
  useEffect(() => {
    if (!open) return;
    FONT_PAIRINGS.forEach((p) => {
      ensureFontLoaded(p.heading);
      ensureFontLoaded(p.body);
    });
  }, [open]);

  const handleSelect = useCallback((p: FontPairing) => {
    applyPairing(p);
    setActiveId(p.id);
    try {
      localStorage.setItem(STORAGE_KEY, p.id);
    } catch {
      /* ignore */
    }
  }, []);

  const handleReset = useCallback(() => {
    resetPairing();
    setActiveId(DEFAULT_PAIRING_ID);
    try {
      localStorage.setItem(STORAGE_KEY, DEFAULT_PAIRING_ID);
    } catch {
      /* ignore */
    }
  }, []);

  return (
    <>
      <button
        type="button"
        aria-label="Font preview switcher"
        data-font-switcher="true"
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-6 left-6 z-[60] flex items-center gap-2 rounded-full bg-white/95 px-4 py-3 text-sm font-medium text-neutral-800 shadow-lg ring-1 ring-black/10 backdrop-blur hover:bg-white"
      >
        <span aria-hidden>🎨</span>
        <span>Fonts</span>
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-[60] bg-black/30"
            onClick={() => setOpen(false)}
          />
          <aside
            role="dialog"
            aria-label="Font pairings"
            className="fixed right-0 top-0 z-[61] flex h-full w-full max-w-sm flex-col bg-white shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-neutral-200 px-4 py-3">
              <h2 className="text-base font-semibold text-neutral-900">Font pairings</h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="rounded-md px-2 py-1 text-neutral-600 hover:bg-neutral-100"
              >
                Close
              </button>
            </div>

            <div className="border-b border-neutral-200 px-4 py-3">
              <button
                type="button"
                onClick={handleReset}
                className={`w-full rounded-md border px-3 py-2 text-sm transition ${
                  activeId === DEFAULT_PAIRING_ID
                    ? "border-emerald-600 bg-emerald-50 text-emerald-800"
                    : "border-neutral-300 text-neutral-700 hover:bg-neutral-50"
                }`}
              >
                Reset to default (Manrope)
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-3">
              <ul className="flex flex-col gap-3">
                {FONT_PAIRINGS.map((p) => {
                  const isActive = p.id === activeId;
                  return (
                    <li key={p.id}>
                      <button
                        type="button"
                        onClick={() => handleSelect(p)}
                        className={`w-full rounded-lg border p-3 text-left transition ${
                          isActive
                            ? "border-emerald-600 bg-emerald-50"
                            : "border-neutral-200 bg-white hover:border-neutral-400"
                        }`}
                      >
                        <div
                          className="text-2xl leading-tight text-neutral-900"
                          style={{ fontFamily: `"${p.heading}", serif` }}
                        >
                          Глухомань
                        </div>
                        <div
                          className="mt-1 text-sm text-neutral-700"
                          style={{ fontFamily: `"${p.body}", sans-serif` }}
                        >
                          Відпочинок у серці природи
                        </div>
                        <div className="mt-2 text-xs font-medium text-neutral-800">{p.label}</div>
                        <div className="text-[11px] text-neutral-500">{p.mood}</div>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </aside>
        </>
      )}
    </>
  );
}
