import mongoose from "mongoose";
import slugify from "slugify";

const careerSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, unique: true },
    department: { type: String },
    location: { type: String },
    type: { type: String, enum: ["Full-time", "Part-time", "Contract", "Internship"], default: "Full-time" },
    description: { type: String, required: true },
    requirements: [{ type: String }],
    qualifications: [{ type: String }],
    experience: { type: String },
    ageRequirement: { type: String },
    salary: { type: String },
    positionsAvailable: { type: Number, default: 1, min: 0 },
    status: { type: String, enum: ["open", "closed"], default: "open" },
    deadline: { type: Date },
  },
  { timestamps: true }
);

careerSchema.pre("save", function (next) {
  if (this.isModified("title")) {
    this.slug = slugify(this.title, { lower: true, strict: true }) + "-" + Date.now().toString().slice(-5);
  }
  next();
});

const applicationSchema = new mongoose.Schema(
  {
    // Omitted entirely for a general application (not tied to a specific
    // posting) — see submitGeneralApplication in applicationController.js.
    job: { type: mongoose.Schema.Types.ObjectId, ref: "Career" },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    resumeUrl: { type: String, required: true },
    // Uploaded PDF/image, not typed text — matches resumeUrl's pattern.
    coverLetterUrl: { type: String },
    links: {
      github: String,
      linkedin: String,
      other: String,
    },
    status: {
      type: String,
      enum: ["received", "shortlisted", "interviewing", "rejected", "hired"],
      default: "received",
    },
    interviewDate: { type: Date },
    visitDate: { type: Date },
  },
  { timestamps: true }
);

export const Career = mongoose.model("Career", careerSchema);
export const Application = mongoose.model("Application", applicationSchema);
