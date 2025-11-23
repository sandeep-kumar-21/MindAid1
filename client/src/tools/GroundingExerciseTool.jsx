// src/tools/GroundingExerciseTool.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaEye, FaHandPaper, FaWind, FaLeaf } from 'react-icons/fa';
import { GiLips } from 'react-icons/gi';
import { LuEar } from 'react-icons/lu';

const steps = [
  {
    step: 5,
    title: "Five things you can SEE",
    icon: FaEye,
    prompt: "Look around you and find five different things. Notice their color, shape, and texture.",
    color: "text-blue-500",
  },
  {
    step: 4,
    title: "Four things you can FEEL",
    icon: FaHandPaper,
    prompt: "Notice four things you can feel. It could be the texture of your clothes, the floor under your feet, or the air on your skin.",
    color: "text-green-500",
  },
  {
    step: 3,
    title: "Three things you can HEAR",
    icon: LuEar, // ✅ Works (from react-icons/lu)
    prompt: "Listen carefully and identify three different sounds. It could be a fan, a clock ticking, or sounds from outside.",
    color: "text-purple-500",
  },
  {
    step: 2,
    title: "Two things you can SMELL",
    icon: FaWind,
    prompt: "What can you smell? It might be the scent of your room, coffee, or fresh air.",
    color: "text-orange-500",
  },
  {
    step: 1,
    title: "One thing you can TASTE",
    icon: GiLips, // ✅ Works (from react-icons/gi)
    prompt: "What is one thing you can taste? It could be the last sip of your drink, gum, or just the taste in your mouth.",
    color: "text-pink-500",
  },
  {
    step: 0,
    title: "Exercise Complete",
    icon: FaLeaf,
    prompt: "You are now more connected to the present moment. Take a final deep breath.",
    color: "text-green-600",
  }
];


const GroundingExerciseTool = () => {
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

  return (
    <div className="flex flex-col items-center max-w-2xl mx-auto">
      <div className="w-full p-8 bg-white rounded-lg shadow-xl text-center">
        <div className="p-4 bg-green-100 rounded-full mb-4 inline-block">
          <FaLeaf className="text-4xl text-green-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800">Grounding Exercise</h1>
        <p className="text-gray-600 mb-8">5-4-3-2-1 technique to reconnect with the present.</p>

        <div className="p-6 border rounded-lg min-h-[250px] flex flex-col justify-center items-center">
          <currentStep.icon className={`text-5xl mb-4 ${currentStep.color}`} />
          <h2 className="text-3xl font-bold text-gray-800 mb-3">{currentStep.title}</h2>
          <p className="text-gray-600 text-lg">{currentStep.prompt}</p>
        </div>

        <div className="mt-8">
          {currentStep.step > 0 ? (
            <button
              onClick={nextStep}
              className="w-full max-w-xs py-3 px-6 rounded-lg text-white font-semibold bg-linear-to-r from-green-500 to-teal-400 hover:from-green-600 hover:to-teal-500 shadow-md text-lg"
            >
              Next
            </button>
          ) : (
            <button
              onClick={startOver}
              className="w-full max-w-xs py-3 px-6 rounded-lg text-white font-semibold bg-linear-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 shadow-md text-lg"
            >
              Start Over
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

export default GroundingExerciseTool;
