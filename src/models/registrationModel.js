const mongoose = require("mongoose");
const validator = require("validator");

const registrationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  gender: { type: String, required: true },
  email: { type: String, required: true },
  age: { type: Number, required: true },
  stateOfOrigin: { type: String, required: true },
  localGovernment: { type: String, required: true },
  nationality: { type: String, required: true },
  instagramHandle: { type: String },
  facebookHandle: { type: String },
  phoneNumber: { type: Number, required: true },
  stageName: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Registration = mongoose.model("Registration", registrationSchema);

module.exports = Registration;
