/* eslint-disable react/prop-types */
import { createBrowserRouter, Navigate } from 'react-router-dom';
import App from '../App';
import SignIn from '../pages/auth/signIn';
import SignUp from '../pages/auth/signUp';
import ForgotPass from '../pages/auth/forgotPass';
import ActivateAccount from '../pages/auth/activateAccount';
import ResetPass from '../pages/auth/resetPass';
import Home from '../pages/main/home';
import QuizHistory from '../pages/main/quizHistory';
import MyNotes from '../pages/main/myNotes';
import FlashCardHistory from '../pages/main/flashCardHistory';
import PomodoroSettings from '../pages/main/pomodoroSettings';
import Settings from '../pages/main/settings';
import Notes from '../pages/sessions/notes';
import Profile from '../pages/main/profile';
import Flashcards from '../pages/sessions/flashcards';
import Quiz from '../pages/sessions/quiz';
import Results from '../pages/sessions/results';
import Review from '../pages/sessions/review';

import LoadingScreen from '../components/Loaders/loader';
import TranscribeError from '../pages/main/transcribeError';
import ErrorPage from '../components/UI/ErrorPage';

import ProtectedRoute from '../features/auth/ProtectedRoute';
import FlashcardLoadingScreen from '../components/Loaders/flashLoader';
import QuizLoadingScreen from '../components/Loaders/quizLoader';

export const router = createBrowserRouter([
	{
		path: '*',
		element: <ErrorPage />,
	},
	{
		path: '/',
		element: <App />,
	},
	{
		path: '/Loader',
		element: <LoadingScreen />,
	},
	{
		path: '/FlashcardLoadingScreen',
		element: <FlashcardLoadingScreen />,
	},
	{
		path: '/QuizLoadingScreen',
		element: <QuizLoadingScreen />,
	},
	{
		path: '/SignIn',
		element: <SignIn />,
	},
	{
		path: '/SignUp',
		element: <SignUp />,
	},
	{
		path: '/ForgotPass',
		element: <ForgotPass />,
	},
	{
		path: '/activate/:uid/:token',
		element: <ActivateAccount />,
	},
	{
		path: '/password/reset/confirm/:uid/:token',
		element: <ResetPass />,
	},
	{
		path: '/Home',
		element: (
			<ProtectedRoute>
				<Home />
			</ProtectedRoute>
		),
	},
	{
		path: '/QuizHistory',
		element: (
			<ProtectedRoute>
				<QuizHistory />
			</ProtectedRoute>
		),
	},
	{
		path: '/MyNotes',
		element: (
			<ProtectedRoute>
				<MyNotes />
			</ProtectedRoute>
		),
	},
	{
		path: '/FlashCardhistory',
		element: (
			<ProtectedRoute>
				<FlashCardHistory />
			</ProtectedRoute>
		),
	},
	{
		path: '/PomodoroSettings',
		element: (
			<ProtectedRoute>
				<PomodoroSettings />
			</ProtectedRoute>
		),
	},
	{
		path: '/Settings',
		element: (
			<ProtectedRoute>
				<Settings />
			</ProtectedRoute>
		),
	},
	{
		path: '/Notes/:id',
		element: (
			<ProtectedRoute>
				<Notes />
			</ProtectedRoute>
		),
	},
	{
		path: '/Profile',
		element: (
			<ProtectedRoute>
				<Profile />
			</ProtectedRoute>
		),
	},
	{
		path: '/Flashcards/:noteId',
		element: (
			<ProtectedRoute>
				<Flashcards />
			</ProtectedRoute>
		),
	},
	{
		path: '/Quiz/:id',
		element: (
			<ProtectedRoute>
				<Quiz />
			</ProtectedRoute>
		),
	},
	{
		path: '/Results/:id',
		element: (
			<ProtectedRoute>
				<Results />
			</ProtectedRoute>
		),
	},
	{
		path: '/Review/:id',
		element: (
			<ProtectedRoute>
				<Review />
			</ProtectedRoute>
		),
	},
	{
		path: '/TranscribeError',
		element: (
			<ProtectedRoute>
				<TranscribeError />
			</ProtectedRoute>
		),
	},
]);
