const mongoose = require("mongoose");
const { TEMPLATE_IDS } = require("../utils/themes");

const experienceSchema = new mongoose.Schema(
  {
    role: { type: String, maxlength: 120 },
    company: { type: String, maxlength: 120 },
    location: { type: String, maxlength: 120 },
    duration: { type: String, maxlength: 80 },
    details: { type: String, maxlength: 3000 }, // one achievement per line
  },
  { _id: false }
);

const educationSchema = new mongoose.Schema(
  {
    degree: { type: String, maxlength: 160 },
    institute: { type: String, maxlength: 160 },
    duration: { type: String, maxlength: 80 },
    grade: { type: String, maxlength: 80 },
  },
  { _id: false }
);

const projectSchema = new mongoose.Schema(
  {
    name: { type: String, maxlength: 120 },
    link: { type: String, maxlength: 300 },
    tech: { type: String, maxlength: 200 },
    details: { type: String, maxlength: 2000 },
  },
  { _id: false }
);

const certificationSchema = new mongoose.Schema(
  {
    name: { type: String, maxlength: 160 },
    issuer: { type: String, maxlength: 120 },
    year: { type: String, maxlength: 20 },
  },
  { _id: false }
);

const resumeSchema = new mongoose.Schema(
  {
    internId: { type: mongoose.Schema.Types.ObjectId, ref: "Intern", required: true, unique: true },
    fullName: { type: String, default: "", maxlength: 120 },
    title: { type: String, default: "", maxlength: 140 },
    email: { type: String, default: "", maxlength: 160 },
    phone: { type: String, default: "", maxlength: 40 },
    location: { type: String, default: "", maxlength: 120 },
    website: { type: String, default: "", maxlength: 200 },
    linkedin: { type: String, default: "", maxlength: 200 },
    github: { type: String, default: "", maxlength: 200 },
    summary: { type: String, default: "", maxlength: 2000 },
    skills: [{ type: String, maxlength: 60 }],
    languages: [{ type: String, maxlength: 60 }],
    experience: [experienceSchema],
    education: [educationSchema],
    projects: [projectSchema],
    certifications: [certificationSchema],
    template: { type: String, enum: TEMPLATE_IDS, default: "onyx" },
    isPublic: { type: Boolean, default: false },
    slug: { type: String, unique: true, sparse: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Resume", resumeSchema);
