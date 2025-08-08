import { useState } from "react";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";

export default function AddTaskModal({ isOpen, onClose, onTaskAdded }) {
  const { token } = useAuth();

  const [form, setForm] = useState({
    title: "",
    defaultDuration: "",
    frequency: "fixed",
    daysOfWeek: [],
    timesPerWeek: "",
    tags: []
  });

  const handleCheckboxChange = (day) => {
    setForm((prev) => ({
      ...prev,
      daysOfWeek: prev.daysOfWeek.includes(day)
        ? prev.daysOfWeek.filter((d) => d !== day)
        : [...prev.daysOfWeek, day]
    }));
  };

  const handleSubmit = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_NODE_URI}/routine`,
        form,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      onTaskAdded(); // refresh list
      onClose(); // close modal
    } catch (err) {
      console.error(err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white w-full max-w-md p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Add Routine Task</h2>

        {/* Title */}
        <input
          type="text"
          placeholder="Task title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="w-full p-2 border rounded mb-3"
        />

        {/* Default Duration */}
        <input
          type="number"
          placeholder="Default Duration (minutes)"
          value={form.defaultDuration}
          onChange={(e) => setForm({ ...form, defaultDuration: e.target.value })}
          className="w-full p-2 border rounded mb-3"
        />

        {/* Frequency */}
        <select
          value={form.frequency}
          onChange={(e) => setForm({ ...form, frequency: e.target.value })}
          className="w-full p-2 border rounded mb-3"
        >
          <option value="fixed">Fixed</option>
          <option value="flexible">Flexible</option>
          <option value="alternate">Alternate</option>
        </select>

        {/* Days of Week (only if fixed) */}
        {form.frequency === "fixed" && (
          <div className="mb-3">
            <p className="mb-1 font-semibold">Days of Week</p>
            <div className="grid grid-cols-4 gap-2">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                (day, idx) => (
                  <label key={idx} className="flex items-center gap-1">
                    <input
                      type="checkbox"
                      checked={form.daysOfWeek.includes(idx)}
                      onChange={() => handleCheckboxChange(idx)}
                    />
                    {day}
                  </label>
                )
              )}
            </div>
          </div>
        )}

        {/* Times per week (if flexible) */}
        {form.frequency === "flexible" && (
          <input
            type="number"
            placeholder="Times per week"
            value={form.timesPerWeek}
            onChange={(e) => setForm({ ...form, timesPerWeek: e.target.value })}
            className="w-full p-2 border rounded mb-3"
          />
        )}

        {/* Tags */}
        <input
          type="text"
          placeholder="Tags (comma separated)"
          value={form.tags.join(",")}
          onChange={(e) =>
            setForm({ ...form, tags: e.target.value.split(",") })
          }
          className="w-full p-2 border rounded mb-3"
        />

        {/* Buttons */}
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Add Task
          </button>
        </div>
      </div>
    </div>
  );
}
