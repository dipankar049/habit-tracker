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

  scheduledDate: {
    type: Date,
    required: true,
  },

  expectedDuration: {
    type: Number, // in minutes
    default: 0,
  },

  completed: {
    type: Boolean,
    default: false,
  },

  timeSpent: {
    type: Number,
    default: 0,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  }
});

specialTaskSchema.index({ userId: 1, scheduledDate: 1 });

module.exports = mongoose.model("SpecialTask", specialTaskSchema);