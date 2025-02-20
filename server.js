require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes

// Start Server
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.use("/auth", authRoutes);
  app.use("/tasks", taskRoutes);
  app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
});
