'use client';

import { Plus, Minus, Check } from 'lucide-react';
import { useCartStore } from '@/lib/cart-store';
import { CartItem } from '@/types/cart';

interface Props {
  item: Omit<CartItem, 'quantity'>;
  /** Visual variant — depends on host card style */
  variant?: 'card' | 'list';
}

/**
 * Smart "Add to cart" control. When the item is not in the cart, shows a single "+" button.
 * When already in cart, shows a stepper: [-] qty [+].
 */
export function AddToCartButton({ item, variant = 'card' }: Props) {
  const inCart = useCartStore((s) =>
    s.items.find((i) => i.menuItemId === item.menuItemId)
  );
  const add = useCartStore((s) => s.add);
  const setQty = useCartStore((s) => s.setQuantity);
  const openDrawer = useCartStore((s) => s.openDrawer);

  const handleAdd = () => {
    add(item);
    // Subtle feedback: open drawer briefly when first item is added
    if (!inCart) {
      // Delay so the user sees what they added before drawer pops in
      setTimeout(() => openDrawer(), 250);
    }
  };

  if (!inCart) {
    if (variant === 'list') {
      return (
        <button
          type="button"
          onClick={handleAdd}
          aria-label={`Додати ${item.name} до кошика`}
          className="flex-shrink-0 ml-2 w-8 h-8 flex items-center justify-center rounded-full bg-[#1a3d2e] text-[#fdfaf0] hover:bg-[#0f2a1e] hover:scale-110 active:scale-95 transition-all duration-200 shadow-md shadow-[#1a3d2e]/20"
        >
          <Plus className="h-4 w-4" strokeWidth={2.5} />
        </button>
      );
    }
    return (
      <button
        type="button"
        onClick={handleAdd}
        aria-label={`Додати ${item.name} до кошика`}
        className="absolute bottom-3 right-3 w-10 h-10 flex items-center justify-center rounded-full bg-[#1a3d2e] text-[#fdfaf0] hover:bg-[#0f2a1e] hover:scale-110 active:scale-95 transition-all duration-200 shadow-lg shadow-[#1a3d2e]/30 z-10"
      >
        <Plus className="h-5 w-5" strokeWidth={2.5} />
      </button>
    );
  }

  // Stepper variant
  const stepperBase =
    variant === 'list'
      ? 'flex-shrink-0 ml-2 inline-flex items-center gap-1 bg-[#1a3d2e] text-[#fdfaf0] rounded-full p-0.5 shadow-md shadow-[#1a3d2e]/20'
      : 'absolute bottom-3 right-3 inline-flex items-center gap-1 bg-[#1a3d2e] text-[#fdfaf0] rounded-full p-1 shadow-lg shadow-[#1a3d2e]/30 z-10';

  return (
    <div className={stepperBase}>
      <button
        type="button"
        onClick={() => setQty(item.menuItemId, inCart.quantity - 1)}
        aria-label="Зменшити"
        className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-white/15 transition-colors"
      >
        <Minus className="h-3.5 w-3.5" strokeWidth={2.5} />
      </button>
      <span className="text-xs font-bold tabular-nums min-w-[1.2em] text-center inline-flex items-center gap-1">
        <Check className="h-3 w-3" strokeWidth={3} />
        {inCart.quantity}
      </span>
      <button
        type="button"
        onClick={() => setQty(item.menuItemId, inCart.quantity + 1)}
        aria-label="Збільшити"
        className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-white/15 transition-colors"
      >
        <Plus className="h-3.5 w-3.5" strokeWidth={2.5} />
      </button>
    </div>
  );
}
