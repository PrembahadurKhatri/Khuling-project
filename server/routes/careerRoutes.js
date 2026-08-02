import express from "express";
import {
  getCareers,
  getCareerBySlug,
  createCareer,
  updateCareer,
  deleteCareer,
} from "../controllers/careerController.js";
import { applyToCareer } from "../controllers/applicationController.js";
import { protect, authorize } from "../middleware/auth.js";
import upload from "../middleware/upload.js";

const router = express.Router();

router.get("/", getCareers);
router.get("/:slug", getCareerBySlug);

router.post("/", protect, authorize("admin", "editor"), createCareer);
router.post("/:id/apply", upload.single("resume"), applyToCareer);
router.put("/:id", protect, authorize("admin", "editor"), updateCareer);
router.delete("/:id", protect, authorize("admin"), deleteCareer);

export default router;
