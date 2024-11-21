import React, { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTimesCircle,
  faExclamationCircle,
  faInfoCircle,
  faTimes
} from '@fortawesome/free-solid-svg-icons';

const CustomModal = ({ isOpen, onClose, title, message, type = 'error' }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
   
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" 
        onClick={onClose}
      />
      

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <div 
          className="bg-white dark:bg-zinc-800 rounded-xl shadow-xl transform transition-all max-w-sm w-full"
          onClick={e => e.stopPropagation()}
        >
       
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
          >
            <FontAwesomeIcon icon={faTimes} className="text-xl" />
          </button>

          <div className="p-6">
   
            <div className={`mx-auto flex items-center justify-center h-12 w-12 rounded-full mb-4
              ${type === 'error' ? 'text-red-500' : ''}
              ${type === 'warning' ? 'text-amber-500' : ''}
              ${type === 'info' ? 'text-blue-500' : ''}`}
            >
              <FontAwesomeIcon 
                icon={
                  type === 'error' ? faTimesCircle :
                  type === 'warning' ? faExclamationCircle :
                  faInfoCircle
                }
                className="text-3xl"
              />
            </div>

            <h3 className="text-xl font-semibold text-center mb-2 dark:text-white">
              {title}
            </h3>

   
            <p className="text-gray-600 dark:text-gray-300 text-center mb-6">
              {message}
            </p>

  
            <div className="flex justify-center">
              <button
                onClick={onClose}
                className="px-6 py-2.5 bg-highlights dark:bg-darkS text-white rounded-lg
                  hover:bg-primary/90 dark:hover:bg-secondary/90 
                  transform transition-all duration-200 hover:scale-105"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomModal; 