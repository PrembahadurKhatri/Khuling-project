import mongoose from "mongoose";

const contactMessageSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ["contact", "quote"], default: "contact" },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    subject: { type: String },
    message: { type: String, required: true },
    // Quote-request specific fields
    projectType: { type: String },
    budgetRange: { type: String },
    location: { type: String },
    status: { type: String, enum: ["new", "read", "replied", "archived"], default: "new" },
  },
  { timestamps: true }
);

export default mongoose.model("ContactMessage", contactMessageSchema);
