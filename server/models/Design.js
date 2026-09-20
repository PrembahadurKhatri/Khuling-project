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
    // The public Design card's cover photo — a deliberate choice, not just
    // "whichever image happens to be first" in the gallery below. Falls back
    // to images[0] on the frontend for designs saved before this field
    // existed.
    thumbnail: { type: String },
    // Up to 10 gallery photos -- enforced here and again client-side in
    // DesignManage.jsx so the limit is obvious before a submit ever happens.
    images: {
      type: [String],
      validate: {
        validator: (arr) => arr.length <= 10,
        message: "A design can have at most 10 images.",
      },
    },
    // Each video is either a pasted link (YouTube/Vimeo) or an uploaded
    // file, with its own optional poster thumbnail (also link-or-upload) --
    // see designController.js's normalizePayload for how these get merged
    // from the admin form's parallel metadata + file arrays.
    videos: [
      {
        url: { type: String, required: true },
        thumbnail: { type: String },
      },
    ],
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
