const User = require("../models/userModel");

const verifyRole = (...roles) => {
  return async (req, res, next) => {
    const email = req.decoded.email;

    const user = await User.findOne({ email });

    if (user && roles.includes(user.role)) {
      next();
    } else {
      res.status(403).json({ message: "You don't have permission to access" });
    }
  };
};

module.exports = verifyRole;
