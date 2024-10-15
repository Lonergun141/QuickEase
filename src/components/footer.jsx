import React, { useState } from 'react';
import { img } from '../constants';
import { useDarkMode } from '../features/Darkmode/darkmodeProvider';
import TermsAndConditionsModal from './Policies/termsAndConditions';

const Footer = () => {
	const currentYear = new Date().getFullYear();
	const { isDarkMode } = useDarkMode();
	const [showModal, setShowModal] = useState(false);

	const toggleModal = () => {
		setShowModal(!showModal);
	};

	return (
		<>
			<footer className="relative min-h-screen flex flex-col md:flex-row justify-between items-end overflow-hidden bg-[#DEECFA] dark:bg-dark">
				<div className="absolute bottom-0 left-0 right-0 h-[50%] md:h-[60%] bg-gradient-to-t from-[#DEECFA] to-transparent z-10 dark:bg-gradient-to-t dark:from-[#171717] dark:to-transparent"></div>

				<div className="flex justify-center md:justify-start items-end z-0 w-full md:w-1/2">
					<img
						src={isDarkMode ? img.quick : img.Mascot}
						alt={isDarkMode ? 'NightWing Mascot' : 'Quickie Mascot'}
						className="w-full h-auto max-h-full object-contain opacity-80 animate-float"
					/>
				</div>

				<div className="relative z-20 p-6 w-full md:w-1/2 flex flex-col items-center md:items-start space-y-6 mb-16">
					<h2 className="text-3xl md:text-4xl font-pmedium mb-4 text-center md:text-left">Get OUR APP NOW</h2>
					<img src={img.QrCode} alt="QR code" className="w-40 md:w-64 mb-4 rounded-lg" />
					<p className="text-center md:text-left font-pregular dark:text-secondary">Scan the code to download</p>
					<div className="flex flex-col sm:flex-row sm:justify-start sm:space-x-20 text-center md:text-left mt-10 text-sm">
						<div className="mb-6 sm:mb-0">
							<p className="font-semibold dark:text-secondary">LEGAL</p>
							<ul className="mt-2 space-y-2 cursor-pointer">
								<li onClick={toggleModal}>Privacy Policy & Terms of Service</li>
							
							</ul>
						</div>
						<div>
							<p className="font-semibold dark:text-secondary">TALK TO US</p>
							<ul className="mt-2 space-y-2 dark:text-naeg cursor-pointer">
								<li onClick={() => window.open('mailto:quickease.team@gmail.com')}>quickease.team@gmail.com</li>
								<li>0967 665 3378</li>
								<li onClick={() => window.open('https://www.facebook.com/quickease.ph', '_blank')}>Facebook</li>
							</ul>
						</div>
					</div>
				</div>

				<div className="w-full text-center py-4 mt-6 z-20 absolute bottom-0 left-0 right-0">
					<p className="text-sm text-gray-600">© {currentYear} QuickEase. All rights reserved.</p>
				</div>
			</footer>

			{/* Use the Terms and Conditions Modal */}
			<TermsAndConditionsModal isOpen={showModal} onClose={toggleModal} />
		</>
	);
};

export default Footer;
