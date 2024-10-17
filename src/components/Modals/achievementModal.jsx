import React from 'react';
import Modal from './Modal';

const AchievementModal = ({ achievement, onClose }) => {
	return (
		<Modal isOpen={true} onClose={onClose}>
			<div className="flex flex-col items-center justify-center p-4 bg-white dark:bg-darken  rounded-lg  transition duration-300 ease-in-out">
				<h1 className="font-pbold text-dark dark:text-secondary mb-6 sm:text-lg md:text-xl lg:text-2xl text-center">
					Achievement Unlocked!
				</h1>
				<img src={achievement.image} alt={achievement.title} className="w-32 h-32 mb-4" />
				<h1 className="text-lg font-pbold text-center mt-2 text-dark dark:text-secondary">{achievement.title}</h1>
				<p className="text-center mt-2 text-dark dark:text-secondary font-pregular">{achievement.description}</p>
			</div>
		</Modal>
	);
};

export default AchievementModal;
