import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import toast from 'react-hot-toast'; // <-- Import toast
import { 
  FaPlus, 
  FaCheckCircle, 
  FaStar, 
  FaTachometerAlt, 
  FaChartLine,
  FaTrash // <-- Import FaTrash
} from 'react-icons/fa';
import AddMoodModal from '../components/AddMoodModal';

const initialData = {
  moodTrend: [],
  stats: { average: 0, bestDay: 0, daysTracked: 0 },
  recentEntries: [],
  insights: []
};

const moodEmojis = { 1: '😩', 2: '🙁', 3: '😐', 4: '😊', 5: '😄' };
const moodLabels = { 1: 'Very Low', 2: 'Low', 3: 'Neutral', 4: 'Good', 5: 'Great' };

const moodColors = { 
  1: 'text-red-500', 
  2: 'text-orange-500', 
  3: 'text-yellow-500', 
  4: 'text-green-500', 
  5: 'text-blue-500' 
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return {
    day: date.toLocaleDateString('en-US', { weekday: 'short' }),
    monthDay: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  };
};

const MoodTrackerPage = () => {
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchTrackerData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No token found. Please log in.');
        setLoading(false);
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.get('/api/mood/tracker', config);
      const apiData = response.data;
      
      const transformedData = {
        moodTrend: apiData.moodTrend.map(item => ({
          dayLabel: formatDate(item.date).day,
          dateLabel: formatDate(item.date).monthDay,
          mood: item.mood,
        })),
        stats: {
          average: parseFloat(apiData.stats.average?.toFixed(1) || 0),
          bestDay: apiData.stats.bestDay || 0,
          daysTracked: apiData.stats.daysTracked || 0,
        },
        recentEntries: apiData.recentEntries.map(entry => ({
          id: entry._id,
          date: formatDate(entry.createdAt).monthDay,
          mood: entry.mood,
          note: entry.entry,
        })),
        insights: apiData.insights || [],
      };

      setData(transformedData);

    } catch (err) {
      console.error('Failed to fetch mood data', err);
      setError(err.response?.data?.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrackerData();
  }, []);

  const handleMoodSaved = () => {
    fetchTrackerData();
  };

  // --- NEW: Handle Delete Entry ---
  const handleDeleteEntry = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      await axios.delete(`/api/journal/${id}`, config);

      // Optimistic UI update
      setData(prevData => ({
        ...prevData,
        recentEntries: prevData.recentEntries.filter(entry => entry.id !== id)
      }));
      
      toast.success('Entry deleted');
      // Optionally refetch all data to update stats too
      // fetchTrackerData(); 

    } catch (err) {
      console.error('Failed to delete entry', err);
      toast.error(err.response?.data?.message || 'Could not delete entry');
    }
  };
  // --------------------------------

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-6 bg-red-100 text-red-700 rounded-lg">
        <h2 className="text-xl font-bold">Error</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Mood Tracker</h1>
          <p className="text-gray-600">Track your emotional journey</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center py-2 px-4 rounded-lg text-white font-semibold bg-linear-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 shadow-md"
        >
          <FaPlus className="mr-2" /> Add Mood
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Column (Left) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Mood Trend Chart */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
              <FaChartLine className="mr-2 text-blue-500" /> This Week's Mood Trend
            </h2>
            
            <div className="flex justify-between items-end h-80 pb-2 relative"> 
              {data.moodTrend.length > 0 ? (
                data.moodTrend.map((item, index) => (
                  <div key={index} className="flex flex-col items-center flex-1 h-full">
                    <span 
                      className="absolute text-sm font-medium text-gray-800 transition-all duration-500"
                      style={{ bottom: `calc(${(item.mood / 5) * 60}% + 110px)` }}
                    >
                      {item.mood}
                    </span>
                    <div className="w-1/2 relative flex items-end rounded-t-md bg-white mb-3" style={{ height: '60%' }}>
                      <div className="w-full rounded-t-md bg-linear-to-b from-cyan-400 to-blue-500 transition-all duration-500 ease-out" style={{ height: `${(item.mood / 5) * 100}%` }}></div>
                    </div>
                    <div className="text-center mb-2">
                      <span className="text-xs font-semibold text-gray-800 block">{item.dayLabel}</span>
                      <span className="text-xs text-gray-500 block">{item.dateLabel}</span>
                    </div>
                    <div className="text-2xl" title={moodLabels[item.mood]}>{moodEmojis[item.mood]}</div>
                    <span className={`text-[10px] font-medium mt-1 ${moodColors[item.mood]}`}>{moodLabels[item.mood]}</span>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center w-full self-center">No mood data tracked yet.</p>
              )}
            </div>
          </div>
          
          {/* Recent Entries */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Entries</h2>
            <div className="space-y-4">
              {data.recentEntries.length > 0 ? (
                data.recentEntries.map(entry => (
                  // Added 'group' class for hover effect
                  <div key={entry.id} className="flex items-center p-4 border-b border-gray-100 last:border-b-0 group transition-colors hover:bg-gray-50">
                    <span className="text-3xl mr-4">{moodEmojis[entry.mood] || '🙂'}</span>
                    <div className="flex-1 min-w-0 mr-4">
                      <span className="text-sm text-gray-500">{entry.date}</span>
                      <p className="text-gray-700 truncate">{entry.note}</p>
                    </div>
                    
                    {/* --- NEW DELETE BUTTON --- */}
                    <button 
                      onClick={() => handleDeleteEntry(entry.id)}
                      className="p-2 text-gray-400 hover:text-red-500 transition-opacity opacity-0 group-hover:opacity-100 focus:opacity-100"
                      title="Delete Entry"
                    >
                      <FaTrash />
                    </button>
                    {/* ------------------------- */}

                  </div>
                ))
              ) : (
                <p className="text-gray-500">No recent journal entries found.</p>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar (Right) */}
        <div className="space-y-6">
           {/* ... Weekly Stats & Insights (same as before) ... */}
           <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Weekly Stats</h3>
            <div className="space-y-4">
              <div className="flex items-center bg-blue-50 p-4 rounded-lg">
                <FaTachometerAlt className="text-3xl text-blue-500 mr-4" />
                <div>
                  <span className="text-2xl font-bold text-blue-800">{data.stats.average}</span>
                  <p className="text-sm text-blue-600">Average Mood</p>
                </div>
              </div>
              <div className="flex items-center bg-pink-50 p-4 rounded-lg">
                <FaStar className="text-3xl text-pink-500 mr-4" />
                <div>
                  <span className="text-2xl font-bold text-pink-800">{moodLabels[data.stats.bestDay] || 'N/A'}</span>
                  <p className="text-sm text-pink-600">Best Day</p>
                </div>
              </div>
              <div className="flex items-center bg-green-50 p-4 rounded-lg">
                <FaCheckCircle className="text-3xl text-green-500 mr-4" />
                <div>
                  <span className="text-2xl font-bold text-green-800">{data.stats.daysTracked}</span>
                  <p className="text-sm text-green-600">Days Tracked</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Insights</h3>
            <ul className="space-y-3">
              {data.insights.length > 0 ? (
                data.insights.map((insight, index) => (
                  <li key={index} className="p-3 bg-yellow-50 rounded-md text-sm text-yellow-800 border border-yellow-100">
                    {insight}
                  </li>
                ))
              ) : (
                <p className="text-gray-500 text-sm">No insights available yet.</p>
              )}
            </ul>
          </div>
        </div>
      </div>

      <AddMoodModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onMoodSaved={handleMoodSaved}
      />
    </div>
  );
};

export default MoodTrackerPage;