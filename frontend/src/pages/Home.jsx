import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import AddTaskModal from "../components/AddTaskModal";

export default function Home() {
  const [tasks, setTasks] = useState([]);
  const { token } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch tasks
  useEffect(() => {
    if (!token) return;

    const fetchTasks = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_NODE_URI}/routine`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setTasks(res.data);
        console.log("Routine fetched successfully");
      } catch (err) {
        console.log(err.response?.data?.message || err.message);
      }
    };

    fetchTasks();
  }, [token]);

  const handleTaskAdded = () => {
    // Re-fetch tasks after adding
    if (!token) return;
    axios
      .get(`${import.meta.env.VITE_NODE_URI}/routine`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setTasks(res.data))
      .catch((err) => console.log(err.message));
  };

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
          task._id === taskId ? { ...task, status: currentStatus, defaultDuration: duration } : task
        )
      );
    } catch (err) {
      console.log(err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Add Task Button */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 mb-6"
      >
        + Add Task
      </button>

      <AddTaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onTaskAdded={handleTaskAdded}
      />

      {/* Task List */}
      <div className="space-y-4">
        {tasks.length === 0 ? (
          <p className="text-gray-500">No tasks found.</p>
        ) : (
          tasks.map((task) => (
            <div
              key={task._id}
              className="bg-white shadow rounded-lg p-4 flex flex-col md:flex-row md:items-center md:justify-between border border-gray-200"
            >
              <h2 className="text-lg font-semibold">{task.title}</h2>

              <div className="flex items-center gap-3 mt-3 md:mt-0">
                <input
                  type="number"
                  min="1"
                  className="border border-gray-300 rounded px-2 py-1 w-20"
                  value={task.defaultDuration}
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
                  className={`px-3 py-1 rounded text-white ${
                    task.completed
                      ? "bg-gray-500 hover:bg-gray-600"
                      : "bg-green-600 hover:bg-green-700"
                  }`}
                >
                  {task.completed ? "Mark Pending" : "Mark Completed"}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
