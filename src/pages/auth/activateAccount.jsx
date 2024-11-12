import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { activate, reset } from '../../features/auth/authSlice';

// Simple Activation Button
const ActivationButton = ({ onClick, isLoading }) => {
	return (
		<button
			onClick={onClick}
			disabled={isLoading}
			className="group relative w-full sm:w-auto overflow-hidden rounded-xl bg-primary dark:bg-secondary
				px-8 py-3 transition-all duration-300 hover:shadow-lg hover:shadow-primary/25 
				dark:hover:shadow-secondary/25 disabled:opacity-70 disabled:cursor-not-allowed">
			<div className="relative flex items-center justify-center gap-2">
				{isLoading ? (
					<div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
				) : (
					<>
						<span className="font-psemibold text-white dark:text-dark">Activate Account</span>
						<svg
							className="w-5 h-5 text-white dark:text-dark transition-transform duration-300 
							group-hover:translate-x-1"
							fill="none"
							viewBox="0 0 24 24"
							strokeWidth={2}
							stroke="currentColor">
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
							/>
						</svg>
					</>
				)}
			</div>
		</button>
	);
};

// Simple Status Modal
const StatusModal = ({ isOpen, onClose, isError, message }) => {
	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 z-50 overflow-y-auto">
			<div className="min-h-screen px-4 flex items-center justify-center">
				{/* Backdrop */}
				<div className="fixed inset-0 bg-black/20 dark:bg-black/40 backdrop-blur-sm transition-opacity" />

				{/* Modal */}
				<div
					className="relative w-full max-w-sm transform overflow-hidden 
					rounded-2xl bg-white dark:bg-zinc-900 p-6 text-left shadow-xl transition-all">
					<div className="flex flex-col items-center text-center">
						{/* Status Icon */}
						<div
							className={`flex h-12 w-12 items-center justify-center rounded-full
							${isError ? 'text-red-500 dark:text-red-400' : 'text-emerald-500 dark:text-emerald-400'}`}>
							{isError ? (
								<svg
									className="h-6 w-6"
									fill="none"
									viewBox="0 0 24 24"
									strokeWidth={2}
									stroke="currentColor">
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
									/>
								</svg>
							) : (
								<svg
									className="h-6 w-6"
									fill="none"
									viewBox="0 0 24 24"
									strokeWidth={2}
									stroke="currentColor">
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
									/>
								</svg>
							)}
						</div>

						{/* Title & Message */}
						<div className="mt-4 space-y-2">
							<h3 className="text-lg font-pbold text-zinc-900 dark:text-white">
								{isError ? 'Activation Failed' : 'Account Activated!'}
							</h3>
							<p className="text-sm text-zinc-500 dark:text-zinc-400">
								{isError
									? message || 'Something went wrong. Please try again.'
									: 'Your account has been successfully activated.'}
							</p>
						</div>

						{/* Action Button */}
						<div className="mt-6 w-full space-y-3">
							<button
								onClick={onClose}
								className="w-full rounded-xl bg-zinc-900 dark:bg-white px-4 py-2.5
									text-sm font-psemibold text-white dark:text-zinc-900
									transition-all duration-300 hover:bg-zinc-700 dark:hover:bg-zinc-100">
								{isError ? 'Try Again' : 'Continue to Sign In'}
							</button>

							{isError && (
								<button
									onClick={() => window.location.reload()}
									className="w-full rounded-xl bg-zinc-100 dark:bg-zinc-800 px-4 py-2.5
										text-sm font-psemibold text-zinc-900 dark:text-white
										transition-all duration-300 hover:bg-zinc-200 dark:hover:bg-zinc-700">
									Refresh Page
								</button>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

const ActivateAccount = () => {
	const { uid, token } = useParams();
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const { isLoading, isError, message } = useSelector((state) => state.auth);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [activationAttempted, setActivationAttempted] = useState(false);

	const handleActivate = (e) => {
		e.preventDefault();
		const userData = { uid, token };
		dispatch(activate(userData));
		setActivationAttempted(true);
	};

	useEffect(() => {
		if (activationAttempted && !isLoading) {
			setIsModalOpen(true);
		}

		return () => {
			dispatch(reset());
		};
	}, [isLoading, activationAttempted, dispatch]);

	const handleCloseModal = () => {
		setIsModalOpen(false);
		if (!isError) {
			navigate('/SignIn');
		}
	};

	return (
		<div className="min-h-screen bg-zinc-50 dark:bg-dark flex flex-col items-center justify-center p-4">
			{/* Logo */}
			<div className="mb-8">
				<h1 className="text-3xl sm:text-4xl font-inc tracking-tight">
					<span className="text-black dark:text-secondary">QUICK</span>
					<span className="text-primary dark:text-naeg">EASE</span>
				</h1>
			</div>

			{/* Content Card */}
			<div
				className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl p-6 sm:p-8
				shadow-xl shadow-black/[0.05] dark:shadow-black/[0.1]">
				<div className="space-y-6 text-center">
					<div className="space-y-2">
						<h2 className="text-xl sm:text-2xl font-pbold text-zinc-900 dark:text-white">
							One Last Step!
						</h2>
						<p className="text-sm text-zinc-500 dark:text-zinc-400">
							Click below to activate your account and start your journey with QuickEase
						</p>
					</div>

					<ActivationButton onClick={handleActivate} isLoading={isLoading} />
				</div>
			</div>

			{/* Status Modal */}
			<StatusModal
				isOpen={isModalOpen}
				onClose={handleCloseModal}
				isError={isError}
				message={message}
			/>
		</div>
	);
};

export default ActivateAccount;
