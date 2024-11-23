import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authService from './authServices';

const initialState = {
	user: JSON.parse(localStorage.getItem('user')) || null,
	isError: false,
	isSuccess: false,
	isLoading: false,
	message: '',
	errors: {},
	loginAttempts: 0,
	canRetryLogin: true,
	retryTimerEnd: null,
};

export const register = createAsyncThunk('auth/register', async (user, thunkAPI) => {
	try {
		return await authService.register(user);
	} catch (error) {
		return thunkAPI.rejectWithValue(authService.handleError(error));
	}
});

export const login = createAsyncThunk('auth/login', async (userData, thunkAPI) => {
	try {
		const user = await authService.login(userData);
		thunkAPI.dispatch(fetchUserInfo());
		return user;
	} catch (error) {
		let errorMessage = 'An unexpected error occurred. Please try again.';

		if (error.response) {
			if (error.response.status === 400) {
				errorMessage = error.response.data.detail || 'Invalid login credentials. Please check your email and password.';
			} else if (error.response.status === 401) {
				errorMessage =
					'Invalid email address or password. Please make sure your account is activated and entered a correct password';
			}
		} else if (error.message) {
			errorMessage = error.message;
		}

		return thunkAPI.rejectWithValue(errorMessage);
	}
});

export const refresh = createAsyncThunk('auth/refresh', async (_, thunkAPI) => {
	try {
		const user = await authService.login(userData);
		await thunkAPI.dispatch(fetchUserInfo());
		return user;
	} catch (error) {
		console.error('Ambot', error.message);
	}
});

export const logout = createAsyncThunk('auth/logout', async () => {
	await authService.logout();
	localStorage.removeItem('user');
	localStorage.removeItem('userFirstName'); 
});

export const activate = createAsyncThunk('auth/activate', async (userData, thunkAPI) => {
	try {
		return await authService.activate(userData);
	} catch (error) {
		return thunkAPI.rejectWithValue(authService.handleError(error));
	}
});

export const resetPassword = createAsyncThunk('auth/resetPassword', async (userData, thunkAPI) => {
	try {
		return await authService.resetPassword(userData);
	} catch (error) {
		return thunkAPI.rejectWithValue(authService.handleError(error));
	}
});

export const resetPasswordConfirm = createAsyncThunk('auth/resetPasswordConfirm', async (userData, thunkAPI) => {
	try {
		return await authService.resetPasswordConfirm(userData);
	} catch (error) {
		return thunkAPI.rejectWithValue(authService.handleError(error));
	}
});

export const fetchUserInfo = createAsyncThunk('auth/getUserInfo', async (_, thunkAPI) => {
	try {
		const accessToken = thunkAPI.getState().auth.user.access;
		return await authService.getUserInfo(accessToken);
	} catch (error) {
		return thunkAPI.rejectWithValue(authService.handleError(error));
	}
});

export const deleteUser = createAsyncThunk('auth/deleteUser', async (currentPassword, thunkAPI) => {
	try {
		await authService.deleteUser(currentPassword);
		return 'User deleted successfully';
	} catch (error) {
		return thunkAPI.rejectWithValue(authService.handleError(error));
	}
});

export const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		reset: (state) => {
			state.isLoading = false;
			state.isError = false;
			state.isSuccess = false;
			state.message = '';
			state.errors = {};
		},
		resetLoginAttempts: (state) => {
			state.loginAttempts = 0;
			state.canRetryLogin = true;
			state.retryTimerEnd = null;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(register.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(register.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isSuccess = true;
				state.user = action.payload;
			})
			.addCase(register.rejected, (state, action) => {
				state.isLoading = false;
				state.isError = true;
				state.message = action.payload.message;
				state.errors = action.payload.errors || {};
				state.user = null;
			})
			.addCase(login.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(login.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isSuccess = true;
				state.user = action.payload;
				state.loginAttempts = 0;
				state.canRetryLogin = true;
				if (state.retryTimer) clearTimeout(state.retryTimer);
				state.retryTimer = null;
				state.userInfo = action.payload;
			})
			.addCase(login.rejected, (state, action) => {
				state.isLoading = false;
				state.isSuccess = false;
				state.isError = true;
				state.message = action.payload;
				state.user = null;
				state.loginAttempts += 1;
				if (state.loginAttempts >= 4) {
					state.canRetryLogin = false;
					state.retryTimerEnd = Date.now() + 60000;
				}
			})
			.addCase(refresh.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(refresh.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isSuccess = true;
				state.user.access = action.payload.access;
			})
			.addCase(refresh.rejected, (state, action) => {
				state.isLoading = false;
				state.isError = true;
				state.message = action.payload.message;
				state.errors = action.payload.errors || {};
			})
			.addCase(activate.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(activate.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isSuccess = true;
				state.user = action.payload;
			})
			.addCase(activate.rejected, (state, action) => {
				state.isLoading = false;
				state.isSuccess = false;
				state.isError = true;
				state.message = action.payload.message;
				state.user = null;
			})
			.addCase(resetPassword.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(resetPassword.fulfilled, (state) => {
				state.isLoading = false;
				state.isSuccess = true;
				state.message = 'Password reset email sent successfully. You will be log out in 5 seconds';
			})
			.addCase(resetPassword.rejected, (state, action) => {
				state.isLoading = false;
				state.isSuccess = false;
				state.isError = true;
				state.message = action.payload.message || 'Failed to send reset email. Please try again.';
			})
			.addCase(resetPasswordConfirm.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(resetPasswordConfirm.fulfilled, (state) => {
				state.isLoading = false;
				state.isSuccess = true;
			})
			.addCase(resetPasswordConfirm.rejected, (state, action) => {
				state.isLoading = false;
				state.isSuccess = false;
				state.isError = true;
				state.message = action.payload.message;
				state.user = null;
			})
			.addCase(logout.fulfilled, (state) => {
				state.user = null;
			})
			.addCase(fetchUserInfo.fulfilled, (state, action) => {
				state.userInfo = action.payload;
			})
			.addCase(deleteUser.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(deleteUser.fulfilled, (state) => {
				state.isLoading = false;
				state.isSuccess = true;
				state.user = null;
			})
			.addCase(deleteUser.rejected, (state, action) => {
				state.isLoading = false;
				state.isSuccess = false;
				state.isError = true;
				state.message = action.payload;
			});
	},
});

export const { reset, resetLoginAttempts } = authSlice.actions;
export default authSlice.reducer;
