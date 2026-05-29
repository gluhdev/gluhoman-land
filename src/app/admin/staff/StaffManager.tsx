'use client';

import { useState, useTransition, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import {
  UserPlus,
  Trash2,
  KeyRound,
  Crown,
  Building2,
  Loader2,
  Check,
  X,
} from 'lucide-react';
import type { AdminHotel } from '@/lib/admin-hotels';
import { createStaff, deleteStaff, resetStaffPassword } from './actions';

interface StaffUser {
  id: string;
  email: string;
  name: string | null;
  hotelSlug: string | null;
  createdAt: string;
}

interface Props {
  users: StaffUser[];
  currentUserId: string;
  hotels: AdminHotel[];
}

export function StaffManager({ users, currentUserId, hotels }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [hotelSlug, setHotelSlug] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState(false);

  const hotelLabelOf = (slug: string | null) =>
    slug ? hotels.find((h) => h.slug === slug)?.label ?? slug : null;

  function handleCreate(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setOk(false);
    startTransition(async () => {
      const res = await createStaff({ email, password, name, hotelSlug });
      if (!res.ok) {
        setError(res.error ?? 'Помилка');
        return;
      }
      setOk(true);
      setEmail('');
      setName('');
      setPassword('');
      setHotelSlug('');
      router.refresh();
    });
  }

  function handleDelete(id: string, label: string) {
    if (!confirm(`Видалити адміністратора «${label}»?`)) return;
    startTransition(async () => {
      const res = await deleteStaff(id);
      if (!res.ok) alert(res.error ?? 'Помилка');
      else router.refresh();
    });
  }

  function handleResetPassword(id: string) {
    const pw = prompt('Новий пароль (мінімум 8 символів):');
    if (!pw) return;
    startTransition(async () => {
      const res = await resetStaffPassword(id, pw);
      if (!res.ok) alert(res.error ?? 'Помилка');
      else alert('Пароль оновлено');
    });
  }

  const inputCls =
    'w-full px-3.5 py-2.5 border border-[#1a3d2e]/15 bg-[#faf6ec] text-sm text-[#0f1f18] placeholder:text-[#1a3d2e]/35 focus:outline-none focus:border-[#1a3d2e]/45 transition-colors';
  const labelCls =
    'text-[10px] uppercase tracking-[0.22em] text-[#1a3d2e]/60 font-medium';

  return (
    <div className="p-6 lg:p-10">
      <header className="mb-10">
        <p className="text-[11px] uppercase tracking-[0.22em] text-[#1a3d2e]/60 font-medium">
          CRM · Команда
        </p>
        <h1 className="font-display text-4xl lg:text-5xl text-[#1a3d2e] mt-2 leading-[1.1]">
          Адміністратори <span className="italic text-[#1a3d2e]/75">готелів</span>
        </h1>
        <div className="mt-5 h-px w-24 bg-[#1a3d2e]/30" />
        <p className="mt-6 text-sm text-[#1a3d2e]/70 max-w-xl leading-relaxed">
          Створюйте окремі акаунти для адміністраторів кожного готелю. Адміністратор
          готелю бачить лише заявки та номери свого готелю. Головний адміністратор
          (без прив&apos;язки до готелю) бачить усе.
        </p>
      </header>

      <div className="grid lg:grid-cols-[1fr_380px] gap-8 items-start">
        {/* Users list */}
        <div className="bg-white border border-[#1a3d2e]/10">
          <div className="px-5 py-3.5 border-b border-[#1a3d2e]/10">
            <p className="text-[10px] uppercase tracking-[0.22em] text-[#1a3d2e]/60 font-medium">
              Усі акаунти · {users.length}
            </p>
          </div>
          <ul>
            {users.map((u) => {
              const isMe = u.id === currentUserId;
              const hLabel = hotelLabelOf(u.hotelSlug);
              return (
                <li
                  key={u.id}
                  className="flex items-center gap-4 px-5 py-4 border-b border-[#1a3d2e]/10 last:border-b-0"
                >
                  <div className="flex-shrink-0 h-9 w-9 flex items-center justify-center bg-[#1a3d2e]/5 border border-[#1a3d2e]/10">
                    {u.hotelSlug ? (
                      <Building2 className="h-4 w-4 text-[#1a3d2e]/70" />
                    ) : (
                      <Crown className="h-4 w-4 text-[#c9a95c]" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-[#1a3d2e] truncate">
                      {u.name || u.email}
                      {isMe && (
                        <span className="ml-2 text-[10px] uppercase tracking-[0.18em] text-[#c9a95c]">
                          ви
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-[#1a3d2e]/55 truncate mt-0.5">
                      {u.email}
                    </p>
                  </div>
                  <span
                    className={`flex-shrink-0 text-[10px] uppercase tracking-[0.16em] px-2.5 py-1 border ${
                      u.hotelSlug
                        ? 'bg-[#1a3d2e]/5 text-[#1a3d2e] border-[#1a3d2e]/20'
                        : 'bg-[#c9a95c]/15 text-[#7a5d20] border-[#c9a95c]/40'
                    }`}
                  >
                    {hLabel ?? 'Головний'}
                  </span>
                  <div className="flex-shrink-0 flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleResetPassword(u.id)}
                      disabled={pending}
                      title="Змінити пароль"
                      className="p-2 text-[#1a3d2e]/55 hover:text-[#1a3d2e] hover:bg-[#1a3d2e]/5 transition-colors disabled:opacity-40"
                    >
                      <KeyRound className="h-4 w-4" />
                    </button>
                    {!isMe && (
                      <button
                        type="button"
                        onClick={() =>
                          handleDelete(u.id, u.name || u.email)
                        }
                        disabled={pending}
                        title="Видалити"
                        className="p-2 text-[#1a3d2e]/55 hover:text-red-700 hover:bg-red-50 transition-colors disabled:opacity-40"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Create form */}
        <form
          onSubmit={handleCreate}
          className="bg-white border border-[#1a3d2e]/10 p-6 space-y-4"
        >
          <div className="flex items-center gap-2 text-[#1a3d2e]">
            <UserPlus className="h-4 w-4" />
            <h2 className="font-display text-xl">Новий адміністратор</h2>
          </div>

          <label className="block space-y-1.5">
            <span className={labelCls}>Email</span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@hotel.com"
              className={inputCls}
            />
          </label>

          <label className="block space-y-1.5">
            <span className={labelCls}>Ім&apos;я (необов&apos;язково)</span>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Адміністратор Аквапарку"
              className={inputCls}
            />
          </label>

          <label className="block space-y-1.5">
            <span className={labelCls}>Пароль</span>
            <input
              type="text"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="мінімум 8 символів"
              className={inputCls}
            />
          </label>

          <label className="block space-y-1.5">
            <span className={labelCls}>Готель</span>
            <select
              value={hotelSlug}
              onChange={(e) => setHotelSlug(e.target.value)}
              className={inputCls}
            >
              <option value="">Головний адміністратор (усі готелі)</option>
              {hotels.map((h) => (
                <option key={h.slug} value={h.slug}>
                  {h.label}
                </option>
              ))}
            </select>
          </label>

          {error && (
            <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200">
              <X className="h-4 w-4 text-red-700 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-red-800">{error}</p>
            </div>
          )}
          {ok && (
            <div className="flex items-start gap-2 p-3 bg-[#1a3d2e]/5 border border-[#1a3d2e]/20">
              <Check className="h-4 w-4 text-[#1a3d2e] flex-shrink-0 mt-0.5" />
              <p className="text-xs text-[#1a3d2e]">Адміністратора створено</p>
            </div>
          )}

          <button
            type="submit"
            disabled={pending}
            className="w-full flex items-center justify-center gap-2 py-3 bg-[#1a3d2e] text-[#f4ecd8] text-[11px] uppercase tracking-[0.22em] font-medium hover:bg-[#0b1410] transition-colors disabled:opacity-50"
          >
            {pending && <Loader2 className="h-4 w-4 animate-spin" />}
            Створити акаунт
          </button>
        </form>
      </div>
    </div>
  );
}
