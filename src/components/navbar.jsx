import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <nav className="w-full bg-dark bg-opacity-60 backdrop-blur-lg z-50 shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">

                <Link to="/" className="flex items-center">
                    <h3 className="text-2xl font-inc text-white">
                        <span className="text-primary">Quick</span>Ease
                    </h3>
                </Link>

                <div className="hidden sm:flex space-x-6 items-center justify-center">
                    <Link
                        to="/SignIn"
                        className="text-white font-aceh hover:text-primary transition duration-200">
                        SIGN IN
                    </Link>
                    <Link
                        to="/SignUp"
                        className="text-dark bg-white px-8 py-3 rounded-lg font-aceh hover:text-primary transition duration-200">
                        JOIN NOW
                    </Link>
                </div>

                {/* Mobile Menu Button */}
                <div className="sm:hidden">
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="p-2 rounded-md text-white hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary transition">
                        <span className="sr-only">Open menu</span>
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
                    </button>
                </div>
            </div>

  
            {isMenuOpen && (
                <div className="sm:hidden bg-dark bg-opacity-90 backdrop-blur-md shadow-lg rounded-md mx-4 mt-2 py-4">
                    <div className="space-y-2 px-4">
                        <Link
                            to="/SignIn"
                            className="block font-medium text-white hover:text-primary transition duration-200 rounded-md px-4 py-2">
                            SIGN IN
                        </Link>
                        <Link
                            to="/SignUp"
                            className="block font-medium text-white hover:text-primary transition duration-200 rounded-md px-4 py-2">
                            JOIN NOW
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
