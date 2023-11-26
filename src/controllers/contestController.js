const Contest = require("../models/contestModel");
const User = require("../models/userModel");

exports.getAllContests = async (req, res) => {
  const result = await Contest.aggregate([
    {
      $match: { status: "accepted" },
    },
    {
      $project: {
        title: 1,
        type: 1,
        image: 1,
        description: 1,
        participantsCount: { $size: "$participants" },
      },
    },
  ]);

  res.status(200).json(result);
};

exports.getContestById = async (req, res) => {
  const id = req.params.id;
  // const result = await Contest.aggregate([
  //   {
  //     $match: { _id: id },
  //   },
  //   {
  //     $project: {
  //       title: 1,
  //       type: 1,
  //       image: 1,
  //       description: 1,
  //       prize: 1,
  //       deadline: 1,
  //       participantsCount: { $size: "$participants" },
  //       winner: 1,
  //     },
  //   },
  //   {
  //     $lookup: {
  //       from: "users",
  //       localField: "winner",
  //       foreignField: "_id",
  //       as: "winner",
  //     },
  //   },
  // ]);

  const result = await Contest.findById(id)
    .populate("winner", "name email")
    .populate("creator", "name email");

  res.send(result);
};

exports.getContestByIdForCreators = async (req, res) => {
  const contestId = req.params.contestId;
  const creatorId = req.params.creatorId;

  try {
    const contest = await Contest.findById(contestId)
      .populate("participants")
      .populate("winner");

    if (!contest) {
      return res.status(404).send({ message: "Contest not found" });
    }

    if (contest.creator.toString() !== creatorId) {
      return res.status(403).send({ message: "Access denied" });
    }

    res.status(200).send(contest);
  } catch (error) {
    res
      .status(500)
      .send({ message: error?.message || "Internal server error" });
  }
};

exports.getPopularContests = async (req, res) => {
  const result = await Contest.aggregate([
    { $match: { status: "accepted" } },
    {
      $project: {
        title: 1,
        type: 1,
        image: 1,
        description: 1,
        participantsCount: { $size: "$participants" },
      },
    },
    {
      $sort: { participantsCount: -1 },
    },
    { $limit: 5 },
  ]);

  res.status(200).json(result);
};

exports.getBestCreatorByPrizeMoney = async (req, res) => {
  const result = await Contest.aggregate([
    {
      $match: { status: "accepted" },
    },
    {
      $group: {
        _id: "$creator",
        totalPrizeMoney: { $sum: "$prizeMoney" },
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "creator",
      },
    },
    {
      $unwind: "$creator",
    },
    {
      $project: {
        _id: 0,
        creator: "$creator.name",
        totalPrizeMoney: 1,
      },
    },
    {
      $sort: { totalPrizeMoney: -1 },
    },
    {
      $limit: 1,
    },
  ]);

  res.status(200).json(result);
};

exports.getRegisteredContest = async (req, res) => {
  try {
    const email = req.decoded.email;
    const user = await User.findOne({ email });

    if (!user || user.role !== "user") {
      return res
        .status(403)
        .send({ message: "Access Denied: Insufficient Permission" });
    }

    const result = await Contest.find({ participants: user._id });
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.getWinningContest = async (req, res) => {
  try {
    const email = req.decoded.email;
    const user = await User.findOne({ email });

    if (!user || user.role !== "user") {
      return res
        .status(403)
        .send({ message: "Access Denied: Insufficient Permission" });
    }

    const result = await Contest.find({ winner: user._id });
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json(error);
  }
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

  const creator = await User.findById(contest.creator).select("role");
  if (!creator || creator.role !== "creator") {
    return res
      .status(403)
      .send({ message: "Access Denied: Insufficient Permission" });
  }

  const result = await Contest.create(contest);
  res.send(result);
};

exports.addParticipant = async (req, res) => {
  const contestId = req.params.contestId;
  const userId = req.params.userId;

  try {
    const contest = await Contest.findById(contestId);
    if (!contest) {
      return res.status(404).send({ message: "Contest not found" });
    }

    // check if the participant is already added
    const isParticipant = contest.participants.includes(userId);
    if (isParticipant) {
      return res.status(400).send({ message: "Participant already added" });
    }

    // added the participant
    contest.participants.push(userId);

    // save the contest
    await contest.save();

    res.status(200).send({ message: "Participant added successfully" });
  } catch (error) {
    res
      .status(500)
      .send({ message: error?.message || "Internal server error" });
  }
};

exports.declareWinner = async (req, res) => {
  const contestId = req.params.contestId;
  const email = req.decoded.email;

  try {
    const contest = await Contest.findById(contestId).populate("creator");
    if (!contest) {
      return res.status(404).send({ message: "Contest not found" });
    }

    // check if the contest is created by the creator
    if (contest.creator?.email !== email) {
      return res.status(403).send({ message: "Access denied" });
    }

    // check if the contest is not closed yet
    if (contest.deadline > new Date()) {
      return res.status(400).send({ message: "Contest is not close yet" });
    }

    // check if the winner is already declared
    if (contest.winner) {
      return res.status(400).send({ message: "Winner already declared" });
    }

    // declare the winner
    contest.winner = req.body.winner;

    // save the contest
    await contest.save();

    res.status(200).send({ message: "Participant added successfully" });
  } catch (error) {
    res
      .status(500)
      .send({ message: error?.message || "Internal server error" });
  }
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
