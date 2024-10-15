import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
	const renderPaginationButtons = () => {
		const buttons = [];
		const maxButtons = 5; // Number of visible buttons

		if (totalPages <= maxButtons) {
			for (let i = 1; i <= totalPages; i++) {
				buttons.push(
					<button
						key={i}
						onClick={() => onPageChange(i)}
						className={`px-2 py-1 sm:px-4 sm:py-2 mx-1 rounded-md transition-colors duration-200 text-xs sm:text-base ${
							currentPage === i
								? 'bg-primary text-white font-semibold dark:bg-darkS'
								: 'bg-secondary hover:bg-primary text-naeg dark:bg-darken dark:hover:bg-naeg dark:text-white'
						}`}
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
					className={`px-2 py-1 sm:px-4 sm:py-2 mx-1 rounded-md transition-colors duration-200 text-xs sm:text-base ${
						currentPage === 1
							? 'bg-primary text-white font-semibold dark:bg-darkS'
							: 'bg-secondary hover:bg-primary text-highlights dark:bg-darken dark:hover:bg-darkS dark:text-white'
					}`}
				>
					1
				</button>
			);

			if (currentPage > 3) {
				// Dots if pages are skipped
				buttons.push(
					<span key="dots1" className="px-2 py-1 text-gray-400 dark:text-gray-500 text-xs sm:text-base">...</span>
				);
			}

			const start = Math.max(2, currentPage - 1);
			const end = Math.min(totalPages - 1, currentPage + 1);

			for (let i = start; i <= end; i++) {
				buttons.push(
					<button
						key={i}
						onClick={() => onPageChange(i)}
						className={`px-2 py-1 sm:px-4 sm:py-2 mx-1 rounded-md transition-colors duration-200 text-xs sm:text-base ${
							currentPage === i
								? 'bg-primary text-white font-semibold dark:bg-darkS'
								: 'bg-secondary hover:bg-primary text-highlights dark:bg-darken dark:hover:bg-darkS dark:text-white'
						}`}
					>
						{i}
					</button>
				);
			}

			if (currentPage < totalPages - 2) {
				buttons.push(
					<span key="dots2" className="px-2 py-1 text-gray-400 dark:text-gray-500 text-xs sm:text-base">...</span>
				);
			}

			// Last page button
			buttons.push(
				<button
					key={totalPages}
					onClick={() => onPageChange(totalPages)}
					className={`px-2 py-1 sm:px-4 sm:py-2 mx-1 rounded-md transition-colors duration-200 text-xs sm:text-base ${
						currentPage === totalPages
							? 'bg-primary text-white font-semibold dark:bg-darkS'
							: 'bg-secondary hover:bg-primary text-highlights dark:bg-darken dark:hover:bg-darkS dark:text-white'
					}`}
				>
					{totalPages}
				</button>
			);
		}

		return buttons;
	};

	return (
		<div className="flex justify-center items-center mt-6 space-x-1 sm:space-x-2 overflow-x-auto">
			{/* Previous Button */}
			<button
				disabled={currentPage === 1}
				onClick={() => onPageChange(currentPage - 1)}
				className={`px-2 py-1 sm:px-4 sm:py-2 rounded-md transition-colors duration-200 text-xs sm:text-base ${
					currentPage === 1
						? 'bg-gray-300 cursor-not-allowed text-gray-500 dark:bg-darkS'
						: 'bg-secondary hover:bg-primary text-highlights dark:bg-darken dark:hover:bg-darkS dark:text-white'
				}`}
			>
				Prev
			</button>

			{/* Page Number Buttons */}
			{renderPaginationButtons()}

			{/* Next Button */}
			<button
				disabled={currentPage === totalPages}
				onClick={() => onPageChange(currentPage + 1)}
				className={`px-2 py-1 sm:px-4 sm:py-2 rounded-md transition-colors duration-200 text-xs sm:text-base ${
					currentPage === totalPages
						? 'bg-naeg cursor-not-allowed text-secondary dark:bg-darkS'
						: 'bg-secondary hover:bg-primary text-dark dark:bg-darken dark:hover:bg-naeg dark:text-white'
				}`}
			>
				Next
			</button>
		</div>
	);
};

export default Pagination;
