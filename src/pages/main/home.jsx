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
	faRoute,
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
import Joyride, { ACTIONS, EVENTS, STATUS } from 'react-joyride';
import { useDarkMode } from '../../features/Darkmode/darkmodeProvider';
import { img } from '../../constants';

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

	const { isDarkMode } = useDarkMode();

	const [run, setRun] = useState(false);
	const [stepIndex, setStepIndex] = useState(0);

	const steps = [
		{
			target: '.quickie-greeting',
			content: (
				<div className="flex items-center gap-4 text-base sm:text-lg lg:text-xl p-4 sm:p-6">
					<FontAwesomeIcon icon={faRoute} className="text-lg sm:text-2xl" />
					<p>
						Hello! Meet{' '}
						<span className="font-pbold">{isDarkMode ? 'NightWing' : 'Quickie'}</span>, your
						guide and study assistant! Let’s start our journey!
					</p>
				</div>
			),
			placement: 'bottom',
		},
		{
			target: '.input-methods',
			content: (
				<div className="text-sm sm:text-base flex flex-col gap-3 p-4 sm:p-6">
					<div className="flex items-center gap-2">
						<FontAwesomeIcon icon={faPenToSquare} className="text-base sm:text-xl" />
						<p>
							<strong>Select your input method:</strong> text, documents, or images.
						</p>
					</div>
					<p className="italic">Choose one to begin your study sessions!</p>
				</div>
			),
			placement: 'right',
			spotlightClassName: 'rounded-lg border-2 border-yellow-300 animate-pulse',
		},
		{
			target: '.text-area',
			content: (
				<div className="text-sm sm:text-base flex items-center gap-3 sm:gap-4 p-4 sm:p-6">
					<FontAwesomeIcon icon={faFileAlt} className="text-base sm:text-2xl" />
					<p>
						Enter your content here! This section will change depending on what input type you
						want to generate with. It’s time to make it shine!
					</p>
				</div>
			),
			placement: 'bottom',
			spotlightClassName: 'rounded-lg border-2 border-pink-400 animate-pulse',
		},
		{
			target: '.generate-button',
			content: (
				<div className="text-sm sm:text-base flex items-center gap-3 sm:gap-4 p-4 sm:p-6">
					<FontAwesomeIcon icon={faUpload} className="text-lg sm:text-2xl" />
					<p>
						All set? Click <span className="font-bold">“Generate”</span> to see your study
						materials take shape!
					</p>
				</div>
			),
			placement: 'top',
			spotlightClassName: 'rounded-lg border-2 border-green-400 animate-pulse',
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

	const dispatch = useDispatch();
	const { userInfo } = useSelector((state) => state.auth);

	useEffect(() => {
		dispatch(fetchUserInfo());
		refreshUserStats();
	}, [dispatch]);

	useEffect(() => {
		const hasSeenTour = localStorage.getItem('hasSeenTour');
		if (!hasSeenTour) {
			setRun(true);
			localStorage.setItem('hasSeenTour', 'true');
		}
	}, []);

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

			<Sidebar onToggle={handleSidebarToggle} />

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

				<div className="rounded-lg overflow-hidden">
					{/* Quickie Mascot - Highlighted First */}
					<div className="quickie-greeting">
						<QuickieGreetings />
					</div>

					<div className="input-methods flex flex-col lg:flex-row">
						<div className="w-full lg:w-3/4 p-2">
							{/* Mobile tab selector */}
							<div className="input-methods lg:hidden flex justify-center mb-4 bg-gray-100 dark:bg-dark rounded-lg p-2">
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
										className="w-full h-64 p-4 border border-zinc-300 dark:border-zinc-800 rounded-md  dark:bg-darken dark:text-zinc-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
										placeholder="Paste or type your text here to generate a summary note"
										value={inputText}
										onChange={handleTextChange}
									
									/>
									<div className="mt-2 flex justify-between items-center text-sm">
										<span
											className={`${
												characterCount > 10000 || characterCount < 200
													? 'text-zinc-500'
													: 'text-zinc-700'
											}`}>
											{characterCount}/10000 characters
										</span>
										{textError && (
											<span className="text-red-500 font-medium">{textError}</span>
										)}
									</div>
								</div>
							)}

							{(activeTab === 'documents' || activeTab === 'images') && (
								<div
									className={`file-upload border-2 border-dashed border-zinc-300 dark:border-zinc-800 rounded-lg p-6 text-center ${
										filesToDisplay.length > 0 ? 'h-64 overflow-y-auto' : ''
									} ${isDragOver ? 'bg-zinc-100 dark:bg-darkS' : ''}`}
									onDragOver={handleDragOver}
									onDragEnter={handleDragOver}
									onDragLeave={handleDragLeave}
									onDrop={handleDrop}>
									{isDragOver ? (
										<>
											<FontAwesomeIcon
												icon={faUpload}
												className="text-3xl text-zinc-500 mb-4 animate-bounce"
											/>
											<h2 className="text-lg font-psemibold mb-2 dark:text-zinc-300">
												Drop your files here
											</h2>
										</>
									) : filesToDisplay.length === 0 ? (
										<>
											<FontAwesomeIcon
												icon={faUpload}
												className="text-3xl text-zinc-500 mb-4"
											/>
											<h1 className="text-lg font-semibold mb-2 dark:text-zinc-300">
												Upload from your computer or drag files here
											</h1>
											<p className="text-xs text-zinc-500 mb-4">
												Supported file types:{' '}
												{activeTab === 'images'
													? 'jpg, jpeg, png'
													: 'pdf, doc, docx, ppt, pptx'}
											</p>
											<p className="text-xs text-zinc-400 mb-4">
												Ensure your image/s approximately contains 200 words or more,
												but no more than 10,000 characters, and the file size should not
												exceed 10MB.
											</p>
											<div className="flex justify-center">
												<button
													onClick={triggerFileInput}
													className="px-4 py-2 bg-highlights text-white rounded-md hover:bg-blue-700 dark:bg-darkS transition-colors duration-300 flex items-center">
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
													className="flex items-center justify-between bg-white dark:bg-darkS p-4 rounded-md hover:border hover:cursor-pointer border border-zinc-00 dark:border-zinc-800">
													<span className="text-sm truncate dark:text-zinc-300">
														{file.name}
													</span>
													<button
														onClick={() => handleFileDelete(index)}
														className="text-red-500 hover:text-red-700 dark:text-white dark:hover:text-red-500 ml-2">
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
									className="w-full lg:w-2/3 generate-button"
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

						<div className="input-methods hidden lg:block w-1/4 p-4">
							<div className="space-y-2">
								{['text', 'documents', 'images'].map((tab) => (
									<button
										key={tab}
										onClick={() => handleTabChange(tab)}
										className={`w-full p-4 md:p-6 text-left font-medium ${
											activeTab === tab
												? 'bg-highlights text-secondary dark:bg-darkS'
												: 'bg-white text-zinc-900 dark:bg-zinc-900 dark:text-zinc-300'
										} rounded-md dark:border  dark:border-zinc-800 shadow-sm flex items-center transition-colors duration-200`}>
										<FontAwesomeIcon
											icon={
												tab === 'text'
													? faPenToSquare
													: tab === 'documents'
													? faFileAlt
													: faImage
											}
											className="mr-2 "
										/>
										{tab === 'text' ? 'Input text' : `Upload ${tab}`}
									</button>
								))}
							</div>
						</div>
					</div>
				</div>
				<h2 className="text-2xl font-pbold mb-4 mt-12 text-newTxt dark:text-secondary">
					How to Generate Summary Notes
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
