import React from 'react';

export const Instructions = () => {
	return (
		<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
			<div className="bg-white dark:bg-darken rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
				<h3 className="font-pmedium text-lg mb-2 dark:text-secondary">Input Text</h3>
				<ol className="text-gray-600 dark:text-gray-400 list-decimal list-inside space-y-2">
					<li>Select the "Input text" tab</li>
					<li>Click on the text area</li>
					<li>Type or paste your text</li>
					<li>Ensure your text has 100 words (500 characters)</li>
					<li>Click "Generate" when you're ready</li>
				</ol>
			</div>

			<div className="bg-white dark:bg-darken rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
				<h3 className="font-pmedium text-lg mb-2 dark:text-secondary">Upload Documents</h3>
				<ul className="text-gray-600 dark:text-gray-400 list-disc list-inside space-y-2">
					<li>Choose the "Upload documents" tab</li>
					<li>Click "Choose Files"</li>
					<li>Select one or multiple files (docx, pdf, pptx)</li>
					<li>Each file should be under 10MB</li>
					<li>Click "Generate" to process your documents</li>
				</ul>
			</div>

			<div className="bg-white  dark:bg-darken rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
				<h3 className="font-pmedium text-lg mb-2 dark:text-secondary">Upload Images</h3>
				<ol className="text-gray-600 dark:text-gray-400 list-decimal list-inside space-y-2">
					<li>Select the "Upload images" tab</li>
					<li>Click "Choose Files" or drag and drop</li>
					<li>Pick one or multiple images (jpg, png, gif)</li>
					<li>Ensure each image is under 10MB</li>
					<li>Click "Generate" to process your images</li>
				</ol>
			</div>
		</div>
	);
};
