import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Button from '../../components/button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faTimesCircle, faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import { fetchQuizReviewData } from '../../features/Quiz/quizServices';
import LoadingScreen from '../../components/Loaders/loader';
import QuizLoadingScreen from '../../components/Loaders/quizLoader';

const Review = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const [quizData, setQuizData] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 768);

	useEffect(() => {
		const fetchReviewData = async () => {
			try {
				const data = await fetchQuizReviewData(id);
				//console.log('Quiz Review Data:', data);

				setQuizData(data);

				const quizExists = data.questions && data.questions.length > 0;
				const quizTaken =
					data.userTest && (data.userTest.TestScore > 0 || data.userTest.TestTotalScore > 0);

				const storedData = JSON.parse(localStorage.getItem('noteData')) || {};
				localStorage.setItem(
					'noteData',
					JSON.stringify({
						...storedData,
						[id]: {
							...storedData[id],
							quizExists: quizExists,
							quizTaken: quizTaken,
						},
					})
				);
			} catch (error) {
				console.error('Failed to fetch review data:', error);
			} finally {
				setIsLoading(false);
			}
		};

		fetchReviewData();
	}, [id]);

	const handleTakeTest = () => {
		navigate(`/Quiz/${id}`);
	};

	const handleToggleSidebar = () => {
		setIsSidebarOpen(!isSidebarOpen);
	};

	useEffect(() => {
		const handleResize = () => {
			if (window.innerWidth >= 768) {
				setIsSidebarOpen(true);
			} else {
				setIsSidebarOpen(false);
			}
		};

		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, []);

	if (isLoading) {
		return <QuizLoadingScreen />;
	}

	if (!quizData) {
		return <div>Failed to load quiz data.</div>;
	}

	const { userTest, questions, choicesByQuestion, answersByNote } = quizData;
	const hasNotTakenQuiz = userTest?.TestScore === 0 && userTest?.TestTotalScore === 0;

	// Map user answers to questions
	const userAnswersByQuestion = {};
	answersByNote.forEach((answerObj) => {
		const choiceId = answerObj.answer;
		// Find the question that this choice belongs to
		let questionId;
		for (const qId in choicesByQuestion) {
			const choices = choicesByQuestion[qId];
			if (choices.some((choice) => choice.id === choiceId)) {
				questionId = qId;
				break;
			}
		}
		if (questionId) {
			const userChoice = choicesByQuestion[questionId].find((choice) => choice.id === choiceId);
			if (userChoice) {
				userAnswersByQuestion[questionId] = userChoice;
			}
		}
	});
	return (
		<div className="relative flex min-h-screen bg-zinc-50 dark:bg-dark">
			{/* Enhanced Sidebar */}
			<div
				className={`fixed inset-y-0 left-0 z-30 w-72 bg-white dark:bg-darken border-r border-zinc-200 dark:border-zinc-800 transition-transform duration-300 ease-in-out transform ${
					isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
				}`}>
				<div className="flex flex-col h-full">
					{/* Sidebar Header */}
					<div className="p-6 border-b border-zinc-200 dark:border-zinc-800">
						<div className="flex items-center justify-between">
							<span
								className="text-xl font-inc cursor-pointer"
								onClick={() => navigate('/Home')}>
								<span className="text-newTxt dark:text-white">QUICK</span>
								<span className="text-primary dark:text-secondary">EASE</span>
							</span>
							<button
								onClick={handleToggleSidebar}
								className="md:hidden p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg">
								<FontAwesomeIcon
									icon={faTimes}
									className="text-zinc-600 dark:text-zinc-400"
								/>
							</button>
						</div>
					</div>

					{/* Question Navigation Grid */}
					{!hasNotTakenQuiz && (
						<div className="p-6 border-b border-zinc-200 dark:border-zinc-800">
							<h3 className="text-sm font-pmedium text-zinc-600 dark:text-zinc-400 mb-4">
								Question Navigation
							</h3>
							<div className="grid grid-cols-4 gap-2">
								{questions.map((question, index) => {
									const userChoice = userAnswersByQuestion[question.id];
									const isCorrect = userChoice?.isAnswer;

									return (
										<button
											key={question.id}
											onClick={() =>
												document
													.getElementById(`question-${index}`)
													.scrollIntoView({ behavior: 'smooth' })
											}
											className={`relative group h-12 flex items-center justify-center rounded-xl font-pmedium transition-all
              ${
						isCorrect === true
							? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400'
							: isCorrect === false
							? 'bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400'
							: 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400'
					} hover:scale-95`}>
											{index + 1}
											{isCorrect !== undefined && (
												<div
													className={`absolute -top-1 -right-1 w-3 h-3 rounded-full
                ${isCorrect ? 'bg-emerald-500' : 'bg-red-500'}`}
												/>
											)}
										</button>
									);
								})}
							</div>
						</div>
					)}

					{/* Action Buttons */}
					<div className="p-6 mt-auto">
						<button
							onClick={handleTakeTest}
							className="w-full py-3 px-4 rounded-xl bg-primary dark:bg-secondary text-white dark:text-dark font-pmedium 
								hover:opacity-90 transition-all">
							{hasNotTakenQuiz ? 'Take Test' : 'Retake Quiz'}
						</button>
						<button
							onClick={() => navigate(-1)}
							className="w-full mt-3 py-3 px-4 rounded-xl border border-zinc-200 dark:border-zinc-700
								text-zinc-700 dark:text-zinc-300 font-pmedium hover:bg-zinc-50 dark:hover:bg-zinc-800/80 transition-all">
							Finish Review
						</button>
					</div>
				</div>
			</div>

			{/* Main Content */}
			<div
				className={`flex-grow transition-all duration-300 ${isSidebarOpen ? 'lg:ml-72' : ''}`}>
				{/* Mobile Header */}
				{!isSidebarOpen && (
					<div className="fixed top-0 left-0 right-0 z-20 bg-white dark:bg-darken border-b border-zinc-200 dark:border-zinc-800 md:hidden">
						<div className="p-4 flex items-center">
							<button
								onClick={handleToggleSidebar}
								className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg">
								<FontAwesomeIcon
									icon={faBars}
									className="text-zinc-600 dark:text-zinc-400"
								/>
							</button>
						</div>
					</div>
				)}

				{/* Quiz Content */}
				<div className="max-w-4xl mx-auto p-6 pt-20 md:pt-6 space-y-6">
					{/* Quiz Header */}
					<div className="bg-white dark:bg-darken rounded-2xl border border-zinc-200 dark:border-zinc-800 p-8">
						<div className="space-y-4">
							<div className="inline-flex items-center gap-3 bg-primary/10 dark:bg-secondary/10 rounded-full pl-3 pr-5 py-1.5"></div>

							<div className="space-y-2">
								<h1 className="text-3xl font-pbold text-newTxt dark:text-white">
									Quiz Results
								</h1>
								<p className="text-zinc-600 dark:text-zinc-400 font-pregular">
									Taken on{' '}
									{userTest?.TestDateCreated
										? new Date(userTest.TestDateCreated).toLocaleString()
										: 'Not taken yet'}
								</p>
							</div>

							{!hasNotTakenQuiz && (
								<div className="flex items-center gap-4 mt-6 p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl">
									<div className="space-y-1">
										<p className="text-sm font-pmedium text-zinc-600 dark:text-zinc-400">
											Score
										</p>
										<p className="text-2xl font-pbold text-primary dark:text-secondary">
											{userTest?.TestScore ?? 'N/A'} /{' '}
											{userTest?.TestTotalScore ?? 'N/A'}
										</p>
									</div>
								</div>
							)}
						</div>
					</div>

					{/* Questions Review */}
					{hasNotTakenQuiz ? (
						<div className="bg-white dark:bg-darken rounded-2xl border border-zinc-200 dark:border-zinc-800 p-8">
							<div className="text-center py-12">
								<div
									className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 dark:bg-secondary/10 
									flex items-center justify-center">
									<FontAwesomeIcon
										icon={faTimesCircle}
										className="text-2xl text-primary dark:text-secondary"
									/>
								</div>
								<h2 className="text-xl font-pbold text-newTxt dark:text-white mb-2">
									No Quiz Results Yet
								</h2>
								<p className="text-zinc-600 dark:text-zinc-400 max-w-md mx-auto">
									You haven't taken this quiz yet. Take the test to see your results and
									review the questions.
								</p>
							</div>
						</div>
					) : (
						questions.map((question, questionIndex) => {
							const questionChoices = choicesByQuestion[question.id] || [];
							const userChoice = userAnswersByQuestion[question.id];
							const isCorrect = userChoice?.isAnswer;

							const correctChoice = questionChoices.find((choice) => choice.isAnswer);

							return (
								<div
									key={question.id}
									id={`question-${questionIndex}`}
									className="bg-white dark:bg-darken rounded-2xl border border-zinc-200 dark:border-zinc-800 p-8">
									<div className="space-y-6">
										{/* Question Header */}
										<div className="flex items-start gap-4">
											<div
												className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center
												${
													isCorrect
														? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400'
														: 'bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400'
												}`}>
												{questionIndex + 1}
											</div>
											<p className="text-xl font-pbold text-newTxt dark:text-white">
												{question.TestQuestion}
											</p>
										</div>

										{/* User Answer */}
										<div
											className={`p-4 rounded-xl border
											${
												isCorrect
													? 'bg-emerald-50 border-emerald-200 dark:bg-emerald-500/10 dark:border-emerald-500/20'
													: 'bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20'
											}`}>
											<p className="font-pmedium mb-2 text-dark dark:text-white">
												Your Answer:
											</p>
											{userChoice ? (
												<div
													className={`flex items-center ${
														isCorrect
															? 'text-green-600'
															: 'text-red-500'
													}`}>
													<FontAwesomeIcon
														icon={isCorrect ? faCheckCircle : faTimesCircle}
														className="mr-2 text-xl"
													/>
													<span className="text-lg">
														{userChoice.item_choice_text}
													</span>
												</div>
											) : (
												<span className="text-gray-500 text-lg">
													No answer selected
												</span>
											)}
										</div>

										{!isCorrect && (
											<div className="bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 p-4 rounded-lg">
												<p className="font-pmedium mb-2">Correct Answer:</p>
												<p className="text-primary text-lg">
													{correctChoice?.item_choice_text ?? 'Unknown'}
												</p>
											</div>
										)}

										<div className="mt-4">
											<p className="font-pmedium mb-2 text-dark dark:text-secondary">
												All Choices:
											</p>
											{questionChoices.map((choice) => (
												<div
													key={choice.id}
													className={`flex items-center ${
														choice.isAnswer
															? 'text-primary font-semibold'
															: 'text-gray-800 dark:text-naeg'
													}`}>
													<span className="text-lg">{choice.item_choice_text}</span>
												</div>
											))}
										</div>
									</div>
								</div>
							);
						})
					)}
				</div>
			</div>
		</div>
	);
};

export default Review;
