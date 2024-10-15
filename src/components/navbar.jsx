import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	return (
		<nav className="w-full absolute top-0 left-0 z-50">
			<div className=" px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between items-center h-16 sm:h-20">
					<div className="flex-shrink-0 flex items-center">
						<h1 className="text-xl sm:text-5xl font-inc">
							<span className="text-white">Quick</span>
							<span className="text-primary">Ease</span>
						</h1>
					</div>
					<div className="hidden sm:flex sm:items-center space-x-4">
						<Link
							to="/QuickEase-Web/SignIn"
							className="px-3 py-2 rounded-md text-lg sm:text-xl text-white font-pregular hover:bg-white hover:bg-opacity-20 transition duration-300">
							Sign In
							
						</Link>

					</div>
					<div className="sm:hidden">
						<button
							onClick={() => setIsMenuOpen(!isMenuOpen)}
							className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-white hover:bg-opacity-20 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
							<span className="sr-only">Open main menu</span>
							<svg
								className="h-6 w-6"
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
							</svg>
						</button>
					</div>
				</div>
			</div>
			{isMenuOpen && (
				<div className="sm:hidden absolute top-16 left-0 w-full bg-white shadow-md rounded-md">
					<div className="px-2 pt-2 pb-3 space-y-1">
						<Link
							to="/QuickEase-Web/SignIn"
							className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">
							Sign In
						</Link>
						<Link
							to="/QuickEase-Web/SignUp"
							className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">
							Join Now
						</Link>
					</div>
				</div>
			)}
		</nav>
	);
};

export default Navbar;
