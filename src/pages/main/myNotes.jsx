import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisH, faStickyNote, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import Sidebar from '../../components/sidebar';
import { fetchAllNotes, deleteNote } from '../../features/Summarizer/openAiServices';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import DeleteModal from '../../components/Modals/deleteModal';
import SVG from '../../assets/SVG/notfound.svg';
import Pagination from '../../components/UI/Pagination';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export default function MyNotes() {
	const [sidebarExpanded, setSidebarExpanded] = useState(true);
	const [notes, setNotes] = useState([]);
	const [loading, setLoading] = useState(true);
	const [showModal, setShowModal] = useState(false);
	const [noteToDelete, setNoteToDelete] = useState(null);
	const [currentPage, setCurrentPage] = useState(1);
	const [sortOption, setSortOption] = useState('dateDesc');
	const [slideIn, setSlideIn] = useState(false);
	const notesPerPage = 6;
	const navigate = useNavigate();
	const user = useSelector((state) => state.auth.user);

	useEffect(() => {
		if (user) {
			fetchNotes();
		}
		setTimeout(() => {
			setSlideIn(true);
		}, 100);
	}, [user]);

	const fetchNotes = async () => {
		try {
			setLoading(true);
			const fetchedNotes = await fetchAllNotes();
			const sortedNotes = sortNotes(fetchedNotes, sortOption);
			setNotes(sortedNotes);
		} catch (error) {
			console.error('Error fetching notes:', error);
		} finally {
			setLoading(false);
		}
	};

	const sortNotes = (notesArray, option) => {
		return [...notesArray].sort((a, b) => {
			if (option === 'dateAsc') {
				return new Date(a.notedatecreated) - new Date(b.notedatecreated);
			} else if (option === 'dateDesc') {
				return new Date(b.notedatecreated) - new Date(a.notedatecreated);
			} else if (option === 'titleAsc') {
				return a.notetitle.localeCompare(b.notetitle);
			} else if (option === 'titleDesc') {
				return b.notetitle.localeCompare(a.notetitle);
			}
			return 0;
		});
	};

	const handleSortChange = (option) => {
		setSortOption(option);
		setNotes(sortNotes(notes, option));
	};

	const handleSidebarToggle = (isExpanded) => {
		setSidebarExpanded(isExpanded);
	};

	const handleDelete = async (id) => {
		try {
			await deleteNote(id);
			fetchNotes();
			setShowModal(false);
		} catch (error) {
			console.error('Error deleting note:', error);
		}
	};

	const handleNoteClick = (id) => {
		navigate(`/Notes/${id}`);
	};

	const openDeleteModal = (note) => {
		setNoteToDelete(note);
		setShowModal(true);
	};

	const closeModal = () => {
		setShowModal(false);
		setNoteToDelete(null);
	};

	const handlePageChange = (newPage) => {
		setCurrentPage(newPage);
	};

	const startIndex = (currentPage - 1) * notesPerPage;
	const endIndex = startIndex + notesPerPage;
	const currentNotes = notes.slice(startIndex, endIndex);
	const totalPages = Math.ceil(notes.length / notesPerPage);

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
											<div className="p-2 rounded-full ">
												<FontAwesomeIcon 
													icon={faStickyNote} 
													className="text-base text-primary dark:text-secondary" 
												/>
											</div>
											<span className="text-sm font-pmedium text-zinc-600 dark:text-zinc-300">
												Your Notes
											</span>
										</div>
										<h1 className="text-3xl font-pbold text-newTxt dark:text-white">
											Summary Notes
										</h1>
										<p className="text-base text-darkS dark:text-smenu font-pregular max-w-2xl">
											Access and manage your summarized notes
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

					{/* Notes Grid */}
					<div className={`${slideIn ? 'slide-in' : 'slide-out'} space-y-4`}>
						{loading ? (
							// Enhanced Loading Skeletons
							<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
								{[...Array(6)].map((_, i) => (
									<div key={i} className="bg-white dark:bg-darken rounded-xl border border-zinc-200/80 dark:border-zinc-800 p-6">
										<Skeleton height={24} width="70%" className="mb-4" />
										<Skeleton height={16} width="40%" />
									</div>
								))}
							</div>
						) : currentNotes.length > 0 ? (
							<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
								{currentNotes.map((note) => (
									<div
										key={note.id}
										onClick={() => handleNoteClick(note.id)}
										className="group relative bg-white dark:bg-darken rounded-xl border border-zinc-200/80 
											dark:border-zinc-800 p-6 cursor-pointer transition-all duration-200
											hover:border-primary/20 dark:hover:border-secondary/20 hover:shadow-lg">
										<div className="space-y-3">
											<div className="flex items-start justify-between gap-4">
												<h3 className="font-psemibold text-lg text-newTxt dark:text-white line-clamp-2">
													{note.notetitle.replace(/["*]/g, '')}
												</h3>
												<button
													onClick={(e) => {
														e.stopPropagation();
														openDeleteModal(note);
													}}
													className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 
														transition-colors opacity-0 group-hover:opacity-100">
													<FontAwesomeIcon 
														icon={faEllipsisH} 
														className="text-zinc-400 dark:text-zinc-500" 
													/>
												</button>
											</div>
											<p className="text-sm text-darkS dark:text-smenu">
												{new Date(note.notedatecreated).toLocaleDateString('en-US', {
													month: 'short',
													day: 'numeric',
													year: 'numeric'
												})}
											</p>
										</div>
									</div>
								))}
							</div>
						) : (
							// Enhanced Empty State
							<div className="flex flex-col items-center justify-center py-16 px-4">
								<img src={SVG} alt="No notes" className="w-64 h-64 mb-6 opacity-80" />
								<h2 className="text-xl font-psemibold text-newTxt dark:text-white mb-2">
									No Notes Yet
								</h2>
								<p className="text-darkS dark:text-smenu mb-6 text-center max-w-md">
									Start creating notes by summarizing your study materials
								</p>
								<button
									onClick={() => navigate('/home')}
									className="inline-flex items-center px-6 py-3 rounded-xl bg-primary dark:bg-secondary 
										text-white dark:text-dark font-pmedium transition-all hover:opacity-90">
									Create Your First Note
								</button>
							</div>
						)}
					</div>

					{/* Enhanced Pagination */}
					{notes.length > notesPerPage && (
						<div className="flex justify-center mt-8">
							<Pagination
								currentPage={currentPage}
								totalPages={totalPages}
								onPageChange={handlePageChange}
							/>
						</div>
					)}
				</div>

				{/* Delete Modal remains the same */}
				{showModal && noteToDelete && (
					<DeleteModal
						isOpen={showModal}
						onClose={closeModal}
						onDelete={() => handleDelete(noteToDelete.id)}
						noteTitle={noteToDelete.notetitle}
					/>
				)}
			</main>
		</div>
	);
}
