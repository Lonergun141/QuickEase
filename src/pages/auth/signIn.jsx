import React, { useState, useEffect } from 'react';
import Textfield from '../../components/textfield';
import Button from '../../components/button';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login, reset, resetLoginAttempts } from '../../features/auth/authSlice';
import TermsAndConditionsModal from '../../components/Policies/termsAndConditions';

export default function SignIn() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [formErrors, setFormErrors] = useState({
		email: false,
		password: false,
		global: false,
	});

	const [retryTimer, setRetryTimer] = useState(null);

	const navigate = useNavigate();
	const dispatch = useDispatch();

	const { user, isLoading, isError, isSuccess, message, canRetryLogin, retryTimerEnd } =
		useSelector((state) => state.auth);

	useEffect(() => {
		if (isSuccess || user) {
			navigate('/Home');
		}

		if (isError) {
			setFormErrors((prevErrors) => ({
				...prevErrors,
				global: message,
			}));

			console.error('Login Error:', message);
		}

		if (!canRetryLogin && retryTimerEnd) {
			const interval = setInterval(() => {
				const remainingTime = Math.max(0, retryTimerEnd - Date.now());
				if (remainingTime === 0) {
					clearInterval(interval);
					dispatch(resetLoginAttempts());
				} else {
					setRetryTimer(Math.ceil(remainingTime / 1000));
				}
			}, 1000);

			return () => clearInterval(interval);
		}

		return () => {
			dispatch(reset());
		};
	}, [user, isError, isSuccess, message, navigate, dispatch, canRetryLogin, retryTimerEnd]);

	const validateForm = () => {
		const newErrors = {};
		if (!email) newErrors.email = 'Email is required';
		if (!password) newErrors.password = 'Password is required';
		setFormErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		if (!validateForm()) return;

		setFormErrors({
			email: false,
			password: false,
			global: false,
		});

		const userData = {
			email,
			password,
		};
		dispatch(login(userData));
	};

	const [showModal, setShowModal] = useState(false);

	const toggleModal = () => {
		setShowModal(!showModal);
	};

	const go = () => {
		navigate('/SignUp');
		dispatch(reset());
	};

	return (
		<div className="min-h-screen bg-zinc-50 dark:bg-dark flex">
			{/* Left Panel - Professional Branding with Dynamic Background */}
			<div
				className="hidden lg:flex lg:w-1/2 relative overflow-hidden 
				bg-zinc-50 dark:bg-dark border-r border-zinc-100 dark:border-zinc-800">
				{/* Background Elements */}
				<div className="absolute inset-0">
					{/* Light/Dark Mode Optimized Gradient */}
					<div
						className="absolute inset-0 bg-gradient-to-br 
						from-primary/5 via-zinc-50 to-secondary/5 
						dark:from-secondary/5 dark:via-dark dark:to-primary/5"
					/>

					{/* Dynamic Grid Pattern */}
					<div className="absolute inset-0">
						<div
							className="absolute w-full h-full pulse-bg 
							bg-[linear-gradient(rgba(0,0,0,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.05)_1px,transparent_1px)] 
							dark:bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)]
							bg-[size:48px_48px]"
						/>
					</div>
				</div>

				{/* Branding Content */}
				<div className="relative w-full h-full flex flex-col items-center justify-center p-16">
					{/* Logo & Brand Container */}
					<div className="text-center space-y-12">
						{/* Brand Name with Adaptive Glow */}
						<div className="relative">
							<div
								className="absolute -inset-2 bg-gradient-to-r 
								from-primary/20 to-secondary/20 
								dark:from-secondary/20 dark:to-primary/20 
								blur-2xl rounded-full opacity-75"
							/>
							<h1 className="relative font-inc text-8xl tracking-tight">
								<span className="text-zinc-800 dark:text-white">QUICK</span>
								<span className="text-primary dark:text-secondary">EASE</span>
							</h1>
						</div>
					</div>
				</div>
			</div>

			{/* Right Panel - Sign In Form */}
			<div className="w-full lg:w-1/2 flex flex-col justify-between p-8 sm:p-16 bg-white dark:bg-dark">
				<div className="lg:hidden text-center mb-8">
					<h1 className="font-inc text-4xl text-newTxt dark:text-white">
						QUICK<span className="text-primary">EASE</span>
					</h1>
				</div>

				<div className="flex-1 flex items-center justify-center">
					<div className="w-full max-w-md space-y-8">
						{/* Sign In Header */}
						<div className="text-center space-y-2">
							<h2 className="text-3xl font-psemibold text-newTxt dark:text-white">
								Welcome back
							</h2>
							<p className="text-darkS dark:text-smenu font-plight">
								Continue your learning journey
							</p>
						</div>

						{/* Sign In Form */}
						<form onSubmit={handleSubmit} className="space-y-6">
							<div className="space-y-4">
								<Textfield
									placeholder="Email"
									autoComplete="email"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									error={formErrors.email}
									className="w-full px-4 py-3 rounded-xl border border-darkS/20 dark:border-darkS/30 bg-white dark:bg-darken focus:border-primary dark:focus:border-primary focus:ring-1 focus:ring-primary"
								/>
								{formErrors.email && (
									<p className="text-red-500 text-sm ml-1">{formErrors.email}</p>
								)}

								<Textfield
									type="password"
									placeholder="Password"
									autoComplete="current-password"
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									error={formErrors.password}
									className="w-full px-4 py-3 rounded-xl border border-darkS/20 dark:border-darkS/30 bg-white dark:bg-darken focus:border-primary dark:focus:border-primary focus:ring-1 focus:ring-primary"
								/>
								{formErrors.password && (
									<p className="text-red-500 text-sm ml-1">{formErrors.password}</p>
								)}
							</div>

							<div className="flex justify-end">
								<Link
									to="/ForgotPass"
									className="text-sm text-primary dark:text-secondary hover:text-primary/80 transition-colors">
									Forgot password?
								</Link>
							</div>

							<Button
								type="submit"
								isLoading={isLoading}
								disabled={!canRetryLogin}
								className="w-full bg-highlights hover:bg-primary/90 text-white py-3 transition-colors">
								{canRetryLogin ? 'Sign In' : `Too many attempts. Retry in ${retryTimer}s`}
							</Button>

							{formErrors.global && (
								<div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20">
									<p className="text-sm text-red-400">{formErrors.global}</p>
								</div>
							)}
						</form>

						<div className="text-center">
							<p className="text-darkS dark:text-smenu">
								Don't have an account?{' '}
								<span
									onClick={go}
									className="text-primary dark:text-secondary hover:text-primary/80 cursor-pointer transition-colors">
									Register Now
								</span>
							</p>
						</div>
					</div>
				</div>

				<footer className="text-center mt-8">
					<div className="flex justify-center space-x-4 text-sm text-darkS dark:text-smenu">
						<button onClick={toggleModal} className="hover:text-primary transition-colors">
							Terms of use and Privacy Policy
						</button>
					</div>
				</footer>
			</div>

			<TermsAndConditionsModal isOpen={showModal} onClose={toggleModal} />
		</div>
	);
}
