import express from 'express';
import {
  createJournalEntry,
  getRecentEntries,
  getAiSupportResponse,
  deleteJournalEntry
} from '../controllers/journalController.js';
import { protect } from '../middleware/authMiddleware.js';
const router = express.Router();

router.route('/').post(protect, createJournalEntry);
router.route('/recent').get(protect, getRecentEntries);
router.route('/ai-support').post(protect, getAiSupportResponse);
router.route('/:id').delete(protect, deleteJournalEntry);

export default router;