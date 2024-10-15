import React, { useState, useEffect } from 'react';
import Textfield from '../../components/textfield';
import Button from '../../components/button';
import { img } from '../../constants';
import { resetPassword, reset } from '../../features/auth/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Modal from '../../components/Modals/Modal';

export default function ForgotPass() {
	const [email, setEmail] = useState('');
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [formError, setFormError] = useState('');

	const dispatch = useDispatch();
	const navigate = useNavigate();

	const { isLoading, isError, isSuccess, message } = useSelector((state) => state.auth);

	const handleSubmit = (e) => {
		e.preventDefault();
		setFormError('');

		if (!email) {
			setFormError('Email is required');
			return;
		}

		const userData = {
			email,
		};

		dispatch(resetPassword(userData));
	};

	useEffect(() => {
		if (isError) {
			setFormError(message || 'An error occurred. Please try again.');
		}
		if (isSuccess) {
			setIsModalOpen(true);
			setEmail('');
		}
		return () => {
			dispatch(reset());
		};
	}, [isError, isSuccess, message, dispatch]);

	return (
		<div className="bg-white dark:bg-dark w-full h-screen flex flex-col md:flex-row items-center justify-evenly p-4 md:p-4">
			<div className="w-full md:w-1/2 flex justify-center items-center md:justify-center mb-8 md:mb-0 h-1/2 md:h-full">
				<img src={img.sadboi} alt="Mascot" className="w-80 h-80 md:w-full md:h-full object-contain" />
			</div>
			<div className="w-full md:w-1/2 flex flex-col items-start justify-start md:items-start p-4 md:p-8">
				<h1 className="text-start md:text-left font-pmedium text-2xl md:text-3xl lg:text-4xl mb-4 md:mb-6 dark:text-secondary">
					Forgot password?
				</h1>
				<p className="text-start md:text-left text-gray-700 mb-4 md:mb-6 dark:text-secondary">
					Please enter your email address to receive a code so that you can reset your password.
				</p>
				<form className="w-full space-y-4 md:space-y-6" onSubmit={handleSubmit}>
					<Textfield
						type="email"
						placeholder="Email Address"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						error={formError}
					/>
					{formError && (
						<div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
							<strong className="font-bold">Error: </strong>
							<span className="block sm:inline">{formError}</span>
						</div>
					)}
					<Button type="submit" isLoading={isLoading}>
						Confirm
					</Button>
				</form>
			</div>
			<Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Email Sent!">
				<div className="flex flex-col items-center">
					<img src={img.email} alt="Success" className="w-[250px] rounded-lg mb-4" />
					<p className="text-center text-gray-700 dark:text-secondary mb-6">Check your email to proceed in resetting your password.</p>
				</div>
			</Modal>
		</div>
	);
}
