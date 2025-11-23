import Journal from '../models/Journal.js';
import { getAiSupport } from '../utils/geminiHelper.js';

// @desc    Create a new journal entry
// @route   POST /api/journal
// @access  Private
const createJournalEntry = async (req, res) => {
  const { entry, mood } = req.body;

  try {
    const journal = new Journal({
      user: req.user._id,
      entry,
      mood,
    });

    const createdJournal = await journal.save();
    res.status(201).json(createdJournal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get recent journal entries
// @route   GET /api/journal/recent
// @access  Private
const getRecentEntries = async (req, res) => {
  try {
    const entries = await Journal.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(5); // Matches the frontend request
    res.json(entries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get AI support for a journal entry
// @route   POST /api/journal/ai-support
// @access  Private
const getAiSupportResponse = async (req, res) => {
  const { journalEntry } = req.body;

  if (!journalEntry) {
    return res.status(400).json({ message: 'Journal entry is required' });
  }

  console.log('Received journal entry for AI support:', journalEntry);
  try {
    console.log('Calling getAiSupport with journal entry');
    const feedback = await getAiSupport(journalEntry);
    res.json({ supportiveFeedback: feedback });
    console.log('AI support response sent:', feedback);
  } catch (error) {
    console.error('Error getting AI support:', error);
    res.status(500).json({ message: 'Failed to get AI support' });
  }
};


// @desc    Delete journal entry
// @route   DELETE /api/journal/:id
// @access  Private
const deleteJournalEntry = async (req, res) => {
  try {
    const journal = await Journal.findById(req.params.id);

    if (!journal) {
      return res.status(404).json({ message: 'Journal entry not found' });
    }

    // Check user (ensure they only delete THEIR OWN entry)
    if (journal.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    await journal.deleteOne();
    res.json({ message: 'Journal entry removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export { 
  createJournalEntry, 
  getRecentEntries, 
  getAiSupportResponse,
  deleteJournalEntry
};