# Khilung Kalika Construction — MERN Website & Admin CMS

A production-shaped starter for a corporate construction company website with a custom
admin dashboard, built on the MERN stack (MongoDB, Express, React, Node).

This is a **working scaffold**, not the entire 100+ feature spec in one shot: the
architecture, auth, and data layer are fully wired end-to-end, and the **Projects**
module is built out completely (public listing/detail + admin CRUD) as the reference
pattern. Blog, Services, and Contact/Quote are wired on the backend and have working
public pages. Use the same pattern to flesh out Gallery, Team, Careers, and Inquiry
management screens in the admin dashboard as you grow it.

## What's included

**Backend (`/server`)**
- Express + Mongoose, ES modules
- JWT access + refresh tokens (httpOnly cookies), RBAC (`admin` / `editor`)
- Models: User, Project, Blog, Service, Testimonial, ContactMessage, Team, Career,
  Application, Partner, Settings
- Full CRUD + filtering/search/pagination for Projects, Blogs, Services
- Contact & quote-request endpoint with email notification (Nodemailer)
- Cloudinary + Multer file upload config
- Security: Helmet, CORS, rate limiting, mongo-sanitize, xss-clean
- Centralized error handling, express-validator input validation
- Seed script with 30 demo projects, 10 services, 12 testimonials, a default admin user

**Frontend (`/client`)**
- React 19 + Vite + React Router + TailwindCSS (construction color palette baked in)
- React Query for data fetching/caching, Axios with automatic token refresh
- Public pages: Home, About, Services, Projects (filter/search/pagination),
  Project Detail, Blog, Blog Detail, Gallery, Careers, Contact
- Framer Motion animations, animated stat counters, sticky navbar, WhatsApp button
- Admin: Login, protected routes, Dashboard, Projects management (full CRUD UI)

## Getting started

### 1. Backend

```bash
cd server
npm install
cp .env.example .env   # then fill in MongoDB URI, JWT secrets, Cloudinary, SMTP
npm run seed            # creates demo data + a default admin user
npm run dev              # starts on http://localhost:5000
```

Default admin login created by the seed script:
```
email:    admin@khilungkalika.com
password: ChangeMe123!
```
**Change this password immediately in a real deployment.**

### 2. Frontend

```bash
cd client
npm install
npm run dev    # starts on http://localhost:5173, proxies /api to :5000
```

Visit `http://localhost:5173` for the public site and
`http://localhost:5173/admin/login` for the dashboard.

### 3. MongoDB

Use a local MongoDB instance or a free MongoDB Atlas cluster — paste the connection
string into `server/.env` as `MONGO_URI`.

### 4. Cloudinary & Email (optional for local dev)

Project/blog image uploads and contact-form email notifications require Cloudinary
and SMTP credentials in `server/.env`. The app runs without them, but uploads and
outgoing email will fail until they're configured.

## Deployment

- **Frontend** → Vercel (set `VITE`-prefixed env vars if you externalize the API URL)
- **Backend** → Render (set all `server/.env` values as environment variables)
- **Database** → MongoDB Atlas
- **Media** → Cloudinary

## Extending the CMS

Each content type follows the same three-file pattern on the backend
(`model` → `controller` → `routes`) and the same two-file pattern on the frontend
(`service` function → `admin/*.jsx` management page, modeled on `ProjectsManage.jsx`).
To add Gallery management, for example: create a `Gallery` model, a controller with
CRUD handlers, a route file, wire it into `server.js`, then copy `ProjectsManage.jsx`
as a starting point for the admin UI.

## Notes on scope

The original spec described a very large feature set (30+ pages, full multilingual
support, Docker/CI-CD, PDF export, analytics dashboards, etc.). This scaffold gives
you a correctly-architected foundation with working authentication, a real data
model, and one fully-realized module end-to-end, so you can extend it feature-by-feature
without re-architecting later.
