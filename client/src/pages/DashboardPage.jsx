import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import { 
  FaBook, 
  FaUsers, 
  FaChartLine, // This is needed for the new chart
  FaQuoteLeft, 
  FaBrain, 
  FaSpa 
} from 'react-icons/fa';
import { CgArrowRight } from 'react-icons/cg';

// --- HELPER FUNCTIONS ---
const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
};

// This now provides the dayLabel and dateLabel the new chart needs
const processWeekHistory = (apiMoods) => {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const weekView = [];
  const today = new Date();
  
  const dayOfWeek = today.getDay();
  const diff = today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
  const startOfWeek = new Date(today.setDate(diff));
  startOfWeek.setHours(0, 0, 0, 0);

  for (let i = 0; i < 7; i++) {
    const currentDay = new Date(startOfWeek);
    currentDay.setDate(startOfWeek.getDate() + i);
    
    // Find a mood entry from the API that matches this day
    const apiEntry = apiMoods.find(entry => {
      const entryDate = new Date(entry.date);
      entryDate.setHours(0, 0, 0, 0);
      return entryDate.getTime() === currentDay.getTime();
    });

    weekView.push({
      dayLabel: days[currentDay.getDay()], // e.g., "Mon"
      dateLabel: currentDay.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), // e.g., "Jan 8"
      mood: apiEntry ? apiEntry.mood : 0,
    });
  }
  return weekView;
};

// --- CONSTANTS ADDED ---
// These are needed for the new chart's legend
const moodEmojis = { 1: '😩', 2: '🙁', 3: '😐', 4: '😊', 5: '😄' };
const moodLabels = { 1: 'Very Low', 2: 'Low', 3: 'Neutral', 4: 'Good', 5: 'Great' };

const initialData = {
  userName: 'User',
  weekHistory: [],
  suggestion: { title: 'Loading...', description: '...' },
  quote: { text: 'Loading...' },
};

const moodLevels = [
  { level: 1, emoji: '😩', label: 'Very Low', color: 'text-red-500' },
  { level: 2, emoji: '🙁', label: 'Low', color: 'text-orange-500' },
  { level: 3, emoji: '😐', label: 'Neutral', color: 'text-yellow-500' },
  { level: 4, emoji: '😊', label: 'Good', color: 'text-green-500' },
  { level: 5, emoji: '😄', label: 'Great', color: 'text-blue-500' },
];

