import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	faTrophy,
	faRibbon,
	faChartLine,
	faRotate,
	faChevronRight,
	faFileText,
	faRefresh,
} from '@fortawesome/free-solid-svg-icons';
import { updateTestScore } from '../../features/Quiz/quizServices';
import { useUserStats } from '../../features/badge/userStatsContext';

const Results = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const { score, total, noteId } = location.state || { score: 0, total: 0, noteId: null };
	const percentage = Math.round((score / total) * 100);
	const { refreshUserStats } = useUserStats();

	useEffect(() => {
		const postResults = async () => {
			try {
				await updateTestScore(noteId, score, total);
				await refreshUserStats();
			} catch (error) {
				console.error('Failed to save results:', error);
			}
		};

		if (noteId) {
			postResults();
		}
	}, [noteId, score, total]);

	const getGradeColor = () => {
		if (percentage >= 90) return 'emerald';
		if (percentage >= 70) return 'blue';
		if (percentage >= 50) return 'amber';
		return 'red';
	};

	const getGradeMessage = () => {
		if (percentage >= 90) return 'Excellent!';
		if (percentage >= 70) return 'Good Job!';
		if (percentage >= 50) return 'Keep Practicing!';
		return 'Need More Practice';
	};

	const getGradeIcon = () => {
		if (percentage >= 90) return faTrophy;
		if (percentage >= 70) return faRibbon;
		if (percentage >= 50) return faChartLine;
		return faRotate;
	};

	const color = getGradeColor();

	
	const handleClose = () => {
		navigate(`/Notes/${noteId}`);
	};

	return (
		<div className="h-full bg-secondary dark:bg-dark">
			<div className="h-full w-full max-w-2xl mx-auto p-4 sm:p-6 md:p-8 flex flex-col">
				{/* Score Card */}
				<div className="flex-1 min-h-0 max-h-[70vh]">
					<div
						className="bg-white dark:bg-darken rounded-2xl overflow-hidden 
						border border-zinc-200/80 dark:border-zinc-800 shadow-sm
						h-full">
						<div className="h-full flex flex-col">
							<div className="flex-1 p-4 xs:p-6 sm:p-8 flex flex-col items-center justify-center gap-3 xs:gap-4 sm:gap-6">
								{/* Icon Container */}
								<div
									className={`relative w-16 xs:w-20 sm:w-24 aspect-square 
									rounded-full flex items-center justify-center
									${
										percentage >= 90
												? 'bg-emerald-100 dark:bg-emerald-900/20'
												: percentage >= 70
												? 'bg-primary/10 dark:bg-secondary/20'
												: percentage >= 50
												? 'bg-amber-100 dark:bg-amber-900/20'
												: 'bg-red-100 dark:bg-red-900/20'
									}`}>
									<FontAwesomeIcon
										icon={getGradeIcon()}
										className={`text-2xl xs:text-3xl sm:text-4xl
											${
												percentage >= 90
													? 'text-emerald-500 dark:text-emerald-400'
													: percentage >= 70
													? 'text-primary dark:text-secondary'
													: percentage >= 50
													? 'text-amber-500 dark:text-amber-400'
													: 'text-red-500 dark:text-red-400'
											}`}
									/>
								</div>

								{/* Score Display */}
								<div
									className={`text-3xl xs:text-4xl sm:text-5xl font-pbold mb-2
									${
										percentage >= 90
											? 'text-emerald-500 dark:text-emerald-400'
											: percentage >= 70
											? 'text-primary dark:text-secondary'
											: percentage >= 50
											? 'text-amber-500 dark:text-amber-400'
											: 'text-red-500 dark:text-red-400'
									}`}>
									{percentage}%
								</div>

								<div
									className="text-base xs:text-lg sm:text-xl font-pmedium 
									text-newTxt dark:text-white text-center">
									{score} out of {total} correct
								</div>

								<div
									className={`text-xl xs:text-2xl sm:text-3xl font-pbold mt-2 xs:mt-4 text-center
									${
										percentage >= 90
											? 'text-emerald-500 dark:text-emerald-400'
											: percentage >= 70
											? 'text-primary dark:text-secondary'
											: percentage >= 50
											? 'text-amber-500 dark:text-amber-400'
											: 'text-red-500 dark:text-red-400'
									}`}>
									{getGradeMessage()}
								</div>
							</div>

							{/* Stats Grid */}
							<div className="grid grid-cols-2 border-t border-zinc-200/80 dark:border-zinc-800">
								<div className="p-4 xs:p-5 sm:p-6 text-center border-r border-zinc-200/80 dark:border-zinc-800">
									<div className="text-sm xs:text-base font-pmedium text-zinc-500 dark:text-zinc-400">
										Correct
									</div>
									<div className="text-lg xs:text-xl sm:text-2xl font-pbold text-emerald-500 dark:text-emerald-400 mt-1">
										{score}
									</div>
								</div>
								<div className="p-4 xs:p-5 sm:p-6 text-center">
									<div className="text-sm xs:text-base font-pmedium text-zinc-500 dark:text-zinc-400">
										Incorrect
									</div>
									<div className="text-lg xs:text-xl sm:text-2xl font-pbold text-red-500 dark:text-red-400 mt-1">
										{total - score}
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* Action Cards */}
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
					{/* Review Answers */}
					<button
						onClick={() => navigate(`/Review/${noteId}`)}
						className="w-full bg-white dark:bg-darken p-4 sm:p-5 rounded-2xl 
							border border-zinc-200/80 dark:border-zinc-800 
							hover:bg-zinc-50 dark:hover:bg-zinc-800/50 
							transition-all duration-200 group">
						<div className="flex items-center">
							<div
								className="w-12 xs:w-14 aspect-square bg-primary/10 dark:bg-secondary/20 
								rounded-full flex items-center justify-center">
								<FontAwesomeIcon
									icon={faFileText}
										className="text-xl xs:text-2xl text-primary dark:text-secondary"
								/>
							</div>
							<div className="flex-1 ml-3 xs:ml-4 text-left">
								<div className="text-sm xs:text-base font-pmedium text-newTxt dark:text-white">
									Review Answers
								</div>
								<div className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
									Check your answers
								</div>
							</div>
							<FontAwesomeIcon
								icon={faChevronRight}
								className="text-base xs:text-lg text-zinc-400 group-hover:text-zinc-600 
									dark:text-zinc-600 dark:group-hover:text-zinc-400 
									transition-colors"
							/>
						</div>
					</button>

					{/* Retake Quiz */}
					<button
						onClick={() => {
							localStorage.removeItem(`quiz-question-order-${noteId}`);
							navigate(`/Quiz/${noteId}`);
						}}
						className="w-full bg-white dark:bg-darken p-4 sm:p-5 rounded-2xl 
							border border-zinc-200/80 dark:border-zinc-800 
							hover:bg-zinc-50 dark:hover:bg-zinc-800/50 
							transition-all duration-200 group">
						<div className="flex items-center">
							<div
								className="w-12 xs:w-14 aspect-square bg-primary/10 dark:bg-secondary/20 
								rounded-full flex items-center justify-center">
								<FontAwesomeIcon
									icon={faRefresh}
									className="text-xl xs:text-2xl text-primary dark:text-secondary"
								/>
							</div>
							<div className="flex-1 ml-3 xs:ml-4 text-left">
								<div className="text-sm xs:text-base font-pmedium text-newTxt dark:text-white">
									Retake Quiz
								</div>
								<div className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
									Practice makes perfect
								</div>
							</div>
							<FontAwesomeIcon
								icon={faChevronRight}
								className="text-base xs:text-lg text-zinc-400 group-hover:text-zinc-600 
									dark:text-zinc-600 dark:group-hover:text-zinc-400 
									transition-colors"
							/>
						</div>
					</button>
				</div>

				{/* Close Button */}
				<div className="mt-6 pt-3 border-t border-zinc-200/80 dark:border-zinc-800">
					<button
						onClick={handleClose}
								className="w-full py-4 sm:py-5 rounded-xl 
								bg-zinc-100 dark:bg-secondary 
								text-newTxt dark:text-dark 
								font-pmedium text-base xs:text-lg
								hover:bg-zinc-200 dark:hover:bg-secondary/90 
								transition-all duration-200">
						Close
					</button>
				</div>
			</div>
		</div>
	);
};

export default Results;
