import React, { useState, useEffect } from 'react';

const dadJokes = [
  { question: "What is the oldest fish?", answer: "Century Tuna!" },
  { question: "I only know 25 letters of the alphabet", answer: "I don't know y." },
  { question: "What did Baby Corn say to Mama Corn?", answer: "Where's Pop Corn?" },
  { question: "Ha?", answer: "Hotdog!" },
  { question: "What's your course", answer: "of course" }
];

export default function FlashcardLoadingScreen() {
  const [randomJoke, setRandomJoke] = useState({});

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * dadJokes.length);
    setRandomJoke(dadJokes[randomIndex]);
  }, []);

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-secondary dark:bg-dark z-50 p-4">
        <h1 className="loading-title animate-gradientText text-3xl sm:text-4xl md:text-5xl font-extrabold mb-8 p-9">
                Generating Your Notes
            </h1>

      <div className="relative flex items-center justify-center mb-10 animate-flashCardFlipGroup">
        <div className="flashcard-container">
          <div className="flashcard animate-flashCardFlip">
            {/* Flashcard Front */}
            <div className="flashcard-front dark:bg-darken dark:text-white">
              <p className="text-primary dark:text-secondary text-xl text-center p-4 animate-gradientText">
                {randomJoke.question}
              </p>
            </div>

            {/* Flashcard Back */}
            <div className="flashcard-back dark:bg-darken dark:text-gray-300">
              <p className="text-primary dark:text-secondary text-xl text-center p-4 animate-gradientText">
                {randomJoke.answer}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full max-w-xs sm:max-w-md md:max-w-lg">
        <div className="w-full h-2 bg-gray-300 dark:bg-gray-600 rounded-full overflow-hidden">
          <div className="h-full bg-primary dark:bg-secondary rounded-full loading-bar"></div>
        </div>
      </div>

      <p className="text-darken font-pregular dark:text-gray-300 text-center mt-8 max-w-md text-sm sm:text-base md:text-sm">
        Hang tight! We're preparing your flashcards for a fun and interactive study session.
      </p>
    </div>
  );
}
