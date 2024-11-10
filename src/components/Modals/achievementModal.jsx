import React from 'react';

const AchievementModal = ({ achievement, onClose }) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4">
            <div className="relative flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 bg-gradient-to-br from-purple-600 to-indigo-700 rounded-lg shadow-2xl transform scale-105 transition-all duration-500 max-w-md md:max-w-2xl w-full">
                {/* Decorative Ribbon */}
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-white py-1 px-3 md:px-4 rounded-full shadow-md text-xs md:text-sm font-bold uppercase tracking-wider">
                    Congratulations!
                </div>

                {/* Header */}
                <h1 className="font-extrabold text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-white mb-4 text-center animate-pulse">
                    Achievement Unlocked!
                </h1>

                {/* Achievement Image */}
                <div className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 mb-4 md:mb-6 bg-white rounded-full p-2 shadow-lg">
                    <img src={achievement.image} alt={achievement.title} className="w-full h-full object-contain" />
                </div>

                {/* Title */}
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-2 text-center">
                    {achievement.title}
                </h2>

                {/* Description */}
                <p className="text-sm sm:text-base md:text-lg text-white text-center max-w-xs sm:max-w-md md:max-w-lg mb-4 md:mb-6">
                    {achievement.description}
                </p>

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="mt-2 px-4 py-2 md:px-6 md:py-3 bg-white text-indigo-700 font-bold rounded-full shadow-md hover:bg-gray-100 hover:shadow-lg transform hover:scale-110 transition duration-300"
                >
                    Close
                </button>
            </div>
        </div>
    );
};

export default AchievementModal;
