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
	const { flashcardCount, notesCount, averageScore, perfectQuizAchieved, statsLoaded } = useUserStats();

	const badgeDefinitions = {
		NOTE_TAKER: {
			id: '70b81abb-3b90-4d1a-86bf-bb6d301a6469',
			image: img.Badge2,
			title: 'Studiest',
			description: 'Created your first note!',
			condition: (stats) => stats.notesCount >= 1,
		},
		FLASH_MASTER: {
			id: 'd2b83c92-b21d-4a7d-8a62-19ad645af597',
			image: img.Badge4,
			title: 'Flash Master',
			description: 'Generated at least 160 flashcards',
			condition: (stats) => stats.flashcardCount >= 160,
		},
		QUIZ_WHIZ: {
			id: '311ceeb1-2b9d-4c2a-9be3-c3ea99b12baa',
			image: img.Badge3,
			title: 'Quiz Whiz',
			description: 'Achieved 100% on quiz evaluation',
			condition: (stats) => stats.averageScore === 100,
		},
		PERFECTIONIST: {
			id: '9dcc364a-b91c-4419-8de5-c7c5289ec651',
			image: img.Badge1,
			title: 'Perfectionist',
			description: 'Achieved a perfect score on a quiz!',
			condition: (stats) => stats.perfectQuizAchieved === true,
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
				});
			}
		};
		fetchAndCheckAchievements();
	}, [statsLoaded, notesCount, flashcardCount, averageScore, perfectQuizAchieved]);

	const checkAchievements = async (stats) => {
		try {
			const newAchievements = [];
			for (const [key, badge] of Object.entries(badgeDefinitions)) {
				if (badge.condition(stats)) {
					console.log(`Condition met for badge: ${badge.title}`);
					const hasAchievement = achievements.some((a) => a.badge === badge.id);
					if (!hasAchievement && !shownAchievements.has(badge.id)) {
						try {
							const response = await createAchievement(stats.userId, badge.id);
							if (response) {
								console.log(`Achievement earned: ${badge.title}`);
								newAchievements.push(badge);
								setAchievements((prevAchievements) => [...prevAchievements, response]);
								setShownAchievements((prev) => new Set([...prev, badge.id]));
							}
						} catch (error) {
							console.error('Error creating achievement:', error);
						}
					} else {
						console.log(`Achievement already exists or shown: ${badge.title}`);
					}
				} else {
					console.log(`Condition not met for badge: ${badge.title}`);
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
