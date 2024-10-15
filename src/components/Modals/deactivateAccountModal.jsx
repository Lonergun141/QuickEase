import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Textfield from '../textfield';
import Button from '../button';
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
      setError('Incorrect Password');
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

  useEffect(() => {
    let timer;
    if (message) {
      timer = setTimeout(() => {
        setMessage('');
      }, 5000);
    }
    return () => clearTimeout(timer);
  }, [message]);

  const handleDeactivateAccount = async () => {
    if (!password) {
      setError('Please enter your current password.');
      return;
    }

    dispatch(deleteUser(password));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white dark:bg-dark p-8 rounded-lg shadow-2xl w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-secondary">Deactivate Account</h2>
        <p className="text-gray-600 mb-4">
          Enter your current password to deactivate your account. This action cannot be undone.
        </p>
        <Textfield
          type="password"
          placeholder="Enter your current password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          name="password"
          borderColor="border-gray-300"
          focusBorderColor="border-blue-500"
          paddingY="py-3"
        />
        {message && <p className="text-green-600 mt-4">{message}</p>}
        {error && <p className="text-red-600 mt-4">{error}</p>}
        <div className="mt-6 flex justify-end space-x-4">
          <Button onClick={onClose} className="bg-gray-500 hover:bg-gray-700">
            Cancel
          </Button>
          <Button onClick={handleDeactivateAccount} isLoading={isLoading}>
            Deactivate Account
          </Button>
        </div>
      </div>
    </div>
  );
};

DeactivateAccountModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default DeactivateAccountModal;