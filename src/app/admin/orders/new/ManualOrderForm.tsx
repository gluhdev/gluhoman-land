'use client';

/**
 * Manual order entry — for phone callers.
 *
 * Workflow:
 *   - Pick category, filter items
 *   - Click an item → adds to cart with quantity 1 (or +1 if exists)
 *   - Edit quantities
 *   - Fill customer info + delivery
 *   - POST to /api/admin/orders/manual → creates as PAID + CONFIRMED
 */

import { useState, useMemo, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import {
  Plus,
  Minus,
  Trash2,
  Search,
  User,
  Phone,
  MapPin,
  MessageSquare,
  Save,
  Truck,
  Store,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { formatPrice, MIN_ORDER, DELIVERY_FEE, FREE_DELIVERY_THRESHOLD } from '@/types/cart';

interface MenuItem {
  id: string;
  name: string;
  price: number;
  weight?: string | null;
}
interface Category {
  id: string;
  name: string;
  icon?: string | null;
  items: MenuItem[];
}
interface CartItem {
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
}

export function ManualOrderForm({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const [activeCat, setActiveCat] = useState(categories[0]?.id ?? '');
  const [search, setSearch] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [customer, setCustomer] = useState({
    name: '',
    phone: '+380',
    deliveryType: 'delivery' as 'delivery' | 'pickup',
    address: '',
    comment: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const visibleItems = useMemo(() => {
    const cat = categories.find((c) => c.id === activeCat);
    if (!cat) return [];
    if (!search) return cat.items;
    const q = search.toLowerCase();
    return cat.items.filter((i) => i.name.toLowerCase().includes(q));
  }, [activeCat, search, categories]);

  const subtotal = cart.reduce((s, i) => s + i.price * i.quantity, 0);
  const deliveryFee =
    customer.deliveryType === 'pickup' || subtotal >= FREE_DELIVERY_THRESHOLD
      ? 0
      : DELIVERY_FEE;
  const total = subtotal + deliveryFee;

  const addItem = (item: MenuItem) => {
    setCart((c) => {
      const existing = c.find((x) => x.menuItemId === item.id);
      if (existing) {
        return c.map((x) =>
          x.menuItemId === item.id ? { ...x, quantity: x.quantity + 1 } : x
        );
      }
      return [
        ...c,
        { menuItemId: item.id, name: item.name, price: item.price, quantity: 1 },
      ];
    });
  };

  const setQty = (id: string, qty: number) => {
    if (qty <= 0) {
      setCart((c) => c.filter((x) => x.menuItemId !== id));
    } else {
      setCart((c) =>
        c.map((x) => (x.menuItemId === id ? { ...x, quantity: qty } : x))
      );
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (cart.length === 0) {
      setError('Додайте хоча б одну позицію');
      return;
    }
    if (subtotal < MIN_ORDER) {
      setError(`Мінімальна сума замовлення — ${MIN_ORDER} грн`);
      return;
    }
    if (customer.name.trim().length < 2) {
      setError("Введіть ім'я");
      return;
    }
    if (!/^\+?[\d\s()-]{10,}$/.test(customer.phone.trim())) {
      setError('Введіть коректний телефон');
      return;
    }
    if (customer.deliveryType === 'delivery' && customer.address.trim().length < 5) {
      setError('Введіть адресу доставки');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/admin/orders/manual', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: customer.name.trim(),
          customerPhone: customer.phone.trim(),
          deliveryType: customer.deliveryType,
          address:
            customer.deliveryType === 'delivery' ? customer.address.trim() : undefined,
          comment: customer.comment.trim() || undefined,
          items: cart.map((c) => ({
            menuItemId: c.menuItemId,
            name: c.name,
            price: c.price,
            quantity: c.quantity,
          })),
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? 'Помилка створення замовлення');
      }
      const data = (await res.json()) as { id: string };
      router.push(`/admin/orders/${data.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Помилка');
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid lg:grid-cols-[1fr_400px] gap-6">
      {/* LEFT: menu picker */}
      <div className="bg-white border border-[#1a3d2e]/10 rounded-3xl shadow-[0_2px_24px_-12px_rgba(26,61,46,0.12)] overflow-hidden">
        {/* Search + categories */}
        <div className="p-5 border-b border-[#1a3d2e]/10 bg-[#f4ecd8]/30 space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#1a3d2e]/40" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Пошук страви…"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-[#1a3d2e]/15 text-sm focus:outline-none focus:border-[#1a3d2e]/40"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
            {categories.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setActiveCat(c.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  activeCat === c.id
                    ? 'bg-[#1a3d2e] text-[#fdfaf0]'
                    : 'bg-white text-[#1a3d2e]/70 border border-[#1a3d2e]/15 hover:bg-[#1a3d2e]/5'
                }`}
              >
                {c.icon && <span className="mr-1">{c.icon}</span>}
                {c.name}{' '}
                <span className="opacity-60">({c.items.length})</span>
              </button>
            ))}
          </div>
        </div>

        {/* Items */}
        <div className="max-h-[60vh] overflow-y-auto">
          {visibleItems.length === 0 ? (
            <div className="px-5 py-12 text-center text-sm text-[#1a3d2e]/45">
              Нічого не знайдено
            </div>
          ) : (
            <ul className="divide-y divide-[#1a3d2e]/8">
              {visibleItems.map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => addItem(item)}
                    className="w-full flex items-center gap-3 px-5 py-3 text-left hover:bg-[#1a3d2e]/4 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-[#1a3d2e] truncate">
                        {item.name}
                      </p>
                      {item.weight && (
                        <p className="text-[10px] text-[#1a3d2e]/50 uppercase tracking-wider">
                          {item.weight}
                        </p>
                      )}
                    </div>
                    <span className="text-sm font-bold text-[#1a3d2e] tabular-nums whitespace-nowrap">
                      {item.price} ₴
                    </span>
                    <div className="w-7 h-7 rounded-full bg-[#1a3d2e] text-[#fdfaf0] flex items-center justify-center flex-shrink-0">
                      <Plus className="h-4 w-4" />
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* RIGHT: cart + customer */}
      <div className="space-y-4">
        {/* Cart */}
        <div className="bg-white border border-[#1a3d2e]/10 rounded-3xl shadow-[0_2px_24px_-12px_rgba(26,61,46,0.12)] overflow-hidden">
          <div className="px-5 py-3 border-b border-[#1a3d2e]/10 bg-[#f4ecd8]/30">
            <h2 className="font-display text-base font-semibold text-[#1a3d2e]">
              Замовлення ({cart.length})
            </h2>
          </div>
          {cart.length === 0 ? (
            <div className="px-5 py-8 text-center text-xs text-[#1a3d2e]/45">
              Натисніть на страву зліва щоб додати
            </div>
          ) : (
            <ul className="divide-y divide-[#1a3d2e]/8 max-h-60 overflow-y-auto">
              {cart.map((item) => (
                <li
                  key={item.menuItemId}
                  className="flex items-center gap-2 px-4 py-2.5"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-[#1a3d2e] truncate">
                      {item.name}
                    </p>
                    <p className="text-[10px] text-[#1a3d2e]/55 tabular-nums">
                      {item.price} ₴ × {item.quantity} = {item.price * item.quantity} ₴
                    </p>
                  </div>
                  <div className="inline-flex items-center bg-[#f4ecd8]/60 border border-[#1a3d2e]/15 rounded-full">
                    <button
                      type="button"
                      onClick={() => setQty(item.menuItemId, item.quantity - 1)}
                      className="w-6 h-6 flex items-center justify-center text-[#1a3d2e] hover:bg-[#1a3d2e]/10 rounded-full"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="text-xs font-bold text-[#1a3d2e] tabular-nums min-w-[1.5em] text-center">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQty(item.menuItemId, item.quantity + 1)}
                      className="w-6 h-6 flex items-center justify-center text-[#1a3d2e] hover:bg-[#1a3d2e]/10 rounded-full"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => setQty(item.menuItemId, 0)}
                    className="text-[#1a3d2e]/40 hover:text-red-600"
                    aria-label="Видалити"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </li>
              ))}
            </ul>
          )}
          {cart.length > 0 && (
            <div className="px-5 py-3 border-t border-[#1a3d2e]/10 bg-[#f4ecd8]/20 space-y-1 text-xs">
              <div className="flex justify-between text-[#1a3d2e]/70">
                <span>Сума</span>
                <span className="tabular-nums">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-[#1a3d2e]/70">
                <span>Доставка</span>
                <span className="tabular-nums">
                  {deliveryFee === 0 ? 'безкоштовно' : formatPrice(deliveryFee)}
                </span>
              </div>
              <div className="flex justify-between font-bold text-[#1a3d2e] pt-1 border-t border-[#1a3d2e]/10 text-sm">
                <span>До сплати</span>
                <span className="tabular-nums">{formatPrice(total)}</span>
              </div>
            </div>
          )}
        </div>

        {/* Customer */}
        <div className="bg-white border border-[#1a3d2e]/10 rounded-3xl p-5 shadow-[0_2px_24px_-12px_rgba(26,61,46,0.12)] space-y-3">
          <Field label="Ім'я" icon={<User className="h-3 w-3" />} required>
            <input
              type="text"
              required
              value={customer.name}
              onChange={(e) => setCustomer((c) => ({ ...c, name: e.target.value }))}
              placeholder="Іван Петренко"
              className={inputClass}
            />
          </Field>
          <Field label="Телефон" icon={<Phone className="h-3 w-3" />} required>
            <input
              type="tel"
              required
              value={customer.phone}
              onChange={(e) => setCustomer((c) => ({ ...c, phone: e.target.value }))}
              placeholder="+380508503555"
              className={inputClass}
            />
          </Field>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setCustomer((c) => ({ ...c, deliveryType: 'delivery' }))}
              className={`py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 ${
                customer.deliveryType === 'delivery'
                  ? 'bg-[#1a3d2e] text-[#fdfaf0]'
                  : 'bg-white border border-[#1a3d2e]/15 text-[#1a3d2e]/70'
              }`}
            >
              <Truck className="h-3.5 w-3.5" />
              Доставка
            </button>
            <button
              type="button"
              onClick={() => setCustomer((c) => ({ ...c, deliveryType: 'pickup' }))}
              className={`py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 ${
                customer.deliveryType === 'pickup'
                  ? 'bg-[#1a3d2e] text-[#fdfaf0]'
                  : 'bg-white border border-[#1a3d2e]/15 text-[#1a3d2e]/70'
              }`}
            >
              <Store className="h-3.5 w-3.5" />
              Самовивіз
            </button>
          </div>
          {customer.deliveryType === 'delivery' && (
            <Field label="Адреса" icon={<MapPin className="h-3 w-3" />} required>
              <input
                type="text"
                required
                value={customer.address}
                onChange={(e) => setCustomer((c) => ({ ...c, address: e.target.value }))}
                placeholder="вул. Шевченка 1"
                className={inputClass}
              />
            </Field>
          )}
          <Field label="Коментар" icon={<MessageSquare className="h-3 w-3" />}>
            <textarea
              value={customer.comment}
              onChange={(e) => setCustomer((c) => ({ ...c, comment: e.target.value }))}
              rows={2}
              placeholder="…"
              className={`${inputClass} resize-none`}
            />
          </Field>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2">
            <AlertCircle className="h-4 w-4 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-red-800">{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={submitting || cart.length === 0}
          className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-full bg-[#1a3d2e] text-[#fdfaf0] font-semibold text-sm shadow-lg shadow-[#1a3d2e]/30 hover:bg-[#0f2a1e] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {submitting ? 'Створюємо…' : `Створити замовлення на ${formatPrice(total)}`}
        </button>
      </div>
    </form>
  );
}

const inputClass =
  'w-full px-3 py-2 rounded-xl bg-[#f4ecd8]/40 border border-[#1a3d2e]/15 text-[#1a3d2e] placeholder:text-[#1a3d2e]/35 text-xs focus:outline-none focus:border-[#1a3d2e]/50 focus:bg-white transition-all';

function Field({
  label,
  required,
  icon,
  children,
}: {
  label: string;
  required?: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <div className="flex items-center gap-1 text-[10px] font-semibold text-[#1a3d2e]/70 uppercase tracking-wider mb-1">
        {icon}
        <span>{label}</span>
        {required && <span className="text-red-500">*</span>}
      </div>
      {children}
    </label>
  );
}
