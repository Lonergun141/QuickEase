import React, { useState, useEffect } from 'react';
import Button from '../../components/button';
import Modal from '../../components/Modals/Modal';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { activate, reset } from '../../features/auth/authSlice';

const ActivateAccount = () => {
	const { uid, token } = useParams();
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const { isLoading, isError, isSuccess, message } = useSelector((state) => state.auth);
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
		navigate('/QuickEase/SignIn');
	};

	return (
		<div className="bg-white dark:bg-dark w-full h-screen flex flex-col items-center p-4">
			<div className="mb-8">
				<h1 className="text-2xl md:text-3xl lg:text-4xl font-inc">
					<span className="text-black dark:text-secondary">QUICK</span>
					<span className="text-primary dark:text-naeg">EASE</span>
				</h1>
			</div>
			<div className="w-full md:w-1/2 lg:w-1/3 text-center flex flex-col items-center justify-center flex-grow">
				<h1 className="font-pmedium text-2xl md:text-3xl lg:text-4xl mb-4 dark:text-secondary">
					Activate Account
				</h1>
				<p className="text-gray- font-pregular mb-6 dark:text-slate-500">
					Activate and elevate your experience with our web app QuickEase. A single click is
					all it takes to unlock a seamless learning experience.
				</p>
				<Button type="button" onClick={handleActivate} isLoading={isLoading}>
					Activate
				</Button>
			</div>

			<Modal
				isOpen={isModalOpen}
				onClose={handleCloseModal}
				title={isError ? 'Error' : 'Success'}>
				<p className="text-center mb-4 font-pregular">
					{isError
						? message || 'An error occurred during activation. Please try again.'
						: 'Your account has been successfully activated!'}
				</p>
				<Button onClick={handleCloseModal}>Go to Login</Button>
			</Modal>
		</div>
	);
};
export default ActivateAccount;
