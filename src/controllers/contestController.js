const Contest = require("../models/contestModel");
const User = require("../models/userModel");
const Task = require("../models/taskModel");

exports.getAllContests = async (req, res) => {
  try {
    const searchText = req.query.search || "";

    const result = await Contest.aggregate([
      {
        $match: {
          status: "accepted",
          type: { $regex: searchText, $options: "i" },
        },
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
      {
        $sort: { participantsCount: -1 },
      },
    ]);

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ****************************
exports.getContestById = async (req, res) => {
  try {
    const id = req.params.id;
    console.log(id);

    const result = await Contest.aggregate([{ $match: { _id: id } }]);

    const result2 = await Contest.findById(id)
      .populate("winner", "name email image")
      .populate("creator", "name email image");

    console.log(result, result2);

    res.send(result2);
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.getContestByIdForCreators = async (req, res) => {
  const contestId = req.params.contestId;
  const creatorId = req.params.creatorId;

  try {
    const contest = await Contest.findById(contestId)
      .populate("participants", "_id name image email")
      .populate("winner")
      .exec();

    if (!contest) {
      return res.status(404).send({ message: "Contest not found" });
    }

    // Check if the logged-in user is the creator of the contest
    if (contest.creator.toString() !== creatorId) {
      return res.status(403).send({ message: "Access denied" });
    }

    const tasks = await Task.find({ contestId })
      .populate("participantId", "name")
      .select("participantId task")
      .exec();

    const participantsWithTasks = contest.participants.map((participant) => {
      const participantTask = tasks.find((task) =>
        task.participantId.equals(participant._id)
      );

      return {
        _id: participant._id,
        name: participant.name,
        image: participant.image,
        email: participant.email,
        task: participantTask ? participantTask.task : null,
      };
    });

    const formattedContest = {
      _id: contest._id,
      title: contest.title,
      description: contest.description,
      deadline: contest.deadline,
      prizeMoney: contest.prizeMoney,
      winner: contest.winner,
      participants: participantsWithTasks,
    };

    res.status(200).send(formattedContest);
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
    { $limit: 6 },
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
        bestContest: { $first: "$$ROOT" }, // Retrieve the first contest for each creator
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
        image: "$creator.image",
        email: "$creator.email",
        bestContest: "$bestContest", // Include the details of the best contest
        totalPrizeMoney: 1,
      },
    },
    {
      $sort: { totalPrizeMoney: -1 },
    },
    {
      $limit: 5, // Limit the result to the top 5 creators with their best contests
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
  const email = req.decoded.email;

  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 10;
  const skip = (page - 1) * limit;

  try {
    const creator = await User.findOne({ email });

    if (
      !creator ||
      creator._id.toString() !== id ||
      creator.role !== "creator"
    ) {
      return res
        .status(403)
        .send({ message: "Access Denied: Insufficient Permission" });
    }

    const result = await Contest.find({ creator: id }).skip(skip).limit(limit);
    const total = await Contest.countDocuments({ creator: id });

    res.send({ contests: result, count: total });
  } catch (error) {
    res.stats(500).send(error);
  }
};

exports.getAllContestsForAdmin = async (req, res) => {
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 10;
  const skip = (page - 1) * limit;

  try {
    const result = await Contest.find({})
      .skip(skip)
      .limit(limit)
      .populate("creator", "name email")
      .select(
        "title type description instruction image prizeMoney creator winner deadline participationCount status"
      );

    const total = await Contest.countDocuments();

    res.send({ result, count: total });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

exports.createContest = async (req, res) => {
  try {
    const contest = req.body;

    const creator = await User.findById(contest.creator).select("role credits");
    if (!creator || creator.role !== "creator") {
      return res
        .status(403)
        .send({ message: "Access Denied: Insufficient Permission" });
    }

    const credits = creator?.credits || 0;

    if (credits < 50) {
      return res.status(400).send({ message: "Insufficient credits" });
    }

    // deduct 50 credits from the creator
    creator.credits = credits - 50;
    await creator.save();

    const result = await Contest.create(contest);

    res.status(201).send(result);
  } catch (error) {
    res.status(500).send(error);
  }
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
    res.status(500).send(error);
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

exports.getBestCreators = async (req, res) => {
  try {
    const creators = await Contest.aggregate([
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
        $select: {
          title: 1,
          description: 1,
        },
      },
    ]);

    const creatorIds = creators.map((creator) => creator._id);

    const result = await User.find({ _id: { $in: creatorIds } }).sort({
      totalPrizeMoney: -1,
    });

    res.status(200).send(result);
  } catch (error) {
    res.stats(500).send(error);
  }
};

exports.getWinners = async (req, res) => {
  try {
    const contests = await Contest.find({
      status: "accepted",
      winner: { $ne: null },
    })
      .populate("winner", "name email image")
      .select("title prizeMoney image winner participants");

    const winners = contests.map((contest) => {
      return {
        title: contest.title,
        image: contest.image,
        winner: contest.winner,
        prizeMoney: contest.prizeMoney,
        participantCount: contest?.participants?.length,
      };
    });

    res.status(200).send(winners);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

exports.getUserStats = async (req, res) => {
  const email = req.decoded?.email;

  if (!email) {
    return res.status(401).send({ message: "Unauthorized access" });
  }

  try {
    const user = await User.findOne({ email }).select("_id");
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    const contests = await Contest.find({
      participants: user._id,
      status: "accepted",
    });

    const winningContests =
      contests.filter(
        (contest) => contest.winner?.toString() === user._id.toString()
      ) || [];

    const stats = {
      totalContests: contests.length,
      totalFee: contests.reduce((acc, curr) => acc + curr.entryFee, 0),
      totalPrizeMoney: winningContests.reduce(
        (acc, curr) => acc + curr.prizeMoney,
        0
      ),
      totalWinningContests: winningContests.length,
    };

    res.status(200).send(stats);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

exports.getLeaderboard = async (req, res) => {
  console.log("getLeaderboard");
  try {
    const users = await Contest.aggregate([
      {
        $match: { status: "accepted" },
      },
      {
        $group: {
          _id: "$winner",
          totalPrizeMoney: { $sum: "$prizeMoney" },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "winner",
        },
      },
      {
        $unwind: "$winner",
      },
      {
        $project: {
          _id: 0,
          winner: "$winner.name",
          image: "$winner.image",
          email: "$winner.email",
          totalPrizeMoney: 1,
        },
      },
      {
        $sort: { totalPrizeMoney: -1 },
      },
      {
        $limit: 20,
      },
    ]);

    res.status(200).send(users);
  } catch (error) {
    res.status(500).send(error);
  }
};
