import React, { useEffect, useState } from 'react';
import { img } from '../../constants';
import { useSelector } from 'react-redux';
import { useDarkMode } from '../../features/Darkmode/darkmodeProvider';

export const QuickieGreetings = () => {
	const { userInfo } = useSelector((state) => state.auth);
	const { isDarkMode } = useDarkMode(); // Dark mode check

	// State to control animation
	const [slideIn, setSlideIn] = useState(false);

	// Trigger animation when component mounts
	useEffect(() => {
		setTimeout(() => {
			setSlideIn(true);
		}, 100); // Delayed to ensure smooth entry
	}, []);

	return (
		<div
			className={`${
				slideIn ? 'slide-in' : 'slide-out'
			} flex flex-col md:flex-row items-center justify-center bg-white quickie-greetings dark:bg-darken text-black rounded-lg p-4 mb-8 overflow-hidden relative transition-transform duration-700 ease-in-out`}
		>
			{/* Gradient background overlay - hidden on small screens */}
			<div className="hidden md:block absolute bottom-0 left-0 right-0 h-[50%] bg-gradient-to-t from-[#fffe] to-transparent z-10 dark:bg-gradient-to-t dark:from-[#171717] dark:to-transparent"></div>

			{/* Conditional Mascot Image */}
			<img
				src={isDarkMode ? img.quick : img.Mascot}
				alt={isDarkMode ? 'NightWing Mascot' : 'Quickie Mascot'}
				className="w-full md:w-1/4 mb-4 md:mb-0 md:mr-6 transform hover:scale-105 transition duration-300 ease-in-out animate-float z-5"
			/>

			{/* Greeting Text */}
			<div className="text-center md:text-left">
				<h2 className="text-xl sm:text-xl md:text-3xl font-pbold mb-2 text-highlights dark:text-secondary">
					Hello, {userInfo?.firstname || 'Learner'}!
				</h2>
				<p className="text-base sm:text-md md:text-xl font-pregular dark:text-secondary">
				 I'm{' '}
					<span className="font-pbold text-primary dark:text-secondary">
						{isDarkMode ? 'NightWing' : 'Quickie'}
					</span>
					, your QuickEase Learning helper. I'm here to guide you through your learning journey!
				</p>
			</div>
		</div>
	);
};
