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
					<div className="px-6 pt-6 pb-4">
						<div className="flex items-center gap-4">
							<div className="p-3 bg-primary/10 dark:bg-primary/20 rounded-xl">
								<FontAwesomeIcon
									icon={faWandMagicSparkles}
									className="text-lg text-primary"
								/>
							</div>
							<div>
								<h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
									Update Study Materials
								</h3>
								<p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
									Choose how to handle your existing materials
								</p>
							</div>
						</div>
					</div>

					{/* Content */}
					<div className="px-6 space-y-5">
						{/* Current Materials Card */}
						<div className="p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl">
							<div className="flex items-start gap-3">
								<FontAwesomeIcon
									icon={faBookOpen}
									className="mt-1 text-zinc-400 dark:text-zinc-500"
								/>
								<div>
									<h4 className="font-medium text-zinc-900 dark:text-zinc-100">
										Current Materials
									</h4>
									<div className="mt-2 space-y-2">
										{quizExists && (
											<div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
												<FontAwesomeIcon
													icon={faLightbulb}
													className="text-primary"
												/>
												<span>Existing Quiz</span>
											</div>
										)}
										{flashcardsExist && (
											<div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
												<FontAwesomeIcon icon={faClone} className="text-primary" />
												<span>Existing Flashcard Set</span>
											</div>
										)}
										{!quizExists && !flashcardsExist && (
											<p className="text-sm text-zinc-500 dark:text-zinc-400">
												No active study materials
											</p>
										)}
									</div>
								</div>
							</div>
						</div>

						{/* Important Note - Redesigned as an info box */}
						<div
							className="px-4 py-3 bg-amber-50/50 dark:bg-amber-900/10 
              border border-amber-200/50 dark:border-amber-700/30 rounded-lg">
							<div className="flex">
								<div>
									<p className="text-sm text-amber-800 dark:text-amber-200">
                                    You've modified the summary content. Your existing study materials may no longer 
                                    align with the updated content.
									</p>
								</div>
							</div>
						</div>

						{/* Action Buttons Section */}
						<div className="py-4 space-y-3">
							<h4 className="font-medium text-sm text-zinc-500 dark:text-zinc-400 mb-2">
								Choose an Action
							</h4>

							{/* Delete Option */}
							<button
								onClick={onSaveWithDelete}
								disabled={isSaving}
								className="w-full flex items-center justify-between p-4
                  bg-indigo-50 hover:bg-indigo-100 
                  dark:bg-indigo-500/10 dark:hover:bg-indigo-500/20
                  border-2 border-indigo-200 dark:border-indigo-500/20
                  rounded-xl transition-all duration-200 group">
								<div className="flex items-center gap-3">
									<div
										className="w-10 h-10 flex items-center justify-center 
                    bg-indigo-100 dark:bg-indigo-500/30 rounded-lg">
										{isSaving ? (
											<div
												className="w-5 h-5 border-2 border-indigo-200 border-t-indigo-600 
                        rounded-full animate-spin"
											/>
										) : (
											<FontAwesomeIcon
												icon={faTimes}
												className="text-lg text-indigo-600 dark:text-indigo-400"
											/>
										)}
									</div>
									<div className="text-left">
										<div className="font-semibold text-indigo-900 dark:text-indigo-300">
											{isSaving
												? 'Deleting Content...'
												: 'Save and Delete Existing Materials'}
										</div>
										<div className="text-sm text-indigo-600/80 dark:text-indigo-400/80">
											Remove current materials to ensure they match the updated summary
										</div>
									</div>
								</div>
								<FontAwesomeIcon
									icon={faArrowRight}
									className="text-indigo-400 group-hover:translate-x-1 transition-transform"
								/>
							</button>

							{/* Keep Option */}
							<button
								onClick={onSaveOnly}
								disabled={isSaving}
								className="w-full flex items-center justify-between p-4
                  bg-zinc-50 hover:bg-zinc-100 
                  dark:bg-zinc-800 dark:hover:bg-zinc-700
                  border border-zinc-200 dark:border-zinc-700
                  rounded-xl transition-all duration-200 group">
								<div className="flex items-center gap-3">
									<div
										className="w-10 h-10 flex items-center justify-center 
                    bg-zinc-100 dark:bg-zinc-700 rounded-lg">
										{isSaving ? (
											<div
												className="w-5 h-5 border-2 border-zinc-300 border-t-zinc-600 
                        rounded-full animate-spin"
											/>
										) : (
											<FontAwesomeIcon
												icon={faSave}
												className="text-lg text-zinc-600 dark:text-zinc-400"
											/>
										)}
									</div>
									<div className="text-left">
										<div className="font-semibold text-zinc-900 dark:text-zinc-100">
											{isSaving
												? 'Saving Changes...'
												: 'Save and Keep Existing Materials'}
										</div>
										<div className="text-sm text-zinc-600 dark:text-zinc-400">
											Preserve current materials even if they may not fully align
										</div>
									</div>
								</div>
								<FontAwesomeIcon
									icon={faArrowRight}
									className="text-zinc-400 group-hover:translate-x-1 transition-transform"
								/>
							</button>
						</div>
					</div>

					{/* Footer */}
					<div className="px-6 py-4 border-t border-zinc-200 dark:border-zinc-800">
						<button
							onClick={onClose}
							disabled={isSaving}
							className="w-full py-2.5 text-sm font-medium 
                text-zinc-600 hover:text-zinc-900 
                dark:text-zinc-400 dark:hover:text-zinc-200
                disabled:opacity-50 disabled:cursor-not-allowed
                transition-colors">
							Cancel
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default SaveConfirmationModal;
