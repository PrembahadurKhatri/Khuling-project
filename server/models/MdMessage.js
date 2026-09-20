import mongoose from "mongoose";

// Singleton, like Settings — one MD/CEO message shown on the homepage,
// editable from its own dedicated admin screen instead of a CRUD list.
const mdMessageSchema = new mongoose.Schema(
  {
    name: { type: String, default: "" },
    designation: { type: String, default: "" },
    message: { type: String, default: "" },
    photo: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model("MdMessage", mdMessageSchema);
