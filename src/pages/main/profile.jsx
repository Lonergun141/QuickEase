import { useState, useEffect, memo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faListCheck, faStickyNote, faClone, faMedal, faXmark, faChevronRight, faTrophy } from '@fortawesome/free-solid-svg-icons';
import Sidebar from '../../components/sidebar';
import { fetchUserInfo } from '../../features/auth/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { useDarkMode } from '../../features/Darkmode/darkmodeProvider';
import Modal from '../../components/Modals/Modal';
import { img } from '../../constants';
import { useBadges } from '../../features/badge/badgeContext';
import { useUserStats } from '../../features/badge/userStatsContext';
import BadgeCard from '../../components/Cards/badgCard';

export default function Profile() {
	const [sidebarExpanded, setSidebarExpanded] = useState(true);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const openModal = () => setIsModalOpen(true);
	const closeModal = () => setIsModalOpen(false);
	const { isDarkMode } = useDarkMode();
	const dispatch = useDispatch();
	const userInfo = useSelector((state) => state.auth.userInfo);
	const [showModal, setShowModal] = useState(false);

	// Use the badges and achievements from the BadgeContext
	const { achievements, badgeDefinitions } = useBadges();

	// Use user stats from UserStatsContext
	const { flashcardCount, notesCount, averageScore } = useUserStats();

	// Fetch user info on component mount
	useEffect(() => {
		dispatch(fetchUserInfo());
	}, [dispatch]);

	const handleSidebarToggle = (isExpanded) => {
		setSidebarExpanded(isExpanded);
	};

	// Map earned achievements to badges
	const earnedBadges = achievements.map((achievement) => {
		return Object.values(badgeDefinitions).find((badge) => badge.id === achievement.badge);
	});

	// List of earned badge IDs
	const earnedBadgeIds = achievements.map((achievement) => achievement.badge);

	const AchievementsModal = ({ isOpen, onClose }) => {
		const achievementsCount = earnedBadgeIds.length;
		const totalBadges = Object.keys(badgeDefinitions).length;

		// Memoized Badge Card Component
		const BadgeCard = memo(({ badge, isEarned }) => (
			<div className="bg-white dark:bg-zinc-800/50 rounded-2xl p-4">
				<div className="flex flex-col items-center">
					{/* Badge Image */}
					<img 
						src={badge.image} 
						alt={badge.title}
						className={`w-16 h-16 mb-3 ${isEarned ? 'opacity-100' : 'opacity-50'}`}
						style={{ transform: `scale(${isEarned ? 1 : 0.9})` }}
					/>
					
					{/* Badge Title */}
					<h3 className={`text-base font-pbold text-center mb-2 ${
						isEarned 
							? 'text-primary dark:text-secondary' 
							: 'text-gray-400 dark:text-gray-500'
					}`}>
						{badge.title}
					</h3>
					
					{/* Badge Description */}
					<p className="text-sm text-center text-zinc-600 dark:text-zinc-400 mb-3">
						{badge.description}
					</p>
					
					{/* Badge Status */}
					<div className={`px-4 py-1.5 rounded-full text-xs font-pmedium ${
						isEarned 
							? 'bg-primary/10 dark:bg-secondary/20 text-primary dark:text-secondary' 
							: 'bg-gray-100 dark:bg-zinc-800 text-gray-500 dark:text-gray-400'
					}`}>
						{isEarned ? 'Achieved' : 'Not Yet Achieved'}
					</div>
				</div>
			</div>
		));

		return (
			<Modal isOpen={isOpen} onClose={onClose}>
				<div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center">
					<div className="bg-zinc-50 dark:bg-zinc-900 w-full sm:w-[800px] max-h-[80vh] rounded-t-[32px] sm:rounded-2xl shadow-lg">
						{/* Header */}
						<div className="px-6 pt-6 pb-4 border-b border-gray-100 dark:border-gray-800">
							<div className="flex justify-between items-center">
								<div className="flex items-center space-x-3">
									<div className="bg-primary/10 dark:bg-secondary/20 p-2 rounded-full">
										<FontAwesomeIcon 
											icon={faMedal} 
											className="text-2xl text-primary " 
										/>
									</div>
									<h2 className="text-xl font-pbold text-primary dark:text-secondary">
										Achievements
									</h2>
								</div>
								<button 
									onClick={onClose}
									className="bg-gray-100 dark:bg-zinc-800 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors"
								>
									<FontAwesomeIcon 
										icon={faXmark} 
										className="text-lg text-gray-600 dark:text-gray-400" 
									/>
								</button>
							</div>
							
							<div className="mt-4">
								<p className="text-sm text-gray-500 font-pregular dark:text-gray-400 mb-2">
									Your Progress
								</p>
								<div className="flex justify-between items-center">
									<p className="text-2xl font-pbold text-primary dark:text-secondary">
										{achievementsCount}/{totalBadges}
									</p>
									<p className="text-sm text-gray-500 font-pregular dark:text-gray-400">
										Badges Earned
									</p>
								</div>
							</div>
						</div>

						{/* Badges Grid */}
						<div className="overflow-y-auto p-4 max-h-[calc(80vh-180px)]">
							<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
								{Object.values(badgeDefinitions).map((badge) => (
									<BadgeCard
										key={badge.id}
										badge={badge}
										isEarned={earnedBadgeIds.includes(badge.id)}
									/>
								))}
							</div>
						</div>
					</div>
				</div>
			</Modal>
		);
	};

	return (
		<div className="flex flex-col lg:flex-row min-h-screen bg-secondary dark:bg-dark w-full">
			<Sidebar onToggle={handleSidebarToggle} />
			<main
				className={`transition-all duration-300 flex-grow p-4 sm:p-6 lg:p-8 mt-16 lg:mt-0 ${
					sidebarExpanded ? 'lg:ml-72' : 'lg:ml-28'
				}`}>
				<div className="max-w-7xl space-y-6 sm:space-y-8">
					{/* Main Container - Add padding top for content spacing */}
					<div className="relative flex flex-col min-h-screen">
						{/* Profile Header Section */}
						<div className="relative">
							{/* Background Banner */}
							<div className="hidden sm:block h-48 md:h-56 rounded-2xl relative overflow-hidden bg-white/5 dark:bg-darken backdrop-blur-xl">
								{/* Animated Background Elements */}
								<div className="absolute inset-0">
									<div className="absolute -left-10 top-0 w-72 h-72 bg-primary/10 rounded-full blur-2xl animate-pulse-slow"></div>
									<div className="absolute -right-10 bottom-0 w-72 h-72 bg-emerald-500/10 rounded-full blur-2xl animate-pulse-slower"></div>
									<div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-amber-500/10 rounded-full blur-xl"></div>
								</div>

								{/* Refined Pattern Overlay */}
								<div className="absolute inset-0 bg-gradient-to-br from-white/[0.07] to-transparent dark:from-zinc-900/30 dark:to-zinc-900/0"></div>
								<div className="absolute inset-0 bg-pattern opacity-[0.03]"></div>

								{/* Subtle Border */}
								<div className="absolute inset-0 rounded-2xl border border-zinc-200/10 dark:border-zinc-800/50"></div>
							</div>

							{/* Profile Content */}
							<div className="relative sm:absolute sm:-bottom-16 w-full px-3 sm:px-4">
								<div className="bg-white dark:bg-darken rounded-xl sm:rounded-2xl border border-zinc-200/80 dark:border-zinc-800 p-4 sm:p-6 shadow-lg shadow-zinc-200/10 dark:shadow-zinc-950/50">
									<div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
										{/* Profile Picture - Enhanced */}
										<div className="relative group">
											<div className="absolute -inset-0.5 bg-gradient-to-br from-primary/50 to-emerald-500/50 rounded-xl sm:rounded-2xl blur opacity-30 group-hover:opacity-40 transition duration-300"></div>
											<div className="relative w-20 h-20 sm:w-32 sm:h-32 rounded-xl sm:rounded-2xl bg-gradient-to-br from-zinc-50 to-white dark:from-zinc-900 dark:to-zinc-800 flex items-center justify-center text-3xl sm:text-5xl font-pbold text-primary dark:text-secondary border border-zinc-200 dark:border-zinc-700/80">
												{userInfo?.firstname?.charAt(0).toUpperCase()}
											</div>
										</div>

										{/* User Info - Enhanced */}
										<div className="flex-grow text-center sm:text-left space-y-2">
											<h1 className="text-xl sm:text-3xl font-pbold bg-gradient-to-r from-zinc-900 to-zinc-600 dark:from-white dark:to-zinc-300 bg-clip-text text-transparent">
												{userInfo?.firstname} {userInfo?.lastname}
											</h1>
											<p className="text-sm sm:text-base text-zinc-500 dark:text-zinc-400 font-pregular break-all sm:break-normal">
												{userInfo?.email}
											</p>
										</div>
									</div>
								</div>
							</div>
						</div>

						{/* Stats Grid - Adjusted margin top */}
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 mt-4 sm:mt-28 px-3 sm:px-4">
							{/* Quiz Card */}
							<div
								onClick={openModal}
								className="group bg-white dark:bg-darken rounded-xl border border-zinc-200 dark:border-zinc-800 p-4 sm:p-6 hover:border-primary dark:hover:border-secondary/20 transition-all duration-200 cursor-pointer">
								<div className="flex items-center justify-between">
									<div className="flex items-center gap-3 sm:gap-4">
										<div className="p-2.5 sm:p-3 rounded-lg bg-primary/10 dark:bg-primary/20 text-primary">
											<FontAwesomeIcon icon={faListCheck} className="text-lg sm:text-2xl" />
										</div>
										<div>
											<h3 className="text-xs sm:text-sm font-pmedium text-zinc-600 dark:text-zinc-400">
												Quiz Evaluation
											</h3>
											<p className="text-xl sm:text-3xl font-pbold text-zinc-900 dark:text-zinc-100">
												{averageScore}%
											</p>
										</div>
									</div>
								</div>
								<div className="mt-3 w-full h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
									<div
										className="h-full bg-primary dark:bg-secondary transition-all duration-300"
										style={{ width: `${averageScore}%` }}></div>
								</div>
							</div>

							{/* Notes Card */}
							<Link
								to="/MyNotes"
								className="group bg-white dark:bg-darken rounded-xl border border-zinc-200 dark:border-zinc-800 p-4 sm:p-6 hover:border-primary dark:hover:border-secondary/20 transition-all duration-200 cursor-pointer">
								<div className="flex items-center gap-4">
									<div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500">
										<FontAwesomeIcon icon={faStickyNote} className="text-xl sm:text-2xl" />
									</div>
									<div>
										<h3 className="text-sm font-pmedium text-zinc-600 dark:text-zinc-400">
											Notes Created
										</h3>
										<p className="text-2xl sm:text-3xl font-pbold text-zinc-900 dark:text-zinc-100">
											{notesCount}
										</p>
									</div>
								</div>
							</Link>

							{/* Flashcards Card */}
							<Link
								to="/FlashCardhistory"
								className="group bg-white dark:bg-darken rounded-xl border border-zinc-200 dark:border-zinc-800 p-4 sm:p-6 hover:border-primary dark:hover:border-secondary/20 transition-all duration-200 cursor-pointer">
								<div className="flex items-center gap-4">
									<div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-500/10 text-amber-500">
										<FontAwesomeIcon icon={faClone} className="text-xl sm:text-2xl" />
									</div>
									<div>
										<h3 className="text-sm font-pmedium text-zinc-600 dark:text-zinc-400">
											Flashcards
										</h3>
										<p className="text-2xl sm:text-3xl font-pbold text-zinc-900 dark:text-zinc-100">
											{flashcardCount}
										</p>
									</div>
								</div>
							</Link>
						</div>

						{/* Achievements Section - Adjusted margin top */}
						<div className="mt-8">
							{/* Header */}
							<div className="flex justify-between items-center mb-4 px-3 sm:px-4">
								<div className="flex items-center">
									<h3 className="font-pbold text-lg sm:text-xl text-zinc-900 dark:text-white">
										Badges
									</h3>
									<div className="ml-3 bg-primary/10 dark:bg-secondary/20 px-2.5 py-1 rounded-lg">
										<span className="text-xs sm:text-sm text-primary dark:text-secondary font-pbold">
											{earnedBadges.length}/{Object.keys(badgeDefinitions).length}
										</span>
									</div>
								</div>
								<button
									onClick={() => setShowModal(true)}
									className="flex items-center group">
									<span className="text-sm sm:text-base text-primary dark:text-secondary font-pregular mr-1 group-hover:opacity-80">
										View all
									</span>
									<FontAwesomeIcon
										icon={faChevronRight}
										className="text-sm sm:text-base text-primary dark:text-secondary group-hover:opacity-80"
									/>
								</button>
							</div>

							{/* Badges Grid */}
							<div className="bg-white dark:bg-darken rounded-2xl p-3 sm:p-4 mx-3 sm:mx-4">
								{earnedBadges.length > 0 ? (
									<div className="flex flex-wrap">
										{earnedBadges.map((badge) => (
											<div
												key={badge.id}
												className="w-1/4 sm:w-1/6 p-1.5 sm:p-2"
											>
												<div className="aspect-square rounded-xl bg-zinc-50 dark:bg-zinc-800/50 shadow-sm flex items-center justify-center relative">
													<img
														src={badge.image}
														alt={badge.title}
														className="w-[65%] sm:w-[70%] h-[65%] sm:h-[70%] object-contain"
													/>
													<span className="absolute bottom-1 text-[10px] sm:text-xs text-zinc-900 dark:text-secondary font-pregular text-center px-1 truncate w-full">
														{badge.title}
													</span>
												</div>
											</div>
										))}
									</div>
								) : (
									<div className="py-8 flex flex-col items-center">
										<div className="bg-white dark:bg-zinc-800 rounded-xl p-4 mb-3">
											<FontAwesomeIcon
												icon={faTrophy}
												className="text-2xl sm:text-3xl text-primary dark:text-secondary"
											/>
										</div>
										<p className="text-sm sm:text-base text-zinc-900 dark:text-secondary font-pregular text-center">
											Complete activities to earn badges
										</p>
									</div>
								)}
							</div>
						</div>
					</div>
				</div>

				{/* Existing Modals */}
				<Modal isOpen={isModalOpen} onClose={closeModal} title="Quiz Evaluation Explained">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 p-3 sm:p-0">
						<div className="text-gray-800 dark:text-gray-200 space-y-4">
							<h3 className="text-xl font-semibold">How It Works</h3>
							<p className="text-base">
								Your quiz evaluation score is calculated based on your performance across
								all quizzes you've taken:
							</p>
							<ul className="list-disc pl-5 text-base space-y-2">
								<li>We sum up all the points you've earned.</li>
								<li>We divide this by the total possible points from all quizzes.</li>
								<li>The result is converted to a percentage.</li>
							</ul>
							<p className="text-base font-medium mt-4">
								This score reflects your overall mastery of the topics you've been quizzed
								on. Keep taking quizzes to improve your score!
							</p>
						</div>
						<div className="flex justify-center items-center">
							<img
								src={isDarkMode ? img.quick : img.Mascot}
								alt={isDarkMode ? 'NightWing Mascot' : 'Quickie Mascot'}
								className="w-full max-w-xs md:max-w-sm lg:max-w-md xl:max-w-lg transform hover:scale-105 transition duration-300 ease-in-out animate-float z-5"
							/>
						</div>
					</div>
				</Modal>

				<AchievementsModal isOpen={showModal} onClose={() => setShowModal(false)} />
			</main>
		</div>
	);
}
