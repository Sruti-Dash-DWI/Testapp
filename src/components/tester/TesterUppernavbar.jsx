import React, { useState, useRef, useEffect } from 'react';

const GridIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" rx="1"></rect>
    <rect x="14" y="3" width="7" height="7" rx="1"></rect>
    <rect x="14" y="14" width="7" height="7" rx="1"></rect>
    <rect x="3" y="14" width="7" height="7" rx="1"></rect>
  </svg>
);

const MailIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
    <polyline points="22,6 12,13 2,6"></polyline>
  </svg>
);

const LogoIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2ZM12 20C7.58172 20 4 16.4183 4 12C4 7.58172 7.58172 4 12 4C16.4183 4 20 7.58172 20 12C20 16.4183 16.4183 20 12 20ZM10.5 7L14.5 11L10.5 15V7Z" fill="#71b280"/>
    <path d="M10.5 7L14.5 11L10.5 15V7Z" fill="white" stroke="white" strokeWidth="0.5" strokeLinejoin="round"/>
  </svg>
);

const SearchIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#134e5e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
    <path d="M12.0001 2L8.00006 6L12.0001 10L16.0001 6L12.0001 2Z" stroke="#71b280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M8 6L4 10L12 18L20 10L16 6" stroke="#71b280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M4 10L12 22L20 10" stroke="#71b280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const BellIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
    <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
  </svg>
);

const HelpIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
    <line x1="12" y1="17" x2="12.01" y2="17"></line>
  </svg>
);

