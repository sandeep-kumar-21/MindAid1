import React from 'react';
import { Outlet } from 'react-router-dom';
import { FaHeart, FaLock } from 'react-icons/fa';

const AuthLayout = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-radial-fade py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div>
          <FaHeart className="mx-auto h-12 w-auto text-blue-500" />
          <h2 className="mt-4 text-center text-3xl font-extrabold text-gray-900">
            MindAid
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Your personal mental wellness companion
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white/90 backdrop-blur-sm shadow-xl rounded-lg p-8 space-y-6">
          <Outlet /> {/* This will render LoginPage or SignupPage */}
        </div>
        
        {/* Privacy Note */}
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-md">
          <div className="flex">
            <div className="shrink-0">
              <FaLock className="h-5 w-5 text-blue-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-700">
                <span className="font-bold">Your privacy is our priority.</span> All your data is encrypted and confidential. We never share your personal information.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;