import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Button from '../../components/button';
import { img } from '../../constants';

const TranscribeError = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const params = new URLSearchParams(location.search);
	const errorMessage = params.get('error') || 'An unknown error occurred. Please try again.';

	const handleGoBack = () => {
		navigate('/home');
	};

	return (
		<div className="flex flex-col items-center justify-center min-h-screen bg-secondary dark:bg-dark p-6">
			<div className="flex flex-col items-center bg-white dark:bg-darken shadow-lg rounded-lg p-8 max-w-lg">
				{/* Image Section */}
				<div className="w-full md:w-1/2 flex justify-center items-center mb-6">
					<img
						src={img.sadboi}
						alt="Mascot"
						className="w-80 h-80 md:w-full md:h-full object-contain"
					/>
				</div>

				{/* Title Section */}
				<h1 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-2 dark:text-secondary">
					Oops! Something went wrong.
				</h1>

				{/* Error Message Section */}
				<p className="text-center text-gray-600 dark:text-naeg mb-4">{errorMessage}</p>
				{/* Button Section */}
				<Button
					onClick={handleGoBack}
					className="w-full px-4 py-2 bg-blue-500 dark:bg-secondary dark:text-dark text-white rounded hover:bg-blue-600 transition dark:hover:bg-naeg">
					Try Again
				</Button>
			</div>
		</div>
	);
};

export default TranscribeError;
