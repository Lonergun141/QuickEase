import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import Button from '../../components/button';
import { img } from '../../constants';

const TranscribeError = () => {
	const navigate = useNavigate();

	const handleGoBack = () => {
		navigate('/QuickEase/home');
	};

	return (
		<div className="flex flex-col items-center justify-center min-h-screen bg-secondary dark:bg-dark p-6">
			<div className="flex flex-col items-center bg-white dark:bg-darken shadow-lg rounded-lg p-8 max-w-lg">
				<div className="w-full md:w-1/2 flex justify-center items-center md:justify-center mb-8 md:mb-0 h-1/2 md:h-full">
					<img src={img.sadboi} alt="Mascot" className="w-80 h-80 md:w-full md:h-full object-contain" />
				</div>

				<h1 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-2 dark:text-secondary">
					Oops! Something went wrong.
				</h1>
				<p className="text-center text-gray-600 dark:text-naeg mb-6">
					We encountered an issue while processing your request. Make sure your images and files has text for
					Quickie to read.
				</p>

				<Button
					onClick={handleGoBack}
					className="w-full px-4 py-2 bg-blue-500 dark:bg-secondary dark:text-dark text-white rounded hover:bg-blue-600 transition dark:hover:bg-naeg">
					Go Back
				</Button>
			</div>
		</div>
	);
};

export default TranscribeError;
