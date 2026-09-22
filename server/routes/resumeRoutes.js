const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { getMyResume, updateResume } = require("../controllers/resumeController");
const { downloadResumePdf } = require("../controllers/pdfController");

router.get("/", protect, getMyResume);
router.put("/", protect, updateResume);
router.get("/pdf", protect, downloadResumePdf);

module.exports = router;
