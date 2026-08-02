# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A MERN-stack corporate site + admin CMS for a construction company. It is a **working
scaffold, not a finished product**: auth, data layer, and the full request pipeline are
wired end-to-end, and **Projects** (public listing/detail + admin CRUD) is the one
fully-realized module meant as the reference pattern. Blog, Services, and Contact/Quote
have working backend + public pages but no admin management UI yet. Gallery, Team,
Careers, and Inquiry management screens don't exist yet — see "Extending the CMS" below.

## Commands

Backend (`server/`):
```bash
cd server
npm install
cp .env.example .env   # fill in MONGO_URI, JWT secrets, Cloudinary, SMTP
npm run seed            # wipes and reseeds: 30 demo projects, 10 services, 12 testimonials, default admin
npm run dev              # nodemon, reads PORT from .env (falls back to 5001)
npm start                # production start, no reload
```

Frontend (`client/`):
```bash
cd client
npm install
npm run dev       # Vite dev server on :5173, proxies /api/* to VITE_API_TARGET (default http://localhost:5001)
npm run build     # production build to client/dist
npm run preview   # serve the production build locally
npm run lint      # eslint .
```

There is no test suite configured in either package (no `test` script, no test runner
dependency) and no CI config in this repo. Don't invent test commands.

Default seeded admin login (from `npm run seed`): `admin@khilungkalika.com` /
`ChangeMe123!`. There is also a **hardcoded fallback admin login** in
`server/controllers/authController.js` (`isFallbackAdminLogin`) that authenticates with
the same credentials (overridable via `FALLBACK_ADMIN_EMAIL`/`FALLBACK_ADMIN_PASSWORD`)
even if the database lookup fails or no user exists — this is what lets `/admin/login`
work before MongoDB is configured. Keep this in mind when touching login/auth: there are
two independent success paths, not one.

**Port note:** `server/.env.example` sets `PORT=5000` and the README says the API runs
on :5000, but `server.js`'s in-code fallback and `client/vite.config.js`'s proxy target
both default to **5001**. If `server/.env` doesn't explicitly set `PORT`, the frontend
proxy will still find the backend at 5001; don't "fix" this mismatch without checking
which value the running `.env` actually has.

## Architecture

### Backend (`server/`) — layered Express/Mongoose, ES modules

Request flow: `server.js` → route file (`routes/*Routes.js`) → middleware chain
(`protect`/`authorize` from `middleware/auth.js`, `upload` from `middleware/upload.js`,
`validate.js` for express-validator) → controller (`controllers/*Controller.js`) →
Mongoose model (`models/*.js`). Errors thrown in controllers (via `res.status(x); throw
new Error(...)`, wrapped in `express-async-handler`) fall through to the centralized
`errorHandler` in `middleware/errorHandler.js`, which maps Mongoose CastError/duplicate
key/ValidationError to appropriate HTTP codes and a `{ success, message }` shape.

Every JSON response follows `{ success: boolean, data?, message?, ... }`; paginated list
endpoints add `count`, `total`, `page`, `pages` (see `getProjects` in
`controllers/projectController.js` for the canonical filter/search/sort/pagination
pattern — status/category/exact-match filters, regex for text fields, `$text` search,
`page`/`limit` clamped to a max of 50).

**Auth**: JWT access token (short-lived, `JWT_EXPIRE`) + refresh token (long-lived,
`JWT_REFRESH_EXPIRE`), both set as httpOnly cookies by `setAuthCookies` in
`utils/generateToken.js` and also returned in the JSON body for header-based auth.
Refresh tokens are stored per-user in `User.refreshTokens[]` (Mongo-backed revocation) —
`POST /auth/refresh` rotates the token (removes old, pushes new) and `logout` pulls it.
`protect` middleware reads the token from `Authorization: Bearer` or the `accessToken`
cookie; `authorize(...roles)` gates by `req.user.role` (`admin` | `editor`).

**File uploads**: `middleware/upload.js` (Multer + `multer-storage-cloudinary`) handles
multi-field uploads (thumbnail/gallery/videos/documents per project — see
`routes/projectRoutes.js`) straight to Cloudinary (`config/cloudinary.js`).

**Security middleware order in `server.js`** (helmet → cors → body parsers → cookieParser
→ mongoSanitize → xss-clean → morgan → rate limiter) matters — the rate limiter
(`express-rate-limit`, 300 req/15min) explicitly skips auth endpoints
(`/auth/login`, `/auth/refresh`, `/auth/forgot-password`, `/auth/reset-password`) so
retries during token refresh don't get throttled.

**Models** (`server/models/`): User, Project, Blog, Service, Testimonial,
ContactMessage, Team, Career, Application, Partner, Settings. Only Project, Blog,
Service, and ContactMessage currently have controllers/routes wired into `server.js`.

### Frontend (`client/src/`) — React 19 + Vite + React Router + TailwindCSS

- `services/api.js` — single Axios instance (`withCredentials: true`) with a request
  interceptor that attaches an in-memory access token, and a response interceptor that,
  on a 401 (excluding `/auth/refresh` itself), transparently calls `/auth/refresh` once
  and retries the original request. `contexts/AuthContext.jsx` +
  `hooks/useAuth.js` drive login state from this.
- `services/*Service.js` — one file per resource, thin wrappers around `api` calls
  (see `projectService.js` as the pattern for a new resource's service layer).
- `layouts/MainLayout.jsx` (public site: Navbar/Footer/WhatsAppButton chrome) vs
  `layouts/AdminLayout.jsx` (dashboard chrome) — routed in `App.jsx`.
- `components/ProtectedRoute.jsx` gates admin routes on `AuthContext` state.
- `pages/admin/*` are full CRUD management screens; only `ProjectsManage.jsx` exists
  today — it is the template to copy for new resources' admin screens.
- React Query is used for server-state fetching/caching/mutations on top of the
  `services/*` functions (not raw `useEffect` + `fetch`).
- Tailwind tokens (`client/tailwind.config.js`) encode the brand palette sampled from
  the logo: `navy` (skyline), `teal` (hands), `gold` (disc), `stone`/`paper`
  (warm off-white backgrounds), plus legacy `primary`/`secondary`/`surface` aliases
  kept specifically so the admin dashboard (intentionally a plain utilitarian panel,
  not styled like the editorial public site) doesn't need a second token system.
  Prefer the semantic names (`navy`, `teal`, `gold`, `stone`) for new public-site work.

### Extending the CMS (established pattern — follow it for new resources)

Backend: **model → controller → routes**, then wire the route into `server.js`.
Frontend: **`services/<name>Service.js` → `pages/admin/<Name>Manage.jsx`**, modeled
directly on `ProjectsManage.jsx` + `projectService.js`. Public-facing list/detail pages
follow the `pages/Projects.jsx` / `pages/ProjectDetail.jsx` pattern.

Models for Gallery/Team/Careers/Inquiry management already exist or partially exist
(`Team.js`, `Career.js`, `Partner.js`) but have no controller/routes/admin UI yet —
this is the main direction the scaffold is meant to grow in.
