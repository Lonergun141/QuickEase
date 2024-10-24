import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { resetPassword, logout, reset } from '../../features/auth/authSlice';

const ChangePasswordModal = ({ isOpen, onClose }) => {
	const [email, setEmail] = useState('');
	const [message, setMessage] = useState('');
	const [error, setError] = useState('');

	const dispatch = useDispatch();
	const navigate = useNavigate();
	const {
		isLoading,
		isError,
		isSuccess,
		message: authMessage,
	} = useSelector((state) => state.auth);

	const handleReset = useCallback(() => {
		dispatch(reset());
	}, [dispatch]);

	useEffect(() => {
		if (isError) {
			setError(authMessage || 'Failed to send reset email. Please try again.');
		}

		if (isSuccess && !isError) {
			setMessage('Password reset email sent successfully. Logging out in 2 seconds...');
			setEmail('');
			setTimeout(() => {
				handleReset();
				navigate('/');
				onClose();
			}, 2000);
		}

		return handleReset;
	}, [isError, isSuccess, authMessage, dispatch, navigate, handleReset, onClose]);

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
			<div className="bg-white dark:bg-darken p-8 rounded-lg shadow-lg w-full max-w-lg">
				{/* Modal Header */}
				<div className="text-start mb-4">
					<h2 className="text-3xl font-bold text-gray-800 dark:text-white">Change Password</h2>
					<p className="text-gray-600 dark:text-gray-300 mt-2">
						Enter your email to receive a password reset link.
					</p>
				</div>

				{/* Email Input */}
				<input
					type="email"
					placeholder="Enter your email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					className="w-full py-3 px-4 rounded-lg border border-gray-300 dark:bg-dark dark:text-white focus:ring-2 focus:ring-primary outline-none mb-4"
				/>

				{/* Feedback Messages */}
				{message && <p className="text-green-600 text-center mb-4">{message}</p>}
				{error && <p className="text-red-500 text-center mb-4">{error}</p>}

				{/* Buttons */}
				<div className="flex justify-end space-x-4">
					<button
						onClick={onClose}
						className=" hover:bg-gray-100 dark:hover:bg-gray-700 text-dark dark:text-secondary px-5 py-2 rounded-lg transition duration-200">
						Close
					</button>
					<button
						onClick={handlePasswordReset}
						className={`${
							isLoading ? 'bg-green-500' : 'bg-green-500'
						} hover:bg-green-700  text-white px-6 py-2 rounded-lg transition duration-200`}
						disabled={isLoading}>
						{isLoading ? 'Sending...' : 'Send Reset Email'}
					</button>
				</div>
			</div>
		</div>
	);
};

export default ChangePasswordModal;
