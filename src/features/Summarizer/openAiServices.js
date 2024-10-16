import axios from 'axios';
import { convertFileToPng } from '../Converter/convertAPI';
import Tesseract from 'tesseract.js';

const API_BASE_URL = `https://d4ngk.pythonanywhere.com/quickease/api/v1`;
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

const axiosInstance = axios.create({
	baseURL: API_BASE_URL,
});

axiosInstance.interceptors.request.use(
	(config) => {
		const user = JSON.parse(localStorage.getItem('user'));
		if (user && user.access) {
			config.headers['Authorization'] = `Bearer ${user.access}`;
		}
		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

export const generateSummary = async (formData) => {
	try {
		const response = await axiosInstance.post('/usernotes/', formData, {
			headers: {
				'Content-Type': 'application/json',
			},
		});
		return response.data;
	} catch (error) {
		console.error('Error generating summary:', error);
		throw error;
	}
};

export const fetchNote = async (id) => {
	try {
		const response = await axiosInstance.get(`/usernotes/${id}/`);
		return response.data;
	} catch (error) {
		console.error('Error fetching note:', error);
		throw error;
	}
};

export const fetchAllNotes = async () => {
	try {
		const response = await axiosInstance.get('/usernotes/');
		return response.data;
	} catch (error) {
		console.error('Error fetching notes:', error);
		throw error;
	}
};

export const updateNote = async (id, noteData) => {
	try {
		const response = await axiosInstance.put(`/usernotes/${id}/`, noteData);
		return response.data;
	} catch (error) {
		console.error('Error updating note:', error);
		throw error;
	}
};

export const deleteNote = async (id) => {
	try {
		await axiosInstance.delete(`/usernotes/${id}/`);
	} catch (error) {
		console.error('Error deleting note:', error);
		throw error;
	}
};

export const updateNoteTitle = async (id, notetitle) => {
	try {
		const response = await axiosInstance.patch(`/usernotes/${id}/`, { notetitle });
		return response.data;
	} catch (error) {
		console.error('Error updating note title:', error);
		throw error;
	}
};

export const generateSummaryFromImages = async (files, navigate, userId) => {
	try {
		const textContents = await Promise.all(
			files.map(async (file, index) => {
				if (file.type.startsWith('image/')) {
					const {
						data: { text },
					} = await Tesseract.recognize(file);
					console.log(`Tesseract result for image ${index + 1}:`, text);
					return text;
				} else {
					const pngImages = await convertFileToPng(file);
					const texts = await Promise.all(
						pngImages.map(async (pngImage, pngIndex) => {
							const {
								data: { text },
							} = await Tesseract.recognize(pngImage);
							console.log(`Tesseract result for converted image ${index + 1}.${pngIndex + 1}:`, text);
							return text;
						})
					);
					return texts.join('\n\n');
				}
			})
		);

		const combinedText = textContents.filter((text) => text.trim() !== '').join('\n\n');
		console.log('Combined text from all images:', combinedText);

		const wordCount = combinedText.split(/\s+/).filter(Boolean).length;
		if (wordCount < 100) {
			console.log('Extracted text is less than 100 words.');
			navigate('/TranscribeError');
			return null;
		}

		if (combinedText.length === 0) {
			console.log('No text extracted from images');
			navigate('/TranscribeError');
			return null;
		}
		const formData = {
			notecontents: combinedText,
			user: userId,
		};

		const response = await generateSummary(formData);
		return response;
	} catch (error) {
		console.error('Error in generateSummaryFromImages:', error);
		navigate('/TranscribeError');
		throw new Error(`Failed to generate summary: ${error.message}`);
	}
};

export const generateQuizFromSummary = async (summary) => {
	try {
		const response = await axios.post(
			'https://api.openai.com/v1/chat/completions',
			{
				model: 'gpt-4o-mini',
				messages: [
					{
						role: 'system',
						content:
							'You are a helpful assistant that generates multiple-choice quizzes in pure JSON format. Return only JSON, without any code blocks, markdown, or extra characters.',
					},
					{
						role: 'user',
						content: `Generate a multiple-choice quiz based on the given summary. The number of questions should adapt to the length and detail of the summary, with at least **15 questions** as a minimum. If the summary provides enough content, generate additional questions to cover all major points and details, ensuring an even distribution of topics. 

						Each question should have **1 correct answer** and **3 plausible, but incorrect choices**. The incorrect choices should be believable and not too easy to rule out. Randomize the position of the correct answer among the four choices in each question. Format the response as a JSON array of question objects with the following structure:
						[
							{
								"TestQuestion": "Question text here",
								"choices": [
									{
										"item_choice_text": "Choice text here",
										"isAnswer": boolean
									},
									{
										"item_choice_text": "Choice text here",
										"isAnswer": boolean
									},
									{
										"item_choice_text": "Choice text here",
										"isAnswer": boolean
									},
									{
										"item_choice_text": "Choice text here",
										"isAnswer": boolean
									}
								]
							}
						]
						
						The quiz should be based on the following summary:
						
						"${summary}"
						
						Make sure to cover all relevant content in the summary and generate enough questions to test knowledge across all key areas. Keep the correct answer randomized in position for each question, and ensure that incorrect answers are plausible. Do not provide any explanation or extra formatting outside the JSON structure.`,
					},
				],
				max_tokens: 4000,
			},
			{
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${OPENAI_API_KEY}`,
				},
			}
		);

		const quizData = JSON.parse(response.data.choices[0].message.content.trim());
		// console.log('Generated Quiz Data:', quizData);

		return quizData;
	} catch (error) {
		console.error('Error generating quiz:', error);
		throw error;
	}
};
