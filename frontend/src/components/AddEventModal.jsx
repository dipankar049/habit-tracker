import React, { useState, useEffect } from "react";
import Modal from "react-modal";

Modal.setAppElement("#root");

export default function AddEventModal({ isOpen, onClose, slotInfo, token, refresh }) {
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setTitle("");
    }
  }, [isOpen]);

  const normalizeToUTCMidnight = (date) => {
    if (!date) return null;
    const d = new Date(date);
    return new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  };

  const handleSubmit = async () => {
    if (!title.trim()) return alert("Please enter a task title");
    setLoading(true);

    try {
      const scheduledDateUTC = normalizeToUTCMidnight(slotInfo?.start);
      // const endDateUTC = slotInfo?.end ? normalizeToUTCMidnight(slotInfo.end) : null;
      const res = await fetch(`${import.meta.env.VITE_NODE_URI}/events`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          scheduledDate: scheduledDateUTC.toISOString(),
          // endDate: endDateUTC ? endDateUTC.toISOString() : null,
        }),
      });

      if (!res.ok) throw new Error("Failed to add task");
      refresh();
    } catch (e) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Add Task"
      className="modal"
      overlayClassName="overlay"
    >
      <h2 className="text-xl font-bold">Add Event</h2>

      <input
        type="text"
        placeholder="Task title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        disabled={loading}
        className="input-field"
      />

      <div className="modal-actions">
        <button onClick={handleSubmit} disabled={loading}>
          {loading ? "Adding..." : "Add Task"}
        </button>
        <button onClick={onClose} disabled={loading}>
          Cancel
        </button>
      </div>
    </Modal>
  );
}