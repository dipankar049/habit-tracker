const express = require("express");
const router = express.Router();
const {
  markTaskCompleted,
  getDailyLogs,
  // getWeeklySummary,
  // getMonthlySummary,
  // getYearlySummary,
} = require("../controllers/logController");
const authMiddleware = require("../middleware/authMiddleware");

router.use(authMiddleware);

router.post("/complete", markTaskCompleted);
router.get("/daily", getDailyLogs);
// router.get("/weekly", getWeeklySummary);
// router.get("/monthly", getMonthlySummary);
// router.get("/yearly", getYearlySummary);

module.exports = router;