const Contest = require("../models/contestModel");

exports.getAllContests = async (req, res) => {
  const result = await Contest.find({ status: "accepted" })
    .populate("creator", "name email")
    .select(
      "title type description instruction image prizeMoney creator winner deadline participationCount status"
    );
  res.send(result);
};

exports.getContestById = async (req, res) => {
  const id = req.params.id;
  const result = await Contest.findById(id).populate("creator");
  res.send(result);
};

exports.getContestByCreator = async (req, res) => {
  const id = req.params.creatorId;
  const result = await Contest.find({ creator: id });
  res.send(result);
};

exports.getAllContestsForAdmin = async (req, res) => {
  try {
    const result = await Contest.find({})
      .populate("creator", "name email")
      .select(
        "title type description instruction image prizeMoney creator winner deadline participationCount status"
      );

    res.send(result);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

exports.createContest = async (req, res) => {
  const contest = req.body;
  const result = await Contest.create(contest);
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
