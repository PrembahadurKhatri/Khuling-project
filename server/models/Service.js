import mongoose from "mongoose";
import slugify from "slugify";

const serviceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, unique: true },
    icon: { type: String }, // react-icon name or uploaded icon URL
    heroImage: { type: String },
    shortDescription: { type: String, maxlength: 300 },
    description: { type: String, required: true },
    // Links this service to a Project category (see models/Category.js) so
    // the public Service page can offer a "Related Projects" button that
    // deep-links to /projects?category=<this>.
    category: { type: String },
    benefits: [{ type: String }],
    gallery: [{ type: String }],
    faq: [
      {
        question: String,
        answer: String,
      },
    ],
    order: { type: Number, default: 0 },
    seo: {
      metaTitle: String,
      metaDescription: String,
    },
  },
  { timestamps: true }
);

serviceSchema.pre("save", function (next) {
  if (this.isModified("title")) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  next();
});

export default mongoose.model("Service", serviceSchema);
