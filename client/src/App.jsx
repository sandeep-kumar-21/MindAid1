import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import AuthLayout from './components/AuthLayout';
import { Toaster } from 'react-hot-toast';

// Pages
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import JournalPage from './pages/JournalPage';
import MoodTrackerPage from './pages/MoodTrackerPage';
import CopingToolsPage from './pages/CopingToolsPage';
import CommunityPage from './pages/CommunityPage';
import ProfilePage from './pages/ProfilePage';

// Tools
import BreathingTool from './tools/BreathingTool'; 
import GuidedMeditationTool from './tools/GuidedMeditationTool';
import GroundingExerciseTool from './tools/GroundingExerciseTool';
import ProgressiveRelaxationTool from './tools/ProgressiveRelaxationTool'; 
import PositiveAffirmationsTool from './tools/PositiveAffirmationsTool';
import MoodMusicTool from './tools/MoodMusicTool';
import ForgotPasswordPage from './pages/ForgotPasswordPage'; 
import ResetPasswordPage from './pages/ResetPasswordPage';

function App() {
  return (
    <>
    <Toaster 
      position="top-center"
      toastOptions={{ duration: 3000 }}
      containerStyle={{
        top: 70
      }}
    />
    
    <Routes>
      {/* Auth Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password/:resetToken" element={<ResetPasswordPage />} />
      </Route>

      {/* Main App Routes (Protected) */}
      <Route element={<Layout />}>
        
        {/* --- THIS IS THE FIX --- */}
        {/* The Dashboard is now the homepage at path="/" */}
        <Route path="/" element={<DashboardPage />} /> 
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/journal" element={<JournalPage />} />
        <Route path="/mood-tracker" element={<MoodTrackerPage />} />
        <Route path="/coping-tools" element={<CopingToolsPage />} />
        <Route path="/community" element={<CommunityPage />} />
        
        {/* Tool Routes */}
        <Route path="/coping-tools/breathing" element={<BreathingTool />} />
        <Route path="/coping-tools/meditation" element={<GuidedMeditationTool />} />
        <Route path="/coping-tools/grounding" element={<GroundingExerciseTool />} /> 
        <Route path="/coping-tools/relaxation" element={<ProgressiveRelaxationTool />} />
        <Route path="/coping-tools/affirmations" element={<PositiveAffirmationsTool />} />
        <Route path="/coping-tools/music" element={<MoodMusicTool />} />
      </Route>
      
      {/* Fallback route */}
      <Route path="*" element={<LoginPage />} /> 
    </Routes>
    </>
  );
}

export default App;