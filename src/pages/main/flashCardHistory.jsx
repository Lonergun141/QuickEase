import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisH } from '@fortawesome/free-solid-svg-icons';
import Sidebar from '../../components/sidebar';
import { fetchUserFlashcards } from '../../features/Flashcard/flashCard';
import { useSelector } from 'react-redux';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import Pagination from '../../components/UI/Pagination';
import SVG from '../../assets/SVG/notfound.svg';

export default function FlashCardHistory() {
	const [sidebarExpanded, setSidebarExpanded] = useState(true);
	const [flashcards, setFlashcards] = useState([]);
	const [loading, setLoading] = useState(true);
	const [currentPage, setCurrentPage] = useState(1);
	const [sortOption, setSortOption] = useState('dateDesc');
	const [slideIn, setSlideIn] = useState(false);
	const flashcardsPerPage = 4;
	const navigate = useNavigate();
	const userInfo = useSelector((state) => state.auth.userInfo);

	useEffect(() => {
		if (userInfo) {
			fetchFlashcards();
		}
		setTimeout(() => {
			setSlideIn(true);
		}, 100);
	}, [userInfo]);

	const fetchFlashcards = async () => {
		try {
			setLoading(true);
			const flashcardsData = await fetchUserFlashcards(userInfo.id);
			const groupedFlashcards = flashcardsData.reduce((acc, flashcard) => {
				if (!acc[flashcard.noteID]) {
					acc[flashcard.noteID] = {
						id: flashcard.noteID,
						title: flashcard.note_title,
						count: 0,
						dateCreated: new Date().toISOString(), 
					};
				}
				acc[flashcard.noteID].count += 1;
		
				acc[flashcard.noteID].dateUpdated = new Date().toISOString();
				return acc;
			}, {});

	
			const storedDates = JSON.parse(localStorage.getItem('flashcardDates') || '{}');

		
			Object.keys(groupedFlashcards).forEach((noteId) => {
				if (storedDates[noteId]) {
					groupedFlashcards[noteId].dateCreated = storedDates[noteId].dateCreated;
					groupedFlashcards[noteId].dateUpdated = storedDates[noteId].dateUpdated;
				} else {
					storedDates[noteId] = {
						dateCreated: groupedFlashcards[noteId].dateCreated,
						dateUpdated: groupedFlashcards[noteId].dateUpdated,
					};
				}
			});

			localStorage.setItem('flashcardDates', JSON.stringify(storedDates));

			const sortedFlashcards = sortFlashcards(Object.values(groupedFlashcards), sortOption);
			setFlashcards(sortedFlashcards);
		} catch (error) {
			console.error('Error fetching flashcards:', error);
		} finally {
			setLoading(false);
		}
	};

	const sortFlashcards = (flashcardsArray, option) => {
		return [...flashcardsArray].sort((a, b) => {
			if (option === 'dateAsc') {
				return new Date(a.dateCreated) - new Date(b.dateCreated);
			} else if (option === 'dateDesc') {
				return new Date(b.dateCreated) - new Date(a.dateCreated);
			} else if (option === 'titleAsc') {
				return a.title.localeCompare(b.title);
			} else if (option === 'titleDesc') {
				return b.title.localeCompare(a.title);
			}
			return 0;
		});
	};

	const handleSortChange = (option) => {
		setSortOption(option);
		setFlashcards(sortFlashcards(flashcards, option));
	};

	const handleSidebarToggle = (isExpanded) => {
		setSidebarExpanded(isExpanded);
	};

	const handleCardClick = (noteId) => {
		
		const updatedFlashcards = flashcards.map((flashcard) => {
			if (flashcard.id === noteId) {
				return { ...flashcard, dateUpdated: new Date().toISOString() };
			}
			return flashcard;
		});
		setFlashcards(updatedFlashcards);
		const storedDates = JSON.parse(localStorage.getItem('flashcardDates') || '{}');
		storedDates[noteId] = {
			...storedDates[noteId],
			dateUpdated: new Date().toISOString(),
		};
		localStorage.setItem('flashcardDates', JSON.stringify(storedDates));

		navigate(`/Flashcards/${noteId}`);
	};

	const handlePageChange = (newPage) => {
		setCurrentPage(newPage);
	};

	const startIndex = (currentPage - 1) * flashcardsPerPage;
	const endIndex = startIndex + flashcardsPerPage;
	const currentFlashcards = flashcards.slice(startIndex, endIndex);
	const totalPages = Math.ceil(flashcards.length / flashcardsPerPage);

	return (
		<div className="flex flex-col lg:flex-row min-h-screen bg-secondary dark:bg-dark w-full">
			<Sidebar onToggle={handleSidebarToggle} />
			<main
				className={`transition-all duration-300 flex-grow lg:p-8 mt-16 lg:mt-0 ${
					sidebarExpanded ? 'lg:ml-72' : 'lg:ml-28'
				}`}>
				{/* Header section */}
				<div className="flex flex-col lg:pl-9 p-4 sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
					<h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-highlights dark:text-secondary">Flashcards</h1>
					<div className="relative w-full sm:w-auto">
						<select
							value={sortOption}
							onChange={(e) => handleSortChange(e.target.value)}
							className="w-full sm:w-auto bg-white dark:bg-darken dark:text-secondary border border-gray-300 rounded-md p-2 sm:p-1.5 text-sm sm:text-sm lg:text-base cursor-pointer font-pregular">
							<option value="dateDesc" className="text-sm lg:text-base">
								Newest to Oldest
							</option>
							<option value="dateAsc" className="text-sm lg:text-base">
								Oldest to Newest
							</option>
							<option value="titleAsc" className="text-sm lg:text-base">
								Title A-Z
							</option>
							<option value="titleDesc" className="text-sm lg:text-base">
								Title Z-A
							</option>
						</select>
					</div>
				</div>

				{/* Main content wrapper */}
				<div className="flex flex-col min-h-[calc(100vh-200px)] lg:pl-9 relative">
					<div className={`${slideIn ? 'slide-in' : 'slide-out'} flex-grow px-4`}>
						{loading ? (
							// Show loading skeletons while loading
							<div className="space-y-2">
								{[...Array(4)].map((_, i) => (
									<div
										key={i}
										className="bg-white dark:bg-darken lg:w-1/2 md:w-full rounded-lg p-4 relative transform transition-all duration-300">
										<div className="flex justify-between items-center mb-2 ">
											<Skeleton width={220} height={6} className="rounded dark:bg-darkS" /> {/* Title */}
											<Skeleton circle={true} width={5} height={4} className="rounded-full" /> {/* Icon */}
										</div>
										{/* Paragraph */}
										<Skeleton width={100} count={2} height={3} className="rounded dark:bg-darkS" /> {/* Date */}
									</div>
								))}
							</div>
						) : currentFlashcards.length > 0 ? (
							<div className="space-y-4">
								{currentFlashcards.map((flashcard) => (
									<div
										key={flashcard.id}
										className="bg-white dark:bg-darken lg:w-1/2 md:w-full rounded-lg p-4 cursor-pointer relative transform transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg hover:bg-blue-50 dark:hover:bg-darkS"
										onClick={() => handleCardClick(flashcard.id)}>
										<div className="flex justify-between items-center mb-2">
											<h3 className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-lg font-pbold text-highlights dark:text-secondary">{flashcard.title.replace(/["*]/g, '')}</h3>
										</div>
										<p className="text-xs text-review font-pregular">Flashcards: {flashcard.count}</p>
										<p className="text-xs text-gray-400 font-pregular">
											Date Created: {new Date(flashcard.dateCreated).toLocaleDateString()}
										</p>
									</div>
								))}
							</div>
						) : (
							<div className="flex flex-col items-center justify-center h-full text-center mt-8">
								
								<h1 className="text-2xl font-semibold text-gray-600 dark:text-gray-400 mt-4">No flashcards created yet!</h1>
								
							</div>
						)}
					</div>

					{/* Pagination */}
					{flashcards.length > flashcardsPerPage && (
						<div className="mt-4 mb-4">
							<Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
						</div>
					)}
				</div>
			</main>
		</div>
	);
}
