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
		<div className={`${slideIn ? 'slide-in' : 'slide-out'} 
			relative overflow-hidden bg-white dark:bg-darken rounded-2xl 
			border border-zinc-200/80 dark:border-zinc-800
			transform transition-all duration-700 ease-in-out`}>
			
			{/* Enhanced Background Effects */}
			<div className="absolute inset-0">
				<div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 
					dark:from-secondary/5 dark:to-primary/5 opacity-60"></div>
				<div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 dark:bg-secondary/5 
					rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
				<div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/5 dark:bg-primary/5 
					rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
			</div>

			{/* Main Content */}
			<div className="relative p-8 sm:p-10">
				<div className="flex flex-col md:flex-row items-center gap-8 lg:gap-12">
					{/* Mascot Container */}
					<div className="relative group">
						{/* Mascot Background Effects */}
						<div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 
							dark:from-secondary/20 dark:to-primary/20 rounded-full blur-2xl opacity-0 
							group-hover:opacity-70 transition-opacity duration-500"></div>
						
						{/* Mascot Image */}
						<div className="relative">
							<div className="w-32 h-32 lg:w-40 lg:h-40 rounded-full p-0.5 
								bg-gradient-to-br from-primary to-secondary dark:from-secondary dark:to-primary">
								<div className="w-full h-full rounded-full p-4 bg-white dark:bg-zinc-900 
									backdrop-blur-sm group-hover:scale-95 transition-transform duration-500">
									<img
										src={isDarkMode ? img.quick : img.Mascot}
										alt={isDarkMode ? 'NightWing Mascot' : 'Quickie Mascot'}
										className="w-full h-full object-contain animate-float"
									/>
								</div>
							</div>
							
							{/* Decorative Elements */}
							<div className="absolute -top-2 right-0 w-4 h-4 rounded-full 
								bg-primary dark:bg-secondary animate-pulse"></div>
							<div className="absolute -bottom-1 left-1 w-3 h-3 rounded-full 
								bg-secondary dark:bg-primary animate-ping opacity-75"></div>
						</div>
					</div>

					{/* Content */}
					<div className="flex-1 space-y-6 text-center md:text-left">
						{/* Welcome Message */}
						<div className="space-y-3">
							<div className="flex flex-wrap gap-3 justify-center md:justify-start">
								<span className="inline-flex items-center gap-2 px-4 py-2 rounded-full 
									bg-primary/10 dark:bg-secondary/10 text-primary dark:text-secondary 
									font-pmedium border border-primary/20 dark:border-secondary/20">
								
									<span>Welcome Back</span>
								</span>
							</div>
							
							<h2 className="text-3xl lg:text-4xl font-pbold">
								<span className="text-newTxt dark:text-white">Hello, </span>
								<span className="text-primary dark:text-secondary bg-gradient-to-r 
									from-primary to-secondary dark:from-secondary dark:to-primary 
									bg-clip-text">{userInfo?.firstname || 'Learner'}</span>
								<span className="text-newTxt dark:text-white">!</span>
							</h2>
						</div>

						{/* Description */}
						<p className="text-lg text-zinc-600 dark:text-zinc-300 font-pregular max-w-2xl">
							I'm <span className="font-psemibold text-primary dark:text-secondary">
								{isDarkMode ? 'NightWing' : 'Quickie'}
							</span>, your QuickEase Learning helper. I'm here to guide you through your learning journey!
						</p>

						{/* Features */}
						<div className="flex flex-wrap gap-3 justify-center md:justify-start">
							<div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl 
								bg-white dark:bg-zinc-800 shadow-sm hover:shadow-md transition-shadow duration-300
								border border-zinc-200 dark:border-zinc-700">
								<div className="w-2 h-2 rounded-full bg-primary dark:bg-secondary animate-pulse"></div>
								<span className="font-pmedium text-zinc-700 dark:text-zinc-200">
									AI-Powered Assistant
								</span>
							</div>
							<div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl 
								bg-white dark:bg-zinc-800 shadow-sm hover:shadow-md transition-shadow duration-300
								border border-zinc-200 dark:border-zinc-700">
								<div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
								<span className="font-pmedium text-zinc-700 dark:text-zinc-200">
									24/7 Available
								</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
