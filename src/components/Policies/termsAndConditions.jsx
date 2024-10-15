import React from 'react';

const TermsAndConditionsModal = ({ isOpen, onClose }) => {
	return (
		<>
			{isOpen && (
				<div
					className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
					onClick={onClose} // Close on background click
					role="dialog"
					aria-modal="true"
					aria-labelledby="terms-title">
					<div
						className="bg-white dark:bg-dark p-6 md:p-8 rounded-lg shadow-lg max-w-4xl mx-auto h-[80%] overflow-y-auto"
						onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
					>
						<h2 id="terms-title" className="text-3xl font-bold mb-4 text-dark dark:text-secondary">
							Terms and Conditions
						</h2>
						<p className="text-dark dark:text-secondary text-sm md:text-base">Effective Date: October 14, 2024</p>
						<p className="text-dark dark:text-secondary mb-4">
							Welcome to QuickEase! These Terms and Conditions govern your use of our web and mobile application. By accessing
							or using our platform, you agree to comply with and be bound by these terms. If you disagree with any part of the
							terms, please do not use our services.
						</p>

						{/* Section 1 */}
						<section className="mb-6">
							<h3 className="font-semibold mt-4 text-dark dark:text-secondary text-lg">1. GENERAL INFORMATION</h3>
							<p className="text-dark dark:text-secondary">
								QuickEase is a web and mobile application designed to assist students and general users in enhancing their study
								habits through automated text summarization, flashcard, and quiz generation. The platform also provides
								productivity tools that may help the users such as a Pomodoro Timer and Badge Achievements.
							</p>
						</section>

						{/* Section 2 */}
						<section className="mb-6">
							<h3 className="font-semibold mt-4 text-dark dark:text-secondary text-lg">2. USER ACCOUNTS</h3>
							<ul className="list-disc ml-5 mb-4">
								<li>
									<strong>Registration:</strong> Users must create an account to access QuickEase features.
								</li>
								<li>
									<strong>Age Requirement:</strong> While there is no strict age limit, users should be able to understand and
									properly use the platform.
								</li>
								<li>
									<strong>Bans and Restrictions:</strong> Users may be banned temporarily or permanently for violations, based on
									the severity of the violation.
								</li>
							</ul>
						</section>

						{/* Section 3 */}
						<section className="mb-6">
							<h3 className="font-semibold mt-4 text-dark dark:text-secondary text-lg">3. PROHIBITED ACTIVITIES</h3>
							<p className='text-dark dark:text-secondary'>Users are prohibited from uploading content that:</p>
							<ul className="list-disc ml-5 mb-4">
								<li>Contains offensive, abusive, or foul language.</li>
								<li>Violates applicable laws or third-party rights.</li>
							</ul>
						</section>

						{/* Section 4 */}
						<section className="mb-6">
							<h3 className="font-semibold mt-4 text-dark dark:text-secondary text-lg">4. INTELLECTUAL PROPERTY RIGHTS</h3>
							<ul className="list-disc ml-5 mb-4">
								<li>
									<strong>User-Generated Content:</strong> Users can upload text, files, and images to generate summaries,
									flashcards, and quizzes. QuickEase does not claim ownership of the uploaded materials.
								</li>
								<li>
									<strong>Copyright and Use:</strong> Users are allowed to share or distribute the content generated.
								</li>
							</ul>
						</section>

						{/* Section 5 */}
						<section className="mb-6">
							<h3 className="font-semibold mt-4 text-dark dark:text-secondary text-lg">5. PRIVACY AND DATA HANDLING</h3>
							<ul className="list-disc ml-5 mb-4">
								<li>
									<strong>Personal Data:</strong> QuickEase collects only essential personal data, such as user emails to send
									updates or notifications.
								</li>
								<li>
									<strong>Uploaded Content:</strong> Files and images uploaded for summary generation, flashcards, or quizzes are
									processed but not shared with third parties outside of our service.
								</li>
								<li>
									<strong>Third-Party Services:</strong> QuickEase integrates with the following services:
									<ul className="list-disc ml-5">
										<li>OpenAI API</li>
										<li>Cloud Vision API</li>
										<li>Convert API</li>
									</ul>
								</li>
							</ul>
						</section>

						{/* Section 6 */}
						<section className="mb-6">
							<h3 className="font-semibold mt-4 text-dark dark:text-secondary text-lg">6. DATA STORAGE AND DELETION</h3>
							<ul className="list-disc ml-5 mb-4">
								<li>Uploaded content is stored for processing purposes only.</li>
								<li>While accounts cannot be deleted, users may request to deactivate their accounts.</li>
							</ul>
						</section>

						{/* Section 7 */}
						<section className="mb-6">
							<h3 className="font-semibold mt-4 text-dark dark:text-secondary text-lg">7. PAYMENT AND SUBSCRIPTION</h3>
							<ul className="list-disc ml-5 mb-4">
								<li>
									<strong>Subscription:</strong> Users can subscribe to access unlimited features. Without a subscription, usage
									is limited to a free trial.
								</li>
								<li>
									<strong>Refund Policy:</strong> QuickEase does not offer refunds as users can preview services through the free
									trial.
								</li>
							</ul>
						</section>

						{/* Section 8 */}
						<section className="mb-6">
							<h3 className="font-semibold mt-4 text-dark dark:text-secondary text-lg">8. SERVICE AVAILABILITY</h3>
							<ul className="list-disc ml-5 mb-4">
								<li>
									Maintenance and Downtime: Users will be notified in advance for scheduled maintenance and will be informed as
									soon as possible of any unexpected downtimes.
								</li>
							</ul>
						</section>

						{/* Section 9 */}
						<section className="mb-6">
							<h3 className="font-semibold mt-4 text-dark dark:text-secondary text-lg">9. LIMITATIONS OF LIABILITY</h3>
							<ul className="list-disc ml-5 mb-4">
								<li>QuickEase provides tools to assist with study management but does not guarantee academic success.</li>
								<li>
									Users are responsible for how they use the app and must incorporate it as a complement to their regular study
									routines.
								</li>
								<li>The QuickEase team are not liable for any user outcomes, such as failed grades or lost time.</li>
							</ul>
						</section>

						{/* Section 10 */}
						<section className="mb-6">
							<h3 className="font-semibold mt-4 text-dark dark:text-secondary text-lg">10. CHANGES TO TERMS AND CONDITIONS</h3>
							<p className="text-dark dark:text-secondary">
								QuickEase reserves the right to modify these terms at any time. Users will be notified of significant changes.
								Continued use of the platform after changes implies acceptance of the modified terms.
							</p>
						</section>

						{/* Section 11 */}
						<section className="mb-6">
							<h3 className="font-semibold mt-4 text-dark dark:text-secondary text-lg">11. CONTACT INFORMATION</h3>
							<p className="text-dark dark:text-secondary mb-2">
								If you have any questions or concerns regarding these terms, please contact the QuickEase Team on your desired
								medium channel.
							</p>
							<p className="text-dark dark:text-secondary">
								i. Email:{' '}
								<a href="mailto:quickease.team@gmail.com" className="text-blue-600 dark:text-blue-400">
									quickease.team@gmail.com
								</a>
							</p>
							<p className="text-dark dark:text-secondary">
								ii. Facebook:{' '}
								<a
									href="https://www.facebook.com/quickease.ph"
									className="text-blue-600 dark:text-blue-400"
									target="_blank"
									rel="noopener noreferrer">
									https://www.facebook.com/quickease.ph
								</a>
							</p>
						</section>

						{/* Acknowledgment */}
						<p className="text-dark dark:text-secondary mb-4">
							By using QuickEase, you acknowledge that you have read, understood, and agree to these Terms and Conditions.
						</p>

						{/* Close Button */}
						<button
							className="mt-4 px-4 py-2 bg-primary text-white rounded transition ease-in-out hover:bg-dark focus:outline-none"
							onClick={onClose}>
							Close
						</button>
					</div>
				</div>
			)}
		</>
	);
};

export default TermsAndConditionsModal;
