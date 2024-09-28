import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import profileImage from '../assets/profile.jpg';
// Replace with your profile image path
const Settings = () => {
  const [language, setLanguage] = useState(localStorage.getItem('language') || 'english');
  const [profile, setProfile] = useState(localStorage.getItem('profile') || 'guest');
  const navigate = useNavigate();

  const handleLanguageChange = (e) => {
    const selectedLanguage = e.target.value;
    localStorage.setItem('language', selectedLanguage);
    setLanguage(selectedLanguage);
    navigate('/'); // Navigate to the home page
    window.location.reload(); // Refresh the page
  };

  const handleProfileChange = (e) => {
    const selectedProfile = e.target.value;
    localStorage.setItem('profile', selectedProfile);
    setProfile(selectedProfile);
    navigate('/'); // Navigate to the home page
    window.location.reload(); // Refresh the page
  };

  const handleClearCache = () => {
    localStorage.clear();
    alert('Cache cleared. Please refresh the page.');
    window.location.reload();
  };



  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl mb-4">Settings</h1>
      <div className="flex flex-col space-y-4 w-64">
      <div className="flex flex-col items-center">
          <img src={profileImage} alt="Profile" className="w-24 h-24 rounded-full mb-2" />
          <p className="text-sm text-gray-600">guest-1323</p>
        </div>
        <div>
          <label htmlFor="language" className="block text-sm font-medium text-gray-700">Language</label>
          <select id="language" value={language} onChange={handleLanguageChange} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
            <option value="english">English</option>
            <option value="telugu">Telugu</option>
          </select>
        </div>

        <div>
          <button onClick={handleClearCache} className="bg-red-500 text-white px-4 py-2 rounded">
            Clear Cache
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
