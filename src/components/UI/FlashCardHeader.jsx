import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faPen, faSave, faClose } from '@fortawesome/free-solid-svg-icons';

const FlashcardsHeader = ({ isEditing, openDeleteAllModal, handleEditToggle, handleStopEdit }) => {
	return (
		<>
			<div className="flex flex-col sm:flex-row sm:items-center mb-6 justify-between">
				<h1 className="text-4xl lg:text-5xl font-extrabold text-highlights dark:text-secondary mb-4 sm:mb-0">Flashcards</h1>
				<div className="hidden sm:flex items-center space-x-4">
					{renderButtons(isEditing, openDeleteAllModal, handleEditToggle, handleStopEdit)}
				</div>
			</div>

			{/* Bottom bar for small screens */}
			<div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-darken shadow-lg sm:hidden z-20">
				<div className="flex justify-around items-center h-16">
					{renderButtons(isEditing, openDeleteAllModal, handleEditToggle, handleStopEdit, true)}
				</div>
			</div>

			{/* Spacer to prevent content from being hidden behind the bottom bar on small screens */}
			<div className="h-16 sm:h-0"></div>
		</>
	);
};

const renderButtons = (isEditing, openDeleteAllModal, handleEditToggle, handleStopEdit, isSmallScreen = false) => {
	const buttonClass = `p-2 rounded-lg flex items-center justify-center transition-colors duration-200 hover:bg-gray-200 dark:hover:bg-gray-600`;

	return (
		<>
			{isEditing && (
				<button onClick={openDeleteAllModal} className={`${buttonClass} bg-red-500 text-white`}>
					<FontAwesomeIcon icon={faTrashAlt} className="text-lg" />
					{!isSmallScreen && <span className="ml-2 font-psemibold">Delete All</span>}
				</button>
			)}
			<button onClick={handleEditToggle} className={`${buttonClass} text-highlights dark:text-secondary`}>
				<FontAwesomeIcon icon={isEditing ? faSave : faPen} className="text-lg" />
				{!isSmallScreen && <span className="ml-2 font-psemibold">{isEditing ? 'Save changes' : 'Edit'}</span>}
			</button>
			{isEditing && (
				<button onClick={handleStopEdit} className={`${buttonClass}  text-gray-800 dark:text-gray-300`}>
					<FontAwesomeIcon icon={faClose} className="text-lg" />
					{!isSmallScreen && <span className="ml-2 font-psemibold">Close</span>}
				</button>
			)}
		</>
	);
};

export default FlashcardsHeader;
