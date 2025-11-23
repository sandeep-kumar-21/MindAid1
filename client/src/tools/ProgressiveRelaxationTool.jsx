// src/tools/ProgressiveRelaxationTool.jsx

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaRunning } from 'react-icons/fa'; // Using the same icon from the main page

const steps = [
  {
    title: "Get Ready",
    prompt: "Find a comfortable position, sitting or lying down. Close your eyes and take a few deep breaths to begin.",
    instruction: "Click 'Start' when you are ready to begin."
  },
  {
    title: "Hands & Arms",
    prompt: "Tense the muscles in your hands and lower arms, clenching your fists tightly. Hold for 5 seconds.",
    instruction: "Now, relax your hands and arms completely. Notice the difference."
  },
  {
    title: "Upper Arms",
    prompt: "Tense your biceps, pulling your arms up towards your shoulders. Hold for 5 seconds.",
    instruction: "Now, let your arms relax and fall to your sides. Feel the tension leaving."
  },
  {
    title: "Face & Jaw",
    prompt: "Squint your eyes, wrinkle your forehead, and clench your jaw. Hold for 5 seconds.",
    instruction: "Now, relax your entire face. Let your jaw hang loose. Feel the softness."
  },
  {
    title: "Shoulders & Neck",
    prompt: "Raise your shoulders up towards your ears, tensing them. Hold for 5 seconds.",
    instruction: "Now, let your shoulders drop completely. Feel the weight and relaxation."
  },
  {
    title: "Stomach",
    prompt: "Tighten the muscles in your stomach, as if bracing for an impact. Hold for 5 seconds.",
    instruction: "Now, release all the tension. Let your stomach soften and relax."
  },
  {
    title: "Legs",
    prompt: "Tense your thighs, calves, and feet, curling your toes. Hold for 5 seconds.",
    instruction: "Now, relax your legs completely. Feel the tension flowing out of your feet."
  },
  {
    title: "Final Relaxation",
    prompt: "You are now fully relaxed. Enjoy this feeling of deep calm. Take a few more deep breaths.",
    instruction: "You have completed the exercise."
  }
];

const ProgressiveRelaxationTool = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const currentStep = steps[currentStepIndex];

  const nextStep = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };

  const startOver = () => {
    setCurrentStepIndex(0);
  };

  const isCompleted = currentStepIndex === steps.length - 1;
  const isStartScreen = currentStepIndex === 0;

  return (
    <div className="flex flex-col items-center max-w-2xl mx-auto">
      <div className="w-full p-8 bg-white rounded-lg shadow-xl text-center">
        {/* Main Icon */}
        <div className={`p-4 bg-indigo-100 rounded-full mb-4 inline-block`}>
          <FaRunning className="text-4xl text-indigo-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800">Progressive Relaxation</h1>
        <p className="text-gray-600 mb-8">Systematic muscle relaxation to release physical tension.</p>

        {/* Step Card */}
        <div className="p-6 border rounded-lg min-h-[250px] flex flex-col justify-center items-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-3">{currentStep.title}</h2>
          <p className="text-gray-600 text-lg mb-4">{currentStep.prompt}</p>
          <p className="text-gray-500 text-base italic">{currentStep.instruction}</p>
        </div>

        {/* Controls */}
        <div className="mt-8">
          {isCompleted ? (
            <button
              onClick={startOver}
              className="w-full max-w-xs py-3 px-6 rounded-lg text-white font-semibold bg-linear-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 shadow-md text-lg"
            >
              Start Over
            </button>
          ) : (
            <button
              onClick={isStartScreen ? () => nextStep() : nextStep}
              className="w-full max-w-xs py-3 px-6 rounded-lg text-white font-semibold bg-linear-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 shadow-md text-lg"
            >
              {isStartScreen ? 'Start' : 'Next'}
            </button>
          )}
        </div>
      </div>

      <Link to="/coping-tools" className="mt-8 text-blue-600 hover:underline">
        &larr; Back to all tools
      </Link>
    </div>
  );
};

export default ProgressiveRelaxationTool;