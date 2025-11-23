import express from 'express';
import { getPosts, createPost, likePost, commentOnPost, deletePost, deleteComment } from '../controllers/communityController.js';
import { protect } from '../middleware/authMiddleware.js';
const router = express.Router();

router.route('/posts').get(protect, getPosts).post(protect, createPost);
// You would add routes for likes/comments here, e.g., POST /posts/:id/like
router.route('/posts/:id/like').put(protect, likePost);
router.route('/posts/:id/comment').post(protect, commentOnPost);

router.route('/posts/:id').delete(protect, deletePost);
router.route('/posts/:postId/comments/:commentId').delete(protect, deleteComment);

export default router;