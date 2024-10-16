import axios from 'axios';

const API_BASE_URL = `https://d4ngk.pythonanywhere.com/quickease/api/v1`;

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

//post the generated quiz by openai to backend
export const createQuiz = async (noteId, quizData) => {
    try {
        // First, create the UserTest
        const testResponse = await axiosInstance.post(`/usertest-create/${noteId}/`, {});
        // console.log('Test created successfully:', testResponse.data);

        // Then, create questions and choices for each question
        for (const question of quizData) {
            try {
                const questionResponse = await axiosInstance.post(`/questions/create/${noteId}/`, {
                    TestQuestion: question.TestQuestion,
                });
                const questionId = questionResponse.data.id;
                // console.log('Question created successfully:', questionResponse.data);

                // Create choices for the question
                for (const choice of question.choices) {
                    try {
                        const choiceResponse = await axiosInstance.post(`/usertest/choice-create/${questionId}/`, {
                            item_choice_text: choice.item_choice_text,
                            isAnswer: choice.isAnswer,
                        });
                        // console.log('Choice created successfully:', choiceResponse.data);
                    } catch (choiceError) {
                        console.error('Error creating choice:', choiceError);
                    }
                }
            } catch (questionError) {
                console.error('Error creating question:', questionError);
            }
        }

        return noteId;
    } catch (error) {
        console.error('Error creating quiz:', error);
        throw error;
    }
};


//get all the quiz generated by the user
export const fetchAllQuiz = async () => {
	try {
		const response = await axiosInstance.get('/usertests/');
		return response.data; 
	} catch (error) {
		console.error('Error fetching quiz:', error);
		throw error;
	}
};

//get quiz questions
export const fetchQuiz = async (noteId) => {
	try {
		const response = await axiosInstance.get(`/usertest/questions/${noteId}/`);
		return response.data;
	} catch (error) {
		console.error('Error fetching quiz:', error);
		throw error;
	}
};
//get fetch choices
export const fetchQuizChoices = async (questionId) => {
	try {
		const response = await axiosInstance.get(`/usertest/choices/${questionId}/`);
		return response.data;
	} catch (error) {
		console.error('Error fetching quiz choices:', error);
		throw error;
	}
};
//quiz submission
export const submitQuizAnswer = async (choiceId) => {
	try {
		const response = await axiosInstance.post(`/choice-answer/create/${choiceId}/`);
		return response.data;
	} catch (error) {
		console.error('Error submitting quiz answer:', error);
		throw error;
	}
};

// Fetch all existing answers for the note
export const fetchAllChoiceAnswersForNote = async (noteId) => {
    try {
        const response = await axiosInstance.get(`/answer-by-note/${noteId}/`);
        return response.data; // Returns an array of existing choice answers
    } catch (error) {
        console.error('Error fetching existing choice answers:', error);
        throw error;
    }
};

// Delete a single choice answer by its ID
export const deleteChoiceAnswer = async (choiceAnswerId) => {
    try {
        await axiosInstance.delete(`/choice-answer-detail/${choiceAnswerId}/`);
    } catch (error) {
        console.error('Error deleting choice answer:', error);
        throw error;
    }
};

// Delete all choice answers for a note
export const deleteAllChoiceAnswers = async (noteId) => {
    try {
        const existingAnswers = await fetchAllChoiceAnswersForNote(noteId);
        const deletePromises = existingAnswers.map((answer) => deleteChoiceAnswer(answer.answer));
        await Promise.all(deletePromises);
    } catch (error) {
        console.error('Error deleting all choice answers:', error);
        throw error;
    }
};

//gets the quiz results
export const fetchQuizResults = async (choiceId) => {
	try {
		const response = await axiosInstance.get(`/choice-answers/${choiceId}/`);
		return response.data;
	} catch (error) {
		console.error('Error fetching quiz results:', error);
		throw error;
	}
};
//if score already exists then it updates the current score
export const updateTestScore = async (noteId, score, total) => {
	try {
		const response = await axiosInstance.put(`/usertest-detail/${noteId}/`, {
			TestScore: score,
			TestTotalScore: total,
		});
		return response.data;
	} catch (error) {
		console.error('Error updating quiz results:', error);
		throw error;
	}
};
//review page data egt request
export const fetchQuizReviewData = async (noteId) => {
    try {
        // Step 1: Fetch test details
        const userTestResponse = await axiosInstance.get(`/usertest-detail/${noteId}/`);

        // Step 2: Fetch all questions for the note
        const questionsResponse = await axiosInstance.get(`/question-by-note/${noteId}/`);

        // Step 3: Fetch all choices for all questions related to the note
        const choicesResponse = await axiosInstance.get(`/choices-by-note/${noteId}/`);

        // Step 4: Fetch all answers related to the note
        const answersByNoteResponse = await axiosInstance.get(`/answer-by-note/${noteId}/`);

        // Step 5: Fetch specific answers per question for double-checking
        const answersByQuestionPromises = questionsResponse.data.map(async (question) => {
            const response = await axiosInstance.get(`/answer-by-question/${question.id}/`);
            return { questionId: question.id, answers: response.data };
        });
        const answersByQuestion = await Promise.all(answersByQuestionPromises);

        return {
            userTest: userTestResponse.data,
            questions: questionsResponse.data,
            choices: choicesResponse.data,
            answersByNote: answersByNoteResponse.data,
            answersByQuestion,
        };
    } catch (error) {
        console.error('Error fetching quiz review data:', error);
        throw error;
    }
};

