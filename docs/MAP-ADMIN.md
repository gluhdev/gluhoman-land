# 🔐 Admin Panel & CMS

> The `/admin/*` area. **Not localized** (lives at `src/app/admin/`, no `[locale]`), UI in Ukrainian. See [MAP-OVERVIEW.md](MAP-OVERVIEW.md) for the index.

## Authentication & roles

- **Provider:** `next-auth` Credentials (email + password, bcrypt-hashed). Config in `src/lib/auth.ts`. Route at `src/app/api/auth/[...nextauth]/route.ts`. JWT session strategy.
- **Login/logout:** `src/app/admin/login/page.tsx` + `LoginForm.tsx`; `src/app/admin/logout/route.ts`.
- **Session shape** (`src/types/next-auth.d.ts`): `session.user` carries `id`, `role`, **`hotelSlug`**.
- **Roles:**
  - `role: "admin"` — used for super-admin.
  - `role: "manager"` — per-hotel manager.
  - **`hotelSlug`** is the access-scope key:
    - `null` → **super-admin**: sees all hotels, all bookings, staff management, rooms config.
    - `"aquapark" | "central" | "brewery" | "cottages"` → **scoped manager**: sees only their hotel's bookings/dashboard; super-admin-only nav items are hidden.
- **Hotel registry for admin UI:** `src/lib/admin-hotels.ts` — canonical hotel labels/filters used to scope and label admin views (`hotelLabel(slug)` etc.).

## Admin shell

- `src/app/admin/layout.tsx` — wraps admin pages; loads global styles/fonts (was missing once — fixed).
- `src/app/admin/AdminShell.tsx` — sidebar chrome. Renders a `NAV` array; items flagged `superAdminOnly` (Rooms, Staff) are filtered out for managers. `SECTION_LABEL` map drives breadcrumbs. The user block shows the hotel name for managers, "Головний адміністратор" for super-admins.

## Admin routes

| Path | URL | Purpose |
|------|-----|---------|
| `page.tsx` | `/admin` | Dashboard. Super-admin sees global stats; managers get a hotel-scoped `HotelAdminDashboard` (stats + quick actions) |
| `today/page.tsx` | `/admin/today` | "Today" operational view |
| `bookings/page.tsx` + `[id]/`, `actions.ts` | `/admin/bookings` | Legacy `Booking` records (all services). Hotel-scoped for managers; filter pills hidden for them. `StatusActions.tsx` changes status |
| `hotel/page.tsx` | `/admin/hotel` | Hotel CRM hub |
| `hotel/bookings/` (+ `new/`, `[id]/`, `[id]/edit/`) | `/admin/hotel/bookings` | `HotelBooking` CRM: list, create (`BookingForm.tsx`), view, edit, status (`BookingStatusActions.tsx`) |
| `hotel/calendar/page.tsx` | `/admin/hotel/calendar` | Booking calendar view |
| `hotel/rooms/` (+ `new/`, `[id]/`) | `/admin/hotel/rooms` | `HotelRoom` DB CRUD (`RoomForm.tsx`) — the structured room records |
| `rooms/page.tsx` + `RoomsManager.tsx`, `actions.ts` | `/admin/rooms` | **Newer** per-category room config: edit price tiers + inventory count + on-request toggle. Persists to **SiteContent** overrides (super-admin only) |
| `staff/page.tsx` + `StaffManager.tsx`, `actions.ts` | `/admin/staff` | Staff CRUD with hotel assignment. **Super-admin only** (gated; access-denied UI otherwise) |
| `menu/` (+ `categories/`, `items/`, `actions.ts`) | `/admin/menu` | Restaurant menu CRUD (`CategoryForm.tsx`, `ItemForm.tsx`) → `MenuCategory`/`MenuItem` |
| `orders/` (+ `new/`, `[id]/`) | `/admin/orders` | Restaurant orders; manual order entry (`ManualOrderForm.tsx`); `StatusActions.tsx` |
| `aquapark/` (+ `tariffs/`, `tickets/`, `scan/`, `actions.ts`) | `/admin/aquapark` | Tariff CRUD (`TariffForm.tsx`), ticket list/detail (`TicketQrDisplay`, `TicketStatusActions`), and **QR scanner** (`scan/ScannerClient.tsx`) |
| `sauna/` (+ `slots/`) | `/admin/sauna` | Sauna slot management; `slots/[id]/SaunaSlotStatusActions.tsx` |
| `content/` (+ `[page]/`) | `/admin/content` | **SiteContent CMS editor** — pick a page, edit its text/image fields (`ContentEditor.tsx`) |
| `exports/page.tsx` | `/admin/exports` | CSV exports (orders, hotel bookings, aquapark tickets, sauna slots) |
| `telegram/page.tsx` + `SetupClient.tsx` | `/admin/telegram` | Telegram bot webhook setup/info |

## Server actions pattern

Admin mutations use `'use server'` action files (`src/app/admin/*/actions.ts`): call Prisma, then `revalidatePath()`. Examples:
- `rooms/actions.ts` → `saveRoomConfig()` — writes price tiers + count to SiteContent in a transaction.
- `staff/actions.ts` → staff CRUD, gated to super-admin, bcrypt for passwords.
- `menu/actions.ts`, `aquapark/actions.ts`, `hotel/actions.ts`, `bookings/actions.ts` — domain CRUD.

Some flows go through **API routes** instead of actions (notably content saves and uploads — see below).

## SiteContent CMS

The CMS is a key/value store letting non-developers edit copy and images on the live site.

- **Model:** `SiteContent { key (unique), type, value (JSON string), updatedAt, updatedBy }`. `type` ∈ text | richtext | image | number | url.
- **Convention:** dotted-path keys, e.g. `home.hero.title`, `hotel.aquapark.lux-balcony.price`, and room overrides `room.<hotel>.<slug>.tiers` / `room.<hotel>.<slug>.count`. Values are JSON-encoded (SQLite has no native JSON).
- **Read side (lib):** `src/lib/site-content.ts` (queries + key resolution), `src/lib/content-schema.ts` (field/validator definitions for the editor UI).
- **Save side (API, not actions):** `src/app/api/admin/content/route.ts` (fetch + JSON.stringify) and `src/app/api/admin/upload/route.ts` (image upload via `react-dropzone` → `ImageUploader.tsx`).
- **On the live site:** `src/components/content/EditableText.tsx` + `EditableImage.tsx` render the stored value to visitors and become inline-editable for authenticated admins.

> Room price/inventory overrides edited in `/admin/rooms` flow into the public booking system via `src/lib/room-config.ts` → `getRoomPriceOverrides()` / `resolvedInventory()` → `checkAvailability()` and `BookingDialog`. See [MAP-DATA.md](MAP-DATA.md#hotel--room-domain).

## Admin API routes (`src/app/api/admin/`)

`content/`, `upload/`, `aquapark/scan/`, `aquapark/tickets/[id]/status/`, `hotel/bookings/[id]/` (+ `status/`, `manual/`), `orders/[id]/status/` (+ `manual/`), `sauna/slots/[id]/status/`, `telegram/info/` + `set-webhook/`, and CSV `export/{orders,hotel-bookings,aquapark-tickets,sauna-slots}/` (built via `src/lib/csv.ts`, UTF-8 BOM + semicolons for Excel UA).
