import Post from '../models/Post.js';

// @desc    Get all posts
// @route   GET /api/community/posts
// @access  Private
const getPosts = async (req, res) => {
  try {
    const posts = await Post.find({}).sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new post
// @route   POST /api/community/posts
// @access  Private
const createPost = async (req, res) => {
  const { text, isAnonymous } = req.body;

  try {
    const post = new Post({
      text,
      isAnonymous,
      user: req.user._id,
      username: isAnonymous ? 'Anonymous' : req.user.name,
    });

    const createdPost = await post.save();
    res.status(201).json(createdPost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Like or unlike a post
// @route   PUT /api/community/posts/:id/like
// @access  Private
const likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check if the post has already been liked by this user
    if (post.likes.includes(req.user._id)) {
      // Unlike: remove user from likes array
      post.likes = post.likes.filter(
        (like) => like.toString() !== req.user._id.toString()
      );
    } else {
      // Like: add user to likes array
      post.likes.push(req.user._id);
    }

    await post.save();
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add a comment to a post
// @route   POST /api/community/posts/:id/comment
// @access  Private
const commentOnPost = async (req, res) => {
  const { text } = req.body;

  if (!text || text.trim().length === 0) {
    return res.status(400).json({ message: 'Comment text is required' });
  }

  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const comment = {
      user: req.user._id,
      username: req.user.name, // We use the real name for comments for simplicity, or you could add anonymous logic here too
      text,
      date: Date.now(),
    };

    post.comments.push(comment);

    await post.save();
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// @desc    Delete a post
// @route   DELETE /api/community/posts/:id
// @access  Private
const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check if user owns the post
    if (post.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    await post.deleteOne();
    res.json({ message: 'Post removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a comment
// @route   DELETE /api/community/posts/:postId/comments/:commentId
// @access  Private
const deleteComment = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Find the comment
    const comment = post.comments.find(
      (c) => c._id.toString() === req.params.commentId
    );

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Check if user owns the comment
    if (comment.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    // Remove comment (filter it out)
    post.comments = post.comments.filter(
      (c) => c._id.toString() !== req.params.commentId
    );

    await post.save();
    res.json(post.comments); // Return updated comments
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// --- UPDATE EXPORTS ---
export { 
  getPosts, 
  createPost, 
  likePost, 
  commentOnPost,
  deletePost,     // <-- ADD
  deleteComment   // <-- ADD
};