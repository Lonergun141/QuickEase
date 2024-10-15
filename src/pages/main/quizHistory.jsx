import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/sidebar';
import { fetchAllQuiz } from '../../features/Quiz/quizServices';
import { fetchNote } from '../../features/Summarizer/openAiServices';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Pagination from '../../components/UI/Pagination';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export default function QuizHistory() {
	const [sidebarExpanded, setSidebarExpanded] = useState(true);
	const [quizzes, setQuizzes] = useState([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [sortOption, setSortOption] = useState('dateDesc');
	const [loading, setLoading] = useState(true);
	const [slideIn, setSlideIn] = useState(false);
	const quizzesPerPage = 4;
	const navigate = useNavigate();
	const user = useSelector((state) => state.auth.user);

	useEffect(() => {
		if (user) {
			fetchQuizzes();
		}

		// Trigger slide-in animation
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
			navigate(`/QuickEase-Web/Review/${quizNote}`);
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

	return (
		<div className="flex flex-col lg:flex-row min-h-screen bg-secondary dark:bg-dark w-full">
			<Sidebar onToggle={handleSidebarToggle} />
			<main
				className={`transition-all duration-300 flex-grow lg:p-8 mt-16 lg:mt-0 ${
					sidebarExpanded ? 'lg:ml-72' : 'lg:ml-28'
				}`}>
				{/* Header section */}
				<div className="flex flex-col lg:pl-9 p-4 sm:flex-row justify-between items-start sm:items-center mb-6 space-y-2 sm:space-y-0">
					<h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-highlights dark:text-secondary">
						Quiz History
					</h1>
					<div className="relative w-full sm:w-auto">
						<select
							value={sortOption}
							onChange={(e) => handleSortChange(e.target.value)}
							className="w-full sm:w-auto bg-white dark:bg-darken dark:text-secondary border border-gray-300 rounded-md p-2 sm:p-1.5 text-sm sm:text-sm lg:text-base cursor-pointer font-pregular">
							<option value="dateDesc" className="text-sm lg:text-base">
								Newest to Oldest
							</option>
							<option value="dateAsc" className="text-sm lg:text-base">
								Oldest to Newest
							</option>
							<option value="titleAsc" className="text-sm lg:text-base">
								Title A-Z
							</option>
							<option value="titleDesc" className="text-sm lg:text-base">
								Title Z-A
							</option>
						</select>
					</div>
				</div>

				{/* Main content wrapper with proper spacing and layout */}
				<div className="flex flex-col min-h-[calc(100vh-200px)] lg:pl-9 relative">
					{/* Quiz container with bottom padding for pagination */}
					<div className={`${slideIn ? 'slide-in' : 'slide-out'} flex-grow px-4`}>
						{loading ? (
							// Show loading skeletons while loading
							<div className="space-y-4">
								{[...Array(4)].map((_, i) => (
									<div
										key={i}
										className="bg-white dark:bg-darken lg:w-1/2 md:w-full rounded-lg p-4 relative transform transition-all duration-300">
										<div className="flex justify-between items-center mb-2">
											<Skeleton width={190} height={10} className="rounded dark:bg-darkS" />
										</div>
										<Skeleton width={100} height={8} className="rounded mb-2 dark:bg-darkS" />
										<Skeleton width={150} height={6} className="rounded dark:bg-darkS" />
									</div>
								))}
							</div>
						) : currentQuizzes.length > 0 ? (
							<div className="space-y-4">
								{currentQuizzes.map((quiz) => (
									<div
										key={quiz.note}
										className="bg-white dark:bg-darken lg:w-1/2 md:w-full rounded-lg p-4 cursor-pointer relative transform transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg hover:bg-blue-50 dark:hover:bg-darkS"
										onClick={() => handleQuizClick(quiz.note)}>
										<div className="flex justify-between items-center mb-2">
											<h2 className="text-lg font-pbold text-highlights dark:text-secondary">{quiz.notetitle} Quiz</h2>
										</div>
										<p className="text-xs text-review">
											Score: {quiz.TestScore} / {quiz.TestTotalScore}
										</p>
										<p className="text-xs text-gray-400">
											Date Created:{' '}
											{new Date(quiz.TestDateCreated).toLocaleDateString('en-US', {
												year: 'numeric',
												month: 'long',
												day: 'numeric',
											})}
										</p>
									</div>
								))}
							</div>
						) : (
							<div className="flex flex-col items-center justify-center h-full text-center mt-8">
								<h1 className="text-2xl font-semibold text-gray-600 dark:text-gray-400 mt-4">No quizzes available!</h1>
							</div>
						)}
					</div>

					{/* Pagination container */}
					{quizzes.length > quizzesPerPage && (
						<div className="mt-4">
							<Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
						</div>
					)}
				</div>
			</main>
		</div>
	);
}
