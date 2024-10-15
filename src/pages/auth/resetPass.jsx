import React, { useState, useEffect } from 'react';
import Textfield from '../../components/textfield';
import Button from '../../components/button';
import { useNavigate, useParams } from 'react-router-dom';
import { img } from '../../constants';
import { resetPasswordConfirm, reset } from '../../features/auth/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import Modal from '../../components/Modals/Modal';

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

	useEffect(() => {
		if (isError) {
			setModalMessage(message || 'An error occurred while resetting the password.');
			setIsModalOpen(true);
		}

		if (isSuccess) {
			setModalMessage('Your password has been reset successfully. You can now log in with your new password.');
			setIsModalOpen(true);
			navigate('/QuickEase-Web/SignIn');
		}

		dispatch(reset());
	}, [isError, isSuccess, message, dispatch]);

	const handleChange = (e) => {
		setFormData((prev) => ({
			...prev,
			[e.target.name]: e.target.value,
		}));
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		if (new_password !== re_new_password) {
			setModalMessage('Passwords do not match.');
			setIsModalOpen(true);
			return;
		}
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
				<img src={img.sadboi} alt="Mascot" className="w-80 h-80 md:w-full md:h-full object-contain" />
			</div>
			<div className="w-full md:w-1/2 flex flex-col items-start md:items-center p-4 md:p-8">
				<h1 className="text-center md:text-left font-pmedium text-2xl md:text-3xl lg:text-4xl mb-4 md:mb-6 dark:text-secondary">
					Reset your password
				</h1>
				<p className="text-center md:text-left text-gray-700 mb-4 md:mb-6 dark:text-slate-500">Please enter a new password</p>
				<form className="w-full space-y-4 md:space-y-6" onSubmit={handleSubmit}>
					<Textfield
						name="new_password"
						type="password"
						placeholder="New Password"
						value={formData.new_password}
						onChange={handleChange}
					/>
					<Textfield
						name="re_new_password"
						type="password"
						placeholder="Confirm New Password"
						value={formData.re_new_password}
						onChange={handleChange}
					/>
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
