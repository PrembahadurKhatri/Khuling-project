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
      },
    },
  })
);
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
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
app.get("/", (req, res) => {
  res.send("Server is running 🚀");
});
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
