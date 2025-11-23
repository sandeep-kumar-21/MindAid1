// src/pages/tools/BreathingTool.jsx

import React, { useState, useEffect } from 'react';
import { FaWind } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const BreathingTool = () => {
  const [step, setStep] = useState('Get Ready'); // Get Ready, Inhale, Hold, Exhale
  const [count, setCount] = useState(4);
  const [isRunning, setIsRunning] = useState(false);
  const [cycles, setCycles] = useState(0);

  useEffect(() => {
    if (!isRunning) return;

    let timer;

    if (step === 'Inhale') {
      timer = setTimeout(() => {
        setStep('Hold');
        setCount(7);
      }, 4000); // 4 seconds
    } else if (step === 'Hold') {
      timer = setTimeout(() => {
        setStep('Exhale');
        setCount(8);
      }, 7000); // 7 seconds
    } else if (step === 'Exhale') {
      timer = setTimeout(() => {
        if (cycles + 1 >= 4) { // Complete 4 cycles
          setIsRunning(false);
          setStep('Completed');
          setCycles(0);
        } else {
          setCycles(prev => prev + 1);
          setStep('Inhale');
          setCount(4);
        }
      }, 8000); // 8 seconds
    }

    return () => clearTimeout(timer);
  }, [step, isRunning, cycles]);

  useEffect(() => {
    if (!isRunning || step === 'Completed' || count === 0) return;

    const interval = setInterval(() => {
      setCount(prev => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [count, isRunning, step]);


  const startBreathing = () => {
    setStep('Inhale');
    setCount(4);
    setCycles(0);
    setIsRunning(true);
  };

  const stopBreathing = () => {
    setIsRunning(false);
    setStep('Get Ready');
    setCount(4);
    setCycles(0);
  };

  let animationClass = '';
  if (isRunning) {
    if (step === 'Inhale') animationClass = 'animate-inhale';
    if (step === 'Hold') animationClass = 'animate-hold';
    if (step === 'Exhale') animationClass = 'animate-exhale';
  }

  return (
    <div className="flex flex-col items-center max-w-2xl mx-auto p-8 bg-white rounded-lg shadow-xl">
      <FaWind className="text-5xl text-blue-500 mb-4" />
      <h1 className="text-3xl font-bold text-gray-800">4-7-8 Breathing</h1>
      <p className="text-gray-600 mb-8">A calming technique to reduce anxiety.</p>

      <div className="relative w-48 h-48 flex items-center justify-center mb-8">
        {/* Visualizer circle */}
        <div 
          className={`absolute w-full h-full rounded-full bg-blue-100 transition-transform duration-1000 ${animationClass}`} 
          style={{ transform: animationClass ? '' : 'scale(1)' }}
        ></div>
        {/* Inner circle */}
        <div className="relative z-10 w-32 h-32 rounded-full bg-white shadow-inner flex items-center justify-center">
          <span className="text-4xl font-bold text-blue-700">{isRunning && count > 0 ? count : ''}</span>
        </div>
      </div>

      <h2 className="text-4xl font-light text-gray-700 mb-8 h-12">
        {step} {isRunning && step !== 'Completed' && `(${cycles + 1} / 4)`}
      </h2>

      {!isRunning ? (
        <button
          onClick={startBreathing}
          className="w-full max-w-xs py-3 px-6 rounded-lg text-white font-semibold bg-linear-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 shadow-md text-lg"
        >
          {step === 'Completed' ? 'Start Again' : 'Start'}
        </button>
      ) : (
        <button
          onClick={stopBreathing}
          className="w-full max-w-xs py-3 px-6 rounded-lg text-white font-semibold bg-linear-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 shadow-md text-lg"
        >
          Stop
        </button>
      )}

      <Link to="/coping-tools" className="mt-6 text-blue-600 hover:underline">
        &larr; Back to all tools
      </Link>
    </div>
  );
};

export default BreathingTool;