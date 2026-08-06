import mongoose from "mongoose";
import slugify from "slugify";

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, unique: true },
    // Free-text but sourced from the admin-managed Category collection
    // (see models/Category.js) rather than a hardcoded enum, so new
    // categories can be added without a code change.
    category: { type: String, required: true },
    status: { type: String, enum: ["Completed", "Ongoing", "Upcoming"], default: "Ongoing" },
    location: { type: String, required: true },
    client: { type: String },
    budget: { type: String },
    startDate: { type: Date },
    endDate: { type: Date },
    description: { type: String, required: true },
    shortDescription: { type: String, maxlength: 300 },
    thumbnail: { type: String, required: true },
    gallery: [{ type: String }],
    videos: [{ type: String }],
    documents: [{ type: String }],
    mapLocation: {
      lat: { type: Number },
      lng: { type: Number },
    },
    technologiesUsed: [{ type: String }],
    featured: { type: Boolean, default: false },
    seo: {
      metaTitle: String,
      metaDescription: String,
      keywords: [String],
    },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

projectSchema.pre("save", function (next) {
  if (this.isModified("title")) {
    this.slug = slugify(this.title, { lower: true, strict: true }) + "-" + Date.now().toString().slice(-5);
  }
  next();
});

projectSchema.index({ title: "text", description: "text", location: "text" });

export default mongoose.model("Project", projectSchema);
