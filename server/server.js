import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';

// Load env variables
dotenv.config();

// Import routes
import authRoutes from './routes/authRoutes.js';
import moodRoutes from './routes/moodRoutes.js';
import communityRoutes from './routes/communityRoutes.js';
import journalRoutes from './routes/journalRoutes.js';

// Connect to database
connectDB();

const app = express();

// Middleware
// app.use(cors());
app.use(cors({
  origin: 'http://localhost:5173', 
  credentials: true
}));

app.use(express.json()); // To accept JSON data in the body

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/journal', journalRoutes);
app.use('/api/mood', moodRoutes);
app.use('/api/community', communityRoutes);

// Test route
app.get('/', (req, res) => {
  res.send('MindAid API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