const DashboardPage = () => {
  const [mood, setMood] = useState(3);
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saveSuccess, setSaveSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }
        
        const config = {
          headers: { Authorization: `Bearer ${token}` }
        };

        const response = await axios.get('/api/mood/dashboard', config);
        
        // This will now return the correct data structure
        const processedWeekHistory = processWeekHistory(response.data.weekHistory);
        
        setData({
          ...response.data,
          weekHistory: processedWeekHistory,
        });

      } catch (err) {
        console.error('Failed to fetch dashboard data', err);
        setError(err.response?.data?.message || 'Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, [navigate]);

  const handleSaveMood = async () => {
    setSaveSuccess('');
    setError('');
    
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      await axios.post('/api/mood', { mood: mood }, config);
      setSaveSuccess('Mood saved successfully!');
      
      // Re-fetch data to update the week chart instantly
      const response = await axios.get('/api/mood/dashboard', config);
      const processedWeekHistory = processWeekHistory(response.data.weekHistory);
      setData({
        ...response.data,
        weekHistory: processedWeekHistory,
      });

    } catch (err) {
      console.error('Failed to save mood', err);
      setError(err.response?.data?.message || 'Failed to save mood');
    }
  };
  
  const currentMood = moodLevels.find(m => m.level === mood) || moodLevels[2];

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[80vh]">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="p-6 rounded-lg bg-linear-to-r from-blue-500 to-cyan-400 text-white shadow-lg">
        <h1 className="text-3xl font-bold">{getGreeting()}, {data.userName}!</h1>
        <p className="text-lg mt-1 opacity-90">How are you feeling today? Let's check in with yourself.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Column (Left) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Mood Input */}
          <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center">
            <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
              <span className="text-2xl mr-2">🧐</span> How are you feeling today?
            </h2>

            <div className="mb-6 text-center">
              <span className="text-6xl">{currentMood.emoji}</span>
              <p className={`text-lg font-semibold ${currentMood.color} mt-2`}>{currentMood.label}</p>
            </div>

            <div className="relative w-full max-w-md mx-auto mb-8">
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
            
            <div className="h-4 text-sm mb-2">
              {saveSuccess && <p className="text-green-600">{saveSuccess}</p>}
              {error && <p className="text-red-500">{error}</p>}
            </div>
            
            <button 
              onClick={handleSaveMood}
              className="w-full max-w-sm py-3 px-4 rounded-lg text-white font-semibold bg-linear-to-r from-teal-400 to-emerald-500 hover:from-teal-500 hover:to-emerald-600 shadow-md transition-all duration-300"
            >
              Save Today's Mood
            </button>
          </div>

          {/* Journal Prompt */}
          <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-between">
            <div className="flex items-center">
              <div className="p-3 bg-pink-100 rounded-full">
                <FaBook className="text-2xl text-pink-500" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-800">Write Today's Journal</h3>
                <p className="text-gray-600">Express your thoughts and feelings</p>
              </div>
            </div>
            <Link to="/journal">
              <button className="py-2 px-5 rounded-full text-white font-medium bg-linear-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600">
                Start Writing
              </button>
            </Link>
          </div>
          
          {/* --- WEEK AT A GLANCE (REPLACED) --- */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
              <FaChartLine className="mr-2 text-blue-500" /> Your Week at a Glance
            </h2>
            
            {/* Chart Area */}
            <div className="flex justify-between items-end h-52 pb-4 relative"> 
              {data.weekHistory.length > 0 ? (
                data.weekHistory.map((item, index) => (
                  <div key={index} className="flex flex-col items-center flex-1 h-full">
                    
                    {/* Bar container (the "track") */}
                    <div 
                      className="w-1/2 relative flex items-end rounded-t-md bg-pink-100" // Use bg-pink-100 for the track
                      style={{ height: '100%' }}
                    >
                      {/* Actual mood bar with gradient */}
                      <div
                        className="w-full rounded-t-md bg-linear-to-b from-cyan-400 to-blue-500"
                        style={{ 
                          height: `${(item.mood / 5) * 100}%`,
                          opacity: item.mood === 0 ? 0 : 1 // Hide bar if mood is 0
                        }} 
                      ></div>
                    </div>
                    
                    {/* Day and Date Labels */}
                    <div className="text-center mt-2">
                      <span className="text-xs font-semibold text-gray-800 block">{item.dayLabel}</span>
                      {/* <span className="text-xs text-gray-500 block">{item.dateLabel}</span> */}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center w-full">No mood data tracked yet.</p>
              )}
            </div>
            
            {/* Emoji Legend (Hidden, as it's not in the dashboard screenshot) */}
            {/*
            <div className="flex justify-between text-center text-xs text-gray-500 mt-4 px-2">
              <div><span className="text-xl">{moodEmojis[1]}</span><p>{moodLabels[1]}</p></div>
              <div><span className="text-xl">{moodEmojis[2]}</span><p>{moodLabels[2]}</p></div>
              <div><span className="text-xl">{moodEmojis[3]}</span><p>{moodLabels[3]}</p></div>
              <div><span className="text-xl">{moodEmojis[4]}</span><p>{moodLabels[4]}</p></div>
              <div><span className="text-xl">{moodEmojis[5]}</span><p>{moodLabels[5]}</p></div>
            </div>
            */}
            
            <Link to="/mood-tracker" className="text-sm font-medium text-blue-600 hover:underline mt-4 inline-block">
              View Full History
            </Link>
          </div>
          {/* --- END REPLACED SECTION --- */}

        </div>

        {/* Sidebar (Right) */}
        <div className="space-y-8">
          
          {/* Today's Suggestion */}
          <div className="bg-purple-50 p-6 rounded-lg shadow-md border border-purple-100">
            <h3 className="text-lg font-semibold text-purple-800 mb-3">Today's Suggestion</h3>
            <p className="font-medium text-gray-700">{data.suggestion.title}</p>
            <p className="text-gray-600 text-sm mb-4">{data.suggestion.description}</p>

            <Link to={data.suggestion.link}>
              <button className="w-full py-2 px-4 rounded-lg cursor-pointer text-white font-medium bg-linear-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600">
                Try Now
              </button>
            </Link>
          </div>

          {/* Daily Quote */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Daily Quote</h3>
            <div className="flex">
              <FaQuoteLeft className="text-gray-300 text-xl mr-3 shrink-0" />
              <div>
                <p className="text-gray-600 italic">"{data.quote.text}"</p>
                <p className="text-sm text-gray-500 mt-2 font-medium">
                  — {data.quote.author}
                </p>
              </div>
            </div>
          </div>
          
          {/* Quick Actions */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Link to="/coping-tools" className="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:bg-gray-50">
                <span className="flex items-center font-medium text-gray-700"><FaSpa className="mr-2 text-green-500" /> Coping Tools</span>
                <CgArrowRight className="text-gray-400" />
              </Link>
              <Link to="/community" className="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:bg-gray-50">
                <span className="flex items-center font-medium text-gray-700"><FaUsers className="mr-2 text-blue-500" /> Community Support</span>
                <CgArrowRight className="text-gray-400" />
              </Link>
              <Link to="/mood-tracker" className="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:bg-gray-50">
                <span className="flex items-center font-medium text-gray-700"><FaChartLine className="mr-2 text-purple-500" /> Mood Analytics</span>
                <CgArrowRight className="text-gray-400" />
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default DashboardPage;