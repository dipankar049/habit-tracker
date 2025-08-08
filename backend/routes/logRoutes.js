const express = require("express");
const router = express.Router();
const {
  markTaskCompleted,
  getDailyLogs,
  getWeeklySummary,
  getMonthlySummary,
} = require("../controllers/logController");
const authMiddleware = require("../middleware/authMiddleware");

router.use(authMiddleware);

router.post("/complete", markTaskCompleted);
router.get("/daily", getDailyLogs);
router.get("/weekly", getWeeklySummary);
router.get("/monthly", getMonthlySummary);

module.exports = router;