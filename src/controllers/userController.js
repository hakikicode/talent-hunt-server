const User = require("../models/userModel");

exports.getAllUsers = async (req, res) => {
  try {
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 10;
    const skip = (page - 1) * limit;

    const users = await User.find({}).skip(skip).limit(limit);
    const total = await User.countDocuments();
    res.send({ users, count: total });
  } catch (error) {
    res.send(error);
  }
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

exports.getBestCreators = async (req, res) => {
  try {
    const creators = await User.aggregate([
      {
        $match: { role: "creator" },
      },
    ]);
  } catch (error) {
    res.stats(500).send(error);
  }
};

exports.addCredits = async (req, res) => {
  const email = req.decoded.email;

  console.log(email, req.body);

  try {
    const result = await User.findOne({ email });
    if (!result || result.role !== "creator")
      return res.status(404).send("User not found");

    const credits = req.body.credits;
    result.credits += credits;
    await result.save();

    res.send(result);
  } catch (error) {
    res.send(error);
  }
};
