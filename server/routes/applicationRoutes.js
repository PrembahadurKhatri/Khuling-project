import express from "express";
import {
  getApplications,
  updateApplicationStatus,
  deleteApplication,
} from "../controllers/applicationController.js";
import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();

router.get("/", protect, authorize("admin", "editor"), getApplications);
router.put("/:id", protect, authorize("admin", "editor"), updateApplicationStatus);
router.delete("/:id", protect, authorize("admin"), deleteApplication);

export default router;
