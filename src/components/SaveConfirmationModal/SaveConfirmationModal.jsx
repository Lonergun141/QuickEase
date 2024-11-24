import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	faBookOpen,
	faFire,
	faWandMagicSparkles,
	faTimes,
	faSave,
	faArrowRight,
	faLightbulb,
	faClone,
	faXmark,
} from '@fortawesome/free-solid-svg-icons';

const SaveConfirmationModal = ({
	isOpen,
	onClose,
	onSaveWithDelete,
	onSaveOnly,
	quizExists,
	flashcardsExist,
	isSaving,
}) => {
	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 z-50 overflow-y-auto">
			<div
				className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
				onClick={onClose}
			/>

			<div className="relative min-h-screen flex items-center justify-center p-4">
				<div
					className="relative w-full max-w-lg bg-white dark:bg-zinc-900 
          rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800">
					{/* Header */}
					<div className="px-6 pt-6 pb-4 border-b border-zinc-200 dark:border-zinc-800">
						<div className="flex items-center gap-4">
							<div className="p-3 bg-primary/10 dark:bg-primary/20 rounded-xl">
								<FontAwesomeIcon
									icon={faWandMagicSparkles}
									className="text-xl text-primary"
								/>
							</div>
							<div>
								<h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
									Update Study Materials
								</h3>
								<p className="mt-1.5 text-base text-zinc-500 dark:text-zinc-400">
									Choose how to handle your existing materials
								</p>
							</div>
						</div>
					</div>

					{/* Content */}
					<div className="p-6 space-y-6">
						{/* Important Note */}
						<div className="flex gap-3 p-4 bg-amber-50 dark:bg-amber-900/10 
							border border-amber-200 dark:border-amber-700/30 rounded-xl">
							<FontAwesomeIcon 
								icon={faFire} 
								className="mt-1 text-amber-600 dark:text-amber-500" 
							/>
							<p className="text-sm leading-relaxed text-amber-800 dark:text-amber-200">
								You've modified the summary content. Your existing study materials may no longer 
								align with the updated content.
							</p>
						</div>

						{/* Action Buttons Section */}
						<div className="space-y-4">
							<h4 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
								Choose an Action
							</h4>
							
							{/* Delete Option */}
							<button
								onClick={onSaveWithDelete}
								disabled={isSaving}
								className="w-full p-5 text-left
									bg-indigo-50 hover:bg-indigo-100 
									dark:bg-indigo-500/10 dark:hover:bg-indigo-500/20
									border-2 border-indigo-200 dark:border-indigo-500/20
									rounded-xl transition-all duration-200 group relative"
							>
								<div className="space-y-1.5">
									<div className="text-lg font-semibold text-indigo-900 dark:text-indigo-300">
										{isSaving ? 'Deleting Content...' : 'Save and Delete Existing Materials'}
									</div>
									<div className="text-sm text-indigo-600/80 dark:text-indigo-400/80">
										Remove current materials to ensure they match the updated summary
									</div>
								</div>
								
								{/* Arrow indicator */}
								<div className="absolute right-5 top-1/2 -translate-y-1/2">
									<FontAwesomeIcon 
										icon={faArrowRight} 
										className="text-lg text-indigo-400 group-hover:translate-x-1 transition-transform" 
									/>
								</div>
							</button>

							{/* Keep Option */}
							<button
								onClick={onSaveOnly}
								disabled={isSaving}
								className="w-full p-5 text-left
									bg-zinc-50 hover:bg-zinc-100 
									dark:bg-zinc-800 dark:hover:bg-zinc-700
									border border-zinc-200 dark:border-zinc-700
									rounded-xl transition-all duration-200 group relative"
							>
								<div className="space-y-1.5">
									<div className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
										{isSaving ? 'Saving Changes...' : 'Save and Keep Existing Materials'}
									</div>
									<div className="text-sm text-zinc-600 dark:text-zinc-400">
										Preserve current materials even if they may not fully align
									</div>
								</div>

								{/* Arrow indicator */}
								<div className="absolute right-5 top-1/2 -translate-y-1/2">
									<FontAwesomeIcon 
										icon={faArrowRight} 
										className="text-lg text-zinc-400 group-hover:translate-x-1 transition-transform" 
									/>
								</div>
							</button>
						</div>
					</div>

					{/* Footer */}
					<div className="px-6 py-4 border-t border-zinc-200 dark:border-zinc-800">
						<button
							onClick={onClose}
							disabled={isSaving}
							className="w-full py-3 text-sm font-medium 
								text-zinc-600 hover:text-zinc-900 
								dark:text-zinc-400 dark:hover:text-zinc-200
									disabled:opacity-50 disabled:cursor-not-allowed
									transition-colors"
						>
							Cancel
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default SaveConfirmationModal;
