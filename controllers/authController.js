const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { sendVerificationEmail } = require("../services/emailService");

exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) return res.status(400).json({ message: "All fields are required" });

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user (but not verified yet)
    const newUser = new User({ name, email, password: hashedPassword, isVerified: false });
    await newUser.save();

    // Send email verification
    await sendVerificationEmail(newUser, req);

    res.status(201).json({ message: "User registered successfully.", subMessage: "Please check your email to verify your account." });
  } catch (error) {
    res.status(500).json({ message: "Error registering user", error });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "All fields are required" });

    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    if (!user.isVerified) {
      return res.status(401).json({ message: "Email not verified. Please check your inbox." });
    }

    const token = jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET || "supersecretkey");

    res.status(200).json({ message: "Login successful", token, user: { id: user._id, email, name: user.name} });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error });
  }
};

exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(400).json({ message: "Invalid verification link." });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: "Email already verified." });
    }

    // Update user verification status
    user.isVerified = true;
    await user.save();

    res.status(200).json({ message: "Email verified successfully. You can now log in." });
  } catch (error) {
    res.status(500).json({ message: "Invalid or expired token.", error });
  }
};

