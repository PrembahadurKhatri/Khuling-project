import express from "express";
import { getSitemap, getRobotsTxt } from "../controllers/seoController.js";

// Mounted at the app root (not under /api) in server.js, and before the
// production SPA catch-all — a crawler requesting /sitemap.xml or
// /robots.txt must hit these, not get served index.html.
const router = express.Router();

router.get("/sitemap.xml", getSitemap);
router.get("/robots.txt", getRobotsTxt);

export default router;
