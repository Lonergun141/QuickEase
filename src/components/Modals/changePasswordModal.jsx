import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Textfield from '../textfield';
import Button from '../button';
import { resetPassword, logout, reset } from '../../features/auth/authSlice';

const ChangePasswordModal = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, isError, isSuccess, message: authMessage } = useSelector((state) => state.auth);

  const handleReset = useCallback(() => {
    dispatch(reset());
  }, [dispatch]);

  useEffect(() => {
    if (isError) {
      setError(authMessage || 'Failed to send reset email. Please try again.');
    }

    if (isSuccess && !isError) {
      setMessage('Password reset email sent successfully. You will be logged out in 5 seconds');
      setEmail('');
      setTimeout(() => {
        handleReset();
        navigate('/');
        onClose();
      }, 2000);
    }

    return handleReset;
  }, [isError, isSuccess, authMessage, dispatch, navigate, handleReset, onClose]);

  useEffect(() => {
    let timer;
    if (message) {
      timer = setTimeout(() => {
        setMessage('');
      }, 5000);
    }
    return () => clearTimeout(timer);
  }, [message]);

  const handlePasswordReset = async () => {
    setError('');
    if (!email) {
      setError('Please enter your email address.');
      return;
    }

    try {
      await dispatch(resetPassword({ email })).unwrap();
    } catch (err) {
      setError(err.message || 'Failed to send reset email. Please try again.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white dark:bg-dark p-8 rounded-lg shadow-2xl w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-secondary">Change Password</h2>
        <p className="text-gray-600 mb-4">Enter your email address to receive a link to reset your password.</p>
        <Textfield
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          name="email"
          borderColor="border-gray-300"
          focusBorderColor="border-blue-500"
          paddingY="py-3"
        />
        {message && <p className="text-green-600 mt-4">{message}</p>}
        {error && <p className="text-red-600 mt-4">{error}</p>}
        <div className="mt-6 flex justify-end space-x-4">
          <Button onClick={onClose} className="bg-gray-500 hover:bg-gray-700">
            Close
          </Button>
          <Button onClick={handlePasswordReset} isLoading={isLoading} disabled={isLoading}>
            Send Reset Email
          </Button>
        </div>
      </div>
    </div>
  );
};

ChangePasswordModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ChangePasswordModal;
