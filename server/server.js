import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize";
import xss from "xss-clean";

import connectDB from "./config/db.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";

import authRoutes from "./routes/authRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import blogRoutes from "./routes/blogRoutes.js";
import serviceRoutes from "./routes/serviceRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import settingsRoutes from "./routes/settingsRoutes.js";
import careerRoutes from "./routes/careerRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js";
import testimonialRoutes from "./routes/testimonialRoutes.js";
import galleryRoutes from "./routes/galleryRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import teamRoutes from "./routes/teamRoutes.js";
import visitRoutes from "./routes/visitRoutes.js";
import seoRoutes from "./routes/seoRoutes.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const clientDistPath = path.join(__dirname, "../client/dist");

dotenv.config();
connectDB();

const app = express();

// Security & parsing middleware
app.use(
  helmet({
    contentSecurityPolicy: {
      // Extend (not replace) helmet's defaults so images served from Cloudinary
      // and any admin-pasted external image URL still render once this server
      // starts serving the built frontend itself (default img-src is 'self' data:).
      directives: {
        ...helmet.contentSecurityPolicy.getDefaultDirectives(),
        "img-src": ["'self'", "data:", "https:"],
        // Google Analytics (gtag.js) — only the *.googletagmanager.com script
        // itself needs allowing here; the gtag() bootstrap call runs from the
        // app's own bundled JS (see components/GoogleAnalytics.jsx), not an
        // inline <script>, so this doesn't need 'unsafe-inline'.
        "script-src": ["'self'", "https://www.googletagmanager.com"],
        "connect-src": ["'self'", "https://www.google-analytics.com", "https://www.googletagmanager.com", "https://region1.google-analytics.com"],
      },
    },
  })
);
// CLIENT_URL may be a single origin or a comma-separated list (useful while
// running multiple frontend deployments against the same backend). On top of
// that explicit list, any *.vercel.app or *.onrender.com origin is trusted
// automatically — Vercel/Render both mint a fresh subdomain on many deploys,
// so pinning to one exact URL in CLIENT_URL breaks again on the next deploy.
// This is safe here: the admin panel still requires real login credentials,
// this only controls which sites are allowed to *attempt* API calls at all.
const allowedOrigins = (process.env.CLIENT_URL || "http://localhost:5173")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);
const trustedHostSuffixes = [".vercel.app", ".onrender.com"];

app.use(
  cors({
    origin: (origin, callback) => {
      // No Origin header (curl, server-to-server, same-origin) — allow.
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      try {
        const { hostname } = new URL(origin);
        if (trustedHostSuffixes.some((suffix) => hostname.endsWith(suffix))) {
          return callback(null, true);
        }
      } catch {
        // Malformed Origin header — fall through to rejection below.
      }
      callback(new Error(`CORS: origin ${origin} not allowed`));
    },
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(mongoSanitize());
app.use(xss());
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    const authPaths = ["/auth/login", "/auth/refresh", "/auth/forgot-password", "/auth/reset-password"];
    return authPaths.includes(req.path);
  },
});
app.use("/api", limiter);

// Locally-stored dev uploads (see middleware/upload.js) — production writes
// straight to Cloudinary instead and never populates this directory.
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Health check
app.get("/api/health", (req, res) => res.json({ success: true, message: "API is running" }));
// Dev-only — in production this same server also serves the built React app
// (see the static block below), so "/" must fall through to that instead of
// this plain-text handler intercepting it first.
if (process.env.NODE_ENV !== "production") {
  app.get("/", (req, res) => {
    res.send("Server is running 🚀");
  });
}

// SEO — sitemap.xml / robots.txt, at the root (not under /api) and ahead of
// the production SPA catch-all so a crawler gets real XML/text, not index.html.
app.use(seoRoutes);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/careers", careerRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/testimonials", testimonialRoutes);
app.use("/api/gallery", galleryRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/team", teamRoutes);
app.use("/api/visits", visitRoutes);

// Serve the built React app in production so the frontend and API share one
// origin/deployment (no CORS or dev-proxy config needed). In local dev the
// frontend instead runs on its own Vite server (see client/vite.config.js).
if (process.env.NODE_ENV === "production") {
  app.use(express.static(clientDistPath));
  app.get(/^(?!\/api).*/, (req, res) => {
    res.sendFile(path.join(clientDistPath, "index.html"));
  });
}

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT} [${process.env.NODE_ENV}]`));
