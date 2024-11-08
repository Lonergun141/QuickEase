import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import QuizQuestionCard from '../../components/quizQuestionCard';
import Button from '../../components/button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faFlag, faLightbulb, faTimes, faRoute } from '@fortawesome/free-solid-svg-icons';
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
			placement: 'left',
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
				localStorage.setItem('hasSeenTour', 'skipped');
			}
		}
	};

	const handleResetTour = () => {
		setStepIndex(0);
		setRun(true);
		localStorage.removeItem('hasSeenTour');
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
				const savedAnswers = JSON.parse(localStorage.getItem(`quiz-answers-${id}`)) || [];
				const savedFlags = JSON.parse(localStorage.getItem(`quiz-flags-${id}`)) || [];

				const quizData = await fetchQuiz(id);
				if (Array.isArray(quizData) && quizData.length > 0) {
					const shuffledQuestions = shuffleArray(quizData);
					const questionsWithChoices = await Promise.all(
						shuffledQuestions.map(async (question) => {
							let choices = await fetchQuizChoices(question.id);
							choices = shuffleArray(choices);
							return { ...question, choices };
						})
					);

					setQuestions(questionsWithChoices);
					setAnswers(
						savedAnswers.length > 0
							? savedAnswers
							: Array(questionsWithChoices.length).fill(null)
					);
					setFlags(
						savedFlags.length > 0
							? savedFlags
							: Array(questionsWithChoices.length).fill(false)
					);
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
		setAnswers((prevAnswers) => {
			const newAnswers = [...prevAnswers];
			newAnswers[index] = answerIndex;
			localStorage.setItem(`quiz-answers-${id}`, JSON.stringify(newAnswers));
			return newAnswers;
		});
	};

	const handleFlag = (index) => {
		setFlags((prevFlags) => {
			const newFlags = [...prevFlags];
			newFlags[index] = !newFlags[index];
			localStorage.setItem(`quiz-flags-${id}`, JSON.stringify(newFlags));
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
			content += 'Are you sure you want to submit?';

			setModalContent(content);
			setModalAction('submit');
			setIsModalOpen(true);
		} else {
			submitQuiz();
		}
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
		<div className="relative flex h-screen bg-secondary dark:bg-dark">
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
				disableScrolling={true}
				locale={{
					back: 'Previous',
					last: 'Finish',
					next: 'Next',
					skip: 'Skip',
				}}
				styles={{
					options: {
						arrowColor: isDarkMode ? '#424242' : '#f9f9fb',
						backgroundColor: isDarkMode ? '#424242' : '#f9f9fb',
						overlayColor: 'rgba(0, 0, 0, 0.6)',
						primaryColor: '#63A7FF',
						textColor: isDarkMode ? '#fff' : '#333333',
						zIndex: 1000,
					},
					tooltipContainer: {
						fontFamily: '"Poppins", sans-serif',
						fontSize: '0.8rem',
						textAlign: 'center',
						padding: '8px 12px',
					},
					buttonBack: {
						color: isDarkMode ? '#C0C0C0' : '#213660',
					},
				}}
			/>
			<button
				onClick={handleResetTour}
				className="fixed bottom-4 right-4 flex items-center z-50 space-x-2 bg-highlights dark:bg-darkS text-white px-4 py-2 rounded-full shadow-lg hover:scale-105 transition-transform"
				title="Reset Tour">
				<FontAwesomeIcon icon={faRoute} />
				<span className="hidden sm:inline-block text-white font-semibold">Take a Tour</span>
			</button>
			{/* Sidebar */}
			<div
				className={`fixed sidebar inset-y-0 left-0 z-30 w-64 p-4 py-16 bg-white dark:bg-darken transition-transform duration-300 ease-in-out transform ${
					isSidebarOpen ? 'translate-x-0  ' : '-translate-x-full'
				}`}
				style={{
					maxWidth: '250px',
					transform:
						isSidebarOpen || window.innerWidth >= 768 ? 'translateX(0)' : 'translateX(-100%)',
				}}>
				<div>
					<h2>Navigator</h2>
				</div>

				<div className="flex justify-end p-4 md:hidden">
					<FontAwesomeIcon
						icon={faTimes}
						className="cursor-pointer text-lg text-dark dark:text-secondary hover:text-gray-700"
						onClick={handleToggleSidebar}
					/>
				</div>

				<div className="grid grid-cols-4 gap-2 mb-6">
					{questions.map((quizItem, index) => (
						<div
							key={quizItem.id}
							className={`w-12 h-12  flex items-center justify-center border border-gray-300 dark:border-gray-600 rounded-md cursor-pointer ${
								flags[index]
									? 'bg-yellow-300 text-white'
									: answers[index] !== null
									? 'bg-primary text-white dark:bg-darkS'
									: 'bg-white dark:bg-dark text-gray-900 dark:text-gray-300'
							}`}
							onClick={() =>
								document
									.getElementById(`question-${index}`)
									.scrollIntoView({ behavior: 'smooth' })
							}>
							{index + 1}
						</div>
					))}
				</div>

				<Button onClick={handleSubmit} className="w-full max-w-lg" disabled={isSubmitting}>
					{isSubmitting ? (
						<div className="flex items-center justify-center">
							<CircularProgress size={24} style={{ color: 'currentColor' }} />
							<style>
								{`.dark .MuiCircularProgress-root {
								color: ${darkProgressColor} !important;
							}`}
							</style>
						</div>
					) : (
						'Submit Quiz'
					)}
				</Button>

				<div
					onClick={handleCancel}
					className="flex justify-center items-center mt-2 cursor-pointer p-4 hover:bg-gray-100 transition ease-in-out rounded-md">
					<p className="font-pregular text-dark dark:text-naeg">Cancel</p>
				</div>
			</div>

			{/* Main Content */}
			<div
				className="flex-grow p-4 py-28 space-y-4 overflow-y-auto bg-secondary dark:bg-dark w-full transition-all"
				style={{
					marginLeft: window.innerWidth >= 768 ? '250px' : isSidebarOpen ? '250px' : '0px',
					transition: 'margin-left 0.3s ease-in-out',
				}}>
				{/* Fixed faBars for Mobile */}
				{!isSidebarOpen && (
					<div className="md:hidden fixed top-0 left-0 z-50 p-6  ">
						<FontAwesomeIcon
							icon={faBars}
							className="cursor-pointer text-dark dark:text-secondary hover:text-gray-700 text-xl"
							onClick={handleToggleSidebar}
						/>
					</div>
				)}

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

				<div className="flex justify-center md:hidden">
					<Button onClick={handleSubmit} className="w-full max-w-lg">
						{isSubmitting ? (
							<div className="flex items-center justify-center">
								<CircularProgress size={24} style={{ color: 'currentColor' }} />
								<style>
									{`.dark .MuiCircularProgress-root {
						color: ${darkProgressColor} !important;
					}`}
								</style>
							</div>
						) : (
							'Submit Quiz'
						)}
					</Button>
				</div>
			</div>

			{/* Modal */}
			<Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Confirm Action">
				<p className="text-dark dark:text-secondary">{modalContent}</p>
				<div className="mt-4 flex justify-end space-x-2">
					<button
						onClick={() => setIsModalOpen(false)}
						className="px-4 py-2 text-black dark:text-secondary rounded hover:bg-gray-200 transition-colors">
						Cancel
					</button>
					<button
						onClick={executeModalAction}
						className="px-4 py-2 bg-primary text-white rounded hover:bg-blue-600 transition-colors">
						{modalAction === 'submit' ? 'Submit Anyway' : 'Confirm Cancel'}
					</button>
				</div>
			</Modal>
		</div>
	);
};

export default Quiz;
