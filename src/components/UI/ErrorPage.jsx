import React from 'react';

const ErrorPage = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-darken text-gray-900 dark:text-gray-300 text-center relative p-10 overflow-hidden">
            <div className="max-w-md mx-auto">
                <h2 className="text-3xl font-semibold">Oops! Looks like you’ve taken a wrong turn.</h2>
                <p className="mt-4 text-lg">
                    Unfortunately, the page you are looking for is not available. It might have been removed or never existed.
                </p>
                <p className="mt-2 text-lg">
                    Don’t worry; you can always go back to our homepage and start fresh!
                </p>
            </div>

            <a
                href="/"
                className="mt-8 bg-black text-white px-6 py-3 rounded-lg shadow-lg hover:bg-gray-800 transition-colors duration-300"
            >
                Go to Homepage
            </a>

            <div className="absolute bottom-10 left-10">
                <h1 className="text-[8rem] md:text-[10rem] lg:text-[12rem] font-bold tracking-tight opacity-10">
                    404
                </h1>
            </div>

            <svg className="absolute top-10 right-10 w-24 h-24 opacity-20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v6l4 2" />
            </svg>

            <svg className="absolute bottom-20 right-20 w-20 h-20 opacity-20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M3 12h18M3 6h18M3 18h18" />
            </svg>

            <svg className="absolute top-40 left-40 w-20 h-20 opacity-20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <rect width="20" height="20" x="2" y="2" rx="5" />
            </svg>
        </div>
    );
};

export default ErrorPage;
