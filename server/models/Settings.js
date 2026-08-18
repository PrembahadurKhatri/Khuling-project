import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema(
  {
    companyName: { type: String, default: "Khilung Kalika Construction Pvt. Ltd." },
    logo: { type: String },
    favicon: { type: String },
    tagline: { type: String },
    email: { type: String },
    phone: { type: String },
    emergencyContact: { type: String },
    address: { type: String },
    mapEmbedUrl: { type: String },
    // Short badge-style claims shown in the homepage credibility strip right
    // below the hero (e.g. "ISO 9001:2015 Certified") — admin-editable list.
    credentials: {
      type: [String],
      default: ["ISO 9001:2015 Certified", "8+ Years in Practice", "Government Panel Listed", "120+ Projects Delivered"],
    },
    social: {
      facebook: String,
      instagram: String,
      linkedin: String,
      youtube: String,
      twitter: String,
    },
    stats: {
      projectsCompleted: { type: Number, default: 0 },
      yearsExperience: { type: Number, default: 0 },
      clientsServed: { type: Number, default: 0 },
      engineers: { type: Number, default: 0 },
      machines: { type: Number, default: 0 },
    },
    seo: {
      metaTitle: String,
      metaDescription: String,
      googleAnalyticsId: String,
      googleSiteVerification: String,
    },
    smtp: {
      host: String,
      port: Number,
      user: String,
    },
    maintenanceMode: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("Settings", settingsSchema);
