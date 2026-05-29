import { ShieldAlert } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { ADMIN_HOTELS } from '@/lib/admin-hotels';
import { StaffManager } from './StaffManager';

export const dynamic = 'force-dynamic';

export default async function AdminStaffPage() {
  const session = await auth();
  const isSuperAdmin = !!session?.user && !session.user.hotelSlug;

  if (!isSuperAdmin) {
    return (
      <div className="p-6 lg:p-10">
        <div className="max-w-lg bg-white border border-[#1a3d2e]/10 px-8 py-12 text-center">
          <ShieldAlert className="h-8 w-8 text-[#c9a95c] mx-auto" />
          <h1 className="font-display text-2xl text-[#1a3d2e] mt-4">
            Доступ обмежено
          </h1>
          <p className="mt-3 text-sm text-[#1a3d2e]/70 leading-relaxed">
            Керування адміністраторами доступне лише головному адміністратору.
          </p>
        </div>
      </div>
    );
  }

  const users = await prisma.user.findMany({
    orderBy: [{ hotelSlug: 'asc' }, { createdAt: 'asc' }],
    select: {
      id: true,
      email: true,
      name: true,
      hotelSlug: true,
      createdAt: true,
    },
  });

  return (
    <StaffManager
      users={users.map((u) => ({
        id: u.id,
        email: u.email,
        name: u.name,
        hotelSlug: u.hotelSlug,
        createdAt: u.createdAt.toISOString(),
      }))}
      currentUserId={session.user.id}
      hotels={ADMIN_HOTELS}
    />
  );
}
