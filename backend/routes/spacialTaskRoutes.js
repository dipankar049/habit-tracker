const express = require("express");
const router = express.Router();
const {
  getEvents,
  addEvent,
  updateEvent,
  deleteEvent,
  getTodayEvents,
} = require("../controllers/SpecialTaskController");
const authMiddleware = require("../middleware/authMiddleware");

router.use(authMiddleware);

router.get("/", getEvents);
router.post("/", addEvent);
router.put("/", updateEvent);
router.delete("/:eventId", deleteEvent);
router.get("/todayEvents", getTodayEvents);

module.exports = router;