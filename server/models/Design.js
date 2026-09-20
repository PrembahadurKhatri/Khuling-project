import mongoose from "mongoose";
import slugify from "slugify";

// A design sample/service shown on the public Design page — a separate
// collection from Service/Construction, since a design entry represents a
// specific piece of design work (with its own images and category) rather
// than a construction discipline.
const designSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, unique: true },
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
    videos: [{ type: String }],
    // Detailed Project Report — a single document (PDF, typically).
    dpr: { type: String },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

designSchema.pre("save", function (next) {
  if (this.isModified("name")) {
    this.slug = slugify(this.name, { lower: true, strict: true }) + "-" + Date.now().toString().slice(-5);
  }
  next();
});

export default mongoose.model("Design", designSchema);
