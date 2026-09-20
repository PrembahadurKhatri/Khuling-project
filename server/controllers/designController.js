import mongoose from "mongoose";
import asyncHandler from "express-async-handler";
import Design from "../models/Design.js";

// The admin form (DesignManage.jsx) sends a lot of URL-or-file pairs at
// once. Each follows the same shape: a plain field for the kept/pasted URL,
// and a file field for a fresh upload, with the file winning when both are
// present (an admin form only ever produces one or the other per pair).
//
// Videos are the trickiest case: each entry has its own video (link OR
// upload) and its own optional thumbnail (link OR upload). Rather than
// indexed field names, the form sends one JSON `videosMeta` array
// describing each entry's shape (video-is-a-file? thumbnail-is-a-file? plus
// whatever kept URLs there are), and two flat file arrays (`videoFiles`,
// `videoThumbFiles`) in the same order as the "is a file" flags appear in
// videosMeta -- this function walks the metadata and pulls files off those
// queues as it goes.
const normalizePayload = (body, files) => {
  const payload = { ...body };

  // Card thumbnail
  delete payload.existingThumbnail;
  if (files?.thumbnail?.[0]) {
    payload.thumbnail = files.thumbnail[0].path;
  } else if (body.existingThumbnail) {
    payload.thumbnail = body.existingThumbnail;
  }

  // Gallery images
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

  // Videos
  delete payload.videosMeta;
  if (typeof body.videosMeta === "string") {
    let meta = [];
    try {
      meta = JSON.parse(body.videosMeta);
    } catch {
      meta = [];
    }
    const videoFiles = files?.videoFiles || [];
    const videoThumbFiles = files?.videoThumbFiles || [];
    let fi = 0;
    let ti = 0;
    payload.videos = meta
      .map((v) => ({
        url: v.urlIsFile ? videoFiles[fi++]?.path : v.url,
        thumbnail: v.thumbIsFile ? videoThumbFiles[ti++]?.path : v.thumbnail || undefined,
      }))
      .filter((v) => v.url);
  }

  // DPR document
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
