const crypto = require("crypto");
const Resume = require("../models/Resume");

const FIELDS = [
  "fullName", "title", "email", "phone", "location", "website", "linkedin", "github",
  "summary", "skills", "languages", "experience", "education", "projects", "certifications",
  "template", "isPublic",
];
const ARRAY_FIELDS = new Set(["skills", "languages", "experience", "education", "projects", "certifications"]);

const slugify = (s) =>
  String(s || "resume")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40) || "resume";

const newSlug = (name) => `${slugify(name)}-${crypto.randomBytes(3).toString("hex")}`;

// Only whitelisted fields can be written (prevents overwriting internId / slug etc.)
const pickUpdates = (body = {}) => {
  const out = {};
  for (const f of FIELDS) {
    if (body[f] === undefined) continue;
    if (ARRAY_FIELDS.has(f) && !Array.isArray(body[f])) continue;
    out[f] = body[f];
  }
  return out;
};

exports.getMyResume = async (req, res) => {
  try {
    let resume = await Resume.findOne({ internId: req.user._id });
    if (!resume) {
      resume = await Resume.create({
        internId: req.user._id,
        fullName: req.user.name,
        email: req.user.email,
      });
    }
    res.json(resume);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateResume = async (req, res) => {
  try {
    const updates = pickUpdates(req.body);
    let resume = await Resume.findOne({ internId: req.user._id });
    if (!resume) resume = new Resume({ internId: req.user._id });

    resume.set(updates);
    if (resume.isPublic && !resume.slug) resume.slug = newSlug(resume.fullName);
    await resume.save();
    res.json(resume);
  } catch (err) {
    const status = err.name === "ValidationError" ? 400 : 500;
    res.status(status).json({ message: err.message });
  }
};

// ---- public share ----
exports.getPublicResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({ slug: req.params.slug, isPublic: true }).select("-internId -__v");
    if (!resume) return res.status(404).json({ message: "This resume is private or does not exist." });
    res.json(resume);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
