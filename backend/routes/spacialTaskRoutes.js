const express = require("express");
const router = express.Router();
const {
  getEvents,
  addEvent,
  updateEvent,
  deleteEvent,
} = require("../controllers/calendarController");
const authMiddleware = require("../middleware/authMiddleware");

router.use(authMiddleware);

router.get("/", getEvents);
router.post("/", addEvent);
router.put("/:eventId", updateEvent);
router.delete("/:eventId", deleteEvent);

module.exports = router;