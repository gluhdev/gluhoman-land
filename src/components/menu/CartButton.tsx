'use client';

import { ShoppingBag } from 'lucide-react';
import { useCartStore, getItemCount, getSubtotal } from '@/lib/cart-store';
import { formatPrice } from '@/types/cart';

/**
 * Floating cart button — bottom right of viewport, above BackToTop.
 * Hidden when cart is empty. Click opens the cart drawer.
 */
export function CartButton() {
  const items = useCartStore((s) => s.items);
  const open = useCartStore((s) => s.openDrawer);

  const count = getItemCount(items);
  const subtotal = getSubtotal(items);

  if (count === 0) return null;

  return (
    <button
      type="button"
      onClick={open}
      aria-label={`Відкрити кошик (${count} позицій, ${formatPrice(subtotal)})`}
      className="fixed bottom-6 right-6 z-50 group flex items-center gap-3 pl-4 pr-5 py-3 rounded-full bg-[#1a3d2e] text-[#fdfaf0] shadow-2xl shadow-[#1a3d2e]/40 hover:bg-[#0f2a1e] hover:scale-105 transition-all duration-300"
    >
      <div className="relative">
        <ShoppingBag className="h-5 w-5" />
        <span className="absolute -top-2 -right-2 bg-[#d4b85a] text-[#1a3d2e] text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center tabular-nums shadow-md">
          {count}
        </span>
      </div>
      <span className="font-semibold text-sm tabular-nums">{formatPrice(subtotal)}</span>
    </button>
  );
}
