const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const resumeRoutes = require("./routes/resumeRoutes");
const aiRoutes = require("./routes/aiRoutes");
const publicRoutes = require("./routes/publicRoutes");
const rateLimit = require("./utils/rateLimit");

const app = express();
app.set("trust proxy", 1);

const origins = (process.env.CLIENT_ORIGIN || "http://localhost:5173")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);
app.use(cors({ origin: origins.includes("*") ? true : origins }));
app.use(express.json({ limit: "1mb" }));

// Reuse the connection across invocations (important for serverless platforms
// like Vercel, where the module can stay warm between requests).
if (mongoose.connection.readyState === 0) {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.log("MongoDB connection error:", err.message));
}

app.use(
  "/api/auth",
  rateLimit({ windowMs: 15 * 60 * 1000, max: 60, message: "Too many attempts. Try again in a few minutes." }),
  authRoutes
);
app.use("/api/resume", resumeRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/public", publicRoutes);

app.get("/", (req, res) => {
  res.send("Resume Builder Pro API is running");
});

module.exports = app;
