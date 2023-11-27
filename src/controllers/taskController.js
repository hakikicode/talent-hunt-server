const Task = require("../models/taskModel");
const User = require("../models/userModel");

exports.getTaskById = async (req, res) => {
  const email = req.decoded.email;
  const contestId = req.params.contestId;

  try {
    const participant = await User.findOne({ email });

    if (!participant || participant.role !== "user") {
      return res
        .status(403)
        .send({ message: "Access Denied: Insufficient Permission" });
    }

    const task = await Task.findOne({
      contestId,
      participantId: participant._id,
    });

    res.status(200).json(task);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

exports.createTask = async (req, res) => {
  const email = req.decoded.email;
  const contestId = req.params.contestId;

  try {
    const participant = await User.findOne({ email });
    if (!participant || participant.role !== "user") {
      return res
        .status(403)
        .send({ message: "Access Denied: Insufficient Permission" });
    }

    // check is already submitted
    const isAlreadySubmitted = await Task.findOne({
      contestId,
      participantId: participant._id,
    });

    if (isAlreadySubmitted) {
      return res.status(403).send({ message: "Already Submitted" });
    }

    // create task
    const task = await Task.create({
      task: req.body.task,
      contestId,
      participantId: participant._id,
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(500).send(error);
  }
};
