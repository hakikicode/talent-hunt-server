const User = require("../models/userModel");

exports.getAllUsers = async (req, res) => {
  const users = await User.find({});
  res.send(users);
};

exports.getUserByEmail = async (req, res) => {
  const email = req.params.email;
  const result = await User.findOne({ email });
  res.send(result);
};

exports.createOrUpdateUser = async (req, res) => {
  const email = req.params.email;
  const user = req.body;
  const query = { email: email };
  const isExist = await User.findOne(query);
  console.log("User found?----->", isExist);
  if (isExist) return res.send(isExist);
  const result = await User.create(user);
  res.send(result);
};
