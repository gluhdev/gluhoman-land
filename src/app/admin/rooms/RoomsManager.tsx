'use client';

import { useState, useTransition } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { BedDouble, Check, Loader2, Save, X } from 'lucide-react';
import { saveRoomConfig } from './actions';

export interface RoomRow {
  slug: string;
  name: string;
  photo: string;
  tiers: Record<number, number> | null;
  count: number;
  maxGuests: number;
}

export interface HotelGroup {
  slug: string;
  label: string;
  rooms: RoomRow[];
}

interface Props {
  groups: HotelGroup[];
  scopedHotel: string | null;
}

export function RoomsManager({ groups, scopedHotel }: Props) {
  return (
    <div className="p-6 lg:p-10">
      <header className="mb-10">
        <p className="text-[11px] uppercase tracking-[0.22em] text-[#1a3d2e]/60 font-medium">
          CRM · Номерний фонд
          {scopedHotel && (
            <span className="text-[#c9a95c]">
              {' '}
              · {groups[0]?.label ?? ''}
            </span>
          )}
        </p>
        <h1 className="font-display text-4xl lg:text-5xl text-[#1a3d2e] mt-2 leading-[1.1]">
          Номери <span className="italic text-[#1a3d2e]/75">за категоріями</span>
        </h1>
        <div className="mt-5 h-px w-24 bg-[#1a3d2e]/30" />
        <p className="mt-6 text-sm text-[#1a3d2e]/70 max-w-xl leading-relaxed">
          Ціни вказані за добу, окремо для кожної кількості гостей. Зміни цін та
          кількості номерів одразу застосовуються на сайті (форма бронювання й
          доступність).
        </p>
      </header>

      <div className="space-y-12">
        {groups.map((g) => (
          <section key={g.slug}>
            <div className="flex items-center gap-3 mb-5">
              <h2 className="font-display text-2xl text-[#1a3d2e]">{g.label}</h2>
              <span className="text-[11px] uppercase tracking-[0.22em] text-[#1a3d2e]/45 font-medium">
                {g.rooms.length} категорій
              </span>
            </div>
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {g.rooms.map((room) => (
                <RoomCard key={room.slug} hotel={g.slug} room={room} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

function RoomCard({ hotel, room }: { hotel: string; room: RoomRow }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [onRequest, setOnRequest] = useState(room.tiers === null);
  const [prices, setPrices] = useState<Record<number, string>>(() => {
    const init: Record<number, string> = {};
    for (let g = 1; g <= room.maxGuests; g++) {
      init[g] = room.tiers?.[g] != null ? String(room.tiers[g]) : '';
    }
    return init;
  });
  const [count, setCount] = useState(String(room.count));
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function save() {
    setError(null);
    setSaved(false);
    const tiers: Record<string, number> = {};
    for (const [g, v] of Object.entries(prices)) {
      const n = parseInt(v, 10);
      if (Number.isFinite(n) && n > 0) tiers[g] = n;
    }
    startTransition(async () => {
      const res = await saveRoomConfig({
        hotel,
        slug: room.slug,
        tiers,
        onRequest,
        count: parseInt(count, 10) || 0,
      });
      if (!res.ok) {
        setError(res.error ?? 'Помилка');
        return;
      }
      setSaved(true);
      router.refresh();
      setTimeout(() => setSaved(false), 2500);
    });
  }

  const inputCls =
    'w-24 px-2.5 py-1.5 border border-[#1a3d2e]/15 bg-[#faf6ec] text-sm text-[#0f1f18] tabular-nums focus:outline-none focus:border-[#1a3d2e]/45 transition-colors disabled:opacity-40 disabled:bg-[#1a3d2e]/5';

  return (
    <div className="bg-white border border-[#1a3d2e]/10 flex flex-col">
      <div className="relative aspect-[4/3] bg-[#1a3d2e]/5">
        <Image
          src={room.photo}
          alt={room.name}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover"
        />
      </div>
      <div className="p-5 flex flex-col gap-4 flex-1">
        <div className="flex items-start gap-2">
          <BedDouble className="h-4 w-4 text-[#1a3d2e]/50 mt-1 flex-shrink-0" />
          <h3 className="font-display text-lg text-[#1a3d2e] leading-snug">
            {room.name}
          </h3>
        </div>

        {/* Price tiers */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-[0.22em] text-[#1a3d2e]/60 font-medium">
              Ціна за добу
            </span>
            <label className="flex items-center gap-1.5 text-[11px] text-[#1a3d2e]/70 cursor-pointer">
              <input
                type="checkbox"
                checked={onRequest}
                onChange={(e) => setOnRequest(e.target.checked)}
                className="accent-[#1a3d2e]"
              />
              За запитом
            </label>
          </div>
          {!onRequest && (
            <div className="space-y-1.5">
              {Array.from({ length: room.maxGuests }, (_, i) => i + 1).map((g) => (
                <div key={g} className="flex items-center justify-between gap-2">
                  <span className="text-sm text-[#1a3d2e]/70">
                    {g} {g === 1 ? 'гість' : 'гостей'}
                  </span>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      inputMode="numeric"
                      min={0}
                      value={prices[g] ?? ''}
                      onChange={(e) =>
                        setPrices((p) => ({ ...p, [g]: e.target.value }))
                      }
                      placeholder="—"
                      className={inputCls}
                    />
                    <span className="text-xs text-[#1a3d2e]/50">грн</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Inventory */}
        <div className="flex items-center justify-between pt-1 border-t border-[#1a3d2e]/10">
          <span className="text-[10px] uppercase tracking-[0.22em] text-[#1a3d2e]/60 font-medium">
            Кількість номерів
          </span>
          <input
            type="number"
            inputMode="numeric"
            min={0}
            value={count}
            onChange={(e) => setCount(e.target.value)}
            className={inputCls.replace('w-24', 'w-20')}
          />
        </div>

        {error && (
          <div className="flex items-start gap-2 p-2.5 bg-red-50 border border-red-200">
            <X className="h-3.5 w-3.5 text-red-700 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-red-800">{error}</p>
          </div>
        )}

        <button
          type="button"
          onClick={save}
          disabled={pending}
          className={`mt-auto w-full flex items-center justify-center gap-2 py-2.5 text-[11px] uppercase tracking-[0.22em] font-medium transition-colors disabled:opacity-50 ${
            saved
              ? 'bg-[#1a3d2e]/10 text-[#1a3d2e] border border-[#1a3d2e]/30'
              : 'bg-[#1a3d2e] text-[#f4ecd8] hover:bg-[#0b1410]'
          }`}
        >
          {pending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : saved ? (
            <Check className="h-4 w-4" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          {saved ? 'Збережено' : 'Зберегти'}
        </button>
      </div>
    </div>
  );
}
