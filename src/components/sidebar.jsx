import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	faCompass,
	faClock,
	faStickyNote,
	faClone,
	faCog,
	faSignOutAlt,
	faChevronLeft,
	faChevronRight,
	faBars,
	faTimes,
	faLightbulb,
	faUserCircle,
	faSignOut,
	faListCheck,
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
	const { activeSettings } = useSelector((state) => state.pomodoro);
	const navigate = useNavigate();
	const location = useLocation();
	const { isDarkMode } = useDarkMode();

	const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
	const [isOpen, setIsOpen] = useState(false);

	useEffect(() => {
		dispatch(fetchUserInfo());
	}, [dispatch]);

	useEffect(() => {
		const handleResize = () => {
			setIsMobile(window.innerWidth < 1024);
		};

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
		navigate('/');
	};

	const handleNavigation = (path) => {
		navigate(path);
		if (isMobile) {
			setIsOpen(false);
		}
	};

	const menuItems = [
		{ icon: faCompass, text: 'Explore', path: '/Home' },
		{ icon: faStickyNote, text: 'Summary Notes', path: '/MyNotes' },
		{ icon: faClone, text: 'Flashcards', path: '/FlashCardhistory' },
		{ icon: faListCheck, text: 'Quizzes', path: '/QuizHistory' },
		{ icon: faClock, text: 'Pomodoro', path: '/PomodoroSettings' },
		{ icon: faCog, text: 'Settings', path: '/Settings' },
		{ icon: faUserCircle, text: 'Profile', path: '/Profile' },
	];

	const renderLogo = () => (
		<div
			className="flex items-center justify-center py-6 cursor-pointer"
			onClick={() => navigate('/Home')}>
			<span className="text-2xl font-inc tracking-wider">
				<span className="text-black dark:text-gray-100">QUICK</span>
				<span className="text-primary dark:text-naeg">EASE</span>
			</span>
		</div>
	);

	const renderMenuItem = (item, index) => (
		<li
			key={index}
			className={`list-none group select-none`}
			onClick={() => handleNavigation(item.path)}>
			<div
				className={`flex items-center gap-x-2 px-3 py-2 text-sm font-medium rounded-md
					${
						location.pathname === item.path
							? 'bg-primary/10 text-primary dark:bg-darkS dark:text-secondary'
							: 'text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-darkS/50 hover:text-zinc-900 dark:hover:text-zinc-50'
					} transition-all duration-150 ease-in-out`}>
				<FontAwesomeIcon
					icon={item.icon}
					className={`h-4 w-4 ${isCollapsed ? 'mx-auto' : ''}`}
				/>
				{!isCollapsed && <span className="truncate">{item.text}</span>}
			</div>
		</li>
	);

	const renderSidebarContent = () => (
		<div className="flex flex-col justify-between h-full w-full">
			<div>
				<nav className="mt-8">
					<ul className="space-y-1">
						{menuItems.map((item, index) => renderMenuItem(item, index))}
					</ul>
				</nav>
			</div>
			<div className="p-4">
				<Button
					className="mt-4 p-8 flex items-center justify-center w-full bg-highlights dark:bg-secondary hover:bg-primary-dark  dark:hover:bg-primary"
					onClick={handleLogout}>
					<FontAwesomeIcon icon={faSignOut} className="dark:text-dark" />
					<span className="ml-4 text-white dark:text-dark">Logout</span>
				</Button>
			</div>
		</div>
	);

	return (
		<>
			{isMobile ? (
				<>
					<div className="fixed top-0 left-0 right-0 h-16 bg-white dark:bg-darken flex items-center px-4 z-50">
						<button onClick={toggleSidebar} className="p-2 text-gray-600 dark:text-gray-300">
							<FontAwesomeIcon icon={faBars} size="lg" />
						</button>
						<div className="flex-1">
							{activeSettings.showTimer && (
								<div className="p-2 m-2 py-2 rounded-md">
									<Timer isCollapsed={false} isMobile={true} />
								</div>
							)}
						</div>
					</div>
					<div
						className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 ${
							isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
						}`}
						onClick={toggleSidebar}></div>
					<div
						className={`fixed top-0 left-0 w-full h-screen bg-white dark:bg-darken z-50 transition-transform duration-300 ${
							isOpen ? 'transform translate-x-0' : 'transform -translate-x-full'
						}`}>
						<div className="h-16 bg-white dark:bg-darken  flex items-center justify-between px-4">
							{renderLogo()}
							<button
								onClick={toggleSidebar}
								className="p-2 text-gray-600 dark:text-gray-300">
								<FontAwesomeIcon icon={faTimes} size="lg" />
							</button>
						</div>
						<div className="h-[calc(100%-4rem)] overflow-y-auto">
							{renderSidebarContent()}

						
						</div>
					</div>
				</>
			) : (
				<div
					className={`fixed top-0 left-0 ${
						isCollapsed ? 'w-20' : 'w-64'
					} h-screen border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-darken flex flex-col gap-4 transition-all duration-300 z-50`}>
					{/* Logo Section */}
					<div className="flex h-14 items-center border-b border-zinc-200 dark:border-zinc-800 px-3 py-4">
						{!isCollapsed && renderLogo()}
						<button
							onClick={toggleSidebar}
							className="absolute -right-2.5 top-6 flex h-6 w-6 items-center justify-center rounded-full border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-darken hover:bg-zinc-50 dark:hover:bg-darkS">
							<FontAwesomeIcon
								icon={isCollapsed ? faChevronRight : faChevronLeft}
								className="h-3 w-3 text-zinc-500 dark:text-zinc-400"
							/>
						</button>
					</div>

					{/* Navigation Section */}
					<nav className="flex-1 px-1">
						<ul className="space-y-1 py-2">
							{menuItems.map((item, index) => renderMenuItem(item, index))}
						</ul>
					</nav>

					{/* Timer Section */}
					{activeSettings.showTimer && (
						<div className="mx-3 rounded-md  p-2">
							<Timer isCollapsed={isCollapsed} isMobile={false} />
						</div>
					)}

					{/* Logout Section */}
					<div className="border-t border-zinc-200 dark:border-zinc-800 p-3">
						<button
							onClick={handleLogout}
							className={`flex w-full items-center justify-center gap-x-2 rounded-md bg-highlights px-3 py-4 text-sm font-medium text-white dark:text-dark 
								hover:bg-highlights dark:bg-secondary/90 dark:hover:bg-secondary transition-colors duration-150`}>
							<FontAwesomeIcon icon={faSignOutAlt} className="h-4 w-4" />
							{!isCollapsed && <span>Logout</span>}
						</button>
					</div>
				</div>
			)}
		</>
	);
};

export default Sidebar;
