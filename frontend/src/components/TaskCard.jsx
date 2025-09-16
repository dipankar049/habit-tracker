import axios from "axios";
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

export default function TaskCard({ task, setTasks }) {
  
  const [markLoading, setMarkLoading] = useState();
  const { token } = useAuth();

  // Handle status toggle
  const handleToggleStatus = async (taskId, currentStatus, duration) => {
    setMarkLoading(taskId);
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
      setMarkLoading();
    }
  };

  return (
    <div
      key={task._id}
      className="bg-white shadow-lg/10 rounded-lg py-2 px-4 flex flex-col md:flex-row md:items-center md:justify-between border border-gray-200"
    >
      <h2 className="text-lg font-semibold">{task.title}</h2>

      <div className="flex items-center justify-between gap-1 sm:gap-3 mt-1 sm:mt-3 md:mt-0">
        <input
          type="number"
          min="1"
          className="border border-gray-300 rounded px-2 py-1 w-20"
          value={task.defaultDuration}
          disabled={task.completed || markLoading === task._id}
          onChange={(e) =>
            setTasks((prev) =>
              prev.map((t) =>
                t._id === task._id
                  ? { ...t, defaultDuration: Number(e.target.value) }
                  : t
              )
            )
          }
        />

        <button
          onClick={() =>
            handleToggleStatus(
              task._id,
              !task.completed,
              task.defaultDuration
            )
          }
          disabled={markLoading === task._id}
          className={`px-3 py-1 text-sm sm:text-md rounded text-white shadow-lg/30 ${task.completed
            ? "bg-gray-500 hover:bg-gray-600"
            : "bg-green-600 hover:bg-green-700"
            }`}
        >
          {markLoading === task._id ? "Marking..." 
            : (task.completed ? "✅ Completed" : "⌛ Pending")
          }
        </button>
      </div>
    </div>
  )
}