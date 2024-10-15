import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Button from '../../components/button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faTimesCircle, faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import { fetchQuizReviewData } from '../../features/Quiz/quizServices';
import LoadingScreen from '../../components/loader';

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
				console.log('Quiz Review Data:', data);
				setQuizData(data);
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
		return <LoadingScreen />;
	}

	if (!quizData) {
		return <div>Failed to load quiz data.</div>;
	}

	const { userTest, questions, choices, answersByNote } = quizData;
	const hasNotTakenQuiz = userTest?.TestScore === 0 && userTest?.TestTotalScore === 0;

	const choicesByQuestion = questions.reduce((acc, question, index) => {
		const startIndex = index * 4;
		acc[question.id] = choices.slice(startIndex, startIndex + 4);
		return acc;
	}, {});

	return (
		<div className="relative flex min-h-screen">
			{/* Sidebar */}
			<div
				className={`fixed inset-y-0 left-0 z-30 w-64 p-4  bg-white dark:bg-darken transition-transform duration-300 ease-in-out transform ${
					isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
				}`}>
				{/* Sidebar content */}
				<div className="flex justify-end p-4 md:hidden">
					<FontAwesomeIcon
						icon={faTimes}
						className="cursor-pointer text-lg text-dark dark:text-secondary hover:text-gray-700"
						onClick={handleToggleSidebar}
					/>
				</div>
				<div className='py-6'>
					<span className="text-xl font-inc cursor-pointer" onClick={() => navigate('/Home')}>
						<span className="text-black dark:text-gray-100">QUICK</span>
						<span className="text-primary dark:text-naeg">EASE</span>
					</span>
				</div>

				{!hasNotTakenQuiz && (
					<div className="grid grid-cols-4 gap-2 mb-6 mt-4">
						{questions.map((question, index) => {
							const userAnswerFromNote = answersByNote[index];
							const userChoice = userAnswerFromNote ? choices.find((choice) => choice.id === userAnswerFromNote.answer) : null;
							const isCorrect = userChoice?.isAnswer;

							return (
								<div
									key={question.id}
									className={`w-12 h-12 flex items-center justify-center border  dark:border-gray-600 rounded-md cursor-pointer ${
										isCorrect === true
											? 'bg-green-100 text-green-500 font-pmedium'
											: isCorrect === false
											? 'bg-red-100 text-red-500 front-pmedium'
											: 'bg-white dark:bg-dark text-gray-900 dark:text-gray-300'
									}`}
									onClick={() => document.getElementById(`question-${index}`).scrollIntoView({ behavior: 'smooth' })}>
									{index + 1}
								</div>
							);
						})}
					</div>
				)}

				<Button onClick={handleTakeTest} className="w-full max-w-lg">
					{hasNotTakenQuiz ? 'Take Test' : 'Retake Quiz'}
				</Button>
				<p
					onClick={() => navigate(-1)}
					className="text-dark dark:text-secondary hover:dark:text-dark transition ease-in-out w-full max-w-lg text-md py-3 text-center cursor-pointer mt-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-100 dark:hover:opacity-50">
					Finish Review
				</p>
			</div>

			{/* Main Content */}
			<div
				className="flex-grow p-4 py-28 space-y-4 bg-secondary dark:bg-dark w-full transition-all"
				style={{
					marginLeft: isSidebarOpen ? '250px' : '0px',
					transition: 'margin-left 0.3s ease-in-out',
				}}>
				{/* Fixed faBars for Mobile */}
				{!isSidebarOpen && (
					<div className="md:hidden fixed top-0 left-0 z-50 p-6">
						<FontAwesomeIcon
							icon={faBars}
							className="cursor-pointer text-dark dark:text-secondary hover:text-gray-700 text-xl"
							onClick={handleToggleSidebar}
						/>
					</div>
				)}

				<div className="p-4 max-w-6xl mx-auto rounded-lg">
					<div className="text-left mb-12 bg-white dark:bg-darken p-8 rounded-lg shadow-sm">
						<h1 className="text-4xl font-pbold text-highlights dark:text-secondary mb-4">Quiz Review</h1>
						<p className="text-gray-600 font-pregular mb-4 dark:text-naeg">
							Date Taken: {userTest?.TestDateCreated ? new Date(userTest.TestDateCreated).toLocaleString() : 'Not taken yet'}
						</p>
						{!hasNotTakenQuiz && (
							<p className="text-xl mt-8 font-pmedium text-dark dark:text-secondary">
								Marks: <span className="text-highlights dark:text-secondary">{userTest?.TestScore ?? 'N/A'}</span> out of{' '}
								<span className="text-highlights dark:text-secondary">{userTest?.TestTotalScore ?? 'N/A'}</span>
							</p>
						)}
						<a className="font-pregular py-8 underline mt-8 text-review cursor-pointer" href="/home">
							back to home
						</a>
					</div>

					{hasNotTakenQuiz ? (
						<div className="mb-12 p-8 rounded-lg bg-white dark:bg-darken shadow-sm">
							<p className="text-lg text-dark dark:text-secondary">
								You haven't taken this quiz yet. Please take the test to see your results and review the questions.
							</p>
						</div>
					) : (
						questions.map((question, questionIndex) => {
							const questionChoices = choicesByQuestion[question.id] || [];
							const correctChoice = questionChoices.find((choice) => choice.isAnswer);
							const userAnswerFromNote = answersByNote[questionIndex];
							const userChoice = userAnswerFromNote ? choices.find((choice) => choice.id === userAnswerFromNote.answer) : null;
							const isCorrect = userChoice?.isAnswer;

							return (
								<div
									key={question.id}
									id={`question-${questionIndex}`}
									className="mb-12 p-8 border rounded-lg bg-white dark:bg-darken shadow-sm">
									<p className="font-pbold text-xl mb-6 text-highlights dark:text-secondary">{question.TestQuestion}</p>

									<div className={`mb-4 p-4 rounded-lg ${isCorrect ? 'bg-green-100' : 'bg-red-100'}`}>
										<p className="font-pmedium mb-2">Your Answer:</p>
										{userChoice ? (
											<div className={`flex items-center ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
												<FontAwesomeIcon icon={isCorrect ? faCheckCircle : faTimesCircle} className="mr-2 text-xl" />
												<span className="text-lg">{userChoice.item_choice_text}</span>
											</div>
										) : (
											<span className="text-gray-500 text-lg">No answer selected</span>
										)}
									</div>

									{!isCorrect && (
										<div className="p-4 bg-blue-100 rounded-lg">
											<p className="font-pmedium mb-2">Correct Answer:</p>
											<p className="text-primary text-lg">{correctChoice?.item_choice_text ?? 'Unknown'}</p>
										</div>
									)}

									<div className="mt-4">
										<p className="font-pmedium mb-2 text-dark dark:text-secondary">All Choices:</p>
										{questionChoices.map((choice) => (
											<div
												key={choice.id}
												className={`flex items-center ${
													choice.isAnswer ? 'text-primary font-semibold' : 'text-gray-800 dark:text-naeg'
												}`}>
												<span className="text-lg">{choice.item_choice_text}</span>
											</div>
										))}
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
