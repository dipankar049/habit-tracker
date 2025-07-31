const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },

  passwordHash: {
    type: String,
    required: true,
  },

  avatarUrl: {
    type: String,
    default: "",
  },

  xp: {
    type: Number,
    default: 0,
  },

  level: {
    type: Number,
    default: 1,
  },

  streak: {
    type: Number,
    default: 0,
  },

  joinDate: {
    type: Date,
    default: Date.now,
  },

  preferences: {
    theme: {
      type: String,
      enum: ["light", "dark"],
      default: "light",
    },
    motivationalQuotes: {
      type: Boolean,
      default: true,
    },
  },
});

module.exports = mongoose.model("User", userSchema);