import Navbar from './components/navbar';
import Video from './components/video';
import Footer from './components/footer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useDarkMode } from './features/Darkmode/darkmodeProvider';
import { 
	faRobot, 
	faLayerGroup, 
	faSquareCheck,
	faBoltLightning,
	faChevronDown
} from '@fortawesome/free-solid-svg-icons';

export default function App() {
	const { isDarkMode } = useDarkMode();

	return (
		<div className={`flex flex-col min-h-screen overflow-hidden
			${isDarkMode ? 'bg-[#171717]' : 'bg-zinc-50'}`}
		>
			<Navbar />
			<main className="flex-grow flex flex-col">
				{/* Hero Section */}
				<div className="relative min-h-screen">
					{/* Enhanced Background Effects */}
					<div className="absolute inset-0">
						{/* Background Gradients */}
						<div className={`absolute w-[800px] h-[800px] rounded-full blur-[120px] 
							-top-64 -left-64 animate-spin-slow
							${isDarkMode
								? 'bg-gradient-conic from-primary/40 via-review/40 to-secondary/40'
								: 'bg-gradient-conic from-primary/20 via-review/20 to-secondary/20'
							}`}
						/>
						<div className={`absolute w-[600px] h-[600px] rounded-full blur-[100px] 
							top-1/2 -right-32 animate-spin-slower
							${isDarkMode
								? 'bg-gradient-conic from-secondary/30 via-primary/30 to-review/30'
								: 'bg-gradient-conic from-secondary/15 via-primary/15 to-review/15'
							}`}
						/>
						
						{/* Particle Effects */}
						<div className="absolute inset-0">
							{[...Array(30)].map((_, i) => (
								<div
									key={i}
									className={`absolute w-[2px] h-[2px] rounded-full animate-firefly
										${isDarkMode ? 'bg-white/50' : 'bg-zinc-600/20'}`}
									style={{
										top: `${Math.random() * 100}%`,
										left: `${Math.random() * 100}%`,
										animationDelay: `${Math.random() * 4}s`,
										animationDuration: `${4 + Math.random() * 4}s`
									}}
								/>
							))}
						</div>

						{/* Grid Pattern */}
						<div className={`absolute inset-0 bg-grid-pattern
							${isDarkMode ? 'opacity-5' : 'opacity-[0.07]'}`}
						/>
					</div>

					{/* Content */}
					<div className="relative flex flex-col">
						{/* Video Section */}
						<div className="min-h-[85vh] flex items-center justify-center pt-20 px-4 sm:px-6 lg:px-8">
							<div className="w-full max-w-[1200px] mx-auto">
								<Video />
								
								{/* Scroll Indicator */}
								<div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center animate-bounce">
									<span className={`text-sm mb-2 font-medium
										${isDarkMode ? 'text-white/60' : 'text-zinc-600'}`}
									>
										Scroll to explore
									</span>
									<FontAwesomeIcon 
										icon={faChevronDown} 
										className={`h-4 w-4 ${isDarkMode ? 'text-white/60' : 'text-zinc-500'}`} 
									/>
								</div>
							</div>
						</div>

						{/* Feature Cards Section */}
						<div className={`w-full backdrop-blur-xl border-t py-16 px-6 lg:px-20
							${isDarkMode 
								? 'bg-dark/80 border-white/5' 
								: 'bg-white/70 border-zinc-200/80'}`}
						>
							<div className="max-w-7xl mx-auto">
								{/* Section Title */}
								<div className="text-center mb-12">
									<h2 className={`text-3xl md:text-4xl font-pbold mb-4
										${isDarkMode
											? 'bg-gradient-to-r from-white via-white/90 to-white/70'
											: 'bg-gradient-to-r from-zinc-800 via-zinc-700 to-zinc-600'
										} bg-clip-text text-transparent`}
									>
										Supercharge Your Learning
									</h2>
									<p className={`text-lg ${isDarkMode ? 'text-white/60' : 'text-zinc-600'}`}>
										Experience the power of AI-driven learning tools designed to enhance your study journey.
									</p>
								</div>

								{/* Cards Grid */}
								<div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
									{[
										{
											number: '01',
											title: 'Summarize with AI',
											description: 'Quickly turn long content into key points.',
											gradient: 'from-primary via-review to-primary',
											icon: faRobot,
											accentColor: 'text-primary'
										},
										{
											number: '02',
											title: 'Review with AI Flashcard',
											description: 'Reinforce key concepts for better learning.',
											gradient: 'from-review via-secondary to-review',
											icon: faLayerGroup,
											accentColor: 'text-review'
										},
										{
											number: '03',
											title: 'Test with AI Quizzes',
											description: 'Challenge your knowledge with tailored questions.',
											gradient: 'from-secondary via-primary to-secondary',
											icon: faSquareCheck,
											accentColor: 'text-pomodoro'
										}
									].map((feature, index) => (
										<div 
											key={index}
											className={`group relative overflow-hidden rounded-2xl backdrop-blur-sm 
												transition-all duration-500
												${isDarkMode
													? 'bg-zinc-900/50 hover:bg-zinc-800/50'
													: 'bg-white/80 hover:bg-white shadow-lg hover:shadow-xl'}`}
										>
											{/* Card Inner */}
											<div className="relative z-10 p-8">
												{/* Icon Header */}
												<div className="flex items-center justify-between mb-6">
													<div className={`w-12 h-12 rounded-xl flex items-center justify-center 
														${feature.accentColor} group-hover:scale-110 transition-transform duration-300
														${isDarkMode ? 'bg-zinc-800' : 'bg-zinc-100'}`}
													>
														<FontAwesomeIcon icon={feature.icon} className="text-xl" />
													</div>
													<FontAwesomeIcon 
														icon={faBoltLightning} 
														className={`transition-colors
															${isDarkMode
																? 'text-zinc-700 group-hover:text-zinc-600'
																: 'text-zinc-400 group-hover:text-zinc-500'}`}
													/>
												</div>

												{/* Content */}
												<div className="space-y-4">
													<span className={`inline-block px-3 py-1 rounded-full text-xs font-pbold 
														${isDarkMode
															? 'text-white/60 bg-white/5'
															: 'text-zinc-700 bg-zinc-100'}`}
													>
														Feature {feature.number}
													</span>
													<h3 className={`text-xl font-psemibold ${feature.accentColor}`}>
														{feature.title}
													</h3>
													<p className={`text-sm transition-colors
														${isDarkMode
															? 'text-gray-400 group-hover:text-gray-300'
															: 'text-zinc-600 group-hover:text-zinc-700'}`}
													>
														{feature.description}
													</p>
												</div>

												{/* Bottom Gradient Line */}
												<div className="absolute bottom-0 left-0 w-full h-[2px] 
													bg-gradient-to-r opacity-0 group-hover:opacity-100 
													transition-opacity duration-500"
													style={{
														background: `linear-gradient(to right, ${feature.gradient})`
													}}>
												</div>
											</div>
										</div>
									))}
								</div>
							</div>
						</div>
					</div>
				</div>
			</main>
			<Footer />
		</div>
	);
}

