// import { img } from '../../../constants/index';
// import { fetchBadges, fetchUserAchievements } from '../../../features/badge/badgeService';


// export const getBadgeList = async () => {
//   try {

//     const badges = await fetchBadges();

//     const badgeList = badges.map((badge, index) => ({
//       src: img[`Badge${index + 1}`], 
//       title: badge.badge_name, 
//       description: badge.badge_description, 
//     }));

//     return badgeList;
//   } catch (error) {
//     console.error('Error fetching badge list:', error);
//     return [];
//   }
// };

// // Function to get user achievements
// export const getUserAchievements = async (userId) => {
//   try {
//     const achievements = await fetchUserAchievements(userId);
//     const badges = await fetchBadges(); 

//     const badgeImageMap = badges.reduce((acc, badge) => {
//       acc[badge.id] = img[`Badge${badge.id}`]; 
//       return acc;
//     }, {});

//     const achievementList = achievements.map((achievement) => ({
//       src: badgeImageMap[achievement.badge], 
//       index: achievement.badge, 
//     }));

//     return achievementList;
//   } catch (error) {
//     console.error('Error fetching user achievements:', error);
//     return [];
//   }
// };



 


