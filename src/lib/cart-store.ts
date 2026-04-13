'use client';

/**
 * Cart store — Zustand with localStorage persistence.
 *
 * Money rules (see src/types/cart.ts for constants):
 *   • Min order:          500 грн
 *   • Delivery fee:       100 грн
 *   • Free delivery from: 2000 грн subtotal
 *
 * All prices in UAH (грн), integer. Source menu.json uses whole-UAH integers.
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import {
  CartItem,
  DELIVERY_FEE,
  FREE_DELIVERY_THRESHOLD,
  MIN_ORDER,
} from '@/types/cart';

interface CartState {
  items: CartItem[];
  isDrawerOpen: boolean;

  // Mutations
  add: (item: Omit<CartItem, 'quantity'>) => void;
  remove: (menuItemId: string) => void;
  setQuantity: (menuItemId: string, quantity: number) => void;
  clear: () => void;
  openDrawer: () => void;
  closeDrawer: () => void;
  toggleDrawer: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      isDrawerOpen: false,

      add: (item) =>
        set((state) => {
          const existing = state.items.find((i) => i.menuItemId === item.menuItemId);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.menuItemId === item.menuItemId
                  ? { ...i, quantity: i.quantity + 1 }
                  : i
              ),
            };
          }
          return {
            items: [...state.items, { ...item, quantity: 1 }],
          };
        }),

      remove: (menuItemId) =>
        set((state) => ({
          items: state.items.filter((i) => i.menuItemId !== menuItemId),
        })),

      setQuantity: (menuItemId, quantity) =>
        set((state) => {
          if (quantity <= 0) {
            return { items: state.items.filter((i) => i.menuItemId !== menuItemId) };
          }
          return {
            items: state.items.map((i) =>
              i.menuItemId === menuItemId ? { ...i, quantity } : i
            ),
          };
        }),

      clear: () => set({ items: [] }),
      openDrawer: () => set({ isDrawerOpen: true }),
      closeDrawer: () => set({ isDrawerOpen: false }),
      toggleDrawer: () => set((s) => ({ isDrawerOpen: !s.isDrawerOpen })),
    }),
    {
      name: 'gluhoman-cart',
      storage: createJSONStorage(() => {
        if (typeof window === 'undefined') {
          return {
            getItem: () => null,
            setItem: () => {},
            removeItem: () => {},
          };
        }
        return localStorage;
      }),
      partialize: (state) => ({ items: state.items }),
    }
  )
);

// ─── Selectors / pure helpers ───

export function getSubtotal(items: CartItem[]): number {
  return items.reduce((sum, i) => sum + i.price * i.quantity, 0);
}

export function getDeliveryFee(subtotal: number, type: 'delivery' | 'pickup'): number {
  if (type === 'pickup') return 0;
  if (subtotal >= FREE_DELIVERY_THRESHOLD) return 0;
  return DELIVERY_FEE;
}

export function getTotal(subtotal: number, deliveryFee: number): number {
  return subtotal + deliveryFee;
}

export function getItemCount(items: CartItem[]): number {
  return items.reduce((sum, i) => sum + i.quantity, 0);
}

export function isAboveMinimum(subtotal: number): boolean {
  return subtotal >= MIN_ORDER;
}

export function amountToMinimum(subtotal: number): number {
  return Math.max(0, MIN_ORDER - subtotal);
}

export function amountToFreeDelivery(subtotal: number): number {
  return Math.max(0, FREE_DELIVERY_THRESHOLD - subtotal);
}
