/* eslint-disable react/prop-types */
import { createBrowserRouter, Navigate } from 'react-router-dom';
import App from '../App';
import SignIn from '../pages/auth/signIn';
import SignUp from '../pages/auth/signUp';
import ForgotPass from '../pages/auth/forgotPass';
import ActivateAccount from '../pages/auth/activation';
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


import LoadingScreen from '../components/loader';
import TranscribeError from '../pages/main/transcribeError';
import ErrorPage from '../components/UI/ErrorPage';

import ProtectedRoute from '../features/auth/ProtectedRoute';

export const router = createBrowserRouter([
    {
        path: '*',
        element: <ErrorPage />,
    },
    {
        path: '/QuickEase/',
        element: <App/>,
    },
    {
        path: '/Loader',
        element: <LoadingScreen />,
    },
    {
        path: '/QuickEase/SignIn',
        element: <SignIn />,
    },
    {
        path: '/QuickEase/SignUp',
        element: <SignUp />,
    },
    {
        path: '/QuickEase/ForgotPass',
        element: <ForgotPass />,
    },
    {
        path: 'QuickEase/activate/:uid/:token',
        element: <ActivateAccount />,
    },
    {
        path: '/QuickEase/password/reset/confirm/:uid/:token',
        element: <ResetPass />,
    },
    {
        path: '/QuickEase/Home',
        element: <ProtectedRoute><Home /></ProtectedRoute>,
    },
    {
        path: '/QuickEase/QuizHistory',
        element: <ProtectedRoute><QuizHistory /></ProtectedRoute>,
    },
    {
        path: '/QuickEase/MyNotes',
        element: <ProtectedRoute><MyNotes /></ProtectedRoute>,
    },
    {
        path: '/QuickEase/FlashCardhistory',
        element: <ProtectedRoute><FlashCardHistory /></ProtectedRoute>,
    },
    {
        path: '/QuickEase/PomodoroSettings',
        element: <ProtectedRoute><PomodoroSettings /></ProtectedRoute>,
    },
    {
        path: '/QuickEase/Settings',
        element: <ProtectedRoute><Settings /></ProtectedRoute>,
    },
    {
        path: '/QuickEase/Notes/:id',
        element: <ProtectedRoute><Notes /></ProtectedRoute>,
    },
    {
        path: '/QuickEase/Profile',
        element: <ProtectedRoute><Profile /></ProtectedRoute>,
    },
    {
        path: '/QuickEase/Flashcards/:noteId',
        element: <ProtectedRoute><Flashcards /></ProtectedRoute>,
    },
    {
        path: '/QuickEase/Quiz/:id',  
        element: <ProtectedRoute><Quiz /></ProtectedRoute>,
    },
    {
        path: '/QuickEase/Results/:id', 
        element: <ProtectedRoute><Results /></ProtectedRoute>,
    },
    {
        path: '/QuickEase/Review/:id',  
        element: <ProtectedRoute><Review /></ProtectedRoute>,
    },
    {
        path: '/QuickEase/TranscribeError',
        element: <ProtectedRoute><TranscribeError /></ProtectedRoute>,
    },
]);