import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import TaskModal from "../components/TaskModal";
import TaskCard from "../components/TaskCard";

export default function Home() {
  const [tasks, setTasks] = useState([]);
  const { token } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  // Fetch tasks
  useEffect(() => {
    if (!token) return;
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
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">My Routine</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 shadow-md transition"
        >
          + Add Task
        </button>
      </div>

      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onTaskSaved={fetchTasks}
      />

      {/* Today's Tasks */}
      <section>
        <h2 className="text-xl font-semibold text-green-700 mb-4 flex items-center gap-2">
          ✅ Today’s Tasks
        </h2>
        <div className="space-y-4">
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
        <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center gap-2">
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