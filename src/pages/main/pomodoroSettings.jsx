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

	const [run, setRun] = useState(false);
	const [stepIndex, setStepIndex] = useState(0);

	const { isDarkMode } = useDarkMode();

	const steps = [
		{
			target: '.togglePom',
			content: (
				<div className="flex items-center gap-4 text-base sm:text-lg lg:text-xl p-4 sm:p-6">
					<FontAwesomeIcon icon={faClock} className="text-lg sm:text-2xl" />
					<p>
						Toggle this switch to enable or disable the Pomodoro timer during your study
						sessions.
					</p>
				</div>
			),
			placement: 'bottom',
			disableBeacon: true,
		},
		{
			target: '.time',
			content: (
				<div className="text-sm sm:text-base flex flex-col gap-3 p-4 sm:p-6">
					<div className="flex items-center gap-2">
						<FontAwesomeIcon icon={faClock} className="text-base sm:text-xl" />
						<p>Adjust your study and break durations here. Remember, balance is key!</p>
					</div>
				</div>
			),
			placement: 'top',
			disableBeacon: true,
		},
		{
			target: '.edit',
			content: (
				<div className="text-sm sm:text-base flex items-center gap-3 sm:gap-4 p-4 sm:p-6">
					<FontAwesomeIcon icon={faClock} className="text-base sm:text-2xl" />
					<p>You can also click this button to edit the generated summary note contents</p>
				</div>
			),
			placement: 'right',
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
				localStorage.setItem('hasSeenTour', 'skipped');
			}
		}
	};

	const handleResetTour = () => {
		setStepIndex(0);
		setRun(true);
		localStorage.removeItem('hasSeenTour');
	};

	useEffect(() => {
		dispatch(fetchUserInfo());
		dispatch(fetchPomodoroSettings());
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
		return <div>Error: {error}</div>;
	}

	return (
		<div className="flex flex-col lg:flex-row min-h-screen bg-secondary dark:bg-dark w-full">
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
						arrowColor: isDarkMode ? '#424242' : '#f9f9fb',
						backgroundColor: isDarkMode ? '#424242' : '#f9f9fb',
						overlayColor: 'rgba(0, 0, 0, 0.6)',
						primaryColor: '#63A7FF',
						textColor: isDarkMode ? '#fff' : '#333333',
						zIndex: 1000,
					},
					tooltipContainer: {
						fontFamily: '"Poppins", sans-serif',
						fontSize: '0.8rem',
						textAlign: 'center',
						padding: '8px 12px',
					},
					buttonBack: {
						color: isDarkMode ? '#C0C0C0' : '#213660',
					},
				}}
			/>
			<Sidebar onToggle={handleSidebarToggle} />
			<main
				className={`transition-all duration-300 flex-grow p-6 lg:p-10 mt-16 lg:mt-0 ${
					sidebarExpanded ? 'lg:ml-72' : 'lg:ml-28'
				}`}>
				<button
					onClick={handleResetTour}
					className="fixed bottom-4 right-4 flex items-center space-x-2 bg-highlights dark:bg-darkS text-white px-4 py-2 rounded-full shadow-lg hover:scale-105 transition-transform"
					title="Reset Tour">
					<FontAwesomeIcon icon={faRoute} />
					<span className="hidden sm:inline-block text-white font-semibold">Take a Tour</span>
				</button>
				{/* Banner Section */}
				<div className="relative bg-gradient-to-r from-blue-500 to-review rounded-xl p-12 shadow-lg mb-12 animate-gradientMove">
					<h3 className="sm:text-3xl md:text-3xl lg:text-5xl font-extrabold text-white drop-shadow-lg mb-2 animate-slideIn">
						Pomodoro Technique
					</h3>
					<p className="sm:text-3xl md:text-3xl lg:text-xl text-white drop-shadow-lg animate-fadeIn">
						Boost your productivity with timed work intervals and regular breaks.
					</p>
					<FontAwesomeIcon
						icon={faClock}
						className="absolute top-5 right-8 text-white opacity-20 text-9xl animate-rotateClock"
					/>
				</div>

				{/* Toggle Switch for Show Timer */}
				<div className="mb-8 ">
					<label className="flex items-center ">
						<span className="text-lg text-gray-700 dark:text-gray-300 font-pmedium">
							Enable Pomodoro
						</span>
						<div className="ml-4 relative togglePom">
							<input
								type="checkbox"
								className="sr-only"
								checked={pendingSettings.showTimer}
								onChange={(e) => handleSettingChange('showTimer', e.target.checked)}
							/>
							<div className="block bg-secondary dark:bg-dark border w-14 h-8 rounded-full shadow-inner"></div>
							<div
								className={`dot absolute left-1 top-1 w-6 h-6 rounded-full transition-transform ${
									pendingSettings.showTimer
										? 'transform translate-x-6 bg-primary dark:bg-gray-400'
										: 'bg-slate-300 dark:bg-naeg'
								}`}></div>
						</div>
					</label>
				</div>

				{/* Time Settings */}
				<div className="mb-8 time">
					<p className="text-lg mb-4 text-gray-700 dark:text-gray-300 font-pregular">
						Time (minutes)
					</p>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
						{['studyTime', 'shortBreak', 'longBreak'].map((setting) => (
							<div key={setting} className="neumorphism-card">
								<label
									htmlFor={setting}
									className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
									{setting
										.replace(/([A-Z])/g, ' $1')
										.replace(/^./, (str) => str.toUpperCase())}
								</label>
								<input
									type="number"
									id={setting}
									value={pendingSettings[setting]}
									onChange={(e) => handleSettingChange(setting, e.target.value)}
									className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-primary neumorphic-input dark:bg-darken dark:text-white"
									min="1"
								/>
							</div>
						))}
					</div>
				</div>

				{/* Pomodoro Information Section */}
				<section className="mt-10">
					<h2 className="text-3xl text-highlights dark:text-white mb-6">
						How to Use the Pomodoro Technique
					</h2>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
						<div className="bg-white dark:bg-darken p-6 rounded-xl shadow-lg">
							<div className="flex items-center mb-4">
								<FontAwesomeIcon
									icon={faCheckCircle}
									className="text-green-500 text-3xl mr-4"
								/>
								<h3 className="text-xl font-semibold text-gray-900 dark:text-white">
									Step 1: Pick a Task
								</h3>
							</div>
							<p className="text-gray-700 dark:text-gray-300">
								Choose a note you want to study on, and set your mind to it.
							</p>
						</div>

						<div className="bg-white dark:bg-darken p-6 rounded-xl shadow-lg">
							<div className="flex items-center mb-4">
								<FontAwesomeIcon icon={faClock} className="text-blue-500 text-3xl mr-4" />
								<h3 className="text-xl font-semibold text-gray-900 dark:text-white">
									Step 2: Work for 25 Minutes
								</h3>
							</div>
							<p className="text-gray-700 dark:text-gray-300">
								Set your timer for 25 minutes and work without distractions.
							</p>
						</div>

						<div className="bg-white dark:bg-darken p-6 rounded-xl shadow-lg">
							<div className="flex items-center mb-4">
								<FontAwesomeIcon
									icon={faCoffee}
									className="text-yellow-500 text-3xl mr-4"
								/>
								<h3 className="text-xl font-semibold text-gray-900 dark:text-white">
									Step 3: Take a 5-Minute Break
								</h3>
							</div>
							<p className="text-gray-700 dark:text-gray-300">
								After 25 minutes of work, reward yourself with a short break.
							</p>
						</div>

						<div className="bg-white dark:bg-darken p-6 rounded-xl shadow-lg">
							<div className="flex items-center mb-4">
								<FontAwesomeIcon icon={faBolt} className="text-orange-500 text-3xl mr-4" />
								<h3 className="text-xl font-semibold text-gray-900 dark:text-white">
									Step 4: Repeat & Take a Long Break
								</h3>
							</div>
							<p className="text-gray-700 dark:text-gray-300">
								After 4 Pomodoros, take a longer break of 15-30 minutes to recharge.
							</p>
						</div>
					</div>
				</section>
			</main>
		</div>
	);
}
