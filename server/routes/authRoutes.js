import express from 'express';
import { registerUser, loginUser, updateUserProfile, forgotPassword, resetPassword, verifyEmail} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.put('/profile', protect, updateUserProfile);
router.post('/forgotpassword', forgotPassword); 
router.put('/resetpassword/:resettoken', resetPassword);
router.post('/verify', verifyEmail);

export default router;