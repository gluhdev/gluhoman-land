#!/usr/bin/env node
// Seeds realistic demo data for admin panel QA.
// Safe to re-run: clears only tables it seeds, preserves menu/hotel/tariffs/users.
// Flags: --preserve  Skip deletion of existing rows.

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const PRESERVE = process.argv.includes("--preserve");

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------
const GUESTS = [
  { name: "Ірина Коваленко", phone: "+380501112233" },
  { name: "Олексій Петренко", phone: "+380672345678" },
  { name: "Марія Шевченко", phone: "+380931234567" },
  { name: "Богдан Мельник", phone: "+380663456789" },
  { name: "Наталія Бондаренко", phone: "+380504567890" },
  { name: "Тарас Кравченко", phone: "+380675678901" },
  { name: "Олена Ткаченко", phone: "+380936789012" },
  { name: "Андрій Савченко", phone: "+380667890123" },
  { name: "Юлія Поліщук", phone: "+380508901234" },
  { name: "Віктор Лисенко", phone: "+380679012345" },
  { name: "Катерина Гончар", phone: "+380930123456" },
  { name: "Сергій Руденко", phone: "+380661234500" },
  { name: "Людмила Марченко", phone: "+380502345611" },
  { name: "Роман Павленко", phone: "+380673456722" },
  { name: "Оксана Захарчук", phone: "+380934567833" },
];

