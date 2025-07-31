const mongoose = require("mongoose");

const taskLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  taskId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "RoutineTask",
    required: true,
  },

  date: {
    type: Date,
    required: true,
  },

  completed: {
    type: Boolean,
    default: false,
  },

  timeSpent: {
    type: Number, // in minutes
    default: 0,
  },

  xpEarned: {
    type: Number,
    default: 0,
  },

  isSpecialTask: {
    type: Boolean,
    default: false, // true only for manually scheduled calendar tasks
  }
});

taskLogSchema.index({ userId: 1, taskId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model("TaskLog", taskLogSchema);