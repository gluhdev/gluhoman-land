'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, Info } from 'lucide-react';
import {
  useCartStore,
  getSubtotal,
  getDeliveryFee,
  getItemCount,
  isAboveMinimum,
  amountToMinimum,
  amountToFreeDelivery,
} from '@/lib/cart-store';
import {
  formatPrice,
  MIN_ORDER,
  FREE_DELIVERY_THRESHOLD,
} from '@/types/cart';

/**
 * Slide-in cart drawer. Mounts globally on the menu page.
 *
 * Renders a backdrop + a right-aligned panel. Locks body scroll when open.
 * Closes on Escape and on backdrop click.
 *
 * Inside the drawer:
 *  - List of cart items with thumbnail, name, qty stepper, line price, delete
 *  - Free-delivery progress bar (when subtotal < threshold)
 *  - Minimum-order warning (when subtotal < min)
 *  - Subtotal + delivery + total summary
 *  - "Оформити замовлення" CTA → /menu/checkout
 */
export function CartDrawer() {
  const items = useCartStore((s) => s.items);
  const isOpen = useCartStore((s) => s.isDrawerOpen);
  const close = useCartStore((s) => s.closeDrawer);
  const setQty = useCartStore((s) => s.setQuantity);
  const remove = useCartStore((s) => s.remove);

  // Lock body scroll while open
  useEffect(() => {
    if (!isOpen) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = original;
    };
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen, close]);

  const subtotal = getSubtotal(items);
  const deliveryFee = getDeliveryFee(subtotal, 'delivery'); // preview as delivery
  const itemCount = getItemCount(items);
  const aboveMin = isAboveMinimum(subtotal);
  const toMin = amountToMinimum(subtotal);
  const toFreeDelivery = amountToFreeDelivery(subtotal);
  const freeDeliveryProgress = Math.min(
    100,
    (subtotal / FREE_DELIVERY_THRESHOLD) * 100
  );

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={close}
        aria-hidden={!isOpen}
        className={`fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* Panel */}
      <aside
        role="dialog"
        aria-label="Кошик"
        aria-hidden={!isOpen}
        className={`fixed top-0 right-0 bottom-0 z-[61] w-full sm:w-[440px] bg-[#fdfaf0] shadow-2xl flex flex-col transform transition-transform duration-400 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#1a3d2e]/10 bg-gradient-to-b from-[#fdfaf0] to-[#f4ecd8]/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#1a3d2e] text-[#fdfaf0] flex items-center justify-center">
              <ShoppingBag className="h-5 w-5" />
            </div>
            <div>
              <p className="font-display text-lg font-semibold text-[#1a3d2e] leading-tight">
                Ваш кошик
              </p>
              <p className="text-[11px] text-[#1a3d2e]/60 uppercase tracking-wider">
                {itemCount} {itemCount === 1 ? 'позиція' : itemCount < 5 ? 'позиції' : 'позицій'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={close}
            aria-label="Закрити"
            className="w-9 h-9 flex items-center justify-center rounded-full text-[#1a3d2e]/60 hover:text-[#1a3d2e] hover:bg-[#1a3d2e]/8 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Empty state */}
        {items.length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center text-center px-8">
            <div className="w-16 h-16 rounded-full bg-[#1a3d2e]/8 flex items-center justify-center mb-4">
              <ShoppingBag className="h-8 w-8 text-[#1a3d2e]/40" />
            </div>
            <p className="font-display text-xl font-semibold text-[#1a3d2e] mb-2">
              Кошик порожній
            </p>
            <p className="text-sm text-[#1a3d2e]/60 mb-6">
              Оберіть страви з меню — вони з&apos;являться тут.
            </p>
            <button
              type="button"
              onClick={close}
              className="text-sm font-semibold text-[#1a3d2e] hover:text-[#0f2a1e] underline underline-offset-4"
            >
              Повернутись до меню
            </button>
          </div>
        )}

        {/* Items list */}
        {items.length > 0 && (
          <>
            <div className="flex-1 overflow-y-auto px-6 py-4 custom-scroll">
              <ul className="space-y-3">
                {items.map((item) => {
                  const lineTotal = item.price * item.quantity;
                  return (
                    <li
                      key={item.menuItemId}
                      className="flex gap-3 bg-white border border-[#1a3d2e]/8 rounded-2xl p-3"
                    >
                      {/* Thumbnail */}
                      {item.image ? (
                        <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-[#f4ecd8]">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            sizes="64px"
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-16 h-16 rounded-xl bg-[#f4ecd8] flex items-center justify-center text-[#1a3d2e]/30 flex-shrink-0">
                          <ShoppingBag className="h-5 w-5" />
                        </div>
                      )}

                      <div className="flex-1 min-w-0 flex flex-col">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-sm font-semibold text-[#1a3d2e] leading-snug line-clamp-2">
                            {item.name}
                          </h4>
                          <button
                            type="button"
                            onClick={() => remove(item.menuItemId)}
                            aria-label="Видалити"
                            className="text-[#1a3d2e]/40 hover:text-red-600 transition-colors flex-shrink-0"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>

                        {item.weight && (
                          <p className="text-[10px] text-[#1a3d2e]/50 uppercase tracking-wider mt-0.5">
                            {item.weight}
                          </p>
                        )}

                        <div className="flex items-center justify-between mt-auto pt-2">
                          {/* Stepper */}
                          <div className="inline-flex items-center bg-[#f4ecd8]/60 border border-[#1a3d2e]/10 rounded-full">
                            <button
                              type="button"
                              onClick={() => setQty(item.menuItemId, item.quantity - 1)}
                              aria-label="Менше"
                              className="w-7 h-7 flex items-center justify-center text-[#1a3d2e] hover:bg-[#1a3d2e]/10 rounded-full transition-colors"
                            >
                              <Minus className="h-3.5 w-3.5" />
                            </button>
                            <span className="text-xs font-bold text-[#1a3d2e] tabular-nums min-w-[1.5em] text-center">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => setQty(item.menuItemId, item.quantity + 1)}
                              aria-label="Більше"
                              className="w-7 h-7 flex items-center justify-center text-[#1a3d2e] hover:bg-[#1a3d2e]/10 rounded-full transition-colors"
                            >
                              <Plus className="h-3.5 w-3.5" />
                            </button>
                          </div>

                          <span className="font-bold text-[#1a3d2e] tabular-nums text-sm">
                            {formatPrice(lineTotal)}
                          </span>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Footer with totals + CTA */}
            <div className="border-t border-[#1a3d2e]/10 bg-[#f4ecd8]/30 px-6 py-5">
              {/* Free-delivery progress */}
              {toFreeDelivery > 0 && (
                <div className="mb-4">
                  <p className="text-[11px] text-[#1a3d2e]/70 mb-1.5 leading-tight">
                    Додайте ще <strong className="text-[#1a3d2e]">{formatPrice(toFreeDelivery)}</strong> для безкоштовної доставки
                  </p>
                  <div className="h-1.5 bg-[#1a3d2e]/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#1a3d2e] to-[#d4b85a] rounded-full transition-all duration-500"
                      style={{ width: `${freeDeliveryProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Min-order warning */}
              {!aboveMin && (
                <div className="mb-4 p-3 rounded-xl bg-amber-50 border border-amber-200/80 flex items-start gap-2">
                  <Info className="h-4 w-4 text-amber-700 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-900 leading-snug">
                    Мінімальна сума замовлення —{' '}
                    <strong>{formatPrice(MIN_ORDER)}</strong>.
                    {' '}Додайте ще {formatPrice(toMin)}.
                  </p>
                </div>
              )}

              {/* Totals */}
              <div className="space-y-1.5 text-sm mb-4">
                <div className="flex justify-between text-[#1a3d2e]/70">
                  <span>Сума замовлення</span>
                  <span className="tabular-nums">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-[#1a3d2e]/70">
                  <span>Доставка</span>
                  <span className="tabular-nums">
                    {deliveryFee === 0 ? (
                      <span className="text-[#1a3d2e] font-semibold">безкоштовно</span>
                    ) : (
                      formatPrice(deliveryFee)
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-base font-bold text-[#1a3d2e] pt-2 border-t border-[#1a3d2e]/10">
                  <span>До сплати</span>
                  <span className="tabular-nums">{formatPrice(subtotal + deliveryFee)}</span>
                </div>
              </div>

              {/* CTA */}
              <Link
                href="/menu/checkout"
                onClick={close}
                aria-disabled={!aboveMin}
                tabIndex={aboveMin ? 0 : -1}
                className={`flex items-center justify-center gap-2 w-full py-4 rounded-full font-semibold text-sm transition-all duration-300 ${
                  aboveMin
                    ? 'bg-[#1a3d2e] text-[#fdfaf0] hover:bg-[#0f2a1e] shadow-lg shadow-[#1a3d2e]/30 hover:scale-[1.01]'
                    : 'bg-[#1a3d2e]/15 text-[#1a3d2e]/40 cursor-not-allowed pointer-events-none'
                }`}
              >
                Оформити замовлення
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
