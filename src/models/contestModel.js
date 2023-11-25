const { model, Schema } = require("mongoose");
const validator = require("validator");

const contestSchema = new Schema({
  title: {
    type: String,
    required: [true, "Contest title is required"],
  },
  type: {
    type: String,
    enum: ["business", "medical", "writing", "gaming"],
    required: [true, "Contest type is required"],
  },
  description: {
    type: String,
    required: [true, "Description is required"],
    minLength: [50, "Description must be at least 50 characters long"],
  },
  instruction: {
    type: String,
    required: [true, "Instruction is required"],
    minLength: [20, "Instruction must be at least 20 characters long"],
  },
  image: {
    type: String,
    required: [true, "Image is required"],
  },
  prizeMoney: {
    type: Number,
    required: [true, "Prize money is required"],
    min: [1, "Prize money must be at least 1"],
  },
  entryFee: {
    type: Number,
    required: [true, "Entry fee is required"],
    min: [1, "Entry fee must be at least 1"],
  },
  status: {
    type: String,
    enum: ["pending", "accepted"],
    default: "pending",
  },
  creator: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Creator must belong to a creator"],
  },
  winner: {
    type: Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
  participants: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  deadline: {
    type: Date,
    required: [true, "Deadline is required"],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

// Virtual fields
contestSchema.virtual("participationCount").get(function () {
  return this.participants.length;
});

const Contest = model("Contest", contestSchema);

module.exports = Contest;
