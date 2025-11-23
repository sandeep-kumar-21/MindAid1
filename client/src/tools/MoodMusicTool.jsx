import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaMusic, 
  FaPlay, 
  FaPause, 
  FaStepForward, 
  FaStepBackward,
  FaSync,
  FaRedo
} from 'react-icons/fa';

// --- Our 5 Default Tracks ---
const defaultTracks = [
  { _id: 'default1', title: 'Calm Waves', url: '/audio/music1.mp3' },
  { _id: 'default2', title: 'Peaceful Forest', url: '/audio/music2.mp3' },
  { _id: 'default3', title: 'Gentle Stream', url: '/audio/music3.mp3' },
  { _id: 'default4', title: 'Morning Birds', url: '/audio/music4.mp3' },
  { _id: 'default5', title: 'Zen Garden', url: '/audio/music5.mp3' },
];

// Helper to format time from seconds to MM:SS
const formatTime = (timeInSeconds) => {
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = Math.floor(timeInSeconds % 60);
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

const MoodMusicTool = () => {
  const audioRef = useRef(null);
  const [playlist] = useState(defaultTracks);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [loopMode, setLoopMode] = useState('all'); 

  const currentTrack = playlist[currentTrackIndex];

  useEffect(() => {
    if (isPlaying) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying, currentTrackIndex]);

  const toggleLoopMode = () => {
    if (loopMode === 'all') {
      setLoopMode('one');
    } else if (loopMode === 'one') {
      setLoopMode('off');
    } else {
      setLoopMode('all');
    }
  };

  // --- THIS IS THE MISSING FUNCTION ---
  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };
  // --- END FIX ---

  const playNext = () => {
    setCurrentTrackIndex((prevIndex) => (prevIndex + 1) % playlist.length);
    setIsPlaying(true);
  };

  const playPrev = () => {
    setCurrentTrackIndex((prevIndex) => (prevIndex - 1 + playlist.length) % playlist.length);
    setIsPlaying(true);
  };

  const handleTimeUpdate = () => {
    setCurrentTime(audioRef.current.currentTime);
  };

  const handleLoadedData = () => {
    setDuration(audioRef.current.duration);
  };

  const handleSeek = (e) => {
    const progressBar = e.target.closest('.w-full');
    const seekTime = (e.nativeEvent.offsetX / progressBar.clientWidth) * duration;
    audioRef.current.currentTime = seekTime;
  };

  const selectTrack = (index) => {
    setCurrentTrackIndex(index);
    setIsPlaying(true);
  };

  const handleSongEnd = () => {
    if (loopMode === 'all') {
      playNext();
    } else if (loopMode === 'one') {
      audioRef.current.play();
    } else {
      setIsPlaying(false);
    }
  };

  return (
    <div className="flex flex-col items-center max-w-2xl mx-auto">
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onLoadedData={handleLoadedData}
        onEnded={handleSongEnd}
        loop={loopMode === 'one'}
      />

      {/* Player Card */}
      <div className="w-full p-8 bg-white rounded-lg shadow-xl mb-8">
        <div className="flex flex-col items-center">
          <div className="p-4 bg-orange-100 rounded-full mb-4">
            <FaMusic className="text-4xl text-orange-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800">Mood Music</h1>
          <p className="text-gray-500 text-lg mb-2">Now Playing:</p>
          <p className="text-gray-800 font-semibold text-xl mb-4 text-center">{currentTrack.title}</p>
          
          <div 
            className="w-full h-2 bg-gray-200 rounded-full cursor-pointer mb-2"
            onClick={handleSeek}
          >
            <div 
              className="h-full bg-orange-500 rounded-full"
              style={{ width: `${(currentTime / duration) * 100 || 0}%` }}
            ></div>
          </div>
          
          <div className="w-full flex justify-between text-sm text-gray-500 mb-6">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>

          <div className="flex items-center justify-center w-full space-x-8">
            <button 
              onClick={toggleLoopMode}
              className="text-gray-600 hover:text-gray-900"
              title={`Loop: ${loopMode}`}
            >
              {loopMode === 'all' && <FaSync size={20} />}
              {loopMode === 'one' && <FaRedo size={20} />}
              {loopMode === 'off' && <FaRedo size={20} className="opacity-40" />}
            </button>

            <button 
              onClick={playPrev}
              className="text-gray-600 hover:text-gray-900"
              title="Previous"
            >
              <FaStepBackward size={24} />
            </button>
            
            <button
              onClick={togglePlayPause} // This will work now
              className="w-20 h-20 rounded-full bg-linear-to-r from-orange-500 to-red-500 text-white flex items-center justify-center shadow-lg"
            >
              {isPlaying ? <FaPause size={30} /> : <FaPlay size={30} className="ml-1" />}
            </button>
            
            <button 
              onClick={playNext}
              className="text-gray-600 hover:text-gray-900"
              title="Next"
            >
              <FaStepForward size={24} />
            </button>

            <div className="w-5"></div>
          </div>
        </div>
      </div>
      
      {/* Playlist */}
      <div className="w-full max-w-2xl p-8 bg-white rounded-lg shadow-xl">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Playlist</h2>
        
        <div className="max-h-64 overflow-y-auto border rounded-md">
          {playlist.map((track, index) => (
            <button
              key={track._id}
              onClick={() => selectTrack(index)}
              className={`w-full text-left p-3 flex items-center gap-3 border-b ${index === currentTrackIndex ? 'bg-orange-50 text-orange-700' : 'hover:bg-gray-50'}`}
            >
              {index === currentTrackIndex && isPlaying ? <FaPause size={12} /> : <FaPlay size={12} />}
              <span>{track.title}</span>
            </button>
          ))}
        </div>
      </div>

      <Link to="/coping-tools" className="mt-8 mb-4 text-blue-600 hover:underline">
        &larr; Back to all tools
      </Link>
    </div>
  );
};

export default MoodMusicTool;