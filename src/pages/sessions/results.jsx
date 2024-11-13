import React, { useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import Button from '../../components/button';
import { updateTestScore } from '../../features/Quiz/quizServices';

const Results = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const { score, total, noteId } = location.state || { score: 0, total: 0, noteId: null };

	useEffect(() => {
		const postResults = async () => {
			try {
				// Use noteId instead of id
				await updateTestScore(noteId, score, total);
				console.log('Results saved successfully!');
			} catch (error) {
				console.error('Failed to save results:', error);
			}
		};

		if (noteId) {
			postResults();
		}
	}, [noteId, score, total]);

	const handleRetake = () => {
		localStorage.removeItem(`quiz-question-order-${noteId}`);
		navigate(`/Quiz/${noteId}`);
	};

	const handleClose = () => {
		navigate(`/Notes/${noteId}`);
	};

	const handleReview = () => {
		navigate(`/Review/${noteId}`);
	};

	return (
		<div className="flex min-h-screen bg-zinc-50 dark:bg-dark">
			<div className="relative w-full max-w-4xl mx-auto p-6 md:p-8">
			
				{/* Main Content */}
				<div className="relative flex flex-col items-center justify-center min-h-[calc(100vh-4rem)]">
					<div className="w-full max-w-2xl bg-white dark:bg-darken rounded-2xl 
						border border-zinc-200/80 dark:border-zinc-800 p-8 md:p-10">
						
						{/* Score Display */}
						<div className="flex flex-col items-center text-center">
							{/* Score Circle */}
							<div className="relative group">
								<div className="absolute -inset-4 bg-gradient-to-br from-primary/20 to-secondary/20 
									dark:from-secondary/20 dark:to-primary/20 rounded-full blur-2xl opacity-0 
									group-hover:opacity-100 transition-opacity duration-500" />
								<div className="w-40 h-40 md:w-48 md:h-48 rounded-full 
									bg-primary/10 dark:bg-secondary/10
									flex items-center justify-center">
									<div className="text-center">
										<div className="flex items-baseline justify-center gap-2">
											<span className="text-6xl md:text-7xl font-pbold text-primary dark:text-secondary">
												{score}
											</span>
											<span className="text-3xl text-zinc-400 dark:text-zinc-500">
												/{total}
											</span>
										</div>
									</div>
								</div>
							</div>

							{/* Result Message */}
							<div className="mt-8">
								<h2 className="text-2xl md:text-3xl font-pbold text-primary dark:text-secondary">
									{score / total >= 0.8 
										? 'Outstanding Work!' 
										: score / total >= 0.6 
										? 'Well Done! Keep it up!' 
										: 'Keep Going! Don\'t give up! You can do this!'}
								</h2>
							</div>
						</div>

						{/* Action Buttons */}
						<div className="mt-10 space-y-3">
							<button
								onClick={handleReview}
								className="w-full py-3.5 px-4 rounded-xl 
									bg-primary dark:bg-secondary text-white dark:text-dark
									font-pmedium hover:opacity-90 transition-all">
								Review Answers
							</button>
							<div className="flex gap-3">
								<button
									onClick={handleRetake}
									className="flex-1 py-3.5 px-4 rounded-xl 
										bg-zinc-100 dark:bg-zinc-800 
										text-zinc-700 dark:text-zinc-300 font-pmedium 
										hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all">
									Retake Quiz
								</button>
								<button
									onClick={handleClose}
									className="flex-1 py-3.5 px-4 rounded-xl 
										bg-zinc-100 dark:bg-zinc-800
										text-zinc-700 dark:text-zinc-300 font-pmedium 
										hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all">
									Back to Notes
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Results;
