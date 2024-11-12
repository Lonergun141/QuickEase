import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFlag } from '@fortawesome/free-solid-svg-icons';

const QuizQuestionCard = ({
	questionNumber,
	question,
	choices,
	selectedAnswer,
	onAnswer,
	onFlag,
	isFlagged,
}) => {
	const handleChoiceSelect = (index) => {
		onAnswer(index);
	};

	return (
		<div
			className="bg-white dark:bg-darken rounded-2xl border border-zinc-200/80 dark:border-zinc-800 
      overflow-hidden transition-all duration-300 hover:shadow-lg">
			{/* Question Header */}
			<div className="relative p-6 md:p-8">
				<div className="flex items-start justify-between gap-4">
					{/* Question Number & Text */}
					<div className="flex items-start gap-4 flex-grow">
						<span
							className="flex-shrink-0 w-10 h-10 rounded-xl bg-primary/10 dark:bg-secondary/10 
              flex items-center justify-center text-primary dark:text-secondary 
              text-lg font-pbold">
							{questionNumber}
						</span>
						<h3 className="text-lg md:text-xl font-pmedium text-newTxt dark:text-white leading-relaxed">
							{question}
						</h3>
					</div>

					{/* Flag Button */}
					<button
						onClick={onFlag}
						className={`flex-shrink-0 p-2.5 rounded-xl transition-all duration-200
              ${
						isFlagged
							? 'bg-amber-50 text-amber-500 dark:bg-amber-500/10 dark:text-amber-400'
							: 'text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 dark:text-zinc-500 dark:hover:bg-zinc-800 dark:hover:text-zinc-300'
					}`}
						title={isFlagged ? 'Remove flag' : 'Flag for review'}>
						<FontAwesomeIcon icon={faFlag} className="text-lg" />
					</button>
				</div>
			</div>

			{/* Answer Choices */}
			<div className="p-4 md:p-6 pt-0">
				<div className="grid grid-cols-1 gap-3">
					{choices.map((choice, index) => (
						<button
							key={index}
							onClick={() => handleChoiceSelect(index)}
							className={`group relative w-full p-4 md:p-5 rounded-xl transition-all duration-200
                ${
							selectedAnswer === index
								? 'bg-primary dark:bg-darkS text-white shadow-lg shadow-primary/25 dark:shadow-secondary/25'
								: 'bg-zinc-50 dark:bg-zinc-800/50 text-zinc-700 dark:text-zinc-300 dark:bg-darkS hover:bg-zinc-100 dark:hover:bg-zinc-800'
						}`}>
							{/* Choice Text */}
							<div className="flex items-center">
								{/* Radio Button Design */}
								<div
									className={`flex-shrink-0 w-5 h-5 rounded-full border-2 mr-4
                  ${
							selectedAnswer === index
								? 'border-white bg-white/20'
								: 'border-zinc-300 dark:border-zinc-600 group-hover:border-primary dark:group-hover:border-secondary'
						}`}>
									{selectedAnswer === index && (
										<div className="w-full h-full rounded-full bg-white transform scale-50" />
									)}
								</div>

								{/* Choice Text */}
								<span className="text-left text-base md:text-lg font-pmedium">
									{choice}
								</span>
							</div>
						</button>
					))}
				</div>
			</div>
		</div>
	);
};

export default QuizQuestionCard;
