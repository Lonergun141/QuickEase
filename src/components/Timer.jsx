import React, { useContext, useEffect, useState, useCallback, useRef } from 'react';
import { TimerContext } from '../features/Pomodoro/TimerContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPause, faForward, faStepForward } from '@fortawesome/free-solid-svg-icons';
import TimerModal from './timerModal';
import alarm from '../assets/Audio/hey.mp3';
import alarm2 from '../assets/Audio/alarm.mp3';
import { useSelector } from 'react-redux';
import { useDarkMode } from '../features/Darkmode/darkmodeProvider';
import { useNavigate } from 'react-router-dom';
import Push from 'push.js';
import { img } from '../constants';

const quotes = [
	"Stay focused, you've got this!",
	'Every minute counts towards your success.',
	'Small steps lead to big achievements.',
	'Your future self will thank you for studying now.',
	'Embrace the challenge, grow your mind.',
	'In the end of the day, it’s night',
];

const Timer = ({ isCollapsed, isMobile }) => {
	const { currentTime, isRunning, startTimer, pauseTimer, skipSession, closeBreakModal } =
		useContext(TimerContext);

	const { session, showBreakModal } = useSelector((state) => state.pomodoro);
	const { isDarkMode } = useDarkMode();
	const [quoteIndex, setQuoteIndex] = useState(0);
	const [isQuoteVisible, setIsQuoteVisible] = useState(true);
	const quoteIntervalRef = useRef(null);
	const lastQuoteChangeRef = useRef(Date.now());
	const sound = new Audio(alarm);
	const audioContextRef = useRef(null);
	const audioBufferRef = useRef(null);
	const alarm2ContextRef = useRef(null);
	const alarm2BufferRef = useRef(null);

	const navigate = useNavigate();

	// notification permission request
	// useEffect(() => {
	//   Push.Permission.request(() => {}, () => {});
	// }, []);

	// notification function
	const showLocalNotification = useCallback(() => {
		if (Push.Permission.has()) {
			if (currentTime === 1) {
				let title = '';
				let message = '';
				
				if (session === 'study') {
					title = "Study Session Complete!";
					message = "Time for a well-deserved break.";
				} else if (session === 'shortBreak') {
					title = "Break Time Over!";
					message = "Ready to get back to studying?";
				} else if (session === 'longBreak') {
					title = "Long Break Complete!";
					message = "Time to start a new study session!";
				}

				Push.create(title, {
					body: message,
					icon: img.logo,
					timeout: 5000,
					vibrate: [200, 100, 200],
					onClick: function () {
						window.focus();
						this.close();
					}
				});
			}
		}
	}, [session, currentTime]);

	const changeQuote = useCallback(() => {
		const now = Date.now();
		if (now - lastQuoteChangeRef.current < 7500) return;

		setIsQuoteVisible(false);
		setTimeout(() => {
			setQuoteIndex((prevIndex) => (prevIndex + 1) % quotes.length);
			setIsQuoteVisible(true);
			lastQuoteChangeRef.current = now;
		}, 500);
	}, []);

	useEffect(() => {
		const initAudio = async () => {
			audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
			alarm2ContextRef.current = new (window.AudioContext || window.webkitAudioContext)();

			try {
				// Load both sounds
				const [alarmResponse, alarm2Response] = await Promise.all([
					fetch(alarm),
					fetch(alarm2)
				]);

				const [alarmBuffer, alarm2Buffer] = await Promise.all([
					alarmResponse.arrayBuffer(),
					alarm2Response.arrayBuffer()
				]);

				audioBufferRef.current = await audioContextRef.current.decodeAudioData(alarmBuffer);
				alarm2BufferRef.current = await alarm2ContextRef.current.decodeAudioData(alarm2Buffer);
			} catch (error) {
				console.error('Failed to load audio:', error);
			}
		};

		initAudio();

		return () => {
			if (audioContextRef.current?.state !== 'closed') {
				audioContextRef.current?.close();
			}
			if (alarm2ContextRef.current?.state !== 'closed') {
				alarm2ContextRef.current?.close();
			}
		};
	}, []);

	// Play sound function using Web Audio API
	const playSound = useCallback(() => {
		if (audioContextRef.current && audioBufferRef.current) {
			try {
				// Resume AudioContext if it's suspended
				if (audioContextRef.current.state === 'suspended') {
					audioContextRef.current.resume();
				}

				// Create new buffer source for each play
				const source = audioContextRef.current.createBufferSource();
				source.buffer = audioBufferRef.current;
				source.connect(audioContextRef.current.destination);
				source.start(0);
			} catch (error) {
				console.error('Error playing sound:', error);
			}
		}
	}, []);

	const playAlarm2 = useCallback(() => {
		if (alarm2ContextRef.current && alarm2BufferRef.current) {
			try {
				if (alarm2ContextRef.current.state === 'suspended') {
					alarm2ContextRef.current.resume();
				}

				const source = alarm2ContextRef.current.createBufferSource();
				source.buffer = alarm2BufferRef.current;
				source.connect(alarm2ContextRef.current.destination);
				source.start(0);
			} catch (error) {
				console.error('Error playing alarm2:', error);
			}
		}
	}, []);

	useEffect(() => {
		changeQuote();
		quoteIntervalRef.current = setInterval(changeQuote, 8000);

		return () => {
			if (quoteIntervalRef.current) {
				clearInterval(quoteIntervalRef.current);
			}
		};
	}, [changeQuote]);

	// Modify your existing time effect to include notification
	useEffect(() => {
		if (currentTime === 1) {
			playAlarm2();
			showLocalNotification();
		}
	}, [currentTime, playAlarm2, showLocalNotification]);

	const handleStartPause = () => {
		if (isRunning) {
			pauseTimer();
			playSound();
		} else {
			// Request notification permission when starting timer
			if (!Push.Permission.has()) {
				Push.Permission.request(
					() => {
						console.log('Notification permission granted');
						startTimer(); // Start timer after permission is granted
						playSound();
					},
					() => {
						console.log('Notification permission denied');
						startTimer(); // Start timer even if permission is denied
						playSound();
					}
				);
			} else {
				// If permission already granted, just start the timer
				startTimer();
				playSound();
			}
		}
	};

	const handleSkip = () => {
		skipSession();
	};

	const handleCloseModal = () => {
		closeBreakModal();
	};

	const formatTime = (seconds) => {
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
	};

	const getSessionTypeText = () => {
		switch (session) {
			case 'study':
				return 'Study Session';
			case 'shortBreak':
				return 'Short Break';
			case 'longBreak':
				return 'Long Break';
			default:
				return '';
		}
	};

	const go = () => {
		navigate('/PomodoroSettings');
	};

	const renderMotivationalContent = () => (
		<div
			className={`mt-4 text-center ${
				isDarkMode ? 'text-secondary' : 'text-primary'
			} transition-opacity duration-500 ease-in-out ${
				isQuoteVisible ? 'opacity-100' : 'opacity-0'
			}`}>
			<p className="font-pmedium text-xs">{quotes[quoteIndex]}</p>
		</div>
	);

	const renderMobileLayout = () => (
		<div className="flex items-center justify-between w-full">
			<div
				className={`text-sm font-pbold hidden xs:inline ${
					isDarkMode ? 'text-secondary' : 'text-primary'
				}`}>
				{getSessionTypeText()}
			</div>

			<div className={`text-lg font-pbold ${isDarkMode ? 'text-secondary' : 'text-primary'}`}>
				{formatTime(currentTime)}
			</div>
			<div className="flex space-x-1">
				<button
					onClick={handleStartPause}
					className={`${isDarkMode ? 'text-secondary' : 'text-primary'} p-1 rounded`}
					aria-label={isRunning ? 'Pause' : 'Start'}>
					<FontAwesomeIcon icon={isRunning ? faPause : faPlay} />
				</button>
				<button
					onClick={handleSkip}
					className={`${isDarkMode ? 'text-secondary' : 'text-primary'} p-1 rounded`}
					aria-label="Skip">
					<FontAwesomeIcon icon={faStepForward} />
				</button>
			</div>
		</div>
	);

	const renderTimerContent = () => (
		<div className={`flex flex-col items-center space-y-2`}>
			<h3
				className={`font-pbold ${
					isCollapsed ? 'text-md text-center' : 'text-xl md:text-md xs:text-sm lg:text-1xl'
				} ${isDarkMode ? 'text-secondary' : 'text-primary'}`}>
				{getSessionTypeText()}
			</h3>
			<div
				className={`flex justify-center items-center ${
					isCollapsed ? 'text-2xl' : 'md:text-md sm:text-sm lg:text-5xl'
				} font-pbold ${
					isDarkMode ? 'text-secondary' : 'text-primary'
				} transition-all duration-300 ease-in-out`}>
				{formatTime(currentTime)}
			</div>
			<div className="flex space-x-2">
				<button
					onClick={handleStartPause}
					className={`p-3 rounded-full ${
						isDarkMode ? 'text-secondary' : 'text-primary'
					} hover:opacity-80 transition-opacity duration-300`}
					aria-label={isRunning ? 'Pause' : 'Start'}>
					<FontAwesomeIcon icon={isRunning ? faPause : faPlay} size="lg" />
				</button>
				<button
					onClick={handleSkip}
					className={`p-3 rounded-full ${
						isDarkMode ? 'text-secondary' : 'text-primary'
					} hover:opacity-80 transition-opacity duration-300`}
					aria-label="Skip">
					<FontAwesomeIcon icon={faStepForward} size="lg" />
				</button>
			</div>
		</div>
	);

	const renderContent = () => {
		if (isMobile) {
			return renderMobileLayout();
		} else {
			return renderTimerContent();
		}
	};

	return (
		<div
			className={`p-2 transition-all duration-300 ease-in-out cursor-pointer sm:bg-none sm:shadow-none sm:p-0`}>
			{renderContent()}
			{!isCollapsed && !isMobile && renderMotivationalContent()}
			{showBreakModal && (
				<TimerModal
					time={currentTime}
					isRunning={isRunning}
					onStartPause={handleStartPause}
					onSkip={handleSkip}
					onClose={handleCloseModal}
					sessionType={session}
				/>
			)}

			{!isMobile && (
				<p
					onClick={go}
					className={`text-center mt-4 text-sm sm:text-xs md:text-md  text-gray-500 hover:underline`}>
					Customize Timer 
				</p>
			)}
		</div>
	);
};

export default Timer;
