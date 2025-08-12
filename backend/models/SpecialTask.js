const mongoose = require("mongoose");

const specialTaskSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  title: {
    type: String,
    required: true,
    trim: true,
  },

  description: {
    type: String,
    trim: true,
  },

  scheduledDate: {
    type: Date,
    required: true,
  },

  endDate: {
    type: Date,  // optional, for multi-day task
    default: null,
  },

  completed: {
    type: Boolean,
    default: false,
  },

  completedAt: {
    type: Date,  // when task was completed
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

specialTaskSchema.index({ userId: 1, scheduledDate: 1 });

module.exports = mongoose.model("SpecialTask", specialTaskSchema);