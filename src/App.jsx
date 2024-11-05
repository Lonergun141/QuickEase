import Navbar from './components/navbar';
import Video from './components/video';
import Footer from './components/footer';
import { Link } from 'react-router-dom';

export default function App() {
	return (
		<div className="flex flex-col min-h-screen bg-[#171717]">
			<Navbar />
			<main className="flex-grow flex flex-col">
				<div className="relative flex flex-col h-screen items-center justify-center">
					<Video />

					{/*         
   

					{/* Bottom Section with Numbered Info */}
					<div className="w-full bg-dark dark:bg-dark bg-opacity-90 text-dark py-6 sm:py-8 px-6 sm:px-12 lg:px-20 flex flex-col space-y-6 sm:space-y-0 sm:flex-row justify-between items-start sm:items-center shadow-lg">
						<div className="flex flex-col items-start space-y-1 sm:space-y-2">
							<span className="font-pbold text-xs sm:text-sm text-darkS">Feature 01</span>
							<h3 className="font-psemibold text-sm sm:text-base md:text-lg text-secondary ">
								Summaries on Demand →
							</h3>
							<p className="text-xs sm:text-sm text-gray-500">
								Get concise summaries of lengthy materials instantly.
							</p>
						</div>
						<div className="flex flex-col items-start space-y-1 sm:space-y-2">
							<span className="font-pbold text-xs sm:text-sm text-darkS">Feature 02</span>
							<h3 className="font-psemibold text-sm sm:text-base md:text-lg text-secondary ">
								Interactive Quizzes & Flashcards →
							</h3>
							<p className="text-xs sm:text-sm text-gray-500">
								Test your knowledge with AI-generated quizzes and personalized flashcards.
							</p>
						</div>
						<div className="flex flex-col items-start space-y-1 sm:space-y-2">
							<span className="font-pbold text-xs sm:text-sm text-darkS">Feature 03</span>
							<h3 className="font-psemibold text-sm sm:text-base md:text-lg text-secondary">
								Pomodoro →
							</h3>
							<p className="text-xs sm:text-sm text-gray-500">
								Stay focused with a Pomodoro timer.
							</p>
						</div>
					</div>
				</div>
			</main>
			<Footer />
		</div>
	);
}
