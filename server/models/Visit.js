import mongoose from "mongoose";

// One document per public-page load (see client/src/hooks/useTrackVisit.js).
// Deliberately minimal — this powers the "Website Visitors" count on the
// admin dashboard, not full analytics (use Settings.seo.googleAnalyticsId
// for that).
const visitSchema = new mongoose.Schema(
  {
    path: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Visit", visitSchema);
