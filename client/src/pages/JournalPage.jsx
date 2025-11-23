import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import toast from 'react-hot-toast'; // <-- Import toast
import { FaBook, FaMagic, FaSave, FaTrash } from 'react-icons/fa';

// Helper to format date
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

const JournalPage = () => {
  const [entry, setEntry] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isLoadingAi, setIsLoadingAi] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [recentEntries, setRecentEntries] = useState([]);
  // const [error, setError] = useState(''); <-- REMOVED OLD ERROR STATE

  // --- FETCH ENTRIES ---
  useEffect(() => {
    const fetchRecentEntries = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
        const config = { headers: { Authorization: `Bearer ${token}` } };

        const response = await axios.get('/api/journal/recent', config);
        
        const transformedEntries = response.data.map(item => ({
          id: item._id,
          date: formatDate(item.createdAt),
          excerpt: item.entry.length > 60 ? item.entry.substring(0, 60) + '...' : item.entry,
          mood: item.mood || '🙂',
        }));
        
        setRecentEntries(transformedEntries);
      } catch (err) {
        console.error('Failed to fetch recent entries', err);
        // Use toast instead of setError
        toast.error('Could not load recent entries.'); 
      }
    };
    fetchRecentEntries();
  }, []);

  // --- SAVE ENTRY ---
  const handleSaveEntry = async () => {
    if (entry.trim().length === 0) {
        toast.error("Please write something first!");
        return;
    }
    setIsSaving(true);
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await axios.post('/api/journal', { entry }, config);

      const newEntry = {
        id: response.data._id,
        date: formatDate(response.data.createdAt),
        excerpt: response.data.entry.length > 60 ? response.data.entry.substring(0, 60) + '...' : response.data.entry,
        mood: response.data.mood || '🙂',
      };
      setRecentEntries([newEntry, ...recentEntries]);
      setEntry('');
      setAiResponse('');
      toast.success('Journal entry saved!'); // <-- SUCCESS TOAST
    } catch (err) {
      console.error('Failed to save entry', err);
      toast.error(err.response?.data?.message || 'Could not save entry'); // <-- ERROR TOAST
    } finally {
      setIsSaving(false);
    }
  };
  
  // --- GET AI SUPPORT ---
  const handleGetAiSupport = async () => {
    if (entry.trim().length === 0) {
         toast.error("Please write something for the AI to analyze.");
         return;
    }
    setIsLoadingAi(true);
    setAiResponse('');
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await axios.post('/api/journal/ai-support', { journalEntry: entry }, config);
      setAiResponse(response.data.supportiveFeedback);
      toast.success('AI response generated!');
    } catch (err) {
      console.error('Failed to get AI support', err);
      toast.error('AI is having trouble right now. Try again later.');
    } finally {
      setIsLoadingAi(false);
    }
  };

  // --- DELETE ENTRY ---
  const handleDeleteEntry = async (id) => {
    // if (!window.confirm("Are you sure you want to delete this entry?")) return;

    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      await axios.delete(`/api/journal/${id}`, config);

      // Update UI instantly
      setRecentEntries(recentEntries.filter(item => item.id !== id));
      toast.success('Entry deleted');

    } catch (err) {
      console.error('Failed to delete entry', err);
      // This will now show the EXACT error from the backend in a nice popup
      toast.error(err.response?.data?.message || 'Could not delete entry');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <FaBook className="text-3xl text-green-600 mr-3" />
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Daily Journal</h1>
          <p className="text-gray-600">Express your thoughts and feelings</p>
        </div>
      </div>

      {/* Removed the old red error box from here */}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Journal Editor */}
        <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
          <h2 className="text-xl font-semibold text-gray-800">What's on your mind today?</h2>
          <p className="text-sm text-gray-600">
            Share your thoughts, feelings, or experiences from today. There's no right or wrong way to journal - just let your thoughts flow naturally.
          </p>
          <textarea
            value={entry}
            onChange={(e) => setEntry(e.target.value)}
            rows="10"
            className="w-full p-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Start writing..."
          ></textarea>
          <div className="flex justify-between items-center gap-4">
            <span className="text-sm text-gray-500 shrink-0">{entry.length} characters</span>
            <div className="flex gap-2">
              <button 
                onClick={handleSaveEntry}
                disabled={isSaving}
                className="flex items-center py-2 px-4 rounded-lg text-white font-semibold bg-linear-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 disabled:opacity-50"
              >
                <FaSave className="mr-2" /> {isSaving ? 'Saving...' : 'Save'}
              </button>
              <button 
                onClick={handleGetAiSupport}
                disabled={isLoadingAi}
                className="flex items-center py-2 px-4 rounded-lg text-white font-semibold bg-linear-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 disabled:opacity-50"
              >
                <FaMagic className="mr-2" /> {isLoadingAi ? 'Generating...' : 'Get AI Support'}
              </button>
            </div>
          </div>
        </div>

        {/* AI Support Response */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">AI Support Response</h2>
          {isLoadingAi && (
            <div className="flex justify-center items-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
            </div>
          )}
          {!isLoadingAi && aiResponse && (
            <p className="text-gray-700 leading-relaxed">{aiResponse}</p>
          )}
          {!isLoadingAi && !aiResponse && (
            <div className="text-center text-gray-400 h-full flex flex-col justify-center items-center">
              <FaMagic className="text-4xl mb-2" />
              <p>Write your journal entry and I'll provide supportive feedback.</p>
            </div>
          )}
        </div>
      </div>

      {/* Recent Entries List */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Entries</h2>
        <div className="space-y-4">
          {recentEntries.length > 0 ? (
            recentEntries.map(item => (
              <div key={item.id} className="flex items-center p-4 border rounded-lg border-gray-100 hover:bg-gray-50 transition-all group">
                <span className="text-2xl mr-4">{item.mood}</span>
                <div className="flex-1 min-w-0 mr-4">
                  <span className="text-sm font-medium text-gray-500">{item.date}</span>
                  <p className="text-gray-700 truncate">{item.excerpt}</p>
                </div>
                
                <button 
                  onClick={() => handleDeleteEntry(item.id)}
                  className="p-2 text-gray-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                  title="Delete Entry"
                >
                  <FaTrash />
                </button>

              </div>
            ))
          ) : (
            <p className="text-gray-500">No recent journal entries found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default JournalPage;
