import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import TaskModal from "../components/TaskModal";
import TaskCard from "../components/TaskCard";
import EventCard from "../components/EventCard";

export default function Home() {
  const [tasks, setTasks] = useState([]);
  const [events, setEvents] = useState();
  const { token } = useAuth();

  const fetchTasks = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_NODE_URI}/routine`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTasks(res.data);
    } catch (err) {
      console.log(err.response?.data?.message || err.message);
    }
  };

  const fetchEvents = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_NODE_URI}/events/todayEvents`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEvents(res.data);
    } catch (err) {
      console.log(err.response?.data?.message || err.message);
    }
  };

  // Fetch tasks
  useEffect(() => {
    if (!token) return;
    fetchEvents();
    fetchTasks();
  }, [token]);

  // Handle status toggle
  const handleToggleStatus = async (taskId, currentStatus, duration) => {

    try {
      await axios.post(
        `${import.meta.env.VITE_NODE_URI}/logTask/complete`,
        { taskId, duration, completed: currentStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update state instantly
      setTasks((prev) =>
        prev.map((task) =>
          task._id === taskId ? { ...task, completed: currentStatus, defaultDuration: duration } : task
        )
      );
    } catch (err) {
      console.log(err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">My Routine</h1>
      </div>


      {/* Today's Tasks */}
      <section>
        <h2 className="text-lg sm:text-xl font-semibold text-green-700 mb-4 flex items-center gap-2">
          ✅ Today’s Tasks
        </h2>
        <div className="space-y-4">
          {events &&
            events.map((event) => (
              <EventCard
                key={event._id}
                event={event}
              />
            ))
          }
          {tasks.filter(task => task.isToday).length === 0 ? (
            <p className="text-gray-500 italic">No tasks scheduled for today.</p>
          ) : (
            tasks
              .filter(task => task.isToday)
              .map((task) => (
                <TaskCard
                  key={task._id}
                  task={task}
                  setTasks={setTasks}
                  handleToggleStatus={handleToggleStatus}
                />
              ))
          )}
        </div>
      </section>

      {/* Other Tasks */}
      <section>
        <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center gap-2 mt-4">
          📋 Other Tasks
        </h2>
        <div className="space-y-4">
          {tasks.filter(task => !task.isToday).length === 0 ? (
            <p className="text-gray-500 italic">No other tasks available.</p>
          ) : (
            tasks
              .filter(task => !task.isToday)
              .map((task) => (
                <TaskCard
                  key={task._id}
                  task={task}
                  setTasks={setTasks}
                  handleToggleStatus={handleToggleStatus}
                />
              ))
          )}
        </div>
      </section>
    </div>
  );
};