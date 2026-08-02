import express from "express";
import { body } from "express-validator";
import {
  createContactMessage,
  getContactMessages,
  updateContactMessageStatus,
  deleteContactMessage,
} from "../controllers/contactController.js";
import { protect, authorize } from "../middleware/auth.js";
import validate from "../middleware/validate.js";

const router = express.Router();

router.post(
  "/",
  [body("name").notEmpty(), body("email").isEmail(), body("message").notEmpty()],
  validate,
  createContactMessage
);

router.get("/", protect, authorize("admin", "editor"), getContactMessages);
router.patch("/:id/status", protect, authorize("admin", "editor"), updateContactMessageStatus);
router.delete("/:id", protect, authorize("admin"), deleteContactMessage);

export default router;
