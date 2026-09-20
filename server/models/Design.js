import mongoose from "mongoose";

// A design sample/service shown on the public Design page — a separate
// collection from Service/Construction, since a design entry represents a
// specific piece of design work (with its own image and category) rather
// than a construction discipline.
const designSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    category: { type: String },
    description: { type: String },
    image: { type: String },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("Design", designSchema);
