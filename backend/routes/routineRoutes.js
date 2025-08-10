const express = require("express");
const router = express.Router();
const {
  getUserRoutines,
  getTodaysRoutine,
  createRoutine,
  updateRoutine,
  deleteRoutine,
  // resetRoutine,
} = require("../controllers/routineController");
const authMiddleware = require("../middleware/authMiddleware");

router.use(authMiddleware);

router.get("/", getTodaysRoutine);
router.post("/", createRoutine);
router.get("/update", getUserRoutines);
router.put("/:taskId", updateRoutine);
router.delete("/:taskId", deleteRoutine);
// router.patch("/reset", resetRoutine);

module.exports = router;