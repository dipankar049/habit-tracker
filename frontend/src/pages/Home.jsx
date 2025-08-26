import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import TaskCard from "../components/TaskCard";
import EventCard from "../components/EventCard";
import { Link } from "react-router-dom";
import Loading from "../components/hierarchy/Loading";

export default function Home() {
  const [tasks, setTasks] = useState([]);
  const [events, setEvents] = useState();
  const { token, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [markLoading, setMarkLoading] = useState(false);
// Simulate an error
  // throw new Error("Oops! Something went wrong.");

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_NODE_URI}/routine`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTasks(res.data);
    } catch (err) {
      // if (!err.response) {
      //   // Could be no internet OR server is down/not running
      //   console.log("Unable to connect to server. Please check internet or try again later.");
      // } else if (err.response?.status === 500) {
      //   console.log("Server error");
      // }
      if(err.response?.status == 401) logout();
      console.log(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
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
      if(err.response?.status == 401) logout();
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
    setMarkLoading(true);
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
    } finally {
      setMarkLoading(false);
    }
  };

  if(loading) return <Loading message="Loading your routine..." />

  return (
    <div className="space-y-4 sm:space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 text-shadow-lg/10">My Routine</h1>
      </div>


      {/* Today's Tasks */}
      {tasks.length === 0 ?
        <div className="flex flex-col items-center mt-40">
          <p className="text-center">No task found</p>
          <Link
            to="/routine"
            className="px-4 sm:text-base py-2 mt-2 sm:mt-4 text-sm sm:text-md rounded text-white shadow-lg/30 bg-green-600 hover:bg-green-700"
          >
            Set Routine
          </Link>
        </div>
        :
        (<div>
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
                      markLoading={markLoading}
                      handleToggleStatus={handleToggleStatus}
                    />
                  ))
              )}
            </div>
          </section>


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
        )}
    </div>
  );
};