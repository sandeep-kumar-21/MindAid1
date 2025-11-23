import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  username: {
    type: String, // We store this to avoid populating user just for the name
    required: true,
  },
  isAnonymous: {
    type: Boolean,
    default: false,
  },
  text: {
    type: String,
    required: true,
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  comments: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      username: { type: String, required: true },
      text: { type: String, required: true },
      date: { type: Date, default: Date.now }
    }
  ]
}, {
  timestamps: true
});

const Post = mongoose.model('Post', postSchema);
export default Post;