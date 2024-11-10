import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFlag } from '@fortawesome/free-solid-svg-icons';

const QuizQuestionCard = ({ questionNumber, question, choices, selectedAnswer, onAnswer, onFlag, isFlagged }) => {
  const handleChoiceSelect = (index) => {
    onAnswer(index);
  };

  return (
    <div className="border p-8 rounded-xl max-w-3xl w-full mx-auto bg-white dark:bg-darken my-4 relative">
      <FontAwesomeIcon
        icon={faFlag}
        className={`absolute top-4 right-4 cursor-pointer ${isFlagged ? 'text-review' : 'text-gray-400'}`}
        onClick={onFlag}
      />

      <div className="text-left mb-24">
        <div className="flex items-center mb-2">
          <span className="text-xl font-pbold text-dark dark:text-naeg mr-2">
            {questionNumber}.
          </span>
          <p className="text-xl font-pmedium text-dark dark:text-secondary">{question}</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {choices.map((choice, index) => (
          <button
            key={index}
            onClick={() => handleChoiceSelect(index)}
            className={`border rounded-lg p-4 text-center font-pregular text-dark dark:text-secondary ${
              selectedAnswer === index ? 'bg-primary text-white dark:text-secondary dark:bg-darkS' : ''
            }`}>
            {choice}
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuizQuestionCard;