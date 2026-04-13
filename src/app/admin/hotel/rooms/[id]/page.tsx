import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Trash2 } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { RoomForm } from '../../RoomForm';
import { deleteRoom, updateRoom } from '../../actions';

export const dynamic = 'force-dynamic';

export default async function EditRoomPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const room = await prisma.hotelRoom.findUnique({
    where: { id },
    include: { _count: { select: { bookings: true } } },
  });
  if (!room) notFound();

  const updateRoomWithId = updateRoom.bind(null, id);
  const deleteRoomWithId = deleteRoom.bind(null, id);

  return (
    <div className="p-6 lg:p-10 max-w-3xl">
      <Link
        href="/admin/hotel/rooms"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1a3d2e]/60 hover:text-[#1a3d2e] mb-6"
      >
        <ArrowLeft className="h-3 w-3" />
        Назад до номерів
      </Link>

      <div className="mb-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#1a3d2e]/55">
          Номер
        </p>
        <h1 className="font-display text-3xl lg:text-4xl font-semibold text-[#1a3d2e] mt-1">
          {room.number}
        </h1>
        <div className="mt-2 h-1 w-16 bg-[#1a3d2e] rounded-full" />
      </div>

      <RoomForm initial={room} action={updateRoomWithId} submitLabel="Зберегти зміни" />

      {room._count.bookings === 0 && (
        <form action={deleteRoomWithId} className="mt-6">
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-red-50 text-red-700 border border-red-200 font-semibold text-xs hover:bg-red-100 transition-colors"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Видалити номер
          </button>
        </form>
      )}
      {room._count.bookings > 0 && (
        <p className="text-xs text-[#1a3d2e]/55 mt-6 italic">
          Не можна видалити: {room._count.bookings} бронювань пов&apos;язано з цим номером.
        </p>
      )}
    </div>
  );
}
