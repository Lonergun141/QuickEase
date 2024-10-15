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
        path: '/QuickEase/activate/:uid/:token',
        element: <ActivateAccount />,
    },
    {
        path: '/QuickEase/password/reset/confirm/:uid/:token',
        element: <ResetPass />,
    },
    {
        path: '/QuickEase/Home',
        element: <Home />
    },
    {
        path: '/QuickEase/QuizHistory',
        element:<QuizHistory />
    },
    {
        path: '/QuickEase/MyNotes',
        element: <MyNotes />
    },
    {
        path: '/QuickEase/FlashCardhistory',
        element: <FlashCardHistory />
    },
    {
        path: '/QuickEase/PomodoroSettings',
        element:<PomodoroSettings />
    },
    {
        path: '/QuickEase/Settings',
        element: <Settings />,
    },
    {
        path: '/QuickEase/Notes/:id',
        element: <Notes />,
    },
    {
        path: '/QuickEase/Profile',
        element: <Profile />,
    },
    {
        path: '/QuickEase/Flashcards/:noteId',
        element: <Flashcards />,
    },
    {
        path: '/QuickEase/Quiz/:id',  
        element: <Quiz />,
    },
    {
        path: '/QuickEase/Results/:id', 
        element: <Results />,
    },
    {
        path: '/QuickEase/Review/:id',  
        element: <Review />,
    },
    {
        path: '/QuickEase/TranscribeError',
        element:<TranscribeError />,
    },
]);