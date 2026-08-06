import asyncHandler from "express-async-handler";
import Gallery from "../models/Gallery.js";

// @desc   Get gallery images (optionally filter by category)
// @route  GET /api/gallery
export const getGalleryImages = asyncHandler(async (req, res) => {
  const { category } = req.query;
  const query = {};
  if (category) query.category = category;

  const images = await Gallery.find(query).sort("-createdAt");
  res.json({ success: true, count: images.length, data: images });
});

// @desc   Upload a gallery image
// @route  POST /api/gallery
export const createGalleryImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error("Image file is required");
  }
  const image = await Gallery.create({ ...req.body, image: req.file.path });
  res.status(201).json({ success: true, data: image });
});

// @desc   Update a gallery image's caption/category (or replace the image)
// @route  PUT /api/gallery/:id
export const updateGalleryImage = asyncHandler(async (req, res) => {
  const payload = { ...req.body };
  if (req.file) payload.image = req.file.path;

  const image = await Gallery.findByIdAndUpdate(req.params.id, payload, {
    new: true,
    runValidators: true,
  });
  if (!image) {
    res.status(404);
    throw new Error("Gallery image not found");
  }
  res.json({ success: true, data: image });
});

// @desc   Delete a gallery image
// @route  DELETE /api/gallery/:id
export const deleteGalleryImage = asyncHandler(async (req, res) => {
  const image = await Gallery.findByIdAndDelete(req.params.id);
  if (!image) {
    res.status(404);
    throw new Error("Gallery image not found");
  }
  res.json({ success: true, message: "Gallery image deleted" });
});
