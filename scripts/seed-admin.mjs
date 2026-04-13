/**
 * scripts/seed-admin.mjs
 *
 * Seeds the first admin User for the Глухомань CRM.
 *
 * Usage:
 *   DATABASE_URL="file:./prisma/dev.db" \
 *   ADMIN_EMAIL=admin@gluhoman.com.ua \
 *   ADMIN_PASSWORD=your-strong-password \
 *   node scripts/seed-admin.mjs
 *
 * If ADMIN_PASSWORD is not provided, a random 16-character password is generated
 * and printed to stdout — SAVE IT, it will not be shown again.
 * If a user with ADMIN_EMAIL already exists, the script exits without changes.
 */
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { randomBytes } from 'node:crypto';

const prisma = new PrismaClient();

function generatePassword(length = 16) {
  const alphabet =
    'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%^&*';
  const bytes = randomBytes(length);
  let out = '';
  for (let i = 0; i < length; i++) {
    out += alphabet[bytes[i] % alphabet.length];
  }
  return out;
}

async function main() {
  const email = process.env.ADMIN_EMAIL ?? 'admin@gluhoman.com.ua';
  const plainPassword = process.env.ADMIN_PASSWORD ?? generatePassword(16);
  const generated = !process.env.ADMIN_PASSWORD;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    console.warn(`[seed-admin] User ${email} already exists — skipping.`);
    process.exit(0);
  }

  const hash = await bcrypt.hash(plainPassword, 10);
  const user = await prisma.user.create({
    data: {
      email,
      password: hash,
      name: 'Адміністратор',
      role: 'admin',
    },
  });

  console.log('[seed-admin] Admin user created:');
  console.log(`  id:       ${user.id}`);
  console.log(`  email:    ${user.email}`);
  console.log(`  role:     ${user.role}`);
  console.log(`  password: ${plainPassword}`);
  if (generated) {
    console.log(
      '[seed-admin] Password was auto-generated. Save it now — it will NOT be shown again.'
    );
  }
}

main()
  .catch((err) => {
    console.error('[seed-admin] Failed:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
