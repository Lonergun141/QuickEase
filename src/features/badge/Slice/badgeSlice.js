// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import { fetchBadges, fetchUserAchievements, createAchievement } from '../badgeService';

// export const fetchBadgesAsync = createAsyncThunk('badges/fetchBadges', async () => {
// 	const response = await fetchBadges();
// 	return response;
// });

// export const fetchUserAchievementsAsync = createAsyncThunk(
// 	'badges/fetchAchievements',
// 	async (userId) => {
// 		const response = await fetchUserAchievements(userId);
// 		return response;
// 	}
// );

// export const createAchievementAsync = createAsyncThunk(
// 	'badges/createAchievement',
// 	async ({ userId, badgeId }) => {
// 		const response = await createAchievement(userId, badgeId);
// 		return response;
// 	}
// );

// const badgeSlice = createSlice({
// 	name: 'badges',
// 	initialState: {
// 		badges: [],
// 		achievements: [],
// 		achievementQueue: [],
// 		shownAchievements: [],
// 		loading: false,
// 	},
// 	reducers: {
// 		addToQueue: (state, action) => {
// 			state.achievementQueue.push(action.payload);
// 		},
// 		removeFromQueue: (state) => {
// 			state.achievementQueue.shift();
// 		},
// 		markAsShown: (state, action) => {
// 			if (!state.shownAchievements.includes(action.payload)) {
// 				state.shownAchievements.push(action.payload);
// 			}
// 		},
// 	},
// 	extraReducers: (builder) => {
// 		builder
// 			.addCase(fetchBadgesAsync.fulfilled, (state, action) => {
// 				state.badges = action.payload;
// 			})
// 			.addCase(fetchUserAchievementsAsync.fulfilled, (state, action) => {
// 				state.achievements = action.payload;
// 			})
// 			.addCase(createAchievementAsync.fulfilled, (state, action) => {
// 				state.achievements.push(action.payload);
// 			});
// 	},
// });

// export const { addToQueue, removeFromQueue, markAsShown } = badgeSlice.actions;
// export default badgeSlice.reducer;
