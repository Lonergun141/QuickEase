import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisH } from '@fortawesome/free-solid-svg-icons';
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
	const notesPerPage = 4;
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
		<div className="flex flex-col lg:flex-row min-h-screen bg-backgroundColor dark:bg-dark w-full">
			<Sidebar onToggle={handleSidebarToggle} />
			<main
				className={`transition-all duration-300 flex-grow lg:p-8 mt-16 lg:mt-0 ${
					sidebarExpanded ? 'lg:ml-72' : 'lg:ml-28'
				}`}>
				{/* Header section */}
				<div className="flex flex-col lg:pl-9 p-4 sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
					<h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-highlights dark:text-secondary">
						Summary Notes
					</h1>
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
										className="bg-white shadow-lg dark:bg-darken lg:w-1/2 md:w-full rounded-lg p-4 relative transform transition-all duration-300">
										<div className="flex justify-between items-center mb-2 ">
											<Skeleton width={220} height={10} className="dark:bg-darkS" />{' '}
											{/* Title */}
											<Skeleton
												circle={true}
												width={5}
												height={4}
												className="rounded-full"
											/>{' '}
											{/* Icon */}
										</div>
										{/* Paragraph */}
										<Skeleton
											width={100}
											count={2}
											height={6}
											className=" dark:bg-darkS"
										/>{' '}
										{/* Date */}
									</div>
								))}
							</div>
						) : currentNotes.length > 0 ? (
							<div className="space-y-4">
								{currentNotes.map((note) => (
									<div
										key={note.id}
										className="bg-white border border-[#E5E7EB] dark:border-stone-800 dark:bg-darken lg:w-1/2 md:w-full rounded-lg p-4 cursor-pointer relative transform transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg hover:bg-blue-50 dark:hover:bg-darkS"
										onClick={() => handleNoteClick(note.id)}>
										<div className="flex justify-between items-center mb-2">
											<h3 className="sm:text-sm md:text-base lg:text-md xl:text-xl font-pbold text-highlights dark:text-secondary">
												{note.notetitle.replace(/["*]/g, '')}
											</h3>

											<button
												className="text-gray-500 hover:text-red-600 transition-colors duration-200"
												onClick={(e) => {
													e.stopPropagation();
													openDeleteModal(note);
												}}>
												<FontAwesomeIcon
													icon={faEllipsisH}
													className="text-xl text-highlights dark:text-secondary"
												/>
											</button>
										</div>
										<p className="text-xs text-gray-400">
											Date Created: {new Date(note.notedatecreated).toLocaleDateString()}
										</p>
									</div>
								))}
							</div>
						) : (
							<div className="flex flex-col items-center justify-center h-full text-center mt-8">
								<img src={SVG} alt="No notes available" className="w-64 h-64" />
								<h1 className="text-2xl font-semibold text-gray-600 dark:text-gray-400 mt-4">
									No notes created yet!
								</h1>
								<button
									onClick={() => navigate('/home')}
									className="mt-4 px-6 py-2 bg-highlights dark:bg-secondary text-white dark:text-dark rounded-full font-semibold hover:bg-opacity-90 transition-all">
									Go to Home
								</button>
							</div>
						)}
					</div>

					{/* Pagination */}
					{notes.length > notesPerPage && (
						<div className="mt-4 mb-4">
							<Pagination
								currentPage={currentPage}
								totalPages={totalPages}
								onPageChange={handlePageChange}
							/>
						</div>
					)}
				</div>

				{/* Modal */}
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
