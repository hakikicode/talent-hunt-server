const Contest = require("../models/contestModel");

exports.getAllContests = async (req, res) => {
  const result = await Contest.find({}).populate("creator", "name email");
  res.send(result);
};

exports.getContestById = async (req, res) => {
  const id = req.params.id;
  const result = await Contest.findById(id).populate("creator");
  res.send(result);
};

exports.createContest = async (req, res) => {
  const contest = req.body;
  const result = await contestsCollection.insertOne(contest);
  res.send(result);
};

exports.updateContest = async (req, res) => {
  const id = req.params.id;
  const contest = req.body;
  const result = await Contest.findByIdAndUpdate(id, contest);
  res.send(result);
};

exports.deleteContest = async (req, res) => {
  const id = req.params.id;
  const result = await Contest.findByIdAndDelete(id);
  res.send(result);
};
