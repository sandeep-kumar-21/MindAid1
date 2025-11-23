// import Mood from '../models/Mood.js';
// import Journal from '../models/Journal.js';
// // --- ADDED IMPORTS ---
// import DailyQuote from '../models/DailyQuote.js';
// import { getDailyQuoteFromGemini } from '../utils/geminiHelper.js';

// // @desc    Save or update today's mood
// // @route   POST /api/mood
// // @access  Private
// const saveMood = async (req, res) => {
//   const { mood } = req.body;

//   // Get start of today
//   const today = new Date();
//   today.setHours(0, 0, 0, 0);

//   try {
//     const existingMood = await Mood.findOne({
//       user: req.user._id,
//       date: today,
//     });

//     if (existingMood) {
//       // Update existing mood for today
//       existingMood.mood = mood;
//       const updatedMood = await existingMood.save();
//       res.json(updatedMood);
//     } else {
//       // Create new mood for today
//       const newMood = new Mood({
//         user: req.user._id,
//         mood,
//         date: today,
//       });
//       const createdMood = await newMood.save();
//       res.status(201).json(createdMood);
//     }
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };


// // --- THIS FUNCTION IS NOW UPDATED ---
// // @desc    Get dashboard data
// // @route   GET /api/mood/dashboard
// // @access  Private
// const getDashboardData = async (req, res) => {
//   try {
//     // --- Get Today's Date (at midnight) ---
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);

//     // --- Find or Create the Daily Quote ---
//     let quoteData;
//     const existingQuote = await DailyQuote.findOne({ date: today });

//     if (existingQuote) {
//       // If quote for today exists, use it
//       quoteData = existingQuote;
//     } else {
//       // If not, fetch a new one from Gemini
//       console.log('No quote found for today. Fetching from Gemini...');
//       const newQuote = await getDailyQuoteFromGemini();
      
//       // Save the new quote to the DB
//       quoteData = await DailyQuote.create({
//         text: newQuote.text,
//         author: newQuote.author,
//         date: today,
//       });
//     }

//     // --- Get Mood History (existing logic) ---
//     const sevenDaysAgo = new Date();
//     sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
//     sevenDaysAgo.setHours(0, 0, 0, 0);

//     const moodHistory = await Mood.find({
//       user: req.user._id,
//       date: { $gte: sevenDaysAgo },
//     }).sort({ date: 'asc' });
    
//     // Get suggestion (mocked as in frontend)
//     const suggestion = {
//       title: 'Breathing Exercise',
//       description: 'Take 5 minutes to practice deep breathing and center yourself.',
//     };

//     // --- Send the final response ---
//     res.json({
//       userName: req.user.name,
//       weekHistory: moodHistory,
//       suggestion,
//       quote: { // Send the quote from our database
//         text: quoteData.text,
//         author: quoteData.author,
//       },
//     });
//   } catch (error) {
//     console.error('Error in getDashboardData:', error);
//     res.status(500).json({ message: error.message });
//   }
// };


// // @desc    Get mood tracker page data
// // @route   GET /api/mood/tracker
// // @access  Private
// const getMoodTrackerData = async (req, res) => {
//   try {
//     // 1. Get mood trend (last 7 days)
//     const sevenDaysAgo = new Date();
//     sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
//     sevenDaysAgo.setHours(0, 0, 0, 0);

//     const moodTrend = await Mood.find({
//       user: req.user._id,
//       date: { $gte: sevenDaysAgo },
//     }).sort({ date: 'asc' });

//     // 2. Get recent journal entries
//     const recentEntries = await Journal.find({ user: req.user._id })
//       .sort({ createdAt: -1 })
//       .limit(3);

//     // 3. Get stats (all time)
//     const stats = await Mood.aggregate([
//       { $match: { user: req.user._id } },
//       {
//         $group: {
//           _id: '$user',
//           average: { $avg: '$mood' },
//           bestDay: { $max: '$mood' },
//           daysTracked: { $sum: 1 },
//         },
//       },
//     ]);

//     res.json({
//       moodTrend,
//       recentEntries,
//       stats: stats[0] || { average: 0, bestDay: 0, daysTracked: 0 },
//       // Insights would be generated here, maybe by Gemini in a future step
//       insights: [
//         'Your mood tends to improve on weekends.',
//         'Consider journaling on lower mood days.'
//       ],
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// export { saveMood, getDashboardData, getMoodTrackerData };







import Mood from '../models/Mood.js';
import Journal from '../models/Journal.js';
import DailyQuote from '../models/DailyQuote.js';
import { getDailyQuoteFromGemini } from '../utils/geminiHelper.js';

