const express = require("express");
const router = express.Router();
const rateLimit = require("../utils/rateLimit");
const { protect } = require("../middleware/authMiddleware");
const ai = require("../controllers/aiController");

router.use(
  protect,
  rateLimit({
    windowMs: 60 * 1000,
    max: 20,
    keyFn: (req) => String(req.user._id),
    message: "You're using the AI assistant very quickly. Please wait a minute and try again.",
  })
);

router.post("/summary", ai.summary);
router.post("/bullets", ai.bullets);
router.post("/skills", ai.skills);
router.post("/analyze", ai.analyze);
router.post("/cover-letter", ai.coverLetter);

module.exports = router;
