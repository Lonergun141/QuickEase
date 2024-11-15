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
			relative overflow-hidden bg-white/90 dark:bg-darken/90 
			backdrop-blur-sm rounded-xl border border-zinc-100 dark:border-zinc-800
			shadow-sm transform transition-all duration-700 ease-in-out
			min-h-[130px] xs:min-h-[150px] sm:min-h-[170px] md:min-h-[180px] lg:min-h-[190px]`}>
			{/* Main Content */}
			<div className="relative h-full">
				<div className="flex flex-row items-center h-full">
					{/* Content Section - Adjusted padding for taller container */}
					<div
						className="w-[70%] xs:w-[65%] sm:w-[60%] md:w-[65%] lg:w-[70%] 
						p-4 xs:p-5 sm:p-6 md:p-8 lg:p-10 
						space-y-2 xs:space-y-3 sm:space-y-4 
						z-10">
						{/* Welcome Message - Slightly larger text */}
						<h2 className="text-xl xs:text-2xl sm:text-3xl lg:text-4xl font-pbold leading-tight">
							<span className="text-newTxt dark:text-white">Hello, </span>
							<span
								className="text-primary dark:text-secondary bg-gradient-to-r 
								from-primary to-secondary dark:from-secondary dark:to-primary 
								bg-clip-text">
								{userInfo?.firstname || 'Learner'}
							</span>
						</h2>

						{/* Description - Adjusted text sizes */}
						<p
							className="text-base xs:text-lg sm:text-xl md:text-lg lg:text-xl
							text-zinc-600 dark:text-zinc-300 
							font-pregular 
							max-w-[300px] xs:max-w-[340px] sm:max-w-[400px] md:max-w-[440px] lg:max-w-[500px]">
							I'm{' '}
							<span className="font-psemibold text-primary dark:text-secondary">
								{isDarkMode ? 'NightWing' : 'Quickie'}
							</span>
							, your QuickEase Learning helper. I'm here to guide you through your learning
							journey!
						</p>
					</div>

					{/* Mascot Container - Adjusted for taller container */}
					<div
						className="absolute right-0 top-0 
						w-[45%] xs:w-[42%] sm:w-[40%] md:w-[38%] lg:w-[35%]
						h-[120%] xs:h-[125%] sm:h-[130%] md:h-[135%] lg:h-[140%] 
						overflow-visible z-0">
						<div
							className="relative w-full h-full 
							transform translate-x-[15%] hover:translate-x-[10%] 
							transition-transform duration-700 ease-in-out">
							<img
								src={isDarkMode ? img.quick : img.Mascot}
								alt={isDarkMode ? 'NightWing Mascot' : 'Quickie Mascot'}
								className="absolute top-0 right-0 
									w-full h-full 
									object-contain 
									scale-115 xs:scale-120 sm:scale-125 md:scale-130 lg:scale-135 
									opacity-90 hover:opacity-100
									transition-all duration-300"
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
