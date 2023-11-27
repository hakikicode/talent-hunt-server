const { model, Schema } = require("mongoose");

const taskModel = new Schema({
  task: {
    type: String,
    required: [true, "Task is required"],
  },
  contestId: {
    type: Schema.Types.ObjectId,
    ref: "Contest",
    required: [true, "Contest is required"],
  },
  participantId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Participant is required"],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const Task = model("Task", taskModel);

module.exports = Task;