export default function DeveloperUppernavbar() {
  const [userInitial, setUserInitial] = useState('A');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const dropdownRef = useRef(null);

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
    alert('Logout functionality - would clear auth and navigate');
  };

  return (
    <>
      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes ripple {
          0% {
            box-shadow: 0 0 0 0 rgba(168, 192, 255, 0.4);
          }
          70% {
            box-shadow: 0 0 0 10px rgba(168, 192, 255, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(168, 192, 255, 0);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-3px);
          }
        }

        @keyframes shimmer {
          0% {
            background-position: -1000px 0;
          }
          100% {
            background-position: 1000px 0;
          }
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.8;
          }
        }

        @keyframes glow {
          0%, 100% {
            box-shadow: 0 0 20px rgba(168, 192, 255, 0.4), 0 0 40px rgba(63, 43, 150, 0.2);
          }
          50% {
            box-shadow: 0 0 30px rgba(168, 192, 255, 0.6), 0 0 60px rgba(63, 43, 150, 0.4);
          }
        }

        .animate-slide-down {
          animation: slideDown 0.3s ease-out;
        }

        .icon-button {
          position: relative;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .icon-button:hover {
          transform: translateY(-2px);
        }

        .icon-button:active {
          transform: translateY(0px);
        }

        .icon-button::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 9999px;
          background: rgba(168, 192, 255, 0.15);
          opacity: 0;
          transition: opacity 0.3s;
        }

        .icon-button:hover::before {
          opacity: 1;
        }

        .create-button {
          position: relative;
          overflow: hidden;
          transition: all 0.3s ease;
        }

        .create-button::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          border-radius: 50%;
          background: rgba(168, 192, 255, 0.3);
          transform: translate(-50%, -50%);
          transition: width 0.6s, height 0.6s;
        }

        .create-button:hover::before {
          width: 300px;
          height: 300px;
        }

        .create-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(63, 43, 150, 0.4), 0 5px 15px rgba(168, 192, 255, 0.3);
          animation: glow 2s infinite;
        }

        .plans-button {
          position: relative;
          overflow: hidden;
          transition: all 0.3s ease;
        }

        .plans-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 20px rgba(63, 43, 150, 0.35);
          background: rgba(168, 192, 255, 0.1);
        }

        .search-input {
          transition: all 0.3s ease;
        }

        .search-input:focus {
          background: white;
          box-shadow: 0 4px 20px rgba(168, 192, 255, 0.2), 0 0 0 3px rgba(63, 43, 150, 0.1);
        }

        .user-avatar {
          position: relative;
          transition: all 0.3s ease;
        }

        .user-avatar:hover {
          animation: ripple 1s;
          transform: scale(1.05);
        }

        .logo-container {
          animation: float 3s ease-in-out infinite;
        }

        .navbar-shine {
          position: relative;
          overflow: hidden;
        }

        .navbar-shine::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.1),
            transparent
          );
          animation: shimmer 3s infinite;
        }

        .dropdown-menu {
          animation: slideDown 0.2s ease-out;
        }

        .notification-dot {
          position: absolute;
          top: 8px;
          right: 8px;
          width: 8px;
          height: 8px;
          background:#FF0000;
          border-radius: 50%;
          border: 2px solid white;
          animation: ripple 2s infinite;
          box-shadow: 0 0 10px rgba(168, 192, 255, 0.6);
        }
      `}</style>

      <nav className="navbar-shine flex items-center justify-between py-2 px-6 bg-white/90 backdrop-blur-xl border border-blue-200/30 rounded-2xl shadow-2xl text-gray-700 relative">
        
        {/* Left Section */}
        <div className="flex items-center gap-4">
          <button className="icon-button p-2.5 rounded-full text-blue-700 hover:text-blue-900" aria-label="App switcher">
            <GridIcon />
          </button>
          <button className="icon-button p-2.5 rounded-full text-blue-700 hover:text-blue-900 relative" aria-label="Inbox">
            <MailIcon />
            <span className="notification-dot"></span>
          </button>
          <div className="flex items-center gap-3 ml-2">
            <span className="text-xl font-bold bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Test
            </span>
          </div>
        </div>

        {/* Center - Search */}
        <div className="relative flex items-center flex-grow max-w-xl mx-8">
          <div className="absolute left-4 pointer-events-none transition-all duration-300" style={{
            transform: searchFocused ? 'scale(1.1)' : 'scale(1)'
          }}>
            <SearchIcon />
          </div>
          <input 
            type="text" 
            placeholder="Search for projects, tasks, and more..." 
            className="search-input w-full py-2 pl-12 pr-4 border-2 border-blue-200/50 rounded-xl bg-white/60 text-base transition-all duration-300 focus:outline-none focus:border-blue-400 placeholder-blue-600/100"
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
          />
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          <button className="create-button flex items-center gap-2 py-2.5 px-5 bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-500 text-white rounded-xl text-sm font-semibold relative z-10">
            <PlusIcon /> Create
          </button>
          <button className="plans-button flex items-center gap-2 py-2.5 px-5 bg-white text-blue-600 border-2 border-blue-400 rounded-xl text-sm font-semibold">
            <PlansIcon /> See plans
          </button>
          <button className="icon-button p-2.5 rounded-full text-blue-700 hover:text-blue-900 relative" aria-label="Notifications">
            <BellIcon />
            <span className="notification-dot"></span>
          </button>
          <button className="icon-button p-2.5 rounded-full text-blue-700 hover:text-blue-900" aria-label="Help">
            <HelpIcon />
          </button>
          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="user-avatar w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-500 text-white flex items-center justify-center font-bold text-base border-3 border-white shadow-lg focus:outline-none" 
              aria-label="User account"
              aria-expanded={isDropdownOpen}
              aria-haspopup="true"
            >
              {userInitial}
            </button>
            
            {isDropdownOpen && (
              <div className="dropdown-menu absolute right-0 mt-3 w-48 rounded-xl shadow-2xl bg-white border border-blue-100 focus:outline-none z-50 overflow-hidden">
                <div role="menu" aria-orientation="vertical">
                  <div className="p-2">
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2.5 text-sm font-medium text-gray-700 transition-all duration-200 rounded-lg hover:bg-gradient-to-r hover:from-red-50 hover:to-red-100 hover:text-red-700 focus:outline-none group"
                      role="menuitem"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-3 transition-transform duration-200 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
    </>
  );
}