// --- NEW: Define your list of suggestions ---
const SUGGESTIONS = [
  {
    title: '4-7-8 Breathing',
    description: 'Feeling overwhelmed? Take 5 minutes to practice deep breathing and center yourself.',
    link: '/coping-tools/breathing'
  },
  {
    title: 'Guided Meditation',
    description: 'Take a short mental break. Reset your mind with a 5-minute guided meditation session.',
    link: '/coping-tools/meditation'
  },
  {
    title: 'Grounding Exercise',
    description: 'Feeling anxious? Use the 5-4-3-2-1 technique to reconnect with the present moment.',
    link: '/coping-tools/grounding'
  },
  {
    title: 'Progressive Relaxation',
    description: 'Release physical tension and stress by slowly relaxing each muscle group in your body.',
    link: '/coping-tools/relaxation'
  },
  {
    title: 'Positive Affirmations',
    description: 'Boost your self-esteem today. Take a moment to read and repeat some positive affirmations.',
    link: '/coping-tools/affirmations'
  },
   {
    title: 'Mood Music',
    description: 'Shift your energy with some calming or uplifting tunes from our curated playlist.',
    link: '/coping-tools/music'
  }
];

// @desc    Save or update today's mood
// @route   POST /api/mood
// @access  Private
const saveMood = async (req, res) => {
  // ... (keep existing saveMood code same as before)
   const { mood } = req.body;

  // Get start of today
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  try {
    const existingMood = await Mood.findOne({
      user: req.user._id,
      date: today,
    });

    if (existingMood) {
      // Update existing mood for today
      existingMood.mood = mood;
      const updatedMood = await existingMood.save();
      res.json(updatedMood);
    } else {
      // Create new mood for today
      const newMood = new Mood({
        user: req.user._id,
        mood,
        date: today,
      });
      const createdMood = await newMood.save();
      res.status(201).json(createdMood);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get dashboard data
// @route   GET /api/mood/dashboard
// @access  Private
const getDashboardData = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // --- Daily Quote Logic (Keep as is) ---
    let quoteData;
    const existingQuote = await DailyQuote.findOne({ date: today });
    if (existingQuote) {
      quoteData = existingQuote;
    } else {
      // console.log('No quote found for today. Fetching from Gemini...');
      const newQuote = await getDailyQuoteFromGemini();
      quoteData = await DailyQuote.create({
        text: newQuote.text,
        author: newQuote.author,
        date: today,
      });
    }

    // --- Mood History Logic (Keep as is) ---
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    sevenDaysAgo.setHours(0, 0, 0, 0);
    const moodHistory = await Mood.find({
      user: req.user._id,
      date: { $gte: sevenDaysAgo },
    }).sort({ date: 'asc' });
    
    // --- NEW: Suggestion Logic ---
    // Pick a suggestion based on the day of the month so it rotates daily for everyone
    const dayOfMonth = today.getDate();
    const suggestionIndex = dayOfMonth % SUGGESTIONS.length;
    const todaysSuggestion = SUGGESTIONS[suggestionIndex];

    res.json({
      userName: req.user.name,
      weekHistory: moodHistory,
      suggestion: todaysSuggestion, // Send the dynamic suggestion
      quote: {
        text: quoteData.text,
        author: quoteData.author,
      },
    });
  } catch (error) {
    console.error('Error in getDashboardData:', error);
    res.status(500).json({ message: error.message });
  }
};

// ... (keep getMoodTrackerData same as before)
const getMoodTrackerData = async (req, res) => {
    // ... existing code
      try {
    // 1. Get mood trend (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const moodTrend = await Mood.find({
      user: req.user._id,
      date: { $gte: sevenDaysAgo },
    }).sort({ date: 'asc' });

    // 2. Get recent journal entries
    const recentEntries = await Journal.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(3);

    // 3. Get stats (all time)
    const stats = await Mood.aggregate([
      { $match: { user: req.user._id } },
      {
        $group: {
          _id: '$user',
          average: { $avg: '$mood' },
          bestDay: { $max: '$mood' },
          daysTracked: { $sum: 1 },
        },
      },
    ]);

    res.json({
      moodTrend,
      recentEntries,
      stats: stats[0] || { average: 0, bestDay: 0, daysTracked: 0 },
      // Insights would be generated here, maybe by Gemini in a future step
      insights: [
        'Your mood tends to improve on weekends.',
        'Consider journaling on lower mood days.'
      ],
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export { saveMood, getDashboardData, getMoodTrackerData };