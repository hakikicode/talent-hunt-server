const { model, Schema } = require("mongoose");

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
  },
  instruction: {
    type: String,
    required: [true, "Instruction is required"],
  },
  image: {
    type: String,
    required: [true, "Image is required"],
  },
  prizeMoney: {
    type: Number,
    required: [true, "Prize money is required"],
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

const Contest = model("Contest", contestSchema);

module.exports = Contest;
