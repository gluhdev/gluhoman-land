/**
 * Database seed for Phase 2.
 *
 * 1. Imports menu from src/data/menu.json into MenuCategory + MenuItem
 *    (idempotent: re-running updates existing entries by slug)
 * 2. Creates an admin user from ADMIN_EMAIL + ADMIN_PASSWORD env vars
 *    (or falls back to admin@gluhoman.local / admin123 in dev)
 *
 * Run with:
 *   npx tsx prisma/seed.ts
 *   OR
 *   npx prisma db seed
 */

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import path from 'path';
import { promises as fs } from 'fs';

const prisma = new PrismaClient();

interface MenuItemJson {
  id: string;
  name: string;
  description?: string;
  price: number;
  weight?: string;
  image?: string;
  tags?: string[];
}

interface MenuCategoryJson {
  id: string;
  name: string;
  icon?: string;
  items: MenuItemJson[];
}

interface MenuJson {
  categories: MenuCategoryJson[];
}

async function seedMenu() {
  const file = path.join(process.cwd(), 'src', 'data', 'menu.json');
  const raw = await fs.readFile(file, 'utf8');
  const data = JSON.parse(raw) as MenuJson;

  let catCount = 0;
  let itemCount = 0;

  for (let ci = 0; ci < data.categories.length; ci++) {
    const cat = data.categories[ci];

    const upserted = await prisma.menuCategory.upsert({
      where: { slug: cat.id },
      create: {
        slug: cat.id,
        name: cat.name,
        icon: cat.icon,
        order: ci,
        active: true,
      },
      update: {
        name: cat.name,
        icon: cat.icon,
        order: ci,
      },
    });
    catCount++;

    for (let ii = 0; ii < cat.items.length; ii++) {
      const item = cat.items[ii];
      await prisma.menuItem.upsert({
        where: { slug: item.id },
        create: {
          slug: item.id,
          name: item.name,
          description: item.description,
          price: item.price,
          weight: item.weight,
          image: item.image,
          order: ii,
          active: true,
          categoryId: upserted.id,
        },
        update: {
          name: item.name,
          description: item.description,
          price: item.price,
          weight: item.weight,
          image: item.image,
          order: ii,
          categoryId: upserted.id,
        },
      });
      itemCount++;
    }
  }

  console.log(`✔ Menu: ${catCount} categories, ${itemCount} items`);
}

async function seedHotelRooms() {
  const rooms = [
    {
      number: '101',
      type: 'standard',
      capacity: 2,
      pricePerNight: 1500,
      description: 'Затишний стандартний номер на 2 особи з краєвидом на сад. Двоспальне ліжко, ванна, кондиціонер, безкоштовний Wi-Fi.',
      images: JSON.stringify(['/images/9.jpg']),
    },
    {
      number: '102',
      type: 'standard',
      capacity: 2,
      pricePerNight: 1500,
      description: 'Стандартний номер з двома односпальними ліжками. Затишний інтер\'єр у природних тонах.',
      images: JSON.stringify(['/images/9.jpg']),
    },
    {
      number: '201',
      type: 'lux',
      capacity: 2,
      pricePerNight: 2800,
      description: 'Просторий люкс на 2 особи з міні-кухнею, велика кінг-сайз ліжко, балкон з виходом до зеленої зони.',
      images: JSON.stringify(['/images/otel_gluhoman_photo31.jpg']),
    },
    {
      number: '202',
      type: 'family',
      capacity: 4,
      pricePerNight: 3200,
      description: 'Сімейний номер на 4 особи: спальня з двоспальним ліжком + дитяча зона з 2 односпальними ліжками. Дитячий куточок із іграшками.',
      images: JSON.stringify(['/images/otel_gluhoman_photo31.jpg']),
    },
  ];

  for (const r of rooms) {
    await prisma.hotelRoom.upsert({
      where: { number: r.number },
      create: r,
      update: { type: r.type, capacity: r.capacity, pricePerNight: r.pricePerNight, description: r.description },
    });
  }
  console.log(`✔ Hotel rooms: ${rooms.length}`);
}

async function seedAquaparkTariffs() {
  const tariffs = [
    { name: 'Дорослий', price: 450, description: 'Повний день в аквапарку для дорослих (від 16 років)' },
    { name: 'Дитячий', price: 250, description: 'Дитячий квиток (4-15 років)' },
    { name: 'Сімейний', price: 1200, description: 'Сімейний пакет: 2 дорослих + 2 дитячих квитки' },
    { name: 'Старший', price: 350, description: 'Знижка для пенсіонерів (від 60 років)' },
  ];

  for (const t of tariffs) {
    const existing = await prisma.aquaparkTariff.findFirst({ where: { name: t.name } });
    if (existing) {
      await prisma.aquaparkTariff.update({
        where: { id: existing.id },
        data: { price: t.price, description: t.description },
      });
    } else {
      await prisma.aquaparkTariff.create({ data: t });
    }
  }
  console.log(`✔ Aquapark tariffs: ${tariffs.length}`);
}

async function seedAdmin() {
  const email = process.env.ADMIN_EMAIL || 'admin@gluhoman.local';
  const password = process.env.ADMIN_PASSWORD || 'admin123';
  const hash = await bcrypt.hash(password, 10);

  const user = await prisma.user.upsert({
    where: { email },
    create: { email, password: hash, name: 'Admin', role: 'admin' },
    update: { password: hash },
  });
  console.log(`✔ Admin user: ${user.email} (password: ${password})`);
}

async function main() {
  console.log('🌱 Seeding database…');
  await seedMenu();
  await seedHotelRooms();
  await seedAquaparkTariffs();
  await seedAdmin();
  console.log('✓ Done');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
