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

const getUserRoutines = async(req, res) => {
  try {
    const userId = req.user._id;
    const routine = await RoutineTask.find({ userId });

    res.status(200).json(routine);
  } catch(error) {
    console.log("Error occured: ", error);
    res.status(500).json({ error: "Something went wrong while fetching routine"});
  }
}

const deleteRoutine = async(req, res) => {
  try {
    const userId = req.user._id;
    const taskId = req.params.taskId;

    const task = await RoutineTask.findById(taskId);
    if(!task) return res.status(404).json({ message: "Task not found"});

    // Check if task belongs to user
    if (task.userId.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const deletedTask = await RoutineTask.findOneAndDelete({ _id: taskId, userId });
    // if (!deletedTask) return res.status(404).json({ message: "Task not found or not authorized" });

    res.status(200).json({ message: "Task deleted successfully"});
  } catch(error) {
    console.log("Error occured: ", error);
    res.status(500).json({ error: "Something went wrong while deleting task"});
  }
}

const updateRoutine = async(req, res) => {
  try {
    const userId = req.user._id;
    const taskId = req.params.taskId;
    const { title, defaultDuration, frequency, daysOfWeek, timesPerWeek, active, tags } = req.body;

    const updateFields = {};
    if (title !== undefined) updateFields.title = title;
    if (defaultDuration !== undefined) updateFields.defaultDuration = defaultDuration;
    if (frequency !== undefined) updateFields.frequency = frequency;
    if (daysOfWeek !== undefined) updateFields.daysOfWeek = daysOfWeek;
    if (timesPerWeek !== undefined) updateFields.timesPerWeek = timesPerWeek;
    if (active !== undefined) updateFields.active = active;
    if (tags !== undefined) updateFields.tags = tags;

    // Validation based on frequency
    if (frequency === "fixed" && (!Array.isArray(daysOfWeek) || daysOfWeek.length === 0)) {
      return res.status(400).json({ message: "daysOfWeek required for fixed frequency" });
    }

    if (frequency === "flexible" && (typeof timesPerWeek !== "number" || timesPerWeek < 1)) {
      return res.status(400).json({ message: "Valid timesPerWeek required for flexible frequency" });
    }

    const task = await RoutineTask.findById(taskId);
    if(!task) return res.status(404).json({ message: "Task not found"});

    // Check if task belongs to user
    if (task.userId.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const updatedTask = await RoutineTask.findOneAndUpdate(
      { _id: taskId, userId },
      { $set: updateFields },
      { new: true }
    );
    // if (!deletedTask) return res.status(404).json({ message: "Task not found or not authorized" });

    res.status(200).json({ message: "Task updated successfully", updatedTask});
  } catch(error) {
    console.log("Error occured: ", error);
    res.status(500).json({ error: "Something went wrong while updating task"});
  }
}

module.exports = { createRoutine, getUserRoutines, deleteRoutine, updateRoutine };