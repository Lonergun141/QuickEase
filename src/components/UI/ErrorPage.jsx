import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const ErrorPage = () => {
    return (
        <div className="relative min-h-screen bg-zinc-50 dark:bg-dark overflow-hidden">
            {/* Background Patterns */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/5 to-secondary/5 
                    dark:from-secondary/5 dark:to-primary/5 opacity-60" />
                <div className="absolute -top-1/4 -right-1/4 w-1/2 h-1/2 bg-primary/5 dark:bg-secondary/5 
                    rounded-full blur-3xl" />
                <div className="absolute -bottom-1/4 -left-1/4 w-1/2 h-1/2 bg-secondary/5 dark:bg-primary/5 
                    rounded-full blur-3xl" />
            </div>

            {/* Main Content */}
            <div className="relative flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-2xl mx-auto text-center">
                    
                    {/* 404 Text */}
                    <motion.div
                        initial={{ scale: 0.5 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="relative">
                        <h1 className="text-[8rem] sm:text-[10rem] lg:text-[12rem] font-pbold 
                            bg-gradient-to-r from-primary to-secondary dark:from-secondary dark:to-primary 
                            opacity-10 select-none">
                            404
                        </h1>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full 
                                bg-primary/10 dark:bg-secondary/10 
                                flex items-center justify-center">
                                <span className="text-2xl sm:text-3xl text-primary dark:text-secondary">
                                    ¯\_(ツ)_/¯
                                </span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Error Message */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="mt-8 space-y-4">
                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-pbold 
                            text-newTxt dark:text-white">
                            Oops! Page Not Found
                        </h2>
                        <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 max-w-lg mx-auto">
                            The page you're looking for seems to have wandered off. 
                            Don't worry though, our homepage is just a click away!
                        </p>
                    </motion.div>

                    {/* Action Button */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.6 }}
                        className="mt-8">
                        <Link
                            to="/"
                            className="inline-flex items-center px-6 py-3 rounded-xl
                                bg-primary dark:bg-secondary text-white dark:text-dark
                                hover:opacity-90 transition-all duration-300
                                font-pmedium shadow-lg shadow-primary/25 dark:shadow-secondary/25">
                            Return to Homepage
                        </Link>
                    </motion.div>
                </motion.div>

                {/* Decorative Elements */}
                <div className="absolute inset-0 pointer-events-none">
                    {/* Circles */}
                    <div className="absolute top-20 left-20 w-4 h-4 rounded-full 
                        bg-primary/20 dark:bg-secondary/20 animate-ping" />
                    <div className="absolute bottom-20 right-20 w-4 h-4 rounded-full 
                        bg-secondary/20 dark:bg-primary/20 animate-ping delay-300" />
                    <div className="absolute top-1/4 right-1/4 w-2 h-2 rounded-full 
                        bg-primary/20 dark:bg-secondary/20 animate-ping delay-700" />
                    
                    {/* Lines */}
                    <div className="absolute top-0 left-1/4 w-px h-20 
                        bg-gradient-to-b from-transparent via-primary/20 dark:via-secondary/20 to-transparent" />
                    <div className="absolute bottom-0 right-1/4 w-px h-20 
                        bg-gradient-to-b from-transparent via-secondary/20 dark:via-primary/20 to-transparent" />
                </div>
            </div>
        </div>
    );
};

export default ErrorPage;
