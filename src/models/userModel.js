const { model, Schema } = require("mongoose");
const validator = require("validator");

const userSchema = new Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
  },
  email: {
    type: String,
    unique: true,
    lowercase: true,
    required: [true, "Email is required"],
    // validate: [validator.isEmail, "Please provide a valid email"],
  },
  image: {
    type: String,
    required: [true, "Image is required"],
  },
  role: {
    type: String,
    enum: ["user", "creator", "admin"],
    default: "user",
  },
  credits: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const User = model("User", userSchema);

module.exports = User;
