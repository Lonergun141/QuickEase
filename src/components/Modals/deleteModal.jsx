import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faTimes } from '@fortawesome/free-solid-svg-icons';

const DeleteModal = ({ isOpen, onClose, onDelete, noteTitle }) => {
  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 px-4 py-6 overflow-hidden"
      onClick={handleOverlayClick}
    >
      <div 
        className="bg-white dark:bg-zinc-800 rounded-2xl shadow-2xl w-full max-w-md mx-auto overflow-hidden animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <header className="bg-zinc-50 dark:bg-zinc-900 px-6 py-4 flex justify-between items-center border-b border-zinc-200 dark:border-zinc-700">
          <div className="flex items-center justify-center space-x-3">
            <div className="bg-red-500/10 p-2 rounded-lg">
              <FontAwesomeIcon 
                icon={faTrash} 
                className="h-5 w-5 text-red-500" 
              />
            </div>
            <h4 className="text-lg font-semibold text-zinc-800 dark:text-zinc-100">
              Delete Note
            </h4>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
          >
            <FontAwesomeIcon icon={faTimes} className="h-5 w-5" />
          </button>
        </header>

        {/* Content */}
        <div className="px-6 py-6">
          <p className="text-zinc-600 dark:text-zinc-300 text-center mb-4">
            Are you sure you want to delete the note 
            <span className="font-semibold text-zinc-800 dark:text-zinc-100 mx-1">
              "{noteTitle}"
            </span>?
          </p>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 text-center">
            This action cannot be undone. The note will be permanently removed.
          </p>
        </div>

        {/* Footer */}
        <footer className="bg-zinc-50 dark:bg-zinc-900 px-6 py-4 flex justify-end space-x-3 border-t border-zinc-200 dark:border-zinc-700">
          <button
            onClick={onClose}
            className="px-4 py-2 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onDelete}
            className="px-4 py-2 bg-red-500 text-white hover:bg-red-600 rounded-lg transition-colors flex items-center space-x-2"
          >
            <FontAwesomeIcon icon={faTrash} className="h-4 w-4" />
            <span>Delete</span>
          </button>
        </footer>
      </div>
    </div>
  );
};

export default DeleteModal;