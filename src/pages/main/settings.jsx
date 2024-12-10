import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faSun, faMoon } from '@fortawesome/free-solid-svg-icons';
import Sidebar from '../../components/sidebar';
import { useDarkMode } from '../../features/Darkmode/darkmodeProvider';
import ChangePasswordModal from '../../components/Modals/changePasswordModal';
import DeactivateAccountModal from '../../components/Modals/deactivateAccountModal';

export default function Settings() {
	const [sidebarExpanded, setSidebarExpanded] = useState(true);
	const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
	const [isDeactivateModalOpen, setIsDeactivateModalOpen] = useState(false);
	const { isDarkMode, toggleDarkMode } = useDarkMode();

	const handleSidebarToggle = (isExpanded) => {
		setSidebarExpanded(isExpanded);
	};

	const SettingsCard = ({ icon, title, description, onClick, actionComponent }) => (
		<div className="bg-white dark:bg-zinc-800 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border border-zinc-200 dark:border-zinc-700 overflow-hidden">
			<div className="flex items-center p-4 space-x-4 group">
				<div className="bg-primary/10 dark:bg-primary/20 p-3 rounded-xl">{icon}</div>
				<div className="flex-grow">
					<h3 className="text-base font-semibold text-zinc-800 dark:text-zinc-100">{title}</h3>
					<p className="text-sm text-zinc-500 dark:text-zinc-400">{description}</p>
				</div>
				{actionComponent || (
					<button
						onClick={onClick}
						className="text-zinc-500 hover:text-primary transition-colors">
						<FontAwesomeIcon icon={faLock} className="h-5 w-5" />
					</button>
				)}
			</div>
		</div>
	);

	return (
		<div className="flex flex-col lg:flex-row min-h-screen bg-zinc-50 dark:bg-zinc-900 w-full">
			<Sidebar onToggle={handleSidebarToggle} />

			<main
				className={`transition-all duration-300 flex-grow p-6 lg:p-8 mt-16 lg:mt-0 ${
					sidebarExpanded ? 'lg:ml-72' : 'lg:ml-28'
				}`}>
				<div className="w-full max-w-4xl mx-auto space-y-8">
					{/* Header */}
					<header className="text-center lg:text-left">
						<h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
							Account Settings
						</h1>
						<p className="text-zinc-600 dark:text-zinc-400 max-w-xl mx-auto lg:mx-0">
							Customize your experience and manage your account preferences
						</p>
					</header>

					{/* Appearance Section */}
					<section>
						<h2 className="text-xl font-semibold text-zinc-800 dark:text-zinc-100 mb-4">
							Appearance
						</h2>
						<SettingsCard
							icon={
								<FontAwesomeIcon
									icon={isDarkMode ? faMoon : faSun}
									className="h-5 w-5 text-primary"
								/>
							}
							title="Dark Mode"
							description="Customize your visual experience"
							actionComponent={
								<button
									onClick={toggleDarkMode}
									className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
										isDarkMode ? 'bg-primary' : 'bg-zinc-200 dark:bg-zinc-700'
									}`}>
									<span
										className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
											isDarkMode ? 'translate-x-5' : 'translate-x-0'
										}`}
									/>
								</button>
							}
						/>
					</section>

					{/* Security Section */}
					<section>
						<h2 className="text-xl font-semibold text-zinc-800 dark:text-zinc-100 mb-4">
							Security
						</h2>
						<div className="space-y-4 cursor-pointer" onClick={() => setIsPasswordModalOpen(true)}>
							<SettingsCard
								icon={<FontAwesomeIcon icon={faLock} className="h-5 w-5 text-primary" />}
								title="Change Password"
								description="Protect your account with a strong password"
								
							/>
						</div>
					</section>
				</div>
			</main>

			{/* Modals */}
			<ChangePasswordModal
				isOpen={isPasswordModalOpen}
				onClose={() => setIsPasswordModalOpen(false)}
			/>
			<DeactivateAccountModal
				isOpen={isDeactivateModalOpen}
				onClose={() => setIsDeactivateModalOpen(false)}
			/>
		</div>
	);
}
