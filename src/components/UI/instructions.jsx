import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileAlt, faImage, faPenToSquare } from '@fortawesome/free-solid-svg-icons';

export const Instructions = () => {
	return (
		<div className="space-y-6 p-4 lg:p-6 bg-white/50 dark:bg-darken backdrop-blur-sm rounded-xl border border-zinc-100 dark:border-zinc-800">
			<div className="text-center sm:text-left">
				<h2 className="text-xl lg:text-2xl font-bold text-zinc-800 dark:text-zinc-100">
					How to Generate Summary Notes
				</h2>
			</div>
			
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
				{/* Input Text Section */}
				<div className="group bg-white dark:bg-dark 
					backdrop-blur-sm rounded-lg sm:rounded-xl
					border border-zinc-100 dark:border-zinc-800
					hover:border-primary/20 dark:hover:border-secondary/20
					transition-all duration-300">
					<div className="p-4 sm:p-5 lg:p-6 space-y-3 sm:space-y-4 lg:space-y-5">
						<h3 className="flex items-center gap-2 sm:gap-3 text-zinc-800 dark:text-zinc-100 
							text-base sm:text-lg font-semibold">
							<strong className="p-2 sm:p-2.5 bg-primary/10 dark:bg-secondary/10 rounded-lg">
								<FontAwesomeIcon 
									icon={faPenToSquare} 
									className="text-primary dark:text-secondary text-base sm:text-lg" 
								/>
							</strong>
							Input Text
						</h3>

						<ol className="space-y-2 sm:space-y-2.5 ml-4 list-decimal 
							text-sm sm:text-base text-zinc-600 dark:text-zinc-300 
							marker:text-primary/70 dark:marker:text-secondary/70">
							<li>
								Select the <strong className="text-zinc-800 dark:text-zinc-100">"Input Text"</strong> tab
							</li>
							<li>Click in the text area</li>
							<li>Type or paste your content</li>
							<li>Ensure text is <strong className="text-zinc-800 dark:text-zinc-100">at least 200 words</strong></li>
							<li>
								Click <strong className="text-zinc-800 dark:text-zinc-100">"Generate"</strong>
							</li>
						</ol>

						<div className="pt-2 border-t border-zinc-100 dark:border-zinc-800">
							<p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
								<strong className="font-medium">Tip:</strong> Use plain text for best results
							</p>
						</div>
					</div>
				</div>

				{/* Upload Documents Section */}
				<div className="group bg-white dark:bg-dark
					backdrop-blur-sm rounded-lg sm:rounded-xl
					border border-zinc-100 dark:border-zinc-800
					hover:border-primary/20 dark:hover:border-secondary/20
					transition-all duration-300">
					<div className="p-4 sm:p-5 lg:p-6 space-y-3 sm:space-y-4 lg:space-y-5">
						<h3 className="flex items-center gap-2 sm:gap-3 text-zinc-800 dark:text-zinc-100 
							text-base sm:text-lg font-semibold">
							<strong className="p-2 sm:p-2.5 bg-primary/10 dark:bg-secondary/10 rounded-lg">
								<FontAwesomeIcon 
									icon={faFileAlt} 
									className="text-primary dark:text-secondary text-base sm:text-lg" 
								/>
							</strong>
							Upload Documents
						</h3>

						<ol className="space-y-2 sm:space-y-2.5 ml-4 list-decimal 
							text-sm sm:text-base text-zinc-600 dark:text-zinc-300 
							marker:text-primary/70 dark:marker:text-secondary/70">
							<li>
								Select <strong className="text-zinc-800 dark:text-zinc-100">"Upload Documents"</strong> tab
							</li>
							<li>
								Click <strong className="text-zinc-800 dark:text-zinc-100">"Choose Files"</strong>
							</li>
							<li>Select one or more documents <strong className="text-zinc-800 dark:text-zinc-100">(PDF, DOCX, PPTX)</strong></li>
							<li>Ensure each document is no larger than <strong className="text-zinc-800 dark:text-zinc-100">under 10MB</strong></li>
							<li>
								Click <strong className="text-zinc-800 dark:text-zinc-100">"Generate"</strong>
							</li>
						</ol>

						<div className="pt-2 border-t border-zinc-100 dark:border-zinc-800">
							<p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
								<strong className="font-medium">Note:</strong> Multi-file uploads can increase processing time.
							</p>
						</div>
					</div>
				</div>

				{/* Upload Images Section */}
				<div className="group bg-white dark:bg-dark 
					backdrop-blur-sm rounded-lg sm:rounded-xl
					border border-zinc-100 dark:border-zinc-800
					hover:border-primary/20 dark:hover:border-secondary/20
					transition-all duration-300">
					<div className="p-4 sm:p-5 lg:p-6 space-y-3 sm:space-y-4 lg:space-y-5">
						<h3 className="flex items-center gap-2 sm:gap-3 text-zinc-800 dark:text-zinc-100 
							text-base sm:text-lg font-semibold">
							<strong className="p-2 sm:p-2.5 bg-primary/10 dark:bg-secondary/10 rounded-lg">
								<FontAwesomeIcon 
									icon={faImage} 
									className="text-primary dark:text-secondary text-base sm:text-lg" 
								/>
							</strong>
							Upload Images
						</h3>

						<ol className="space-y-2 sm:space-y-2.5 ml-4 list-decimal 
							text-sm sm:text-base text-zinc-600 dark:text-zinc-300 
							marker:text-primary/70 dark:marker:text-secondary/70">
							<li>
								Select <strong className="text-zinc-800 dark:text-zinc-100">"Upload Images"</strong> tab
							</li>
							<li>
								Click <strong className="text-zinc-800 dark:text-zinc-100">"Choose Files"</strong> or drag and drop images into the space provided.
							</li>
							<li>Upload images <strong className="text-zinc-800 dark:text-zinc-100">(JPG, PNG, JPEG)</strong></li>
							<li>Ensure each image is <strong className="text-zinc-800 dark:text-zinc-100">under 10MB</strong></li>
							<li>
								Click <strong className="text-zinc-800 dark:text-zinc-100">"Generate"</strong>
							</li>
						</ol>

						<div className="pt-2 border-t border-zinc-100 dark:border-zinc-800">
							<p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
								<strong className="font-medium">Tip:</strong> For best results, use clear, high-quality images of your notes or documents.
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
