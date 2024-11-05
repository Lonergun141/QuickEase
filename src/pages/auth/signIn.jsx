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

	const { user, isLoading, isError, isSuccess, message, canRetryLogin, retryTimerEnd } = useSelector(
		(state) => state.auth
	);

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
		<div className="bg-white dark:bg-dark min-h-screen flex flex-col justify-between">
			<header className="pt-8 md:pt-12">
				<h1 className="text-center font-inc text-3xl md:text-4xl">
					<span className="text-black dark:text-secondary">QUICK</span>
					<span className="text-primary dark:text-naeg">EASE</span>
				</h1>
			</header>
			<main className="flex-1 flex items-center justify-center px-4 md:px-8">
				<div className="w-full max-w-md">
					<h1 className="text-center font-pmedium text-4xl md:text-5xl lg:text-4xl mb-2 md:mb-4 text-primary dark:text-secondary">
						Welcome back!
					</h1>
					<p className="text-center text-gray-700 mb-6 font-pregular dark:text-naeg">
						Where even procrastination takes the express route to knowledge!
					</p>
					<form className="space-y-4 md:space-y-6 dark:bg-dark" onSubmit={handleSubmit}>
						<Textfield
							placeholder="Email"
							autoComplete="email" 
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							error={formErrors.email}
						/>
						{formErrors.email && <p className="text-red-500 text-sm">{formErrors.email}</p>}

						<Textfield
							type="password"
							placeholder="Password"
							autoComplete="current-password" 
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							error={formErrors.password}
						/>
						{formErrors.password && <p className="text-red-500 text-sm">{formErrors.password}</p>}

						<div className="text-right">
							<Link to="/ForgotPass" className="text-primary font-pregular dark:text-secondary">
								Forgot password?
							</Link>
						</div>
						<Button type="submit" isLoading={isLoading} disabled={!canRetryLogin}>
							{canRetryLogin ? 'Sign In' : `Too many failed attempts. Retry in ${retryTimer}s`}
						</Button>
						{formErrors.global && (
							<div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
								<strong className="font-bold">Error: </strong>
								<span className="block sm:inline">{formErrors.global}</span>
							</div>
						)}
					</form>
					<p className="text-center text-gray-700 mt-6 font-pregular dark:text-naeg">
						Don't have an account?{' '}
						<span onClick={go} className="text-primary dark:text-secondary cursor-pointer">
							Register Now!
						</span>
					</p>
				</div>
				<TermsAndConditionsModal isOpen={showModal} onClose={toggleModal} />
			</main>
			<footer className="py-4">
				<div className="text-center text-gray-700 cursor-pointer" onClick={toggleModal}>
					<a href="#" className="text-blue-500 dark:text-naeg">
						Terms of use
					</a>{' '}
					|{' '}
					<a href="#" className="text-blue-500 dark:text-naeg">
						Privacy policy
					</a>
				</div>
			</footer>
		</div>
	);
}
