import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
	const renderPaginationButtons = () => {
		const buttons = [];
		const maxButtons = 5;

		if (totalPages <= maxButtons) {
			for (let i = 1; i <= totalPages; i++) {
				buttons.push(
					<button
						key={i}
						onClick={() => onPageChange(i)}
						className={`
							min-w-[40px] h-10 flex items-center justify-center rounded-lg
							text-sm font-medium transition-all duration-200
							${currentPage === i 
								? 'bg-primary/10 text-primary border-2 border-primary dark:bg-secondary/10 dark:text-secondary dark:border-secondary' 
								: 'text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800'
							}
						`}
					>
						{i}
					</button>
				);
			}
		} else {
			// First page button
			buttons.push(
				<button
					key={1}
					onClick={() => onPageChange(1)}
					className={`
						min-w-[40px] h-10 flex items-center justify-center rounded-lg
						text-sm font-medium transition-all duration-200
						${currentPage === 1 
							? 'bg-primary/10 text-primary border-2 border-primary dark:bg-secondary/10 dark:text-secondary dark:border-secondary' 
							: 'text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800'
						}
					`}
				>
					1
				</button>
			);

			if (currentPage > 3) {
				buttons.push(
					<span key="dots1" className="flex items-center justify-center w-10 h-10">
						<span className="w-8 h-8 flex items-center justify-center rounded-lg bg-zinc-50 dark:bg-zinc-800">
							···
						</span>
					</span>
				);
			}

			const start = Math.max(2, currentPage - 1);
			const end = Math.min(totalPages - 1, currentPage + 1);

			for (let i = start; i <= end; i++) {
				buttons.push(
					<button
						key={i}
						onClick={() => onPageChange(i)}
						className={`
							min-w-[40px] h-10 flex items-center justify-center rounded-lg
							text-sm font-medium transition-all duration-200
							${currentPage === i 
								? 'bg-primary/10 text-primary border-2 border-primary dark:bg-secondary/10 dark:text-secondary dark:border-secondary' 
								: 'text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800'
							}
						`}
					>
						{i}
					</button>
				);
			}

			if (currentPage < totalPages - 2) {
				buttons.push(
					<span key="dots2" className="flex items-center justify-center w-10 h-10">
						<span className="w-8 h-8 flex items-center justify-center rounded-lg bg-zinc-50 dark:bg-zinc-800">
							···
						</span>
					</span>
				);
			}

			// Last page button
			buttons.push(
				<button
					key={totalPages}
					onClick={() => onPageChange(totalPages)}
					className={`
						min-w-[40px] h-10 flex items-center justify-center rounded-lg
						text-sm font-medium transition-all duration-200
						${currentPage === totalPages 
							? 'bg-primary/10 text-primary border-2 border-primary dark:bg-secondary/10 dark:text-secondary dark:border-secondary' 
							: 'text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800'
						}
					`}
				>
					{totalPages}
				</button>
			);
		}

		return buttons;
	};

	return (
		<div className="flex flex-col items-center gap-4 mt-8">
			<div className="flex items-center gap-2">
				{/* Previous Button */}
				<button
					disabled={currentPage === 1}
					onClick={() => onPageChange(currentPage - 1)}
					className={`
						flex items-center gap-2 px-4 h-10 rounded-lg text-sm font-medium
						transition-all duration-200
						${currentPage === 1
							? 'opacity-50 cursor-not-allowed bg-zinc-100 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-500'
							: 'text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800'
						}
					`}
				>
					<svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
						<path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
					</svg>
					<span className="hidden sm:inline">Previous</span>
				</button>

				{/* Page Numbers */}
				<div className="flex items-center gap-2">
					{renderPaginationButtons()}
				</div>

				{/* Next Button */}
				<button
					disabled={currentPage === totalPages}
					onClick={() => onPageChange(currentPage + 1)}
					className={`
						flex items-center gap-2 px-4 h-10 rounded-lg text-sm font-medium
						transition-all duration-200
						${currentPage === totalPages
							? 'opacity-50 cursor-not-allowed bg-zinc-100 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-500'
							: 'text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800'
						}
					`}
				>
					<span className="hidden sm:inline">Next</span>
					<svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
						<path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
					</svg>
				</button>
			</div>

			{/* Page Info */}
			<div className="text-sm text-zinc-500 dark:text-zinc-400">
				Page {currentPage} of {totalPages}
			</div>
		</div>
	);
};

export default Pagination;
