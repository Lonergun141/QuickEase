import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisH, faClone, faChevronDown } from '@fortawesome/free-solid-svg-icons';
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
		<div className="flex flex-col lg:flex-row min-h-screen bg-zinc-50 dark:bg-dark w-full">
			<Sidebar onToggle={handleSidebarToggle} />
			<main
				className={`transition-all duration-300 flex-grow p-6 lg:p-8 mt-16 lg:mt-0 ${
					sidebarExpanded ? 'lg:ml-72' : 'lg:ml-28'
				}`}>
				<div className="max-w-7xl space-y-8">
					{/* Enhanced Header Section */}
					<div className="relative overflow-hidden bg-white dark:bg-darken rounded-2xl border border-zinc-200/80 dark:border-zinc-800 shadow-sm">
						<div className="relative p-8">
							<div className="grid md:grid-cols-[1fr,auto] gap-6 items-center">
								{/* Title and Description */}
								<div className="space-y-4">
									<div className="space-y-3">
										<div className="inline-flex items-center gap-3 bg-zinc-100/80 dark:bg-zinc-800/80 rounded-full pl-3 pr-5 py-1.5">
											<div className="p-2 rounded-full bg-primary/10 dark:bg-secondary/10">
												<FontAwesomeIcon 
													icon={faClone} 
													className="text-base text-primary dark:text-secondary" 
												/>
											</div>
											<span className="text-sm font-pmedium text-zinc-600 dark:text-zinc-300">
												Flashcards
											</span>
										</div>
										<h1 className="text-3xl font-pbold text-newTxt dark:text-white">
											Flashcard Sets
										</h1>
										<p className="text-base text-darkS dark:text-smenu font-pregular max-w-2xl">
											Review and practice with your flashcard collections
										</p>
									</div>
								</div>

								{/* Enhanced Sort Dropdown */}
								<div className="relative">
									<select
										value={sortOption}
										onChange={(e) => handleSortChange(e.target.value)}
										className="w-full appearance-none bg-white dark:bg-zinc-900 text-newTxt dark:text-white 
											border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-2.5 pr-10
											focus:outline-none focus:ring-2 focus:ring-primary/20 dark:focus:ring-secondary/20
											cursor-pointer font-pmedium text-sm transition-all">
										<option value="dateDesc">Newest First</option>
										<option value="dateAsc">Oldest First</option>
										<option value="titleAsc">Title A-Z</option>
										<option value="titleDesc">Title Z-A</option>
									</select>
									<div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400">
										<FontAwesomeIcon icon={faChevronDown} className="text-sm" />
									</div>
								</div>
							</div>
						</div>
					</div>

					{/* Flashcards Grid */}
					<div className={`${slideIn ? 'slide-in' : 'slide-out'} space-y-4`}>
						{loading ? (
							// Enhanced Loading Skeletons
							<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
								{[...Array(6)].map((_, i) => (
									<div key={i} className="bg-white dark:bg-darken rounded-xl border border-zinc-200/80 dark:border-zinc-800 p-6">
										<Skeleton height={24} width="70%" className="mb-4" />
										<Skeleton height={16} width="40%" className="mb-2" />
										<Skeleton height={16} width="30%" />
									</div>
								))}
							</div>
						) : currentFlashcards.length > 0 ? (
							<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
								{currentFlashcards.map((flashcard) => (
									<div
										key={flashcard.id}
										onClick={() => handleCardClick(flashcard.id)}
										className="group relative bg-white dark:bg-darken rounded-xl border border-zinc-200/80 
											dark:border-zinc-800 p-6 cursor-pointer transition-all duration-200
											hover:border-primary/20 dark:hover:border-secondary/20 hover:shadow-lg">
										<div className="space-y-3">
											<h3 className="font-psemibold text-lg text-newTxt dark:text-white line-clamp-2">
												{flashcard.title.replace(/["*]/g, '')}
											</h3>
											<div className="space-y-2">
												<p className="text-sm text-review  font-pmedium">
													{flashcard.count} Cards
												</p>
												<p className="text-sm text-darkS dark:text-smenu">
													Created {new Date(flashcard.dateCreated).toLocaleDateString('en-US', {
														month: 'short',
														day: 'numeric',
														year: 'numeric'
													})}
												</p>
											</div>
										</div>
									</div>
								))}
							</div>
						) : (
							// Enhanced Empty State
							<div className="flex flex-col items-center justify-center py-16 px-4">
								<img src={SVG} alt="No flashcards" className="w-64 h-64 mb-6 opacity-80" />
								<h2 className="text-xl font-psemibold text-newTxt dark:text-white mb-2">
									No Flashcard Sets Yet
								</h2>
								<p className="text-darkS dark:text-smenu mb-6 text-center max-w-md">
									Create flashcards from your notes to start practicing
								</p>
								<button
									onClick={() => navigate('/home')}
									className="inline-flex items-center px-6 py-3 rounded-xl bg-primary dark:bg-secondary 
										text-white font-pmedium transition-all hover:opacity-90">
									Create Your First Set
								</button>
							</div>
						)}
					</div>

					{/* Enhanced Pagination */}
					{flashcards.length > flashcardsPerPage && (
						<div className="flex justify-center mt-8">
							<Pagination
								currentPage={currentPage}
								totalPages={totalPages}
								onPageChange={handlePageChange}
							/>
						</div>
					)}
				</div>
			</main>
		</div>
	);
}
