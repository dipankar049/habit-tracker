import React, { useState, useEffect, useRef } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import addDays from "date-fns/addDays";
import startOfMonth from "date-fns/startOfMonth";
import endOfMonth from "date-fns/endOfMonth";
import startOfDay from "date-fns/startOfDay";
import endOfDay from "date-fns/endOfDay";
import enUS from "date-fns/locale/en-US";

import "react-big-calendar/lib/css/react-big-calendar.css";
import "../style/calendar.css"

import AddEventModal from "../components/AddEventModal";
import DeleteConfirmModal from "../components/DeleteConfirmModal";
import { useAuth } from "../contexts/AuthContext";
import Instructions from "../components/Instructions";
import Loading from "../components/hierarchy/Loading";

const locales = { "en-US": enUS };
const localizer = dateFnsLocalizer({ format, parse, startOfWeek, getDay, locales });

export default function CalendarPage() {
  const { token } = useAuth();

  const [events, setEvents] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState("month");
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);
  const [loadingEvents, setLoadingEvents] = useState(false);

  const longPressTimer = useRef(null);
  const longPressTriggered = useRef(false);

  // helper to compute fetch range based on view + date
  const getRangeFor = (view, date) => {
    if (!date) date = new Date();
    if (view === "month") {
      return [startOfMonth(date), endOfMonth(date)];
    }
    if (view === "week") {
      const start = startOfWeek(date, { weekStartsOn: 0 }); // Sunday start
      const end = addDays(start, 6);
      return [start, end];
    }
    if (view === "day") {
      return [startOfDay(date), endOfDay(date)];
    }
    // agenda or default -> fetch current month
    return [startOfMonth(date), endOfMonth(date)];
  };

  // Fetch events from backend for a range
  const fetchEvents = async (start, end) => {
    if (!token) return;
    setLoadingEvents(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_NODE_URI}/events?start=${start.toISOString()}&end=${end.toISOString()}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await res.json();
      // console.log()
      setEvents(
        (data || []).map((ev) => ({
          id: ev._id,
          title: (ev.completed ? "✅" : "") + ev.title,
          start: new Date(ev.scheduledDate),
          end: ev.endDate ? new Date(ev.endDate) : new Date(ev.scheduledDate),
          completed: ev.completed,
        }))
      );
    } catch (error) {
      console.error("Fetch events error:", error);
    } finally {
      setLoadingEvents(false);
    }
  };

  // initial load for current view/date
  useEffect(() => {
    const [s, e] = getRangeFor(currentView, currentDate);
    fetchEvents(s, e);
  }, []);

  // whenever date or view changes, refresh events
  useEffect(() => {
    const [s, e] = getRangeFor(currentView, currentDate);
    fetchEvents(s, e);
  }, [currentDate, currentView, token]);

  // Open Add Event modal on single click on empty slot
  const handleSelectSlot = (slotInfo) => {
    setSelectedSlot(slotInfo);
    setAddModalOpen(true);
  };

  // Toggle completion on single click event
  const toggleCompletion = async (event) => {
    try {
      await fetch(`${import.meta.env.VITE_NODE_URI}/events`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ eventId: event.id, completed: !event.completed }),
      });
      // refresh the current visible range
      const [s, e] = getRangeFor(currentView, currentDate);
      fetchEvents(s, e);
    } catch (error) {
      alert("Error toggling completion: " + (error?.message || error));
    }
  };

  // Handle long press on event (700ms)
  const handleMouseDown = (event) => {
    longPressTriggered.current = false;
    longPressTimer.current = setTimeout(() => {
      longPressTriggered.current = true;
      setEventToDelete(event);
      setDeleteModalOpen(true);
    }, 700);
  };

  const handleMouseUp = (event) => {
    clearTimeout(longPressTimer.current);
    if (!longPressTriggered.current) {
      toggleCompletion(event);
    }
  };

  const handleMouseLeave = () => {
    clearTimeout(longPressTimer.current);
  };

  // Delete event handler
  const deleteEvent = async () => {
    if (!eventToDelete) return;
    try {
      await fetch(`${import.meta.env.VITE_NODE_URI}/events/${eventToDelete.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const [s, e] = getRangeFor(currentView, currentDate);
      fetchEvents(s, e);
      setDeleteModalOpen(false);
      setEventToDelete(null);
    } catch (error) {
      alert("Error deleting event: " + (error?.message || error));
    }
  };

  // Custom event component to handle mouse & touch events
  const CustomEvent = ({ event }) => {
    const handleTouchStart = (e) => {
      e.stopPropagation(); // prevent triggering onSelectSlot (Add Task modal)
      longPressTriggered.current = false;
      longPressTimer.current = setTimeout(() => {
        longPressTriggered.current = true;
        setEventToDelete(event);
        setDeleteModalOpen(true);
      }, 700);
    };

    const handleTouchEnd = (e) => {
      clearTimeout(longPressTimer.current);
      if (!longPressTriggered.current) {
        toggleCompletion(event);
      }
    };

    return (
      <div
        onMouseDown={(e) => {
          e.stopPropagation();
          handleMouseDown(event);
        }}
        onMouseUp={(e) => {
          e.stopPropagation();
          handleMouseUp(event);
        }}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        style={{ cursor: "pointer", userSelect: "none" }}
        title={event.title}
      >
        {event.title}
      </div>
    );
  };


  // onNavigate called when user clicks Prev/Next/Today (date param is new date)
  const handleNavigate = (date, view) => {
    // 'view' param may be undefined so prefer currentView
    setCurrentDate(date);
    const usedView = view || currentView;
    const [s, e] = getRangeFor(usedView, date);
    fetchEvents(s, e);
  };

  // onView called when user clicks Month/Week/Day/Agenda
  const handleView = (view) => {
    setCurrentView(view);
    const [s, e] = getRangeFor(view, currentDate);
    fetchEvents(s, e);
  };

  if(loadingEvents) return <Loading message="Loading calender..." />

  return (
    <div>
      <h1 className="mb-1 text-center text-2xl sm:text-3xl font-bold">Calender</h1>
      <h1 className="mb-4 text-center text-md sm:text-lg">Schedule your important events on calender</h1>
      <div style={{ height: "700px" }}>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: "100%" }}
          selectable
          onSelectSlot={handleSelectSlot}
          components={{ event: CustomEvent }}
          // controlled props to make navigation reliable
          date={currentDate}
          view={currentView}
          onNavigate={handleNavigate}
          onView={handleView}
          // toolbar true by default; explicit to be safe
          toolbar
        />

        <AddEventModal
          isOpen={addModalOpen}
          onClose={() => setAddModalOpen(false)}
          slotInfo={selectedSlot}
          token={token}
          refresh={() => {
            setAddModalOpen(false);
            if (selectedSlot) {
              const [s, e] = getRangeFor(currentView, selectedSlot.start || new Date());
              fetchEvents(s, e);
            }
          }}
        />

        <DeleteConfirmModal
          isOpen={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          event={eventToDelete}
          token={token}
          onDelete={deleteEvent}
          confirmMessage={`Are you sure you want to delete "${eventToDelete?.title}"?`}
        />
      </div>
      <Instructions />
    </div>
  );
}
