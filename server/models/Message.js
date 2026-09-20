import mongoose from "mongoose";

// A leadership message shown on the homepage — one per post (MD, CEO,
// Treasurer, ...), admin-managed as a list rather than a single record.
const messageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    designation: { type: String, required: true },
    message: { type: String, required: true },
    photo: { type: String },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("Message", messageSchema);
