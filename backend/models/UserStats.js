const mongoose = require("mongoose");

const userStatsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },

  currentXP: {
    type: Number,
    default: 0,
  },

  level: {
    type: Number,
    default: 1,
  },

  totalTasksCompleted: {
    type: Number,
    default: 0,
  },

  totalMinutesSpent: {
    type: Number,
    default: 0,
  },

  currentStreak: {
    type: Number,
    default: 0,
  },

  longestStreak: {
    type: Number,
    default: 0,
  },

  lastActiveDate: {
    type: Date,
    default: null,
  }
});

module.exports = mongoose.model("UserStats", userStatsSchema);