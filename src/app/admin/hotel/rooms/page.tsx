import Link from 'next/link';
import { Plus, Eye, EyeOff, Bed, Edit2 } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { formatPrice } from '@/types/cart';
import { ROOM_TYPE_LABEL } from '@/types/booking';
import { toggleRoomActive } from '../actions';

export const dynamic = 'force-dynamic';

export default async function AdminRoomsPage() {
  const rooms = await prisma.hotelRoom.findMany({
    include: { _count: { select: { bookings: true } } },
    orderBy: [{ pricePerNight: 'asc' }, { number: 'asc' }],
  });

  return (
    <div className="p-6 lg:p-10">
      <div className="mb-8 flex items-end justify-between gap-4 flex-wrap">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#1a3d2e]/55">
            Готель
          </p>
          <h1 className="font-display text-3xl lg:text-4xl font-semibold text-[#1a3d2e] mt-1">
            Номери
          </h1>
          <div className="mt-2 h-1 w-16 bg-[#1a3d2e] rounded-full" />
        </div>
        <Link
          href="/admin/hotel/rooms/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#1a3d2e] text-[#fdfaf0] font-semibold text-sm hover:bg-[#0f2a1e] transition-colors shadow-md"
        >
          <Plus className="h-4 w-4" />
          Новий номер
        </Link>
      </div>

      {rooms.length === 0 ? (
        <div className="bg-white border border-[#1a3d2e]/10 rounded-3xl p-12 text-center">
          <Bed className="h-12 w-12 text-[#1a3d2e]/30 mx-auto mb-3" />
          <p className="text-sm text-[#1a3d2e]/60 mb-4">Ще немає номерів</p>
          <Link
            href="/admin/hotel/rooms/new"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#1a3d2e] text-[#fdfaf0] font-semibold text-sm hover:bg-[#0f2a1e]"
          >
            <Plus className="h-4 w-4" />
            Додати перший номер
          </Link>
        </div>
      ) : (
        <div className="bg-white border border-[#1a3d2e]/10 rounded-3xl overflow-hidden shadow-[0_2px_24px_-12px_rgba(26,61,46,0.18)]">
          <ul className="divide-y divide-[#1a3d2e]/8">
            {rooms.map((room) => (
              <li
                key={room.id}
                className={`flex items-center gap-4 px-6 py-4 hover:bg-[#1a3d2e]/4 transition-colors ${
                  !room.active ? 'opacity-50' : ''
                }`}
              >
                <div className="font-display text-2xl font-semibold text-[#1a3d2e] tabular-nums w-16 flex-shrink-0">
                  {room.number}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-[#1a3d2e]">
                    {ROOM_TYPE_LABEL[room.type] ?? room.type}
                    {!room.active && (
                      <span className="ml-2 text-[10px] uppercase tracking-wider text-[#1a3d2e]/50">
                        приховано
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-[#1a3d2e]/55">
                    до {room.capacity} осіб · {room._count.bookings} бронювань
                  </p>
                </div>
                <p className="font-display text-xl font-semibold text-[#1a3d2e] tabular-nums whitespace-nowrap">
                  {formatPrice(room.pricePerNight)}
                  <span className="text-[10px] text-[#1a3d2e]/55 font-normal">/ніч</span>
                </p>
                <form action={toggleRoomActive.bind(null, room.id)}>
                  <button
                    type="submit"
                    className="w-9 h-9 flex items-center justify-center rounded-full text-[#1a3d2e]/40 hover:text-[#1a3d2e] hover:bg-[#1a3d2e]/8 transition-colors"
                    aria-label={room.active ? 'Сховати' : 'Показати'}
                  >
                    {room.active ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                  </button>
                </form>
                <Link
                  href={`/admin/hotel/rooms/${room.id}`}
                  className="w-9 h-9 flex items-center justify-center rounded-full text-[#1a3d2e]/40 hover:text-[#1a3d2e] hover:bg-[#1a3d2e]/8 transition-colors"
                  aria-label="Редагувати"
                >
                  <Edit2 className="h-4 w-4" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
