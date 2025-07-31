const mongoose = require("mongoose");

const routineTaskSchema = new mongoose.Schema({
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

  defaultDuration: {
    type: Number, // in minutes
    required: true,
  },

  frequency: {
    type: String,
    enum: ["fixed", "flexible", "alternate"],
    required: true,
  },

  daysOfWeek: {
    // For "fixed" frequency (e.g., Mon, Wed, Sat)
    type: [Number], // 0 = Sunday, 6 = Saturday
    default: [],
  },

  timesPerWeek: {
    // For "flexible" frequency (e.g., 3 times/week)
    type: Number,
    default: 0,
  },

  active: {
    type: Boolean,
    default: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },

  tags: {
    type: [String],
    default: [],
  }
});

module.exports = mongoose.model("RoutineTask", routineTaskSchema);