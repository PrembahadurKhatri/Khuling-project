import express from "express";
import { getMdMessage, updateMdMessage } from "../controllers/mdMessageController.js";
import { protect, authorize } from "../middleware/auth.js";
import upload from "../middleware/upload.js";

const router = express.Router();

router.get("/", getMdMessage);
router.put("/", protect, authorize("admin", "editor"), upload.single("photo"), updateMdMessage);

export default router;
