import express from "express";
import { getBlogs, getBlogBySlug, createBlog, updateBlog, deleteBlog } from "../controllers/blogController.js";
import { protect, authorize, optionalAuth } from "../middleware/auth.js";
import upload from "../middleware/upload.js";

const router = express.Router();

router.get("/", optionalAuth, getBlogs);
router.get("/:slug", getBlogBySlug);

router.post(
  "/",
  protect,
  authorize("admin", "editor"),
  upload.single("featuredImage"),
  createBlog
);
router.put(
  "/:id",
  protect,
  authorize("admin", "editor"),
  upload.single("featuredImage"),
  updateBlog
);
router.delete("/:id", protect, authorize("admin"), deleteBlog);

export default router;
