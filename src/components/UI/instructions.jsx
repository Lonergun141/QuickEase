import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileAlt, faImage, faPenToSquare } from '@fortawesome/free-solid-svg-icons';

export const Instructions = () => {
	return (
		<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
			{/* Input Text Section */}
			<div className="bg-white dark:bg-darken rounded-lg shadow-md p-6 border border-zinc-300 dark:border-zinc-800 hover:shadow-lg transition-shadow duration-300">
				<h3 className=" text-lg font-bold mb-4 flex items-center text-zinc-900 dark:text-zinc-100">
					<div className="text-zinc-800 dark:text-zinc-300 p-2 rounded-full mr-3">
						<FontAwesomeIcon icon={faPenToSquare} />
					</div>
					Input Text
				</h3>
				<ol className=" text-zinc-700 dark:text-zinc-300 list-decimal list-inside space-y-2 pl-4">
					<li>
						Select the <span className="font-bold">"Input Text"</span> tab on the right.
					</li>
					<li>Click in the text area below.</li>
					<li>Type or paste your content.</li>
					<li>Ensure your text is at least 200 words for accurate summarization.</li>
					<li>
						Click the <span className="font-bold">"Generate"</span> button when you're ready.
					</li>
				</ol>
				<p className="text-sm text-zinc-600 dark:text-zinc-400 mt-4 italic">
					<strong>Tip:</strong> Use plain text for best results.
				</p>
			</div>

			{/* Upload Documents Section */}
			<div className="bg-white dark:bg-darken rounded-lg shadow-md p-6 border border-zinc-300 dark:border-zinc-800 hover:shadow-lg transition-shadow duration-300">
				<h3 className=" text-lg mb-4 font-bold flex items-center text-zinc-900 dark:text-zinc-100">
					<div className="text-zinc-800 dark:text-zinc-300 p-2 rounded-full mr-3">
						<FontAwesomeIcon icon={faFileAlt} />
					</div>
					Upload Documents
				</h3>
				<ol className=" text-zinc-700 dark:text-zinc-300 list-decimal list-inside space-y-2 pl-4">
					<li>
						Click the <span className="font-bold">"Upload Documents"</span> tab on the right.
					</li>
					<li>
						Press <span className="font-bold">"Choose Files"</span> to browse and select your
						document.
					</li>
					<li>Select one or more documents (e.g., DOCX, PDF, PPTX).</li>
					<li>Ensure each document is no larger than 10MB.</li>
					<li>
						Click <span className="font-bold">"Generate"</span> to process your documents.
					</li>
				</ol>
				<p className=" text-sm text-zinc-600 dark:text-zinc-400 mt-4 italic">
					<strong>Note:</strong> Multi-file uploads can increase processing time.
				</p>
			</div>

			{/* Upload Images Section */}
			<div className="bg-white dark:bg-darken rounded-lg shadow-md p-6 border border-zinc-300 dark:border-zinc-800 hover:shadow-lg transition-shadow duration-300">
				<h3 className=" text-lg mb-4 font-bold flex items-center text-zinc-900 dark:text-zinc-100">
					<div className="text-zinc-800 dark:text-zinc-300 p-2 rounded-full mr-3">
						<FontAwesomeIcon icon={faImage} />
					</div>
					Upload Images
				</h3>
				<ol className=" text-zinc-700 dark:text-zinc-300 list-decimal list-inside space-y-2 pl-4">
					<li>
						Select the <span className="font-bold">"Upload Images"</span> tab on the right.
					</li>
					<li>
						Click <span className="font-bold">"Choose Files"</span> or drag and drop images
						into the space provided.
					</li>
					<li>Choose one or more images (supported formats: JPG, PNG, JPEG).</li>
					<li>Ensure each image is under 10MB for optimal processing.</li>
					<li>
						Press <span className="font-bold">"Generate"</span> to begin the summarization.
					</li>
				</ol>
				<p className=" text-sm text-zinc-600 dark:text-zinc-400 mt-4 italic">
					<strong>Tip:</strong> For best results, use clear, high-quality images of your notes
					or documents.
				</p>
			</div>
		</div>
	);
};
