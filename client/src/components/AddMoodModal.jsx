import React, { useState } from 'react';
import axios from '../api/axios';
import { FaTimes } from 'react-icons/fa';

const moodLevels = [
  { level: 1, emoji: '😩', label: 'Very Low', color: 'text-red-500' },
  { level: 2, emoji: '🙁', label: 'Low', color: 'text-orange-500' },
  { level: 3, emoji: '😐', label: 'Neutral', color: 'text-yellow-500' },
  { level: 4, emoji: '😊', label: 'Good', color: 'text-green-500' },
  { level: 5, emoji: '😄', label: 'Great', color: 'text-blue-500' },
];

const AddMoodModal = ({ isOpen, onClose, onMoodSaved }) => {
  const [mood, setMood] = useState(3);
  const [note, setNote] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const currentMood = moodLevels.find(m => m.level === mood) || moodLevels[2];

  const handleSave = async () => {
    setIsLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('You must be logged in to save a mood.');
        setIsLoading(false);
        return;
      }
      
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      // --- 1. ALWAYS save the numerical mood for the charts ---
      await axios.post('/api/mood', { mood: mood }, config);

      // --- 2. IF there is a note, ALSO save it to the journal ---
      if (note.trim().length > 0) {
         await axios.post('/api/journal', {
          entry: note,
          mood: currentMood.emoji // We save the emoji with the journal text
        }, config);
      }
      
      setIsLoading(false);
      setNote('');
      setMood(3);
      onMoodSaved(); // Refresh the parent page
      onClose();

    } catch (err) {
      console.error('Failed to save data', err);
      setError(err.response?.data?.message || 'Failed to save.');
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setError('');
    setNote('');
    setMood(3);
    onClose();
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-md p-6 relative">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <FaTimes size={20} />
        </button>

        <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
          Add Today's Mood
        </h2>
        
        <div className="mb-6 text-center">
          <span className="text-6xl">{currentMood.emoji}</span>
          <p className={`text-lg font-semibold ${currentMood.color} mt-2`}>{currentMood.label}</p>
        </div>

        <div className="relative w-full mx-auto mb-6">
          <input
            type="range"
            min="1"
            max="5"
            step="1"
            value={mood}
            onChange={(e) => setMood(Number(e.target.value))}
            className="w-full h-3 appearance-none bg-gray-400 rounded-full cursor-pointer 
                       [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:-mt-[calc(6px_/_2_-_6px_/_2)]
                       [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:shadow-lg
                       "
          />
          <div className="flex justify-between w-full px-1 mt-3">
            {moodLevels.map(m => (
              <span key={m.level} className="text-xl opacity-70">
                {m.emoji}
              </span>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="moodNote" className="block text-sm font-medium text-gray-700 mb-2">
            How are you feeling? What happened today?
          </label>
          <textarea
            id="moodNote"
            rows="3"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Add a note (optional)..."
          ></textarea>
        </div>
        
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

        <div className="flex gap-4 mt-6">
          <button
            onClick={handleClose}
            className="w-full py-2 px-4 rounded-lg text-gray-700 font-semibold bg-gray-100 hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isLoading}
            className="w-full py-2 px-4 rounded-lg text-white font-semibold bg-linear-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 disabled:opacity-50"
          >
            {isLoading ? 'Saving...' : 'Save Mood'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddMoodModal;