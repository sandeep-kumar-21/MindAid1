import express from 'express';
import {
  saveMood,
  getDashboardData,
  getMoodTrackerData,
} from '../controllers/moodController.js';
import { protect } from '../middleware/authMiddleware.js';
const router = express.Router();

router.route('/').post(protect, saveMood);
router.route('/dashboard').get(protect, getDashboardData);
router.route('/tracker').get(protect, getMoodTrackerData);

export default router;