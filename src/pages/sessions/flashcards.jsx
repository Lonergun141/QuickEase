import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../../components/sidebar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	faPlus,
	faEllipsisH,
	faChevronRight,
	faChevronLeft,
	faClone,
	faPen,
	faRoute,
	faAdd,
	faTrash,
	faSave,
	faClose,
} from '@fortawesome/free-solid-svg-icons';
import {
	fetchSetFlashcards,
	editFlashcard,
	addFlashcard,
	deleteFlashcard,
} from '../../features/Flashcard/flashCard';
import { useSelector } from 'react-redux';
import Modal from '../../components/Modals/Modal';
import Button from '../../components/button';
import FlashcardsHeader from '../../components/UI/FlashCardHeader';
import FlashcardLoadingScreen from '../../components/Loaders/flashLoader';
import Joyride, { ACTIONS, EVENTS, STATUS } from 'react-joyride';
import { useDarkMode } from '../../features/Darkmode/darkmodeProvider';

export default function Flashcards() {
	const [sidebarExpanded, setSidebarExpanded] = useState(true);
	const [cards, setCards] = useState([]);
	const [currentCardIndex, setCurrentCardIndex] = useState(0);
	const [isFlipped, setIsFlipped] = useState(false);
	const { noteId } = useParams();

	const [isEditing, setIsEditing] = useState(false);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isDeleteAllModalOpen, setIsDeleteAllModalOpen] = useState(false);
	const [selectedCardId, setSelectedCardId] = useState(null);
	const [isLoading, setIsLoading] = useState(false);

	const [isOpen, setIsOpen] = useState(false);
	const userInfo = useSelector((state) => state.auth.userInfo);
	const navigate = useNavigate();

	const { isDarkMode } = useDarkMode();

	const [run, setRun] = useState(false);
	const [stepIndex, setStepIndex] = useState(0);

	const TOUR_KEY_VIEW = 'hasSeenTour_flash_view';
	const TOUR_KEY_EDIT = 'hasSeenTour_flash_edit';

	const stepsNonEditing = [
		{
			target: '.bigCard',
			content: (
				<div className="flex items-center gap-2 text-base ">
					<p>
						You can <strong>click</strong> and <strong>press space</strong> to flip this
						flashcard
					</p>
				</div>
			),
			placement: 'bottom',
			disableBeacon: true,
		},
		{
			target: '.prev',
			content: (
				<div className="text-sm sm:text-base flex flex-col gap-3 p-4 sm:p-6">
					<div className="flex items-center gap-2">
						<FontAwesomeIcon icon={faChevronLeft} className="text-base sm:text-xl" />
						<p>
							<strong>Click this button</strong> to go to previous card you may also press{' '}
							<strong>A</strong> or the <strong> arrow left </strong>
							on your keyboard
						</p>
					</div>
				</div>
			),
			placement: 'right',
			disableBeacon: true,
		},
		{
			target: '.next',
			content: (
				<div className="text-sm sm:text-base flex flex-col gap-3 p-4 sm:p-6">
					<div className="flex items-center gap-2">
						<p>
							<strong>Click this button</strong> to go to next card you may also press{' '}
							<strong>D</strong> or the <strong> arrow right </strong> on your keyboard
						</p>
						<FontAwesomeIcon icon={faChevronRight} className="text-base sm:text-xl" />
					</div>
				</div>
			),
			placement: 'left',
			disableBeacon: true,
		},
		{
			target: '.showAll',
			content: (
				<div className="text-sm sm:text-base flex items-center gap-3 sm:gap-4 p-4 sm:p-6">
					<FontAwesomeIcon icon={faClone} className="text-base sm:text-2xl" />
					<p>
						You can also click any of these preview cards to select what you want to be
						reflected on the flashcard
					</p>
				</div>
			),
			placement: 'top',
			disableBeacon: true,
		},
		{
			target: '.edit',
			content: (
				<div className="flex-col items-center gap-2 text-base">
					<FontAwesomeIcon icon={faPen} className="text-base sm:text-xl" />
					<p className="mt-4">
						Press the pen icon on the top right to edit the content of your flashcards
					</p>
				</div>
			),
			placement: 'center',
			disableBeacon: true,
		},
	];

	// Define your steps as usual
	const stepsEditing = [
		{
			target: '.add',
			content: (
				<div className="flex items-center gap-3 p-4">
					<FontAwesomeIcon icon={faAdd} className="text-xl" />
					<p>Press the add button to add a new flashcard</p>
				</div>
			),
			placement: 'top',
			disableBeacon: true,
		},
		{
			target: '.eCards',
			content: (
				<div className="flex items-center gap-3 p-4">
					<FontAwesomeIcon icon={faClone} className="text-xl" />
					<p>
						You can also change the terms and definitions of these cards. You may also press
						the{' '}
						<span>
							<FontAwesomeIcon icon={faEllipsisH} className="text-md font-bold" />
						</span>{' '}
						icon to <strong>delete</strong> individual cards
					</p>
				</div>
			),
			placement: 'bottom',
			disableBeacon: true,
		},
		{
			target: '.edit-card',
			content: (
				<div className="flex items-center gap-3 p-4">
					<FontAwesomeIcon icon={faPen} className="text-xl" />
					<p>Click this pen icon to view more edit options</p>
				</div>
			),
			placement: 'bottom',
			disableBeacon: true,
		},
		{
			target: '.edit-save',
			content: (
				<div className="flex items-center gap-3 p-4">
					<FontAwesomeIcon icon={faSave} className="text-xl" />
					<p>
						After making changes in your flashcards, make sure to click this to save the
						changes
					</p>
				</div>
			),
			placement: 'top',
			disableBeacon: true,
		},
		{
			target: '.edit-del',
			content: (
				<div className="flex items-center gap-3 p-4">
					<FontAwesomeIcon icon={faTrash} className="text-xl" />
					<p>You can also delete all the cards at once by pressing this delete button</p>
				</div>
			),
			placement: 'top',
			disableBeacon: true,
		},
	];

	const fabStepIndex = stepsEditing.findIndex((step) => step.target === '.edit-card');

	const steps = isEditing ? stepsEditing : stepsNonEditing;

	const toggleFAB = () => {
		setIsOpen(!isOpen);
	};

	const handleJoyrideCallback = (data) => {
		const { action, index, status, type } = data;

		if (type === EVENTS.STEP_AFTER || type === EVENTS.TARGET_NOT_FOUND) {
			const newStepIndex = index + (action === ACTIONS.PREV ? -1 : 1);
			setStepIndex(newStepIndex);

			if (index === fabStepIndex && action === ACTIONS.NEXT) {
				setIsOpen(true);
			}

			if (newStepIndex !== fabStepIndex + 1 && action === ACTIONS.PREV) {
				setIsOpen(false);
			}
		} else if (status === STATUS.FINISHED || status === STATUS.SKIPPED) {
			setRun(false);
			if (isEditing) {
				localStorage.setItem(TOUR_KEY_EDIT, 'skipped');
			} else {
				localStorage.setItem(TOUR_KEY_VIEW, 'skipped');
			}
			setIsOpen(false);
		}
	};

	const handleResetTour = () => {
		setStepIndex(0);
		setRun(true);
		localStorage.removeItem(TOUR_KEY_VIEW);
		localStorage.removeItem(TOUR_KEY_EDIT);
	};

	useEffect(() => {
		loadFlashcards();

		const hasSeenViewTour = localStorage.getItem(TOUR_KEY_VIEW);
		const hasSeenEditTour = localStorage.getItem(TOUR_KEY_EDIT);

		if (!hasSeenViewTour && !isEditing) {
			setTimeout(() => {
				setStepIndex(0);
				setRun(true);
				localStorage.setItem(TOUR_KEY_VIEW, 'true');
			}, 500);
		}

		if (!hasSeenEditTour && isEditing) {
			setTimeout(() => {
				setStepIndex(0);
				setRun(true);
				localStorage.setItem(TOUR_KEY_EDIT, 'true');
			}, 500);
		}
	}, [noteId, isEditing]);

	const loadFlashcards = async () => {
		setIsLoading(true);
		try {
			const flashcardsData = await fetchSetFlashcards(noteId);
			setCards(
				flashcardsData.map((fc) => ({
					id: fc.id,
					term: fc.frontCardText,
					definition: fc.backCardText,
				}))
			);
		} catch (error) {
			console.error('Error loading flashcards:', error);
		} finally {
			setIsLoading(false);
		}
	};

	const handleEditToggle = async () => {
		if (isEditing) {
			const hasEmptyCard = cards.some((card) => !card.term.trim() || !card.definition.trim());
			if (hasEmptyCard) {
				alert('All cards must have a term and a definition.');
				loadFlashcards();
				return;
			}
			try {
				await Promise.all(
					cards.map((card) =>
						card.isNew
							? addFlashcard(noteId, {
									frontCardText: card.term,
									backCardText: card.definition,
							  })
							: editFlashcard(card.id, {
									frontCardText: card.term,
									backCardText: card.definition,
							  })
					)
				);
				alert('Flashcards saved successfully!');
				loadFlashcards();
			} catch (error) {
				console.error('Error saving flashcards:', error);
			}
		}
		setIsEditing(!isEditing);
	};

	const handleCardChange = (id, field, value) => {
		setCards(cards.map((card) => (card.id === id ? { ...card, [field]: value } : card)));
	};

	const handleAddCard = () => {
		if (!noteId) {
			console.error('Note ID is missing');
			return;
		}
		const newCard = { id: Date.now(), term: '', definition: '', isNew: true };
		setCards([newCard, ...cards]);
	};

	const handleDeleteCard = async (id) => {
		try {
			await deleteFlashcard(id);
			setCards(cards.filter((card) => card.id !== id));
			setIsModalOpen(false);
		} catch (error) {
			console.error('Error deleting flashcard:', error);
		}
	};

	const handleDeleteAllCards = async () => {
		try {
			await Promise.all(cards.map((card) => deleteFlashcard(card.id)));
			setCards([]);
			setIsDeleteAllModalOpen(false);
			navigate(`/notes/${noteId}`);
		} catch (error) {
			console.error('Error deleting all flashcards:', error);
		} finally {
			console.log('Goods');
		}
	};

	const openDeleteModal = (cardId) => {
		setSelectedCardId(cardId);
		setIsModalOpen(true);
	};

	const openDeleteAllModal = () => {
		setIsDeleteAllModalOpen(true);
	};

	const closeDeleteModal = () => {
		setIsModalOpen(false);
		setSelectedCardId(null);
	};

	const closeDeleteAllModal = () => {
		setIsDeleteAllModalOpen(false);
	};

	const handleKeyPress = useCallback(
		(event) => {
			if (isEditing || !cards.length) return;

			switch (event.key) {
				case 'ArrowRight':
				case 'd':
					setIsFlipped(false);
					setCurrentCardIndex((prevIndex) => (prevIndex + 1) % cards.length);
					break;
				case 'ArrowLeft':
				case 'a':
					setIsFlipped(false);
					setCurrentCardIndex((prevIndex) => (prevIndex - 1 + cards.length) % cards.length);
					break;
				case ' ':
					event.preventDefault();
					setIsFlipped((prev) => !prev);
					break;
				default:
					break;
			}
		},
		[cards.length, isEditing]
	);

	useEffect(() => {
		window.addEventListener('keydown', handleKeyPress);

		return () => {
			window.removeEventListener('keydown', handleKeyPress);
		};
	}, [handleKeyPress]);

	const handleFlipCard = () => {
		setIsFlipped(!isFlipped);
	};

	const handleNextCard = () => {
		setIsFlipped(false);
		setCurrentCardIndex((prevIndex) => (prevIndex + 1) % cards.length);
	};

	const handlePrevCard = () => {
		setIsFlipped(false);
		setCurrentCardIndex((prevIndex) => (prevIndex - 1 + cards.length) % cards.length);
	};

	const handleCardSelect = (index) => {
		setCurrentCardIndex(index);
		setIsFlipped(false);
		window.scrollTo(0, 0);
	};

	const handleStopEdit = () => {
		setIsEditing(false);
		loadFlashcards();
	};

	if (!cards.length) {
		return <FlashcardLoadingScreen />;
	}

	const handleSave = handleEditToggle;
	const handleClose = handleStopEdit;
	const handleDeleteAll = openDeleteAllModal;

	const renderCurrentCard = () => {
		if (!cards.length || currentCardIndex >= cards.length) {
			return <div className="text-center p-8">No flashcards available</div>;
		}

		const currentCard = cards[currentCardIndex];

		return (
			<div
				className="w-full max-w-2xl h-96 relative cursor-pointer bigCard"
				onClick={handleFlipCard}
				style={{ perspective: '1500px' }}>
				<div
					className={`relative w-full h-full transition-all duration-700 ease-in-out transform ${
						isFlipped ? 'rotate-y-180' : ''
					}`}
					style={{ transformStyle: 'preserve-3d' }}>
					<div
						className="absolute w-full h-full bg-white dark:bg-darken rounded-xl shadow-lg p-8 flex flex-col justify-center items-center text-lg"
						style={{ backfaceVisibility: 'hidden', transform: 'rotateY(0deg)' }}>
						<div className="absolute top-0 right-0 p-4 text-sm font-semibold uppercase tracking-wide text-gray-500">
							Definition
						</div>
						<p className="text-xl text-center dark:text-secondary">
							{currentCard.definition}
						</p>
					</div>
					<div
						className="absolute w-full h-full bg-white dark:bg-darken rounded-xl shadow-lg p-8 flex flex-col justify-center items-center text-lg"
						style={{
							backfaceVisibility: 'hidden',
							transform: 'rotateY(180deg)',
						}}>
						<div className="absolute top-0 right-0 p-4 text-sm font-semibold uppercase tracking-wide text-gray-500">
							Term
						</div>
						<p className="text-xl text-center dark:text-secondary">{currentCard.term}</p>
					</div>
				</div>
			</div>
		);
	};

	return (
		<div className="flex flex-col lg:flex-row min-h-screen bg-secondary dark:bg-dark w-full">
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

			<Sidebar onToggle={setSidebarExpanded} />
			<main
				className={`transition-all duration-300 flex-grow p-4 lg:p-8 mt-16 lg:mt-0 ${
					sidebarExpanded ? 'lg:ml-72' : 'lg:ml-28'
				}`}>
				<div className="edit">
					<FlashcardsHeader
						isEditing={isEditing}
						openDeleteAllModal={openDeleteAllModal}
						handleEditToggle={handleEditToggle}
						handleStopEdit={handleStopEdit}
					/>
				</div>

				<button
					onClick={handleResetTour}
					className="fixed bottom-6 flex items-center z-50 space-x-2 bg-highlights dark:bg-darkS text-white px-4 py-2 rounded-full shadow-lg hover:scale-105 transition-transform"
					title="Reset Tour">
					<FontAwesomeIcon icon={faRoute} />
					<span className="hidden sm:inline-block text-white font-semibold">Take a Tour</span>
				</button>

				{isEditing ? (
					<div className="space-y-6 edit">
						<div className="flex justify-center">
							<button
								onClick={handleAddCard}
								className="p-3 border add border-gray-300 dark:border-gray-600 rounded-full bg-white dark:bg-darken text-gray-700 dark:text-gray-300 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors shadow-sm">
								<FontAwesomeIcon icon={faPlus} className="text-lg" />
								<span className="ml-2 text-sm font-semibold">Add Card</span>
							</button>
						</div>
						<div className="grid grid-cols-1 cards sm:grid-cols-2 lg:grid-cols-1 gap-6 eCards">
							{cards.map((card) => (
								<div
									key={card.id}
									className="mb-6 p-8  rounded-lg bg-white dark:bg-darken h-60 relative shadow-md hover:shadow-lg transition-shadow duration-300">
									<div className="absolute top-2 right-2 p-2">
										<FontAwesomeIcon
											icon={faEllipsisH}
											className="text-gray-600 dark:text-gray-400 cursor-pointer"
											onClick={() => openDeleteModal(card.id)}
										/>
									</div>
									<div className="mb-4">
										<label className="block text-highlights dark:text-secondary font-bold mb-1">
											Term
										</label>
										<input
											type="text"
											value={card.term}
											onChange={(e) => handleCardChange(card.id, 'term', e.target.value)}
											className="w-full p-3 bg-gray-50 dark:bg-dark text-gray-900 dark:text-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors"
											placeholder="Enter term"
										/>
									</div>
									<div>
										<label className="block text-highlights dark:text-secondary font-bold mb-1">
											Definition
										</label>
										<input
											type="text"
											value={card.definition}
											onChange={(e) =>
												handleCardChange(card.id, 'definition', e.target.value)
											}
											className="w-full p-3 bg-gray-50 dark:bg-dark text-gray-900 dark:text-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors"
											placeholder="Enter definition"
										/>
									</div>
								</div>
							))}
						</div>

						{/* Modal for deleting a single flashcard */}
						<Modal
							isOpen={isModalOpen}
							onClose={closeDeleteModal}
							title="Delete Flashcard"
							className="max-w-md mx-auto bg-white dark:bg-darken rounded-lg shadow-lg p-6">
							<div className="text-start mb-6">
								<h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
									Are you sure you want to delete this flashcard?
								</h3>
								<p className="text-sm text-gray-600 dark:text-gray-300">
									This action cannot be undone.
								</p>
							</div>

							<div className="flex justify-end space-x-4 mt-6">
								{/* Cancel Button */}
								<button
									onClick={closeDeleteModal}
									className="px-5 py-2 bg-gray-200 text-gray-700 rounded-lg font-pmedium hover:bg-gray-300 transition duration-200">
									Cancel
								</button>

								{/* Confirm Delete Button */}
								<button
									onClick={() => handleDeleteCard(selectedCardId)}
									className="px-5 py-2 bg-red-500 text-white font-pmedium rounded-lg shadow-md hover:bg-primary-dark transition duration-200">
									Delete
								</button>
							</div>
						</Modal>

						{/* Modal for deleting all cards */}
						<Modal
							isOpen={isDeleteAllModalOpen}
							onClose={closeDeleteAllModal}
							title="Delete All Flashcards"
							className="max-w-md mx-auto bg-white dark:bg-darken rounded-lg shadow-lg p-6">
							<div className="text-start mb-6">
								<h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
									Are you sure you want to delete all flashcards for this note?
								</h3>
								<p className="text-sm text-gray-600 dark:text-gray-300">
									This action cannot be undone.
								</p>
							</div>

							<div className="flex justify-end space-x-4 mt-6">
								{/* Cancel Button */}
								<button
									onClick={closeDeleteAllModal}
									className="px-5 py-2 bg-gray-200 text-gray-700 rounded-lg font-pmedium hover:bg-gray-300 transition duration-200">
									Cancel
								</button>

								{/* Confirm Delete Button */}
								<button
									onClick={handleDeleteAllCards}
									className="px-5 py-2 bg-red-500 text-white font-pmedium rounded-lg shadow-md hover:bg-primary-dark transition duration-200">
									Delete All
								</button>
							</div>
						</Modal>
					</div>
				) : (
					<>
						<div className="relative flex flex-col items-center">
							{/* Navigation Buttons - Desktop */}
							{cards.length > 0 && (
								<div className="hidden lg:flex absolute inset-y-0 left-0 right-0 items-center justify-between px-4 z-10 pointer-events-none">
									<button
										onClick={handlePrevCard}
										className="p-6 prev text-gray-700 dark:text-gray-300 hover:bg-gray-200/80 dark:hover:bg-gray-700/80 rounded-full transition-colors pointer-events-auto"
										aria-label="Previous card">
										<FontAwesomeIcon icon={faChevronLeft} className="text-2xl" />
									</button>
									<button
										onClick={handleNextCard}
										className="p-6 text-gray-700 next dark:text-gray-300 hover:bg-gray-200/80 dark:hover:bg-gray-700/80 rounded-full transition-colors pointer-events-auto"
										aria-label="Next card">
										<FontAwesomeIcon icon={faChevronRight} className="text-2xl" />
									</button>
								</div>
							)}

							{renderCurrentCard()}

							{/* Card Counter */}
							{cards.length > 0 && (
								<div className="mt-4 text-lg text-highlights dark:text-secondary">
									{currentCardIndex + 1}/{cards.length}
								</div>
							)}

							{/* Navigation Buttons - Mobile */}
							<div className="mt-10 flex justify-between w-full lg:hidden">
								<button
									onClick={handlePrevCard}
									className="p-3 border border-gray-300 dark:border-gray-600 rounded-full bg-white dark:bg-darken text-gray-700 dark:text-gray-300 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors shadow-sm">
									<FontAwesomeIcon icon={faChevronLeft} className="text-lg" />
								</button>
								<button
									onClick={handleNextCard}
									className="p-3 border border-gray-300 dark:border-gray-600 rounded-full bg-white dark:bg-darken text-gray-700 dark:text-gray-300 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors shadow-sm">
									<FontAwesomeIcon icon={faChevronRight} className="text-lg" />
								</button>
							</div>
						</div>

						{/* Preview Section */}
						<div className="mt-10 showAll">
							<h2 className="text-2xl font-bold text-highlights dark:text-secondary mb-4">
								Preview Cards
							</h2>
							<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
								{cards.map((card, index) => (
									<div
										key={card.id}
										className="p-4 rounded-xl bg-white dark:bg-darken cursor-pointer hover:scale-105 transform transition-transform duration-200 ease-out hover:bg-gray-100 dark:hover:bg-gray-800 shadow-md hover:shadow-xl"
										onClick={() => handleCardSelect(index)}>
										<p className="text-gray-600 dark:text-gray-300">{card.definition}</p>
									</div>
								))}
							</div>
						</div>
					</>
				)}

				{/* FAB Component */}

				{isEditing && (
					<div className="fixed bottom-6 right-4 sm:right-8 z-50">
						{/* Action Buttons */}
						<div
							className={`absolute flex flex-row items-center space-x-4 transition-all duration-300 ${
								isOpen
									? 'opacity-100 translate-x-0'
									: 'opacity-0 translate-x-4 pointer-events-none'
							}`}
							style={{ right: '4.5rem' }}>
							{/* Delete All Button */}
							<button
								onClick={() => {
									handleDeleteAll();
									toggleFAB();
								}}
								className="flex edit-del items-center delete px-4 py-2 sm:px-6 sm:py-3 bg-red-500 dark:bg-red-500 text-white dark:text-gray-100 rounded-lg shadow-lg hover:bg-red-700 dark:hover:bg-red-800 transition-colors text-xs sm:text-sm md:text-base whitespace-nowrap">
								<FontAwesomeIcon
									icon={faTrash}
									className="mr-2 sm:mr-3 text-xs sm:text-sm md:text-base"
								/>
								Delete All
							</button>

							{/* Save Button */}
							<button
								onClick={() => {
									handleSave();
									toggleFAB();
								}}
								className="flex edit-save items-center save px-4 py-2 sm:px-6 sm:py-3 bg-primary dark:bg-darkS text-white dark:text-gray-100 rounded-lg shadow-lg hover:bg-primary-dark dark:hover:bg-primary-darker transition-colors text-xs sm:text-sm md:text-base whitespace-nowrap">
								<FontAwesomeIcon
									icon={faSave}
									className="mr-2 sm:mr-3 text-xs sm:text-sm md:text-base"
								/>
								Save
							</button>
						</div>

						{/* Toggle FAB (pen icon) */}
						<button
							onClick={toggleFAB}
							className="w-10 h-10 edit-card sm:w-14 edit sm:h-14 md:w-16 md:h-16 bg-primary dark:bg-darkS text-white dark:text-gray-100 rounded-full shadow-lg flex items-center justify-center hover:bg-primary-dark dark:hover:bg-primary-darker transition-colors focus:outline-none">
							<FontAwesomeIcon icon={!isOpen ? faPen : faClose} size="lg" />
						</button>
					</div>
				)}
			</main>
		</div>
	);
}
