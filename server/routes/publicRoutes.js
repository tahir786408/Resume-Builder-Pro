const express = require("express");
const router = express.Router();
const { getPublicResume } = require("../controllers/resumeController");
const { downloadPublicPdf } = require("../controllers/pdfController");

router.get("/:slug", getPublicResume);
router.get("/:slug/pdf", downloadPublicPdf);

module.exports = router;
