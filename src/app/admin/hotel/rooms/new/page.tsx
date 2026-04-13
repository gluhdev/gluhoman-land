import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { RoomForm } from '../../RoomForm';
import { createRoom } from '../../actions';

export default function NewRoomPage() {
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
          Новий номер
        </p>
        <h1 className="font-display text-3xl lg:text-4xl font-semibold text-[#1a3d2e] mt-1">
          Додати номер
        </h1>
        <div className="mt-2 h-1 w-16 bg-[#1a3d2e] rounded-full" />
      </div>

      <RoomForm action={createRoom} submitLabel="Створити номер" />
    </div>
  );
}
