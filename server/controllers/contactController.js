import asyncHandler from "express-async-handler";
import ContactMessage from "../models/ContactMessage.js";
import sendEmail from "../utils/sendEmail.js";
import wrapEmail from "../utils/emailTemplate.js";

// @route POST /api/contact  (public)
export const createContactMessage = asyncHandler(async (req, res) => {
  const message = await ContactMessage.create({ ...req.body, type: req.body.type || "contact" });

  // Respond immediately — the submission itself is already durable once the
  // DB write above completes. Notifying the office by email is best-effort
  // and must NOT block the response: a slow/unreachable email provider would
  // otherwise hang the client's "Sending..." state, even though the message
  // was saved in the first second. Fire-and-forget it instead.
  res.status(201).json({ success: true, message: "Thank you, we will get back to you shortly." });

  sendEmail({
    to: process.env.EMAIL_FROM,
    subject: `New ${message.type === "quote" ? "Quote Request" : "Contact Message"} from ${message.name}`,
    html: wrapEmail({
      title: message.type === "quote" ? "New quote request" : "New contact message",
      bodyHtml: `
        <p><strong>Name:</strong> ${message.name}</p>
        <p><strong>Email:</strong> <a href="mailto:${message.email}" style="color:#c99a3f;">${message.email}</a></p>
        ${message.phone ? `<p><strong>Phone:</strong> ${message.phone}</p>` : ""}
        ${message.projectType ? `<p><strong>Project Type:</strong> ${message.projectType}</p>` : ""}
        ${message.budgetRange ? `<p><strong>Budget:</strong> ${message.budgetRange}</p>` : ""}
        ${message.location ? `<p><strong>Location:</strong> ${message.location}</p>` : ""}
        <p style="margin-top:16px;padding:14px;background:#f5f3ee;border-radius:6px;"><strong>Message:</strong><br />${message.message}</p>
      `,
    }),
  }).catch((err) => console.error("Email notification failed:", err.message));
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
