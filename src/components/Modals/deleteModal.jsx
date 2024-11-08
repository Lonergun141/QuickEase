import React from 'react';

const DeleteModal = ({ isOpen, onClose, onDelete, noteTitle }) => {
	if (!isOpen) return null;

	const handleOverlayClick = (e) => {
		if (e.target === e.currentTarget) {
			onClose();
		}
	};

	return (
		<div
			className="fixed inset-0 flex  items-center justify-center bg-black bg-opacity-50 z-100"
			onClick={handleOverlayClick}>
			<div className="bg-white dark:bg-darken rounded-lg shadow-xl w-full max-w-md mx-auto overflow-hidden">
				<header className="bg-secondary dark:bg-darken px-6 py-4 flex justify-between items-center">
					<h1 className="font-pmedium text-2xl text-gray-800 dark:text-secondary">
						Delete Note
					</h1>
				</header>

				<div className="px-6 py-4">
					<p className="text-start font-pregular text-gray-700 dark:text-gray-300 mb-4">
						Are you sure you want to delete the note titled "<strong>{noteTitle}</strong>"?
					</p>
				</div>

				<footer className="bg-secondary dark:bg-darken px-6 py-4 flex justify-end space-x-4">
					<button
						className=" hover:bg-gray-200 text-gray-300 dark:text-secondary dark:hover:bg-gray-700 font-bold py-2 px-4 rounded transition-colors"
						onClick={onClose}>
						Cancel
					</button>
					<button
						className="bg-red-500  hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition-colors"
						onClick={onDelete}>
						Delete
					</button>
				</footer>
			</div>
		</div>
	);
};

export default DeleteModal;
