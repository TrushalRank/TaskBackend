const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header("Authorization");
    if (!token) return res.status(401).json({ message: "Access Denied" });
    
    const verified = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);
    
    req.user = await User.findById(verified.userId).select("-password");
    
    if (!req.user) return res.status(401).json({ message: "User Not Found" });

    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid Token" });
  }
};

module.exports = authMiddleware;