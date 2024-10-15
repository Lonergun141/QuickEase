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
        path: '/QuickEase-Web/',
        element: <App/>,
    },
    {
        path: '/Loader',
        element: <LoadingScreen />,
    },
    {
        path: '/QuickEase-Web/SignIn',
        element: <SignIn />,
    },
    {
        path: '/QuickEase-Web/SignUp',
        element: <SignUp />,
    },
    {
        path: '/QuickEase-Web/ForgotPass',
        element: <ForgotPass />,
    },
    {
        path: 'QuickEase-Web/activate/:uid/:token',
        element: <ActivateAccount />,
    },
    {
        path: '/QuickEase-Web/password/reset/confirm/:uid/:token',
        element: <ResetPass />,
    },
    {
        path: '/QuickEase-Web/Home',
        element: <ProtectedRoute><Home /></ProtectedRoute>,
    },
    {
        path: '/QuickEase-Web/QuizHistory',
        element: <ProtectedRoute><QuizHistory /></ProtectedRoute>,
    },
    {
        path: '/QuickEase-Web/MyNotes',
        element: <ProtectedRoute><MyNotes /></ProtectedRoute>,
    },
    {
        path: '/QuickEase-Web/FlashCardhistory',
        element: <ProtectedRoute><FlashCardHistory /></ProtectedRoute>,
    },
    {
        path: '/QuickEase-Web/PomodoroSettings',
        element: <ProtectedRoute><PomodoroSettings /></ProtectedRoute>,
    },
    {
        path: '/QuickEase-Web/Settings',
        element: <ProtectedRoute><Settings /></ProtectedRoute>,
    },
    {
        path: '/QuickEase-Web/Notes/:id',
        element: <ProtectedRoute><Notes /></ProtectedRoute>,
    },
    {
        path: '/QuickEase-Web/Profile',
        element: <ProtectedRoute><Profile /></ProtectedRoute>,
    },
    {
        path: '/QuickEase-Web/Flashcards/:noteId',
        element: <ProtectedRoute><Flashcards /></ProtectedRoute>,
    },
    {
        path: '/QuickEase-Web/Quiz/:id',  
        element: <ProtectedRoute><Quiz /></ProtectedRoute>,
    },
    {
        path: '/QuickEase-Web/Results/:id', 
        element: <ProtectedRoute><Results /></ProtectedRoute>,
    },
    {
        path: '/QuickEase-Web/Review/:id',  
        element: <ProtectedRoute><Review /></ProtectedRoute>,
    },
    {
        path: '/QuickEase-Web/TranscribeError',
        element: <ProtectedRoute><TranscribeError /></ProtectedRoute>,
    },
]);