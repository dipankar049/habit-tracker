import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import TaskCard from "../components/TaskCard";
import EventCard from "../components/EventCard";
import { Link } from "react-router-dom";
import Loading from "../components/hierarchy/Loading";
import { delay } from "../util/delay";
import QuotesLoader from "../components/QuotesLoader";

export default function Home({ isFirstLoad, setIsFirstLoad }) {
  const [tasks, setTasks] = useState([]);
  const [events, setEvents] = useState();
  const { token, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showLoader, setShowLoader] = useState(isFirstLoad); // control quote loader visibility
  // Simulate an error
  // throw new Error("Oops! Something went wrong.");

  const fetchTasks = async () => {
    setLoading(true);
    // await delay(6000);
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
      if (err.response?.status == 401) logout();
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
      if (err.response?.status == 401) logout();
      console.log(err.response?.data?.message || err.message);
    }
  };

  const todayTasks = tasks.filter(task => task.isToday);
  const todayEvents = events || [];

  const totalTodayItems = todayTasks.length + todayEvents.length;

  // Fetch tasks
  useEffect(() => {
    if (!token) return;
    fetchEvents();
    fetchTasks();
  }, [token]);

  useEffect(() => {
    if (!isFirstLoad) return;

    let timer;
    const start = Date.now();

    const check = () => {
      const elapsed = Date.now() - start;
      if (!loading && elapsed >= 10000) {
        setShowLoader(false);
        setIsFirstLoad(false);
      } else {
        timer = setTimeout(check, 100);
      }
    };

    check();

    return () => clearTimeout(timer);
  }, [loading]);

  if (showLoader) return <QuotesLoader />;
  else if (loading) return <Loading message="Loading your routine..." />

  return (
    <div className="space-y-4 sm:space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="text-center space-y-2">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">
            My Routine
          </h1>
          <p className="text-gray-500 text-sm sm:text-base">
            Stay consistent. Build momentum every day.
          </p>
        </div>
      </div>


      {/* Today's Tasks */}
      {tasks.length === 0 ?
        <div className="flex flex-col items-center justify-center py-16 pt-30 text-center">
          <div className="text-5xl">📭</div>
          <p className="text-gray-600 font-medium">
            No routine set yet.
          </p>
          <p className="text-gray-400 text-sm">
            Start building your daily discipline.
          </p>
          <Link
            to="/routine"
            className="px-4 py-2 mt-2 rounded-xl text-white shadow-md 
    bg-gradient-to-r from-violet-600 to-purple-600 
    hover:from-violet-700 hover:to-purple-700 transition"
          >
            Set Routine
          </Link>
        </div>
        :
        (<div>
          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3 flex items-center justify-between">
              <span className="flex items-center gap-2">
                🌤 Today’s Tasks
              </span>

              <span className="text-sm bg-violet-100 text-violet-600 px-3 py-1 rounded-full">
                {totalTodayItems}
              </span>
            </h2>
            <div className="space-y-2">
              {events &&
                events.map((event) => (
                  <EventCard
                    key={event._id}
                    event={event}
                  />
                ))
              }
              {totalTodayItems === 0 ? (
                <p className="text-gray-500 italic">No tasks scheduled for today.</p>
              ) : (
                tasks
                  .filter(task => task.isToday)
                  .map((task) => (
                    <TaskCard
                      key={task._id}
                      task={task}
                      setTasks={setTasks}
                    />
                  ))
              )}
            </div>
          </section>


          <section>
            <h2 className="text-xl font-semibold text-gray-800 my-3 flex items-center gap-2">
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