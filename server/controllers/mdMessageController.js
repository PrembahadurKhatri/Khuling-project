import asyncHandler from "express-async-handler";
import MdMessage from "../models/MdMessage.js";

// @desc   Get the MD/CEO message (creates an empty singleton on first request)
// @route  GET /api/md-message
export const getMdMessage = asyncHandler(async (req, res) => {
  let doc = await MdMessage.findOne();
  if (!doc) {
    doc = await MdMessage.create({});
  }
  res.json({ success: true, data: doc });
});

// @desc   Update the MD/CEO message (singleton upsert)
// @route  PUT /api/md-message
export const updateMdMessage = asyncHandler(async (req, res) => {
  const payload = { ...req.body };
  if (req.file) payload.photo = req.file.path;
  const doc = await MdMessage.findOneAndUpdate({}, payload, {
    new: true,
    upsert: true,
    runValidators: true,
    setDefaultsOnInsert: true,
  });
  res.json({ success: true, data: doc });
});
