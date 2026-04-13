# Admin Login Verification Report

Date: 2026-04-11
Scope: Read-only QA verification of the NextAuth v5 credentials-based
admin login flow for the Глухомань hospitality site.

## Environment

- Next.js 15.5.2 (webpack dev, no Turbopack in `npm run dev`)
- NextAuth v5 (beta) configured at `src/lib/auth.ts`,
  `src/app/api/auth/[...nextauth]/route.ts`, `middleware.ts`
- Database: `prisma/dev.db` (SQLite)
- Dev server: `http://localhost:3002`

## 1. Admin user in DB

Query via Prisma confirmed one existing user:

```json
[
  {
    "id": "cmnvwtf9r00hqoi3lfe3fzk1j",
    "email": "admin@gluhoman.local",
    "role": "admin",
    "createdAt": "2026-04-12T15:19:35.824Z"
  }
]
```

No need to run `scripts/seed-admin.mjs`. The previously seeded password
`admin123` is still valid (see login flow below).

## 2. Dev server smoke tests

| Route          | Status (no session)               |
| -------------- | --------------------------------- |
| `/`            | `200`                             |
| `/admin`       | `200` (middleware permits SSR shell; gating happens server-side) |
| `/admin/login` | `200`                             |

Note: middleware.ts is configured to redirect unauthenticated `/admin/*`
hits to `/admin/login`, but in this dev run `/admin` returned `200`
without a session. This does not block login, but see "Blockers" below.

## 3. NextAuth login flow (curl)

Using `admin@gluhoman.local` / `admin123`:

1. `GET /api/auth/csrf` -> `200`, returns csrfToken + csrf cookie.
2. `POST /api/auth/callback/credentials` (form-urlencoded with
   `email`, `password`, `csrfToken`, `callbackUrl=/admin`)
   -> `302 Location: http://localhost:3002/admin`, session cookie set.
3. `GET /api/auth/session` ->

   ```json
   {
     "user": {
       "name": "Admin",
       "email": "admin@gluhoman.local",
       "id": "cmnvwtf9r00hqoi3lfe3fzk1j",
       "role": "admin"
     },
     "expires": "2026-04-19T16:30:18.095Z"
   }
   ```

4. `GET /admin` with session cookie -> `200`.

All expected behavior. No error params appended to the redirect URL,
role is correctly propagated into the JWT/session.

## 4. Automated regression script

`scripts/test-admin-login.mjs` reproduces the full flow against a
running dev server. Configurable via env vars:

- `BASE_URL` (default `http://localhost:3002`)
- `ADMIN_EMAIL` (default `admin@gluhoman.local`)
- `ADMIN_PASSWORD` (default `admin123`)

Usage:

```bash
npm run dev -- --port 3002 &
node scripts/test-admin-login.mjs
```

Exit code `0` on success, `1` on any failed assertion.

## 5. Errors encountered during investigation

- First `npm run dev` attempts exploded with
  `ENOENT .next/routes-manifest.json` and webpack
  `Cannot read properties of undefined (reading 'call')`. Root cause:
  stale `.next` directory left over from a prior partial build.
  Fix: `rm -rf .next node_modules/.cache` before restarting dev.
- Next.js Image warnings about `quality="90"`/`"95"` not in
  `images.qualities` (Next 16 will require configuration). Not a
  login issue.

## 6. Blockers / recommendations for production

1. **Middleware gating for `/admin` is not actually redirecting
   unauthenticated requests.** `GET /admin` without a session returns
   `200` instead of `307 -> /admin/login`. Either `middleware.ts`
   matcher is not covering `/admin` exactly, or the admin layout is
   rendering without a server-side session guard. Before shipping,
   confirm `middleware.ts` `config.matcher` includes `/admin` and
   `/admin/:path*`, and/or add a server-side `auth()` check in
   `src/app/admin/layout.tsx` that redirects to `/admin/login` when
   no session is present. (Out of scope for this read-only task.)
2. **Default password `admin123` is weak.** Before production,
   rotate via `scripts/seed-admin.mjs` with a strong
   `ADMIN_PASSWORD`, or add a "change password" UI.
3. **`.env.local` must define `AUTH_SECRET` / `NEXTAUTH_SECRET`** in
   production; dev worked because a value is set locally. Verify it
   is set on Vercel before deployment.
4. **Image `qualities` config** will become required in Next.js 16 —
   unrelated to auth but worth a pre-deploy cleanup.

## 7. Summary

- Admin user present: yes (`admin@gluhoman.local`, role `admin`).
- Credentials login via NextAuth v5 callback endpoint: works.
- Session cookie grants access to `/admin`: yes (`200`).
- Only real concern is that `/admin` also returns `200` without a
  session; login works, but route protection should be tightened
  before production.
