import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../../components/sidebar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEllipsisH, faChevronRight, faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { fetchSetFlashcards, editFlashcard, addFlashcard, deleteFlashcard } from '../../features/Flashcard/flashCard';
import { useSelector } from 'react-redux';
import Modal from '../../components/Modals/Modal';
import Button from '../../components/button';
import FlashcardsHeader from '../../components/UI/FlashCardHeader';

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

	const userInfo = useSelector((state) => state.auth.userInfo);
	const navigate = useNavigate();

	useEffect(() => {
		loadFlashcards();
	}, [noteId]);

	const loadFlashcards = async () => {
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
			navigate(`/QuickEase/notes/${noteId}`);
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
		return <div></div>;
	}

	const currentCard = cards[currentCardIndex];

	return (
		<div className="flex flex-col lg:flex-row min-h-screen bg-secondary dark:bg-dark w-full">
			<Sidebar onToggle={setSidebarExpanded} />
			<main
				className={`transition-all duration-300 flex-grow p-4 lg:p-8 mt-16 lg:mt-0 ${
					sidebarExpanded ? 'lg:ml-72' : 'lg:ml-28'
				}`}>
				<FlashcardsHeader
					isEditing={isEditing}
					openDeleteAllModal={openDeleteAllModal}
					handleEditToggle={handleEditToggle}
					handleStopEdit={handleStopEdit}
				/>

				{isEditing ? (
					<div className="space-y-6">
						<div className="flex justify-center">
							<button
								onClick={handleAddCard}
								className="p-3 border border-gray-300 dark:border-gray-600 rounded-full bg-white dark:bg-darken text-gray-700 dark:text-gray-300 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors shadow-sm">
								<FontAwesomeIcon icon={faPlus} className="text-lg" />
								<span className="ml-2 text-sm font-semibold">Add Card</span>
							</button>
						</div>
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6">
							{cards.map((card) => (
								<div key={card.id} className="mb-6 p-8 rounded-lg bg-white dark:bg-darken h-60 relative">
									<div className="absolute top-2 right-2 p-2">
										<FontAwesomeIcon
											icon={faEllipsisH}
											className="text-gray-600 dark:text-gray-400 cursor-pointer"
											onClick={() => openDeleteModal(card.id)}
										/>
									</div>
									<div className="mb-4">
										<label className="block text-highlights dark:text-secondary font-pbold mb-1">Term</label>
										<input
											type="text"
											value={card.term}
											onChange={(e) => handleCardChange(card.id, 'term', e.target.value)}
											className="w-full p-3 bg-gray-50 dark:bg-dark text-gray-900 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
											placeholder="Enter term"
										/>
									</div>
									<div>
										<label className="block text-highlights dark:text-secondary font-pbold mb-1">Definition</label>
										<input
											type="text"
											value={card.definition}
											onChange={(e) => handleCardChange(card.id, 'definition', e.target.value)}
											className="w-full p-3 bg-gray-50 dark:bg-dark text-gray-900 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
											placeholder="Enter definition"
										/>
									</div>
								</div>
							))}
						</div>

						{/* Modal for deleting cards */}
						<Modal isOpen={isModalOpen} onClose={closeDeleteModal} title="Delete Flashcard">
							<p className="dark:text-secondary font-pregular">Are you sure you want to delete this flashcard?</p>
							<div className="flex justify-end mt-4 space-x-2 w-full">
								<Button onClick={() => handleDeleteCard(selectedCardId)} className="bg-red-600 text-white">
									Delete
								</Button>
							</div>
						</Modal>

						{/* Modal for deleting all cards */}
						<Modal isOpen={isDeleteAllModalOpen} onClose={closeDeleteAllModal} title="Delete All Flashcards">
							<p className="dark:text-secondary font-pregular">
								Are you sure you want to delete all flashcards for this note?
							</p>
							<div className="flex justify-end mt-4 space-x-2 w-full">
								<Button onClick={handleDeleteAllCards} className="bg-red-600 text-white">
									Delete All
								</Button>
							</div>
						</Modal>
					</div>
				) : (
					<>
						<div className="relative flex flex-col items-center">
							{/* Navigation Buttons - Desktop */}
							<div className="hidden lg:flex absolute inset-y-0 left-0 right-0 items-center justify-between px-4 z-10 pointer-events-none">
								<button
									onClick={handlePrevCard}
									className="p-6 text-gray-700 dark:text-gray-300 hover:bg-gray-200/80 dark:hover:bg-gray-700/80 rounded-full transition-colors pointer-events-auto"
									aria-label="Previous card">
									<FontAwesomeIcon icon={faChevronLeft} className="text-2xl" />
								</button>
								<button
									onClick={handleNextCard}
									className="p-6 text-gray-700 dark:text-gray-300 hover:bg-gray-200/80 dark:hover:bg-gray-700/80 rounded-full transition-colors pointer-events-auto"
									aria-label="Next card">
									<FontAwesomeIcon icon={faChevronRight} className="text-2xl" />
								</button>
							</div>

							{/* Flashcard */}
							<div
								className="w-full max-w-2xl h-96 relative cursor-pointer"
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
										<p className="text-xl text-center dark:text-secondary">{currentCard.definition}</p>
									</div>
									<div
										className="absolute w-full h-full bg-white dark:bg-darken rounded-xl shadow-lg p-8 flex flex-col justify-center items-center text-lg"
										style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
										<div className="absolute top-0 right-0 p-4 text-sm font-semibold uppercase tracking-wide text-gray-500">
											Term
										</div>
										<p className="text-xl text-center dark:text-secondary">{currentCard.term}</p>
									</div>
								</div>
							</div>

							{/* Card Counter */}
							<div className="mt-4 text-lg text-highlights dark:text-secondary">
								{currentCardIndex + 1}/{cards.length}
							</div>

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
						<div className="mt-10">
							<h2 className="text-2xl font-bold text-highlights dark:text-secondary mb-4">Preview Cards</h2>
							<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
								{cards.map((card, index) => (
									<div
										key={card.id}
										className="p-4 rounded-xl bg-white dark:bg-darken cursor-pointer hover:scale-110 transform transition-transform duration-200 ease-out hover:bg-gray-100 dark:hover:bg-gray-800 shadow-md hover:shadow-xl"
										onClick={() => handleCardSelect(index)}>
										<p className="text-gray-600 dark:text-gray-300">{card.definition}</p>
									</div>
								))}
							</div>
						</div>
					</>
				)}
			</main>
		</div>
	);
}
