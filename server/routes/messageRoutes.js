import express from "express";
import { getMessages, createMessage, updateMessage, deleteMessage } from "../controllers/messageController.js";
import { protect, authorize } from "../middleware/auth.js";
import upload from "../middleware/upload.js";

const router = express.Router();

router.get("/", getMessages);
router.post("/", protect, authorize("admin", "editor"), upload.single("photo"), createMessage);
router.put("/:id", protect, authorize("admin", "editor"), upload.single("photo"), updateMessage);
router.delete("/:id", protect, authorize("admin"), deleteMessage);

export default router;
