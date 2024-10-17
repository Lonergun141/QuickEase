import React, { useState, useRef, useEffect } from 'react';
import Sidebar from '../../components/sidebar';
import Button from '../../components/button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	faFileAlt,
	faImage,
	faPenToSquare,
	faTimes,
	faUpload,
	faExclamationTriangle,
} from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import NotesLoadingScreen from '../../components/Loaders/loader';
import {
	generateSummary,
	generateSummaryFromImages,
} from '../../features/Summarizer/openAiServices';
import { fetchUserInfo } from '../../features/auth/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import Modal from '../../components/Modals/Modal';
import { Instructions } from '../../components/UI/instructions';
import { QuickieGreetings } from '../../components/UI/quickieGreetings';
import { useUserStats } from '../../features/badge/userStatsContext';

export default function Home() {
	const [activeTab, setActiveTab] = useState('text');
	const [inputText, setInputText] = useState('');
	const [uploadedImages, setUploadedImages] = useState([]);
	const [uploadedDocuments, setUploadedDocuments] = useState([]);
	const [fileError, setFileError] = useState('');
	const fileInputRef = useRef(null);
	const [loading, setLoading] = useState(false);
	const [sidebarExpanded, setSidebarExpanded] = useState(true);
	const [textError, setTextError] = useState('');
	const [characterCount, setCharacterCount] = useState(0);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [modalMessage, setModalMessage] = useState('');
	const [wordCount, setWordCount] = useState(0);
	const [isDragOver, setIsDragOver] = useState(false);
	const { refreshUserStats } = useUserStats();

	const dispatch = useDispatch();
	const { userInfo } = useSelector((state) => state.auth);

	useEffect(() => {
		dispatch(fetchUserInfo());
	}, [dispatch]);

	const handleSidebarToggle = (isExpanded) => {
		setSidebarExpanded(isExpanded);
	};

	const handleTabChange = (tab) => {
		setActiveTab(tab);
		setFileError('');
	};

	const handleTextChange = (e) => {
		const text = e.target.value;
		setInputText(text);
		setCharacterCount(text.length);
		const wordCount = text.split(/\s+/).filter(Boolean).length;
		setWordCount(wordCount);

		if (text.length === 0) {
			setTextError('Text input cannot be empty.');
		} else if (wordCount < 200) {
			setTextError('Text must be at least 200 words long.');
		} else if (text.length > 10000) {
			setTextError('Text cannot exceed 10000 characters.');
		} else {
			setTextError('');
		}
	};

	const handleFiles = (newFiles) => {
		const currentAllowedExtensions =
			activeTab === 'images' ? ['jpg', 'jpeg', 'png'] : ['pdf', 'doc', 'docx', 'ppt', 'pptx'];

		const oversizedFiles = newFiles.filter((file) => file.size > 10 * 1024 * 1024);
		const invalidFiles = newFiles.filter((file) => {
			const extension = file.name.split('.').pop().toLowerCase();
			return !currentAllowedExtensions.includes(extension);
		});

		if (oversizedFiles.length > 0) {
			setFileError('One or more files exceed the 10MB limit. Please choose smaller files.');
		} else if (invalidFiles.length > 0) {
			setFileError('One or more files have invalid file types.');
		} else {
			if (activeTab === 'images') {
				setUploadedImages([...uploadedImages, ...newFiles]);
			} else {
				setUploadedDocuments([...uploadedDocuments, ...newFiles]);
			}
			setFileError('');
		}
	};

	const handleFileUpload = (e) => {
		e.preventDefault();
		const newFiles = Array.from(e.target.files);
		handleFiles(newFiles);
		e.target.value = null;
	};

	const handleDragOver = (e) => {
		e.preventDefault();
		setIsDragOver(true);
	};

	const handleDragLeave = (e) => {
		e.preventDefault();
		setIsDragOver(false);
	};

	const handleDrop = (e) => {
		e.preventDefault();
		setIsDragOver(false);
		const newFiles = Array.from(e.dataTransfer.files);
		handleFiles(newFiles);
	};

	const handleFileDelete = (index) => {
		if (activeTab === 'images') {
			const updatedFiles = uploadedImages.filter((_, i) => i !== index);
			setUploadedImages(updatedFiles);
			if (updatedFiles.length === 0) {
				setFileError('');
			}
		} else {
			const updatedFiles = uploadedDocuments.filter((_, i) => i !== index);
			setUploadedDocuments(updatedFiles);
			if (updatedFiles.length === 0) {
				setFileError('');
			}
		}
	};

	const triggerFileInput = () => {
		fileInputRef.current.click();
	};

	const navigate = useNavigate();

	const handleGenerate = async () => {
		setLoading(true);

		if (activeTab === 'text') {
			if (characterCount < 200 || characterCount > 10000) {
				navigate('/TranscribeError');
				setLoading(false);
				return;
			}

			try {
				const data = {
					notecontents: inputText,
					user: userInfo.id,
				};

				const response = await generateSummary(data);
				refreshUserStats();
				if (response && response.id) {
					navigate(`/Notes/${response.id}`);
				} else {
					throw new Error('Invalid response from generateSummary');
				}
			} catch (error) {
				console.error('Error generating summary:', error);
				navigate('/TranscribeError');
			} finally {
				setLoading(false);
			}
		} else if (activeTab === 'images' || activeTab === 'documents') {
			const filesToProcess = activeTab === 'images' ? uploadedImages : uploadedDocuments;

			if (filesToProcess.length === 0) {
				navigate('/TranscribeError');
				setLoading(false);
			} else {
				try {
					const response = await generateSummaryFromImages(
						filesToProcess,
						navigate,
						userInfo.id
					);
					if (response && response.id) {
						refreshUserStats();
						navigate(`/Notes/${response.id}`);
					} else {
						throw new Error('Invalid response from generateSummaryFromImages');
					}
				} catch (error) {
					console.error('Error generating summary from files:', error);
					navigate('/TranscribeError');
				} finally {
					setLoading(false);
				}
			}
		}
	};

	const filesToDisplay = activeTab === 'images' ? uploadedImages : uploadedDocuments;

	return (
		<div className="flex flex-col lg:flex-row min-h-screen bg-secondary dark:bg-dark w-full">
			<Sidebar onToggle={handleSidebarToggle} />
			<main
				className={`transition-all duration-300 flex-grow p-4 lg:p-8 mt-16 lg:mt-0 ${
					sidebarExpanded ? 'lg:ml-72' : 'lg:ml-28'
				}`}>
				<div className="rounded-lg overflow-hidden">
					{/* Quickie Mascot - Highlighted First */}
					<QuickieGreetings />
					<div className="flex flex-col lg:flex-row">
						<div className="w-full lg:w-3/4 p-2">
							{/* Mobile tab selector */}
							<div className="lg:hidden flex justify-center mb-4 bg-gray-100 dark:bg-dark rounded-lg p-2">
								{['text', 'documents', 'images'].map((tab) => (
									<button
										key={tab}
										onClick={() => handleTabChange(tab)}
										className={`flex-1 p-2 ${
											activeTab === tab
												? 'bg-highlights dark:bg-darkS text-white'
												: 'bg-white dark:bg-darken dark:text-secondary'
										} rounded-md mx-1 flex items-center justify-center transition-transform transform hover:scale-105`}>
										<FontAwesomeIcon
											icon={
												tab === 'text'
													? faPenToSquare
													: tab === 'documents'
													? faFileAlt
													: faImage
											}
											className="mr-2 text-sm sm:text-base"
										/>
										{/* Hide text on extra small screens */}
										<span className="hidden sm:inline text-xs sm:text-sm">
											{tab === 'text' ? 'Input text' : `Upload ${tab}`}
										</span>
									</button>
								))}
							</div>

							{activeTab === 'text' && (
								<div className="w-full">
									<textarea
										className="w-full h-64 p-2 border rounded resize-none dark:bg-darken dark:text-secondary"
										placeholder="Input your text here"
										value={inputText}
										onChange={handleTextChange}
									/>
									<div className="mt-2 flex justify-between items-center text-sm">
										<span
											className={`${
												characterCount > 10000 || characterCount < 200
													? 'text-gray-400'
													: 'text-gray-500'
											}`}>
											{characterCount}/10000 characters
										</span>
										{textError && (
											<span className="text-red-500 font-pmedium">{textError}</span>
										)}
									</div>
								</div>
							)}
							{(activeTab === 'documents' || activeTab === 'images') && (
								<div
									className={`border-2 border-dashed border-gray-300 rounded-lg p-4 md:p-8 text-center ${
										filesToDisplay.length > 0 ? 'h-64 overflow-y-auto' : ''
									} ${isDragOver ? 'bg-gray-100 dark:bg-dark' : ''}`}
									onDragOver={handleDragOver}
									onDragEnter={handleDragOver}
									onDragLeave={handleDragLeave}
									onDrop={handleDrop}>
									{isDragOver ? (
										<>
											<FontAwesomeIcon
												icon={faUpload}
												className="text-3xl md:text-4xl text-gray-400 mb-4 animate-bounce"
											/>
											<h2 className="text-lg md:text-xl font-semibold mb-2 dark:text-secondary">
												Drop your files here
											</h2>
										</>
									) : filesToDisplay.length === 0 ? (
										<>
											<FontAwesomeIcon
												icon={faUpload}
												className="text-3xl md:text-4xl text-gray-400 mb-4"
											/>
											<h1 className="text-lg md:text-xl font-semibold mb-2 dark:text-secondary">
												Upload from your computer or drag files here
											</h1>
											<p className="text-xs md:text-sm text-gray-500 mb-4">
												Supported file types:{' '}
												{activeTab === 'images'
													? 'jpg, jpeg, png'
													: 'pdf, doc, docx, ppt, pptx'}
											</p>
											<p className="text-xs text-gray-400 mb-4">
												Make sure your document contains at least 200 words, but no more
												than 10,000 characters and not more than 10MB of file size
											</p>
											<div className="flex justify-center">
												<button
													onClick={triggerFileInput}
													className="px-4 md:px-6 py-2 bg-blue-500 dark:bg-naeg text-white text-sm md:text-base rounded-full hover:bg-blue-600 transition-colors duration-300 flex items-center justify-center">
													<FontAwesomeIcon icon={faUpload} className="mr-2" />
													Choose Files
												</button>
											</div>
										</>
									) : (
										<div className="space-y-2">
											{filesToDisplay.map((file, index) => (
												<div
													key={index}
													className="flex items-center justify-between bg-white dark:bg-darken p-4 rounded-md hover:border hover:cursor-pointer">
													<span className="text-sm md:text-base truncate dark:text-secondary">
														{file.name}
													</span>
													<button
														onClick={() => handleFileDelete(index)}
														className="text-primary dark:text-naeg hover:text-red-700 ml-2">
														<FontAwesomeIcon icon={faTimes} />
													</button>
												</div>
											))}
										</div>
									)}
								</div>
							)}
							{fileError && (
								<div className="mt-2 text-red-500 flex items-center text-sm">
									<FontAwesomeIcon icon={faExclamationTriangle} className="mr-2" />
									{fileError}
								</div>
							)}
							<input
								ref={fileInputRef}
								type="file"
								multiple
								accept={
									activeTab === 'images' ? '.jpg,.jpeg,.png' : '.pdf,.doc,.docx,.ppt,.pptx'
								}
								onChange={handleFileUpload}
								className="hidden"
							/>
							<div className="mt-4 flex justify-end">
								<Button
									onClick={handleGenerate}
									className="w-full lg:w-2/3"
									disabled={
										(activeTab === 'text' &&
											(characterCount < 200 || characterCount > 10000)) ||
										(activeTab === 'documents' && uploadedDocuments.length === 0) ||
										(activeTab === 'images' && uploadedImages.length === 0)
									}>
									Generate
								</Button>
							</div>
						</div>
						<div className="hidden lg:block w-1/4 p-4">
							<div className="space-y-2">
								{['text', 'documents', 'images'].map((tab) => (
									<button
										key={tab}
										onClick={() => handleTabChange(tab)}
										className={`w-full p-4 md:p-6 text-left dark:text-secondary ${
											activeTab === tab
												? 'bg-highlights dark:bg-darkS text-white'
												: 'bg-white dark:bg-darken'
										} rounded flex items-center`}>
										<FontAwesomeIcon
											icon={
												tab === 'text'
													? faPenToSquare
													: tab === 'documents'
													? faFileAlt
													: faImage
											}
											className="mr-2"
										/>
										{tab === 'text' ? 'Input text' : `Upload ${tab}`}
									</button>
								))}
							</div>
						</div>
					</div>
				</div>
				<h2 className="text-2xl font-pbold mb-4 mt-12 text-primary dark:text-secondary">
					How to Upload Your Materials
				</h2>
				<Instructions />
				{loading && <NotesLoadingScreen />}
				{isModalOpen && (
					<Modal onClose={() => setIsModalOpen(false)}>
						<p>{modalMessage}</p>
					</Modal>
				)}
			</main>
		</div>
	);
}
