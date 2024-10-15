import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	faCompass,
	faHistory,
	faClock,
	faStickyNote,
	faClone,
	faCog,
	faSignOutAlt,
	faSignOut,
	faChevronLeft,
	faChevronRight,
	faBars,
	faTimes,
	faLightbulb,
	faUserCircle,
} from '@fortawesome/free-solid-svg-icons';
import Button from './button';
import Timer from './Timer';
import { useNavigate, useLocation } from 'react-router-dom';
import { logout, fetchUserInfo } from '../features/auth/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { resetPomodoroState } from '../features/Pomodoro/pomodoroSlice';
import { useDarkMode } from '../features/Darkmode/darkmodeProvider';

const Sidebar = ({ onToggle }) => {
	const [isCollapsed, setIsCollapsed] = useState(() => {
		const saved = localStorage.getItem('sidebarCollapsed');
		return saved ? JSON.parse(saved) : false;
	});

	const dispatch = useDispatch();
	const { userInfo } = useSelector((state) => state.auth);
	const { activeSettings } = useSelector((state) => state.pomodoro);
	const navigate = useNavigate();
	const location = useLocation();
	const { isDarkMode } = useDarkMode();

	const [isMobile, setIsMobile] = useState(false);
	const [isOpen, setIsOpen] = useState(false);

	useEffect(() => {
		dispatch(fetchUserInfo());
	}, [dispatch]);

	useEffect(() => {
		const handleResize = () => {
			setIsMobile(window.innerWidth < 1024);
		};

		handleResize();
		window.addEventListener('resize', handleResize);

		return () => window.removeEventListener('resize', handleResize);
	}, []);

	useEffect(() => {
		localStorage.setItem('sidebarCollapsed', JSON.stringify(isCollapsed));
		if (onToggle && typeof onToggle === 'function') {
			onToggle(!isCollapsed);
		}
	}, [isCollapsed, onToggle]);

	const toggleSidebar = () => {
		if (isMobile) {
			setIsOpen(!isOpen);
		} else {
			setIsCollapsed(!isCollapsed);
		}
	};

	const handleLogout = () => {
		dispatch(logout());
		dispatch(resetPomodoroState());
		navigate('/QuickEase/');
	};

	const gotoProfile = () => {
		navigate('/QuickEase/Profile');
		if (isMobile) {
			setIsOpen(false);
		}
	};

	const handleNavigation = (path) => {
		navigate(path);
		if (isMobile) {
			setIsOpen(false);
		}
	};

	const handleTimerClick = () => {
		navigate('/QuickEase/PomodoroSettings');
	};

	const menuItems = [
		{ icon: faCompass, text: 'Explore', path: '/QuickEase/Home' },
		{ icon: faStickyNote, text: 'My notes', path: '/QuickEase/MyNotes' },
		{ icon: faClone, text: 'Flashcards', path: '/QuickEase/FlashCardhistory' },
		{ icon: faLightbulb, text: 'Quiz history', path: '/QuickEase/QuizHistory' },
		{ icon: faClock, text: 'Pomodoro', path: '/QuickEase/PomodoroSettings' },
		{ icon: faCog, text: 'Settings', path: '/QuickEase/Settings' },
		{ icon: faUserCircle, text: 'Profile', path: '/QuickEase/Profile' },
	];

	const renderLogo = () => (
		<span className="text-xl font-inc cursor-pointer" onClick={() => navigate('/QuickEase/Home')}>
			<span className="text-black dark:text-gray-100">QUICK</span>
			<span className="text-primary dark:text-naeg">EASE</span>
		</span>
	);

	const renderSidebarContent = () => (
		<div className="flex flex-col justify-between h-full w-full">
			<div>
				<nav className="mt-8">
					<ul className="space-y-1">
						{menuItems.map((item, index) => (
							<li
								key={index}
								className={`m-2 rounded-md flex items-center p-2 cursor-pointer transition-opacity duration-300 
									${
										location.pathname === item.path
											? 'bg-blue-100 dark:bg-darkS'
											: 'hover:bg-gray-100 dark:hover:bg-naeg hover:opacity-75 dark:hover:opacity-75'
									}`}
								onClick={() => handleNavigation(item.path)}>
								<FontAwesomeIcon
									icon={item.icon}
									className={`${isCollapsed ? 'm-auto' : 'mr-4'} ${
										location.pathname === item.path ? 'text-primary dark:text-secondary' : 'text-gray-600 dark:text-secondary'
									}`}
								/>
								{!isCollapsed && (
									<span
										className={`${
											location.pathname === item.path
												? 'text-primary dark:text-secondary font-semibold'
												: 'text-gray-600 dark:text-secondary font-semibold'
										}`}>
										{item.text}
									</span>
								)}
							</li>
						))}
					</ul>
				</nav>
				{activeSettings.showTimer && (
					<div className="p-2 m-2">
						<Timer isCollapsed={isCollapsed} />
					</div>
				)}
			</div>
			<div className="p-4">
				<Button
					className="mt-4 flex items-center justify-center w-full bg-highlights dark:bg-secondary hover:bg-primary-dark text-white dark:bg-primary-dark dark:hover:bg-primary"
					onClick={handleLogout}>
					<FontAwesomeIcon icon={faSignOut} className="dark:text-dark" />
					<span className="ml-4 text-white dark:text-dark">Logout</span>
				</Button>
			</div>
		</div>
	);

	if (isMobile) {
		return (
			<>
				<div className="fixed top-0 left-0 right-0 h-16 bg-white dark:bg-darken shadow-md flex items-center px-4 z-50">
					<button onClick={toggleSidebar} className="p-2 text-gray-600 dark:text-gray-300">
						<FontAwesomeIcon icon={faBars} size="lg" />
					</button>
					<div className="flex-1 justify-center items-center">
						<div>
							{activeSettings.showTimer && (
								<div className="p-2 m-2 py-2 rounded-md">
									<Timer isCollapsed={false} isMobile={true} />
								</div>
							)}
						</div>
					</div>
				</div>
				<div
					className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 ${
						isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
					}`}
					onClick={toggleSidebar}></div>
				<div
					className={`fixed top-0 left-0 w-full h-screen bg-white dark:bg-darken shadow-lg z-50 transition-transform duration-300 ${
						isOpen ? 'transform translate-x-0' : 'transform -translate-x-full'
					}`}>
					<div className="h-16 bg-white dark:bg-darken shadow-md flex items-center justify-between px-4">
						{renderLogo()}
						<button onClick={toggleSidebar} className="p-2 text-gray-600 dark:text-gray-300">
							<FontAwesomeIcon icon={faTimes} size="lg" />
						</button>
					</div>
					<div className="h-[calc(100%-4rem)] overflow-y-auto">{renderSidebarContent()}</div>
				</div>
			</>
		);
	}

	return (
		<div
			className={`fixed top-0 left-0 ${
				isCollapsed ? 'w-28' : 'w-72'
			} transition-all duration-300 h-screen bg-white dark:bg-darken shadow-lg z-50`}>
			<div className="flex flex-col justify-between h-full w-full">
				<div>
					<div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} p-4`}>
						{!isCollapsed && renderLogo()}
						<button onClick={toggleSidebar} className="text-gray-600 dark:text-secondary">
							<FontAwesomeIcon icon={isCollapsed ? faChevronRight : faChevronLeft} />
						</button>
					</div>
					<nav>
						<ul className="space-y-1">
							{menuItems.map((item, index) => (
								<li
									key={index}
									className={`m-2 rounded-md flex items-center p-2 cursor-pointer ${
										location.pathname === item.path ? 'bg-blue-100 dark:bg-darkS' : 'hover:bg-gray-100 dark:hover:bg-darkS'
									}`}
									onClick={() => handleNavigation(item.path)}>
									<FontAwesomeIcon
										icon={item.icon}
										className={`${isCollapsed ? 'm-auto' : 'mr-4'} ${
											location.pathname === item.path ? 'text-primary dark:text-secondary' : 'text-gray-600 dark:text-secondary'
										}`}
									/>
									{!isCollapsed && (
										<span
											className={
												location.pathname === item.path
													? 'text-primary dark:text-secondary font-semibold'
													: 'text-gray-600 dark:text-secondary font-semibold'
											}>
											{item.text}
										</span>
									)}
								</li>
							))}
						</ul>
					</nav>
					{activeSettings.showTimer && (
						<div className="p-2 pt-8 items-start">
							<div className="flex items-center"></div>
							<div className="mt-4">
								<Timer isCollapsed={isCollapsed} />
							</div>
						</div>
					)}
				</div>
				<div className="p-4">
					<Button
						className="mt-4 flex items-center justify-center bg-highlights hover:bg-primary text-white dark:bg-secondary"
						onClick={handleLogout}>
						<FontAwesomeIcon icon={faSignOutAlt} className=" dark:text-dark " />
						{!isCollapsed && <span className="ml-4 text-secondary dark:text-dark ">Logout</span>}
					</Button>
				</div>
			</div>
		</div>
	);
};

export default Sidebar;
