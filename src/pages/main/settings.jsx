import React, { useState } from 'react';
import Sidebar from '../../components/sidebar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faLock } from '@fortawesome/free-solid-svg-icons';
import ChangePasswordModal from '../../components/Modals/changePasswordModal';
import DeactivateAccountModal from '../../components/Modals/deactivateAccountModal';
import { useDarkMode } from '../../features/Darkmode/darkmodeProvider';

export default function Settings() {
	const [sidebarExpanded, setSidebarExpanded] = useState(true);
	const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
	const [isDeactivateModalOpen, setIsDeactivateModalOpen] = useState(false);
	const { isDarkMode, toggleDarkMode } = useDarkMode();

	const handleSidebarToggle = (isExpanded) => {
		setSidebarExpanded(isExpanded);
	};

	const openPasswordModal = () => {
		setIsPasswordModalOpen(true);
	};

	const closePasswordModal = () => {
		setIsPasswordModalOpen(false);
	};

	const openDeactivateModal = () => {
		setIsDeactivateModalOpen(true);
	};

	const closeDeactivateModal = () => {
		setIsDeactivateModalOpen(false);
	};

	return (
		<div className="flex flex-col lg:flex-row min-h-screen bg-secondary dark:bg-dark w-full">
			<Sidebar onToggle={handleSidebarToggle} />
			<main
				className={`transition-all duration-300 flex-grow p-6 lg:p-12 mt-16 lg:mt-0 ${
					sidebarExpanded ? 'lg:ml-72' : 'lg:ml-28'
				}`}>
				<h3 className="text-4xl lg:text-5xl font-extrabold text-highlights mb-12 dark:text-white">Settings</h3>

				{/* Appearance Section */}
				<section className="mb-12">
					<h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Appearance</h3>
					<p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Control how you see the world.</p>
					<div className="bg-white dark:bg-darken p-6 rounded-xl shadow-lg flex justify-between items-center">
						<label className="flex items-center">
							<div className="relative">
								<input type="checkbox" className="sr-only" checked={isDarkMode} onChange={toggleDarkMode} />
								<div className="block bg-gray-300 dark:bg-dark w-14 h-8 rounded-full shadow-inner"></div>
								<div
									className={`dot absolute left-1 top-1 bg-primary dark:bg-gray-400 w-6 h-6 rounded-full transition-transform ${
										isDarkMode ? 'transform translate-x-6 bg-primary' : 'bg-secondary'
									}`}></div>
							</div>
							<span className="text-xl font-semibold text-gray-900 dark:text-white ml-8">Dark Mode</span>
						</label>
					</div>
				</section>

				{/* Security Section */}
				<section className="mb-12">
					<h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Security</h3>
					<p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Sometimes, you need to lock things away.</p>
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8">
						{/* Deactivate Account Card */}
						<div
							className="bg-white dark:bg-darken p-6 rounded-xl shadow-lg flex items-center justify-between cursor-pointer hover:shadow-2xl transform hover:scale-105 transition duration-300 ease-in-out"
							onClick={openDeactivateModal}>
							<div className="flex items-center">
								<div className="p-4 rounded-full">
									<FontAwesomeIcon icon={faTrash} className="text-red-500 text-3xl" />
								</div>
								<div className="ml-6">
									<p className="text-xl font-semibold text-gray-900 dark:text-white">Deactivate Account</p>
									<p className="text-sm text-gray-400 mt-1">End your journey here.</p>
								</div>
							</div>
						</div>

						{/* Change Password Card */}
						<div
							className="bg-white dark:bg-darken p-6 rounded-xl shadow-lg flex items-center justify-between cursor-pointer hover:shadow-2xl transform hover:scale-105 transition duration-300 ease-in-out"
							onClick={openPasswordModal}>
							<div className="flex items-center">
								<div className="p-4  rounded-full">
									<FontAwesomeIcon icon={faLock} className="text-green-500 text-3xl" />
								</div>
								<div className="ml-6">
									<p className="text-xl font-semibold text-gray-900 dark:text-white">Change Password</p>
									<p className="text-sm text-gray-400 mt-1">Strength lies in security.</p>
								</div>
							</div>
						</div>
					</div>
				</section>
			</main>

			{/* Modals for Password Change and Deactivation */}
			<ChangePasswordModal isOpen={isPasswordModalOpen} onClose={closePasswordModal} />
			<DeactivateAccountModal isOpen={isDeactivateModalOpen} onClose={closeDeactivateModal} />
		</div>
	);
}
