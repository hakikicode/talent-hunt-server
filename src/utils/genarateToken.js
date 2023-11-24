const jwt = require("jsonwebtoken");
require("dotenv").config();

const signToken = (user) => {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

module.exports = { signToken };
