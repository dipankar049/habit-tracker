import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";
import TaskModal from "../components/TaskModal";
import { Plus } from "lucide-react";
import Loading from "../components/hierarchy/Loading";
import DeleteConfirmModal from "../components/DeleteConfirmModal";

export default function SetRoutine() {
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const { token } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTaskAddModalOpen, setIsTaskAddModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState();
  // const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);

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
    setDeleteLoading(id);
    try {
      await axios.delete(`${import.meta.env.VITE_NODE_URI}/routine/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(tasks.filter((t) => t._id !== id));
    } catch (err) {
      console.log(err.response?.data?.message || err.message);
    } finally {
      // await delay(1000);
      setDeleteModalOpen(false)
      setDeleteLoading();
    }
  };

  useEffect(() => {
    if (!token) return;
    fetchRoutine();
  }, [token]);

  if (loading) return <Loading message="Loading your routine..." />
  return (
    <div>
      <div className="flex flex items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            Manage Routine
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Create and manage your weekly habits
          </p>
        </div>

        <button
          onClick={() => setIsTaskAddModalOpen(true)}
          className="px-4 py-2 bg-violet-600 text-white rounded-xl 
          hover:bg-violet-700 transition flex items-center 
          justify-center gap-2 shadow-md"
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
              onDelete={() => {
                setTaskToDelete(task);
                setDeleteModalOpen(true);
              }}
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

      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onDelete={() => deleteTask(taskToDelete?._id)}
        confirmMessage={`Are you sure you want to delete ${taskToDelete?.title}?`}
      />

    </div>
  );
}

function TaskCard({ task, onDelete, onUpdate, deleteLoading }) {

  const dayMap = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const formattedDays =
    task.frequency === "fixed"
      ? task.daysOfWeek
        .sort((a, b) => a - b)
        .map((day) => dayMap[day])
      : [];

  return (
    <div className="bg-white rounded-2xl px-4 py-2
      shadow-sm hover:shadow-md transition-all 
      border border-gray-100"
    >

      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-4">

        {/* Left Section */}
        <div className="space-y-1">
          <h3 className="text-lg font-semibold text-gray-800">
            {task.title}
          </h3>
          <div className="flex gap-4">
            <p className="text-sm text-gray-500">
              ⏱ {task.defaultDuration} min
            </p>

            <p className="text-sm text-gray-500 capitalize">
              {task.frequency === "fixed" && "Fixed Schedule"}
              {task.frequency === "flexible" && `Flexible • ${task.timesPerWeek}x/week`}
              {task.frequency === "alternate" && "Alternate Days"}
            </p>
          </div>

          {task.frequency === "fixed" && (
            <div className="flex flex-wrap gap-1 mt-2">
              {formattedDays.map((day, index) => (
                <span
                  key={index}
                  className="text-[10px] sm:text-xs px-2 py-0.5 
              bg-violet-100 text-violet-600 
              rounded-full font-medium"
                >
                  {day}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Right Section Buttons */}
        <div className="flex gap-2">
          <button
            onClick={onUpdate}
            className="px-3 py-1.5 text-xs sm:text-sm
        bg-yellow-500 text-white 
        rounded-lg hover:bg-yellow-600 transition"
          >
            Update
          </button>

          <button
            onClick={onDelete}
            disabled={deleteLoading === task._id}
            className="px-3 py-1.5 text-xs sm:text-sm 
        bg-red-500 text-white 
        rounded-lg hover:bg-red-600 transition"
          >
            {deleteLoading === task._id ? "Deleting..." : "Delete"}
          </button>
        </div>

      </div>
    </div>
  );
}
