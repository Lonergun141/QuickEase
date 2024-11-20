import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/sidebar';
import { fetchAllQuiz, deleteQuiz } from '../../features/Quiz/quizServices';
import { fetchNote } from '../../features/Summarizer/openAiServices';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Pagination from '../../components/UI/Pagination';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faListCheck, faChevronDown, faClipboardQuestion, faEllipsisVertical, faTrash } from '@fortawesome/free-solid-svg-icons';


export default function QuizHistory() {
	const [sidebarExpanded, setSidebarExpanded] = useState(true);
	const [quizzes, setQuizzes] = useState([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [sortOption, setSortOption] = useState('dateDesc');
	const [loading, setLoading] = useState(true);
	const [slideIn, setSlideIn] = useState(false);
	const [showModal, setShowModal] = useState(false);
	const [selectedQuiz, setSelectedQuiz] = useState(null);
	const [showDropdown, setShowDropdown] = useState(null);
	const quizzesPerPage = 3;
	const navigate = useNavigate();
	const user = useSelector((state) => state.auth.user);
	const [isDeleting, setIsDeleting] = useState(false);

	useEffect(() => {
		if (user) {
			fetchQuizzes();
		}
		setTimeout(() => {
			setSlideIn(true);
		}, 100);
	}, [user]);

	const fetchQuizzes = async () => {
		try {
			setLoading(true);
			const fetchedQuizzes = await fetchAllQuiz();
			const quizzesWithTitles = await Promise.all(
				fetchedQuizzes.map(async (quiz) => {
					const noteDetails = await fetchNote(quiz.note);
					return { ...quiz, notetitle: noteDetails.notetitle };
				})
			);

			const sortedQuizzes = sortQuizzes(quizzesWithTitles, sortOption);
			setQuizzes(sortedQuizzes);
		} catch (error) {
			console.error('Error fetching quizzes:', error);
		} finally {
			setLoading(false);
		}
	};

	const sortQuizzes = (notesArray, option) => {
		return [...notesArray].sort((a, b) => {
			if (option === 'dateAsc') {
				return new Date(a.TestDateCreated) - new Date(b.TestDateCreated);
			} else if (option === 'dateDesc') {
				return new Date(b.TestDateCreated) - new Date(a.TestDateCreated);
			} else if (option === 'titleAsc') {
				return a.notetitle.localeCompare(b.notetitle);
			} else if (option === 'titleDesc') {
				return b.notetitle.localeCompare(a.notetitle);
			}
			return 0;
		});
	};

	const handleSortChange = (option) => {
		setSortOption(option);
		setQuizzes(sortQuizzes(quizzes, option));
	};

	const handleSidebarToggle = (isExpanded) => {
		setSidebarExpanded(isExpanded);
	};

	const handleQuizClick = (quizNote) => {
		if (quizNote) {
			navigate(`/Review/${quizNote}`);
		} else {
			console.error('Quiz note ID is undefined:', quizNote);
		}
	};

	const handlePageChange = (newPage) => {
		setCurrentPage(newPage);
	};

	const startIndex = (currentPage - 1) * quizzesPerPage;
	const endIndex = startIndex + quizzesPerPage;
	const currentQuizzes = quizzes.slice(startIndex, endIndex);
	const totalPages = Math.ceil(quizzes.length / quizzesPerPage);

	const handleDelete = async (quiz) => {
		try {
			setIsDeleting(true);
			await deleteQuiz(quiz.note);
			
			// Remove quiz data from localStorage
			const storedData = JSON.parse(localStorage.getItem('noteData')) || {};
			if (storedData[quiz.note]) {
				storedData[quiz.note] = {
					...storedData[quiz.note],
					quizExists: false,
					quizTaken: false
				};
				localStorage.setItem('noteData', JSON.stringify(storedData));
			}
			
			// Remove question order from localStorage
			localStorage.removeItem(`quiz-question-order-${quiz.note}`);
			
			// Update UI
			const updatedQuizzes = quizzes.filter(q => q.note !== quiz.note);
			setQuizzes(updatedQuizzes);
			
			// Force refresh of quiz state
			window.dispatchEvent(new Event('quizStateChanged'));
			
			setShowModal(false);
			setSelectedQuiz(null);
		} catch (error) {
			console.error('Error deleting quiz:', error);
		} finally {
			setIsDeleting(false);
		}
	};

	const renderQuizCard = (quiz) => {
		// Calculate percentage score
		const scorePercentage = (quiz.TestScore / quiz.TestTotalScore) * 100;
		const isPassing = scorePercentage >= 70;

		return (
			<div key={quiz.note} className="group bg-white dark:bg-darken rounded-xl border border-zinc-200/80 
				dark:border-zinc-800 p-6 transition-all duration-200
				hover:border-primary/20 dark:hover:border-secondary/20 hover:shadow-lg">
				<div className="space-y-4">
					<div className="flex justify-between items-start">
						<div className="flex-1 cursor-pointer" onClick={() => handleQuizClick(quiz.note)}>
							<h2 className="text-lg font-psemibold text-newTxt dark:text-white">
								{quiz.notetitle.replace(/["*]/g, '')} Quiz
							</h2>
						</div>
						<div className="flex items-center gap-3">
							<span className={`px-3 py-1 text-sm font-pmedium rounded-full 
								${isPassing 
									? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
									: 'bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400'
								}`}>
								Score: {quiz.TestScore}/{quiz.TestTotalScore}
							</span>
							<div className="relative">
								<button
									onClick={(e) => {
										e.stopPropagation();
										setShowDropdown(showDropdown === quiz.note ? null : quiz.note);
									}}
									className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full">
									<FontAwesomeIcon icon={faEllipsisVertical} className="text-zinc-600 dark:text-zinc-400" />
								</button>
								{showDropdown === quiz.note && (
									<div className="absolute right-0 mt-2 w-48 bg-white dark:bg-darken border border-zinc-200 dark:border-zinc-700 rounded-xl shadow-lg z-10">
										<button
											onClick={() => {
												setSelectedQuiz(quiz);
												setShowModal(true);
												setShowDropdown(null);
											}}
											className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl flex items-center gap-2">
											<FontAwesomeIcon icon={faTrash} />
											Delete Quiz
										</button>
									</div>
								)}
							</div>
						</div>
					</div>
					<p className="text-sm text-darkS dark:text-smenu">
						Taken on {new Date(quiz.TestDateCreated).toLocaleDateString()}
					</p>
				</div>
			</div>
		);
	};

	const DeleteModal = () => (
		<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
			<div className="bg-white dark:bg-darken rounded-2xl p-6 max-w-md w-full mx-4">
				<h3 className="text-xl font-psemibold text-newTxt dark:text-white mb-4">
					Delete Quiz
				</h3>
				<p className="text-darkS dark:text-smenu mb-6">
					Are you sure you want to delete this quiz? This action cannot be undone.
				</p>
				<div className="flex justify-end gap-3">
					<button
						onClick={() => setShowModal(false)}
						disabled={isDeleting}
						className="px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 
							text-darkS dark:text-smenu hover:bg-zinc-50 dark:hover:bg-zinc-800
							disabled:opacity-50 disabled:cursor-not-allowed">
						Cancel
					</button>
					<button
						onClick={() => handleDelete(selectedQuiz)}
						disabled={isDeleting}
						className="px-4 py-2 rounded-xl bg-red-600 text-white hover:bg-red-700
							disabled:opacity-50 disabled:cursor-not-allowed
							flex items-center gap-2">
						{isDeleting ? (
							<>
								<svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
									<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
									<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
								</svg>
								Deleting...
							</>
						) : (
							<>
								<FontAwesomeIcon icon={faTrash} />
								Delete
							</>
						)}
					</button>
				</div>
			</div>
		</div>
	);

	return (
		<div className="flex flex-col lg:flex-row min-h-screen bg-zinc-50 dark:bg-dark w-full">
			<Sidebar onToggle={handleSidebarToggle} />
			<main
				className={`transition-all duration-300 flex-grow p-6 lg:p-8 mt-16 lg:mt-0 ${
					sidebarExpanded ? 'lg:ml-72' : 'lg:ml-28'
				}`}>
				<div className="max-w-7xl space-y-8">
					{/* Enhanced Header Section */}
					<div className="relative overflow-hidden bg-white dark:bg-darken rounded-2xl border border-zinc-200/80 dark:border-zinc-800 shadow-sm">
						<div className="relative p-8">
							<div className="grid md:grid-cols-[1fr,auto] gap-6 items-center">
								{/* Title and Description */}
								<div className="space-y-4">
									<div className="space-y-3">
										<div className="inline-flex items-center gap-3 bg-zinc-100/80 dark:bg-zinc-800/80 rounded-full pl-3 pr-5 py-1.5">
											<div className="p-2 rounded-full">
												<FontAwesomeIcon 
													icon={faListCheck} 
													className="text-base text-primary dark:text-secondary" 
												/>
											</div>
											<span className="text-sm font-pmedium text-zinc-600 dark:text-zinc-300">
												Quiz Results
											</span>
										</div>
										<h1 className="text-3xl font-pbold text-newTxt dark:text-white">
											Quiz History
										</h1>
										<p className="text-base text-darkS dark:text-smenu font-pregular max-w-2xl">
											Track your progress and review past quiz performances
										</p>
									</div>
								</div>

								{/* Enhanced Sort Dropdown */}
								<div className="relative">
									<select
										value={sortOption}
										onChange={(e) => handleSortChange(e.target.value)}
										className="w-full appearance-none bg-white dark:bg-zinc-900 text-newTxt dark:text-white 
											border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-2.5 pr-10
											focus:outline-none focus:ring-2 focus:ring-primary/20 dark:focus:ring-secondary/20
											cursor-pointer font-pmedium text-sm transition-all">
										<option value="dateDesc">Newest First</option>
										<option value="dateAsc">Oldest First</option>
										<option value="titleAsc">Title A-Z</option>
										<option value="titleDesc">Title Z-A</option>
									</select>
									<div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400">
										<FontAwesomeIcon icon={faChevronDown} className="text-sm" />
									</div>
								</div>
							</div>
						</div>
					</div>

					{/* Quiz History List */}
					<div className={`${slideIn ? 'slide-in' : 'slide-out'} space-y-4`}>
						{loading ? (
							// Enhanced Loading Skeletons
							<div className="space-y-4">
								{[...Array(3)].map((_, i) => (
									<div key={i} className="bg-white dark:bg-darken rounded-xl border border-zinc-200/80 dark:border-zinc-800 p-6">
										<div className="space-y-4">
											<Skeleton height={24} width="60%" />
											<div className="space-y-2">
												<Skeleton height={16} width="30%" />
												<Skeleton height={16} width="40%" />
											</div>
										</div>
									</div>
								))}
							</div>
						) : currentQuizzes.length > 0 ? (
							<div className="space-y-4">
								{currentQuizzes.map(quiz => renderQuizCard(quiz))}
							</div>
						) : (
							// Enhanced Empty State
							<div className="flex flex-col items-center justify-center py-16 px-4">
								<div className="mb-8 relative">
									<div className="w-24 h-24 rounded-full bg-primary/10 dark:bg-secondary/10 flex items-center justify-center">
										<FontAwesomeIcon 
											icon={faClipboardQuestion} 
											className="text-4xl text-primary dark:text-secondary" 
										/>
									</div>
									<div className="absolute -right-2 -bottom-2 w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
										<FontAwesomeIcon 
											icon={faListCheck} 
											className="text-lg text-emerald-600 dark:text-emerald-400" 
										/>
									</div>
								</div>
								<h2 className="text-xl font-psemibold text-newTxt dark:text-white mb-2">
									No Quiz History Yet
								</h2>
								<p className="text-darkS dark:text-smenu mb-6 text-center max-w-md">
									Take quizzes to test your knowledge and track your progress
								</p>
								<button
									onClick={() => navigate('/home')}
									className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary dark:bg-secondary 
										text-white dark:text-dark font-pmedium transition-all hover:opacity-90">
									<FontAwesomeIcon icon={faClipboardQuestion} className="text-sm" />
									Take Your First Quiz
								</button>
							</div>
						)}
					</div>

					{/* Enhanced Pagination */}
					{quizzes.length > quizzesPerPage && (
						<div className="flex justify-center mt-8">
							<Pagination
								currentPage={currentPage}
								totalPages={totalPages}
								onPageChange={handlePageChange}
							/>
						</div>
					)}
				</div>
			</main>
			{showModal && <DeleteModal />}
		</div>
	);
}