const SERVICES = ["HOTEL", "AQUAPARK", "RESTAURANT", "SAUNA"];
const BOOKING_STATUSES = ["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"];
const ORDER_STATUSES = [
  "PENDING",
  "PAID",
  "CONFIRMED",
  "PREPARING",
  "DELIVERING",
  "COMPLETED",
  "CANCELLED",
];
const HOTEL_BOOKING_STATUSES = [
  "pending",
  "paid",
  "confirmed",
  "completed",
  "cancelled",
];
const TICKET_STATUSES = ["pending", "paid", "confirmed", "completed", "cancelled"];
const SLOT_STATUSES = ["reserved", "paid", "completed", "cancelled"];
const COMMENTS = [
  "Два дитячі стільчики",
  "День народження",
  "Алергія на глютен",
  "Підготувати квіти",
  "Прохання тихий номер",
  "Вегетаріанське меню",
  null,
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const rand = (n) => Math.floor(Math.random() * n);
const pick = (arr) => arr[rand(arr.length)];

function randomDate(minDaysOffset, maxDaysOffset) {
  const days = rand(maxDaysOffset - minDaysOffset + 1) + minDaysOffset;
  const d = new Date();
  d.setDate(d.getDate() + days);
  d.setHours(9 + rand(12), pick([0, 15, 30, 45]), 0, 0);
  return d;
}

function emailFrom(name) {
  const first = name.split(" ")[0].toLowerCase();
  // transliterate common Ukrainian letters
  const map = {
    а: "a", б: "b", в: "v", г: "h", ґ: "g", д: "d", е: "e", є: "ie",
    ж: "zh", з: "z", и: "y", і: "i", ї: "i", й: "i", к: "k", л: "l",
    м: "m", н: "n", о: "o", п: "p", р: "r", с: "s", т: "t", у: "u",
    ф: "f", х: "kh", ц: "ts", ч: "ch", ш: "sh", щ: "shch", ь: "",
    ю: "iu", я: "ia",
  };
  const t = first
    .split("")
    .map((c) => map[c] ?? c)
    .join("");
  return `${t}@example.com`;
}

// ---------------------------------------------------------------------------
// Clear
// ---------------------------------------------------------------------------
async function clearTargets() {
  if (PRESERVE) {
    console.log("--preserve passed, skipping deletion");
    return;
  }
  console.log("Clearing target tables...");
  // Delete payments first where they point to target rows (polymorphic FKs).
  await prisma.payment.deleteMany({
    where: {
      OR: [
        { orderId: { not: null } },
        { hotelBookingId: { not: null } },
        { aquaparkTicketId: { not: null } },
        { saunaSlotId: { not: null } },
      ],
    },
  });
  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.aquaparkTicketItem.deleteMany({});
  await prisma.aquaparkTicket.deleteMany({});
  await prisma.hotelBooking.deleteMany({});
  await prisma.saunaSlot.deleteMany({});
  await prisma.booking.deleteMany({});
  console.log("  ✓ cleared");
}

// ---------------------------------------------------------------------------
// Seeders
// ---------------------------------------------------------------------------
async function seedBookings() {
  console.log("Seeding Bookings...");
  let count = 0;
  for (let i = 0; i < 20; i++) {
    const guest = pick(GUESTS);
    const service = pick(SERVICES);
    const status = pick(BOOKING_STATUSES);
    const dateFrom = randomDate(-60, 30);
    const isHotel = service === "HOTEL";
    const isRestaurant = service === "RESTAURANT";
    await prisma.booking.create({
      data: {
        service,
        status,
        name: guest.name,
        phone: guest.phone,
        email: Math.random() > 0.3 ? emailFrom(guest.name) : null,
        guests: rand(6) + 1,
        dateFrom,
        dateTo: isHotel
          ? new Date(dateFrom.getTime() + (rand(4) + 1) * 86400000)
          : null,
        time: isRestaurant
          ? `${18 + rand(4)}:${Math.random() > 0.5 ? "00" : "30"}`
          : null,
        comment: pick(COMMENTS),
        telegramStatus: Math.random() > 0.2 ? "SENT" : "PENDING",
        emailStatus: Math.random() > 0.3 ? "SENT" : "PENDING",
      },
    });
    count++;
  }
  console.log(`  ✓ ${count} bookings`);
}

async function seedOrders() {
  console.log("Seeding Orders...");
  const items = await prisma.menuItem.findMany({ take: 80 });
  if (items.length === 0) {
    console.log("  ! No menu items — skipping Orders");
    return;
  }
  let count = 0;
  for (let i = 0; i < 15; i++) {
    const guest = pick(GUESTS);
    const deliveryType = Math.random() > 0.4 ? "delivery" : "pickup";
    const deliveryFee = deliveryType === "delivery" ? 150 : 0;
    const lineCount = rand(4) + 2; // 2..5
    const chosen = [];
    const usedIds = new Set();
    while (chosen.length < lineCount) {
      const m = pick(items);
      if (usedIds.has(m.id)) continue;
      usedIds.add(m.id);
      chosen.push({
        menuItemId: m.id,
        name: m.name,
        price: m.price,
        quantity: rand(3) + 1,
      });
    }
    const subtotal = chosen.reduce((s, it) => s + it.price * it.quantity, 0);
    const total = subtotal + deliveryFee;
    const status = pick(ORDER_STATUSES);
    const paymentStatus =
      status === "PAID" || status === "COMPLETED" || status === "DELIVERING"
        ? "paid"
        : status === "CANCELLED"
        ? "failed"
        : "pending";
    await prisma.order.create({
      data: {
        number: 1000 + i + 1,
        status,
        paymentStatus,
        customerName: guest.name,
        customerPhone: guest.phone,
        deliveryType,
        address:
          deliveryType === "delivery"
            ? `м. Полтава, вул. ${pick(["Соборна", "Європейська", "Шевченка", "Миру"])}, ${rand(120) + 1}`
            : null,
        scheduledAt: Math.random() > 0.5 ? randomDate(-10, 10) : null,
        comment: pick(COMMENTS),
        subtotal,
        deliveryFee,
        total,
        items: { create: chosen },
        createdAt: randomDate(-30, 0),
      },
    });
    count++;
  }
  console.log(`  ✓ ${count} orders`);
}

async function seedHotelBookings() {
  console.log("Seeding HotelBookings...");
  const rooms = await prisma.hotelRoom.findMany();
  if (rooms.length === 0) {
    console.log("  ! No hotel rooms — skipping");
    return;
  }
  let count = 0;
  for (let i = 0; i < 10; i++) {
    const room = pick(rooms);
    const guest = pick(GUESTS);
    const checkIn = randomDate(-45, 25);
    const nights = rand(5) + 1;
    const checkOut = new Date(checkIn.getTime() + nights * 86400000);
    const total = room.pricePerNight * nights;
    const status = pick(HOTEL_BOOKING_STATUSES);
    await prisma.hotelBooking.create({
      data: {
        number: 2000 + i + 1,
        roomId: room.id,
        customerName: guest.name,
        customerPhone: guest.phone,
        customerEmail: Math.random() > 0.3 ? emailFrom(guest.name) : null,
        checkIn,
        checkOut,
        guests: Math.min(room.capacity, rand(room.capacity) + 1),
        total,
        status,
        paymentStatus:
          status === "paid" || status === "confirmed" || status === "completed"
            ? "paid"
            : "pending",
        comment: pick(COMMENTS),
      },
    });
    count++;
  }
  console.log(`  ✓ ${count} hotel bookings`);
}

async function seedAquaparkTickets() {
  console.log("Seeding AquaparkTickets...");
  const tariffs = await prisma.aquaparkTariff.findMany();
  if (tariffs.length === 0) {
    console.log("  ! No aquapark tariffs — skipping");
    return;
  }
  let count = 0;
  for (let i = 0; i < 12; i++) {
    const guest = pick(GUESTS);
    const lineCount = rand(2) + 1; // 1..2
    const lines = [];
    const used = new Set();
    while (lines.length < lineCount) {
      const t = pick(tariffs);
      if (used.has(t.id)) continue;
      used.add(t.id);
      lines.push({
        tariffId: t.id,
        name: t.name,
        price: t.price,
        quantity: rand(4) + 1,
      });
    }
    const total = lines.reduce((s, l) => s + l.price * l.quantity, 0);
    const status = pick(TICKET_STATUSES);
    await prisma.aquaparkTicket.create({
      data: {
        number: 3000 + i + 1,
        date: randomDate(-30, 30),
        customerName: guest.name,
        customerPhone: guest.phone,
        customerEmail: Math.random() > 0.3 ? emailFrom(guest.name) : null,
        total,
        status,
        paymentStatus: status === "paid" || status === "completed" ? "paid" : "pending",
        qrCode: `GLU-AQ-${3000 + i + 1}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
        items: { create: lines },
      },
    });
    count++;
  }
  console.log(`  ✓ ${count} aquapark tickets`);
}

async function seedSaunaSlots() {
  console.log("Seeding SaunaSlots...");
  const TIME_RANGES = [
    ["10:00", "13:00"],
    ["13:00", "16:00"],
    ["16:00", "19:00"],
    ["19:00", "22:00"],
  ];
  const SAUNA_TYPES = ["small", "big"];
  const created = new Set();
  let count = 0;
  let attempts = 0;
  while (count < 8 && attempts < 50) {
    attempts++;
    const guest = pick(GUESTS);
    const [startTime, endTime] = pick(TIME_RANGES);
    const saunaType = pick(SAUNA_TYPES);
    const d = randomDate(-20, 20);
    d.setHours(0, 0, 0, 0);
    const key = `${d.toISOString()}|${startTime}|${saunaType}`;
    if (created.has(key)) continue;
    created.add(key);
    const total = 600 + rand(13) * 50; // 600..1200
    const status = pick(SLOT_STATUSES);
    try {
      await prisma.saunaSlot.create({
        data: {
          number: 4000 + count + 1,
          date: d,
          startTime,
          endTime,
          saunaType,
          customerName: guest.name,
          customerPhone: guest.phone,
          customerEmail: Math.random() > 0.4 ? emailFrom(guest.name) : null,
          status,
          paymentStatus: status === "paid" || status === "completed" ? "paid" : "pending",
          total,
          comment: pick(COMMENTS),
        },
      });
      count++;
    } catch (e) {
      if (!String(e.message).includes("Unique constraint")) throw e;
    }
  }
  console.log(`  ✓ ${count} sauna slots`);
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
  console.log("\n=== Demo data seed ===\n");
  await clearTargets();
  await seedBookings();
  await seedOrders();
  await seedHotelBookings();
  await seedAquaparkTickets();
  await seedSaunaSlots();
  console.log("\n✓ Demo seed complete\n");
}

main()
  .catch((e) => {
    console.error("✗ Seed failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
