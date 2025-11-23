import mongoose from 'mongoose';

const moodSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  mood: {
    type: Number, // 1 (Very Low) to 5 (Great)
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
}, {
  timestamps: true,
});

// Ensure a user can only have one mood entry per day
moodSchema.index({ user: 1, date: 1 }, { unique: true });

const Mood = mongoose.model('Mood', moodSchema);
export default Mood;