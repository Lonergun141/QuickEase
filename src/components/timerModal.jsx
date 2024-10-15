import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPause, faForward, faTimes } from '@fortawesome/free-solid-svg-icons';
import { img } from '../constants';

const TimerModal = ({ time, isRunning, onStartPause, onSkip, onClose, sessionType }) => {
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-darken rounded-lg shadow-lg overflow-hidden max-w-md w-full relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">
          <FontAwesomeIcon icon={faTimes} />
        </button>
        <div className="bg-blue-100">
          <img src={img.Pomo} className='w-full '/>
        </div>
        <div className="p-6">
          <div className="text-6xl font-bold text-center text-primary mb-2 dark:text-secondary">{formatTime(time)}</div>
          <p className="text-center text-gray-600 mb-6 dark:text-secondary">
            Break time! You deserve a rest. Good job!
          </p>
          <div className="flex justify-center space-x-4">
            <button className="p-2 dark:text-secondary" onClick={onStartPause}>
              <FontAwesomeIcon icon={isRunning ? faPause : faPlay} />
            </button>
            <button className="p-2 dark:text-secondary" onClick={onSkip}>
              <FontAwesomeIcon icon={faForward} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimerModal;