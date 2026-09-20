import mongoose from "mongoose";
import asyncHandler from "express-async-handler";
import Design from "../models/Design.js";

// The admin form sends images two ways at once: `existingImages` (a JSON
// array of URLs already kept from before, or pasted directly) and `images`
// (newly uploaded files, via upload.fields). Both merge into one list here,
// capped at 10. `videos` arrives as a JSON array of pasted URLs (YouTube/
// Vimeo links, not uploads). `dpr` is a single document -- an uploaded file
// wins over a pasted `existingDpr` URL, matching ImageSourceField's
// URL-or-file convention -- see DesignManage.jsx.
const normalizePayload = (body, files) => {
  const payload = { ...body };

  let existingImages = [];
  if (body.existingImages) {
    try {
      existingImages = JSON.parse(body.existingImages);
    } catch {
      existingImages = [];
    }
  }
  delete payload.existingImages;
  const uploadedImages = (files?.images || []).map((f) => f.path);
  payload.images = [...existingImages, ...uploadedImages].slice(0, 10);

  if (typeof body.videos === "string") {
    try {
      payload.videos = JSON.parse(body.videos);
    } catch {
      payload.videos = [];
    }
  }

  delete payload.existingDpr;
  if (files?.dpr?.[0]) {
    payload.dpr = files.dpr[0].path;
  } else if (body.existingDpr) {
    payload.dpr = body.existingDpr;
  }

  return payload;
};

// @desc   List designs, sorted for display
// @route  GET /api/designs
export const getDesigns = asyncHandler(async (req, res) => {
  const designs = await Design.find().sort({ order: 1, createdAt: 1 });
  res.json({ success: true, count: designs.length, data: designs });
});

// @desc   Get a single design by slug (falls back to _id, for designs
//         created before the slug field existed)
// @route  GET /api/designs/:slug
export const getDesignBySlug = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  let design = await Design.findOne({ slug });
  if (!design && mongoose.isValidObjectId(slug)) {
    design = await Design.findById(slug);
  }
  if (!design) {
    res.status(404);
    throw new Error("Design not found");
  }

  const related = design.category
    ? await Design.find({ category: design.category, _id: { $ne: design._id } }).limit(3)
    : [];

  res.json({ success: true, data: design, related });
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
