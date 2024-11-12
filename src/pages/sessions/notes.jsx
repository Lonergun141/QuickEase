import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../../components/sidebar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	faFire,
	faClone,
	faLightbulb,
	faPen,
	faSave,
	faTimes,
	faPlus,
	faArrowLeft,
	faRoute,
} from '@fortawesome/free-solid-svg-icons';
import {
	fetchNote,
	updateNote,
	generateQuizFromSummary,
} from '../../features/Summarizer/openAiServices';
import { createQuiz, fetchQuiz } from '../../features/Quiz/quizServices';
import { useSelector } from 'react-redux';
import { createFlashcards, fetchSetFlashcards } from '../../features/Flashcard/flashCard';
import NotesLoadingScreen from '../../components/Loaders/loader';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import parse, { domToReact } from 'html-react-parser';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import Modal from '../../components/Modals/Modal';
import { useUserStats } from '../../features/badge/userStatsContext';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import FlashcardLoadingScreen from '../../components/Loaders/flashLoader';
import QuizLoadingScreen from '../../components/Loaders/quizLoader';
import Joyride, { ACTIONS, EVENTS, STATUS } from 'react-joyride';
import { useDarkMode } from '../../features/Darkmode/darkmodeProvider';

const renderMath = (math, displayMode = false) => {
	try {
		return katex.renderToString(math, {
			throwOnError: false,
			displayMode: displayMode,
		});
	} catch (error) {
		console.error('Error rendering math:', error);
		return math;
	}
};

// Updated renderContent function
const renderContent = (content) => {
	const parts = [];
	let lastIndex = 0;
	const regex = /(\\\(.*?\\\)|\$\$.*?\$\$)/gs;

	const parseOptions = {
		replace: (domNode) => {
			if (domNode.type === 'tag') {
				if (domNode.name === 'ul' || domNode.name === 'ol') {
					return React.createElement(
						domNode.name,
						{
							...domNode.attribs,
							style: { marginLeft: '1.5rem', marginBottom: '1rem' },
						},
						domNode.children && domToReact(domNode.children, parseOptions)
					);
				}
				if (domNode.name === 'li') {
					return React.createElement(
						'li',
						{
							...domNode.attribs,
							style: { marginBottom: '0.5rem' },
						},
						domNode.children && domToReact(domNode.children, parseOptions)
					);
				}
			}
		},
	};

	let match;
	while ((match = regex.exec(content)) !== null) {
		// Add text before the math expression
		if (match.index > lastIndex) {
			parts.push(parse(content.slice(lastIndex, match.index), parseOptions));
		}

		// Render the math expression
		const mathContent = match[0];
		if (mathContent.startsWith('\\(') && mathContent.endsWith('\\)')) {
			// Inline math
			parts.push(
				<span
					key={match.index}
					dangerouslySetInnerHTML={{
						__html: renderMath(mathContent.slice(2, -2), false),
					}}
				/>
			);
		} else if (mathContent.startsWith('$$') && mathContent.endsWith('$$')) {
			// Block math
			parts.push(
				<div
					key={match.index}
					dangerouslySetInnerHTML={{
						__html: renderMath(mathContent.slice(2, -2), true),
					}}
				/>
			);
		}

		lastIndex = regex.lastIndex;
	}

	if (lastIndex < content.length) {
		parts.push(parse(content.slice(lastIndex), parseOptions));
	}

	return parts;
};

