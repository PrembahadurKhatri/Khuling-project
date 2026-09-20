import asyncHandler from "express-async-handler";
import Design from "../models/Design.js";

// The admin form sends images two ways at once: `existingImages` (a JSON
// array of URLs already kept from before, or pasted directly) and `images`
// (newly uploaded files, via upload.array). Both merge into one list here,
// capped at 10 -- see DesignManage.jsx.
const normalizePayload = (body, files) => {
  const payload = { ...body };
  let existing = [];
  if (body.existingImages) {
    try {
      existing = JSON.parse(body.existingImages);
    } catch {
      existing = [];
    }
  }
  delete payload.existingImages;
  const uploaded = (files || []).map((f) => f.path);
  payload.images = [...existing, ...uploaded].slice(0, 10);
  return payload;
};

// @desc   List designs, sorted for display
// @route  GET /api/designs
export const getDesigns = asyncHandler(async (req, res) => {
  const designs = await Design.find().sort({ order: 1, createdAt: 1 });
  res.json({ success: true, count: designs.length, data: designs });
});

// @desc   Create a design
// @route  POST /api/designs
export const createDesign = asyncHandler(async (req, res) => {
  const design = await Design.create(normalizePayload(req.body, req.files));
  res.status(201).json({ success: true, data: design });
});

// @desc   Update a design
// @route  PUT /api/designs/:id
export const updateDesign = asyncHandler(async (req, res) => {
  const design = await Design.findByIdAndUpdate(req.params.id, normalizePayload(req.body, req.files), {
    new: true,
    runValidators: true,
  });
  if (!design) {
    res.status(404);
    throw new Error("Design not found");
  }
  res.json({ success: true, data: design });
});

// @desc   Delete a design
// @route  DELETE /api/designs/:id
export const deleteDesign = asyncHandler(async (req, res) => {
  const design = await Design.findByIdAndDelete(req.params.id);
  if (!design) {
    res.status(404);
    throw new Error("Design not found");
  }
  res.json({ success: true, message: "Design deleted" });
});
