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

	const handleSubmit = (e) => {
		e.preventDefault();
		const newFormErrors = {
			email: email.trim() === '' || !validateEmail(email),
			name: firstname.trim() === '' || lastname.trim() === '',
			password: password.trim() === '' || password.length < 12,
			cpassword: password.trim() !== re_password.trim(),
		};

		setFormErrors(newFormErrors);

		if (Object.values(newFormErrors).some((error) => error)) {
			return;
		}

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
				if (error.message === 'This email is already registered.') {
					setFormErrors((prevErrors) => ({ ...prevErrors, email: true }));
				} else {
					setFormErrors((prevErrors) => ({ ...prevErrors, global: error.message }));
				}
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

	return (
		<div className="bg-white dark:bg-dark w-full h-screen flex flex-col items-center justify-between p-4">
			<header className="my-4 md:my-8">
				<h1 className="text-center font-inc text-3xl md:text-4xl">
					<span className="text-black dark:text-secondary">QUICK</span>
					<span className="text-primary dark:text-naeg">EASE</span>
				</h1>
			</header>
			<section className="flex-1 flex flex-col items-center w-full max-w-xl px-2 md:px-4">
				<h1 className="text-center font-pmedium text-4xl md:text-5xl lg:text-4xl mb-6 md:mb-8 dark:text-secondary">
					Create an Account
				</h1>
				<form className="w-full space-y-4 md:space-y-6" onSubmit={handleSubmit}>
					<Textfield
						placeholder="Firstname"
						name="firstname"
						value={formData.firstname}
						onChange={handleChange}
					/>
					{formErrors.name && (
						<span className="text-red-500 text-sm">Firstname and lastname are required</span>
					)}

					<Textfield
						placeholder="Lastname"
						name="lastname"
						value={formData.lastname}
						onChange={handleChange}
					/>
					{formErrors.name && (
						<span className="text-red-500 text-sm">Firstname and lastname are required</span>
					)}

					<Textfield
						type="email"
						placeholder="Email Address"
						name="email"
						value={formData.email}
						onChange={handleChange}
					/>
					{formErrors.email && (
						<span className="text-red-500 text-sm">
							{formErrors.email === true
								? 'Invalid email address'
								: 'This email is already registered.'}
						</span>
					)}

					<Textfield
						type="password"
						placeholder="Password"
						name="password"
						value={formData.password}
						onChange={handleChange}
					/>
					<PasswordStrengthMeter password={password} />
					{formErrors.password && (
						<span className="text-red-500 text-sm">
							Password must be at least 12 characters
						</span>
					)}

					<Textfield
						type="password"
						placeholder="Confirm Password"
						name="re_password"
						value={formData.re_password}
						onChange={handleChange}
					/>

					{formErrors.cpassword && (
						<span className="text-red-500 text-sm">Passwords do not match</span>
					)}

					<div className="flex items-center">
						<input type="checkbox" id="terms" className="mr-2" />
						<label
							htmlFor="terms"
							className="text-gray-700 dark:text-secondary underline cursor-pointer"
							onClick={toggleModal}>
							I accept the <a href="#">terms of use</a> and <a href="#">privacy policy</a> of
							the application
						</label>
					</div>
					<Button type="submit" isLoading={isLoading}>
						Sign up
					</Button>
					<div>
						<p className="text-center text-gray-700 mt-6 font-pregular dark:text-naeg">
							Already have an account?{' '}
							<span
								onClick={back}
								className="text-primary dark:text-secondary cursor-pointer">
								Sign In Now!
							</span>
						</p>
					</div>
					{formErrors.global && (
						<div
							className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
							role="alert">
							<strong className="font-bold">Error: </strong>
							<span className="block sm:inline">{formErrors.global}</span>
						</div>
					)}
				</form>
			</section>
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

			<Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Account created!">
				<div className="flex flex-col items-center">
					<img src={img.email} alt="Success" className="w-[250px] rounded-lg mb-4" />
					<p className="text-center text-gray-700 dark:text-secondary mb-6">
						Your account has been created successfully. Please check your email to verify your
						account.
					</p>
				</div>
			</Modal>
			<TermsAndConditionsModal isOpen={showModal} onClose={toggleModal} />
		</div>
	);
}
