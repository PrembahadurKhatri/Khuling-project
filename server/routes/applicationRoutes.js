import express from "express";
import {
  getApplications,
  updateApplicationStatus,
  deleteApplication,
  submitGeneralApplication,
} from "../controllers/applicationController.js";
import { protect, authorize } from "../middleware/auth.js";
import upload from "../middleware/upload.js";

const router = express.Router();

// Public — not tied to a specific job posting (see pages/GeneralApplication.jsx).
router.post(
  "/general",
  upload.fields([
    { name: "resume", maxCount: 1 },
    { name: "coverLetter", maxCount: 1 },
  ]),
  submitGeneralApplication
);

router.get("/", protect, authorize("admin", "editor"), getApplications);
router.put("/:id", protect, authorize("admin", "editor"), updateApplicationStatus);
router.delete("/:id", protect, authorize("admin"), deleteApplication);

export default router;
