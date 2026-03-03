import axios from "axios";
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { CheckCircle, RotateCcw, Clock } from "lucide-react";

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
      className={`bg-white rounded-2xl px-4 py-2 sm:py-3 
    transition-all duration-200 
    shadow-sm hover:shadow-md
    ${task.completed
          ? "bg-green-50/40"
          : "hover:border-violet-300"
        }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-4">

        {/* LEFT SIDE (Title + Status) */}
        <div className="flex items-center gap-1 sm:gap-2 min-w-0">
          {task.completed ? (
            <CheckCircle 
              size={18} 
              className="text-green-500 shrink-0" 
            />
          ) : (
            <Clock 
              size={18} 
              className="text-yellow-500 shrink-0" 
            />
          )}

          <h2
            className={`text-base sm:text-lg font-semibold truncate transition-all
              ${task.completed
                ? "text-gray-500"
                : "text-gray-800"
              }`}
          >
            {task.title}
          </h2>
        </div>

        {/* RIGHT SIDE (Duration + Button) */}
        <div className="flex items-center justify-between sm:justify-end gap-3">

          {/* Duration */}
          <div className="flex items-center gap-1 text-sm">
            <span className="text-gray-400">⏱</span>

            {task.completed ? (
              <span className="text-violet-500 px-2 py-1 bg-violet-50 rounded-md font-medium">
                {task.defaultDuration} min
              </span>
            ) : (
              <>
                <input
                  type="number"
                  min="1"
                  className="border border-gray-300 rounded-lg px-2 py-1 w-16 text-center 
                  focus:ring-2 focus:ring-violet-400 focus:outline-none
                  text-sm transition-all"
                  value={task.defaultDuration}
                  disabled={markLoading === task._id}
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
                <span className="text-gray-500">min</span>
              </>
            )}
          </div>

          {/* Button */}
          <button
            onClick={() =>
              handleToggleStatus(
                task._id,
                !task.completed,
                task.defaultDuration
              )
            }
            disabled={markLoading === task._id}
            className={`flex items-center gap-1.5 px-3 py-1.5 
          rounded-lg text-sm font-medium
          transition-all duration-200 active:scale-95
          ${task.completed
                ? "bg-gray-100 text-gray-600 hover:bg-gray-200"
                : "bg-violet-600 text-white hover:bg-violet-700"
              }
          disabled:opacity-70`}
          >
            {markLoading === task._id ? (
              "..."
            ) : task.completed ? (
              <>
                <RotateCcw size={14} />
                Undo
              </>
            ) : (
              <>
                <CheckCircle size={14} />
                Mark Done
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}