import mongoose from "mongoose";

const teamSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    designation: { type: String, required: true },
    department: { type: String },
    image: { type: String, required: true },
    bio: { type: String },
    social: {
      linkedin: String,
      facebook: String,
      whatsapp: String,
      instagram: String,
      email: String,
    },
    order: { type: Number, default: 0 },
    isLeadership: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("Team", teamSchema);
