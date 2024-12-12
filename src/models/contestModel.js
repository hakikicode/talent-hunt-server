const mongoose = require("mongoose");

const contestSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Contest title is required"],
      trim: true,
    },
    type: {
      type: String,
      required: [true, "Contest type is required"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    image: {
      type: String,
      required: [true, "Contest image is required"],
    },
    prizeMoney: {
      type: Number,
      required: [true, "Prize money is required"],
      min: [0, "Prize money cannot be negative"],
    },
    entryFee: {
      type: Number,
      default: 0,
      min: [0, "Entry fee cannot be negative"],
    },
    deadline: {
      type: Date,
      required: [true, "Deadline is required"],
      validate: {
        validator: function (value) {
          return value > Date.now();
        },
        message: "Deadline must be a future date",
      },
    },
    status: {
      type: String,
      enum: ["accepted", "pending", "rejected"],
      default: "pending",
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Creator is required"],
    },
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    winner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Add indexes for performance optimization
contestSchema.index({ title: "text", type: "text", description: "text" });

module.exports = mongoose.model("Contest", contestSchema);
