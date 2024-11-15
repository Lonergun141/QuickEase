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
				<img
					src={img.sadboi}
					alt="Mascot"
					className="w-80 h-80 md:w-full md:h-full object-contain"
				/>
			</div>
			<div className="w-full md:w-1/2 flex flex-col items-start justify-start md:items-start p-4 md:p-8">
				<h1 className="text-start md:text-left font-pmedium text-2xl md:text-3xl lg:text-4xl mb-4 md:mb-6 dark:text-secondary">
					Forgot password?
				</h1>
				<p className="text-start md:text-left text-gray-700 mb-4 md:mb-6 dark:text-secondary">
					Please enter your email address to receive a code so that you can reset your
					password.
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
						<div
							className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
							role="alert">
							<strong className="font-bold">Error: </strong>
							<span className="block sm:inline">{formError}</span>
						</div>
					)}
					<Button type="submit" isLoading={isLoading}>
						Confirm
					</Button>
				</form>
			</div>
			<Modal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				title="Check Your Email"
				className="max-w-md">
				<div className="flex flex-col items-center p-2 sm:p-4">
					{/* Animated Email Icon */}
					<div className="relative mb-6">
						{/* Outer Circle with Gradient */}
						<div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full blur-xl animate-pulse-slow"></div>

						{/* Icon Container */}
						<div className="relative w-20 h-20 flex items-center justify-center">
							<div className="absolute inset-0 bg-gradient-to-br from-primary to-secondary rounded-full opacity-10"></div>

							{/* Envelope Animation */}
							<div className="relative w-12 h-12 text-primary dark:text-secondary animate-bounce-gentle">
								<div className="absolute inset-0 flex items-center justify-center">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 24 24"
										fill="currentColor"
										className="w-12 h-12">
										<path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z" />
										<path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z" />
									</svg>
								</div>
							</div>
						</div>
					</div>

					{/* Message Content */}
					<div className="text-center space-y-4">
						<h3 className="text-xl font-medium text-zinc-900 dark:text-zinc-100">
							Email Sent Successfully!
						</h3>

						<p className="text-sm text-zinc-600 dark:text-zinc-400 max-w-sm">
							We've sent a password reset link to your email address. Please check your inbox
							and follow the instructions.
						</p>
					</div>

					<div className="absolute inset-0 overflow-hidden pointer-events-none">
						<div className="absolute -top-2 -right-2 w-24 h-24 bg-primary/5 dark:bg-secondary/5 rounded-full blur-2xl"></div>
						<div className="absolute -bottom-2 -left-2 w-24 h-24 bg-secondary/5 dark:bg-primary/5 rounded-full blur-2xl"></div>
					</div>
				</div>
			</Modal>
		</div>
	);
}
