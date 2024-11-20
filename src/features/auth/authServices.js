import axios from 'axios';

const BACKEND_DOMAIN = `https://quickease.xyz`;

const REGISTER_URL = `${BACKEND_DOMAIN}/api/v1/auth/users/`;
const LOGIN_URL = `${BACKEND_DOMAIN}/api/v1/auth/jwt/create/`;
const REFRESH_URL = `${BACKEND_DOMAIN}/api/v1/auth/jwt/refresh/`;
const ACTIVATE_URL = `${BACKEND_DOMAIN}/api/v1/auth/users/activation/`;
const RESET_PASSWORD_URL = `${BACKEND_DOMAIN}/api/v1/auth/users/reset_password/`;
const RESET_PASSWORD_CONFIRM_URL = `${BACKEND_DOMAIN}/api/v1/auth/users/reset_password_confirm/`;
const GET_USER_INFO = `${BACKEND_DOMAIN}/api/v1/auth/users/me/`;
const DELETE_USER = `${BACKEND_DOMAIN}/api/v1/auth/users/me/`;

const axiosInstance = axios.create({
	baseURL: BACKEND_DOMAIN,
	headers: {
		'Content-Type': 'application/json',
	},
});

axiosInstance.interceptors.response.use(
	(response) => response,
	async (error) => {
		const originalRequest = error.config;
		if (error.response.status === 401 && !originalRequest._retry) {
			originalRequest._retry = true;
			try {
				const newAccessToken = await refresh();
				originalRequest.headers['Authorization'] = `Bearer ${newAccessToken.access}`;
				return axiosInstance(originalRequest);
			} catch (refreshError) {
				logout();
				return Promise.reject(refreshError);
			}
		}
		return Promise.reject(error);
	}
);

const register = async (userData) => {
	try {
		const response = await axiosInstance.post(REGISTER_URL, userData);
		return response.data;
	} catch (error) {
		if (error.response && error.response.data) {
			if (error.response.data.email) {
				throw new Error('This email is already registered.');
			}
			if (error.response.data.password) {
				throw new Error(error.response.data.password[0]);
			}
		}
		throw error;
	}
};

const login = async (userData) => {
	try {
		const response = await axiosInstance.post(LOGIN_URL, userData);
		if (response.data) {
			localStorage.setItem('user', JSON.stringify(response.data));
		}
		return response.data;
	} catch (error) {
		if (error.response) {
			if (error.response.status === 400) {
				const errorMessage =
					error.response.data.detail || 'Invalid login credentials. Please check your email and password.';
				throw new Error(errorMessage);
			} else if (error.response.status === 401) {
				throw new Error(
					'Invalid email address or password. Please make sure your account is activated and enetred a correct password'
				);
			}
		}
		throw error;
	}
};

const refresh = async () => {
	const refreshToken = JSON.parse(localStorage.getItem('user'))?.refresh;
	const response = await axiosInstance.post(REFRESH_URL, { refresh: refreshToken });
	if (response.data) {
		const user = JSON.parse(localStorage.getItem('user'));
		user.access = response.data.access;
		localStorage.setItem('user', JSON.stringify(user));
	}
	return response.data;
};

const logout = async () => {
	localStorage.removeItem('user');
};

const activate = async (userData) => {
	const response = await axiosInstance.post(ACTIVATE_URL, userData);
	return response.data;
};

const resetPassword = async (userData) => {
	try {
		const response = await axiosInstance.post(RESET_PASSWORD_URL, userData);
		return response.data;
	} catch (error) {
		if (error.response && error.response.data) {
			throw new Error(error.response.data.email || 'Failed to send reset email, make sure to put the valid email.');
		}
		throw error;
	}
};

const resetPasswordConfirm = async (userData) => {
	const response = await axiosInstance.post(RESET_PASSWORD_CONFIRM_URL, userData);
	return response.data;
};

const getUserInfo = async (accessToken) => {
	const config = {
		headers: {
			Authorization: `Bearer ${accessToken}`,
		},
	};

	const response = await axios.get(GET_USER_INFO, config);
	return response.data;
};

const deleteUser = async (currentPassword) => {
	try {
		const response = await axiosInstance.delete(DELETE_USER, { data: { current_password: currentPassword } });
		return response.data;
	} catch (error) {
		if (error.response && error.response.data) {
			throw new Error(error.response.data.password || 'Incorrect password please try again');
		}
		throw error;
	}
};

const handleError = (error) => {
	if (error.response && error.response.data) {
		return {
			message: error.response.data.detail || 'An error occurred',
			errors: error.response.data,
		};
	}
	return {
		message: error.message || 'An unexpected error occurred',
		errors: {},
	};
};

export const authAxiosInstance = axiosInstance;

const authService = {
	register,
	login,
	refresh,
	logout,
	activate,
	resetPassword,
	resetPasswordConfirm,
	getUserInfo,
	deleteUser,
	handleError,
};

export default authService;
