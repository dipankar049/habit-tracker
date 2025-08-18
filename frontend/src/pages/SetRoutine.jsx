import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";
import TaskModal from "../components/TaskModal";
import { Plus } from "lucide-react";
import Loading from "../components/hierarchy/Loading";

export default function SetRoutine() {
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const { token } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTaskAddModalOpen, setIsTaskAddModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchRoutine = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${import.meta.env.VITE_NODE_URI}/routine/update`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(res.data);
    } catch (err) {
      console.log(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteTask = async (id) => {
    if (!confirm("Are you sure you want to delete this task?")) return;
    setDeleteLoading(true);
    try {
      await axios.delete(`${import.meta.env.VITE_NODE_URI}/routine/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(tasks.filter((t) => t._id !== id));
    } catch (err) {
      console.log(err.response?.data?.message || err.message);
    } finally {
      setDeleteLoading(false);
    }
  };

  useEffect(() => {
    if (!token) return;
    fetchRoutine();
  }, [token]);

  if(loading) return <Loading message="Loading your routine..." />
  return (
    <div>
      <div className="flex justify-between items-center my-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-shadow-lg/10">Manage Routine</h1>
        <button
          onClick={() => setIsTaskAddModalOpen(true)}
          className="px-3 sm:px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 shadow-xl/30 transition flex items-center gap-1"
        >
          <Plus size={18} />
          <span className="hidden sm:inline">Add Task</span>
        </button>
      </div>

      <TaskModal
        isOpen={isTaskAddModalOpen}
        onClose={() => setIsTaskAddModalOpen(false)}
        onTaskSaved={fetchRoutine}
      />
      {tasks.length ? (
        <div className="flex flex-col gap-3">
          {tasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              onDelete={() => deleteTask(task._id)}
              deleteLoading={deleteLoading}
              onUpdate={() => {
                setSelectedTask({ ...task });
                setIsModalOpen(true);
              }}
            />
          ))}
        </div>
      ) : (
        <p>No task found</p>
      )}

      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onTaskSaved={fetchRoutine}
        mode="update"
        initialData={selectedTask}
      />

    </div>
  );
}

function TaskCard({ task, onDelete, onUpdate, deleteLoading = false }) {
  return (
    <div className="bg-white shadow-lg/30 rounded-lg px-4 py-2 flex justify-between items-center border border-gray-200">
      {/* Left side - task info */}
      <div>
        <h3 className="text-lg font-bold">{task.title}</h3>
        <p className="text-sm text-gray-600">
          Duration: {task.defaultDuration} min
        </p>
        <p className="text-sm text-gray-600">Frequency: {task.frequency}</p>
        {task.frequency === "fixed" && (
          <p className="text-xs text-gray-500">
            Days: {task.daysOfWeek.join(", ")}
          </p>
        )}
      </div>

      {/* Right side - buttons */}
      <div className="flex gap-2 flex-wrap">
    <button
      onClick={onUpdate}
      className="px-2 py-1 text-xs sm:px-3 sm:py-1 sm:text-sm bg-yellow-500 text-white rounded hover:bg-yellow-600 transition shadow-lg/20"
    >
      Update
    </button>
    <button
      onClick={onDelete}
      disabled={deleteLoading}
      className="px-2 py-1 text-xs sm:px-3 sm:py-1 sm:text-sm bg-red-500 text-white rounded hover:bg-red-600 transition shadow-lg/20"
    >
      Delete
    </button>
</div>

    </div>
  );
}
