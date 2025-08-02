const express = require("express");
const router = express.Router();
const {
  getUserRoutines,
  createRoutine,
  updateRoutine,
  deleteRoutine,
  // resetRoutine,
} = require("../controllers/routineController");
const authMiddleware = require("../middleware/authMiddleware");

router.use(authMiddleware);

router.get("/", getUserRoutines);
router.post("/", createRoutine);
router.put("/:taskId", updateRoutine);
router.delete("/:taskId", deleteRoutine);
// router.patch("/reset", resetRoutine);

module.exports = router;