import React, { useState } from 'react';
import { img } from '../constants';
import { useDarkMode } from '../features/Darkmode/darkmodeProvider';
import TermsAndConditionsModal from './Policies/termsAndConditions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
	faEnvelope, 
	faPhone, 
	faArrowRight,
	faQrcode,
	faShieldHalved
} from '@fortawesome/free-solid-svg-icons';
import { faFacebookF } from '@fortawesome/free-brands-svg-icons';

const Footer = () => {
	const currentYear = new Date().getFullYear();
	const { isDarkMode } = useDarkMode();
	const [showModal, setShowModal] = useState(false);

	return (
		<footer className={`relative overflow-hidden ${
			isDarkMode 
				? 'bg-gradient-to-b from-[#171717] to-[#0A0A0A]' 
				: 'bg-gradient-to-b from-zinc-100 to-white'
		}`}>
			{/* Enhanced Background Effects */}
			<div className="absolute inset-0">
				<div className={`absolute w-[800px] h-[800px] rounded-full blur-[120px] 
					-bottom-1/2 -left-1/4 animate-spin-slower
					${isDarkMode
						? 'bg-gradient-conic from-primary/10 via-review/10 to-secondary/10'
						: 'bg-gradient-conic from-primary/20 via-review/20 to-secondary/20'
					}`}
				/>
				<div className={`absolute w-[600px] h-[600px] rounded-full blur-[100px] 
					-top-1/4 -right-1/4 animate-spin-slow
					${isDarkMode
						? 'bg-gradient-conic from-secondary/10 via-primary/10 to-review/10'
						: 'bg-gradient-conic from-secondary/20 via-primary/20 to-review/20'
					}`}
				/>
				<div className={`absolute inset-0 bg-grid-pattern ${
					isDarkMode ? 'opacity-5' : 'opacity-10'
				}`} />
			</div>

			<div className="relative max-w-7xl mx-auto px-6 pt-32 pb-12">
				{/* Main Content */}
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
					{/* Left Column - Mascot & App Download */}
					<div className="relative">
						<div className="relative z-10 space-y-8">
							{/* App Download Section */}
							<div className="max-w-md">
								<h2 className="text-5xl sm:text-6xl font-pbold leading-tight">
									<span className={`${
										isDarkMode
											? 'bg-gradient-to-r from-white via-white/90 to-white/70'
											: 'bg-gradient-to-r from-zinc-800 via-zinc-700 to-zinc-600'
									} bg-clip-text text-transparent`}>
										Get Our App
									</span>
								</h2>
								<p className={`mt-4 text-lg ${
									isDarkMode ? 'text-white/60' : 'text-zinc-600'
								}`}>
									Transform your learning experience with QuickEase
								</p>
							</div>

							{/* QR Code */}
							<div className="relative group w-fit">
								<div className="absolute -inset-1 bg-gradient-to-r from-primary via-review 
									to-secondary rounded-2xl blur opacity-25 group-hover:opacity-75 
									transition duration-300"
								/>
								<div className={`relative p-6 rounded-2xl flex items-center gap-6 ${
									isDarkMode 
										? 'bg-zinc-900/50' 
										: 'bg-white shadow-lg'
								} backdrop-blur-sm`}>
									<img 
										src={img.QrCode} 
										alt="QR code" 
										className="w-32 h-32"
									/>
									<div>
										<div className={`flex items-center gap-2 mb-2 ${
											isDarkMode ? 'text-white/80' : 'text-zinc-800'
										}`}>
											<FontAwesomeIcon icon={faQrcode} className="text-primary" />
											<span className="font-pmedium">Scan to Download</span>
										</div>
										<p className={`text-sm ${
											isDarkMode ? 'text-white/40' : 'text-zinc-500'
										}`}>
											Available for Android Only
										</p>
									</div>
								</div>
							</div>
						</div>

						{/* Mascot Image */}
						<div className="absolute bottom-0 right-0 w-72 h-72 opacity-80">
							<img
								src={isDarkMode ? img.quick : img.Mascot}
								alt={isDarkMode ? 'NightWing Mascot' : 'Quickie Mascot'}
								className="w-full h-full object-contain animate-float"
							/>
						</div>
					</div>

					{/* Right Column - Links & Contact */}
					<div className="relative">
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-12">
							{/* Contact Section */}
							<div className="space-y-6">
								<h3 className={`text-lg font-psemibold tracking-wider ${
									isDarkMode ? 'text-white' : 'text-zinc-800'
								}`}>
									CONNECT WITH US
								</h3>
								<div className="space-y-4">
									<a href="mailto:quickease.team@gmail.com" 
											className={`group flex items-center gap-3 transition-colors ${
												isDarkMode 
													? 'text-white/60 hover:text-white' 
													: 'text-zinc-600 hover:text-zinc-900'
											}`}>
										<div className={`w-8 h-8 rounded-lg flex items-center justify-center 
											transition-colors ${
												isDarkMode 
													? 'bg-white/5 group-hover:bg-primary/10' 
													: 'bg-zinc-100 group-hover:bg-primary/10'
											}`}>
											<FontAwesomeIcon icon={faEnvelope} className="text-primary" />
										</div>
										<span>quickease.team@gmail.com</span>
									</a>
									<div className={`group flex items-center gap-3 ${
										isDarkMode ? 'text-white/60' : 'text-zinc-600'
									}`}>
										<div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
											isDarkMode ? 'bg-white/5' : 'bg-zinc-100'
										}`}>
											<FontAwesomeIcon icon={faPhone} className="text-review" />
										</div>
										<span>0967 665 3378</span>
									</div>
									<a href="https://www.facebook.com/quickease.ph" 
										target="_blank"
										className={`group flex items-center gap-3 transition-colors ${
											isDarkMode 
												? 'text-white/60 hover:text-white' 
												: 'text-zinc-600 hover:text-zinc-900'
										}`}>
										<div className={`w-8 h-8 rounded-lg flex items-center justify-center 
											transition-colors ${
												isDarkMode 
													? 'bg-white/5 group-hover:bg-secondary/10' 
													: 'bg-zinc-100 group-hover:bg-secondary/10'
											}`}>
											<FontAwesomeIcon icon={faFacebookF} className="text-blue-500" />
										</div>
										<span>Facebook</span>
									</a>
								</div>
							</div>

							{/* Legal Section */}
							<div className="space-y-6">
								<h3 className={`text-lg font-psemibold tracking-wider ${
									isDarkMode ? 'text-white' : 'text-zinc-800'
								}`}>
									LEGAL
								</h3>
								<button 
									onClick={() => setShowModal(true)}
									 className={`group flex items-center gap-3 transition-colors ${
											isDarkMode 
												? 'text-white/60 hover:text-white' 
												: 'text-zinc-600 hover:text-zinc-900'
										}`}
								>
									<div className={`w-8 h-8 rounded-lg flex items-center justify-center 
										transition-colors ${
											isDarkMode 
												? 'bg-white/5 group-hover:bg-review/10' 
												: 'bg-zinc-100 group-hover:bg-review/10'
										}`}>
										<FontAwesomeIcon icon={faShieldHalved} className="text-review" />
									</div>
									<span>Privacy Policy & Terms</span>
									<FontAwesomeIcon 
										icon={faArrowRight} 
										className="text-sm opacity-0 group-hover:opacity-100 
											group-hover:translate-x-1 transition-all" 
									/>
								</button>
							</div>
						</div>
					</div>
				</div>

				{/* Copyright */}
				<div className={`mt-20 pt-8 border-t ${
					isDarkMode ? 'border-white/5' : 'border-zinc-200'
				}`}>
					<p className={isDarkMode ? 'text-center text-white/40' : 'text-center text-zinc-500'}>
						© {currentYear} <span className={
							isDarkMode ? 'font-pmedium text-white/60' : 'font-pmedium text-zinc-700'
						}>QuickEase</span>. All rights reserved.
					</p>
				</div>
			</div>

			<TermsAndConditionsModal isOpen={showModal} onClose={() => setShowModal(false)} />
		</footer>
	);
};

export default Footer;
