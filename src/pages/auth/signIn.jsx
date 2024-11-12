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
		<div className="min-h-screen bg-white dark:bg-dark flex">
			{/* Left Panel - Professional Branding */}
			<div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-darken">
				{/* Enhanced Background Elements */}
				<div className="absolute inset-0">
					{/* Modern Grid Pattern */}
					<div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.03]"></div>
					
					{/* Animated Accent Elements */}
					<div className="absolute inset-0">
						<div className="absolute w-[600px] h-[600px] bg-primary/10 rounded-full blur-[80px] -top-1/4 -left-1/4 animate-pulse-slow"></div>
						<div className="absolute w-[600px] h-[600px] bg-secondary/10 rounded-full blur-[80px] bottom-0 right-0 animate-pulse-slower"></div>
					</div>
					
					{/* Decorative Elements */}
					<div className="absolute inset-0">
						{[...Array(3)].map((_, i) => (
							<div
								key={i}
								className="absolute w-72 h-72 border border-primary/10 rounded-2xl"
								style={{
									top: `${20 + i * 30}%`,
									left: `${10 + i * 20}%`,
									transform: `rotate(${i * 15}deg)`,
									transition: 'all 0.5s ease-out',
								}}
							/>
						))}
					</div>
				</div>

				{/* Branding Content */}
				<div className="relative z-10 flex flex-col justify-center w-full p-16">
					<div className="max-w-xl mx-auto space-y-16">
						{/* Logo & Title Section */}
						<div className="space-y-8">
							<div className="space-y-4">
								<h1 className="font-inc text-6xl tracking-tight text-white">
									QUICK<span className="text-primary">EASE</span>
								</h1>
								<p className="text-2xl text-smenu font-plight leading-relaxed max-w-md">
									Where AI meets education for a smarter learning experience
								</p>
							</div>
							
							{/* Feature Tags */}
							<div className="flex items-center gap-4">
								{[
									{ text: 'AI-Powered', color: 'border-primary bg-primary/5' },
									{ text: 'Smart Learning', color: 'border-review bg-review/5' },
									{ text: 'Personalized', color: 'border-secondary bg-secondary/5' }
								].map((tag, index) => (
									<span 
										key={index}
										className={`px-4 py-1.5 rounded-lg text-white text-sm border ${tag.color}`}
									>
										{tag.text}
									</span>
								))}
							</div>
						</div>

						{/* Feature Cards - Enhanced Design */}
						<div className="space-y-5">
							{[
								{
									title: 'AI Summary',
									description: 'Transform lengthy content into concise key points',
									color: 'border-primary',
									hoverColor: 'group-hover:text-primary'
								},
								{
									title: 'Interactive Flashcards',
									description: 'Engage with dynamic learning materials',
									color: 'border-review',
									hoverColor: 'group-hover:text-review'
								},
								{
									title: 'AI-Powered Quizzes',
									description: 'Test your knowledge with adaptive assessments',
									color: 'border-secondary',
									hoverColor: 'group-hover:text-secondary'
								}
							].map((feature, index) => (
								<div 
									key={index} 
									className="group relative transform transition-all duration-300 hover:translate-x-2"
								>
									<div className={`p-6 rounded-xl bg-darkS/5 border-l-4 ${feature.color} hover:bg-darkS/10 transition-all duration-300`}>
										<h3 className={`text-lg font-psemibold text-white ${feature.hoverColor} transition-colors`}>
											{feature.title}
										</h3>
										<p className="mt-2 text-smenu group-hover:text-smenu/80 transition-colors">
											{feature.description}
										</p>
									</div>
								</div>
							))}
						</div>

						{/* Trust Indicators */}
						<div className="pt-8 border-t border-darkS/20">
							<div className="flex items-center gap-8">
								<div className="text-smenu text-sm">
									Trusted by USTP students
								</div>
								<div className="flex -space-x-2">
									{[...Array(4)].map((_, i) => (
										<div 
											key={i}
											className="w-8 h-8 rounded-full border-2 border-darken bg-primary/10"
										/>
									))}
								</div>
							</div>
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
										className="text-sm text-primary hover:text-primary/80 transition-colors"
								>
									Forgot password?
								</Link>
							</div>

							<Button
								type="submit"
								isLoading={isLoading}
								disabled={!canRetryLogin}
								className="w-full bg-highlights hover:bg-primary/90 text-white py-3 transition-colors"
							>
								{canRetryLogin ? 'Sign In' : `Too many attempts. Retry in ${retryTimer}s`}
							</Button>

							{formErrors.global && (
								<div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20">
									<p className="text-sm text-red-400">
										{formErrors.global}
									</p>
								</div>
							)}
						</form>

						<div className="text-center">
							<p className="text-darkS dark:text-smenu">
								Don't have an account?{' '}
								<span
									onClick={go}
									className="text-primary hover:text-primary/80 cursor-pointer transition-colors"
								>
									Register Now
								</span>
							</p>
						</div>
					</div>
				</div>

				<footer className="text-center mt-8">
					<div className="flex justify-center space-x-4 text-sm text-darkS dark:text-smenu">
						<button onClick={toggleModal} className="hover:text-primary transition-colors">
							Terms of use
						</button>
						<span>•</span>
						<button onClick={toggleModal} className="hover:text-primary transition-colors">
							Privacy policy
						</button>
					</div>
				</footer>
			</div>

			<TermsAndConditionsModal isOpen={showModal} onClose={toggleModal} />
		</div>
	);
}
