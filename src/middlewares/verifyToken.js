const jwt = require("jsonwebtoken");
require("dotenv").config();

const verifyToken = async (req, res, next) => {
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized access: No token provided" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      if (process.env.NODE_ENV === "development") {
        console.error("JWT Verification Error:", err);
      }
      return res.status(401).json({ message: "Unauthorized access: Invalid token" });
    }

    req.decoded = decoded;
    next();
  });
};

module.exports = verifyToken;