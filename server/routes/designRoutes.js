import express from "express";
import { getDesigns, createDesign, updateDesign, deleteDesign } from "../controllers/designController.js";
import { protect, authorize } from "../middleware/auth.js";
import upload from "../middleware/upload.js";

const router = express.Router();

router.get("/", getDesigns);
router.post("/", protect, authorize("admin", "editor"), upload.single("image"), createDesign);
router.put("/:id", protect, authorize("admin", "editor"), upload.single("image"), updateDesign);
router.delete("/:id", protect, authorize("admin"), deleteDesign);

export default router;
