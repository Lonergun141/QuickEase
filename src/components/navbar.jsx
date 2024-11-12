import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <nav className="fixed w-full bg-dark/60 backdrop-blur-xl border-b border-white/5 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    <Link to="/" className="group flex items-center space-x-2">
                        <div className="relative">
                            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-secondary rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-200"></div>
                            <h3 className="relative text-2xl font-inc text-white">
                                <span className="text-primary">Quick</span>Ease
                            </h3>
                        </div>
                    </Link>

                    <div className="hidden sm:flex items-center space-x-8">
                        <Link
                            to="/SignIn"
                            className="relative text-white font-aceh group"
                        >
                            <span className="relative z-10">SIGN IN</span>
                            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300"></span>
                        </Link>
                        <Link
                            to="/SignUp"
                            className="relative overflow-hidden px-8 py-3 rounded-xl bg-white font-aceh text-dark hover:text-primary transition duration-300 group"
                        >
                            <span className="relative z-10">JOIN NOW</span>
                            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-review/10 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                        </Link>
                    </div>

                    {/* Mobile Menu Button - Enhanced */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="sm:hidden relative p-2 rounded-xl text-white hover:text-primary focus:outline-none group"
                    >
                        <div className="absolute inset-0 bg-white/5 rounded-xl group-hover:bg-white/10 transition-colors duration-200"></div>
                        <span className="relative">
                            {isMenuOpen ? (
                                <svg
                                    className="h-6 w-6"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            ) : (
                                <svg
                                    className="h-6 w-6"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                </svg>
                            )}
                        </span>
                    </button>
                </div>
            </div>

            {/* Mobile Menu - Enhanced */}
            {isMenuOpen && (
                <div className="sm:hidden absolute w-full">
                    <div className="mx-4 mt-2 p-4 rounded-xl bg-zinc-900/95 backdrop-blur-xl border border-white/5 shadow-2xl">
                        <div className="space-y-3">
                            <Link
                                to="/SignIn"
                                className="block w-full p-3 rounded-lg text-white hover:bg-white/5 transition duration-200"
                            >
                                SIGN IN
                            </Link>
                            <Link
                                to="/SignUp"
                                className="block w-full p-3 rounded-lg bg-white/10 text-white hover:bg-white/15 transition duration-200"
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
