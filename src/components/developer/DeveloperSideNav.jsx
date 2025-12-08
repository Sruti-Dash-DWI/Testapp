// src/components/developerDashboardpages/sidenav_pages/DevDocuments.jsx (or wherever your file is located)

import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext'; // Adjust path if needed

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// --- ICONS ---
const ProjectsIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>);
const UserDetailsIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>);
const DocsIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>);
const BellIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>);
const SettingsIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>);

// ADDED ICONS FOR TEAMS
const TeamsIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>);
const ForYouIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>);
const TeamGroupIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>);
const PeopleIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>);


const DeveloperSideNav = ({ isOpen, openInviteModal }) => {
    const [projects, setProjects] = useState([]);
    const [isProjectsOpen, setIsProjectsOpen] = useState(false);
    
    // CHANGED: Use isTeamsOpen for the Teams dropdown
    const [isTeamsOpen, setIsTeamsOpen] = useState(false);
    
    const [error, setError] = useState(null);
    const { theme, colors } = useTheme();

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const authToken = localStorage.getItem('authToken');
                if (!authToken) return;

                const response = await fetch(`${API_BASE_URL}/projects/`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${authToken}`,
                    },
                });

                if (!response.ok) throw new Error('Could not fetch projects');
                
                const data = await response.json();
                const allProjects = Object.values(data).flat();
                setProjects(allProjects);
            } catch (error) {
                console.error("Error fetching projects for sidenav:", error);
                setError(error.message);
            }
        };

        fetchProjects();
    }, []);

    const handleProjectClick = (project) => {
        localStorage.setItem('activeProjectName', project.name);
        localStorage.setItem('activeProjectId', project.id);
    };
    

    const staticNavItems = [
        { icon: <DocsIcon />, name: 'Documents', path: 'documents' },
        { icon: <BellIcon />, name: 'Notifications', path: 'notifications' },
        { icon: <SettingsIcon />, name: 'Settings', path: 'settings' },
    ];

    return (
        <div 
            className={`transition-all duration-300 border-r h-full flex flex-col p-5 overflow-y-hidden scrollbar-thin ${isOpen ? 'w-70' : 'w-20 items-center'}`}
            style={{
                backgroundColor: colors.background,
                color: colors.text,
                borderColor: colors.border,
            }}
        >
            <ul className="flex flex-col gap-4 flex-grow">
                
                {/* PROJECTS SECTION */}
                <li>
                    <button 
                        onClick={() => setIsProjectsOpen(!isProjectsOpen)}
                        className={`flex items-center w-full gap-4 px-3 py-3 rounded-lg cursor-pointer transition-all duration-200 hover:scale-105 ${!isOpen && 'justify-center'}`}
                        style={{
                            backgroundColor: theme === 'dark' ? 'transparent' : 'transparent',
                            color: colors.text,
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = theme === 'dark' ? '#1e293b' : '#f3f4f6';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                    >
                        <ProjectsIcon />
                        {isOpen && <span className="flex-grow text-left">Projects</span>}
                        {isOpen && (
                            <svg className={`w-4 h-4 transition-transform ${isProjectsOpen ? 'rotate-180' : ''}`} fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                        )}
                    </button>
                    {isOpen && isProjectsOpen && (
                        <ul 
                            className="mt-2 space-y-1 pl-8 ml-5 max-h-48 overflow-x-hidden overflow-y-hidden"
                            style={{
                                borderLeft: `1px solid ${colors.border}`,
                            }}
                        >
                            <li>
                                <NavLink 
                                    to="/developer/projects"
                                    className={({ isActive }) => `block px-3 py-2 text-sm rounded-md transition-all duration-200 hover:scale-105 ${isActive ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/30' : ''}`}
                                    style={({ isActive }) => ({
                                        backgroundColor: isActive ? undefined : 'transparent',
                                        color: isActive ? undefined : theme === 'dark' ? '#94a3b8' : '#4b5563',
                                    })}
                                    onMouseEnter={(e) => {
                                        if (!e.currentTarget.classList.contains('bg-gradient-to-r')) {
                                            e.currentTarget.style.backgroundColor = theme === 'dark' ? '#1e293b' : '#f3f4f6';
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (!e.currentTarget.classList.contains('bg-gradient-to-r')) {
                                            e.currentTarget.style.backgroundColor = 'transparent';
                                        }
                                    }}
                                >
                                    View All Projects
                                </NavLink>
                            </li>
                            {projects.map((project) => (
                                <li key={project.id}>
                                    <NavLink
                                        to={`/developer/backlog/${project.id}`}
                                        title={project.name}
                                        onClick={() => handleProjectClick(project)}
                                        className={({ isActive }) => `block px-3 py-2 text-sm rounded-md transition-all duration-200 hover:scale-105 ${isActive ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/30' : ''}`}
                                        style={({ isActive }) => ({
                                            backgroundColor: isActive ? undefined : 'transparent',
                                            color: isActive ? undefined : theme === 'dark' ? '#94a3b8' : '#4b5563',
                                        })}
                                        onMouseEnter={(e) => {
                                            if (!e.currentTarget.classList.contains('bg-gradient-to-r')) {
                                                e.currentTarget.style.backgroundColor = theme === 'dark' ? '#1e293b' : '#f3f4f6';
                                            }
                                        }}
                                        onMouseLeave={(e) => {
                                            if (!e.currentTarget.classList.contains('bg-gradient-to-r')) {
                                                e.currentTarget.style.backgroundColor = 'transparent';
                                            }
                                        }}
                                    >
                                        {project.name}
                                    </NavLink>
                                </li>
                            ))}
                        </ul>
                    )}
                </li>

                {/* TEAMS SECTION */}
                <li>
                    <button 
                        onClick={() => setIsTeamsOpen(!isTeamsOpen)}
                        className={`flex items-center w-full gap-4 px-3 py-3 rounded-lg cursor-pointer transition-all duration-200 hover:scale-105 ${!isOpen && 'justify-center'}`}
                        style={{
                            backgroundColor: 'transparent',
                            color: colors.text,
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = theme === 'dark' ? '#1e293b' : '#f3f4f6';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                    >
                        <TeamsIcon />
                        {isOpen && <span className="flex-grow text-left">Teams</span>}
                        {isOpen && (
                            <svg className={`w-4 h-4 transition-transform ${isTeamsOpen ? 'rotate-180' : ''}`} fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                        )}
                    </button>
                    {isOpen && isTeamsOpen && (
                        <ul 
                            className="mt-2 space-y-1 pl-8 ml-5"
                            style={{
                                borderLeft: `1px solid ${colors.border}`,
                            }}
                        >
                            {/* User Details (For You) */}
                            <li>
                                <NavLink 
                                    to="/developer/dev-user-details" 
                                    className={({ isActive }) => `flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-all duration-200 hover:scale-105 ${isActive ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/30' : ''}`}
                                    style={({ isActive }) => ({
                                        backgroundColor: isActive ? undefined : 'transparent',
                                        color: isActive ? undefined : theme === 'dark' ? '#94a3b8' : '#4b5563',
                                    })}
                                    onMouseEnter={(e) => {
                                        if (!e.currentTarget.classList.contains('bg-gradient-to-r')) {
                                            e.currentTarget.style.backgroundColor = theme === 'dark' ? '#1e293b' : '#f3f4f6';
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (!e.currentTarget.classList.contains('bg-gradient-to-r')) {
                                            e.currentTarget.style.backgroundColor = 'transparent';
                                        }
                                    }}
                                >
                                    <ForYouIcon />
                                    <span>User Details</span>
                                </NavLink>
                            </li>
                            
                            {/* Teams */}
                            <li>
                                <NavLink 
                                    to="/developer/teams/teams"
                                    className={({ isActive }) => `flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-all duration-200 hover:scale-105 ${isActive ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/30' : ''}`}
                                    style={({ isActive }) => ({
                                        backgroundColor: isActive ? undefined : 'transparent',
                                        color: isActive ? undefined : theme === 'dark' ? '#94a3b8' : '#4b5563',
                                    })}
                                    onMouseEnter={(e) => {
                                        if (!e.currentTarget.classList.contains('bg-gradient-to-r')) {
                                            e.currentTarget.style.backgroundColor = theme === 'dark' ? '#1e293b' : '#f3f4f6';
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (!e.currentTarget.classList.contains('bg-gradient-to-r')) {
                                            e.currentTarget.style.backgroundColor = 'transparent';
                                        }
                                    }}
                                >
                                    <TeamGroupIcon />
                                    <span>Teams</span>
                                </NavLink>
                            </li>

                            {/* People */}
                            <li>
                                <NavLink 
                                    to="/developer/teams/people"
                                    className={({ isActive }) => `flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-all duration-200 hover:scale-105 ${isActive ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/30' : ''}`}
                                    style={({ isActive }) => ({
                                        backgroundColor: isActive ? undefined : 'transparent',
                                        color: isActive ? undefined : theme === 'dark' ? '#94a3b8' : '#4b5563',
                                    })}
                                    onMouseEnter={(e) => {
                                        if (!e.currentTarget.classList.contains('bg-gradient-to-r')) {
                                            e.currentTarget.style.backgroundColor = theme === 'dark' ? '#1e293b' : '#f3f4f6';
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (!e.currentTarget.classList.contains('bg-gradient-to-r')) {
                                            e.currentTarget.style.backgroundColor = 'transparent';
                                        }
                                    }}
                                >
                                    <PeopleIcon />
                                    <span>People</span>
                                </NavLink>
                            </li>
                        </ul>
                    )}
                </li>
                
                {/* STATIC NAV ITEMS */}
                {staticNavItems.map((item) => (
                    <li key={item.name}>
                        <NavLink 
                            to={`/developer/${item.path}`} 
                            title={item.name} 
                            className={({ isActive }) => `flex items-center gap-4 px-3 py-3 rounded-lg cursor-pointer transition-all duration-200 hover:scale-105 ${isActive ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/30' : ''} ${!isOpen && 'justify-center'}`}
                            style={({ isActive }) => ({
                                backgroundColor: isActive ? undefined : 'transparent',
                                color: isActive ? undefined : colors.text,
                            })}
                            onMouseEnter={(e) => {
                                if (!e.currentTarget.classList.contains('bg-gradient-to-r')) {
                                    e.currentTarget.style.backgroundColor = theme === 'dark' ? '#1e293b' : '#f3f4f6';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (!e.currentTarget.classList.contains('bg-gradient-to-r')) {
                                    e.currentTarget.style.backgroundColor = 'transparent';
                                }
                            }}
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