import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrophy, faStickyNote, faClone } from '@fortawesome/free-solid-svg-icons';
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
				className={`transition-all duration-300 flex-grow p-4 lg:p-8 mt-16 lg:mt-0 ${
					sidebarExpanded ? 'lg:ml-72' : 'lg:ml-28'
				}`}>
				<div className="p-4">
					{/* User Info */}
					<div className="flex flex-col md:flex-row md:justify-between items-center md:items-center space-y-0 md:space-y-0">
						<div className="flex items-center space-x-4">
							{/* Profile Picture */}
							<div className="w-16 h-16 rounded-full bg-primary dark:bg-naeg flex items-center justify-center text-white text-4xl font-bold">
								{userInfo?.firstname?.charAt(0).toUpperCase()}
							</div>
							{/* Name and Email */}
							<div className="flex flex-col">
								<h3 className="text-xl font-pbold dark:text-secondary">
									{userInfo?.firstname} {userInfo?.lastname}
								</h3>
								<p className="text-gray-500 font-pregular text-md">{userInfo?.email}</p>
							</div>
						</div>
					</div>

					{/* Achievements Section */}
					<div className="mt-6 bg-white dark:bg-darken p-6 rounded-lg">
						<div className="flex items-center mb-4">
							<FontAwesomeIcon icon={faTrophy} className="text-yellow-500 w-8 h-8 mr-3" />
							<h3 className="text-xl font-bold text-dark dark:text-secondary">
								Achievements Earned
							</h3>
						</div>

						{/* Responsive Badge Grid */}
						<div className="mt-2 p-4 grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-4">
							{earnedBadges.map((badge, index) => (
								<div key={index} className="flex justify-center items-center">
									<img
										src={badge.image}
										alt={badge.title}
										className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 max-w-full max-h-full"
									/>
								</div>
							))}
						</div>

						{/* View All Badges Modal Trigger */}
						<div
							onClick={() => setShowModal(true)}
							className="flex justify-center w-full cursor-pointer mt-4">
							<h1 className="text-gray-600 text-center font-poppins text-xs font-medium leading-normal transition duration-200 transform hover:bg-gray-200 hover:scale-105 rounded-md px-2 py-1">
								View All
							</h1>
						</div>
					</div>

					{/* User Stats Section */}
					<div className="mt-6">
						<h3 className="text-lg font-semibold dark:text-secondary">User stats</h3>
						<div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-6">
							{/* Quiz Evaluation Card */}
							<div
								onClick={openModal}
								className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-lg shadow-lg p-6 text-white cursor-pointer transition-transform hover:scale-105">
								<FontAwesomeIcon icon={faTrophy} className="text-6xl mb-3 animate-bounce" />
								<div className="text-3xl font-extrabold">{averageScore}%</div>
								<p className="text-lg mt-1">Quiz Evaluation</p>
								<div className="w-full h-2 mt-3 bg-gray-300 rounded-full overflow-hidden">
									<div
										className="h-full bg-yellow-400"
										style={{ width: `${averageScore}%` }}></div>
								</div>
							</div>

							{/* Notes Card */}
							<Link
								to="/MyNotes"
								className="relative p-6 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg shadow-lg text-white flex flex-col items-center transition hover:shadow-2xl hover:scale-105 transform">
								<FontAwesomeIcon icon={faStickyNote} className="text-6xl mb-3" />
								<div className="text-3xl font-extrabold">{notesCount}</div>
								<p className="text-lg mt-1">Notes Generated</p>
							</Link>

							{/* Flashcards Card */}
							<Link
								to="/FlashCardhistory"
								className="relative p-6 bg-gradient-to-r from-pink-400 to-purple-500 rounded-lg shadow-lg text-white flex flex-col items-center transition hover:shadow-2xl hover:scale-105 transform">
								<FontAwesomeIcon icon={faClone} className="text-6xl mb-3" />
								<div className="text-3xl font-extrabold">{flashcardCount}</div>
								<p className="text-lg mt-1">Flashcards Created</p>
							</Link>

							<Modal
								isOpen={isModalOpen}
								onClose={closeModal}
								title="Quiz Evaluation Explained">
								<div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
									<div className="text-gray-800 dark:text-gray-200 space-y-4">
										<h3 className="text-xl font-semibold">How It Works</h3>
										<p className="text-base">
											Your quiz evaluation score is calculated based on your performance
											across all quizzes you've taken:
										</p>
										<ul className="list-disc pl-5 text-base space-y-2">
											<li>We sum up all the points you've earned.</li>
											<li>
												We divide this by the total possible points from all quizzes.
											</li>
											<li>The result is converted to a percentage.</li>
										</ul>
										<p className="text-base font-medium mt-4">
											This score reflects your overall mastery of the topics you've been
											quizzed on. Keep taking quizzes to improve your score!
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
						</div>
					</div>
				</div>

				{/* Modal to view all badges */}
				<Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Badges">
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
						{Object.values(badgeDefinitions).map((badge, index) => {
							const isEarned = earnedBadgeIds.includes(badge.id);
							return (
								<BadgeCard
									key={index}
									src={badge.image}
									title={badge.title}
									description={badge.description}
									isEarned={isEarned}
								/>
							);
						})}
					</div>
				</Modal>
			</main>
		</div>
	);
}
