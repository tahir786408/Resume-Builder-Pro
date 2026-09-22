const Intern = require("../models/Intern");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const signToken = (intern) =>
  jwt.sign({ id: intern._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

const normEmail = (e) => String(e || "").toLowerCase().trim();

exports.register = async (req, res) => {
  try {
    const { name, password } = req.body;
    const email = normEmail(req.body.email);
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email and password are required" });
    }
    if (String(password).length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }
    const existing = await Intern.findOne({ email });
    if (existing) return res.status(400).json({ message: "An account with this email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const intern = await Intern.create({ name: String(name).trim(), email, password: hashedPassword });
    const token = signToken(intern);
    res.status(201).json({ token, user: { id: intern._id, name: intern.name, email: intern.email } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { password } = req.body;
    const email = normEmail(req.body.email);
    if (!email || !password) return res.status(400).json({ message: "Email and password are required" });

    const intern = await Intern.findOne({ email });
    const isMatch = intern && (await bcrypt.compare(password, intern.password));
    // Same message for both cases so accounts can't be enumerated
    if (!isMatch) return res.status(401).json({ message: "Invalid email or password" });

    const token = signToken(intern);
    res.json({ token, user: { id: intern._id, name: intern.name, email: intern.email } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getMe = async (req, res) => {
  res.json(req.user);
};
