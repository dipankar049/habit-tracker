import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import "../style/addEventModal.css"

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
      const { addedEvent } = await res.json();
      refresh(addedEvent);
      onClose();
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
      className="addEditModal max-w-[300px] sm:max-w-[400px] p-4 sm:p-6"
      overlayClassName="overlay"
    >
      <h2 className="font-bold text-md sm:text-lg">Add Event</h2>

      <input
        type="text"
        placeholder="Task title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        disabled={loading}
        className="input-field my-1 sm:my-2 p-1 sm:p-2 text-sm sm:text-base"
      />

      <div className="modal-actions">
        <button 
          onClick={handleSubmit} 
          disabled={loading}
          className="btn px-2 sm:px-4 py-1 sm:py-2 text-xs sm:text-base"
        >
          {loading ? "Adding..." : "Add Task"}
        </button>
        <button 
          onClick={onClose} 
          disabled={loading}
          className="btn px-2 sm:px-4 py-1 sm:py-2 text-xs sm:text-base"
        >
          Cancel
        </button>
      </div>
    </Modal>
  );
}