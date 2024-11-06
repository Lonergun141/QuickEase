import React, { useState, useEffect } from 'react';
import Textfield from '../../components/textfield';
import Button from '../../components/button';
import { useNavigate, useParams } from 'react-router-dom';
import { img } from '../../constants';
import { resetPasswordConfirm, reset } from '../../features/auth/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import Modal from '../../components/Modals/Modal';
import PasswordStrengthMeter from '../../components/Security/PasswordStrengthMeter';

export default function ResetPass() {
	const { uid, token } = useParams();
	const [formData, setFormData] = useState({
		new_password: '',
		re_new_password: '',
	});
	const { new_password, re_new_password } = formData;
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [modalMessage, setModalMessage] = useState('');
	const { isLoading, isError, isSuccess, message } = useSelector((state) => state.auth);

	const [formErrors, setFormErrors] = useState({
		new_password: false,
		re_new_password: false,
	});

	useEffect(() => {
		if (isError) {
			setModalMessage(message || 'An error occurred while resetting the password.');
			setIsModalOpen(true);
		}

		if (isSuccess) {
			setModalMessage(
				'Your password has been reset successfully. You can now log in with your new password.'
			);
			setIsModalOpen(true);
			navigate('/SignIn');
		}

		dispatch(reset());
	}, [isError, isSuccess, message, dispatch]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));

	
		if (name === 'new_password') {
			setFormErrors((prevErrors) => ({
				...prevErrors,
				new_password: !value
					? 'Password is required'
					: value.length < 12
					? 'Password must be at least 12 characters'
					: '',
			}));
		}

		if (name === 're_new_password') {
			setFormErrors((prevErrors) => ({
				...prevErrors,
				re_new_password: !value
					? 'Please confirm your password'
					: value !== formData.new_password
					? 'Passwords do not match'
					: '',
			}));
		}
	};

	const handleSubmit = (e) => {
		e.preventDefault();


		const newFormErrors = {
			new_password: !new_password
				? 'Password is required'
				: new_password.length < 12
				? 'Password must be at least 12 characters'
				: '',
			re_new_password: !re_new_password
				? 'Please confirm your password'
				: new_password !== re_new_password
				? 'Passwords do not match'
				: '',
		};

		setFormErrors(newFormErrors);

	
		if (Object.values(newFormErrors).some((error) => error)) return;

		const userData = {
			uid,
			token,
			new_password,
			re_new_password,
		};

		dispatch(resetPasswordConfirm(userData));
	};
	const handleCloseModal = () => {
		setIsModalOpen(false);
		dispatch(reset());
	};

	return (
		<div className="bg-white dark:bg-dark w-full h-screen flex flex-col md:flex-row items-center justify-evenly p-4 md:p-4">
			<div className="w-full md:w-1/2 flex justify-center items-center md:justify-center mb-8 md:mb-0 h-1/2 md:h-full">
				<img
					src={img.sadboi}
					alt="Mascot"
					className="w-80 h-80 md:w-full md:h-full object-contain"
				/>
			</div>
			<div className="w-full md:w-1/2 flex flex-col items-start md:items-center p-4 md:p-8">
				<h1 className="text-center md:text-left font-pmedium text-2xl md:text-3xl lg:text-4xl mb-4 md:mb-6 dark:text-secondary">
					Reset your password
				</h1>
				<p className="text-center md:text-left text-gray-700 mb-4 md:mb-6 dark:text-slate-500">
					Please enter a new password
				</p>
				<form className="w-full space-y-4 md:space-y-6" onSubmit={handleSubmit}>
					<Textfield
						name="new_password"
						type="password"
						placeholder="New Password"
						value={formData.new_password}
						onChange={handleChange}
					/>
					<PasswordStrengthMeter password={new_password} />
					{formErrors.new_password && (
						<span className="text-red-500 text-sm">
							Password must be at least 12 characters
						</span>
					)}
					<Textfield
						name="re_new_password"
						type="password"
						placeholder="Confirm New Password"
						value={formData.re_new_password}
						onChange={handleChange}
					/>
					{formErrors.re_new_password && (
						<span className="text-red-500 text-sm">{formErrors.re_new_password}</span>
					)}
					<Button type="submit" isLoading={isLoading}>
						Confirm
					</Button>
				</form>
			</div>

			<Modal isOpen={isModalOpen} onClose={handleCloseModal} title="Alert">
				<p className="text-center mb-4">{modalMessage}</p>
				<Button onClick={handleCloseModal}>Close</Button>
			</Modal>
		</div>
	);
}
