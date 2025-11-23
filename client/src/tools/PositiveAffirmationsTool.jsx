// src/tools/PositiveAffirmationsTool.jsx

import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { FaSmileBeam, FaQuoteLeft, FaQuoteRight } from 'react-icons/fa';

// A list of affirmations
const affirmations = [
  "I am capable and strong.",
  "I am worthy of happiness and success.",
  "I choose to be positive and grateful today.",
  "I trust myself to make good decisions.",
  "I am resilient and can overcome any challenge.",
  "I am proud of the person I am becoming.",
  "I release all doubts and fears.",
  "I am in control of my thoughts and my life.",
  "I attract positive energy and good opportunities.",
  "I am allowed to take breaks and rest.",
  "I am learning and growing every day.",
  "My feelings are valid and important.",
];

const PositiveAffirmationsTool = () => {
  // Get a random starting index
  const initialIndex = useMemo(() => Math.floor(Math.random() * affirmations.length), []);
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  const currentAffirmation = affirmations[currentIndex];

  const getNewAffirmation = () => {
    let newIndex;
    // Keep getting a new random index until it's different from the current one
    do {
      newIndex = Math.floor(Math.random() * affirmations.length);
    } while (newIndex === currentIndex);
    
    setCurrentIndex(newIndex);
  };

  return (
    <div className="flex flex-col items-center max-w-2xl mx-auto">
      <div className="w-full p-8 bg-white rounded-lg shadow-xl text-center">
        {/* Main Icon */}
        <div className={`p-4 bg-yellow-100 rounded-full mb-4 inline-block`}>
          <FaSmileBeam className="text-4xl text-yellow-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800">Positive Affirmations</h1>
        <p className="text-gray-600 mb-8">Boost self-confidence and positivity.</p>

        {/* Affirmation Card */}
        <div className="p-10 border rounded-lg min-h-[250px] flex flex-col justify-center items-center relative bg-gray-50">
          <FaQuoteLeft className="absolute top-4 left-4 text-3xl text-gray-300" />
          <p className="text-gray-700 text-3xl font-medium leading-relaxed">
            {currentAffirmation}
          </p>
          <FaQuoteRight className="absolute bottom-4 right-4 text-3xl text-gray-300" />
        </div>

        {/* Controls */}
        <div className="mt-8">
          <button
            onClick={getNewAffirmation}
            className="w-full max-w-xs py-3 px-6 rounded-lg text-white font-semibold bg-linear-to-r from-yellow-500 to-amber-400 hover:from-yellow-600 hover:to-amber-500 shadow-md text-lg"
          >
            Next Affirmation
          </button>
        </div>
      </div>

      <Link to="/coping-tools" className="mt-8 text-blue-600 hover:underline">
        &larr; Back to all tools
      </Link>
    </div>
  );
};

export default PositiveAffirmationsTool;