import mongoose from "mongoose";

const gallerySchema = new mongoose.Schema(
  {
    image: { type: String, required: true },
    caption: { type: String },
    category: { type: String, default: "General" },
  },
  { timestamps: true }
);

export default mongoose.model("Gallery", gallerySchema);
