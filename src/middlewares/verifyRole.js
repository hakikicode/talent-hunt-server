const User = require("../registrationModel.js/userModel");

const verifyRole = (...roles) => {
  return async (req, res, next) => {
    try {
      const email = req.decoded.email;
      const user = await User.findOne({ email });

      if (user && roles.includes(user.role)) {
        return next();
      }

      res.status(403).json({ message: "You don't have permission to access" });
    } catch (error) {
      console.error("Error verifying role:", error.message);
      res.status(500).json({ message: "Server error while verifying role" });
    }
  };
};

module.exports = verifyRole;