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
    // Up to 10 photos for this design (first one doubles as the card cover
    // on the public Design page) -- enforced here and again client-side in
    // DesignManage.jsx so the limit is obvious before a submit ever happens.
    images: {
      type: [String],
      validate: {
        validator: (arr) => arr.length <= 10,
        message: "A design can have at most 10 images.",
      },
    },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("Design", designSchema);
