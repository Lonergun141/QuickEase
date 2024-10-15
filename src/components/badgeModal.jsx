
import React from 'react'

const badgeModal= ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 h-full" onClick={handleOverlayClick}>
      <div className="bg-white dark:bg-darken rounded-lg shadow-lg p-4 max-w-md w-full mx-2 relative">
        <button className="absolute top-2 right-2 text-gray-600" onClick={onClose}>
          &times;
        </button>
        <header className="my-4 md:my-8">
          <h1 className="text-center font-pmedium text-3xl md:text-4xl dark:text-secondary">
            {title}
          </h1>
        </header>
        <div className="flex flex-col items-center w-full max-w-xl px-2 md:px-4">
          {children}
        </div>
      </div>
    </div>
  );
};

export default badgeModal;
