const RoutineTask = require("../models/RoutineTask");

const createRoutine = async (req, res) => {
  try {
    const userId = req.user._id;
    const { title, defaultDuration, frequency, daysOfWeek, timesPerWeek, tags } = req.body;

    // Basic validations
    if (!title || !defaultDuration || !frequency) {
      return res.status(400).json({ message: "Title, duration, and frequency are required" });
    }

    const allowedFrequencies = ["fixed", "flexible", "alternate"];
    if (!allowedFrequencies.includes(frequency)) {
      return res.status(400).json({ message: "Invalid frequency type" });
    }

    // Conditional validation
    if (frequency === "fixed" && (!Array.isArray(daysOfWeek) || daysOfWeek.length === 0)) {
      return res.status(400).json({ message: "daysOfWeek required for fixed frequency" });
    }

    if (frequency === "flexible" && (typeof timesPerWeek !== "number" || timesPerWeek < 1)) {
      return res.status(400).json({ message: "Valid timesPerWeek required for flexible frequency" });
    }

    const newTask = new RoutineTask({
      userId,
      title,
      defaultDuration,
      frequency,
      daysOfWeek,
      timesPerWeek,
      tags,
    });

    await newTask.save();

    res.status(201).json({ message: "Task added to routine" });
  } catch (err) {
    console.error("Error occurred:", err);
    res.status(500).json({ message: "Server error while adding task" });
  }
};

module.exports = { createRoutine };