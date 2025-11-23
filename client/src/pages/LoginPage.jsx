import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../api/axios'; // 1. Uncomment this

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // --- AXIOS CALL FOR BACKEND ---
    // 2. Uncomment this block
    try {
      const response = await axios.post('/api/auth/login', { email, password });
      // Assuming backend returns a token or user object
      console.log('Login successful:', response.data);
      // Store token in localStorage (or context)
      localStorage.setItem('token', response.data.token);

      localStorage.setItem('userName', response.data.name);
      localStorage.setItem('userEmail', response.data.email);
      // Redirect to dashboard
      navigate('/'); 
    } catch (err) {
      console.error('Login failed:', err);
      // This will get the error message from your backend
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    }
    // --- END AXIOS CALL ---

    // 3. Remove this placeholder logic
    /*
    if (email === 'user@example.com' && password === 'password') {
      console.log('Simulating login...');
      localStorage.setItem('token', 'fake-jwt-token');
      navigate('/');
    } else {
      setError('Invalid credentials (use user@example.com / password)');
    }
    */
  };

  return (
    <div>
      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        <Link to="/login" className="flex-1 text-center py-3 font-bold text-blue-600 border-b-2 border-blue-600">
          Login
        </Link>
        <Link to="/signup" className="flex-1 text-center py-3 font-medium text-gray-500 hover:text-gray-700">
          Sign Up
        </Link>
      </div>
      
      <h2 className="text-xl font-bold text-gray-800 mb-4">Welcome</h2>
      <p className="text-sm text-gray-600 mb-6">Take the first step towards better mental health</p>

      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="your@email.com"
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="********"
          />
        </div>
        
        <div className="flex items-center justify-end">
          <div className="text-sm">
            <Link to="/forgot-password" className="font-medium text-blue-600 hover:text-blue-500">
              Forgot your password?
            </Link>
          </div>
        </div>
        
        <button
          type="submit"
          className="w-full flex justify-center cursor-pointer py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-linear-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Sign In
        </button>

      </form>

      <button className="w-full text-center py-2 px-4 mt-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
        Continue as Guest
      </button>
    </div>
  );
};

export default LoginPage;