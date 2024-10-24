import React, { useContext, useEffect, useState, useCallback, useRef } from 'react';
import { TimerContext } from '../features/Pomodoro/TimerContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPause, faForward } from '@fortawesome/free-solid-svg-icons';
import TimerModal from './timerModal';
import alarm from '../assets/Audio/hey.mp3';
import { useSelector } from 'react-redux';
import { useDarkMode } from '../features/Darkmode/darkmodeProvider';
import { useNavigate } from 'react-router-dom';

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

	const navigate = useNavigate();

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
		changeQuote();
		quoteIntervalRef.current = setInterval(changeQuote, 8000);

		return () => {
			if (quoteIntervalRef.current) {
				clearInterval(quoteIntervalRef.current);
			}
		};
	}, [changeQuote]);

	useEffect(() => {
		if (currentTime === 1) {
			sound.play().catch((error) => {
				console.error('Audio play failed:', error);
			});
		}
	}, [currentTime]);

	const handleStartPause = () => {
		if (isRunning) {
			pauseTimer();
			sound.play();
		} else {
			startTimer();
			sound.play();
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
			<p className="font-pmedium text-sm">{quotes[quoteIndex]}</p>
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
					<FontAwesomeIcon icon={faForward} />
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
					isCollapsed ? 'text-2xl' : 'md:text-md sm:text-sm lg:text-6xl'
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
					<FontAwesomeIcon icon={faForward} size="lg" />
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
					className={`text-center mt-4 lg:text-md md:text-sm text-gray-500 hover:underline`}>
					Learn more
				</p>
			)}
		</div>
	);
};

export default Timer;
