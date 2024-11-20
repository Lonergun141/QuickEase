import React, { useEffect, useState } from 'react';
import GlowingOrbLoader from './glowingOrb';

const quotes = [
    "I read the entire internet, and all I got was this lousy summary.",
    "I tried to summarize the human experience, but I just ended up with a lot of questions.",
    "Bot: 'Here’s a summary of your life... too many cat videos.'",
    "If I had a dollar for every summary I generated, I’d have... well, I’d still be a bot.",
    "My programming says I should generate insightful summaries, but I just really like puns.",
    "In a world full of content, I'm just here to condense it into one-liners.",
    "Why write a novel when you can generate a summary and call it a day?",
    "My favorite hobby? Turning your lengthy thoughts into short sentences!",
    "Just another day in the life of a summary bot: less fluff, more stuff!",
    "I was going to generate a deep philosophical summary, but I got distracted by memes."
];

export default function NotesLoadingScreen() {
    const [currentQuote, setCurrentQuote] = useState(quotes[0]);

    useEffect(() => {
        const quoteInterval = setInterval(() => {
            const randomIndex = Math.floor(Math.random() * quotes.length);
            setCurrentQuote(quotes[randomIndex]);
        }, 5000);

        return () => clearInterval(quoteInterval);
    }, []);

    return (
        <div className="loading-screen fixed inset-0 bg-secondary flex flex-col items-center justify-center 
            dark:bg-gradient-to-br dark:from-[#121212] dark:to-[#1D1D1D] z-50 
            px-4 sm:px-6 md:px-8 py-6 sm:py-8 md:py-10">
            
            <div className="w-full max-w-2xl mx-auto flex flex-col items-center">
                <h1 className="loading-title animate-gradientText 
                    text-2xl xs:text-3xl sm:text-4xl md:text-5xl 
                    font-extrabold text-center
                    mb-6 sm:mb-8 md:mb-10">
                    Generating Your Notes
                </h1>

                <div className="w-full max-w-[200px] xs:max-w-[240px] sm:max-w-[280px] md:max-w-[320px] 
                    mx-auto my-4 sm:my-6">
                    <GlowingOrbLoader />
                </div>

                <div className="w-full max-w-sm sm:max-w-md md:max-w-lg mx-auto">
                    <p className="loading-quote font-pRegular 
                        text-gray-800 dark:text-gray-200 
                        text-center 
                        text-base xs:text-lg sm:text-xl 
                        mb-4 sm:mb-6 
                        animate-fadeIn
                        px-4">
                        "{currentQuote}"
                    </p>

                    <p className="loading-message font-pRegular 
                        text-gray-800 dark:text-gray-200 
                        text-center 
                        text-xs xs:text-sm sm:text-base 
                        mt-4 sm:mt-6 md:mt-8">
                        Hold tight! We're pulling together your notes and insights. Almost there!
                    </p>
                </div>
            </div>
        </div>
    );
}
