import asyncHandler from "express-async-handler";
import Message from "../models/Message.js";

const normalizePayload = (body, file) => {
  const payload = { ...body };
  if (file) payload.photo = file.path;
  if (payload.order !== undefined) payload.order = Number(payload.order);
  return payload;
};

// @desc   List leadership messages, sorted for display
// @route  GET /api/messages
export const getMessages = asyncHandler(async (req, res) => {
  const messages = await Message.find().sort({ order: 1, createdAt: 1 });
  res.json({ success: true, count: messages.length, data: messages });
});

// @desc   Create a leadership message
// @route  POST /api/messages
export const createMessage = asyncHandler(async (req, res) => {
  const message = await Message.create(normalizePayload(req.body, req.file));
  res.status(201).json({ success: true, data: message });
});

// @desc   Update a leadership message
// @route  PUT /api/messages/:id
export const updateMessage = asyncHandler(async (req, res) => {
  const message = await Message.findByIdAndUpdate(req.params.id, normalizePayload(req.body, req.file), {
    new: true,
    runValidators: true,
  });
  if (!message) {
    res.status(404);
    throw new Error("Message not found");
  }
  res.json({ success: true, data: message });
});

// @desc   Delete a leadership message
// @route  DELETE /api/messages/:id
export const deleteMessage = asyncHandler(async (req, res) => {
  const message = await Message.findByIdAndDelete(req.params.id);
  if (!message) {
    res.status(404);
    throw new Error("Message not found");
  }
  res.json({ success: true, message: "Message deleted" });
});
