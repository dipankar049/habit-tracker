import React from "react";
import Modal from "react-modal";
import "../style/deleteConfirmationModal.css"

export default function DeleteConfirmModal({ isOpen, onClose, confirmMessage, onDelete }) {
  if (!confirmMessage) return null;

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Delete Confirmation"
      className="delModal max-w-[300px] sm:max-w-[400px] p-4 sm:p-6"
      overlayClassName="overlay"
    >
      <h2 className="text-red-500 font-bold text-md sm:text-lg">Delete Task?</h2>
      <p className="text-sm sm:text-base">{confirmMessage}</p>
      <div className="modal-actions">
        <button onClick={onDelete} className="btn btn-danger px-2 sm:px-4 py-1 sm:py-2 text-xs sm:text-base">
          Delete
        </button>
        <button onClick={onClose} className="btn px-2 sm:px-4 py-1 sm:py-2 text-xs sm:text-base">Cancel</button>
      </div>
    </Modal>
  );
}
