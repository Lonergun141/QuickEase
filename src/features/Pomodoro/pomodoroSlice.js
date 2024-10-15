import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import pomodoroService from './pomodoroServices';

export const fetchPomodoroSettings = createAsyncThunk('pomodoro/fetchSettings', async (_, { rejectWithValue }) => {
	try {
		const settings = await pomodoroService.fetchSettings();
		return settings || null;
	} catch (error) {
		return rejectWithValue(error.response?.data);
	}
});

export const savePomodoroSettings = createAsyncThunk(
	'pomodoro/saveSettings',
	async (settings, { getState, rejectWithValue }) => {
		try {
			const { pomodoro } = getState();
			if (pomodoro.settingsId) {
				return await pomodoroService.updateSettings(pomodoro.settingsId, settings);
			} else {
				return await pomodoroService.createSettings(settings);
			}
		} catch (error) {
			return rejectWithValue(error.response?.data);
		}
	}
);

const initialState = {
	activeSettings: {
		studyTime: 25,
		shortBreak: 5,
		longBreak: 15,
		showTimer: true,
	},
	pendingSettings: {
		studyTime: 25,
		shortBreak: 5,
		longBreak: 15,
		showTimer: true,
	},
	currentTime: 25 * 60,
	isRunning: false,
	session: 'study',
	cycleCount: 0,
	showBreakModal: false,
	isLoading: false,
	error: null,
	settingsId: null,
};

const pomodoroSlice = createSlice({
	name: 'pomodoro',
	initialState,
	reducers: {
		setPendingSetting: (state, action) => {
			state.pendingSettings = { ...state.pendingSettings, ...action.payload };
		},
		applySettings: (state) => {
			state.activeSettings = { ...state.pendingSettings };
			state.currentTime = state.activeSettings.studyTime * 60;
			state.isRunning = false;
			state.session = 'study';
		},
		startTimer: (state) => {
			state.isRunning = true;
		},
		pauseTimer: (state) => {
			state.isRunning = false;
		},
		decrementTime: (state) => {
			if (state.currentTime > 0) {
				state.currentTime -= 1;
			} else {
				state.isRunning = false;
				if (state.session === 'study') {
					state.cycleCount += 1;
					if (state.cycleCount % 4 === 0) {
						state.currentTime = state.activeSettings.longBreak * 60;
						state.session = 'longBreak';
					} else {
						state.currentTime = state.activeSettings.shortBreak * 60;
						state.session = 'shortBreak';
					}
					state.showBreakModal = true;
				} else {
					state.currentTime = state.activeSettings.studyTime * 60;
					state.session = 'study';
					state.showBreakModal = false;
				}
			}
		},
		resetTimer: (state) => {
			state.isRunning = false;
			state.currentTime = state.activeSettings.studyTime * 60;
			state.session = 'study';
			state.cycleCount = 0;
			state.showBreakModal = false;
		},
		skipSession: (state) => {
			if (state.session === 'study') {
				state.cycleCount += 1;
				if (state.cycleCount % 4 === 0) {
					state.currentTime = state.activeSettings.longBreak * 60;
					state.session = 'longBreak';
				} else {
					state.currentTime = state.activeSettings.shortBreak * 60;
					state.session = 'shortBreak';
				}
				state.showBreakModal = true;
			} else {
				state.currentTime = state.activeSettings.studyTime * 60;
				state.session = 'study';
				state.showBreakModal = false;
			}
			state.isRunning = false;
		},
		closeBreakModal: (state) => {
			state.showBreakModal = false;
		},
		resetPomodoroState: (state) => {
			return initialState;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchPomodoroSettings.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(fetchPomodoroSettings.fulfilled, (state, action) => {
				state.isLoading = false;
				state.error = null;
				if (action.payload) {
					state.activeSettings = {
						studyTime: action.payload.study_time,
						shortBreak: action.payload.short_break,
						longBreak: action.payload.long_break,
						showTimer: action.payload.show_timer,
					};
					state.pendingSettings = { ...state.activeSettings };
					state.settingsId = action.payload.id;
					state.currentTime = state.activeSettings.studyTime * 60;
				}
			})
			.addCase(fetchPomodoroSettings.rejected, (state, action) => {
				state.isLoading = false;
				state.error = action.payload;
			})
			.addCase(savePomodoroSettings.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(savePomodoroSettings.fulfilled, (state, action) => {
				state.isLoading = false;
				state.error = null;
				state.activeSettings = {
					studyTime: action.payload.study_time,
					shortBreak: action.payload.short_break,
					longBreak: action.payload.long_break,
					showTimer: action.payload.show_timer,
				};
				state.pendingSettings = { ...state.activeSettings };
				state.settingsId = action.payload.id;
				state.currentTime = state.activeSettings.studyTime * 60;
			})
			.addCase(savePomodoroSettings.rejected, (state, action) => {
				state.isLoading = false;
				state.error = action.payload;
			});
	},
});

export const {
	setPendingSetting,
	applySettings,
	startTimer,
	pauseTimer,
	decrementTime,
	resetTimer,
	skipSession,
	closeBreakModal,
	resetPomodoroState
} = pomodoroSlice.actions;

export default pomodoroSlice.reducer;
