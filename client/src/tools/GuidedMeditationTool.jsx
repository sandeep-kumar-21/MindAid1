// src/tools/GuidedMeditationTool.jsx

import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaBrain, FaPlay, FaPause, FaRedo } from 'react-icons/fa';

const GuidedMeditationTool = () => {
  // useRef is used to get a direct reference to the <audio> element
  const audioRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Function to format time from seconds to MM:SS
  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  const togglePlayPause = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    setCurrentTime(audioRef.current.currentTime);
  };

  const handleLoadedData = () => {
    setDuration(audioRef.current.duration);
  };

  const handleSeek = (e) => {
    // Calculate the new time
    const progressBar = e.target;
    const seekTime = (e.nativeEvent.offsetX / progressBar.clientWidth) * duration;
    audioRef.current.currentTime = seekTime;
  };

  const handleRestart = () => {
    audioRef.current.currentTime = 0;
    audioRef.current.play();
    setIsPlaying(true);
  };

  const progressPercentage = (currentTime / duration) * 100 || 0;

  return (
    <div className="flex flex-col items-center max-w-2xl mx-auto">
      {/* Audio element (hidden) */}
      <audio
        ref={audioRef}
        src="/audio/meditation.mp3" // Path to your file in the 'public' folder
        onTimeUpdate={handleTimeUpdate}
        onLoadedData={handleLoadedData}
        onEnded={() => setIsPlaying(false)}
      />

      {/* Player Card */}
      <div className="w-full p-8 bg-white rounded-lg shadow-xl">
        <div className="flex flex-col items-center">
          <div className="p-4 bg-purple-100 rounded-full mb-4">
            <FaBrain className="text-4xl text-purple-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800">Guided Meditation</h1>
          <p className="text-gray-600 mb-6">5-minute mindfulness meditation for stress relief.</p>
          
          {/* Progress Bar */}
          <div 
            className="w-full h-2 bg-gray-200 rounded-full cursor-pointer mb-2"
            onClick={handleSeek}
          >
            <div 
              className="h-full bg-purple-500 rounded-full"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          
          {/* Time Display */}
          <div className="w-full flex justify-between text-sm text-gray-500 mb-6">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>

          {/* Controls */}
          <div className="flex items-center space-x-8">
            <button 
              onClick={handleRestart}
              className="text-gray-500 cursor-pointer hover:text-gray-700"
              title="Restart"
            >
              <FaRedo size={20} />
            </button>

            <button
              onClick={togglePlayPause}
              className="w-20 h-20 cursor-pointer rounded-full bg-linear-to-r from-purple-500 to-pink-500 text-white flex items-center justify-center shadow-lg"
            >
              {isPlaying ? <FaPause size={30} /> : <FaPlay size={30} className="ml-1" />}
            </button>
            
            {/* Placeholder for symmetry */}
            <div className="w-5"></div> 
          </div>
        </div>
      </div>

      <Link to="/coping-tools" className="mt-8 text-blue-600 hover:underline">
        &larr; Back to all tools
      </Link>
    </div>
  );
};

export default GuidedMeditationTool;