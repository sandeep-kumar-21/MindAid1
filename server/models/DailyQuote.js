// server/models/DailyQuote.js
import mongoose from 'mongoose';

const dailyQuoteSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
    unique: true, // We only want one quote per day
  },
}, {
  timestamps: true,
});

const DailyQuote = mongoose.model('DailyQuote', dailyQuoteSchema);
export default DailyQuote;