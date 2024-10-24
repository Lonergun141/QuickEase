import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { deleteUser, reset, logout } from '../../features/auth/authSlice';

const DeactivateAccountModal = ({ isOpen, onClose }) => {
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, isError, isSuccess } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isError) {
      setError('Incorrect password.');
    }

    if (isSuccess) {
      setMessage('Account deactivated successfully. Logging out in 5 seconds...');
      setTimeout(() => {
        dispatch(logout());
        navigate('/');
      }, 5000);
    }

    return () => {
      dispatch(reset());
    };
  }, [isError, isSuccess, dispatch, navigate]);

  const handleDeactivateAccount = async () => {
    setError('');
    if (!password) {
      setError('Please enter your current password.');
      return;
    }
    dispatch(deleteUser(password));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white dark:bg-darken p-8 rounded-lg shadow-lg w-full max-w-lg">
        
        {/* Modal Header */}
        <div className="text-start mb-4">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Deactivate Account</h2>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Enter your password to deactivate your account. This action cannot be undone.
          </p>
        </div>

        {/* Password Input */}
        <input
          type="password"
          placeholder="Enter your current password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full py-3 px-4 rounded-lg border border-gray-300 dark:bg-dark dark:text-white focus:ring-2 focus:ring-primary outline-none mb-4"
        />

        {/* Feedback Messages */}
        {message && <p className="text-green-600 text-center mb-4">{message}</p>}
        {error && <p className="text-red-600 text-center mb-4">{error}</p>}

        {/* Buttons */}
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className=" hover:bg-gray-100 dark:text-secondary dark:hover:bg-gray-700 text-dark px-5 py-2 rounded-lg transition duration-200">
            Cancel
          </button>
          <button
            onClick={handleDeactivateAccount}
            className={`${
              isLoading ? 'bg-red-400' : 'bg-red-500 '
            } hover:bg-red-700 text-white px-6 py-2 rounded-md transition duration-200`}
            disabled={isLoading}>
            {isLoading ? 'Deactivating...' : 'Deactivate Account'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeactivateAccountModal;
