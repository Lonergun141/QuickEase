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


import LoadingScreen from '../components/loader';
import TranscribeError from '../pages/main/transcribeError';
import ErrorPage from '../components/UI/ErrorPage';

export const router = createBrowserRouter([
    {
        path: '*',
        element: <ErrorPage />,
    },
    {
        path: '/',
        element: <App/>,
    },
    {
        path: '/Loader',
        element: <LoadingScreen />,
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
        element: <Home />
    },
    {
        path: '/QuizHistory',
        element:<QuizHistory />
    },
    {
        path: '/MyNotes',
        element: <MyNotes />
    },
    {
        path: '/FlashCardhistory',
        element: <FlashCardHistory />
    },
    {
        path: '/PomodoroSettings',
        element:<PomodoroSettings />
    },
    {
        path: '/Settings',
        element: <Settings />,
    },
    {
        path: '/Notes/:id',
        element: <Notes />,
    },
    {
        path: '/Profile',
        element: <Profile />,
    },
    {
        path: '/Flashcards/:noteId',
        element: <Flashcards />,
    },
    {
        path: '/Quiz/:id',  
        element: <Quiz />,
    },
    {
        path: '/Results/:id', 
        element: <Results />,
    },
    {
        path: '/Review/:id',  
        element: <Review />,
    },
    {
        path: '/TranscribeError',
        element:<TranscribeError />,
    },
]);