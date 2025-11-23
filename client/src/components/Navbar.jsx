import React, { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FaUserCircle, FaBrain, FaSignOutAlt, FaUser } from 'react-icons/fa';
import { 
  FaBookOpen, 
  FaChartBar, 
  FaSpa, 
  FaUsers,
  FaThLarge
} from 'react-icons/fa';

const NavItem = ({ to, icon, label }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
        isActive
          ? 'bg-blue-100 text-blue-700'
          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
      }`
    }
  >
    {icon}
    <span className="ml-2">{label}</span>
  </NavLink>
);

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    // 1. Clear token from local storage
    localStorage.removeItem('token');
    // 2. Redirect to login page
    navigate('/login');
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="bg-white/80 backdrop-blur-sm shadow-sm fixed top-0 left-0 right-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Left: Logo and Main Nav */}
          <div className="flex items-center">
            <div className="shrink-0 flex items-center">
              <FaBrain className="text-3xl text-blue-500" />
              <span className="font-bold text-2xl text-gray-800 ml-2">MindAid</span>
            </div>
            <div className="hidden sm:ml-10 sm:flex sm:space-x-4">
              <NavItem to="/" icon={<FaThLarge />} label="Dashboard" />
              <NavItem to="/journal" icon={<FaBookOpen />} label="Journal" />
              <NavItem to="/mood-tracker" icon={<FaChartBar />} label="Mood Tracker" />
              <NavItem to="/coping-tools" icon={<FaSpa />} label="Coping Tools" />
              <NavItem to="/community" icon={<FaUsers />} label="Community" />
            </div>
          </div>
          
          {/* Right: User Icons */}
          <div className="flex items-center relative" ref={dropdownRef}>
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="ml-3 p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-700 focus:outline-none"
            >
              <FaUserCircle className="h-6 w-6" />
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 top-16 w-48 bg-white rounded-md shadow-lg py-1 z-20 border border-gray-200">
                {/* --- ADD PROFILE LINK HERE --- */}
                <NavLink 
                  to="/profile"
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setIsDropdownOpen(false)} // Close dropdown on click
                >
                   <FaUser className="mr-2 text-gray-400" />
                   Profile
                </NavLink>
                {/* ----------------------------- */}
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <FaSignOutAlt className="mr-2 text-gray-400" />
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;