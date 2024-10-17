import { configureStore } from '@reduxjs/toolkit';
import pomodoroSlice from '../features/Pomodoro/pomodoroSlice';
import authSlice from '../features/auth/authSlice';

export default configureStore({
	reducer: {
		pomodoro: pomodoroSlice,
		auth: authSlice,
	},
});
