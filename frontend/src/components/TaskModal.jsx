import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";

export default function TaskModal({
  isOpen,
  onClose,
  onTaskSaved,
  mode = "add",
  initialData = {}
}) {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    defaultDuration: "",
    frequency: "fixed",
    daysOfWeek: [],
    timesPerWeek: "",
    tags: []
  });

  // Prefill for update
  useEffect(() => {
    if (mode === "update" && initialData) {
      setForm({
        title: initialData.title || "",
        defaultDuration: initialData.defaultDuration || "",
        frequency: initialData.frequency || "fixed",
        daysOfWeek: initialData.daysOfWeek || [],
        timesPerWeek: initialData.timesPerWeek || "",
        tags: initialData.tags || []
      });
    }
  }, [initialData, mode]);

  const handleCheckboxChange = (dayIndex) => {
    if (form.daysOfWeek.includes(dayIndex)) {
      setForm({
        ...form,
        daysOfWeek: form.daysOfWeek.filter((d) => d !== dayIndex),
      });
    } else {
      setForm({
        ...form,
        daysOfWeek: [...form.daysOfWeek, dayIndex],
      });
    }
  };

  const handleSubmit = async () => {
    if (form.frequency === "fixed" && form.daysOfWeek.length === 0) {
      alert("Please select at least one day.");
      return;
    }
    try {
      if (mode === "add") {
        setLoading(true);
        await axios.post(`${import.meta.env.VITE_NODE_URI}/routine`, form, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else if (mode === "update" && initialData._id) {
        setLoading(true);
        await axios.put(`${import.meta.env.VITE_NODE_URI}/routine/${initialData._id}`, form, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      onTaskSaved(); // refresh list
      onClose();
      setForm({
        title: "",
        defaultDuration: "",
        frequency: "fixed",
        daysOfWeek: [],
        timesPerWeek: "",
        tags: []
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/10 backdrop-blur-xs">
      <div className="w-full max-w-md sm:mx-0 mx-6 bg-linear-to-br from-gray-200 via-white to-gray-300 p-6 rounded-xl">
        <h2 className="text-xl sm:text-2xl font-bold mb-4">
          {mode === "add" ? "Add Routine Task" : "Update Routine Task"}
        </h2>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          {/* Title */}
          <input
            type="text"
            placeholder="Task title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full px-2 p-1 sm:py-2 border rounded mb-3"
            required
          />

          {/* Default Duration */}
          <input
            type="number"
            placeholder="Default Duration (minutes)"
            value={form.defaultDuration}
            onChange={(e) => {
              const value = e.target.value;
              if (value === "" || (Number(value) >= 1 && Number(value) <= 300)) {
                setForm({ ...form, defaultDuration: parseInt(value) || "" });
              }
            }}
            onBlur={() => {
              if (form.defaultDuration === "") return;
              let value = Number(form.defaultDuration);
              if (isNaN(value) || value < 1) value = 1;
              if (value > 300) value = 300;
              setForm({ ...form, defaultDuration: value });
            }}
            className="w-full px-2 p-1 sm:py-2 border rounded mb-3"
            required
          />

          {/* Frequency */}
          <select
            value={form.frequency}
            onChange={(e) => setForm({ ...form, frequency: e.target.value })}
            className="w-full px-2 p-1 sm:py-2 border rounded mb-3"
          >
            <option value="fixed">Fixed</option>
            <option value="flexible">Flexible</option>
            <option value="alternate">Alternate</option>
          </select>

          {/* Days of Week (if fixed) */}
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
              onChange={(e) => {
                const value = Math.min(7, Math.max(1, Number(e.target.value)));
                setForm({ ...form, timesPerWeek: parseInt(value) });
              }}
              className="w-full px-2 p-1 sm:py-2 border rounded mb-3"
              required
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
            className="w-full px-2 p-1 sm:py-2 border rounded mb-3"
          />

          {/* Buttons */}
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-4 py-2 text-white rounded ${mode === "add" ? "bg-blue-600 hover:bg-blue-700" : "bg-green-600 hover:bg-green-700"}`}
            >
              {mode === "add" ? 
              (loading ? "Adding..." : "Add Task") 
              : (loading ? "Updating..." : "Update Task")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}