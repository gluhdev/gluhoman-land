'use client';

import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { EmbeddedMenu } from '@/components/menu/EmbeddedMenu';

const OPEN_EVENT = 'glu:menu-open';
const CLOSE_EVENT = 'glu:menu-close';

export function openMenuDialog() {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new Event(OPEN_EVENT));
}

export function closeMenuDialog() {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new Event(CLOSE_EVENT));
}

/**
 * Fullscreen-ish menu dialog. Opened via openMenuDialog() from anywhere.
 * Locks body scroll while open so inner EmbeddedMenu scroll cannot leak
 * to the page. Closes on Escape / backdrop click / X button.
 */
export function MenuDialog() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const scrollYRef = useRef(0);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const onOpen = () => setOpen(true);
    const onClose = () => setOpen(false);
    window.addEventListener(OPEN_EVENT, onOpen);
    window.addEventListener(CLOSE_EVENT, onClose);
    return () => {
      window.removeEventListener(OPEN_EVENT, onOpen);
      window.removeEventListener(CLOSE_EVENT, onClose);
    };
  }, []);

  // Body scroll lock — fixes the page in place so scroll wheel over the
  // dialog never bubbles out.
  useEffect(() => {
    if (!open) return;
    scrollYRef.current = window.scrollY;
    const html = document.documentElement;
    const body = document.body;
    body.style.position = 'fixed';
    body.style.top = `-${scrollYRef.current}px`;
    body.style.left = '0';
    body.style.right = '0';
    body.style.width = '100%';
    html.style.scrollbarGutter = 'stable';

    return () => {
      body.style.position = '';
      body.style.top = '';
      body.style.left = '';
      body.style.right = '';
      body.style.width = '';
      html.style.scrollbarGutter = '';
      window.scrollTo(0, scrollYRef.current);
    };
  }, [open]);

  // Esc to close
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          key="menu-dialog"
          className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4 md:p-8"
          role="dialog"
          aria-modal="true"
          aria-label="Меню ресторану"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          {/* Backdrop */}
          <motion.button
            type="button"
            aria-label="Закрити"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-[#0b1410]/85 backdrop-blur-md cursor-default"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Content */}
          <motion.div
            className="relative w-full max-w-5xl h-full max-h-[min(92vh,900px)] flex flex-col bg-[#fdfaf0] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.8)] rounded-sm overflow-hidden ring-1 ring-[#e6d9b8]"
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 20 }}
            transition={{ duration: 0.3, ease: [0.19, 1, 0.22, 1] }}
          >
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Закрити меню"
              className="absolute top-3 right-3 md:top-4 md:right-4 z-20 w-10 h-10 rounded-full bg-[#0f1f18] text-[#f4ecd8] flex items-center justify-center hover:bg-[#1a3d2e] ring-1 ring-[#e6d9b8]/30 shadow-lg transition-colors"
            >
              <X className="w-4 h-4" strokeWidth={2} />
            </button>
            <div className="flex-1 min-h-0 flex">
              <EmbeddedMenu />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
