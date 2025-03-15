import axios from 'axios';

const BACKEND_DOMAIN = 'https://d4ngk.pythonanywhere.com/quickease/api/v1';

const axiosInstance = axios.create({
	baseURL: BACKEND_DOMAIN,
	headers: {
		'Content-Type': 'application/json',
	},
});

axiosInstance.interceptors.request.use(
	(config) => {
		const user = localStorage.getItem('user');
		const parsedUser = JSON.parse(user);
		if (parsedUser && parsedUser.access) {
			config.headers['Authorization'] = `Bearer ${parsedUser.access}`;
		}
		return config;
	},
	(error) => Promise.reject(error)
);

export const fetchUserAchievements = async (userId) => {
	try {
		const response = await axiosInstance.get(`/achievements/?user=${userId}`);
		return response.data;
	} catch (error) {
		throw error;
	}
};

export const createAchievement = async (userId, badgeId) => {
	try {
		const response = await axiosInstance.post(`/achievements/`, {
			user: userId,
			badge: badgeId,
		});
		return response.data;
	} catch (error) {
		if (
			error.response &&
			error.response.status === 400 &&
			error.response.data?.non_field_errors
		) {
			return null;
		}

	}
};

export const fetchBadges = async () => {
	try {
		const response = await axiosInstance.get(`/badges/`);
		return response.data;
	} catch (error) {
		throw error;
	}
};
