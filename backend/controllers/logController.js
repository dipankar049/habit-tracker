const RoutineTask = require("../models/RoutineTask");
const TaskLog = require("../models/TaskLog");
const calculateXP = require("../utils/calculateXP");
const User = require("../models/User");

const markTaskCompleted = async (req, res) => {
  try {
    const userId = req.user._id;
    const { taskId, duration, completed = true } = req.body;

    if (!taskId || typeof duration !== "number") {
      return res.status(400).json({ message: "taskId and duration are required" });
    }

    const task = await RoutineTask.findById(taskId);
    if (!task || task.userId.toString() !== userId.toString()) {
      return res.status(404).json({ message: "Task not found or unauthorized" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // XP calculation
    const xpEarned = completed ? calculateXP(duration) : 0;

    // Today range
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    // Check if log exists for today
    const existingLog = await TaskLog.findOne({
      userId,
      taskId,
      date: { $gte: startOfDay, $lte: endOfDay }
    });

    if (existingLog) {
      // If changing from completed to not completed, subtract old XP
      if (existingLog.completed && !completed) {
        if(user.xp > 0) user.xp -= existingLog.xpEarned;
        existingLog.xpEarned = 0;
      }

      // If changing from not completed to completed, add new XP
      else if (!existingLog.completed && completed) {
        const newXP = calculateXP(duration);
        user.xp += newXP;
        existingLog.xpEarned = newXP;
      }

      // Update log fields
      existingLog.timeSpent = duration;
      existingLog.completed = completed;
      existingLog.date = new Date();

      await existingLog.save();
    } else {
      // New log
      const newLog = new TaskLog({
        userId,
        taskId,
        timeSpent: duration,
        completed,
        date: new Date(),
        xpEarned
      });
      await newLog.save();

      if (completed) {
        user.xp += xpEarned;
      }
    }

    await user.save();

    res.status(200).json({
      message: completed ? "Task marked as completed!" : "Task marked as not completed",
      xpEarned,
      triggerConfetti: completed
    });
  } catch (error) {
    console.error("Error marking task completed:", error);
    res.status(500).json({ message: "Server error while completing task" });
  }
};

const getDailyLogs = async (req, res) => {
  try {
    const userId = req.user._id;

    // Get start and end of today
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    // Find all logs created today by this user
    const dailyLog = await TaskLog.find({
      userId,
      date: { $gte: startOfDay, $lte: endOfDay }
    });

    res.status(200).json({ dailyLog });
  } catch (error) {
    console.error("Error fetching daily task log:", error);
    res.status(500).json({ message: "Server error while fetching task log" });
  }
};

const getWeeklySummary = async (req, res) => {
  try {
    const userId = req.user._id;
    const now = new Date();

    // Get start of week (Sunday)
    const startOfWeek = new Date(now);
    const dayOfWeek = startOfWeek.getDay(); // Sunday = 0
    startOfWeek.setDate(startOfWeek.getDate() - dayOfWeek);
    startOfWeek.setHours(0, 0, 0, 0);

    // End of week (Saturday)
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    // Fetch logs
    const logs = await TaskLog.find({
      userId,
      date: { $gte: startOfWeek, $lte: endOfWeek },
    });

    // Group logs by local date string
    const grouped = {};
    for (let i = 0; i < 7; i++) {
      const current = new Date(startOfWeek.getTime());
      current.setDate(current.getDate() + i);
      const key = current.toLocaleDateString('en-CA'); // local YYYY-MM-DD
      grouped[key] = [];
    }

    logs.forEach(log => {
      const key = new Date(log.date).toLocaleDateString('en-CA');
      if (grouped[key]) {
        grouped[key].push(log);
      }
    });

    res.status(200).json(grouped);
  } catch (err) {
    console.error("Weekly summary error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const getMonthlySummary = async (req, res) => {
  try {
    const userId = req.user._id;

    const year = parseInt(req.query.year);
    const month = parseInt(req.query.month); // 0 = Jan, 11 = Dec

    const now = new Date();

    // Fallback to current month if params not provided
    const targetYear = !isNaN(year) ? year : now.getFullYear();
    const targetMonth = !isNaN(month) ? month : now.getMonth();

    const startOfMonth = new Date(targetYear, targetMonth, 1);
    const endOfMonth = new Date(targetYear, targetMonth + 1, 0, 23, 59, 59, 999);

    const totalDays = endOfMonth.getDate();

    // Initialize grouped object with empty days
    const grouped = {};
    for (let i = 1; i <= totalDays; i++) {
      const current = new Date(targetYear, targetMonth, i);
      const key = current.toLocaleDateString('en-CA'); // Format: YYYY-MM-DD
      grouped[key] = [];
    }

    const logs = await TaskLog.find({
      userId,
      date: { $gte: startOfMonth, $lte: endOfMonth },
    });

    logs.forEach(log => {
      const key = new Date(log.date).toLocaleDateString('en-CA');
      if (grouped[key]) grouped[key].push(log);
    });

    res.status(200).json({
      year: targetYear,
      month: targetMonth,
      days: grouped,
    });
  } catch (err) {
    console.error("Monthly summary error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { markTaskCompleted, getDailyLogs, getWeeklySummary, getMonthlySummary };