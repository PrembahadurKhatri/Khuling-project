import express from "express";
import { getEquipment, createEquipment, updateEquipment, deleteEquipment } from "../controllers/equipmentController.js";
import { protect, authorize } from "../middleware/auth.js";
import upload from "../middleware/upload.js";

const router = express.Router();

router.get("/", getEquipment);
router.post("/", protect, authorize("admin", "editor"), upload.single("image"), createEquipment);
router.put("/:id", protect, authorize("admin", "editor"), upload.single("image"), updateEquipment);
router.delete("/:id", protect, authorize("admin"), deleteEquipment);

export default router;
