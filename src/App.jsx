import Navbar from './components/navbar';
import Video from './components/video';
import Footer from './components/footer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
	faRobot, 
	faLayerGroup, 
	faSquareCheck,
	faBoltLightning,
	faChevronDown
} from '@fortawesome/free-solid-svg-icons';

export default function App() {
	return (
		<div className="flex flex-col min-h-screen bg-[#171717] overflow-hidden">
			<Navbar />
			<main className="flex-grow flex flex-col">
				{/* Hero Section */}
				<div className="relative min-h-screen">
					{/* Enhanced Background Effects */}
					<div className="absolute inset-0">
						<div className="absolute w-[800px] h-[800px] bg-gradient-conic from-primary/40 via-review/40 to-secondary/40 rounded-full blur-[120px] -top-64 -left-64 animate-spin-slow"></div>
						<div className="absolute w-[600px] h-[600px] bg-gradient-conic from-secondary/30 via-primary/30 to-review/30 rounded-full blur-[100px] top-1/2 -right-32 animate-spin-slower"></div>
						
						{/* Refined Particle Effects */}
						<div className="absolute inset-0">
							{[...Array(30)].map((_, i) => (
								<div
									key={i}
									className="absolute w-[2px] h-[2px] bg-white/50 rounded-full animate-firefly"
									style={{
										top: `${Math.random() * 100}%`,
										left: `${Math.random() * 100}%`,
										animationDelay: `${Math.random() * 4}s`,
										animationDuration: `${4 + Math.random() * 4}s`
									}}
								/>
							))}
						</div>

						{/* Modern Grid Pattern */}
						<div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
					</div>

					{/* Content */}
					<div className="relative flex flex-col">
						{/* Video Section - Adjusted for partial visibility of content below */}
						<div className="min-h-[85vh] flex items-center justify-center pt-20 px-4 sm:px-6 lg:px-8">
							<div className="w-full max-w-[1200px] mx-auto">
								<Video />
								
								{/* Scroll Indicator */}
								<div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center animate-bounce">
									<span className="text-white/60 text-sm mb-2">Scroll to explore</span>
									<FontAwesomeIcon 
										icon={faChevronDown} 
										className="text-white/60 h-4 w-4" 
									/>
								</div>
							</div>
						</div>

						{/* Feature Cards Section */}
						<div className="w-full bg-dark/80 backdrop-blur-xl border-t border-white/5 py-16 px-6 lg:px-20">
							<div className="max-w-7xl mx-auto">
								{/* Section Title */}
								<div className="text-center mb-12">
									<h2 className="text-3xl md:text-4xl font-pbold bg-gradient-to-r from-white via-white/90 to-white/70 bg-clip-text text-transparent mb-4">
										Supercharge Your Learning
									</h2>
									<p className="text-white/60 max-w-2xl mx-auto">
										Experience the power of AI-driven learning tools designed to enhance your study journey.
									</p>
								</div>

								{/* Cards Grid */}
								<div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
									{[
										{
											number: '01',
											title: 'AI Summary',
											description: 'Transform lengthy content into concise, memorable key points.',
											gradient: 'from-primary via-review to-primary',
											icon: faRobot,
											accentColor: 'text-primary'
										},
										{
											number: '02',
											title: 'Smart Flashcards',
											description: 'Interactive cards that adapt to your learning style.',
											gradient: 'from-review via-secondary to-review',
											icon: faLayerGroup,
											accentColor: 'text-review'
										},
										{
											number: '03',
											title: 'Dynamic Quizzes',
											description: 'AI-powered assessments that evolve with your progress.',
											gradient: 'from-secondary via-primary to-secondary',
											icon: faSquareCheck,
											accentColor: 'text-secondary'
										}
									].map((feature, index) => (
										<div 
											key={index}
											className="group relative overflow-hidden rounded-2xl bg-zinc-900/50 backdrop-blur-sm hover:bg-zinc-800/50 transition-all duration-500"
										>
											{/* Card Inner */}
											<div className="relative z-10 p-8">
												{/* Icon Header */}
												<div className="flex items-center justify-between mb-6">
													<div className={`w-12 h-12 rounded-xl bg-zinc-800 flex items-center justify-center ${feature.accentColor} group-hover:scale-110 transition-transform duration-300`}>
														<FontAwesomeIcon icon={feature.icon} className="text-xl" />
													</div>
													<FontAwesomeIcon 
														icon={faBoltLightning} 
														className="text-zinc-700 group-hover:text-zinc-600 transition-colors"
													/>
												</div>

												{/* Content */}
												<div className="space-y-4">
													<span className="inline-block px-3 py-1 rounded-full text-xs font-pbold text-white/60 bg-white/5">
														Feature {feature.number}
													</span>
													<h3 className={`text-xl font-psemibold ${feature.accentColor} group-hover:text-white transition-colors`}>
														{feature.title}
													</h3>
													<p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
														{feature.description}
													</p>
												</div>

												{/* Bottom Gradient Line */}
												<div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-500"
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

