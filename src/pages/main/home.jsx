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
	faExclamationCircle,
	faInfoCircle,
	faTimesCircle,
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
import CustomModal from '../../components/CustomModal/CustomModal';

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
	const [modalContent, setModalContent] = useState({ title: '', message: '', type: '' });
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
			disableBeacon: true,
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
			disableBeacon: true,
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
			disableBeacon: true,
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

		const hasSeenTour = localStorage.getItem('hasSeenTour');
		if (!hasSeenTour) {
			setTimeout(() => {
				setStepIndex(0);
				setRun(true);
				localStorage.setItem('hasSeenTour', 'true');
			}, 500);
		}
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
		const words = text.split(/\s+/).filter(Boolean).length;
		setWordCount(words);

		if (text.length === 0) {
			setTextError('Text input cannot be empty.');
		} else if (words < 200) {
			setTextError('Text must be at least 200 words long.');
		} else if (text.length > 14000) {
			setTextError('Text cannot exceed 14000 characters.');
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

	const [modalState, setModalState] = useState({
		isOpen: false,
		title: '',
		message: '',
		type: 'error',
	});

	const showErrorModal = (title, message, type = 'error') => {
		setLoading(false);
		setModalState({
			isOpen: true,
			title,
			message,
			type,
		});
	};

	const handleCloseModal = () => {
		setModalState((prev) => ({
			...prev,
			isOpen: false,
		}));
	};

	const handleGenerate = async () => {
		setLoading(true);

		try {
			if (activeTab === 'text') {
				if (wordCount < 200) {
					showErrorModal(
						'Insufficient Content',
						'Your text must contain at least 200 words for proper summarization.',
						'warning'
					);
					return;
				}
				if (characterCount > 14000) {
					showErrorModal(
						'Content Too Long',
						'Your text exceeds the 10,000 character limit. Please reduce the content length.',
						'warning'
					);
					return;
				}

				const data = {
					notecontents: inputText,
					user: userInfo.id,
				};

				const response = await generateSummary(data);
				refreshUserStats();
				if (response && response.id) {
					navigate(`/Notes/${response.id}`);
				}
			} else if (activeTab === 'images' || activeTab === 'documents') {
				const filesToProcess = activeTab === 'images' ? uploadedImages : uploadedDocuments;

				if (filesToProcess.length === 0) {
					showErrorModal(
						'No Files Selected',
						`Please upload at least one ${
							activeTab === 'images' ? 'image' : 'document'
						} to proceed.`,
						'warning'
					);
					setLoading(false);
					return;
				}

				try {
					const response = await generateSummaryFromImages(
						filesToProcess,
						navigate,
						userInfo.id
					);
					if (response && response.id) {
						refreshUserStats();
						navigate(`/Notes/${response.id}`);
					}
				} catch (error) {
					console.error('Processing error:', error);

					const errorCode = error.code || 'UNKNOWN_ERROR';

					switch (errorCode) {
						case 'NO_TEXT_DETECTED':
							showErrorModal(
								'No Text Detected',
								'No readable text was found in your uploaded file(s). Please ensure your files contain clear, visible text.',
								'warning'
							);
							break;
						case 'INSUFFICIENT_WORDS':
							showErrorModal(
								'Insufficient Content',
								'The detected text contains fewer than 200 words. Please upload files with more text content.',
								'warning'
							);
							break;
						case 'CONTENT_TOO_LONG':
							showErrorModal(
								'Content Too Long',
								'The detected text exceeds 10,000 characters. Please upload files with less text content.',
								'warning'
							);
							break;
					
						case 'TIMEOUT':
							showErrorModal(
								'Processing Timeout',
								'The document processing took too long. Please try with a smaller document or ensure your internet connection is stable.',
								'error'
							);
							break;
						case 'FILE_TOO_LARGE':
							showErrorModal(
								'File Too Large',
								'The document is too large to process. Please try with a smaller file (under 10MB) or split it into multiple parts.',
								'warning'
							);
							break;
						default:
							showErrorModal(
								'Processing Error',
								'An error occurred while processing your files. Please try again with different files.',
								'error'
							);
					}
					setLoading(false);
					return;
				}
			} else if (activeTab === 'documents') {
				const filesToProcess = uploadedDocuments;

				if (filesToProcess.length === 0) {
					showErrorModal(
						'No Files Selected',
						'Please upload at least one document to proceed.',
						'warning'
					);
					return;
				}

				try {
					const response = await generateSummaryFromImages(
						filesToProcess,
						navigate,
						userInfo.id
					);

					if (!response) {
						showErrorModal(
							'Processing Error',
							'The uploaded content could not be processed. Please ensure you have strong internet connection and try again.',
							'error'
						);
						return;
					}

					refreshUserStats();
					navigate(`/Notes/${response.id}`);
				} catch (error) {
					// Handle specific ConvertAPI errors
					switch (error.code) {
						case 'TIMEOUT':
							showErrorModal(
								'Processing Timeout',
								'The document processing took too long. Please try with a smaller document or ensure your internet connection is stable.',
								'error'
							);
							break;
						case 'FILE_TOO_LARGE':
							showErrorModal(
								'File Too Large',
								'The document is too large to process. Please try with a smaller file (under 10MB) or split it into multiple parts.',
								'warning'
							);
							break;
						default:
							if (error.response?.status === 400) {
								showErrorModal(
									'Something Went Wrong',
									"The document could not be processed. Please ensure you have a strong internet connection and try again.",
									'error'
								);
							} else if (error.response?.status === 500) {
								showErrorModal(
									'Service Error',
									'Our document processing service is currently experiencing issues. Please try again later.',
									'error'
								);
							} else {
								showErrorModal(
									'Processing Error',
									'An unexpected error occurred while processing your document. Please try again or use a different file.',
									'error'
								);
							}
					}
				}
			}
		} catch (error) {
			console.error('Error generating summary:', error);

			let errorTitle = 'Error';
			let errorMessage = 'An unexpected error occurred. Please try again later.';

			if (error.response) {
				switch (error.response.status) {
					case 400:
						errorTitle = 'Invalid Request';
						errorMessage =
							'The content could not be processed. Please check your connection and try again.';
						break;
					case 413:
						errorTitle = 'Content Too Large';
						errorMessage =
							'The uploaded content exceeds our processing limits. Please try with smaller files.';
						break;
					case 500:
						errorTitle = 'Service Unavailable';
						errorMessage =
							'Our services are temporarily unavailable. Please try again later.';
						break;
				}
			}

			showErrorModal(errorTitle, errorMessage, 'error');
		} finally {
			setLoading(false);
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
				disableBeacon={true}
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
				className={`transition-all duration-300 flex-grow p-2 lg:p-4 mt-16 lg:mt-0 ${
					sidebarExpanded ? 'lg:ml-72' : 'lg:ml-28'
				}`}>
				<button
					onClick={handleResetTour}
					className="fixed bottom-4 z-50 right-4 flex items-center space-x-2 bg-highlights dark:bg-darkS text-white px-4 py-2 rounded-full shadow-lg hover:scale-105 transition-transform"
					title="Reset Tour">
					<FontAwesomeIcon icon={faRoute} />
					<span className="hidden sm:inline-block text-white font-semibold">Take a Tour</span>
				</button>

				<div className="rounded-lg overflow-hidden">
					<div className="quickie-greeting mb-2">
						<QuickieGreetings />
					</div>

					<div className="bg-white/50 mb-4 dark:bg-zinc-800/50 backdrop-blur-sm rounded-xl border border-zinc-100 dark:border-zinc-800 p-3 xs:p-4 sm:p-5">
						<div className="input-methods flex flex-col lg:flex-row gap-4 lg:gap-6">
							{/* Main Input Area */}
							<div className="w-full lg:w-3/4">
								{/* Mobile Tab Selector - Improved */}
								<div className="lg:hidden mb-4">
									<div className="flex justify-between gap-2 bg-gray-50 dark:bg-dark p-1.5 rounded-xl">
										{['text', 'documents', 'images'].map((tab) => (
											<button
												key={tab}
												onClick={() => handleTabChange(tab)}
												className={`flex-1 py-2.5 px-3 ${
													activeTab === tab
														? 'bg-highlights dark:bg-darkS text-white shadow-sm'
														: 'bg-white dark:bg-darken dark:text-zinc-300'
												} rounded-lg flex items-center justify-center gap-2 transition-all duration-200`}>
												<FontAwesomeIcon
													icon={
														tab === 'text'
															? faPenToSquare
															: tab === 'documents'
															? faFileAlt
															: faImage
													}
													className="text-base"
												/>
												<span className="hidden xs:inline text-sm font-medium">
													{tab === 'text' ? 'Text' : tab}
												</span>
											</button>
										))}
									</div>
								</div>

								{/* Text Input Area - Improved */}
								{activeTab === 'text' && (
									<div className="w-full space-y-2">
										<textarea
											className="w-full h-[200px] xs:h-[250px] sm:h-[300px] md:h-[250px] p-4 
											rounded-xl bg-white/50 dark:bg-zinc-900/50  border border-zinc-200 dark:border-zinc-800
											shadow-sm dark:text-zinc-200 
											focus:ring-2 focus:ring-primary/50 dark:focus:ring-secondary/50 
											focus:border-primary/50 dark:focus:border-secondary/50 
											transition-all placeholder:text-zinc-400 text-base"
											placeholder="Paste or type your text here to generate a summary note"
											value={inputText}
											onChange={handleTextChange}
										/>
										<div className="flex justify-between items-center px-1 text-sm">
											<span
												className={`${
													characterCount > 14000 || characterCount < 200
														? 'text-zinc-500'
														: 'text-zinc-500 dark:text-zinc-400'
												}`}>
												{characterCount}/14000 characters
											</span>
											{textError && (
												<span className="text-red-500 font-medium">{textError}</span>
											)}
										</div>
									</div>
								)}

								{/* File Upload Areas - Improved */}
								{(activeTab === 'images' || activeTab === 'documents') && (
									<div
										className={`file-upload 
										h-[200px] xs:h-[250px] sm:h-[300px] md:h-[250px] 
										border-2 border-dashed border-zinc-300 dark:border-zinc-700 
										rounded-xl p-4 sm:p-6 text-center
										bg-white/50 dark:bg-zinc-900/50 
										${filesToDisplay.length > 0 ? 'overflow-y-auto' : ''}
										${isDragOver ? 'bg-primary/5 dark:bg-secondary/5 border-primary dark:border-secondary' : ''}`}
										onDragOver={handleDragOver}
										onDragEnter={handleDragOver}
										onDragLeave={handleDragLeave}
										onDrop={handleDrop}>
										{isDragOver ? (
											<div className="h-full flex flex-col items-center justify-center">
												<FontAwesomeIcon
													icon={faUpload}
													className="text-4xl text-primary dark:text-secondary mb-4 animate-bounce"
												/>
												<h2 className="text-lg font-medium dark:text-zinc-300">
													Drop your {activeTab} here
												</h2>
											</div>
										) : filesToDisplay.length === 0 ? (
											<div className="h-full flex flex-col items-center justify-center">
												<FontAwesomeIcon
													icon={faUpload}
													className="text-3xl text-zinc-400 mb-4"
												/>
												<h1 className="text-lg font-medium mb-2 dark:text-zinc-300">
													Upload or drag {activeTab} here
												</h1>
												<p className="text-sm text-zinc-500 mb-2">
													Supported types:{' '}
													{activeTab === 'images'
														? 'jpg, jpeg, png'
														: 'pdf, doc, docx, ppt, pptx'}
												</p>
												<p className="text-xs text-zinc-400 mb-6 max-w-md">
													<strong>Files</strong> or <strong>Images</strong> should
													contain 200+ words but not exceed 10,000 characters. Max
													size: 10MB
												</p>
												<button
													onClick={triggerFileInput}
													className="px-6 py-2.5 bg-highlights dark:bg-darkS text-white 
													rounded-lg hover:bg-primary/90 dark:hover:bg-secondary/90 
													transition-colors duration-200 flex items-center gap-2">
													<FontAwesomeIcon icon={faUpload} />
													<span>Choose {activeTab}</span>
												</button>
											</div>
										) : (
											<div className="space-y-2">
												{filesToDisplay.map((file, index) => (
													<div
														key={index}
														className="flex items-center justify-between bg-white dark:bg-darkS 
														p-3 rounded-lg border border-zinc-100 dark:border-zinc-800 
														hover:border-primary/50 dark:hover:border-secondary/50 
														transition-colors duration-200">
														<span className="text-sm truncate dark:text-zinc-300 flex-1 text-left">
															{file.name}
														</span>
														<button
															onClick={() => handleFileDelete(index)}
															className="ml-2 p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 
															rounded-md transition-colors duration-200">
															<FontAwesomeIcon icon={faTimes} />
														</button>
													</div>
												))}
											</div>
										)}
									</div>
								)}

								{/* Error Message */}
								{fileError && (
									<div className="mt-2 text-red-500 flex items-center text-sm px-1">
										<FontAwesomeIcon icon={faExclamationTriangle} className="mr-2" />
										{fileError}
									</div>
								)}

								{/* Hidden File Input */}
								<input
									ref={fileInputRef}
									type="file"
									multiple
									accept={
										activeTab === 'images'
											? '.jpg,.jpeg,.png'
											: '.pdf,.doc,.docx,.ppt,.pptx'
									}
									onChange={handleFileUpload}
									className="hidden"
								/>

								{/* Generate Button */}
								<div className="mt-4 sm:mt-6 generate-button">
									<Button
										onClick={handleGenerate}
										className="w-full py-3 text-base font-medium rounded-xl"
										disabled={
											(activeTab === 'text' &&
												(wordCount < 200 || characterCount > 14000)) ||
											(activeTab === 'documents' && uploadedDocuments.length === 0) ||
											(activeTab === 'images' && uploadedImages.length === 0)
										}>
										Generate
									</Button>
								</div>
							</div>

							{/* Desktop Tab Buttons */}
							<div className="hidden lg:block w-1/4">
								<div className="space-y-2">
									{['text', 'documents', 'images'].map((tab) => (
										<button
											key={tab}
											onClick={() => handleTabChange(tab)}
											className={`w-full p-6 text-base font-medium 
											${
												activeTab === tab
													? 'bg-highlights text-white dark:bg-darkS'
													: 'bg-white/80 dark:bg-zinc-900/80 text-zinc-900 dark:text-zinc-300'
											} 
											rounded-xl border border-zinc-100 dark:border-zinc-800
											shadow-sm backdrop-blur-sm
											flex items-center gap-3 transition-all duration-200
											hover:scale-[1.02]`}>
											<FontAwesomeIcon
												icon={
													tab === 'text'
														? faPenToSquare
														: tab === 'documents'
														? faFileAlt
														: faImage
												}
											/>
											{tab === 'text' ? 'Input text' : `Upload ${tab}`}
										</button>
									))}
								</div>
							</div>
						</div>
					</div>
				</div>

				<Instructions />
				{loading && <NotesLoadingScreen />}
				<CustomModal
					isOpen={modalState.isOpen}
					onClose={handleCloseModal}
					title={modalState.title}
					message={modalState.message}
					type={modalState.type}
				/>
			</main>
		</div>
	);
}
