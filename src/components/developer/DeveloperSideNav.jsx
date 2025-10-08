import React, { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';

// --- ICONS (Defined here to resolve import error) ---
const ProjectsIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>);
const CartIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>);
const StatsIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20V10M18 20V4M6 20V16" /></svg>);
const DocsIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>);
const BellIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>);
const WalletIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 12V8a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-4"></path><path d="M20 12l-2-2-2 2"></path><path d="M18 10V2"></path></svg>);
const SettingsIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>);

const DeveloperSideNav = ({ isOpen }) => {
    const [projects, setProjects] = useState([]);
    const [isProjectsOpen, setIsProjectsOpen] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const authToken = localStorage.getItem('authToken');
                if (!authToken) {
                    // Don't fetch if not logged in
                    return;
                }

                const response = await fetch('http://localhost:8000/api/projects/', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${authToken}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Could not fetch projects');
                }
                const data = await response.json();
                // The API returns grouped data, so we flatten it into a single array
                const allProjects = Object.values(data).flat();
                setProjects(allProjects);
            } catch (error) {
                console.error("Error fetching projects for sidenav:", error);
                setError(error.message);
            }
        };

        fetchProjects();
    }, []);

    const staticNavItems = [
        { icon: <CartIcon />, name: 'Cart', path: 'cart' },
        { icon: <StatsIcon />, name: 'Statistics', path: 'statistics' },
        { icon: <DocsIcon />, name: 'Documents', path: 'documents' },
        { icon: <BellIcon />, name: 'Notifications', path: 'notifications' },
        { icon: <WalletIcon />, name: 'Wallet', path: 'wallet' },
        { icon: <SettingsIcon />, name: 'Settings', path: 'settings' },
    ];

    return (
        <div className={`transition-all duration-300 bg-black/20 backdrop-blur-md rounded-3xl shadow-lg border border-white/20 h-full flex flex-col p-5 text-white ${isOpen ? 'w-70' : 'w-20 items-center'}`}>
            <ul className="flex flex-col gap-2 flex-grow">
                {/* Projects Dropdown Section */}
                <li>
                    <button 
                        onClick={() => setIsProjectsOpen(!isProjectsOpen)}
                        className={`flex items-center w-full gap-4 px-3 py-3 rounded-lg cursor-pointer transition-colors duration-200 hover:bg-white/10 ${!isOpen && 'justify-center'}`}
                    >
                        <ProjectsIcon />
                        {isOpen && <span className="flex-grow text-left">Projects</span>}
                        {isOpen && (
                             <svg className={`w-4 h-4 transition-transform ${isProjectsOpen ? 'rotate-180' : ''}`} fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                        )}
                    </button>
                    {/* Projects Sub-menu */}
                    {isOpen && isProjectsOpen && (
                        <ul className="mt-2 space-y-1 pl-8 border-l border-white/20 ml-5">
                             <li>
                                <NavLink 
                                    to="/developer/projects"
                                    className={({ isActive }) => `block px-3 py-2 text-sm rounded-md transition-colors hover:bg-white/10 ${isActive ? 'bg-white/20 font-semibold' : 'text-white/80'}`}
                                >
                                    View My Projects
                                </NavLink>
                            </li>
                            {projects.map((project) => (
                                <li key={project.id}>
                                    <NavLink
                                        to={`/backlog/${project.id}`}
                                        title={project.name}
                                        className={({ isActive }) => `block px-3 py-2 text-sm rounded-md transition-colors hover:bg-white/10 ${isActive ? 'bg-white/20 font-semibold' : 'text-white/80'}`}
                                    >
                                        {project.name}
                                    </NavLink>
                                </li>
                            ))}
                        </ul>
                    )}
                </li>

                {/* Other Static Nav Items */}
                {staticNavItems.map((item) => (
                    <li key={item.name}>
                        <NavLink 
                            to={`/${item.path}`} 
                            title={item.name} 
                            className={({ isActive }) => `flex items-center gap-4 px-3 py-3 rounded-lg cursor-pointer transition-colors duration-200 hover:bg-white/10 ${isActive ? 'bg-white/20 font-semibold' : ''} ${!isOpen && 'justify-center'}`}
                        >
                            {item.icon}
                            {isOpen && <span>{item.name}</span>}
                        </NavLink>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default DeveloperSideNav;

