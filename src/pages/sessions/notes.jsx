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
	faArrowRight,
	faWandMagicSparkles,
	faBookOpen,
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
import CustomModal from '../../components/CustomModal/CustomModal';

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

// Add this helper function
const normalizeContent = (content) => {
	// Remove any extra whitespace and normalize line endings
	return content?.replace(/\s+/g, ' ').trim() ?? '';
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

	// Add new state for backend check
	const [backendChecked, setBackendChecked] = useState(false);

	// Modify the useEffect that checks existence
	useEffect(() => {
		const checkExistence = async () => {
			try {
				// First check localStorage
				const storedData = JSON.parse(localStorage.getItem('noteData')) || {};
				const noteData = storedData[id] || {};

				// Then verify with backend
				const [quizResponse, flashcardResponse] = await Promise.all([
					fetchQuiz(id).catch(() => ({ data: [] })),
					fetchSetFlashcards(id).catch(() => ({ data: [] })),
				]);

				const quizExistsBackend = quizResponse.length > 0;
				const flashcardsExistBackend = flashcardResponse.length > 0;

				// Update localStorage with backend data
				localStorage.setItem(
					'noteData',
					JSON.stringify({
						...storedData,
						[id]: {
							...noteData,
							quizExists: quizExistsBackend,
							flashcardsExist: flashcardsExistBackend,
						},
					})
				);

				// Update states
				setQuizExists(quizExistsBackend);
				setFlashcardsExist(flashcardsExistBackend);
			} catch (error) {
				console.error('Error checking quiz/flashcard existence:', error);
			} finally {
				setBackendChecked(true);
			}
		};

		if (id) {
			checkExistence();
		}
	}, [id]);

	// Update the quiz state change listener
	useEffect(() => {
		const handleQuizStateChange = async () => {
			try {
				const quizResponse = await fetchQuiz(id);
				const quizExistsBackend = quizResponse.length > 0;

				const storedData = JSON.parse(localStorage.getItem('noteData')) || {};
				localStorage.setItem(
					'noteData',
					JSON.stringify({
						...storedData,
						[id]: {
							...storedData[id],
							quizExists: quizExistsBackend,
						},
					})
				);

				setQuizExists(quizExistsBackend);
			} catch (error) {
				console.error('Error checking quiz existence:', error);
			}
		};

		window.addEventListener('quizStateChanged', handleQuizStateChange);
		return () => {
			window.removeEventListener('quizStateChanged', handleQuizStateChange);
		};
	}, [id]);

	const handleSidebarToggle = (isExpanded) => {
		setSidebarExpanded(isExpanded);
	};

	// Add new state for CustomModal
	const [customModalConfig, setCustomModalConfig] = useState({
		isOpen: false,
		title: '',
		message: '',
		type: 'error'
	});

	// Update handleQuiz function
	const handleQuiz = async () => {
		setIsLoadingQ(true);
		if (quizExists) {
			navigate(`/Review/${id}`);
		} else {
			setIsGeneratingQuiz(true);
			try {
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
						userFriendlyMessage = 'Unauthorized access. Please log in again to restart.';
					} else if (status === 429) {
						userFriendlyMessage = 'Rate limit exceeded. Please wait and try again.';
					} else if (status >= 500) {
						userFriendlyMessage = 'Server error. Please try again later.';
					}
				} else if (error.message) {
					userFriendlyMessage = error.message;
				}
				setIsGeneratingQuiz(false);
				setIsLoading(false);
				setCustomModalConfig({
					isOpen: true,
					title: 'Error Generating Quiz',
					message: userFriendlyMessage,
					type: 'error'
				});
			} finally {
				setIsGeneratingQuiz(false);
				setIsLoading(false);
			}
		}
	};

	// Add these state variables near your other states
	const [initialTitle, setInitialTitle] = useState('');
	const [initialSummary, setInitialSummary] = useState('');
	const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
	const [showUnsavedModal, setShowUnsavedModal] = useState(false);
	const [pendingNavigation, setPendingNavigation] = useState(null);

	// Update handleEdit to store initial values
	const handleEdit = () => {
		if (note) {
			const normalizedTitle = normalizeContent(note.notetitle);
			const normalizedSummary = normalizeContent(note.notesummary);

			setInitialTitle(normalizedTitle);
			setInitialSummary(normalizedSummary);
			setEditedTitle(note.notetitle || '');
			setEditedSummary(note.notesummary || '');
			setIsEditing(true);
			setHasUnsavedChanges(false);
		}
	};

	// Update the useEffect that tracks changes
	useEffect(() => {
		if (isEditing) {
			const normalizedEditedTitle = normalizeContent(editedTitle);
			const normalizedEditedSummary = normalizeContent(editedSummary);

			const hasChanges =
				normalizedEditedTitle !== initialTitle || normalizedEditedSummary !== initialSummary;

			console.log('Change detection:', {
				hasChanges,
				normalizedEditedTitle,
				initialTitle,
				normalizedEditedSummary,
				initialSummary,
			});

			setHasUnsavedChanges(hasChanges);
		} else {
			setHasUnsavedChanges(false);
		}
	}, [editedTitle, editedSummary, isEditing, initialTitle, initialSummary]);

	// Update handleCancel
	const handleCancel = () => {
		if (note) {
			setEditedTitle(note.notetitle || '');
			setEditedSummary(note.notesummary || '');
			setIsEditing(false);
			setHasUnsavedChanges(false);
			setInitialTitle('');
			setInitialSummary('');
		}
	};

	// Update handleSave
	const handleSave = async () => {
		if (userInfo && note) {
			try {
				const formData = new FormData();
				formData.append('notetitle', normalizeContent(editedTitle));
				formData.append('notesummary', normalizeContent(editedSummary));
				formData.append('notecontents', note.notecontents);
				formData.append('user', userInfo.id);

				const updatedNote = await updateNote(id, formData);
				setNote(updatedNote);
				setIsEditing(false);
				setHasUnsavedChanges(false);
				setInitialTitle('');
				setInitialSummary('');
			} catch (error) {
				console.error('Error updating note:', error);
			}
		}
	};

	// Update the navigation handler
	const handleNavigate = (path) => {
		if (isEditing && hasUnsavedChanges) {
			setPendingNavigation(path);
			setShowUnsavedModal(true);
		} else {
			navigate(path);
		}
	};

	// Update modal handlers
	const handleUnsavedModalConfirm = () => {
		setShowUnsavedModal(false);
		setIsEditing(false);
		setHasUnsavedChanges(false);
		setInitialTitle('');
		setInitialSummary('');
		if (pendingNavigation) {
			navigate(pendingNavigation);
		} else {
			window.history.back();
		}
	};

	const handleUnsavedModalCancel = () => {
		setShowUnsavedModal(false);
		setPendingNavigation(null);
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

	// Update handleFlashcards function
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
			console.error('Error generating flashcards:', error);
			let userFriendlyMessage = 'Failed to generate the flashcards. Please try again later.';

			if (error.response) {
				const status = error.response.status;
				if (status === 401 || status === 403) {
					userFriendlyMessage = 'Unauthorized access. Please log in again to restart.';
				} else if (status === 429) {
					userFriendlyMessage = 'Rate limit exceeded. Please wait and try again.';
				} else if (status >= 500) {
					userFriendlyMessage = 'Server error. Please try again later.';
				}
			} else if (error.message) {
				userFriendlyMessage = error.message;
			}
			setIsLoadingF(false);
			setCustomModalConfig({
				isOpen: true,
				title: 'Error Generating Flashcards',
				message: userFriendlyMessage,
				type: 'error'
			});
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

	// Update the useEffect for route change handling
	useEffect(() => {
		// Handle page reload
		const handleBeforeUnload = (e) => {
			if (isEditing) {
				e.preventDefault();
				e.returnValue = '';
				return '';
			}
		};

		// Handle browser back/forward
		const handlePopState = (e) => {
			if (isEditing) {
				// Prevent the default navigation
				e.preventDefault();
				window.history.pushState(null, '', window.location.pathname);

				// Show our modal
				setPendingNavigation(null);
				setShowUnsavedModal(true);
			}
		};

		// Push an entry to the history stack when editing starts
		if (isEditing) {
			window.history.pushState(null, '', window.location.pathname);
		}

		// Handle route changes for links
		const handleRouteChange = (e) => {
			if (isEditing) {
				e.preventDefault();
				setPendingNavigation(e.target.href);
				setShowUnsavedModal(true);
			}
		};

		// Add event listeners when component mounts
		window.addEventListener('beforeunload', handleBeforeUnload);
		window.addEventListener('popstate', handlePopState);

		const links = document.getElementsByTagName('a');
		Array.from(links).forEach((link) => {
			link.addEventListener('click', handleRouteChange);
		});

		// Remove event listeners when component unmounts
		return () => {
			window.removeEventListener('beforeunload', handleBeforeUnload);
			window.removeEventListener('popstate', handlePopState);
			Array.from(links).forEach((link) => {
				link.removeEventListener('click', handleRouteChange);
			});
		};
	}, [isEditing]);

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

			<Sidebar onToggle={handleSidebarToggle} onNavigate={handleNavigate} />
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
						onClick={() => handleNavigate('/myNotes')}
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
					<h2 className="text-xl font-aceh mb-6 text-newTxt dark:text-secondary flex items-center gap-3">
						<FontAwesomeIcon
							icon={faBookOpen}
							className="text-highlights dark:text-primary"
						/>
						More Study Options
					</h2>

					<div className="flex flex-wrap gap-4">
						{/* Flashcards Option */}
						<button
							onClick={handleFlashcardsClick}
							className={`
								group relative overflow-hidden gflash
								flex items-center gap-4 p-4
								rounded-xl 
								${
									flashcardsExist
										? 'bg-white dark:bg-zinc-900 border-2 border-highlights dark:border-primary'
										: 'bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800'
								}
								hover:bg-white hover:border-2 hover:border-highlights dark:hover:border-primary
								transition-all duration-300 ease-out
								shadow-sm hover:shadow-md
								w-full sm:w-auto
							`}>
							{/* Icon */}
							<div
								className={`
								w-12 h-12 rounded-lg
								flex items-center justify-center
								${
									flashcardsExist
										? 'bg-highlights dark:bg-primary'
										: 'bg-gray-200 dark:bg-zinc-800 group-hover:bg-highlights dark:group-hover:bg-primary'
								}
								transition-colors duration-300
							`}>
								<FontAwesomeIcon
									icon={flashcardsExist ? faClone : faPlus}
									className={`text-xl ${
										flashcardsExist
											? 'text-white'
											: 'text-gray-600 dark:text-white group-hover:text-white'
									}`}
								/>
							</div>

							{/* Text Content */}
							<div className="flex flex-col items-start">
								<span className="text-sm text-gray-500 dark:text-zinc-400 font-medium">
									{flashcardsExist ? 'Review Cards' : 'Create New'}
								</span>
								<span className="text-base font-semibold text-gray-800 dark:text-white">
									{flashcardsExist ? 'Open Flashcards' : 'Generate Flashcards'}
								</span>
							</div>

							{/* Arrow Indicator */}
							<FontAwesomeIcon
								icon={faArrowRight}
								className={`
									ml-auto text-lg
									${
										flashcardsExist
											? 'text-highlights dark:text-primary'
											: 'text-gray-400 dark:text-zinc-700 group-hover:text-highlights dark:group-hover:text-primary'
									}
									group-hover:translate-x-1
									transition-all duration-300
								`}
							/>
						</button>

						{/* Quiz Option */}
						<button
							onClick={handleQuizClick}
							className={`
								group relative overflow-hidden
								flex items-center gap-4 p-4 quiz
								rounded-xl 
								${
									quizExists
										? 'bg-white dark:bg-zinc-900 border-2 border-highlights dark:border-primary'
										: 'bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800'
								}
								hover:bg-white hover:border-2 hover:border-highlights dark:hover:border-primary
								transition-all duration-300 ease-out
								shadow-sm hover:shadow-md
								w-full sm:w-auto
							`}>
							{/* Icon */}
							<div
								className={`
								w-12 h-12 rounded-lg
								flex items-center justify-center
								${
									quizExists
										? 'bg-highlights dark:bg-primary'
										: 'bg-gray-200 dark:bg-zinc-800 group-hover:bg-highlights dark:group-hover:bg-primary'
								}
								transition-colors duration-300
							`}>
								<FontAwesomeIcon
									icon={quizExists ? faLightbulb : faPlus}
									className={`text-xl ${
										quizExists
											? 'text-white'
											: 'text-gray-600 dark:text-white group-hover:text-white'
									}`}
								/>
							</div>

							{/* Text Content */}
							<div className="flex flex-col items-start">
								<span className="text-sm text-gray-500 dark:text-zinc-400 font-medium">
									{quizExists ? 'Test Knowledge' : 'Create New'}
								</span>
								<span className="text-base font-semibold text-gray-800 dark:text-white">
									{quizExists ? 'Open Quiz' : 'Generate Quiz'}
								</span>
							</div>

							{/* Arrow Indicator */}
							<FontAwesomeIcon
								icon={faArrowRight}
								className={`
									ml-auto text-lg
									${
										quizExists
											? 'text-highlights dark:text-primary'
											: 'text-gray-400 dark:text-zinc-700 group-hover:text-highlights dark:group-hover:text-primary'
									}
									group-hover:translate-x-1
									transition-all duration-300
								`}
							/>
						</button>
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
					title={`Generate ${modalAction === 'flashcards' ? 'Flashcards' : 'Quiz'}`}
					className="max-w-lg mx-auto bg-white dark:bg-darken rounded-xl shadow-lg p-6">
					<div className="space-y-6">
						{/* Message Content */}
						<p className="text-zinc-700 dark:text-zinc-300 text-md leading-relaxed font-medium">
							Are you sure you want to create{' '}
							<strong className="text-primary dark:text-primary-light font-semibold">
								{modalAction === 'flashcards' ? 'flashcards' : 'a quiz'}
							</strong>{' '}
							from this summary?
							<span className="block mt-2">
								{modalAction === 'flashcards'
									? 'Flashcards will be generated based on the key points identified in the summary.'
									: 'A quiz will be generated based on the main concepts, and this action cannot be undone.'}
							</span>
						</p>

						{/* Tips Section */}
						<div className="p-4 bg-primary/10 dark:bg-primary-dark/20 rounded-md text-primary text-sm font-regular">
							<span className="font-medium">Tip:</span>{' '}
							{modalAction === 'flashcards'
								? 'Flashcards work best when the summary includes meaningful terms and definitions to aid learning and recall.'
								: 'Quizzes are a great way to test your understanding of the summary content.'}
						</div>

						<div className="p-4 bg-zinc-100 dark:bg-zinc-800 rounded-md text-zinc-700 dark:text-zinc-300 text-sm font-regular">
							<span className="font-medium">Note:</span>{' '}
							{modalAction === 'flashcards'
								? 'Once generated, you can edit individual flashcards to fine-tune the content.'
								: 'Once generated, you can retake the quiz multiple times but cannot edit the test questions.'}
						</div>

						{/* Action Buttons */}
						<div className="flex justify-end space-x-4 mt-6">
							<button
								onClick={() => setIsModalOpen(false)}
								className="px-5 py-2 bg-gray-200 dark:bg-zinc-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-zinc-600 transition duration-200">
								Cancel
							</button>
							<button
								onClick={handleModalConfirm}
								className="px-5 py-2 bg-primary text-white font-medium rounded-lg shadow-md hover:bg-primary-dark transition duration-200">
								Generate
							</button>
						</div>
					</div>
				</Modal>

				{/* Replace the error Modal with CustomModal */}
				<CustomModal
					isOpen={customModalConfig.isOpen}
					onClose={() => setCustomModalConfig(prev => ({ ...prev, isOpen: false }))}
					title={customModalConfig.title}
					message={customModalConfig.message}
					type={customModalConfig.type}
				/>

				<Modal
					isOpen={showUnsavedModal}
					onClose={handleUnsavedModalCancel}
					title="Leaving Editor"
					className="max-w-lg mx-auto bg-white dark:bg-darken rounded-xl shadow-lg p-6">
					<div className="space-y-6">
						<div className="text-zinc-700 dark:text-zinc-300">
							<p className="text-lg font-medium mb-3">Would you like to continue editing?</p>
							<p className="text-base text-zinc-600 dark:text-zinc-400">
								You're currently in edit mode. Click 'Continue Editing' to stay and keep
								making changes, or 'Exit Editor' to leave this page.
							</p>
						</div>

						<div className="flex justify-end space-x-4">
							<button
								onClick={handleUnsavedModalConfirm}
								className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 
								bg-gray-100 dark:bg-gray-800 rounded-lg 
								hover:bg-gray-200 dark:hover:bg-gray-700 
								transition-colors duration-200">
								Exit Editor
							</button>
							<button
								onClick={handleUnsavedModalCancel}
								className="px-4 py-2 text-sm font-medium text-white 
									bg-primary rounded-lg 
									hover:bg-primary/90 
									transition-colors duration-200">
								Continue Editing
							</button>
						</div>
					</div>
				</Modal>
			</main>
		</div>
	);
}
