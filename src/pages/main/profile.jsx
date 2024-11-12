import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faListCheck, faStickyNote, faClone, faTrophy } from '@fortawesome/free-solid-svg-icons';
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

	return (
		<div className="flex flex-col lg:flex-row min-h-screen bg-secondary dark:bg-dark w-full">
			<Sidebar onToggle={handleSidebarToggle} />
			<main
				className={`transition-all duration-300 flex-grow p-4 sm:p-6 lg:p-8 mt-16 lg:mt-0 ${
					sidebarExpanded ? 'lg:ml-72' : 'lg:ml-28'
				}`}>
				<div className="max-w-7xl space-y-6 sm:space-y-8">
					{/* Profile Header - Refined Design */}
					<div className="relative">
						{/* Background Banner */}
						<div className="h-32 sm:h-48 rounded-2xl relative overflow-hidden bg-white/5 dark:bg-darken backdrop-blur-xl">
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

						{/* Profile Content - Enhanced */}
						<div className="relative mt-16 sm:-mt-20">
							<div className="bg-white dark:bg-darken rounded-2xl border border-zinc-200/80 dark:border-zinc-800 p-6 shadow-lg shadow-zinc-200/10 dark:shadow-zinc-950/50">
								<div className="flex flex-col sm:flex-row items-center gap-6">
									{/* Profile Picture - Enhanced */}
									<div className="relative group">
										<div className="absolute -inset-0.5 bg-gradient-to-br from-primary/50 to-emerald-500/50 rounded-2xl blur opacity-30 group-hover:opacity-40 transition duration-300"></div>
										<div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-2xl bg-gradient-to-br from-zinc-50 to-white dark:from-zinc-900 dark:to-zinc-800 flex items-center justify-center text-4xl sm:text-5xl font-pbold text-primary dark:text-secondary border border-zinc-200 dark:border-zinc-700/80">
											{userInfo?.firstname?.charAt(0).toUpperCase()}
										</div>
									</div>

									{/* User Info - Enhanced */}
									<div className="flex-grow text-center sm:text-left space-y-2">
										<h1 className="text-2xl sm:text-3xl font-pbold bg-gradient-to-r from-zinc-900 to-zinc-600 dark:from-white dark:to-zinc-300 bg-clip-text text-transparent">
											{userInfo?.firstname} {userInfo?.lastname}
										</h1>
										<div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
											<p className="text-sm sm:text-base text-zinc-500 dark:text-zinc-400 font-pregular">
												{userInfo?.email}
											</p>
											
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>

					{/* Stats Grid - Refined */}
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
						{/* Quiz Card */}
						<div
							onClick={openModal}
							className="group bg-white dark:bg-darken rounded-xl border border-zinc-200 dark:border-zinc-800 p-5 sm:p-6 hover:border-primary dark:hover:border-secondary/20 transition-all duration-200 cursor-pointer">
							<div className="flex items-center justify-between mb-4">
								<div className="flex items-center gap-4">
									<div className="p-3 rounded-lg bg-primary/10 dark:bg-primary/20 text-primary">
										<FontAwesomeIcon icon={faListCheck} className="text-xl sm:text-2xl" />
									</div>
									<div>
										<h3 className="text-sm font-pmedium text-zinc-600 dark:text-zinc-400">
											Quiz Evaluation
										</h3>
										<p className="text-2xl sm:text-3xl font-pbold text-zinc-900 dark:text-zinc-100">
											{averageScore}%
										</p>
									</div>
								</div>
							</div>
							<div className="mt-2 w-full h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
								<div
									className="h-full bg-primary dark:bg-secondary transition-all duration-300"
									style={{ width: `${averageScore}%` }}></div>
							</div>
						</div>

						{/* Notes Card */}
						<Link
							to="/MyNotes"
							className="group bg-white dark:bg-darken rounded-xl border border-zinc-200 dark:border-zinc-800 p-5 sm:p-6 hover:border-primary dark:hover:border-secondary/20 transition-all duration-200 cursor-pointer">
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
							className="group bg-white dark:bg-darken rounded-xl border border-zinc-200 dark:border-zinc-800 p-5 sm:p-6 hover:border-primary dark:hover:border-secondary/20 transition-all duration-200 cursor-pointer">
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

					{/* Achievements Section - Refined */}
					<div className="bg-white dark:bg-darken rounded-xl border border-zinc-200 dark:border-zinc-800 p-5 sm:p-6">
						<div className="flex items-center justify-between mb-6">
							<div className="flex items-center gap-3">
								<div className="p-2.5 rounded-lg bg-amber-50 dark:bg-amber-500/10">
									<FontAwesomeIcon
										icon={faTrophy}
										className="text-amber-500 text-lg sm:text-xl"
									/>
								</div>
								<div>
									<h2 className="text-lg font-psemibold text-zinc-900 dark:text-zinc-100 mb-1">
										Achievements
									</h2>
									<p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
										Your earned badges and rewards
									</p>
								</div>
							</div>
							<button
								onClick={() => setShowModal(true)}
								className=" text-sm font-pmedium text-primary dark:text-secondary hover:bg-primary/5 dark:hover:bg-secondary/5 rounded-lg transition-colors">
								View All
							</button>
						</div>

						<div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3 sm:gap-4">
							{earnedBadges.map((badge, index) => (
								<div
									key={index}
									className="group relative aspect-square rounded-lg  p-2 flex items-center justify-center hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors duration-200">
									<img
										src={badge.image}
										alt={badge.title}
										className="w-full h-full object-contain"
									/>
									<div className="absolute inset-0 flex items-center justify-center bg-black/75 text-white text-xs text-center p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200">
										{badge.title}
									</div>
								</div>
							))}
						</div>
					</div>
				</div>

				{/* Existing Modals */}
				<Modal isOpen={isModalOpen} onClose={closeModal} title="Quiz Evaluation Explained">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
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

				<Modal isOpen={showModal} onClose={() => setShowModal(false)} title="All Achievements">
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
						{Object.values(badgeDefinitions).map((badge, index) => (
							<BadgeCard
								key={index}
								src={badge.image}
								title={badge.title}
								description={badge.description}
								isEarned={earnedBadgeIds.includes(badge.id)}
							/>
						))}
					</div>
				</Modal>
			</main>
		</div>
	);
}
