import mongoose from 'mongoose';

const journalSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  entry: {
    type: String,
    required: true,
  },
  mood: {
    type: String, // '🙂', '😊', etc.
    required: false,
  },
  aiResponse: {
    type: String,
    required: false,
  },
}, {
  timestamps: true,
});

const Journal = mongoose.model('Journal', journalSchema);
export default Journal;