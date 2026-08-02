import mongoose from "mongoose";
import slugify from "slugify";

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, unique: true },
    content: { type: String, required: true }, // Tiptap HTML/JSON output
    excerpt: { type: String, maxlength: 300 },
    featuredImage: { type: String, required: true },
    category: { type: String },
    tags: [{ type: String }],
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    status: { type: String, enum: ["draft", "published", "scheduled"], default: "draft" },
    publishedAt: { type: Date },
    scheduledFor: { type: Date },
    views: { type: Number, default: 0 },
    seo: {
      metaTitle: String,
      metaDescription: String,
      keywords: [String],
    },
  },
  { timestamps: true }
);

blogSchema.pre("save", function (next) {
  if (this.isModified("title")) {
    this.slug = slugify(this.title, { lower: true, strict: true }) + "-" + Date.now().toString().slice(-5);
  }
  if (this.status === "published" && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  next();
});

blogSchema.index({ title: "text", content: "text", tags: "text" });

export default mongoose.model("Blog", blogSchema);
