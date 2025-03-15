import axios from 'axios';

const BACKEND_DOMAIN = `https://d4ngk.pythonanywhere.com/quickease/api/v1`;

const axiosInstance = axios.create({
	baseURL: BACKEND_DOMAIN,
	headers: {
		'Content-Type': 'application/json',
	},
});

axiosInstance.interceptors.request.use(
	(config) => {
		const user = JSON.parse(localStorage.getItem('user'));
		if (user && user.access) {
			config.headers['Authorization'] = `Bearer ${user.access}`;
		}
		return config;
	},
	(error) => Promise.reject(error)
);

export const fetchUserFlashcards = async () => {
	try {
		const response = await axiosInstance.get(`${BACKEND_DOMAIN}/user-flashcards/`);
		return response.data;
	} catch (error) {
		console.error('Error fetching flashcards:', error);
		throw error;
	}
};

export const fetchSetFlashcards = async (noteId) => {
	try {
		const response = await axiosInstance.get(`${BACKEND_DOMAIN}/note-flashcards/${noteId}/`);
		return response.data;
	} catch (error) {
		console.error('Error fetching flashcards:', error);
		throw error;
	}
};

export const checkFlashcardsExist = async (noteId) => {
	try {
		const response = await axiosInstance.get(`${BACKEND_DOMAIN}/check-flashcards/${noteId}/`);
		return response.data.exists;
	} catch (error) {
		console.error('Error checking flashcards:', error);
		throw error;
	}
};

export const createFlashcards = async (noteId) => {
	try {
		const response = await axiosInstance.post(`${BACKEND_DOMAIN}/create-flashcards/${noteId}/`);
		console.log('Backend response:', response.data);
		return response.data;
	} catch (error) {
		console.error('Error creating flashcards:', error);
		throw error;
	}
};

export const editFlashcard = async (flashcardId, data) => {
	try {
		const response = await axiosInstance.put(`${BACKEND_DOMAIN}/edit-flashcard/${flashcardId}/`, data);
		return response.data;
	} catch (error) {
		console.error('Error editing flashcard:', error);
		throw error;
	}
};

export const addFlashcard = async (noteId, data) => {
	try {
		const response = await axiosInstance.post(`${BACKEND_DOMAIN}/add-flashcard/${noteId}/`, {
			...data,
			noteID: noteId,
		});
		return response.data;
	} catch (error) {
		console.error('Error adding flashcard:', error);
		throw error;
	}
};

export const deleteFlashcard = async (flashcardId) => {
	try {
		const response = await axiosInstance.delete(`${BACKEND_DOMAIN}/delete-flashcard/${flashcardId}/`);
		return response.data;
	} catch (error) {
		console.error('Error deleting flashcard:', error);
		throw error;
	}
};

export const fetchFlashcardsForNote = async (noteId) => {
	try {
		const response = await axiosInstance.get(`${BACKEND_DOMAIN}/note-flashcards/${noteId}/`);
		return response.data;
	} catch (error) {
		console.error('Error fetching flashcards for note:', error);
		throw error;
	}
};
