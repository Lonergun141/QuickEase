import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faCheckCircle, faCoffee, faBolt } from '@fortawesome/free-solid-svg-icons';
import {
	setPendingSetting,
	applySettings,
	fetchPomodoroSettings,
	savePomodoroSettings,
} from '../../features/Pomodoro/pomodoroSlice';
import Sidebar from '../../components/sidebar';
import { fetchUserInfo } from '../../features/auth/authSlice';

export default function Pomodoro() {
	const { pendingSettings, isLoading, error } = useSelector((state) => state.pomodoro);
	const userInfo = useSelector((state) => state.auth.userInfo);
	const [sidebarExpanded, setSidebarExpanded] = useState(true);
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(fetchUserInfo());
		dispatch(fetchPomodoroSettings());
	}, [dispatch]);

	const handleSettingChange = (setting, value) => {
		if (setting === 'showTimer') {
			dispatch(setPendingSetting({ [setting]: value }));
		} else {
			const numValue = value === '' ? '' : parseInt(value, 10);
			if (numValue === '' || (numValue >= 1 && Number.isInteger(numValue))) {
				dispatch(setPendingSetting({ [setting]: numValue }));
			}
		}
	};

	const handleSidebarToggle = (isExpanded) => {
		setSidebarExpanded(isExpanded);
	};

	const handleSave = async () => {
		const settingsToSave = {
			study_time: pendingSettings.studyTime,
			short_break: pendingSettings.shortBreak,
			long_break: pendingSettings.longBreak,
			show_timer: pendingSettings.showTimer,
			user: userInfo.id,
		};

		try {
			await dispatch(savePomodoroSettings(settingsToSave)).unwrap();
			dispatch(applySettings());
		} catch (error) {
			console.error('Failed to save settings:', error);
		}
	};

	if (error) {
		return <div>Error: {error}</div>;
	}

	return (
		<div className="flex flex-col lg:flex-row min-h-screen bg-secondary dark:bg-dark w-full">
			<Sidebar onToggle={handleSidebarToggle} />
			<main
				className={`transition-all duration-300 flex-grow p-6 lg:p-10 mt-16 lg:mt-0 ${
					sidebarExpanded ? 'lg:ml-72' : 'lg:ml-28'
				}`}>
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

				{/* Time Settings */}
				<div className="mb-8">
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

				{/* Toggle Switch for Show Timer */}
				<div className="mb-8">
					<label className="flex items-center">
						<span className="text-lg text-gray-700 dark:text-gray-300 font-pmedium">
							Enable Pomodoro
						</span>
						<div className="ml-4 relative">
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

				{/* Save Button */}
				<button
					onClick={handleSave}
					className={`w-full md:w-auto px-6 py-3 rounded-lg text-white dark:text-dark font-pmedium bg-highlights dark:bg-secondary`}>
					Save
				</button>

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
								Choose a task you want to work on, and set your mind to it.
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
