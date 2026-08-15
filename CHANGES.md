# Kandela Cars — Security Hardening Changelog

Scope: harden the existing Express + JSON-file stack in place. No hosting/architecture
migration was done — see the full 17-section spec doc for the deferred managed-cloud phase
(Postgres/Firebase-Supabase/CDN/separate domains/MFA/phone OTP), which needs a hosting
decision before it makes sense to build.

## Critical fixes

- **Removed hardcoded JWT secret fallback** (`server/security.ts`). Production now fails to
  boot without a real `JWT_SECRET` (32+ chars); dev gets an ephemeral one with a warning.
- **Removed hardcoded default admin password** (`kandela2026!`, previously shown in plaintext
  on the login screen with a "fill demo credentials" button). First boot now generates a
  random one-time password (printed once to the console) and forces a change, or honors
  `ADMIN_INITIAL_PASSWORD` from `.env`.
- **Split the admin app into its own bundle.** `admin.html` + `src/AdminApp.tsx` +
  `src/admin-main.tsx` are a separate Vite entry from the public site (`index.html` +
  `src/App.tsx`). Confirmed in the production build: `main-*.js` (public) and `admin-*.js`
  (admin) are separate files; the server routes `/admin*` to the admin bundle and everything
  else to the public one.
- **Session token moved from `localStorage` to an HttpOnly cookie** (`server/security.ts`,
  `src/services/api.ts`), `Secure` in production, `SameSite=Strict`. Added double-submit CSRF
  protection (a separate JS-readable cookie echoed back as an `x-csrf-token` header) on every
  state-changing admin request.

## Also added

- **RBAC scaffolding**: `super_admin/admin/editor/viewer` roles exist on the admin record;
  every admin route is tagged with `requireRole(...)` even though only one role is in use
  today. Adding real staff accounts later is a data change, not a route rewrite.
- **Rate limiting** (`express-rate-limit`): login (10/15min), general API (120/min), uploads
  (40/15min), inquiries (8/15min).
- **Login lockout**: 5 consecutive failures locks the account for 15 minutes.
- **CORS allowlist** via `ALLOWED_PUBLIC_ORIGIN` / `ALLOWED_ADMIN_ORIGIN` env vars (empty by
  default = same-origin only).
- **Security headers** via `helmet` (CSP intentionally left off for now — see Known
  Limitations).
- **Server-side validation with `zod`** (`server/validation.ts`) on login, vehicle
  create/update, and inquiry submission. Unknown fields are stripped so a client can't smuggle
  in `id`, `createdAt`, etc.
- **Upload hardening**: files are sniffed by actual byte signature (`file-type` package), not
  just the browser-supplied MIME type; restricted to JPEG/PNG/WebP; saved under
  `crypto.randomUUID()` names instead of the original filename.
- **Audit log** (`server/db.ts` `auditLog` array, `/api/admin/audit-logs`, `super_admin` only):
  records login/logout, vehicle create/update/delete, uploads, message status changes/deletes.
  Actor, action, target, timestamp — never passwords/tokens.
- `.env.example` rewritten to reflect what the server actually needs (dropped the leftover AI
  Studio `GEMINI_API_KEY`/`APP_URL`).
- `data/` and `uploads/` added to `.gitignore` — the JSON "database" (which holds the admin
  password hash) and uploaded photos should never be committed.

## Known limitations / next steps

- **Still a JSON file, not a real database.** Fine for one admin and moderate traffic, but no
  transactions, no concurrent-write safety, no indexing. Migrate to Postgres when you're ready
  for the managed-cloud phase.
- **No MFA, no Google login, no phone OTP.** These need a managed auth provider
  (Firebase/Supabase) — deferred pending the hosting decision.
- **CSP is disabled in `helmet()`.** Needs a real content-security-policy pass once the
  production asset pipeline (and any CDN) is finalized; right now it would break Google Fonts
  and Vite's dev-mode inline scripts if turned on carelessly.
- **No image EXIF stripping.** Stripping EXIF (GPS data, etc.) needs an image-processing
  library like `sharp`, which has native binaries — worth adding, but wanted to flag it rather
  than silently skip it.
- **Single admin account, no user management UI.** The role system exists in the schema but
  there's no "invite a teammate" flow yet.
- **No backups, monitoring, or health-check endpoint yet.**

## How to run it

```bash
npm install
cp .env.example .env
# Fill in JWT_SECRET (see the comment in .env.example for how to generate one)
npm run dev        # dev server on :3000, both index.html and admin.html served
npm run build       # production build — verify dist/assets has separate main-*.js and admin-*.js
npm start            # NODE_ENV=production node dist/server.cjs
```

On first run, watch the console for the generated admin password if you didn't set
`ADMIN_INITIAL_PASSWORD`. You'll be forced to change it (`mustChangePassword: true` is in the
`/api/admin/me` response, but there's no UI prompt wired up for it yet — that's a small
follow-up: gate the dashboard on that flag and show a change-password form).
