import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileAlt, faImage, faPenToSquare } from '@fortawesome/free-solid-svg-icons';

export const Instructions = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {/* Input Text Section */}
      <div className="bg-white dark:bg-darken rounded-lg shadow-lg p-6 border-t-4 border-blue-400 hover:shadow-2xl transition-shadow duration-300">
        <h3 className="font-pmedium text-xl mb-4 flex items-center text-primary">
          <div className="text-primary dark:text-blue-300 p-2 rounded-full mr-3">
            <FontAwesomeIcon icon={faPenToSquare} />
          </div>
          Input Text
        </h3>
        <ol className="font-pregular text-gray-700 dark:text-gray-300 list-decimal list-inside space-y-2 pl-4">
          <li>Select the <span className="font-pbold">"Input Text"</span> tab on the right.</li>
          <li>Click in the text area below.</li>
          <li>Type or paste your content.</li>
          <li>Ensure your text is at least 200 words for accurate summarization.</li>
          <li>Click the <span className="font-pbold">"Generate"</span> button when you're ready.</li>
        </ol>
        <p className="font-pregular text-sm text-primary mt-4 italic">
          <strong>Tip:</strong> Use plain text for best results.
        </p>
      </div>

      {/* Upload Documents Section */}
      <div className="bg-white dark:bg-darken rounded-lg shadow-lg p-6 border-t-4 border-green-400 hover:shadow-2xl transition-shadow duration-300">
        <h3 className="font-pmedium text-xl mb-4 flex items-center text-green-600 dark:text-green-300">
          <div className="text-green-500 dark:text-green-300 p-2 rounded-full mr-3">
            <FontAwesomeIcon icon={faFileAlt} />
          </div>
          Upload Documents
        </h3>
        <ol className="font-pregular text-gray-700 dark:text-gray-300 list-decimal list-inside space-y-2 pl-4">
          <li>Click the <span className="font-pbold">"Upload Documents"</span> tab on the right.</li>
          <li>Press <span className="font-pbold">"Choose Files"</span> to browse and select your document.</li>
          <li>Select one or more documents (e.g., DOCX, PDF, PPTX).</li>
          <li>Ensure each document is no larger than 10MB.</li>
          <li>Click <span className="font-pbold">"Generate"</span> to process your documents.</li>
        </ol>
        <p className="font-pregular text-sm text-green-600 dark:text-green-400 mt-4 italic">
          <strong>Note:</strong> Multi-file uploads can increase processing time.
        </p>
      </div>

      {/* Upload Images Section */}
      <div className="bg-white dark:bg-darken rounded-lg shadow-lg p-6 border-t-4 border-purple-400 hover:shadow-2xl transition-shadow duration-300">
        <h3 className="font-pmedium text-xl mb-4 flex items-center text-purple-600 dark:text-purple-300">
          <div className="text-purple-500 dark:text-purple-300 p-2 rounded-full mr-3">
            <FontAwesomeIcon icon={faImage} />
          </div>
          Upload Images
        </h3>
        <ol className="font-pregular text-gray-700 dark:text-gray-300 list-decimal list-inside space-y-2 pl-4">
          <li>Select the <span className="font-pbold">"Upload Images"</span> tab on the right.</li>
          <li>Click <span className="font-pbold">"Choose Files"</span> or drag and drop images into the space provided.</li>
          <li>Choose one or more images (supported formats: JPG, PNG, JPEG).</li>
          <li>Ensure each image is under 10MB for optimal processing.</li>
          <li>Press <span className="font-pbold">"Generate"</span> to begin the summarization.</li>
        </ol>
        <p className="font-pregular text-sm text-purple-600 dark:text-purple-400 mt-4 italic">
          <strong>Tip:</strong> For best results, use clear, high-quality images of your notes or documents.
        </p>
      </div>
    </div>
  );
};
