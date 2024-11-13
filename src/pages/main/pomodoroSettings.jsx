import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	faClock,
	faCheckCircle,
	faCoffee,
	faBolt,
	faRoute,
} from '@fortawesome/free-solid-svg-icons';
import {
	setPendingSetting,
	applySettings,
	fetchPomodoroSettings,
	savePomodoroSettings,
} from '../../features/Pomodoro/pomodoroSlice';
import Sidebar from '../../components/sidebar';
import { fetchUserInfo } from '../../features/auth/authSlice';
import Joyride, { ACTIONS, EVENTS, STATUS } from 'react-joyride';
import { useDarkMode } from '../../features/Darkmode/darkmodeProvider';

export default function Pomodoro() {
	const { pendingSettings, isLoading, error } = useSelector((state) => state.pomodoro);
	const userInfo = useSelector((state) => state.auth.userInfo);
	const [sidebarExpanded, setSidebarExpanded] = useState(true);
	const dispatch = useDispatch();
	const { isDarkMode } = useDarkMode();
	const [run, setRun] = useState(false);
	const [stepIndex, setStepIndex] = useState(0);
	const TOUR_KEY = 'hasSeenTour_pomodoro';

	const steps = [
		{
			target: '.togglePom',
			content: (
				<div className="flex items-center gap-3 p-4">
					<FontAwesomeIcon icon={faClock} className="text-lg text-primary" />
					<p className="text-sm">
						Toggle this switch to enable or disable the Pomodoro timer during your study sessions.
					</p>
				</div>
			),
			placement: 'bottom',
			disableBeacon: true,
		},
		{
			target: '.time',
			content: (
				<div className="flex items-center gap-3 p-4">
					<FontAwesomeIcon icon={faClock} className="text-lg text-primary" />
					<p className="text-sm">
						Adjust your study and break durations here. Remember, balance is key!
					</p>
				</div>
			),
			placement: 'top',
			disableBeacon: true,
		},
	];

	const handleJoyrideCallback = (data) => {
		const { action, status, type } = data;

		if (type === EVENTS.STEP_AFTER || type === EVENTS.TARGET_NOT_FOUND) {
			setStepIndex((prev) => prev + (action === ACTIONS.PREV ? -1 : 1));
		} else if (status === STATUS.FINISHED || status === STATUS.SKIPPED) {
			setRun(false);
			if (status === STATUS.SKIPPED) {
				localStorage.setItem(TOUR_KEY, 'skipped');
			}
		}
	};

	const handleResetTour = () => {
		setStepIndex(0);
		setRun(true);
		localStorage.removeItem(TOUR_KEY);
	};

	useEffect(() => {
		dispatch(fetchUserInfo());
		dispatch(fetchPomodoroSettings());
		const hasSeenTour = localStorage.getItem(TOUR_KEY);
		if (!hasSeenTour) {
			setTimeout(() => {
				setStepIndex(0);
				setRun(true);
				localStorage.setItem(TOUR_KEY, 'true');
			}, 500);
		}
	}, [dispatch]);

	const saveSettings = async (newSettings) => {
		const settingsToSave = {
			study_time: newSettings.studyTime,
			short_break: newSettings.shortBreak,
			long_break: newSettings.longBreak,
			show_timer: newSettings.showTimer,
			user: userInfo.id,
		};

		try {
			await dispatch(savePomodoroSettings(settingsToSave)).unwrap();
			dispatch(applySettings());
		} catch (error) {
			console.error('Failed to save settings:', error);
		}
	};

	const handleSettingChange = async (setting, value) => {
		let newValue;
		if (setting === 'showTimer') {
			newValue = value;
		} else {
			newValue = value === '' ? '' : parseInt(value, 10);
			if (!(newValue === '' || (newValue >= 1 && Number.isInteger(newValue)))) {
				return;
			}
		}

		const newSettings = {
			...pendingSettings,
			[setting]: newValue,
		};

		dispatch(setPendingSetting({ [setting]: newValue }));

		// Only auto-save if the value is valid
		if (setting === 'showTimer' || (newValue !== '' && newValue >= 1)) {
			await saveSettings(newSettings);
		}
	};

	const handleSidebarToggle = (isExpanded) => {
		setSidebarExpanded(isExpanded);
	};

	if (error) {
		return (
			<div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg">
				Error: {typeof error === 'object' ? error.message : error}
			</div>
		);
	}

	return (
		<div className="flex flex-col lg:flex-row min-h-screen bg-zinc-50 dark:bg-dark w-full">
			<Sidebar onToggle={handleSidebarToggle} />
			
			<main
				className={`transition-all duration-300 flex-grow p-6 lg:p-8 mt-16 lg:mt-0 ${
					sidebarExpanded ? 'lg:ml-72' : 'lg:ml-28'
				}`}>
				<div className="max-w-6xl space-y-8">
					
					<div className="relative overflow-hidden bg-white dark:bg-darken rounded-2xl border border-zinc-200/80 dark:border-zinc-800 shadow-sm">
						<div className="relative p-8 lg:p-10">
							
							<div className="grid md:grid-cols-[1fr,auto] gap-8 items-center">
								
								<div className="space-y-6">
									{/* Header */}
									<div className="space-y-3">
										<div className="inline-flex items-center gap-3 bg-zinc-100/80 dark:bg-zinc-800/80 rounded-full pl-3 pr-5 py-1.5">
											<div className="p-2 rounded-full">
												<FontAwesomeIcon 
													icon={faClock} 
													className="text-base text-primary dark:text-secondary" 
												/>
											</div>
											<span className="text-sm font-pmedium text-zinc-600 dark:text-zinc-300">
												Timer Settings
											</span>
										</div>
										<h1 className="text-3xl font-pbold text-newTxt dark:text-white">
											Customize Your Study Sessions
										</h1>
										<p className="text-base text-darkS dark:text-smenu font-pregular max-w-2xl">
											Fine-tune your work intervals and breaks to match your productivity rhythm
										</p>
									</div>

								</div>

								{/* Right Visual Element */}
								<div className="hidden md:block relative">
									<div className="relative w-40 h-40">
										{/* Circular Timer Visual */}
										<svg 
											className="w-full h-full transform -rotate-90"
											viewBox="0 0 100 100"
										>
											{/* Background Circle */}
											<circle
												className="text-zinc-100 dark:text-zinc-800 stroke-current"
												strokeWidth="6"
												fill="none"
												r="44"
												cx="50"
												cy="50"
											/>
											{/* Progress Circle */}
											<circle
												className="text-primary dark:text-secondary stroke-current"
												strokeWidth="6"
												strokeLinecap="round"
												fill="none"
												r="44"
												cx="50"
												cy="50"
												strokeDasharray="276"
												strokeDashoffset="69"
											/>
										</svg>
										{/* Center Content */}
										<div className="absolute inset-0 flex flex-col items-center justify-center">
											<FontAwesomeIcon 
												icon={faClock} 
												className="text-2xl text-primary dark:text-secondary mb-1" 
											/>
											<span className="text-sm font-pmedium text-zinc-600 dark:text-zinc-400">
												Timer
											</span>
										</div>
									</div>
								</div>
							</div>
						</div>

						{/* Subtle Pattern Overlay */}
						<div className="absolute inset-0 bg-pattern opacity-[0.02] pointer-events-none"></div>
					</div>

					{/* Settings Container */}
					<div className="grid gap-8">
						{/* Timer Toggle */}
						<div className="bg-white dark:bg-darken rounded-xl border border-zinc-200/80 dark:border-zinc-800 p-6 shadow-sm">
							<div className="flex items-center justify-between togglePom">
								<div className="space-y-1">
									<h2 className="text-lg font-psemibold text-zinc-900 dark:text-zinc-100">
										Enable Pomodoro Timer
									</h2>
									<p className="text-sm text-zinc-500 dark:text-zinc-400">
										Show timer during your study sessions
									</p>
								</div>
								<label className="relative inline-flex items-center cursor-pointer">
									<input
										type="checkbox"
										checked={pendingSettings.showTimer}
										onChange={(e) => handleSettingChange('showTimer', e.target.checked)}
										className="sr-only peer"
									/>
									<div className="w-14 h-8 rounded-full 
										bg-zinc-200 dark:bg-zinc-700/50 
										peer-focus:outline-none 
										peer-focus:ring-4 
										peer-focus:ring-primary/20 
										dark:peer-focus:ring-secondary/20 
										peer-checked:bg-primary/90 
										dark:peer-checked:bg-secondary/90 
										after:content-[''] 
										after:absolute 
										after:top-1 
										after:left-1 
										after:bg-white 
										after:border
										after:border-zinc-200
										dark:after:border-zinc-600
										after:rounded-full 
										after:h-6 
										after:w-6 
										after:shadow-sm
										after:transition-all 
										dark:after:bg-primary
										peer-checked:after:translate-x-6
										peer-checked:after:border-primary/20
										dark:peer-checked:after:border-secondary/20
										transition-colors">
									</div>
								</label>
							</div>
						</div>

						{/* Time Settings */}
						<div className="bg-white dark:bg-darken rounded-xl border border-zinc-200/80 dark:border-zinc-800 p-6 shadow-sm time">
							<div className="mb-6">
								<h2 className="text-lg font-psemibold text-zinc-900 dark:text-zinc-100">
									Time Intervals
								</h2>
								<p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
									Customize your work and break durations (in minutes)
								</p>
							</div>
							
							<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
								{[
									{ key: 'studyTime', label: 'Study Sessions', icon: faClock },
									{ key: 'shortBreak', label: 'Short Break', icon: faCoffee },
									{ key: 'longBreak', label: 'Long Break', icon: faBolt }
								].map(({ key, label, icon }) => (
									<div key={key} className="space-y-2">
										<label htmlFor={key} className="flex items-center gap-2 text-sm font-pmedium text-zinc-700 dark:text-zinc-300">
											<FontAwesomeIcon icon={icon} className="text-primary/70 dark:text-secondary/70" />
											{label}
										</label>
										<input
											type="number"
											id={key}
											value={pendingSettings[key]}
											onChange={(e) => handleSettingChange(key, e.target.value)}
											className="w-full px-4 py-2.5 rounded-lg border border-zinc-200 dark:border-zinc-700 
												bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100
												focus:ring-2 focus:ring-primary/20 focus:border-primary dark:focus:border-secondary
												transition-all duration-200"
											min="1"
										/>
									</div>
								))}
							</div>
						</div>

						{/* How to Use Section */}
						<div className="space-y-6">
							<h2 className="text-xl font-psemibold text-zinc-900 dark:text-zinc-100">
								How to Use the Pomodoro Technique
							</h2>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								{[
									{ 
										icon: faCheckCircle, 
										color: 'text-emerald-500', 
										bgColor: 'bg-emerald-50 dark:bg-emerald-500/10',
										title: 'Pick a Task', 
										description: 'Choose a note you want to study on, and set your mind to it.' 
									},
									{ 
										icon: faClock, 
										color: 'text-primary', 
										bgColor: 'bg-primary-50 dark:bg-primary/10',
										title: 'Work for 25 Minutes', 
										description: 'Set your timer for 25 minutes and work without distractions.' 
									},
									{ 
										icon: faCoffee, 
										color: 'text-amber-500', 
										bgColor: 'bg-amber-50 dark:bg-amber-500/10',
										title: 'Take a 5-Minute Break', 
										description: 'After 25 minutes of work, reward yourself with a short break.' 
									},
									{ 
										icon: faBolt, 
										color: 'text-orange-500', 
										bgColor: 'bg-orange-50 dark:bg-orange-500/10',
										title: 'Repeat & Long Break', 
										description: 'After 4 Pomodoros, take a longer break of 15-30 minutes to recharge.' 
									}
								].map((item, index) => (
									<div key={index} 
										className="bg-white dark:bg-darken rounded-xl border border-zinc-200/80 dark:border-zinc-800 p-5 shadow-sm hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors duration-200">
										<div className="flex gap-4">
											<div className={`${item.color} ${item.bgColor} rounded-lg p-3`}>
												<FontAwesomeIcon icon={item.icon} className="text-lg" />
											</div>
											<div>
												<h3 className="font-psemibold text-zinc-900 dark:text-zinc-100">
													{item.title}
												</h3>
												<p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
													{item.description}
												</p>
											</div>
										</div>
									</div>
								))}
							</div>
						</div>
					</div>
				</div>

				{/* Tour Button */}
				<button
					onClick={handleResetTour}
					className="fixed bottom-4 right-4 flex items-center gap-2 bg-highlights/90 dark:bg-darkS/90 hover:bg-primary text-white px-4 py-2.5 rounded-full shadow-lg transition-all duration-200 hover:scale-105">
					<FontAwesomeIcon icon={faRoute} className="text-sm" />
					<span className="hidden sm:block text-sm font-medium">Take a Tour</span>
				</button>
			</main>

			{/* Joyride Tour */}
			<Joyride
				callback={handleJoyrideCallback}
				continuous
				hideCloseButton
				run={run}
				scrollToFirstStep
				showProgress
				showSkipButton
				stepIndex={stepIndex}
				steps={steps}
				disableScrolling={true}
				locale={{
					back: 'Previous',
					last: 'Finish',
					next: 'Next',
					skip: 'Skip',
				}}
				styles={{
					options: {
						zIndex: 1000,
						arrowColor: isDarkMode ? '#424242' : '#f9f9fb',
						backgroundColor: isDarkMode ? '#424242' : '#f9f9fb',
							overlayColor: 'rgba(0, 0, 0, 0.6)',
							primaryColor: '#63A7FF',
							textColor: isDarkMode ? '#fff' : '#333333',
					},
					tooltipContainer: {
						fontFamily: '"Poppins", sans-serif',
						fontSize: '0.8rem',
						textAlign: 'center',
					},
					buttonBack: {
						color: isDarkMode ? '#C0C0C0' : '#213660',
					},
				}}
			/>
		</div>
	);
}
