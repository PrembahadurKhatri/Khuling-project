import mongoose from "mongoose";
import slugify from "slugify";

// Shared category list used by both Project.category and Service.category —
// admin-managed so new categories can be added without a code change (see
// controllers/categoryController.js).
const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, unique: true },
    slug: { type: String, unique: true },
  },
  { timestamps: true }
);

categorySchema.pre("save", function (next) {
  if (this.isModified("name")) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

export default mongoose.model("Category", categorySchema);
