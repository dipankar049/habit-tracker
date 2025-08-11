import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";
import TaskModal from "../components/TaskModal";

export default function SetRoutine() {
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const { token } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchRoutine = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_NODE_URI}/routine/update`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(res.data);
    } catch (err) {
      console.log(err.response?.data?.message || err.message);
    }
  };

  const deleteTask = async (id) => {
    if (!confirm("Are you sure you want to delete this task?")) return;
    try {
      await axios.delete(`${import.meta.env.VITE_NODE_URI}/routine/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(tasks.filter((t) => t._id !== id));
    } catch (err) {
      console.log(err.response?.data?.message || err.message);
    }
  };

  const updateTask = async () => {
    try {
      await axios.put(
        `${import.meta.env.VITE_NODE_URI}/routine/${selectedTask._id}`,
        selectedTask,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTasks(
        tasks.map((t) => (t._id === selectedTask._id ? selectedTask : t))
      );
      setSelectedTask(null);
    } catch (err) {
      console.log(err.response?.data?.message || err.message);
    }
  };

  useEffect(() => {
    if (!token) return;
    fetchRoutine();
  }, [token]);

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold mb-5">Your Routine Tasks</h1>

      {tasks.length ? (
        <div className="flex flex-col gap-3">
          {tasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              onDelete={() => deleteTask(task._id)}
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

function TaskCard({ task, onDelete, onUpdate }) {
  return (
    <div className="bg-white shadow rounded-lg p-4 flex justify-between items-center border border-gray-200">
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
      <div className="flex gap-2">
        <button
          onClick={onUpdate}
          className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
        >
          Update
        </button>
        <button
          onClick={onDelete}
          className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
