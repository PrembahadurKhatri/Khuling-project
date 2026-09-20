import express from "express";
import { getDesigns, getDesignBySlug, createDesign, updateDesign, deleteDesign } from "../controllers/designController.js";
import { protect, authorize } from "../middleware/auth.js";
import upload from "../middleware/upload.js";

const router = express.Router();

const uploadFields = upload.fields([
  { name: "images", maxCount: 10 },
  { name: "thumbnail", maxCount: 1 },
  { name: "dpr", maxCount: 1 },
  { name: "videoFiles", maxCount: 10 },
  { name: "videoThumbFiles", maxCount: 10 },
]);

router.get("/", getDesigns);
router.get("/:slug", getDesignBySlug);
router.post("/", protect, authorize("admin", "editor"), uploadFields, createDesign);
router.put("/:id", protect, authorize("admin", "editor"), uploadFields, updateDesign);
router.delete("/:id", protect, authorize("admin"), deleteDesign);

export default router;
