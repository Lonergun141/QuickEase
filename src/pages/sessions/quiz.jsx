import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import QuizQuestionCard from '../../components/quizQuestionCard';
import Button from '../../components/button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	faBars,
	faFlag,
	faLightbulb,
	faTimes,
	faRoute,
	faExclamationTriangle,
} from '@fortawesome/free-solid-svg-icons';
import {
	fetchQuiz,
	fetchQuizChoices,
	submitQuizAnswer,
	deleteAllChoiceAnswers,
} from '../../features/Quiz/quizServices';
import LoadingScreen from '../../components/Loaders/loader';
import Modal from '../../components/Modals/Modal';
import { useUserStats } from '../../features/badge/userStatsContext';
import QuizLoadingScreen from '../../components/Loaders/quizLoader';
import CircularProgress from '@mui/material/CircularProgress';
import Joyride, { ACTIONS, EVENTS, STATUS } from 'react-joyride';
import { useDarkMode } from '../../features/Darkmode/darkmodeProvider';

const Quiz = () => {
	const navigate = useNavigate();
	const { id } = useParams();
	const [questions, setQuestions] = useState([]);
	const [answers, setAnswers] = useState([]);
	const [flags, setFlags] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(null);
	const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 768);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [modalContent, setModalContent] = useState('');
	const [modalAction, setModalAction] = useState(null);

	const { refreshUserStats } = useUserStats();

	const [isSubmitting, setIsSubmitting] = useState(false);
	const progressColor = 'white';
	const darkProgressColor = '#4B5563';

	const { isDarkMode } = useDarkMode();

	const [run, setRun] = useState(false);
	const [stepIndex, setStepIndex] = useState(0);

	const TOUR_KEY = 'hasSeenTour_quiz'; 

	const steps = [
		{
			target: '.sidebar',
			content: (
				<div className="flex items-center gap-2 sm:gap-4 text-xs sm:text-sm p-2 sm:p-4">
					<FontAwesomeIcon icon={faBars} className="text-xl sm:text-2xl" />
					<p>
						<strong className="text-xs sm:text-sm">Navigator:</strong> Access all quiz
						questions easily by selecting them here. Tap any number to jump directly to a
						question.
					</p>
				</div>
			),
			placement: 'right',
			disableBeacon: true,
			disableScrolling: false,
		},
		{
			target: '.quiz',
			content: (
				<div className="text-xs sm:text-sm flex flex-col gap-2 p-2 sm:p-4">
					<div className="flex items-center gap-2">
						<FontAwesomeIcon icon={faLightbulb} className="text-sm sm:text-xl mb-2" />
						<p>
							Read the question at the top and tap any option to select your answer. Use the
							flag icon{' '}
							<span>
								<FontAwesomeIcon icon={faFlag} className="text-sm sm:text-base" />
							</span>{' '}
							in the top-right to mark questions for review.
						</p>
					</div>
				</div>
			),
			placement: 'bottom',
			disableBeacon: true,
			disableScrolling: false,
		},
	];

	const handleJoyrideCallback = (data) => {
		const { action, status, type } = data;

		if (type === EVENTS.STEP_AFTER || type === EVENTS.TARGET_NOT_FOUND) {
			setStepIndex((prev) => prev + (action === ACTIONS.PREV ? -1 : 1));
		} else if (status === STATUS.FINISHED || status === STATUS.SKIPPED) {
			setRun(false);
			if (status === STATUS.SKIPPED) {
				localStorage.setItem(TOUR_KEY, 'skipped');
			}
		}
	};

	const handleResetTour = () => {
		setStepIndex(0);
		setRun(true);
		localStorage.removeItem(TOUR_KEY);
	};

	const shuffleArray = (array) => {
		return array
			.map((item) => ({ item, sort: Math.random() }))
			.sort((a, b) => a.sort - b.sort)
			.map(({ item }) => item);
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
		handleResize();

		return () => window.removeEventListener('resize', handleResize);
	}, []);

	useEffect(() => {
		const getQuizData = async () => {
			try {
				const quizData = await fetchQuiz(id);
				if (Array.isArray(quizData) && quizData.length > 0) {
					// Shuffle questions for new quiz
					const shuffledQuestions = shuffleArray(quizData);

					const questionsWithChoices = await Promise.all(
						shuffledQuestions.map(async (question) => {
							let choices = await fetchQuizChoices(question.id);
							choices = shuffleArray(choices);
							return { ...question, choices };
						})
					);

					setQuestions(questionsWithChoices);
					setAnswers(Array(questionsWithChoices.length).fill(null));
					setFlags(Array(questionsWithChoices.length).fill(false));
				} else {
					setError('No quiz found for this note.');
				}
			} catch (error) {
				console.error('Error fetching quiz:', error);
				setError('Failed to load quiz. Please try again later.');
			} finally {
				setIsLoading(false);
			}
		};

		getQuizData();
	}, [id]);

	const handleAnswer = (index, answerIndex) => {
		setAnswers(prevAnswers => {
			const newAnswers = [...prevAnswers];
			newAnswers[index] = answerIndex;
			return newAnswers;
		});
	};

	const handleFlag = (index) => {
		setFlags(prevFlags => {
			const newFlags = [...prevFlags];
			newFlags[index] = !newFlags[index];
			return newFlags;
		});
	};

	const handleSubmit = () => {
		const unansweredCount = answers.filter((answer) => answer === null).length;
		const flaggedCount = flags.filter((flag) => flag).length;

		if (unansweredCount > 0 || flaggedCount > 0) {
			let content = '';
			if (unansweredCount > 0) {
				content += `You have ${unansweredCount} unanswered question${
					unansweredCount > 1 ? 's' : ''
				}. `;
			}
			if (flaggedCount > 0) {
				content += `You have ${flaggedCount} flagged question${flaggedCount > 1 ? 's' : ''}. `;
			}
			content += 'Please complete all questions and review flagged items before submitting.';

			setModalContent(content);
			setIsModalOpen(true);
			return;
		}

		submitQuiz();
	};

	const submitQuiz = async () => {
		setIsSubmitting(true);
		try {
			await deleteAllChoiceAnswers(id);
			await Promise.all(
				answers.map(async (answer, index) => {
					const question = questions[index];
					if (answer !== null && question?.choices?.[answer]?.id) {
						const choiceId = question.choices[answer].id;
						return submitQuizAnswer(choiceId);
					}
				})
			);

			const calculatedScore = answers.reduce((total, answer, index) => {
				const question = questions[index];
				if (answer !== null && question?.choices?.[answer]?.isAnswer) {
					return total + 1;
				}
				return total;
			}, 0);

			localStorage.removeItem(`quiz-answers-${id}`);
			localStorage.removeItem(`quiz-flags-${id}`);

			refreshUserStats();
			navigate(`/Results/${id}`, {
				state: { score: calculatedScore, total: questions.length, noteId: id },
			});
		} catch (error) {
			console.error('Error submitting quiz:', error);
			setError('Failed to submit quiz. Please try again later.');
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleCancel = () => {
		setModalContent('Are you sure you want to cancel the quiz? All progress will be lost.');
		setModalAction('cancel');
		setIsModalOpen(true);
	};

	const executeModalAction = () => {
		setIsModalOpen(false);
		if (modalAction === 'submit') {
			submitQuiz();
		} else if (modalAction === 'cancel') {
			navigate(`/notes/${id}`);
		}
	};

	const handleToggleSidebar = () => {
		setIsSidebarOpen(!isSidebarOpen);
	};

	// Add useEffect for tour initialization
	useEffect(() => {
		const hasSeenTour = localStorage.getItem(TOUR_KEY);
		if (!hasSeenTour) {
			setTimeout(() => {
				setStepIndex(0);
				setRun(true);
				localStorage.setItem(TOUR_KEY, 'true');
			}, 500);
		}
	}, []); // Empty dependency array since we only want this to run once

	if (isLoading) {
		return <QuizLoadingScreen />;
	}

	if (error) {
		return (
			<div className="flex flex-col items-center justify-center h-screen">
				<p className="text-xl text-red-500 mb-4">{error}</p>
				<Button onClick={() => navigate('/home')} className="w-48">
					Go Back to Home
				</Button>
			</div>
		);
	}

	
	return (
		<div className="relative flex min-h-screen bg-zinc-50 dark:bg-dark">
			{/* Enhanced Joyride Tour */}
			<Joyride
				callback={handleJoyrideCallback}
				continuous
				hideCloseButton
				run={run}
				scrollToFirstStep
				showProgress
				showSkipButton
				stepIndex={stepIndex}
				steps={steps}
				disableScrolling={false}
				disableBeacon={true}
				locale={{
					back: 'Previous',
					last: 'Finish',
					next: 'Next',
					skip: 'Skip',
				}}
				styles={{
					options: {
						arrowColor: isDarkMode ? '#1e1e1e' : '#ffffff',
						backgroundColor: isDarkMode ? '#1e1e1e' : '#ffffff',
						overlayColor: 'rgba(0, 0, 0, 0.75)',
						primaryColor: '#63A7FF',
						textColor: isDarkMode ? '#fff' : '#1e1e1e',
						zIndex: 1000,
					},
					tooltipContainer: {
						fontFamily: '"Poppins", sans-serif',
						textAlign: 'center',
						padding: '16px 20px',
					},
				}}
			/>

			{/* Enhanced Sidebar */}
			<div
				className={`fixed sidebar inset-y-0 left-0 z-30 w-72 bg-white dark:bg-darken border-r 
				border-zinc-200 dark:border-zinc-800 transition-transform duration-300 ease-in-out transform 
				${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
				{/* Sidebar Header */}
				<div className="p-6 border-b border-zinc-200 dark:border-zinc-800">
					<div className="flex items-center justify-between">
						<div className="space-y-1">
							<h2 className="text-lg font-pbold text-newTxt dark:text-white">
								Quiz Navigator
							</h2>
							<p className="text-sm text-zinc-600 dark:text-zinc-400">Track your progress</p>
						</div>
						<button
							onClick={handleToggleSidebar}
							className="md:hidden p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg">
							<FontAwesomeIcon icon={faTimes} className="text-zinc-600 dark:text-zinc-400" />
						</button>
					</div>
				</div>

				{/* Question Navigation */}
				<div className="p-6 border-b border-zinc-200 dark:border-zinc-800">
					<div className="grid grid-cols-4 gap-3">
						{questions.map((quizItem, index) => (
							<button
								key={quizItem.id}
								onClick={() =>
									document
										.getElementById(`question-${index}`)
										.scrollIntoView({ behavior: 'smooth' })
								}
								className={`relative group h-12 flex items-center justify-center rounded-xl font-pmedium 
									transition-all hover:scale-95 ${
										flags[index]
											? 'bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400'
											: answers[index] !== null
											? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400'
											: 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400'
									}`}>
								{index + 1}
								{flags[index] && (
									<div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-amber-500" />
								)}
							</button>
						))}
					</div>
				</div>

				{/* Action Buttons */}
				<div className="p-6 mt-auto">
					<button
						onClick={handleSubmit}
						disabled={isSubmitting}
						className="w-full py-3 px-4 rounded-xl bg-primary dark:bg-secondary text-white dark:text-dark 
							font-pmedium hover:opacity-90 transition-all disabled:opacity-50 
							disabled:cursor-not-allowed">
						{isSubmitting ? (
							<div className="flex items-center justify-center gap-2">
								<CircularProgress size={20} style={{ color: 'currentColor' }} />
								<span>Submitting...</span>
							</div>
						) : (
							'Submit Quiz'
						)}
					</button>
					<button
						onClick={handleCancel}
						className="w-full mt-3 py-3 px-4 rounded-xl border border-zinc-200 dark:border-zinc-700
							text-zinc-700 dark:text-zinc-300 font-pmedium 
							hover:bg-zinc-50 dark:hover:bg-zinc-800/80 transition-all">
						Cancel Quiz
					</button>
				</div>
			</div>

			{/* Main Content */}
			<div
				className={`flex-grow transition-all duration-300 ${isSidebarOpen ? 'lg:ml-72' : ''}`}>
				{/* Mobile Header */}
				{!isSidebarOpen && (
					<div
						className="fixed top-0 left-0 right-0 z-20 bg-white dark:bg-darken 
						border-b border-zinc-200 dark:border-zinc-800 md:hidden">
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

				{/* Questions */}
				<div className="max-w-4xl mx-auto p-6 pt-20 md:pt-6 space-y-6">
					{questions.map((quizItem, index) => (
						<div key={quizItem.id} className="quiz" id={`question-${index}`}>
							<QuizQuestionCard
								questionNumber={index + 1}
								question={quizItem.TestQuestion}
								choices={quizItem.choices.map((choice) => choice.item_choice_text)}
								selectedAnswer={answers[index]}
								onAnswer={(answerIndex) => handleAnswer(index, answerIndex)}
								onFlag={() => handleFlag(index)}
								isFlagged={flags[index]}
							/>
						</div>
					))}
				</div>
			</div>

			{/* Enhanced Modal */}
			<Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
				<div className="p-6 space-y-6">
					<div className="flex items-center gap-4">
						<div className="p-3 rounded-full bg-amber-50 dark:bg-amber-500/10">
							<FontAwesomeIcon
								icon={faExclamationTriangle}
								className="text-xl text-amber-500"
							/>
						</div>
						<h3 className="text-xl font-pbold text-newTxt dark:text-white">
							{modalAction ? (modalAction === 'submit' ? 'Confirm Submission' : 'Cancel Quiz') : 'Action Required'}
						</h3>
					</div>

					<p className="text-base text-zinc-600 dark:text-zinc-400">{modalContent}</p>

					<div className="flex items-center justify-end gap-3">
						<button
							onClick={() => setIsModalOpen(false)}
							className="px-4 py-2 rounded-lg font-pmedium text-zinc-700 dark:text-zinc-300
								hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all">
							{modalAction ? 'Go Back' : 'OK'}
						</button>
						{modalAction && (
							<button
								onClick={executeModalAction}
								className="px-4 py-2 rounded-lg font-pmedium text-white dark:text-dark
									bg-primary dark:bg-secondary hover:opacity-90 transition-all">
								{modalAction === 'submit' ? 'Submit Anyway' : 'Confirm Cancel'}
							</button>
						)}
					</div>
				</div>
			</Modal>

			{/* Tour Button */}
			<button
				onClick={handleResetTour}
				className="fixed bottom-6 right-6 flex items-center gap-2 px-4 py-2 
					rounded-full bg-highlights dark:bg-darkS text-white
					
					hover:opacity-90 transition-all">
				<FontAwesomeIcon icon={faRoute} className="text-sm" />
				<span className="text-sm font-pmedium">Take a Tour</span>
			</button>
		</div>
	);
};

export default Quiz;
