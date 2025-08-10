const RoutineTask = require("../models/RoutineTask");
const TaskLog = require("../models/TaskLog");

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

const getTodaysRoutine = async (req, res) => {
  try {
    const userId = req.user._id;

    // Fetch all routine tasks
    const routine = await RoutineTask.find({ userId });

    // Get today's logs
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const todaysLog = await TaskLog.find({
      userId,
      date: { $gte: startOfDay, $lte: endOfDay }
    });

    // Map today's logs for quick lookup
    const todayLogMap = new Map();
    todaysLog.forEach(log => {
      todayLogMap.set(log.taskId.toString(), log);
    });

    // Merge today's log data into routine
    let tasks = routine.map(task => {
      const log = todayLogMap.get(task._id.toString());
      return {
        ...task.toObject(),
        completed: log ? log.completed : false,
        defaultDuration: log ? log.timeSpent : task.defaultDuration,
        isToday: false,  // default
        daysLeft: null   // default
      };
    });

    // Handle "fixed" frequency
    const todayIdx = new Date().getDay();
    tasks = tasks.map(task => {
      if (task.frequency === "fixed") {
        if (task.daysOfWeek.includes(todayIdx)) {
          task.isToday = true;
        }
      }
      return task;
    });

    // Handle "alternate" frequency → need yesterday's logs
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const startOfYesterday = new Date(yesterday);
    startOfYesterday.setHours(0, 0, 0, 0);
    const endOfYesterday = new Date(yesterday);
    endOfYesterday.setHours(23, 59, 59, 999);

    const yesterdaysLog = await TaskLog.find({
      userId,
      date: { $gte: startOfYesterday, $lte: endOfYesterday }
    });

    const yesterdayLogMap = new Map();
    yesterdaysLog.forEach(log => {
      yesterdayLogMap.set(log.taskId.toString(), log);
    });

    tasks = tasks.map(task => {
      if (task.frequency === "alternate") {
        const yesterdayLog = yesterdayLogMap.get(task._id.toString());
        if (yesterdayLog && yesterdayLog.completed) {
          task.isToday = false;
        } else {
          task.isToday = true;
        }
      }
      return task;
    });

    // Handle "flexible" frequency → need weekly logs
    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    const weeklyLogs = await TaskLog.find({
      userId,
      date: { $gte: startOfWeek, $lte: endOfWeek }
    });

    // Count completions per task
    const weeklyCount = {};
    weeklyLogs.forEach(log => {
      if (log.completed) {
        const id = log.taskId.toString();
        weeklyCount[id] = (weeklyCount[id] || 0) + 1;
      }
    });

    tasks = tasks.map(task => {
      if (task.frequency === "flexible" && typeof task.timesPerWeek === "number") {
        const completedCount = weeklyCount[task._id.toString()] || 0;
        task.daysLeft = Math.max(task.timesPerWeek - completedCount, 0);
        // when days left is 0 then isToday false
        if(task.daysLeft > 0) task.isToday = true;
      }
      return task;
    });

    // Return final result
    res.status(200).json(tasks);

  } catch (err) {
    console.error("Error occurred: ", err);
    res.status(500).json({ error: "Something went wrong while fetching routine" });
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

module.exports = { createRoutine, getUserRoutines, deleteRoutine, updateRoutine, getTodaysRoutine };