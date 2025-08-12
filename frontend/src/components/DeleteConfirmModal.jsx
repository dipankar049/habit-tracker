import React from "react";
import Modal from "react-modal";
import "../style/deleteConfirmationModal.css"

export default function DeleteConfirmModal({ isOpen, onClose, event, token, onDelete }) {
  if (!event) return null;

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Delete Confirmation"
      className="modal"
      overlayClassName="overlay"
    >
      <h2>Delete Task?</h2>
      <p>Are you sure you want to delete "{event.title}"?</p>
      <div className="modal-actions">
        <button onClick={onDelete} className="btn-danger">
          Delete
        </button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </Modal>
  );
}
