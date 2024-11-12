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
	faLayerGroup,
	faExclamationTriangle,
	faCheck,
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

const FlashCard = ({ card, isFlipped, onClick }) => {
	return (
		<div
			className="w-full max-w-2xl h-[28rem] relative cursor-pointer group bigCard"
			onClick={onClick}
			style={{ perspective: '1500px' }}>
			<div
				className={`relative w-full h-full transition-all duration-700 ease-in-out transform 
					${isFlipped ? 'rotate-y-180' : ''}`}
				style={{ transformStyle: 'preserve-3d' }}>
				{/* Front Side */}
				<div
					className="absolute w-full h-full rounded-2xl shadow-lg p-8 
						bg-gradient-to-br from-white to-zinc-50 dark:from-zinc-800 dark:to-zinc-900
						flex flex-col justify-center items-center"
					style={{ backfaceVisibility: 'hidden', transform: 'rotateY(0deg)' }}>
					<div
						className="absolute top-6 right-6 text-xs font-medium tracking-wider 
						text-zinc-400 dark:text-zinc-500 uppercase">
						Definition
					</div>
					<p
						className="text-2xl text-center text-zinc-800 dark:text-zinc-200 font-medium 
						max-w-lg leading-relaxed">
						{card.definition}
					</p>
					<div
						className="absolute bottom-6 left-1/2 -translate-x-1/2 
						text-zinc-400 dark:text-zinc-500 text-sm opacity-0 group-hover:opacity-100 
						transition-opacity duration-300">
						Click to flip
					</div>
				</div>

				{/* Back Side */}
				<div
					className="absolute w-full h-full rounded-2xl shadow-lg p-8 
						bg-gradient-to-br from-primary/5 to-primary/10 
						dark:from-secondary/5 dark:to-secondary/10
						flex flex-col justify-center items-center"
					style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
					<div
						className="absolute top-6 right-6 text-xs font-medium tracking-wider 
						text-primary/60 dark:text-secondary/60 uppercase">
						Term
					</div>
					<p
						className="text-2xl text-center text-primary dark:text-secondary font-medium 
						max-w-lg leading-relaxed">
						{card.term}
					</p>
				</div>
			</div>
		</div>
	);
};

const NavigationButton = ({ direction, onClick, className }) => {
	const isNext = direction === 'next';
	return (
		<button
			onClick={onClick}
			className={`p-4 rounded-full bg-white/80 dark:bg-zinc-800/80 backdrop-blur-sm
				shadow-lg hover:shadow-xl transition-all duration-300
				text-zinc-700 dark:text-zinc-300 hover:text-primary dark:hover:text-secondary
				hover:scale-110 active:scale-95 ${className}`}>
			<FontAwesomeIcon icon={isNext ? faChevronRight : faChevronLeft} className="text-xl" />
		</button>
	);
};

