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
} from '@fortawesome/free-solid-svg-icons';
import { fetchNote, updateNote, generateQuizFromSummary } from '../../features/Summarizer/openAiServices';
import { createQuiz, fetchQuiz } from '../../features/Quiz/quizServices';
import { useSelector } from 'react-redux';
import { createFlashcards, fetchSetFlashcards } from '../../features/Flashcard/flashCard';
import LoadingScreen from '../../components/loader';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import parse from 'html-react-parser';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import Modal from '../../components/Modals/Modal';
import { useUserStats } from '../../features/badge/userStatsContext';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

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

const renderContent = (content) => {
	const parts = [];
	let lastIndex = 0;
	const regex = /(\\\(.*?\\\)|\$\$.*?\$\$)/gs;

	let match;
	while ((match = regex.exec(content)) !== null) {
		// Add text before the math expression
		if (match.index > lastIndex) {
			parts.push(parse(content.slice(lastIndex, match.index)));
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

	// Add any remaining text after the last math expression
	if (lastIndex < content.length) {
		parts.push(parse(content.slice(lastIndex)));
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
	const [quizExists, setQuizExists] = useState(false);
	const [flashcardsExist, setFlashcardsExist] = useState(false);
	const [isGeneratingQuiz, setIsGeneratingQuiz] = useState(false);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [modalAction, setModalAction] = useState('');
	const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
	const [errorMessage, setErrorMessage] = useState('');
	const { refreshUserStats } = useUserStats();

	const { id } = useParams();
	const navigate = useNavigate();
	const { userInfo } = useSelector((state) => state.auth);

	useEffect(() => {
		const getNoteData = async () => {
			if (userInfo && id) {
				try {
					const noteData = await fetchNote(id);
					setNote(noteData);
					setEditedTitle(noteData.notetitle);
					setEditedSummary(noteData.notesummary);

					const flashcards = await fetchSetFlashcards(id);
					setFlashcardsExist(flashcards.length > 0);

					const quizResponse = await fetchQuiz(id);
					setQuizExists(quizResponse.length > 0);
				} catch (error) {}
			}
		};

		getNoteData();
	}, [id, userInfo]);

	const handleSidebarToggle = (isExpanded) => {
		setSidebarExpanded(isExpanded);
	};

	const handleQuiz = async () => {
		setIsLoading(true);
		if (quizExists) {
			navigate(`/QuickEase/Review/${id}`);
		} else {
			setIsGeneratingQuiz(true);
			try {
				const generatedQuiz = await generateQuizFromSummary(note.notesummary);
				await createQuiz(id, generatedQuiz);
				setQuizExists(true);
				refreshUserStats();
				navigate(`/QuickEase/Quiz/${id}`);
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
			navigate(`/QuickEase/Flashcards/${id}`);
		} else {
			setModalAction('flashcards');
			setIsModalOpen(true);
		}
	};

	const handleQuizClick = () => {
		if (quizExists) {
			navigate(`/QuickEase/Review/${id}`);
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
		setIsLoading(true);
		try {
			if (!flashcardsExist) {
				const response = await createFlashcards(id, userInfo.id);
				console.log('Flashcards creation response:', response);
			}
			refreshUserStats();
			navigate(`/QuickEase/Flashcards/${id}`);
		} catch (error) {
			console.error('Error with flashcards:', error);
		} finally {
			setIsLoading(false);
		}
	};

	const openConfirmationModal = (action) => {
		setModalAction(action);
		setIsModalOpen(true);
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
		return <LoadingScreen />;
	}

	return (
		<div className="flex flex-col lg:flex-row min-h-screen bg-white dark:bg-dark w-full">
			<Sidebar onToggle={handleSidebarToggle} />
			<main
				className={`transition-all duration-300 flex-grow p-4 lg:p-8 mt-16 lg:mt-0 ${
					sidebarExpanded ? 'lg:ml-72' : 'lg:ml-28'
				}`}>
				<div className="flex items-center mb-6 justify-between">
					<button
						onClick={() => navigate(-1)}
						className="text-gray-500 dark:text-secondary hover:text-highlights transition-colors duration-200">
						<FontAwesomeIcon icon={faArrowLeft} className="text-2xl" />
					</button>
					<div className="hidden xs:flex items-center">
						<FontAwesomeIcon icon={faFire} color="#EE924F" className="text-coral-red text-xl mr-3" />
						<h1 className="text-xl md:text-3xl lg:text-xl font-pbold text-highlights dark:text-secondary">Summary</h1>
					</div>

					{!isEditing ? (
						<div className="flex items-center xs:mr-2 sm:mr-5 md:mr-6 mr-4">
							<button
								onClick={handleEdit}
								title="Edit"
								aria-label="Edit"
								className="flex items-center p-2 rounded transition-colors duration-300 hover:bg-gray-200 dark:hover:bg-gray-700">
								<FontAwesomeIcon icon={faPen} className="text-xl text-highlights dark:text-secondary" />
								<span className="ml-2 text-sm text-highlights dark:text-secondary">Edit</span>
							</button>
						</div>
					) : (
						<div className="flex items-center">
							<button
								onClick={handleSave}
								title="Save"
								aria-label="Save"
								className="flex items-center p-2 rounded transition-colors duration-300 hover:bg-gray-200 dark:hover:bg-gray-700 mr-2">
								<FontAwesomeIcon icon={faSave} className="text-xl text-highlights dark:text-secondary" />
								<span className="ml-2 text-sm text-highlights dark:text-secondary">Save</span>
							</button>

							<button
								onClick={handleCancel}
								title="Cancel"
								aria-label="Cancel"
								className="flex items-center p-2 rounded transition-colors duration-300 hover:bg-gray-200 dark:hover:bg-gray-700">
								<FontAwesomeIcon icon={faTimes} className="text-xl text-highlights dark:text-secondary" />
								<span className="ml-2 text-sm text-highlights dark:text-secondary">Cancel</span>
							</button>
						</div>
					)}
				</div>

				<div className="mt-8">
					<h2 className="text-xl font-pbold mb-4 dark:text-secondary">More Study Options</h2>
					<div className="flex items-center md:flex-row md:justify-start md:space-x-6">
						<div className="flex flex-col items-center mr-8">
							<button
								className={`flex items-center justify-center w-20 h-20 rounded-full mb-2 
                  ${flashcardsExist ? 'bg-primary dark:bg-primary' : 'bg-gray-300 dark:bg-gray-700'}`}
								onClick={handleFlashcardsClick}>
								<FontAwesomeIcon icon={flashcardsExist ? faClone : faPlus} className="text-4xl text-white" />
							</button>
							<span className="text-center text-sm text-highlights dark:text-secondary">
								{flashcardsExist ? 'Open Flashcards' : 'Generate Flashcards'}
							</span>
						</div>
						<div className="flex flex-col items-center">
							<button
								className={`flex items-center justify-center w-20 h-20 rounded-full mb-2 
                  ${quizExists ? 'bg-primary dark:bg-primary' : 'bg-gray-300 dark:bg-gray-700'}`}
								onClick={handleQuizClick}>
								<FontAwesomeIcon icon={quizExists ? faLightbulb : faPlus} className="text-4xl text-white" />
							</button>
							<span className="text-center text-sm text-gray-600 dark:text-secondary">
								{quizExists ? 'Open Quiz' : 'Generate Quiz'}
							</span>
						</div>
					</div>
				</div>

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
								<h1 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-pbold mb-4 dark:text-secondary">
									{note.notetitle || <Skeleton height={20} className="dark:bg-darkS rounded-full" />}
								</h1>

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

				{/* Modal for Confirmation */}
				<Modal
					isOpen={isModalOpen}
					onClose={() => setIsModalOpen(false)}
					title={`Generate ${modalAction === 'flashcards' ? 'Flashcards' : 'Quiz'}`}>
					<div className="space-y-4">
						<p className="text-gray-600 dark:text-gray-300">
							Are you sure you want to generate {modalAction === 'flashcards' ? 'flashcards' : 'a quiz'} from this summary?
							This action cannot be undone.
						</p>
						<div className="flex justify-end space-x-4">
							<button
								onClick={() => setIsModalOpen(false)}
								className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition-colors">
								Cancel
							</button>
							<button
								onClick={handleModalConfirm}
								className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
								Generate
							</button>
						</div>
					</div>
				</Modal>
				{/* Error Modal */}
				<Modal isOpen={isErrorModalOpen} onClose={() => setIsErrorModalOpen(false)} title="Error">
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
