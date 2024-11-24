import React from 'react';

const Modal = ({ isOpen, onClose, title, children }) => {
	if (!isOpen) return null;

	const handleOverlayClick = (e) => {
		if (e.target === e.currentTarget) {
			onClose();
		}
	};

	return (
		<div
			className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4"
			onClick={handleOverlayClick}>
			<div className="bg-white dark:bg-darken rounded-lg shadow-xl w-full max-w-2xl mx-auto overflow-hidden">
				<header className="bg-white dark:bg-darken px-6 py-4 flex justify-between items-center">
					<h1 className="font-pmedium text-2xl md:text-3xl text-gray-800 dark:text-secondary">
						{title}
					</h1>
					<button
						className="text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
						onClick={onClose}
						aria-label="Close modal">
						<svg
							className="w-6 h-6"
							fill="none"
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth="2"
							viewBox="0 0 24 24"
							stroke="currentColor">
							<path d="M6 18L18 6M6 6l12 12"></path>
						</svg>
					</button>
				</header>

				<div className="px-6 py-4 max-h-[calc(100vh-16rem)] overflow-y-auto">{children}</div>
			</div>
		</div>
	);
};

export default Modal;
