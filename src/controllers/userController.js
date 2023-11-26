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

exports.createUser = async (req, res) => {
  const email = req.params.email;
  const user = req.body;
  const query = { email: email };
  const isExist = await User.findOne(query);
  console.log("User found?----->", isExist);
  if (isExist) return res.send(isExist);
  const result = await User.create(user);
  res.send(result);
};

exports.updateUser = async (req, res) => {
  const id = req.params.id;
  const user = req.body;
  const result = await User.findByIdAndUpdate(id, user);
  res.send(result);
};