const PreviewCard = ({ card, isActive, onClick, index }) => {
	return (
		<div
			onClick={onClick}
			className={`group relative overflow-hidden rounded-xl transition-all duration-300 
				${
					isActive
						? 'ring-2 ring-primary dark:ring-secondary shadow-lg'
						: 'hover:ring-2 hover:ring-primary/50 dark:hover:ring-secondary/50'
				}
				transform hover:-translate-y-1 hover:shadow-xl`}>
			{/* Card Number Badge */}
			<div
				className={`absolute top-3 left-3 w-8 h-8 rounded-full flex items-center justify-center
				text-sm font-medium ${
					isActive
						? 'bg-primary dark:bg-secondary text-white dark:text-dark'
						: 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'
				}`}>
				{index + 1}
			</div>

			{/* Card Content */}
			<div
				className={`p-6 pt-12 h-full ${
					isActive ? 'bg-primary/5 dark:bg-secondary/5' : 'bg-white dark:bg-zinc-900'
				}`}>
				{/* Definition Preview */}
				<div className="space-y-3">
					<div className="text-xs font-medium tracking-wider text-zinc-400 dark:text-zinc-500 uppercase">
						Definition
					</div>
					<p className="text-sm text-zinc-600 dark:text-zinc-300 line-clamp-3">
						{card.definition}
					</p>
				</div>

				{/* Term Preview (Only visible when active) */}
				<div
					className={`mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800
					transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-0'}`}>
					<div className="text-xs font-medium tracking-wider text-zinc-400 dark:text-zinc-500 uppercase">
						Term
					</div>
					<p className="mt-2 text-sm font-medium text-primary dark:text-secondary line-clamp-2">
						{card.term}
					</p>
				</div>

				{/* Select Indicator */}
				<div
					className={`absolute bottom-3 right-3 transition-opacity duration-300
					${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
					<div
						className={`p-1.5 rounded-full ${
							isActive
								? 'bg-primary dark:bg-secondary text-white dark:text-dark'
								: 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500'
						}`}>
						<svg
							className="w-4 h-4"
							fill="none"
							viewBox="0 0 24 24"
							strokeWidth={2}
							stroke="currentColor">
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
							/>
						</svg>
					</div>
				</div>
			</div>
		</div>
	);
};

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
						You can also change the terms and definitions of these cards. You may also hover
						and press the{' '}
						<span>
							<FontAwesomeIcon icon={faTrash} className="text-md font-bold" />
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
			placement: 'top',
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
		setIsLoading(true);
		try {
			await deleteFlashcard(id);
			setCards(cards.filter((card) => card.id !== id));
			setIsModalOpen(false);
			setIsLoading(false);
		} catch (error) {
			console.error('Error deleting flashcard:', error);
		}
	};

	const handleDeleteAllCards = async () => {
		setIsLoading(true);
		try {
			await Promise.all(cards.map((card) => deleteFlashcard(card.id)));
			setCards([]);
			setIsDeleteAllModalOpen(false);
			navigate(`/notes/${noteId}`);
		} catch (error) {
			console.error('Error deleting all flashcards:', error);
		} finally {
			setIsLoading(false);
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
			return (
				<div className="flex flex-col items-center justify-center h-96 space-y-4">
					<div className="text-4xl text-zinc-300 dark:text-zinc-600">
						<FontAwesomeIcon icon={faLayerGroup} />
					</div>
					<p className="text-lg text-zinc-500 dark:text-zinc-400">No flashcards available</p>
				</div>
			);
		}

		return (
			<FlashCard card={cards[currentCardIndex]} isFlipped={isFlipped} onClick={handleFlipCard} />
		);
	};

	const renderPreviewSection = () => {
		return (
			<div className="mt-16 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 showAll">
				{/* Section Header */}
				<div className="flex items-center justify-between mb-8">
					<div className="space-y-1">
						<h2 className="text-xl font-semibold text-zinc-900 dark:text-white">
							All Flashcards
						</h2>
						<p className="text-sm text-zinc-500 dark:text-zinc-400">
							Click on a card to view it in detail
						</p>
					</div>
				</div>

				{/* Cards Grid */}
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
					{cards.map((card, index) => (
						<PreviewCard
							key={card.id}
							card={card}
							index={index}
							isActive={index === currentCardIndex}
							onClick={() => handleCardSelect(index)}
						/>
					))}
				</div>

				{/* Empty State */}
				{cards.length === 0 && (
					<div className="flex flex-col items-center justify-center py-12 text-center">
						<div
							className="w-16 h-16 mb-4 rounded-full bg-zinc-100 dark:bg-zinc-800 
							flex items-center justify-center">
							<svg
								className="w-8 h-8 text-zinc-400 dark:text-zinc-500"
								fill="none"
								viewBox="0 0 24 24"
								strokeWidth={1.5}
								stroke="currentColor">
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M6 6.878V6a2.25 2.25 0 012.25-2.25h7.5A2.25 2.25 0 0118 6v.878m-12 0c.235-.083.487-.128.75-.128h10.5c.263 0 .515.045.75.128m-12 0A2.25 2.25 0 004.5 9v.878m13.5-3A2.25 2.25 0 0119.5 9v.878m0 0a2.246 2.246 0 00-.75-.128H5.25c-.263 0-.515.045-.75.128m15 0A2.25 2.25 0 0121 12v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6c0-.98.626-1.813 1.5-2.122"
								/>
							</svg>
						</div>
						<h3 className="text-lg font-medium text-zinc-900 dark:text-white">
							No flashcards yet
						</h3>
						<p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
							Get started by creating your first flashcard
						</p>
					</div>
				)}
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
					<div className="space-y-8 edit max-w-5xl mx-auto px-4">
						{/* Add Card Button */}
						<div className="flex justify-center">
							<button
								onClick={handleAddCard}
								disabled={isLoading}
								className="group relative px-6 py-4 border-2 border-primary/20 dark:border-secondary/20 
									rounded-xl bg-white dark:bg-darken flex items-center justify-center 
									hover:border-primary dark:hover:border-secondary transition-all duration-300 
									disabled:opacity-50 disabled:cursor-not-allowed">
								<div className="flex items-center space-x-3 add">
									<div className="relative w-5 h-5">
										{isLoading ? (
											<div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary dark:border-secondary" />
										) : (
											<FontAwesomeIcon
												icon={faPlus}
												className="text-primary dark:text-secondary text-lg 
													group-hover:scale-110 transition-transform duration-300"
											/>
										)}
									</div>
									<span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
										Add New Flashcard
									</span>
								</div>

								{/* Hover Effect */}
								<div
									className="absolute inset-0 bg-primary/5 dark:bg-secondary/5 
									rounded-xl opacity-0 group-hover:opacity-100 transition-opacity 
									duration-300 -z-10"
								/>
							</button>
						</div>

						{/* Cards Grid */}
						<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 eCards">
							{cards.map((card, index) => (
								<div
									key={card.id}
									className="group relative p-6 rounded-xl bg-white dark:bg-darken 
										border border-zinc-100 dark:border-zinc-800
										hover:border-primary/20 dark:hover:border-secondary/20
										shadow-sm hover:shadow-md transition-all duration-300">
									{/* Card Number */}
									<div
										className="absolute -top-3 -left-3 w-8 h-8 rounded-full 
										bg-primary/10 dark:bg-secondary/10 flex items-center justify-center 
										text-primary dark:text-secondary font-medium text-sm">
										{index + 1}
									</div>

									{/* Delete Button with Loading State */}
									<button
										onClick={() => openDeleteModal(card.id)}
										disabled={isLoading}
										className="absolute top-4 right-4 p-2.5 rounded-full 
											opacity-0 group-hover:opacity-100 transition-all duration-300
											hover:bg-red-50 dark:hover:bg-red-900/30
											active:scale-95 disabled:cursor-not-allowed
											hover:shadow-md">
										{isLoading ? (
											<div
												className="animate-spin rounded-full h-4 w-4 
												border-2 border-red-200 border-t-red-500"
											/>
										) : (
											<FontAwesomeIcon
												icon={faTrash}
												className="text-red-500 dark:text-red-400 text-sm
													transition-transform duration-300
													hover:scale-110"
											/>
										)}
									</button>

									{/* Form Fields */}
									<div className="space-y-6">
										{/* Term Input */}
										<div className="space-y-2">
											<label className="block text-sm font-medium text-zinc-600 dark:text-zinc-400">
												Term
											</label>
											<div className="relative">
												<input
													type="text"
													value={card.term}
													onChange={(e) =>
														handleCardChange(card.id, 'term', e.target.value)
													}
													className="w-full px-4 py-3 bg-zinc-50 dark:bg-dark 
														border border-zinc-200 dark:border-zinc-700 
														text-zinc-900 dark:text-zinc-300 rounded-lg 
														focus:outline-none focus:ring-2 focus:ring-primary/50 
														dark:focus:ring-secondary/50 focus:border-transparent 
														transition-all placeholder-zinc-400 dark:placeholder-zinc-600"
													placeholder="Enter term..."
												/>
												<div
													className="absolute right-3 top-1/2 -translate-y-1/2 
													pointer-events-none opacity-0 transition-opacity duration-300">
													<FontAwesomeIcon
														icon={faCheck}
														className="text-green-500 text-sm"
													/>
												</div>
											</div>
										</div>

										{/* Definition Input */}
										<div className="space-y-2">
											<label className="block text-sm font-medium text-zinc-600 dark:text-zinc-400">
												Definition
											</label>
											<div className="relative">
												<textarea
													value={card.definition}
													onChange={(e) =>
														handleCardChange(card.id, 'definition', e.target.value)
													}
													rows="3"
													className="w-full px-4 py-3 bg-zinc-50 dark:bg-dark 
														border border-zinc-200 dark:border-zinc-700 
														text-zinc-900 dark:text-zinc-300 rounded-lg 
														focus:outline-none focus:ring-2 focus:ring-primary/50 
														dark:focus:ring-secondary/50 focus:border-transparent 
														transition-all placeholder-zinc-400 dark:placeholder-zinc-600 
														resize-none"
													placeholder="Enter definition..."
												/>
												<div
													className="absolute right-3 top-3 pointer-events-none 
													opacity-0 transition-opacity duration-300">
													<FontAwesomeIcon
														icon={faCheck}
														className="text-green-500 text-sm"
													/>
												</div>
											</div>
										</div>
									</div>

									{/* Loading Overlay */}
									{isLoading && (
										<div
											className="absolute inset-0 bg-white/50 dark:bg-dark/50 
											rounded-xl flex items-center justify-center">
											<div
												className="animate-spin rounded-full h-8 w-8 
												border-b-2 border-primary dark:border-secondary"
											/>
										</div>
									)}
								</div>
							))}
						</div>

						{/* Enhanced Delete Modal */}
						<Modal
							isOpen={isModalOpen}
							onClose={closeDeleteModal}
							className="max-w-md mx-auto bg-white dark:bg-darken rounded-xl 
								shadow-xl p-6 border border-zinc-200 dark:border-zinc-700">
							<div className="space-y-4">
								{/* Modal Header */}
								<div className="flex items-center space-x-3">
									<div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-full">
										<FontAwesomeIcon
											icon={faExclamationTriangle}
											className="text-xl text-red-500 dark:text-red-400"
										/>
									</div>
									<h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
										Delete Flashcard
									</h3>
								</div>

								{/* Modal Content */}
								<div className="pl-12">
									<p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
										Are you sure you want to delete this flashcard?
										<span className="block mt-1 text-red-500 dark:text-red-400 font-medium">
											This action cannot be undone.
										</span>
									</p>
								</div>

								{/* Modal Actions */}
								<div className="flex justify-end items-center space-x-3 pt-4">
									{/* Cancel Button */}
									<button
										onClick={closeDeleteModal}
										disabled={isLoading}
										className="px-4 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 
											hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-all
											duration-300 hover:shadow-sm active:scale-95
											disabled:opacity-50 disabled:cursor-not-allowed">
										Cancel
									</button>

									{/* Delete Button */}
									<button
										onClick={() => handleDeleteCard(selectedCardId)}
										disabled={isLoading}
										className="group relative px-4 py-2 bg-white dark:bg-zinc-800 
											border border-red-200 dark:border-red-800
											text-red-500 dark:text-red-400 text-sm font-medium rounded-lg 
											hover:bg-red-50 dark:hover:bg-red-900/30 
											transition-all duration-300 hover:shadow-md active:scale-95
											disabled:opacity-50 disabled:cursor-not-allowed">
										<div className="flex items-center space-x-2">
											{isLoading ? (
												<>
													<div
														className="animate-spin rounded-full h-4 w-4 
														border-2 border-red-200 border-t-red-500"
													/>
													<span>Deleting...</span>
												</>
											) : (
												<>
													<FontAwesomeIcon
														icon={faTrash}
														className="group-hover:scale-110 transition-transform duration-300"
													/>
													<span>Delete</span>
												</>
											)}
										</div>
									</button>
								</div>
							</div>

						
						</Modal>
					</div>
				) : (
					<>
						<div className="relative flex flex-col items-center">
							{cards.length > 0 && (
								<div
									className="hidden lg:flex absolute inset-y-0 left-0 right-0 
									items-center justify-between px-8 z-10 pointer-events-none">
									<NavigationButton
										direction="prev"
										onClick={handlePrevCard}
										className="prev pointer-events-auto"
									/>
									<NavigationButton
										direction="next"
										onClick={handleNextCard}
										className="next pointer-events-auto"
									/>
								</div>
							)}

							{renderCurrentCard()}

							{/* Card Counter */}
							{cards.length > 0 && (
								<div className="mt-6 flex items-center gap-2">
									<div className="px-4 py-2 rounded-full bg-zinc-100 dark:bg-zinc-800">
										<span className="text-primary dark:text-secondary font-medium">
											{currentCardIndex + 1}
										</span>
										<span className="text-zinc-400 dark:text-zinc-500 mx-1">/</span>
										<span className="text-zinc-600 dark:text-zinc-400">
											{cards.length}
										</span>
									</div>
								</div>
							)}

							{/* Mobile Navigation */}
							<div className="mt-8 flex justify-center gap-4 lg:hidden w-full">
								<NavigationButton direction="prev" onClick={handlePrevCard} />
								<NavigationButton direction="next" onClick={handleNextCard} />
							</div>
						</div>

						{renderPreviewSection()}
					</>
				)}

				{/* Delete All Modal */}
				<Modal
					isOpen={isDeleteAllModalOpen}
					onClose={closeDeleteAllModal}
					className="max-w-md mx-auto bg-white dark:bg-darken rounded-xl 
        shadow-xl p-6 border border-zinc-200 dark:border-zinc-700">
					<div className="space-y-4">
						{/* Modal Header */}
						<div className="flex items-center space-x-3">
							<div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-full">
								<FontAwesomeIcon
									icon={faExclamationTriangle}
									className="text-xl text-red-500 dark:text-red-400"
								/>
							</div>
							<h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
								Delete All Flashcards
							</h3>
						</div>

						{/* Modal Content */}
						<div className="pl-12">
							<p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
								Are you sure you want to delete all flashcards?
								<span className="block mt-1 text-red-500 dark:text-red-400 font-medium">
									This action cannot be undone.
								</span>
							</p>
						</div>

						{/* Modal Actions */}
						<div className="flex justify-end items-center space-x-3 pt-4">
							<button
								onClick={closeDeleteAllModal}
								disabled={isLoading}
								className="px-4 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 
                    hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-all
                    duration-300 hover:shadow-sm active:scale-95
                    disabled:opacity-50 disabled:cursor-not-allowed">
								Cancel
							</button>
							<button
								onClick={handleDeleteAllCards}
								disabled={isLoading}
								className="group relative px-4 py-2 bg-white dark:bg-zinc-800 
                    border border-red-200 dark:border-red-800
                    text-red-500 dark:text-red-400 text-sm font-medium rounded-lg 
                    hover:bg-red-50 dark:hover:bg-red-900/30 
                    transition-all duration-300 hover:shadow-md active:scale-95
                    disabled:opacity-50 disabled:cursor-not-allowed">
								<div className="flex items-center space-x-2">
									{isLoading ? (
										<>
											<div
												className="animate-spin rounded-full h-4 w-4 
                                border-2 border-red-200 border-t-red-500"
											/>
											<span>Deleting all...</span>
										</>
									) : (
										<>
											<FontAwesomeIcon
												icon={faTrash}
												className="group-hover:scale-110 transition-transform duration-300"
											/>
											<span>Delete All</span>
										</>
									)}
								</div>
							</button>
						</div>
					</div>
				</Modal>

				{/* FAB Component */}

				{isEditing && (
					<div className="fixed bottom-6 right-4 sm:right-8 z-50">
						<div className="relative flex items-center justify-end">
							{/* Action Buttons Container */}
							<div
								className={`absolute right-full flex items-center mr-4 
								transition-all duration-500 ease-out ${
									isOpen
										? 'opacity-100 translate-x-0'
										: 'opacity-0 translate-x-24 pointer-events-none'
								}`}>
								{/* Save Button */}
								<button
									onClick={() => {
										handleSave();
										toggleFAB();
									}}
									disabled={isLoading}
									className="edit-save group relative flex items-center h-10 px-4 
										bg-primary dark:bg-secondary text-white dark:text-dark 
										rounded-xl shadow-lg hover:shadow-xl transition-all duration-300
										disabled:opacity-50 disabled:cursor-not-allowed
										hover:-translate-y-0.5 active:translate-y-0">
									<div className="flex  items-center space-x-2">
										{isLoading ? (
											<div
												className="animate-spin rounded-full h-4 w-4 
												border-2 border-white/30 border-t-white"
											/>
										) : (
											<>
												<FontAwesomeIcon
													icon={faSave}
													className="text-base transition-transform duration-300 
														group-hover:scale-110 group-active:scale-95"
												/>
												<span className="text-sm font-medium whitespace-nowrap">
													Save
												</span>
											</>
										)}
									</div>

									{/* Hover Effect */}
									<div
										className="absolute inset-0 bg-black/10 dark:bg-white/10 
										rounded-xl opacity-0 group-hover:opacity-100 
										transition-opacity duration-300 -z-10"
									/>
								</button>

								{/* Divider */}
								<div className="w-3" />

								{/* Delete All Button */}
								<button
									onClick={() => {
										openDeleteAllModal();
										toggleFAB();
									}}
									disabled={isLoading}
									className="edit-del group relative flex items-center h-10 px-4
										bg-white dark:bg-zinc-800 text-red-500 dark:text-red-400 
										rounded-xl shadow-lg hover:shadow-xl transition-all duration-300
										disabled:opacity-50 disabled:cursor-not-allowed
										hover:-translate-y-0.5 active:translate-y-0">
									<div className="flex items-center space-x-2">
										{isLoading ? (
											<div
												className="animate-spin rounded-full h-4 w-4 
												border-2 border-red-200 border-t-red-500"
											/>
										) : (
											<>
												<FontAwesomeIcon
													icon={faTrash}
													className="text-base transition-transform duration-300 
														group-hover:scale-110 group-active:scale-95"
												/>
												<span className="text-sm font-medium whitespace-nowrap">
													Delete All
												</span>
											</>
										)}
									</div>

									{/* Hover Effect */}
									<div
										className="absolute inset-0 bg-red-50 dark:bg-red-900/20 
										rounded-xl opacity-0 group-hover:opacity-100 
										transition-opacity duration-300 -z-10"
									/>
								</button>
							</div>

							{/* Main FAB Button */}
							<button
								onClick={toggleFAB}
								disabled={isLoading}
								className="edit-card group relative w-12 h-12 sm:w-14 sm:h-14 
									bg-primary dark:bg-secondary text-white dark:text-dark 
									rounded-full shadow-lg hover:shadow-xl transition-all duration-300 
									focus:outline-none focus:ring-2 focus:ring-primary/50 
									dark:focus:ring-secondary/50 focus:ring-offset-2 
									dark:focus:ring-offset-dark disabled:opacity-50 
									disabled:cursor-not-allowed hover:-translate-y-0.5 
									active:translate-y-0">
								<div className="relative flex items-center justify-center w-full h-full">
									{/* Icon Container with Animation */}
									<div
										className={`transition-transform duration-500 ${
											isOpen ? 'rotate-180 scale-90' : 'rotate-0 scale-100'
										}`}>
										<FontAwesomeIcon
											icon={!isOpen ? faPen : faClose}
											className="text-lg transition-transform duration-300 
												group-hover:scale-110 group-active:scale-95"
										/>
									</div>

									{/* Loading Indicator */}
									{isLoading && (
										<div className="absolute inset-0 flex items-center justify-center">
											<div
												className="animate-spin rounded-full h-5 w-5 
												border-2 border-white/30 border-t-white"
											/>
										</div>
									)}
								</div>

								{/* Hover Effect Ripple */}
								<div
									className="absolute inset-0 bg-black/10 dark:bg-white/10 
									rounded-full opacity-0 group-hover:opacity-100 
									transition-opacity duration-300 -z-10"
								/>

								{/* Tooltip */}
								{!isOpen && !isLoading && (
									<div
										className="absolute -top-10 left-1/2 -translate-x-1/2 
										opacity-0 group-hover:opacity-100 transition-opacity 
										duration-300 pointer-events-none edit-card'">
										<div
											className="bg-zinc-800 dark:bg-zinc-700 text-white 
											text-xs px-2 py-1 rounded-md shadow-lg whitespace-nowrap">
											Edit Flashcards
										</div>
										<div
											className="absolute -bottom-1 left-1/2 -translate-x-1/2 
											w-2 h-2 bg-zinc-800 dark:bg-zinc-700 transform rotate-45"
										/>
									</div>
								)}
							</button>
						</div>
					</div>
				)}
			</main>
		</div>
	);
}
