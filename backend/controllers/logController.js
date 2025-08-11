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

    // Start of week (Sunday)
    const startOfWeek = new Date(now);
    const dayOfWeek = startOfWeek.getDay();
    startOfWeek.setDate(startOfWeek.getDate() - dayOfWeek);
    startOfWeek.setHours(0, 0, 0, 0);

    // End of week (Saturday)
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    // Fetch logs & populate task title
    const logs = await TaskLog.find({
      userId,
      date: { $gte: startOfWeek, $lte: endOfWeek },
    }).populate("taskId", "title"); 
    // "title" is the field in RoutineTask you want — adjust if your schema calls it differently

    // Prepare empty grouped structure for each day
    const grouped = {};
    for (let i = 0; i < 7; i++) {
      const current = new Date(startOfWeek.getTime());
      current.setDate(current.getDate() + i);
      const key = current.toLocaleDateString('en-CA');
      grouped[key] = [];
    }

    // Fill grouped with logs
    logs.forEach(log => {
      const key = new Date(log.date).toLocaleDateString('en-CA');
      if (grouped[key]) {
        grouped[key].push(log);
      }
    });

    // Convert to final array format
    const result = Object.entries(grouped).map(([date, tasks]) => {
      const totalMinutes = tasks.reduce((sum, t) => sum + (t.timeSpent || 0), 0);
      return {
        date,
        totalHours: +(totalMinutes / 60).toFixed(2),
        tasks: tasks.map(t => ({
          ...t.toObject(),
          taskName: t.taskId?.title || "Unnamed Task" // Add taskName for frontend
        }))
      };
    });

    res.status(200).json(result);

  } catch (err) {
    console.error("Weekly summary error:", err);
    res.status(500).json({ message: "Server error" });
  }
};



// controller/getMonthlySummary.js
const getMonthlySummary = async (req, res) => {
  try {
    const userId = req.user._id;
    const userCreatedAt = req.user.joinDate;

    const year = parseInt(req.query.year);
    const month = parseInt(req.query.month); // 0 = Jan, 11 = Dec

    const now = new Date();
    const targetYear = !isNaN(year) ? year : now.getUTCFullYear();
    const targetMonth = !isNaN(month) ? month : now.getUTCMonth();

    // UTC boundaries
    const startOfMonth = new Date(Date.UTC(targetYear, targetMonth, 1, 0, 0, 0, 0));
    const endOfMonth = new Date(Date.UTC(targetYear, targetMonth + 1, 0, 23, 59, 59, 999));

    const totalDays = new Date(Date.UTC(targetYear, targetMonth + 1, 0)).getUTCDate();
    const grouped = {};
    for (let i = 1; i <= totalDays; i++) {
      const key = new Date(Date.UTC(targetYear, targetMonth, i)).toISOString().split("T")[0];
      grouped[key] = [];
    }

    const logs = await TaskLog.find({
      userId,
      date: { $gte: startOfMonth, $lte: endOfMonth },
    }).populate("taskId", "title");

    const tasksMap = new Map();

    logs.forEach((logDoc) => {
      const log = logDoc.toObject ? logDoc.toObject() : logDoc;
      const key = new Date(log.date).toISOString().split("T")[0];
      if (!grouped[key]) grouped[key] = [];

      const taskId = log.taskId?._id ? String(log.taskId._id) : String(log.taskId);
      const taskTitle = log.taskId?.title || "Untitled Task";

      const enriched = {
        _id: log._id,
        taskId,
        taskTitle,
        date: log.date,
        completed: !!log.completed,
        timeSpent: Number(log.timeSpent || 0), // in minutes
        xpEarned: Number(log.xpEarned || 0),
        isSpecialTask: !!log.isSpecialTask,
      };

      grouped[key].push(enriched);

      if (taskId) {
        if (!tasksMap.has(taskId)) {
          tasksMap.set(taskId, {
            taskId,
            title: taskTitle,
            completedDays: new Set(),
            totalMinutes: 0,
          });
        }
        const t = tasksMap.get(taskId);
        t.totalMinutes += enriched.timeSpent;
        t.completedDays.add(Number(key.split("-")[2]));
      }
    });

    const tasks = Array.from(tasksMap.values())
      .map((t) => ({
        taskId: t.taskId,
        title: t.title,
        totalMinutes: t.totalMinutes,
        completedDays: Array.from(t.completedDays).sort((a, b) => a - b),
      }))
      .sort((a, b) => a.title.localeCompare(b.title));

    res.status(200).json({
      year: targetYear,
      month: targetMonth,
      days: grouped,
      tasks,
      userCreatedAt,
    });
  } catch (err) {
    console.error("Monthly summary error:", err);
    res.status(500).json({ message: "Server error" });
  }
};



module.exports = { markTaskCompleted, getDailyLogs, getWeeklySummary, getMonthlySummary };