import React, { createContext, useContext, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { fetchUserFlashcards } from '../Flashcard/flashCard';
import { fetchAllNotes } from '../Summarizer/openAiServices';
import { fetchAllQuiz } from '../Quiz/quizServices';

const UserStatsContext = createContext();

export const UserStatsProvider = ({ children }) => {
	const { userInfo } = useSelector((state) => state.auth);
	const [flashcardCount, setFlashcardCount] = useState(0);
	const [notesCount, setNotesCount] = useState(0);
	const [averageScore, setAverageScore] = useState(0);
	const [statsLoaded, setStatsLoaded] = useState(false);
	const [perfectQuizCount, setPerfectQuizCount] = useState(0);
	const [perfectQuizAchieved, setPerfectQuizAchieved] = useState(false);

	useEffect(() => {
		if (userInfo?.id) {
			loadUserData();
		}
	}, [userInfo]);

	const loadUserData = async () => {
		try {
			setStatsLoaded(false);
			const flashcardsData = await fetchUserFlashcards(userInfo.id);
			setFlashcardCount(flashcardsData.length);

			const notesData = await fetchAllNotes();
			const userNotesCount = notesData.filter((note) => note.user === userInfo.id).length;
			setNotesCount(userNotesCount);

			const quizData = await fetchAllQuiz();
			calculateAverageScore(quizData);

			setStatsLoaded(true);
		} catch (error) {
			console.error('Error loading user data:', error);
			setStatsLoaded(true);
		}
	};

	const calculateAverageScore = (quizData) => {
		let totalScore = 0;
		let totalQuizzes = 0;
		let perfectScoreAchieved = false;
    let perfectQuizCount = 0;


		quizData.forEach((quiz) => {
			if (quiz.TestScore && quiz.TestTotalScore) {
				totalScore += quiz.TestScore;
				totalQuizzes += quiz.TestTotalScore;

				if (quiz.TestScore === quiz.TestTotalScore) {
					perfectScoreAchieved = true;
					perfectQuizCount++;
				}
			}
		});

		const average = totalQuizzes > 0 ? (totalScore / totalQuizzes) * 100 : 0;
		setAverageScore(parseFloat(average.toFixed(2)));
		setPerfectQuizAchieved(perfectScoreAchieved);
		setPerfectQuizCount(perfectQuizCount);
	};

	// Expose refreshUserStats function
	const refreshUserStats = () => {
		loadUserData();
	};

	return (
		<UserStatsContext.Provider
			value={{
				flashcardCount,
				notesCount,
				averageScore,
				perfectQuizAchieved,
				perfectQuizCount,
				statsLoaded,
				refreshUserStats,
			}}>
			{children}
		</UserStatsContext.Provider>
	);
};

export const useUserStats = () => useContext(UserStatsContext);
