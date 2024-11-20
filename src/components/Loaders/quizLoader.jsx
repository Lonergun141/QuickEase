import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook, faBrain, faPencilAlt } from '@fortawesome/free-solid-svg-icons';

export default function QuizLoadingScreen() {
	return (
		<div className="fixed inset-0 flex flex-col items-center justify-center bg-white dark:bg-dark z-50 p-4">
			<h1 className="loading-title animate-gradientText 
                    text-2xl xs:text-3xl sm:text-4xl md:text-5xl 
                    font-extrabold text-center
                    mb-6 sm:mb-8 md:mb-10">
				Preparing Your Quiz
			</h1>

			<div className="relative flex items-center justify-center mb-10">
				<div className="flex space-x-4">
					<div className="w-12 h-12 rounded-full bg-primary dark:bg-darken flex items-center justify-center animate-bounceOne">
						<FontAwesomeIcon icon={faBook} className="text-white dark:text-secondary text-2xl" />
					</div>
					<div className="w-12 h-12 rounded-full bg-primary dark:bg-darken flex items-center justify-center animate-bounceTwo">
						<FontAwesomeIcon icon={faBrain} className="text-white dark:text-secondary text-2xl" />
					</div>
					<div className="w-12 h-12 rounded-full bg-primary dark:bg-darken flex items-center justify-center animate-bounceThree">
						<FontAwesomeIcon icon={faPencilAlt} className="text-white dark:text-secondary text-2xl" />
					</div>
				</div>
			</div>

			<div className="w-full max-w-xs sm:max-w-md md:max-w-lg">
				<div className="w-full h-2 bg-gray-300 dark:bg-gray-600 rounded-full overflow-hidden">
					<div className="h-full bg-primary dark:bg-secondary rounded-full loading-bar"></div>
				</div>
			</div>

			<p className="text-darken dark:text-gray-300 text-center mt-8 max-w-md text-sm sm:text-base md:text-sm">
				Get ready! We're setting up your quiz - questions, hints, and everything you need to ace
				it!
			</p>
		</div>
	);
}
