import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faPen, faSave, faClose } from '@fortawesome/free-solid-svg-icons';

const FlashcardsHeader = ({ isEditing, openDeleteAllModal, handleEditToggle, handleStopEdit }) => {
	return (
		<div className="flex flex-row sm:items-center mb-6 justify-between sm:flex-wrap">
			<h1 className="text-4xl lg:text-5xl font-extrabold text-highlights dark:text-secondary mb-4 sm:mb-0">
				Flashcards
			</h1>
			<div className="sm:flex items-center space-x-4">
				{renderButtons(isEditing, openDeleteAllModal, handleEditToggle, handleStopEdit)}
			</div>
		</div>
	);
};

const renderButtons = (isEditing, openDeleteAllModal, handleEditToggle, handleStopEdit) => {
	const buttonClass = `p-2 rounded-lg flex items-center justify-center transition-colors duration-200 hover:bg-gray-200 dark:hover:bg-gray-600`;

	return (
		<>
			{/* Show "Edit" button when not in edit mode */}
			{!isEditing && (
				<button
					onClick={handleEditToggle}
					className={`${buttonClass} text-highlights dark:text-secondary`}>
					<FontAwesomeIcon icon={faPen} className="text-lg" />
					<span className="ml-2 font-psemibold">Edit</span>
				</button>
			)}

			{/* Show "Close" button when in edit mode */}
			{isEditing && (
				<button
					onClick={handleStopEdit}
					className={`${buttonClass} text-gray-800 dark:text-gray-300`}>
					<FontAwesomeIcon icon={faClose} className="text-lg" />
					<span className="ml-2 font-psemibold">Close</span>
				</button>
			)}
		</>
	);
};

export default FlashcardsHeader;
