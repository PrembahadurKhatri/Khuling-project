import mongoose from "mongoose";

// A piece of heavy equipment available for lease — shown on the public
// Equipment Lease page (one of the three /services categories).
const equipmentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    image: { type: String },
    description: { type: String },
    quantity: { type: Number, default: 1 },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("Equipment", equipmentSchema);
