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
		<div className="flex flex-col items-center justify-center min-h-screen p-4 bg-white dark:bg-dark">
			<div className="p-8 rounded-lg max-w-md w-full text-center">
				<div className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-pregular bg-primary dark:bg-naeg dark:text-darken text-white rounded-full w-32 h-32 sm:w-48 sm:h-48 md:w-56 md:h-56 lg:w-64 lg:h-64 flex items-center justify-center mx-auto">
					{score}
				</div>
				<h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-pbold mt-4 text-highlights">
					Congratulations! You have scored
				</h2>
				<p className="text-md sm:text-lg md:text-xl lg:text-2xl font-pregular text-dark dark:text-secondary">
					{score} out of {total} items
				</p>
				<a href="#" className="mt-2 underline font-pregular text-review" onClick={handleReview}>
					Review quiz
				</a>
				<div className="mt-8 md:mt-16 space-y-2">
					<Button onClick={handleRetake} className="w-full">
						Retake
					</Button>
					<button onClick={handleClose} className="w-full py-2 px-4 border rounded-lg text-dark dark:text-secondary">
						Close
					</button>
				</div>
			</div>
		</div>
	);
};

export default Results;
