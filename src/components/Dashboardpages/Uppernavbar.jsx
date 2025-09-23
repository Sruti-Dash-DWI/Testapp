import React, { useState } from 'react';



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
        <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2ZM12 20C7.58172 20 4 16.4183 4 12C4 7.58172 7.58172 4 12 4C16.4183 4 20 7.58172 20 12C20 16.4183 16.4183 20 12 20ZM10.5 7L14.5 11L10.5 15V7Z" fill="#2684FF"/>
        <path d="M10.5 7L14.5 11L10.5 15V7Z" fill="white" stroke="white" strokeWidth="0.5" strokeLinejoin="round"/>
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
        <path d="M12.0001 2L8.00006 6L12.0001 10L16.0001 6L12.0001 2Z" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M8 6L4 10L12 18L20 10L16 6" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M4 10L12 22L20 10" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
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



export default function UpperNavbar() {
  const [userInitial, setUserInitial] = useState('A');

  return (
    <nav className="flex items-center justify-between py-3 px-6 bg-white/70 backdrop-blur-md border-b border-gray-200/30 rounded-xl shadow-lg text-gray-700">
    
      <div className="flex items-center gap-3">
        <button className="p-2 rounded-full text-gray-600 hover:bg-black/5 transition-colors duration-200" aria-label="App switcher">
          <GridIcon />
        </button>
        <button className="p-2 rounded-full text-gray-600 hover:bg-black/5 transition-colors duration-200" aria-label="Inbox">
          <MailIcon />
        </button>
        <div className="flex items-center gap-2">
         
          <span className="text-xl font-semibold text-gray-800">Test</span>
        </div>
      </div>

      
      <div className="relative flex items-center flex-grow max-w-xl mx-6">
        <div className="absolute left-3 pointer-events-none">
          <SearchIcon />
        </div>
        <input 
          type="text" 
          placeholder="Search" 
          className="w-full py-2 pl-10 pr-3 border border-gray-300 rounded-lg bg-gray-50 text-base transition duration-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40" 
        />
      </div>

    
      <div className="flex items-center gap-3">
        <button className="flex items-center gap-2 py-2 px-4 bg-blue-600 text-white rounded-md text-sm font-medium transition duration-200 hover:bg-blue-700 hover:shadow-md">
          <PlusIcon /> Create
        </button>
        <button className="flex items-center gap-2 py-2 px-4 bg-white text-violet-500 border border-violet-500 rounded-md text-sm font-medium transition duration-200 hover:bg-violet-50">
          <PlansIcon /> See plans
        </button>
        <button className="p-2 rounded-full text-gray-600 hover:bg-black/5 transition-colors duration-200" aria-label="Notifications">
          <BellIcon />
        </button>
        <button className="p-2 rounded-full text-gray-600 hover:bg-black/5 transition-colors duration-200" aria-label="Help">
          <HelpIcon />
        </button>
        <div className="relative cursor-pointer">
           <div className="w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center font-bold text-base border-2 border-white ring-1 ring-red-500" aria-label="User account">
              {userInitial}
           </div>
           <span className="absolute top-0 -right-0.5 block w-2.5 h-2.5 bg-red-600 rounded-full border border-white"></span>
        </div>
      </div>
    </nav>
  );
}

