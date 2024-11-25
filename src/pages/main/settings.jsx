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
				className={`transition-all duration-300 flex-grow p-6 lg:p-8 mt-16 lg:mt-0 ${
					sidebarExpanded ? 'lg:ml-72' : 'lg:ml-28'
				}`}>
				<div className="w-full max-w-5xl">
					{/* Header */}
					<div className="mb-8">
						<h1 className="text-2xl font-pbold text-darkbg-darken dark:text-zinc-100">
							Settings
						</h1>
						<p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
							Manage your account preferences and settings
						</p>
					</div>

					{/* Appearance Section */}
					<section className="mb-8">
						<div className="mb-4">
							<h2 className="text-lg font-psemibold text-darkbg-darken dark:text-zinc-100">
								Appearance
							</h2>
							<p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
								Control how you see the world.
							</p>
						</div>

						<div className="bg-white dark:bg-darken rounded-lg border border-zinc-200 dark:border-zinc-800 w-full max-w-2xl">
							<div className="p-4">
								<label className="flex items-center justify-between">
									<div className="flex items-center gap-x-3">
										<span className="text-sm font-pmedium text-darkbg-darken dark:text-zinc-100">
											Dark Mode
										</span>
									</div>
									<button
										type="button"
										role="switch"
										aria-checked={isDarkMode}
										onClick={toggleDarkMode}
										className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
											isDarkMode ? 'bg-primary' : 'bg-zinc-200 dark:bg-zinc-700'
										}`}>
										<span
											className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
												isDarkMode ? 'translate-x-5' : 'translate-x-0'
											}`}
										/>
									</button>
								</label>
							</div>
						</div>
					</section>

					{/* Security Section */}
					<section>
						<div className="mb-4">
							<h2 className="text-lg font-psemibold text-darkbg-darken dark:text-zinc-100">
								Security
							</h2>
							<p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
								Sometimes, you need to lock things away.
							</p>
						</div>

						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-2xl">
							{/* Change Password Card */}
							<button
								onClick={openPasswordModal}
								className="group relative flex items-center gap-x-4 rounded-lg bg-white dark:bg-darken p-4 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-200">
								<div className="flex h-10 w-10 flex-none items-center justify-center rounded-lg bg-primary/10 dark:bg-primary/20 group-hover:bg-primary/20">
									<FontAwesomeIcon 
										icon={faLock} 
										className="h-4 w-4 text-primary"
									/>
								</div>
								<div className="text-left">
									<h3 className="font-psemibold text-darkbg-darken dark:text-zinc-100">
										Change Password
									</h3>
									<p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
										Strength lies in security.
									</p>
								</div>
							</button>

							{/* Deactivate Account Card 
							<button
								onClick={openDeactivateModal}
								className="group relative flex items-center gap-x-4 rounded-lg bg-white dark:bg-darken p-4 border border-zinc-200 dark:border-zinc-800 hover:border-red-200 dark:hover:borde-darkbg-darken/50 transition-all duration-200">
								<div className="flex h-10 w-10 flex-none items-center justify-center rounded-lg bg-red-500/10 group-hover:bg-red-500/20">
									<FontAwesomeIcon 
										icon={faTrash} 
										className="h-4 w-4 text-red-500"
									/>
								</div>
								<div className="text-left">
									<h3 className="font-psemibold text-darkbg-darken dark:text-zinc-100">
										Deactivate Account
									</h3>
									<p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
										End your journey here.
									</p>
								</div>
							</button>
							*/}
						</div>
					</section>
				</div>
			</main>

			{/* Modals */}
			<ChangePasswordModal isOpen={isPasswordModalOpen} onClose={closePasswordModal} />
			<DeactivateAccountModal isOpen={isDeactivateModalOpen} onClose={closeDeactivateModal} />
		</div>
	);
}
