import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import { FaUser, FaEnvelope, FaLock, FaSave } from 'react-icons/fa';

const ProfilePage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  // --- NEW STATE ---
  const [oldPassword, setOldPassword] = useState('');
  // -----------------
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const storedName = localStorage.getItem('userName');
    const storedEmail = localStorage.getItem('userEmail');
    if (storedName) setName(storedName);
    if (storedEmail) setEmail(storedEmail);
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    // Validation Logic
    if (password || confirmPassword) {
       // 1. Check if old password is provided
       if (!oldPassword) {
          setError('Please enter your current password to verify this change.');
          return;
       }
       // 2. Check if new passwords match
       if (password !== confirmPassword) {
        setError('New passwords do not match');
        return;
      }
       // 3. Strong password check
       const strongPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
       if (!strongPassword.test(password)) {
          setError("New password must have 8+ chars, 1 uppercase, 1 number, 1 special char.");
          return;
       }
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      const updateData = { name };
      // Send both old and new passwords if changing
      if (password) {
        updateData.oldPassword = oldPassword;
        updateData.password = password;
      }

      const response = await axios.put('/api/auth/profile', updateData, config);

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userName', response.data.name);

      setMessage('Profile updated successfully!');
      // Clear password fields on success
      setOldPassword('');
      setPassword('');
      setConfirmPassword('');

    } catch (err) {
      console.error('Profile update failed', err);
      setError(err.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white rounded-lg shadow-md">
      <div className="flex items-center mb-8">
        <div className="p-4 bg-blue-100 rounded-full mr-4">
          <FaUser className="text-3xl text-blue-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800">User Profile</h1>
      </div>

      {message && <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">{message}</div>}
      {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>}

      <form onSubmit={handleUpdate} className="space-y-6">
        {/* Full Name & Email (Keep existing code for these two fields) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><FaUser className="text-gray-400" /></div>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="pl-10 block w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
          <div className="relative">
             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><FaEnvelope className="text-gray-500" /></div>
            <input type="email" value={email} disabled className="pl-10 block w-full p-3 border border-gray-300 rounded-md bg-gray-100 text-gray-500 cursor-not-allowed" />
          </div>
          <p className="text-xs text-gray-500 mt-1">Email cannot be changed.</p>
        </div>

        <div className="border-t pt-6 mt-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Change Password</h2>
          <p className="text-sm text-gray-500 mb-4">Leave blank if you don't want to change it.</p>
          
          <div className="space-y-4">
            {/* --- NEW FIELD: Current Password --- */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="text-gray-400" />
                </div>
                <input
                  type="password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  className="pl-10 block w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter current password to change"
                />
              </div>
            </div>
            {/* ----------------------------------- */}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><FaLock className="text-gray-400" /></div>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="pl-10 block w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" placeholder="••••••••" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><FaLock className="text-gray-400" /></div>
                <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="pl-10 block w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" placeholder="••••••••" />
              </div>
            </div>
          </div>
        </div>

        <button type="submit" disabled={loading} className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-white font-medium bg-linear-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 focus:outline-none disabled:opacity-50">
          <FaSave className="mr-2" />
          {loading ? 'Updating...' : 'Update Profile'}
        </button>
      </form>
    </div>
  );
};

export default ProfilePage;