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
          $or: [
            { title: { $regex: searchText, $options: "i" } },
            { type: { $regex: searchText, $options: "i" } },
          ],
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
      { $sort: { createdAt: -1 } },
    ]);

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getContestById = async (req, res) => {
  try {
    const id = req.params.id;

    const contest = await Contest.findById(id)
      .populate("winner", "name email image")
      .populate("creator", "name email image")
      .populate("participants", "name email image");

    if (!contest) {
      return res.status(404).send({ message: "Contest not found" });
    }

    res.status(200).json(contest);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createContest = async (req, res) => {
  try {
    const { title, type, description, image, prizeMoney, deadline, creator } =
      req.body;

    // Validate creator role
    const user = await User.findById(creator).select("role credits");
    if (!user || user.role !== "creator") {
      return res.status(403).send({ message: "Access Denied: Insufficient Permission" });
    }

    // Deduct credits for contest creation
    if (user.credits < 50) {
      return res.status(400).send({ message: "Insufficient credits to create contest" });
    }
    user.credits -= 50;
    await user.save();

    // Create contest
    const contest = new Contest({
      title,
      type,
      description,
      image,
      prizeMoney,
      deadline,
      creator,
    });

    await contest.save();
    res.status(201).send({ message: "Contest created successfully", contest });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.addParticipant = async (req, res) => {
  const { contestId } = req.params;
  const { userId } = req.body;

  try {
    const contest = await Contest.findById(contestId);

    if (!contest) {
      return res.status(404).send({ message: "Contest not found" });
    }

    // Ensure contest is still open for participation
    if (contest.deadline <= new Date()) {
      return res.status(400).send({ message: "Contest is closed for participation" });
    }

    if (contest.participants.includes(userId)) {
      return res.status(400).send({ message: "Participant already added" });
    }

    contest.participants.push(userId);
    await contest.save();

    res.status(200).send({ message: "Participant added successfully" });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.declareWinner = async (req, res) => {
  const { contestId } = req.params;
  const { winnerId } = req.body;

  try {
    const contest = await Contest.findById(contestId).populate("creator");

    if (!contest) {
      return res.status(404).send({ message: "Contest not found" });
    }

    if (contest.creator.email !== req.decoded.email) {
      return res.status(403).send({ message: "Access Denied: Only the creator can declare a winner" });
    }

    if (contest.deadline > new Date()) {
      return res.status(400).send({ message: "Contest is not yet closed" });
    }

    if (contest.winner) {
      return res.status(400).send({ message: "Winner already declared" });
    }

    contest.winner = winnerId;
    await contest.save();

    res.status(200).send({ message: "Winner declared successfully" });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};
