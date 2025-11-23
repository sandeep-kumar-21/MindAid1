import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import toast from 'react-hot-toast'; // Using toast for notifications
import { FaInfoCircle, FaRegComment, FaHeart, FaUserSecret, FaPaperPlane, FaTrash } from 'react-icons/fa';

// Helper to format dates
const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  return new Date(dateString).toLocaleDateString('en-US', options);
};

// --- NEW HELPER: Get current user ID from token ---
const getCurrentUserId = () => {
  const token = localStorage.getItem('token');
  if (!token) return null;
  try {
    // Decode the base64 JWT payload to get the user ID
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.id;
  } catch (e) {
    return null;
  }
};

const CommunityPage = () => {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isPosting, setIsPosting] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(getCurrentUserId()); // Get ID on load

  const [activeCommentPostId, setActiveCommentPostId] = useState(null);
  const [commentText, setCommentText] = useState('');

  // --- FETCH POSTS ---
  const fetchPosts = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await axios.get('/api/community/posts', config);
      setPosts(response.data);
    } catch (err) {
      console.error('Failed to fetch posts', err);
      toast.error('Could not load posts.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // --- HANDLE POST SUBMIT ---
  const handlePostSubmit = async (e) => {
    e.preventDefault();
    if (newPost.trim() === '') return;

    setIsPosting(true);
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const postData = { text: newPost, isAnonymous: isAnonymous };

      const response = await axios.post('/api/community/posts', postData, config);
      setPosts([response.data, ...posts]);
      setNewPost('');
      setIsAnonymous(false);
      toast.success('Post shared!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not share post.');
    } finally {
      setIsPosting(false);
    }
  };

  // --- NEW: DELETE POST ---
  const handleDeletePost = async (postId) => {
    // if (!window.confirm("Are you sure you want to delete this post?")) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/community/posts/${postId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Remove from UI
      setPosts(posts.filter(p => p._id !== postId));
      toast.success('Post deleted');
    } catch (err) {
      toast.error('Failed to delete post');
    }
  };

  // --- LIKE POST ---
  const handleLike = async (postId) => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      // Optimistic update for speed
      setPosts(posts.map(p => p._id === postId ? { ...p, likes: [...p.likes, currentUserId] } : p));
      
      const response = await axios.put(`/api/community/posts/${postId}/like`, {}, config);
      // Update with real data from server to be sure
      setPosts(posts.map(p => p._id === postId ? response.data : p));
    } catch (err) {
      fetchPosts(); // Revert on error
    }
  };

  // --- COMMENT SUBMIT ---
  const handleCommentSubmit = async (postId, e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await axios.post(`/api/community/posts/${postId}/comment`, { text: commentText }, config);
      
      setPosts(posts.map(p => p._id === postId ? response.data : p));
      setCommentText('');
      toast.success('Comment added');
    } catch (err) {
      toast.error('Failed to add comment');
    }
  };

  // --- NEW: DELETE COMMENT ---
  const handleDeleteComment = async (postId, commentId) => {
    // if (!window.confirm("Delete this comment?")) return;
    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(`/api/community/posts/${postId}/comments/${commentId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // The backend returns the UPDATED comments array
      setPosts(posts.map(p => p._id === postId ? { ...p, comments: response.data } : p));
      toast.success('Comment deleted');
    } catch (err) {
      toast.error('Failed to delete comment');
    }
  };

  const toggleComments = (postId) => {
    setActiveCommentPostId(activeCommentPostId === postId ? null : postId);
    setCommentText('');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <h1 className="text-3xl font-bold text-gray-800">Community Support</h1>
        
         <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-md">
           <div className="flex">
             <div className="shrink-0"><FaInfoCircle className="h-5 w-5 text-blue-400" /></div>
             <div className="ml-3"><p className="text-sm text-blue-700 mt-1">This is a supportive community. Please be kind and respectful.</p></div>
           </div>
         </div>

        {/* New Post Form */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <form onSubmit={handlePostSubmit}>
            <textarea
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              rows="3"
              className="w-full p-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="What's on your mind today?"
            ></textarea>
            <div className="flex justify-between items-center mt-4">
               <label className="flex items-center cursor-pointer">
                <div className="relative">
                  <input type="checkbox" className="sr-only" checked={isAnonymous} onChange={() => setIsAnonymous(!isAnonymous)} />
                  <div className={`block w-10 h-6 rounded-full transition-colors ${isAnonymous ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
                  <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${isAnonymous ? 'transform translate-x-4' : ''}`}></div>
                </div>
                <div className="ml-3 text-gray-700 font-medium">Post anonymously</div>
              </label>
              <button type="submit" disabled={isPosting || !newPost.trim()} className="py-2 px-6 rounded-lg text-white font-semibold bg-linear-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 disabled:opacity-50">
                {isPosting ? 'Sharing...' : 'Share Post'}
              </button>
            </div>
          </form>
        </div>

        {/* Post Feed */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-10"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mx-auto"></div></div>
          ) : posts.length === 0 ? (
            <div className="text-center p-8 bg-white rounded-lg shadow-md text-gray-500">No posts yet. Be the first to share!</div>
          ) : (
            posts.map(post => (
              <div key={post._id} className="bg-white p-6 rounded-lg shadow-md transition-all relative group">
                
                {/* --- DELETE POST BUTTON (Only if it's my post) --- */}
                {currentUserId === post.user && (
                   <button 
                     onClick={() => handleDeletePost(post._id)}
                     className="absolute top-4 right-4 text-gray-300 hover:text-red-500 transition-colors"
                     title="Delete Post"
                   >
                     <FaTrash />
                   </button>
                )}
                {/* ------------------------------------------------ */}

                <div className="flex items-center mb-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${post.isAnonymous ? 'bg-gray-400' : 'bg-blue-500'}`}>
                    {post.isAnonymous ? <FaUserSecret className="text-xl" /> : post.username.charAt(0).toUpperCase()}
                  </div>
                  <div className="ml-3">
                    <span className="font-semibold text-gray-800">{post.isAnonymous ? 'Anonymous' : post.username}</span>
                    <p className="text-xs text-gray-500">{formatDate(post.createdAt)}</p>
                  </div>
                </div>
                
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap mb-4">{post.text}</p>
                
                <div className="flex items-center space-x-6 text-gray-500 border-t pt-4">
                  <button onClick={() => handleLike(post._id)} className={`flex items-center transition-colors hover:text-pink-500 ${post.likes.includes(currentUserId) ? 'text-pink-500' : ''}`}>
                    <FaHeart className="mr-2" /> {post.likes.length}
                  </button>
                  <button onClick={() => toggleComments(post._id)} className={`flex items-center transition-colors hover:text-blue-500 ${activeCommentPostId === post._id ? 'text-blue-500' : ''}`}>
                    <FaRegComment className="mr-2" /> {post.comments.length}
                  </button>
                </div>

                {/* Comment Section */}
                {activeCommentPostId === post._id && (
                  <div className="mt-4 pt-4 border-t border-gray-100 animate-fadeIn">
                    <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
                      {post.comments.length > 0 ? (
                        post.comments.map((comment) => (
                          <div key={comment._id} className="bg-gray-50 p-3 rounded-md text-sm relative group/comment">
                            <div className="flex justify-between text-gray-500 text-xs mb-1">
                              <span className="font-semibold">{comment.username}</span>
                              <span>{formatDate(comment.date)}</span>
                            </div>
                            <p className="text-gray-700 pr-6">{comment.text}</p>
                            
                            {/* --- DELETE COMMENT BUTTON (Only if it's my comment) --- */}
                            {currentUserId === comment.user && (
                              <button 
                                onClick={() => handleDeleteComment(post._id, comment._id)}
                                className="absolute top-10 right-3 text-gray-300 hover:text-red-500 opacity-0 group-hover/comment:opacity-100 transition-opacity"
                                title="Delete Comment"
                              >
                                <FaTrash size={12} />
                              </button>
                            )}
                            {/* ------------------------------------------------------ */}
                            
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-400 text-sm italic">No comments yet.</p>
                      )}
                    </div>

                    <form onSubmit={(e) => handleCommentSubmit(post._id, e)} className="flex gap-2">
                      <input type="text" value={commentText} onChange={(e) => setCommentText(e.target.value)} placeholder="Write a supportive comment..." className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-400 text-sm" />
                      <button type="submit" disabled={!commentText.trim()} className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"><FaPaperPlane /></button>
                    </form>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
      
      {/* Sidebar (Static) */}
      <div className="space-y-6">
         {/* ... Crisis Resources ... */}
         <div className="bg-red-50 p-6 rounded-lg shadow-md border-l-4 border-red-400">
          <h3 className="text-lg font-bold text-red-800 mb-2">Crisis Resources</h3>
          <p className="text-sm text-red-700 mb-4">If you are in immediate danger, please reach out:</p>
          <ul className="space-y-3 text-sm font-medium">
            <li><span className="block text-red-600">National Suicide Prevention Lifeline</span><a href="tel:988" className="text-lg font-bold hover:underline">988</a></li>
            <li><span className="block text-red-600">Crisis Text Line</span><span className="text-lg">Text <strong>HOME</strong> to <strong>741741</strong></span></li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CommunityPage;