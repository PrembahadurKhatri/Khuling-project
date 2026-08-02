import asyncHandler from "express-async-handler";
import ContactMessage from "../models/ContactMessage.js";
import sendEmail from "../utils/sendEmail.js";

// @route POST /api/contact  (public)
export const createContactMessage = asyncHandler(async (req, res) => {
  const message = await ContactMessage.create({ ...req.body, type: req.body.type || "contact" });

  // Notify office (best-effort; failure shouldn't block the response)
  try {
    await sendEmail({
      to: process.env.EMAIL_FROM,
      subject: `New ${message.type === "quote" ? "Quote Request" : "Contact Message"} from ${message.name}`,
      html: `<p><strong>Name:</strong> ${message.name}</p><p><strong>Email:</strong> ${message.email}</p><p><strong>Message:</strong> ${message.message}</p>`,
    });
  } catch (err) {
    console.error("Email notification failed:", err.message);
  }

  res.status(201).json({ success: true, message: "Thank you, we will get back to you shortly." });
});

// @route GET /api/contact (admin)
export const getContactMessages = asyncHandler(async (req, res) => {
  const { status, type, page = 1, limit = 20 } = req.query;
  const query = {};
  if (status) query.status = status;
  if (type) query.type = type;

  const pageNum = Math.max(Number(page), 1);
  const limitNum = Math.min(Number(limit), 100);

  const [messages, total] = await Promise.all([
    ContactMessage.find(query)
      .sort("-createdAt")
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum),
    ContactMessage.countDocuments(query),
  ]);

  res.json({ success: true, count: messages.length, total, page: pageNum, pages: Math.ceil(total / limitNum), data: messages });
});

export const updateContactMessageStatus = asyncHandler(async (req, res) => {
  const message = await ContactMessage.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true }
  );
  if (!message) {
    res.status(404);
    throw new Error("Message not found");
  }
  res.json({ success: true, data: message });
});

export const deleteContactMessage = asyncHandler(async (req, res) => {
  const message = await ContactMessage.findByIdAndDelete(req.params.id);
  if (!message) {
    res.status(404);
    throw new Error("Message not found");
  }
  res.json({ success: true, message: "Message deleted" });
});
