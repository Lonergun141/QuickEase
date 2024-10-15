
import React from 'react';

const BadgeCard = ({ src, title, description, isEarned }) => (
  <div className="bg-white dark:bg-darken p-4 rounded-lg shadow-md flex flex-col items-center w-full border dark:border-gray-500">
    <div className="w-full h-32 flex justify-center items-center mb-4">
      <img
        src={src}
        alt={title}
        className={`max-h-full ${!isEarned ? 'opacity-50 grayscale' : ''}`}
      />
    </div>
    <h1 className="text-lg font-semibold text-center text-dark dark:text-secondary">{title}</h1>
    <p className="mt-1 text-sm text-center text-gray-600 dark:text-gray-300">{description}</p>
  </div>
);

export default BadgeCard;
