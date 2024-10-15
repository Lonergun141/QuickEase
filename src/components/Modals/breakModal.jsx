import React from 'react';
import { useDispatch } from 'react-redux';
import { nextSession } from '../../features/Pomodoro/pomodoroSlice';

const BreakModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();

  const handleClose = () => {
    dispatch(nextSession());
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded shadow-md">
        <h2 className="text-2xl font-bold mb-4">Break Time</h2>
        <p className="mb-4">Take a break! Your next session will start soon.</p>
      </div>
    </div>
  );
};

export default BreakModal;
