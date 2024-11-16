import React, { createContext, useState, useContext, useEffect } from 'react';
import { fetchUserAchievements, createAchievement } from './badgeService';
import { useUserStats } from './userStatsContext';
import { useSelector } from 'react-redux';
import { img } from '../../constants';
import AchievementModal from '../../components/Modals/achievementModal';

const BadgeContext = createContext();

export const BadgeProvider = ({ children }) => {
	const [achievements, setAchievements] = useState([]);
	const [showAchievementModal, setShowAchievementModal] = useState(false);
	const [achievementQueue, setAchievementQueue] = useState([]);
	const [shownAchievements, setShownAchievements] = useState(new Set());

	const { userInfo } = useSelector((state) => state.auth);
	const { flashcardCount, notesCount, averageScore, perfectQuizAchieved, statsLoaded, perfectQuizCount } = useUserStats();

	const badgeDefinitions = {
		NOTE_TAKER: {
			id: '84482203-c1c0-4f6c-9a4b-8b3fd0476310',
			image: img.Badge2,
			title: 'Studiest',
			description: 'Created your first note!',
			condition: (stats) => stats.notesCount >= 1,
		},
		FLASH_MASTER: {
			id: '63048bee-81dd-4f87-8189-c920bdb10bfa',
			image: img.Badge4,
			title: 'Flash Master',
			description: 'Generated at least 160 flashcards',
			condition: (stats) => stats.flashcardCount >= 160,
		},
		QUIZ_WHIZ: {
			id: '1a080198-17a4-4e08-b57f-bffc1fd09aff',
			image: img.Badge3,
			title: 'Quiz Whiz',
			description: 'Achieved 100% on quiz evaluation',
			condition: (stats) => stats.averageScore === 100,
		},
		PERFECTIONIST: {
			id: '2cf220d0-f749-4c8d-8173-acbe881f6885',
			image: img.Badge1,
			title: 'Perfectionist',
			description: 'Achieved a perfect score on a quiz!',
			condition: (stats) => stats.perfectQuizAchieved === true,
		},
		NOTERER: {
			id: '046baa11-590f-41eb-ae79-0c54bc5c7bd9',
			image: img.Badge5,
			title: 'Noterer',
			description: 'Generate 5 notes',
			condition: (stats) => stats.notesCount >= 5
		},
		DOUBLE_PERFECT: {
			id: '4c951ccc-6da7-4ba9-8dd9-957f4db206d0',
			image: img.Badge6, 
			title: 'What a Nice',
			description: 'Achieved two perfect scores on quizzes!',
			condition: (stats) => stats.perfectQuizCount >= 2,
		},
		HMMM: {
			id: '57788c51-93a2-4686-9c65-50905d05cfe1',
			image: img.Badge7, 
			title: 'Accidental Genius Award',
			description: 'Achieved three perfect scores on quizzes!',
			condition: (stats) => stats.perfectQuizCount >= 3,
		},
		PORTAYMS: {
			id: 'b4fbb53e-fff3-492b-b983-9d538e7dadcd',
			image: img.Badge8, 
			title: 'I Believe You Now',
			description: 'Achieved four perfect scores on quizzes!',
			condition: (stats) => stats.perfectQuizCount >= 4,
		},
	};

	useEffect(() => {
		const fetchAndCheckAchievements = async () => {
			if (userInfo?.id && statsLoaded) {
				await fetchAchievements(userInfo.id);
				checkAchievements({
					userId: userInfo.id,
					notesCount,
					flashcardCount,
					averageScore,
					perfectQuizAchieved,
					perfectQuizCount
				});
			}
		};
		fetchAndCheckAchievements();
	}, [statsLoaded, notesCount, flashcardCount, averageScore, perfectQuizAchieved, perfectQuizCount]);

	const checkAchievements = async (stats) => {
		try {
			const newAchievements = [];
			for (const [key, badge] of Object.entries(badgeDefinitions)) {
				if (badge.condition(stats)) {
					const hasAchievement = achievements.some((a) => a.badge === badge.id);
					if (!hasAchievement && !shownAchievements.has(badge.id)) {
						try {
							const response = await createAchievement(stats.userId, badge.id);
							if (response) {
								newAchievements.push(badge);
								setAchievements((prevAchievements) => {
									const updatedAchievements = [...prevAchievements, response];
									updateLocalStorage(stats.userId, updatedAchievements); 
									return updatedAchievements;
								});
								setShownAchievements((prev) => new Set([...prev, badge.id]));
							}
						} catch (error) {
							console.error('Error creating achievement:', error);
						}
					}
				}
			}

			if (newAchievements.length > 0) {
				setAchievementQueue((prevQueue) => [...prevQueue, ...newAchievements]);
			}
		} catch (error) {
			console.error('Error checking achievements:', error, stats);
		}
	};

	useEffect(() => {
		if (achievementQueue.length > 0 && !showAchievementModal) {
			setShowAchievementModal(true);
		} else if (achievementQueue.length === 0 && showAchievementModal) {
			setShowAchievementModal(false);
		}
	}, [achievementQueue.length, showAchievementModal]);

	const fetchAchievements = async (userId) => {
		try {
			const data = await fetchUserAchievements(userId);
			setAchievements(data);
			updateLocalStorage(userId, data); 
		} catch (error) {
			console.error('Error fetching achievements:', error);
		}
	};

	const closeModal = () => {
		setAchievementQueue((prevQueue) => prevQueue.slice(1));
		if (achievementQueue.length <= 1) {
			setShowAchievementModal(false);
		}
	};

	const updateLocalStorage = (userId, updatedAchievements) => {
		localStorage.setItem(`achievements_${userId}`, JSON.stringify(updatedAchievements));
	};

	return (
		<BadgeContext.Provider
			value={{
				achievements,
				badgeDefinitions,
			}}>
			{children}
			{showAchievementModal && achievementQueue.length > 0 && (
				<AchievementModal achievement={achievementQueue[0]} onClose={closeModal} />
			)}
		</BadgeContext.Provider>
	);
};

export const useBadges = () => useContext(BadgeContext);
