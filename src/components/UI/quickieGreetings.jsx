import React, { useEffect, useState } from 'react';
import { img } from '../../constants';
import { useSelector } from 'react-redux';
import { useDarkMode } from '../../features/Darkmode/darkmodeProvider';

export const QuickieGreetings = () => {
	const { userInfo } = useSelector((state) => state.auth);
	const { isDarkMode } = useDarkMode();

	const [slideIn, setSlideIn] = useState(false);

	useEffect(() => {
		setTimeout(() => {
			setSlideIn(true);
		}, 100);
	}, []);

	return (
		<div
			className={`${slideIn ? 'slide-in' : 'slide-out'} 
			relative overflow-hidden bg-white dark:bg-darken rounded-2xl 
			shadow-sm
			transform transition-all duration-700 ease-in-out
			min-h-[200px] sm:min-h-[250px] md:min-h-[200px]`}>
			{/* Enhanced Background Effects */}
			<div className="absolute inset-0">
				
				{/* Adjusted blur circles for better mobile display */}
				<div
					className="absolute top-0 right-0 w-48 sm:w-72 md:w-96 h-48 sm:h-72 md:h-96 
					bg-primary/5 dark:bg-secondary/5 rounded-full blur-3xl 
					-translate-y-1/2 translate-x-1/2"
				/>
				<div
					className="absolute bottom-0 left-0 w-48 sm:w-72 md:w-96 h-48 sm:h-72 md:h-96 
					bg-secondary/5 dark:bg-primary/5 rounded-full blur-3xl 
					translate-y-1/2 -translate-x-1/2"
				/>
			</div>

			{/* Main Content */}
			<div className="relative h-full">
				<div className="flex flex-col md:flex-row items-center h-full">
					{/* Content Section */}
					<div
						className="w-full md:w-3/5 p-4 sm:p-6 md:p-8 lg:p-10 space-y-4 md:space-y-6
						z-10">
						{' '}
						{/* Added z-index to keep content above mascot on mobile */}
						{/* Welcome Message */}
						<div className="space-y-2 md:space-y-3">
							<div className="flex flex-wrap gap-2 md:gap-3"></div>

							<h2 className="text-xl sm:text-2xl lg:text-3xl font-pbold">
								<span className="text-newTxt dark:text-white">Hello, </span>
								<span
									className="text-primary dark:text-secondary bg-gradient-to-r 
									from-primary to-secondary dark:from-secondary dark:to-primary 
									bg-clip-text">
									{userInfo?.firstname || 'Learner'}
								</span>
								<span className="text-newTxt dark:text-white"></span>
							</h2>
						</div>
						{/* Description - Adjusted for better mobile reading */}
						<p
							className="text-md sm:text-md md:text-lg lg:text-md  text-zinc-600 dark:text-zinc-300 
							font-pregular max-w-xl">
							I'm{' '}
							<span className="font-psemibold text-primary dark:text-secondary">
								{isDarkMode ? 'NightWing' : 'Quickie'}
							</span>
							, your QuickEase Learning helper. I'm here to guide you through your learning
							journey!
						</p>
						{/* Features - Responsive grid */}
						<div className="flex flex-wrap gap-2 sm:gap-3">
							<div
								className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 
								rounded-xl  
								
								text-sm sm:text-base"></div>
						</div>
					</div>

					{/* Mascot Container - Responsive positioning */}
					<div
						className="absolute right-0 top-0 
						w-[60%] sm:w-[50%] md:w-[45%] 
						h-[150%] 
						overflow-visible 
						z-0"
					>
						<div
							className="relative w-full h-full 
							transform translate-x-1/4 hover:translate-x-[15%] 
							transition-transform duration-700 ease-in-out">
							<img
								src={isDarkMode ? img.quick : img.Mascot}
								alt={isDarkMode ? 'NightWing Mascot' : 'Quickie Mascot'}
								className="absolute top-0 right-0 
									w-full h-full 
									object-contain 
									md:opacity-100
									scale-125"
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
