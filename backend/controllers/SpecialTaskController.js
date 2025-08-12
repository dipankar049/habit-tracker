const SpecialTask = require("../models/SpecialTask");

const addEvent = async (req, res) => {
  try {
    const userId = req.user._id;
    let { title, description = "", scheduledDate, endDate } = req.body;

    title = title.trim();
    description = description.trim();

    if (!title || !scheduledDate)
      return res.status(400).json({ message: "Title and Scheduled date are required" });

    if (isNaN(Date.parse(scheduledDate)))
      return res.status(400).json({ message: "Scheduled date is invalid" });

    if (endDate && isNaN(Date.parse(endDate)))
      return res.status(400).json({ message: "End date is invalid" });

    if (endDate && new Date(endDate) < new Date(scheduledDate))
      return res.status(400).json({ message: "End date cannot be before Scheduled date" });

    const newEvent = new SpecialTask({ userId, title, description, scheduledDate, endDate });
    const addedEvent = await newEvent.save();

    res.status(201).json({ message: "Event added Successfully", addedEvent });
  } catch (err) {
    console.error("Error occurred:", err);
    res.status(500).json({ error: "Something went wrong while adding calendar task" });
  }
};

const getEvents = async (req, res) => {
  try {
    const userId = req.user._id;
    const { start, end } = req.query;

    if (!start || !end) {
      return res.status(400).json({ message: "Start and end dates are required" });
    }

    const startDate = new Date(start);
    const endDate = new Date(end);

    if (isNaN(startDate) || isNaN(endDate)) {
      return res.status(400).json({ message: "Invalid date format" });
    }

    // Query to find events that:
    // 1. Have scheduledDate between startDate and endDate (single or multi-day events starting in range)
    // OR
    // 2. Have endDate between startDate and endDate (multi-day events ending in range)
    // OR
    // 3. Start before startDate and end after endDate (events covering entire range)
    //
    // If endDate is missing, treat scheduledDate as single-day event date

    const query = {
      userId,
      $or: [
        {
          // Event starts in range
          scheduledDate: { $gte: startDate, $lte: endDate },
        },
        {
          // Event ends in range (only if endDate exists)
          endDate: { $exists: true, $ne: null, $gte: startDate, $lte: endDate },
        },
        {
          // Event starts before range and ends after range (spanning range)
          scheduledDate: { $lt: startDate },
          endDate: { $exists: true, $ne: null, $gt: endDate },
        },
      ],
    };

    const events = await SpecialTask.find(query).sort({ scheduledDate: 1 });

    res.status(200).json(events);
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ message: "Server error fetching calendar events" });
  }
};

const updateEvent = async (req, res) => {
  try {
    const { eventId, completed } = req.body;

    const updateFields = { completed };

    if (completed) {
      updateFields.completeAt = new Date();
    } else {
      updateFields.completeAt = null;
    }

    const updatedEvent = await SpecialTask.findByIdAndUpdate(
      eventId,
      updateFields,
      { new: true }
    );

    if (!updatedEvent) return res.status(404).json({ message: "Event not found" });

    res.status(200).json({ message: "Task updated successfully", updatedEvent });
  } catch (error) {
    console.error("Error updating event:", error);
    res.status(500).json({ message: "Server error while updating events" });
  }
};

const deleteEvent = async (req, res) => {
  try {
    const eventId = req.params.eventId;

    const deletedEvent = await SpecialTask.findByIdAndDelete(eventId);

    if (!deletedEvent) return res.status(404).json({ message: "Event not found" });

    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("Error deleting event:", error);
    res.status(500).json({ message: "Server error while deleting events" });
  }
};

const getTodayEvents = async(req, res) => {
  try {
    const userId = req.user._id;

    // Get start and end of today
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    // Find all logs scheduled today by this user
    const todaysEvents = await SpecialTask.find({
      userId,
      scheduledDate: { $gte: startOfDay, $lte: endOfDay }
    });

    res.status(200).json(todaysEvents);
  } catch (error) {
    console.error("Error fetching today's event:", error);
    res.status(500).json({ message: "Server error while fetching events" });
  }
}

module.exports = { addEvent, getEvents, updateEvent, deleteEvent, getTodayEvents };