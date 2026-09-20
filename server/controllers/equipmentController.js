import asyncHandler from "express-async-handler";
import Equipment from "../models/Equipment.js";

const normalizePayload = (body, file) => {
  const payload = { ...body };
  if (file) payload.image = file.path;
  if (payload.quantity !== undefined) payload.quantity = Number(payload.quantity);
  return payload;
};

// @desc   List equipment, sorted for display
// @route  GET /api/equipment
export const getEquipment = asyncHandler(async (req, res) => {
  const equipment = await Equipment.find().sort({ order: 1, createdAt: 1 });
  res.json({ success: true, count: equipment.length, data: equipment });
});

// @desc   Create an equipment item
// @route  POST /api/equipment
export const createEquipment = asyncHandler(async (req, res) => {
  const item = await Equipment.create(normalizePayload(req.body, req.file));
  res.status(201).json({ success: true, data: item });
});

// @desc   Update an equipment item
// @route  PUT /api/equipment/:id
export const updateEquipment = asyncHandler(async (req, res) => {
  const item = await Equipment.findByIdAndUpdate(req.params.id, normalizePayload(req.body, req.file), {
    new: true,
    runValidators: true,
  });
  if (!item) {
    res.status(404);
    throw new Error("Equipment not found");
  }
  res.json({ success: true, data: item });
});

// @desc   Delete an equipment item
// @route  DELETE /api/equipment/:id
export const deleteEquipment = asyncHandler(async (req, res) => {
  const item = await Equipment.findByIdAndDelete(req.params.id);
  if (!item) {
    res.status(404);
    throw new Error("Equipment not found");
  }
  res.json({ success: true, message: "Equipment deleted" });
});
