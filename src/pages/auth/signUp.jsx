import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { register, reset } from '../../features/auth/authSlice';
import Textfield from '../../components/textfield';
import Button from '../../components/button';
import Modal from '../../components/Modals/Modal';
import { img } from '../../constants';
import TermsAndConditionsModal from '../../components/Policies/termsAndConditions';
import { Link, useNavigate } from 'react-router-dom';
import PasswordStrengthMeter from '../../components/Security/PasswordStrengthMeter';
import { useDarkMode } from '../../features/Darkmode/darkmodeProvider';
import { toast } from 'react-hot-toast';

const SuccessModal = ({ isOpen, onClose, firstname }) => {
	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 z-50 overflow-y-auto">
			<div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
				<div className="fixed inset-0 bg-zinc-500/75 dark:bg-zinc-900/75 transition-opacity" />

				<div
					className="relative transform overflow-hidden rounded-2xl bg-white dark:bg-darken 
					px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
					{/* Close Button */}
					<div className="absolute top-0 right-0 hidden pt-4 pr-4 sm:block">
						<button
							type="button"
							onClick={onClose}
							className="rounded-md bg-white dark:bg-darken text-zinc-400 dark:text-zinc-600 
								hover:text-zinc-500 dark:hover:text-zinc-400 focus:outline-none">
							<span className="sr-only">Close</span>
							<svg
								className="h-6 w-6"
								fill="none"
								viewBox="0 0 24 24"
								strokeWidth="1.5"
								stroke="currentColor">
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M6 18L18 6M6 6l12 12"
								/>
							</svg>
						</button>
					</div>

					<div className="sm:flex sm:items-start">
						{/* Content */}
						<div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
							<h3 className="text-lg font-pbold leading-6 text-zinc-900 dark:text-white">
								Welcome to QuickEase!
							</h3>

							<div className="mt-4 space-y-4">
								{/* Welcome Message */}
								<div className="space-y-2">
									<p className="text-sm text-zinc-500 dark:text-zinc-400">
										Hi{' '}
										<span className="font-psemibold text-primary dark:text-secondary">
											{firstname}
										</span>
										, thank you for joining QuickEase! We're excited to have you on board.
									</p>
									<p className="text-sm text-zinc-500 dark:text-zinc-400">
										To get started, please verify your email address by clicking the link
										we've sent you.
									</p>
								</div>

								{/* Status Indicator */}
								<div className="flex items-center gap-2 rounded-lg bg-primary/5 dark:bg-secondary/5 p-3">
									<div className="flex-shrink-0">
										<div className="h-2 w-2 rounded-full bg-primary dark:bg-secondary animate-pulse" />
									</div>
									<p className="text-sm font-pmedium text-primary dark:text-secondary">
										Verification email sent to your inbox
									</p>
								</div>

								{/* Next Steps */}
								<div className="rounded-lg border border-zinc-200 dark:border-zinc-800 p-3">
									<h4 className="text-sm font-psemibold text-zinc-900 dark:text-white mb-2">
										Next steps:
									</h4>
									<ul className="space-y-1">
										<li className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
											<svg
												className="h-4 w-4 text-primary dark:text-secondary"
												fill="none"
												viewBox="0 0 24 24"
												strokeWidth="1.5"
												stroke="currentColor">
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
												/>
											</svg>
											Check your email inbox
										</li>
										<li className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
											<svg
												className="h-4 w-4 text-primary dark:text-secondary"
												fill="none"
												viewBox="0 0 24 24"
												strokeWidth="1.5"
												stroke="currentColor">
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
												/>
											</svg>
											Click the Activate Button
										</li>
										<li className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
											<svg
												className="h-4 w-4 text-primary dark:text-secondary"
												fill="none"
												viewBox="0 0 24 24"
												strokeWidth="1.5"
												stroke="currentColor">
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
												/>
											</svg>
											Sign in to your account
										</li>
									</ul>
								</div>
							</div>
						</div>
					</div>

					{/* Actions */}
					<div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
						<button
							type="button"
							onClick={onClose}
							className="inline-flex w-full justify-center rounded-xl bg-primary dark:bg-secondary 
								px-3 py-2 text-sm font-psemibold text-white dark:text-dark shadow-sm hover:opacity-90 
								sm:ml-3 sm:w-auto">
							Got it
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default function SignUp() {
	const dispatch = useDispatch();
	const { isLoading, isSuccess, isError, message } = useSelector((state) => state.auth);

	const navigate = useNavigate();

	const [formData, setFormData] = useState({
		firstname: '',
		lastname: '',
		email: '',
		password: '',
		re_password: '',
	});

	const [formErrors, setFormErrors] = useState({
		email: false,
		name: false,
		password: false,
		cpassword: false,
		global: false,
	});

	const [isModalOpen, setIsModalOpen] = useState(false);

	const { firstname, lastname, email, password, re_password } = formData;

	const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

	const handleChange = (e) => {
		const { name, value } = e.target;

		if (name === 'firstname' || name === 'lastname') {
			const filteredValue = value.replace(/[^a-zA-Z\s]/g, '');
			setFormData((prev) => ({
				...prev,
				[name]: filteredValue,
			}));
		} else {
			setFormData((prev) => ({
				...prev,
				[name]: value,
			}));
		}
	};

	const [termsAccepted, setTermsAccepted] = useState(false);
	const [termsError, setTermsError] = useState(false);

	const validateForm = () => {
		const newFormErrors = {
			email: false,
			name: false,
			password: false,
			cpassword: false,
			global: false,
		};

		let isValid = true;

		// Name validation
		if (!firstname.trim() || !lastname.trim()) {
			newFormErrors.name = 'Both first and last names are required';
			isValid = false;
		}

		// Email validation
		if (!email.trim()) {
			newFormErrors.email = 'Email is required';
			isValid = false;
		} else if (!validateEmail(email)) {
			newFormErrors.email = 'Invalid email address';
			isValid = false;
		}

		// Password validation
		if (!password.trim()) {
			newFormErrors.password = 'Password is required';
			isValid = false;
		} else if (password.length < 12) {
			newFormErrors.password = 'Password must be at least 12 characters';
			isValid = false;
		}

		// Confirm password validation
		if (!re_password.trim()) {
			newFormErrors.cpassword = 'Please confirm your password';
			isValid = false;
		} else if (password !== re_password) {
			newFormErrors.cpassword = "Passwords don't match";
			isValid = false;
		}

		setFormErrors(newFormErrors);
		return isValid;
	};

	const handleSubmit = (e) => {
		e.preventDefault();

		// Initialize validation status
		let hasErrors = false;

		// Validate all form fields first
		const isFormValid = validateForm();

		// Check terms acceptance
		if (!termsAccepted) {
			setTermsError(true);
			hasErrors = true;
		} else {
			setTermsError(false);
		}

		// If either form validation failed or terms not accepted, show error toast
		if (!isFormValid || hasErrors) {
			let errorMessage = 'Please fix the following errors:';

			// Collect all error messages
			const errors = [];

			if (formErrors.name) errors.push('Names are required');
			if (formErrors.email) errors.push(formErrors.email);
			if (formErrors.password) errors.push(formErrors.password);
			if (formErrors.cpassword) errors.push(formErrors.cpassword);
			if (!termsAccepted) errors.push('Accept terms and conditions');

			// Show toast with all errors
			toast.error(
				<div className="space-y-1">
					<p className="font-medium">Please fix the following errors:</p>
					<ul className="list-disc list-inside text-sm">
						{errors.map((error, index) => (
							<li key={index}>{error}</li>
						))}
					</ul>
				</div>,
				{
					duration: 4000,
					position: 'top-center',
				}
			);
			return;
		}

		// If all validations pass, proceed with registration
		const userData = {
			firstname,
			lastname,
			email,
			password,
			re_password,
		};

		dispatch(register(userData))
			.unwrap()
			.then(() => {
				setIsModalOpen(true);
			})
			.catch((error) => {
				// Show error toast
				toast.error(
					<div className="space-y-1">
						<p className="font-medium">Registration failed</p>
						<p className="text-sm">{error.message}</p>
					</div>,
					{
						duration: 4000,
						position: 'top-center',
					}
				);

				setFormErrors((prev) => ({
					...prev,
					global: error.message,
				}));
			});
	};
	useEffect(() => {
		if (isError) {
			setFormErrors((prevErrors) => ({ ...prevErrors, global: message }));
			dispatch(reset());
		}
	}, [isError, message, dispatch]);

	const [showModal, setShowModal] = useState(false);

	const toggleModal = () => {
		setShowModal(!showModal);
	};

	const back = () => {
		navigate('/SignIn');
		dispatch(reset());
	};

	const { isDarkMode } = useDarkMode();

	const handleModalClose = () => {
		setIsModalOpen(false);
		navigate('/SignIn');
		dispatch(reset());
	};

	return (
		<div className="min-h-screen bg-white dark:bg-dark flex">
			{/* Left Panel - Minimalist Design */}
			<div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
				{/* Simple Gradient Background */}
				<div className="absolute inset-0">
					<div
						className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 
						dark:from-secondary/5 dark:via-transparent dark:to-primary/5"
					/>
				</div>

				{/* Mascot Container */}
				<div className="relative w-full h-full flex items-center justify-center">
					{/* Glowing Background Effect */}
					<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
						<div
							className="w-[600px] h-[600px] rounded-full 
							bg-gradient-radial from-primary/10 via-primary/5 to-transparent 
							dark:from-secondary/10 dark:via-secondary/5 dark:to-transparent 
							blur-3xl animate-pulse-slow"
						/>
					</div>

					{/* Large Mascot Image */}
					<div className="relative w-[130%] h-[130%] transform -translate-y-8">
						<img
							src={isDarkMode ? img.quick : img.Mascot}
							alt="QuickEase Mascot"
							className="w-full h-full object-contain
								transform hover:scale-105 transition-all duration-700
								animate-float-gentle filter drop-shadow-2xl"
						/>
					</div>
				</div>
			</div>

			{/* Right Panel - Form */}
			<div className="w-full lg:w-1/2 flex flex-col">
				<div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-12">
					<div className="w-full max-w-md space-y-8">
						{/* Logo - Mobile Only */}
						<div className="lg:hidden text-center mb-8">
							<h1 className="font-inc text-3xl">
								<span className="text-black dark:text-secondary">QUICK</span>
								<span className="text-primary dark:text-naeg">EASE</span>
							</h1>
						</div>

						{/* Form Header */}
						<div className="text-center">
							<h2 className="text-3xl font-pbold text-gray-900 dark:text-white">
								Create your account
							</h2>
							<p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
								Start your learning journey today
							</p>
						</div>

						{/* Form */}
						<form onSubmit={handleSubmit} className="mt-8 space-y-6">
							<div className="space-y-4">
								{/* Name Fields */}
								<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
									<div>
										<Textfield
											placeholder="First name"
											name="firstname"
											value={formData.firstname}
											onChange={handleChange}
											error={formErrors.name}
											required
										/>
									</div>
									<div>
										<Textfield
											placeholder="Last name"
											name="lastname"
											value={formData.lastname}
											onChange={handleChange}
											error={formErrors.name}
											required
										/>
									</div>
								</div>
								{formErrors.name && (
									<p className="text-red-500 text-sm">{formErrors.name}</p>
								)}

								{/* Email Field */}
								<div>
									<Textfield
										type="email"
										placeholder="Email address"
										name="email"
										value={formData.email}
										onChange={handleChange}
										error={formErrors.email}
										required
									/>
									{formErrors.email && (
										<p className="text-red-500 text-sm mt-1">{formErrors.email}</p>
									)}
								</div>

								{/* Password Fields */}
								<div className="space-y-4">
									<div>
										<Textfield
											type="password"
											placeholder="Password"
											name="password"
											value={formData.password}
											onChange={handleChange}
											error={formErrors.password}
											required
										/>
										<PasswordStrengthMeter password={password} />
										{formErrors.password && (
											<p className="text-red-500 text-sm mt-1">{formErrors.password}</p>
										)}
									</div>
									<div>
										<Textfield
											type="password"
											placeholder="Confirm password"
											name="re_password"
											value={formData.re_password}
											onChange={handleChange}
											error={formErrors.cpassword}
											required
										/>
										{formErrors.cpassword && (
											<p className="text-red-500 text-sm mt-1">{formErrors.cpassword}</p>
										)}
									</div>
								</div>
							</div>

							{/* Terms Checkbox */}
							<div className="space-y-2">
								<div className="flex items-center">
									<input
										type="checkbox"
										id="terms"
										checked={termsAccepted}
										onChange={(e) => {
											setTermsAccepted(e.target.checked);
											setTermsError(false);
										}}
										className={`w-4 h-4 text-primary border-gray-300 rounded 
											focus:ring-primary dark:focus:ring-secondary
											${termsError ? 'border-red-500 dark:border-red-500' : ''}`}
									/>
									<label
										htmlFor="terms"
										className={`ml-2 text-sm ${
											termsError
												? 'text-red-500 dark:text-red-400'
												: 'text-gray-600 dark:text-gray-400'
										}`}>
										I accept the{' '}
										<button
											type="button"
											onClick={toggleModal}
											className="text-primary dark:text-secondary hover:underline">
											terms of use
										</button>{' '}
										and{' '}
										<button
											type="button"
											onClick={toggleModal}
											className="text-primary dark:text-secondary hover:underline">
											privacy policy
										</button>
									</label>
								</div>
								{termsError && (
									<p className="text-sm text-red-500">
										Please accept the terms and conditions to continue
									</p>
								)}
							</div>

							{/* Submit Button */}
							<Button type="submit" isLoading={isLoading} className="w-full">
								Create Account
							</Button>

							{/* Sign In Link */}
							<p className="text-center text-sm text-gray-600 dark:text-gray-400">
								Already have an account?{' '}
								<button
									type="button"
									onClick={back}
									className="text-primary dark:text-secondary hover:underline font-medium">
									Sign in instead
								</button>
							</p>

							{/* Global Error */}
							{formErrors.global && (
								<div
									className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 
									border border-red-200 dark:border-red-800">
									<p className="text-sm text-red-600 dark:text-red-400">
										{formErrors.global}
									</p>
								</div>
							)}
						</form>
					</div>
				</div>
			</div>
			<TermsAndConditionsModal isOpen={showModal} onClose={toggleModal} />
			<SuccessModal
				isOpen={isModalOpen}
				onClose={handleModalClose}
				firstname={formData.firstname}
			/>
		</div>
	);
}
