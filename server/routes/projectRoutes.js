import express from "express";
import {
  getProjects,
  getProjectBySlug,
  createProject,
  updateProject,
  deleteProject,
} from "../controllers/projectController.js";
import { protect, authorize } from "../middleware/auth.js";
import upload from "../middleware/upload.js";

const router = express.Router();

router.get("/", getProjects);
router.get("/:slug", getProjectBySlug);

router.post(
  "/",
  protect,
  authorize("admin", "editor"),
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "gallery", maxCount: 20 },
    { name: "videos", maxCount: 5 },
    { name: "documents", maxCount: 5 },
  ]),
  createProject
);

router.put("/:id", protect, authorize("admin", "editor"), updateProject);
router.delete("/:id", protect, authorize("admin"), deleteProject);

export default router;
