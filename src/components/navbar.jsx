import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDarkMode } from '../features/Darkmode/darkmodeProvider';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faMoon } from '@fortawesome/free-solid-svg-icons';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { isDarkMode, toggleDarkMode } = useDarkMode();

    return (
        <nav className={`fixed w-full z-50 transition-colors duration-200
            ${isDarkMode 
                ? 'bg-dark/60 border-white/5' 
                : 'bg-white/80 border-zinc-200'
            } backdrop-blur-xl border-b`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    {/* Logo */}
                    <Link to="/" className="group flex items-center space-x-2">
                        <div className="relative">
                            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-secondary 
                                rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-200"
                            />
                            <h3 className={`relative text-2xl font-inc
                                ${isDarkMode ? 'text-white' : 'text-zinc-800'}`}
                            >
                                <span className="text-primary">Quick</span>Ease
                            </h3>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden sm:flex items-center space-x-8">
                        {/* Dark Mode Toggle */}
                        <button
                            onClick={toggleDarkMode}
                            className={`relative p-2 rounded-xl transition-colors
                                ${isDarkMode 
                                    ? 'hover:bg-white/5 text-white/80' 
                                    : 'hover:bg-zinc-100 text-zinc-700'
                                }`}
                            aria-label={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
                        >
                            <FontAwesomeIcon 
                                icon={isDarkMode ? faMoon : faSun}
                                className={`text-lg ${isDarkMode ? 'text-secondary' : 'text-primary'}`}
                            />
                        </button>

                        {/* Sign In Link */}
                        <Link
                            to="/SignIn"
                            className={`relative font-aceh group
                                ${isDarkMode ? 'text-white' : 'text-zinc-800'}`}
                        >
                            <span className="relative z-10">SIGN IN</span>
                            <span className={`absolute bottom-0 left-0 w-0 h-0.5 
                                bg-primary group-hover:w-full transition-all duration-300`}
                            />
                        </Link>

                        {/* Join Now Button */}
                        <Link
                            to="/SignUp"
                            className={`relative overflow-hidden px-8 py-3 rounded-xl font-aceh 
                                transition-all duration-300 group
                                ${isDarkMode 
                                    ? 'bg-white text-dark hover:bg-secondary hover:text-primary' 
                                    : 'bg-primary text-white hover:text-dark'
                                }`}
                        >
                            <span className="relative z-10">JOIN NOW</span>
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className={`sm:hidden relative p-2 rounded-xl focus:outline-none group
                            ${isDarkMode
                                ? 'text-white hover:text-secondary'
                                : 'text-zinc-800 hover:text-primary'
                            }`}
                        aria-label="Toggle menu"
                    >
                        <div className={`absolute inset-0 rounded-xl transition-colors duration-200
                            ${isDarkMode
                                ? 'bg-white/5 group-hover:bg-white/10'
                                : 'bg-zinc-100 group-hover:bg-zinc-200'
                            }`}
                        />
                        <span className="relative">
                            {isMenuOpen ? (
                                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            ) : (
                                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            )}
                        </span>
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="sm:hidden absolute w-full">
                    <div className={`mx-4 mt-2 p-4 rounded-xl border shadow-2xl
                        ${isDarkMode 
                            ? 'bg-zinc-900/95 border-white/5' 
                            : 'bg-white border-zinc-200'
                        } backdrop-blur-xl`}
                    >
                        <div className="space-y-3">
                            {/* Dark Mode Toggle - Mobile */}
                            <button
                                onClick={toggleDarkMode}
                                className={`flex items-center w-full p-3 rounded-lg transition-colors
                                    ${isDarkMode
                                        ? 'text-white hover:bg-white/5'
                                        : 'text-zinc-800 hover:bg-zinc-100'
                                    }`}
                            >
                                <FontAwesomeIcon 
                                    icon={isDarkMode ? faMoon : faSun}
                                    className={`mr-3 ${isDarkMode ? 'text-secondary' : 'text-primary'}`}
                                />
                                {isDarkMode ? 'Dark Mode' : 'Light Mode'}
                            </button>

                            {/* Sign In Link - Mobile */}
                            <Link
                                to="/SignIn"
                                className={`block w-full p-3 rounded-lg transition duration-200
                                    ${isDarkMode
                                        ? 'text-white hover:bg-white/5'
                                        : 'text-zinc-800 hover:bg-zinc-100'
                                    }`}
                            >
                                SIGN IN
                            </Link>

                            {/* Join Now Button - Mobile */}
                            <Link
                                to="/SignUp"
                                className={`block w-full p-3 rounded-lg text-center transition-all duration-300
                                    ${isDarkMode
                                        ? 'bg-white text-dark  hover:text-primary'
                                        : 'bg-primary text-white '
                                    }`}
                            >
                                JOIN NOW
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