export default function Notes() {
	const [sidebarExpanded, setSidebarExpanded] = useState(true);
	const [note, setNote] = useState(null);
	const [isEditing, setIsEditing] = useState(false);
	const [editedTitle, setEditedTitle] = useState('');
	const [editedSummary, setEditedSummary] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [isLoadingF, setIsLoadingF] = useState(false);
	const [isLoadingQ, setIsLoadingQ] = useState(false);
	const [quizExists, setQuizExists] = useState(false);
	const [flashcardsExist, setFlashcardsExist] = useState(false);
	const [isGeneratingQuiz, setIsGeneratingQuiz] = useState(false);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [modalAction, setModalAction] = useState('');
	const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
	const [errorMessage, setErrorMessage] = useState('');
	const { refreshUserStats } = useUserStats();

	const { isDarkMode } = useDarkMode();

	const { id } = useParams();
	const navigate = useNavigate();
	const { userInfo } = useSelector((state) => state.auth);

	const [run, setRun] = useState(false);
	const [stepIndex, setStepIndex] = useState(0);

	const steps = [
		{
			target: '.gflash',
			content: (
				<div className="flex items-center gap-4 text-base sm:text-lg lg:text-xl p-4 sm:p-6">
					<FontAwesomeIcon icon={faClone} className="text-lg sm:text-2xl" />
					<p>Click this button to create flashcards out of the summary notes</p>
				</div>
			),
			placement: 'bottom',
			disableBeacon: true,
		},
		{
			target: '.quiz',
			content: (
				<div className="text-sm sm:text-base flex flex-col gap-3 p-4 sm:p-6">
					<div className="flex items-center gap-2">
						<FontAwesomeIcon icon={faLightbulb} className="text-base sm:text-xl" />
						<p>Click this button to create quiz out of the summary notes</p>
					</div>
				</div>
			),
			placement: 'right',
			disableBeacon: true,
		},
		{
			target: '.edit',
			content: (
				<div className="text-sm sm:text-base flex items-center gap-3 sm:gap-4 p-4 sm:p-6">
					<FontAwesomeIcon icon={faPen} className="text-base sm:text-2xl" />
					<p>You can also click this button to edit the generated summary note contents</p>
				</div>
			),
			placement: 'right',
			disableBeacon: true,
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

	useEffect(() => {
		const getNoteData = async () => {
			if (userInfo && id) {
				try {
					const noteData = await fetchNote(id);
					setNote(noteData);
					setEditedTitle(noteData.notetitle);
					setEditedSummary(noteData.notesummary);
				} catch (error) {
					console.error('Error fetching note data:', error);
				}
			}
		};

		getNoteData();
	}, [id, userInfo]);

	useEffect(() => {
		const storedData = JSON.parse(localStorage.getItem('noteData')) || {};
		if (storedData[id]) {
			setQuizExists(!!storedData[id].quizExists);
			setFlashcardsExist(!!storedData[id].flashcardsExist);
		}
	}, [id]);

	const handleSidebarToggle = (isExpanded) => {
		setSidebarExpanded(isExpanded);
	};

	const handleQuiz = async () => {
		setIsLoadingQ(true);
		if (quizExists) {
			navigate(`/Review/${id}`);
		} else {
			setIsGeneratingQuiz(true);
			try {
				setIsGeneratingQuiz(true);
				const generatedQuiz = await generateQuizFromSummary(note.notesummary);
				await createQuiz(id, generatedQuiz);

				const storedData = JSON.parse(localStorage.getItem('noteData')) || {};
				localStorage.setItem(
					'noteData',
					JSON.stringify({
						...storedData,
						[id]: {
							...storedData[id],
							quizExists: true,
						},
					})
				);
				setQuizExists(true);

				refreshUserStats();
				navigate(`/Quiz/${id}`);
			} catch (error) {
				console.error('Error generating quiz:', error);
				let userFriendlyMessage = 'Failed to generate the quiz. Please try again later.';

				if (error.response) {
					const status = error.response.status;
					if (status === 401 || status === 403) {
						userFriendlyMessage = 'Unauthorized access. Please check your API key.';
					} else if (status === 429) {
						userFriendlyMessage = 'Rate limit exceeded. Please wait and try again.';
					} else if (status >= 500) {
						userFriendlyMessage = 'Server error. Please try again later.';
					}
				} else if (error.message) {
					userFriendlyMessage = error.message;
				}

				setErrorMessage(userFriendlyMessage);
				setIsErrorModalOpen(true);
			} finally {
				setIsGeneratingQuiz(false);
				setIsLoading(false);
			}
		}
	};

	const handleEdit = () => {
		setIsEditing(true);
	};

	const handleSave = async () => {
		if (userInfo) {
			try {
				const formData = new FormData();
				formData.append('notetitle', editedTitle);
				formData.append('notesummary', editedSummary);
				formData.append('notecontents', note.notecontents);
				formData.append('user', userInfo.id);

				const updatedNote = await updateNote(id, formData);
				setNote(updatedNote);
				setIsEditing(false);
			} catch (error) {
				console.error('Error updating note:', error);
			}
		}
	};

	//ditso
	const handleFlashcardsClick = () => {
		if (flashcardsExist) {
			navigate(`/Flashcards/${id}`);
		} else {
			setModalAction('flashcards');
			setIsModalOpen(true);
		}
	};

	const handleQuizClick = () => {
		if (quizExists) {
			navigate(`/Review/${id}`);
		} else {
			setModalAction('quiz');
			setIsModalOpen(true);
		}
	};

	const handleCancel = () => {
		setEditedTitle(note.notetitle);
		setEditedSummary(note.notesummary);
		setIsEditing(false);
	};

	const handleFlashcards = async () => {
		setIsLoadingF(true);
		try {
			if (!flashcardsExist) {
				const response = await createFlashcards(id, userInfo.id);
				console.log('Flashcards creation response:', response);
			}
			const storedData = JSON.parse(localStorage.getItem('noteData')) || {};
			localStorage.setItem(
				'noteData',
				JSON.stringify({
					...storedData,
					[id]: {
						...storedData[id],
						flashcardsExist: true,
					},
				})
			);
			refreshUserStats();
			navigate(`/Flashcards/${id}`);
		} catch (error) {
			console.error('Error with flashcards:', error);
		} finally {
			setIsLoadingF(false);
		}
	};

	// Function to handle modal confirmation
	const handleModalConfirm = async () => {
		setIsModalOpen(false);
		if (modalAction === 'flashcards') {
			await handleFlashcards();
		} else if (modalAction === 'quiz') {
			await handleQuiz();
		}
	};

	if (isLoading) {
		return <NotesLoadingScreen />;
	}

	if (isLoadingF) {
		return <FlashcardLoadingScreen />;
	}

	if (isLoadingQ) {
		return <QuizLoadingScreen />;
	}

	return (
		<div className="flex flex-col lg:flex-row min-h-screen bg-backgroundColor dark:bg-dark w-full">
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

			<Sidebar onToggle={handleSidebarToggle} />
			<main
				className={`transition-all duration-300 flex-grow p-4 lg:p-8 mt-16 lg:mt-0 ${
					sidebarExpanded ? 'lg:ml-72' : 'lg:ml-28'
				}`}>
				<button
					onClick={handleResetTour}
					className="fixed bottom-4 right-4 flex items-center space-x-2 bg-highlights dark:bg-darkS text-white px-4 py-2 rounded-full shadow-lg hover:scale-105 transition-transform"
					title="Reset Tour">
					<FontAwesomeIcon icon={faRoute} />
					<span className="hidden sm:inline-block text-white font-semibold">Take a Tour</span>
				</button>

				<section className="flex items-center mb-6 justify-between">
					<button
						onClick={() => navigate('/myNotes')}
						className="text-gray-500 dark:text-secondary hover:text-highlights transition-colors duration-200">
						<FontAwesomeIcon icon={faArrowLeft} className="text-2xl" />
					</button>
					<div className="hidden xs:flex items-center justify-center">
						<FontAwesomeIcon
							icon={faFire}
							color="#EE924F"
							className="text-coral-red text-xl mr-3"
						/>
						<h3 className="text-xl md:text-3xl lg:text-xl font-pbold text-highlights dark:text-secondary">
							Summary
						</h3>
					</div>

					{!isEditing ? (
						<div className="flex items-center xs:mr-2 sm:mr-5 md:mr-6 mr-4 edit">
							<button
								onClick={handleEdit}
								title="Edit"
								aria-label="Edit"
								className="flex items-center p-2 rounded transition-colors duration-300 hover:bg-gray-200 dark:hover:bg-gray-700">
								<FontAwesomeIcon
									icon={faPen}
									className="text-xl text-highlights dark:text-secondary"
								/>
								<span className="ml-2 text-sm text-highlights dark:text-secondary">
									Edit
								</span>
							</button>
						</div>
					) : (
						<div className="flex items-center">
							<button
								onClick={handleSave}
								title="Save"
								aria-label="Save"
								className="flex items-center p-2 rounded transition-colors duration-300 hover:bg-gray-200 dark:hover:bg-gray-700 mr-2">
								<FontAwesomeIcon
									icon={faSave}
									className="text-xl text-highlights dark:text-secondary"
								/>
								<span className="ml-2 text-sm text-highlights dark:text-secondary">
									Save
								</span>
							</button>

							<button
								onClick={handleCancel}
								title="Cancel"
								aria-label="Cancel"
								className="flex items-center p-2 rounded transition-colors duration-300 hover:bg-gray-200 dark:hover:bg-gray-700">
								<FontAwesomeIcon
									icon={faTimes}
									className="text-xl text-highlights dark:text-secondary"
								/>
								<span className="ml-2 text-sm text-highlights dark:text-secondary">
									Cancel
								</span>
							</button>
						</div>
					)}
				</section>

				<section className="mt-8">
					<h2 className="text-xl font-aceh mb-4 text-newTxt dark:text-secondary">
						More Study Options
					</h2>
					<div className="flex items-center md:flex-row md:justify-start md:space-x-6">
						<div className="flex flex-col items-center mr-8 gflash">
							<button
								className={`flex items-center justify-center w-20 h-20 rounded-full mb-2 
                  ${
							flashcardsExist ? 'bg-primary dark:bg-primary' : 'bg-gray-300 dark:bg-gray-700'
						}`}
								onClick={handleFlashcardsClick}>
								<FontAwesomeIcon
									icon={flashcardsExist ? faClone : faPlus}
									className="text-4xl text-white"
								/>
							</button>
							<span className="text-center text-sm text-highlights dark:text-secondary">
								{flashcardsExist ? 'Open Flashcards' : 'Generate Flashcards'}
							</span>
						</div>

						<div className="flex flex-col items-center quiz">
							<button
								className={`flex items-center justify-center w-20 h-20 rounded-full mb-2 
                  ${quizExists ? 'bg-primary dark:bg-primary' : 'bg-gray-300 dark:bg-gray-700'}`}
								onClick={handleQuizClick}>
								<FontAwesomeIcon
									icon={quizExists ? faLightbulb : faPlus}
									className="text-4xl text-white"
								/>
							</button>
							<span className="text-center text-sm text-gray-600 dark:text-secondary">
								{quizExists ? 'Open Quiz' : 'Generate Quiz'}
							</span>
						</div>
					</div>
				</section>

				{isLoading || !note ? (
					<div className="mt-9">
						<Skeleton height={30} className="dark:bg-darkS mb-4" />
						<Skeleton count={5} height={10} className="dark:bg-darkS" />
					</div>
				) : (
					<div className="mt-9">
						{isEditing ? (
							<>
								<input
									type="text"
									value={editedTitle}
									onChange={(e) => setEditedTitle(e.target.value)}
									className="text-2xl font-pbold mb-4 w-full border rounded p-4 dark:text-secondary dark:bg-darken"
								/>
								<ReactQuill
									value={editedSummary}
									onChange={setEditedSummary}
									className="w-full h-full p-2 border rounded dark:text-secondary dark:bg-darken"
								/>
							</>
						) : (
							<>
								<h1 className="text-xl text-newTxt xs:text-2xl sm:text-3xl md:text-3xl lg:text-4xl font-pbold mb-20 dark:text-secondary">
									{note.notetitle.replace(/["*]/g, '') || (
										<Skeleton height={20} className="dark:bg-darkS rounded-full" />
									)}
								</h1>

								<div className="my-12 h-px border-t-0 bg-transparent bg-gradient-to-r from-transparent via-neutral-500 to-transparent opacity-25 dark:opacity-100"></div>

								<div className="prose max-w-none text-gray-700 dark:text-secondary">
									{note.notesummary ? (
										renderContent(note.notesummary)
									) : (
										<SkeletonTheme baseColor="#202020" highlightColor="#444">
											<p>
												<Skeleton count={10} />
											</p>
										</SkeletonTheme>
									)}
								</div>
							</>
						)}
					</div>
				)}

				<Modal
					isOpen={isModalOpen}
					onClose={() => setIsModalOpen(false)}
					title={`Generate ${modalAction === 'flashcards' ? 'Flashcards' : 'Quiz'}`}>
					<div className="space-y-6 p-6  dark:bg-darken rounded-lg">
						{/* Message Content */}
						<p className="text-gray-700 dark:text-gray-300 text-md leading-relaxed font-pmedium">
							Are you sure you want to create{' '}
							<strong className="text-primary dark:text-primary-light font-pbold">
								{modalAction === 'flashcards' ? 'flashcards' : 'a quiz'}
							</strong>{' '}
							from this summary?
							{modalAction === 'flashcards'
								? 'Flashcards will be generated based on the key points identified in the summary'
								: 'A quiz will be generated based on the main concepts, and this action cannot be undone'}
						</p>

						{/* Tips Section */}
						<div className="rounded-md text-primary text-xs font-pregular">
							<span className="font-pmedium">Tip:</span>{' '}
							{modalAction === 'flashcards'
								? 'Flashcards work best when the summary includes meaningful terms and definitions to aid learning and recall.'
								: 'Quizzes are a great way to test your understanding of the summary content.'}
						</div>

						<div className="rounded-md text-darkS text-xs dark:text-naeg font-pregular">
							<span className="font-pmedium">Note:</span>{' '}
							{modalAction === 'flashcards'
								? 'Once generated, you can edit individual flashcards to fine-tune the content.'
								: 'Once generated, you can retake the quiz multipe times but cannot edit the test questions.'}
						</div>

						{/* Action Buttons */}
						<div className="flex justify-end space-x-4 mt-6">
							<button
								onClick={() => setIsModalOpen(false)}
								className="px-5 py-2 bg-gray-200 text-gray-700 rounded-lg font-aceh hover:bg-gray-300 transition duration-200">
								Cancel
							</button>
							<button
								onClick={handleModalConfirm}
								className="px-5 py-2 bg-primary text-white font-aceh rounded-lg shadow-md hover:bg-primary-dark transition duration-200">
								Generate
							</button>
						</div>
					</div>
				</Modal>

				{/* Error Modal */}
				<Modal
					isOpen={isErrorModalOpen}
					onClose={() => setIsErrorModalOpen(false)}
					title="Error">
					<div className="space-y-4">
						<p className="text-gray-600 dark:text-gray-300">{errorMessage}</p>
						<div className="flex justify-end">
							<button
								onClick={() => setIsErrorModalOpen(false)}
								className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
								Close
							</button>
						</div>
					</div>
				</Modal>
			</main>
		</div>
	);
}
