import express from "express";
import { body } from "express-validator";
import {
  createContactMessage,
  getContactMessages,
  updateContactMessageStatus,
  replyToContactMessage,
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
router.post(
  "/:id/reply",
  protect,
  authorize("admin", "editor"),
  [body("message").notEmpty().withMessage("Reply message is required")],
  validate,
  replyToContactMessage
);
router.delete("/:id", protect, authorize("admin"), deleteContactMessage);

export default router;
