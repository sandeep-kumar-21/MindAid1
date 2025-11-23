import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import { FaLock, FaEnvelope } from 'react-icons/fa';

const SignupPage = () => {
  // Form State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  
  // UI State
  const [step, setStep] = useState(1); // Step 1: Register, Step 2: OTP
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  // --- STEP 1: REGISTER & SEND OTP ---
  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    // Basic frontend password strength check (optional, but good UX)
    const strongPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!strongPassword.test(password)) {
       setError("Password must have 8+ chars, 1 uppercase, 1 lowercase, 1 number, 1 special char (@$!%*?&)");
       setLoading(false);
       return;
    }

    try {
      const response = await axios.post('/api/auth/register', { 
        name: fullName, 
        email, 
        password 
      });
      
      // Success! Move to next step
      setMessage(response.data.message);
      setStep(2); 
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // --- STEP 2: VERIFY OTP ---
  const handleVerify = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post('/api/auth/verify', { 
        email, 
        otp 
      });
      
      console.log('Verification successful:', response.data);
      // Save token and user data, just like standard login
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userName', response.data.name);
      localStorage.setItem('userEmail', response.data.email);
      
      navigate('/'); 
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Tabs (only show on Step 1) */}
      {step === 1 && (
        <div className="flex border-b border-gray-200 mb-6">
          <Link to="/login" className="flex-1 text-center py-3 font-medium text-gray-500 hover:text-gray-700">
            Login
          </Link>
          <Link to="/signup" className="flex-1 text-center py-3 font-bold text-blue-600 border-b-2 border-blue-600">
            Sign Up
          </Link>
        </div>
      )}

      <h2 className="text-xl font-bold text-gray-800 mb-4">
        {step === 1 ? 'Create Account' : 'Verify Email'}
      </h2>
      <p className="text-sm text-gray-600 mb-6">
        {step === 1 ? 'Take the first step towards better mental health' : `Please enter the 6-digit code sent to ${email}`}
      </p>

      {error && <p className="text-red-500 text-sm mb-4 p-3 bg-red-50 rounded">{error}</p>}
      {message && <p className="text-green-600 text-sm mb-4 p-3 bg-green-50 rounded">{message}</p>}

      {/* --- STEP 1 FORM --- */}
      {step === 1 && (
        <form onSubmit={handleRegister} className="space-y-4">
           <div>
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Your full name" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="your@email.com" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Strong password (e.g., P@ssw0rd123)" />
              <p className="text-xs text-gray-500 mt-1">Must have 8+ characters, 1 uppercase, 1 number, 1 special char.</p>
          </div>
          
          <button type="submit" disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-linear-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 focus:outline-none disabled:opacity-50"
          >
            {loading ? 'Sending OTP...' : 'Continue'}
          </button>
        </form>
      )}

      {/* --- STEP 2 FORM (OTP) --- */}
      {step === 2 && (
        <form onSubmit={handleVerify} className="space-y-6">
          <div className="flex justify-center mb-4">
             <div className="p-4 bg-blue-100 rounded-full">
               <FaEnvelope className="text-3xl text-blue-500" />
             </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 text-center mb-2">Enter Verification Code</label>
            <input type="text" value={otp} onChange={(e) => setOtp(e.target.value)} required maxLength={6}
              className="block w-1/2 mx-auto px-4 py-3 text-center text-2xl tracking-widest border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="000000" />
          </div>
          
          <button type="submit" disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none disabled:opacity-50"
          >
            {loading ? 'Verifying...' : 'Verify & Login'}
          </button>
           <button type="button" onClick={() => setStep(1)} className="w-full text-center text-sm text-gray-500 hover:text-gray-700">
            Wrong email? Go back
          </button>
        </form>
      )}

      {step === 1 && (
         <button className="w-full text-center py-2 px-4 mt-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
           Continue as Guest
         </button>
      )}
    </div>
  );
};

export default SignupPage;