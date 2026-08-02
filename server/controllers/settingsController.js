import asyncHandler from "express-async-handler";
import Settings from "../models/Settings.js";

// @desc   Get site-wide settings (creates a default document on first request)
// @route  GET /api/settings
export const getSettings = asyncHandler(async (req, res) => {
  let settings = await Settings.findOne();
  if (!settings) {
    settings = await Settings.create({});
  }
  res.json({ success: true, data: settings });
});

// @desc   Update site-wide settings (singleton upsert)
// @route  PUT /api/settings
export const updateSettings = asyncHandler(async (req, res) => {
  const settings = await Settings.findOneAndUpdate({}, req.body, {
    new: true,
    upsert: true,
    runValidators: true,
    setDefaultsOnInsert: true,
  });
  res.json({ success: true, data: settings });
});
