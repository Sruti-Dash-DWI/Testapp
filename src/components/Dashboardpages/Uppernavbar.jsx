import React, { useState, useRef, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';

// const MailIcon = () => (
//   <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//     <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
//     <polyline points="22,6 12,13 2,6"></polyline>
//   </svg>
// );
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const SunIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="5"></circle>
    <line x1="12" y1="1" x2="12" y2="3"></line>
    <line x1="12" y1="21" x2="12" y2="23"></line>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
    <line x1="1" y1="12" x2="3" y2="12"></line>
    <line x1="21" y1="12" x2="23" y2="12"></line>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
  </svg>
);

const MoonIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
  </svg>
);

const SearchIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);

const PlusIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

const PlansIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12.0001 2L8.00006 6L12.0001 10L16.0001 6L12.0001 2Z" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M8 6L4 10L12 18L20 10L16 6" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M4 10L12 22L20 10" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

const BellIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
    <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
  </svg>
);

// const HelpIcon = () => (
//     <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//         <circle cx="12" cy="12" r="10"></circle>
//         <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
//         <line x1="12" y1="17" x2="12.01" y2="17"></line>
//     </svg>
// );

export default function UpperNavbar() {
  const [userInitial, setUserInitial] = useState('A');
  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const { theme, toggleTheme, colors } = useTheme();

 useEffect(() => {
    const getUserDetails = async () => {
      const userId = localStorage.getItem('userId');
      const authToken = localStorage.getItem('authToken');

      // Safety check: Don't run fetch if ID or Token are missing
      if (!userId || !authToken) return;

      try {
        const response = await fetch(`${API_BASE_URL}/admin/users/me/`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${authToken}`
          },
        });

        // 1. Check if the API request was successful
        if (!response.ok) {
          console.error("Failed to fetch user details:", response.status);
          return; 
        }

        const user = await response.json();

        // 2. Add safety checks for first_name to prevent "undefined" errors
        const firstName = user.first_name || ''; 
        const lastName = user.last_name || '';

        // 3. Only get charAt if the string exists, otherwise use a default
        const userNameInitial = firstName.length > 0 ? firstName.charAt(0).toUpperCase() : 'U';
        const fullName = `${firstName} ${lastName}`.trim();

        setUserInitial(userNameInitial);
        setUserName(fullName || 'User'); // Fallback name
        setUserRole(user.role || 'User'); 

      } catch (error) {
        console.error("An error occurred while fetching user details:", error);
      }
    };

    getUserDetails();
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/'); 
  };

  return (
    <nav
      className="flex items-center justify-between py-3 px-6 backdrop-blur-md border-b border-gray-200/30 shadow-lg relative z-10 transition-all duration-300"
      style={{
        backgroundColor: colors.background,
        color: colors.text,
        borderColor: colors.border,
      }}
    >
      <div className="flex items-center gap-3">
         <div className="text-sm font-black italic bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            {/* Qora AI */}
            <img src="QORA_AI Logo.svg" alt="Qora AI" className="w-35 h-auto" />
          </div>
      </div>

      <div className="relative flex items-center flex-grow max-w-xl mx-6">
        <div className="absolute left-4 pointer-events-none transition-all duration-300" style={{
            transform: searchFocused ? 'scale(1.1)' : 'scale(1)'
        }}>          
        <SearchIcon />
        </div>
        <input 
          type="text" 
          placeholder="Search" 
          className="w-full py-2 pl-10 pr-3 border border-gray-300 rounded-lg bg-gray-50 text-base transition duration-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40" 
        style = {{
          backgroundColor: colors.background,
        color: colors.text,
        borderColor: colors.border,
        }}
          
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
          />
      </div>

      <div className="flex items-center gap-3">
        <button 
          onClick={()=>toggleTheme()}
          className="p-2.5 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all duration-200 hover:scale-110" 
          aria-label="Toggle theme"
        >
          {theme === "dark" ? <SunIcon /> : <MoonIcon />}
        </button>
        <button className="icon-button p-2.5 rounded-full  relative" aria-label="Notifications">
            <BellIcon />
            <span className="notification-dot"></span>
          </button>
        <button className="create-button flex items-center gap-2 py-2.5 px-5 bg-blue-600 text-white rounded-xl text-sm font-semibold relative z-10">
            <PlusIcon /> Create
          </button>
          <button className="plans-button flex items-center gap-2 py-2.5 px-5 bg-blue-600 text-white rounded-xl text-sm font-semibold relative z-10">
            <PlansIcon /> See plans
          </button>
        
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-3 hover:bg-gray-400 rounded-lg p-2 transition-colors duration-200" 
            aria-label="User account"
            aria-expanded={isDropdownOpen}
            aria-haspopup="true"
          >
            <div className="text-right">
              <div className="text-sm font-semibold  leading-tight">{userName}</div>
              <div className="text-xs ">{userRole}</div>
            </div>
            <div className="w-10 h-10 rounded-full bg-red-500 text-white flex items-center justify-center font-bold text-base border-2 border-white ring-1 ring-red-500">
              {userInitial}
            </div>
          </button>
          
          {isDropdownOpen && (
            <div className="absolute right-0 bg-gray-100 mt-2 w-34 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50 transform translate-y-1 overflow-hidden">
              <div role="menu" aria-orientation="vertical" aria-labelledby="user-menu">
                <div className="px-1 py-1">
                  <button
                    onClick={handleLogout}
                    className="flex items-center justify-center w-full px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors duration-150 rounded hover:bg-red-50 hover:text-red-700 focus:outline-none focus:ring-1 focus:ring-red-500"
                    role="menuitem"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Logout
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}