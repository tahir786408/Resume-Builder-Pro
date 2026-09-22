const Resume = require("../models/Resume");
const { renderResumePdf } = require("../utils/pdfRenderer");

const send = (resume, res) => {
  const file = (resume.fullName || "resume").replace(/[^\w.-]+/g, "_");
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `attachment; filename="${file}.pdf"`);
  renderResumePdf(resume, res);
};

exports.downloadResumePdf = async (req, res) => {
  try {
    const resume = await Resume.findOne({ internId: req.user._id });
    if (!resume) return res.status(404).json({ message: "No resume found" });
    send(resume, res);
  } catch (err) {
    if (!res.headersSent) res.status(500).json({ message: err.message });
  }
};

exports.downloadPublicPdf = async (req, res) => {
  try {
    const resume = await Resume.findOne({ slug: req.params.slug, isPublic: true });
    if (!resume) return res.status(404).json({ message: "This resume is private or does not exist." });
    send(resume, res);
  } catch (err) {
    if (!res.headersSent) res.status(500).json({ message: err.message });
  }
};
