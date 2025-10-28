// import React, { useState, useEffect } from 'react';
// import { NavLink } from 'react-router-dom';

// // --- ICONS ---
// const ProjectsIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>);
// const CartIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>);
// const StatsIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20V10M18 20V4M6 20V16" /></svg>);
// const DocsIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>);
// const BellIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>);
// const WalletIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 12V8a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-4"></path><path d="M20 12l-2-2-2 2"></path><path d="M18 10V2"></path></svg>);
// const SettingsIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>);

// const TesterSideNav = ({ isOpen }) => {
//     const [projects, setProjects] = useState([]);
//     const [isProjectsOpen, setIsProjectsOpen] = useState(false);
//     const [error, setError] = useState(null);

//     useEffect(() => {
//         const fetchProjects = async () => {
//             try {
//                 const authToken = localStorage.getItem('authToken');
//                 if (!authToken) {
//                     return;
//                 }

//                 const response = await fetch('http://localhost:8000/api/projects/', {
//                     headers: {
//                         'Content-Type': 'application/json',
//                         'Authorization': `Bearer ${authToken}`,
//                     },
//                 });

//                 if (!response.ok) {
//                     throw new Error('Could not fetch projects');
//                 }
//                 const data = await response.json();
//                 const allProjects = Object.values(data).flat();
//                 setProjects(allProjects);
//             } catch (error) {
//                 console.error("Error fetching projects for sidenav:", error);
//                 setError(error.message);
//             }
//         };

//         fetchProjects();
//     }, []);

//     const staticNavItems = [
//         { icon: <CartIcon />, name: 'Cart', path: 'cart' },
//         { icon: <StatsIcon />, name: 'Statistics', path: 'statistics' },
//         { icon: <DocsIcon />, name: 'Documents', path: 'documents' },
//         { icon: <BellIcon />, name: 'Notifications', path: 'notifications' },
//         { icon: <WalletIcon />, name: 'Wallet', path: 'wallet' },
//         { icon: <SettingsIcon />, name: 'Settings', path: 'settings' },
//     ];

//     return (
//         <>
//             <style>{`
//                 @keyframes slideInLeft {
//                     from {
//                         opacity: 0;
//                         transform: translateX(-10px);
//                     }
//                     to {
//                         opacity: 1;
//                         transform: translateX(0);
//                     }
//                 }

//                 @keyframes fadeIn {
//                     from {
//                         opacity: 0;
//                         max-height: 0;
//                     }
//                     to {
//                         opacity: 1;
//                         max-height: 500px;
//                     }
//                 }

//                 @keyframes glow {
//                     0%, 100% {
//                         box-shadow: 0 0 5px rgba(168, 192, 255, 0.3);
//                     }
//                     50% {
//                         box-shadow: 0 0 20px rgba(168, 192, 255, 0.5), 0 0 30px rgba(63, 43, 150, 0.3);
//                     }
//                 }

//                 @keyframes iconPulse {
//                     0%, 100% {
//                         transform: scale(1);
//                     }
//                     50% {
//                         transform: scale(1.1);
//                     }
//                 }

//                 @keyframes shimmerBorder {
//                     0% {
//                         border-color: rgba(240, 147, 251, 0.3);
//                     }
//                     50% {
//                         border-color: rgba(118, 75, 162, 0.6);
//                     }
//                     100% {
//                         border-color: rgba(240, 147, 251, 0.3);
//                     }
//                 }

//                 .nav-item {
//                     position: relative;
//                     transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
//                 }

//                 .nav-item::before {
//                     content: '';
//                     position: absolute;
//                     left: 0;
//                     top: 50%;
//                     transform: translateY(-50%);
//                     width: 0;
//                     height: 70%;
//                     background: linear-gradient(to right, #a8c0ff, rgba(168, 192, 255, 0.3));
//                     border-radius: 0 4px 4px 0;
//                     transition: width 0.3s ease;
//                     opacity: 0;
//                 }

//                 .nav-item:hover::before {
//                     width: 4px;
//                     opacity: 1;
//                 }

//                 .nav-item:hover {
//                     transform: translateX(4px);
//                     background: linear-gradient(to right, rgba(168, 192, 255, 0.15), transparent);
//                 }

//                 .nav-item.active {
//                     background: linear-gradient(to right, rgba(168, 192, 255, 0.25), rgba(168, 192, 255, 0.1));
//                     border-left: 3px solid #a8c0ff;
//                     animation: glow 2s infinite;
//                 }

//                 .nav-item.active::before {
//                     width: 4px;
//                     opacity: 1;
//                 }

//                 .nav-icon {
//                     transition: all 0.3s ease;
//                 }

//                 .nav-item:hover .nav-icon {
//                     animation: iconPulse 0.6s ease;
//                     color: #a8c0ff;
//                     filter: drop-shadow(0 0 6px rgba(168, 192, 255, 0.6));
//                 }

//                 .nav-item.active .nav-icon {
//                     color: #a8c0ff;
//                     filter: drop-shadow(0 0 8px rgba(168, 192, 255, 0.6));
//                 }

//                 .project-item {
//                     position: relative;
//                     transition: all 0.2s ease;
//                     animation: slideInLeft 0.3s ease-out;
//                 }

//                 .project-item::before {
//                     content: '';
//                     position: absolute;
//                     left: -8px;
//                     top: 50%;
//                     transform: translateY(-50%);
//                     width: 4px;
//                     height: 0;
//                     background: linear-gradient(to bottom, #a8c0ff, #3f2b96);
//                     border-radius: 2px;
//                     transition: height 0.2s ease;
//                 }

//                 .project-item:hover::before {
//                     height: 100%;
//                 }

//                 .project-item:hover {
//                     transform: translateX(4px);
//                     background: rgba(168, 192, 255, 0.15);
//                 }

//                 .project-item.active {
//                     background: rgba(168, 192, 255, 0.25);
//                     font-weight: 600;
//                     color: #a8c0ff;
//                 }

//                 .dropdown-arrow {
//                     transition: transform 0.3s ease;
//                 }

//                 .projects-dropdown {
//                     animation: fadeIn 0.3s ease-out;
//                     overflow: hidden;
//                 }

//                 .sidenav-container {
//                     background: linear-gradient(135deg, rgba(168, 192, 255, 0.15) 0%, rgba(63, 43, 150, 0.25) 50%, rgba(168, 192, 255, 0.15) 100%);
//                     backdrop-filter: blur(20px);
//                     box-shadow: 
//                         0 8px 32px rgba(63, 43, 150, 0.2),
//                         inset 0 1px 0 rgba(255, 255, 255, 0.1);
//                     border: 1px solid rgba(168, 192, 255, 0.2);
//                     animation: shimmerBorder 3s infinite;
//                 }

//                 .section-divider {
//                     height: 1px;
//                     background: linear-gradient(to right, transparent, rgba(168, 192, 255, 0.4), transparent);
//                     margin: 12px 0;
//                 }

//                 .project-list {
//                     scrollbar-width: none; /* Firefox */
//                     -ms-overflow-style: none; /* IE and Edge */
//                 }

//                 .project-list::-webkit-scrollbar {
//                     display: none; /* Chrome, Safari, Opera */
//                 }

//                 .projects-button {
//                     position: relative;
//                 }

//                 .projects-button::after {
//                     content: '';
//                     position: absolute;
//                     bottom: 0;
//                     left: 10%;
//                     right: 10%;
//                     height: 2px;
//                     background: linear-gradient(to right, transparent, #a8c0ff, transparent);
//                     opacity: 0;
//                     transition: opacity 0.3s ease;
//                 }

//                 .projects-button:hover::after {
//                     opacity: 1;
//                 }
//             `}</style>

//             <div className={`sidenav-container transition-all duration-300 rounded-3xl shadow-2xl h-full flex flex-col p-5 text-white ${isOpen ? 'w-70' : 'w-20 items-center'}`}>
//                 <ul className="flex flex-col gap-2 flex-grow overflow-hidden">
//                     {/* Projects Dropdown Section */}
//                     <li>
//                         <button 
//                             onClick={() => setIsProjectsOpen(!isProjectsOpen)}
//                             className={`projects-button nav-item flex items-center w-full gap-4 px-4 py-3.5 rounded-xl cursor-pointer ${!isOpen && 'justify-center'}`}
//                         >
//                             <div className="nav-icon">
//                                 <ProjectsIcon />
//                             </div>
//                             {isOpen && <span className="flex-grow text-left font-medium">Projects</span>}
//                             {isOpen && (
//                                 <svg className={`dropdown-arrow w-4 h-4 transition-transform ${isProjectsOpen ? 'rotate-180' : ''}`} fill="currentColor" viewBox="0 0 20 20">
//                                     <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"></path>
//                                 </svg>
//                             )}
//                         </button>
                        
//                         {/* Projects Sub-menu */}
//                         {isOpen && isProjectsOpen && (
//                             <div className="projects-dropdown">
//                                 <ul className="project-list mt-2 space-y-1 pl-8 ml-5 max-h-64 overflow-y-auto">
//                                     <li>
//                                         <NavLink 
//                                             to="/tester/projects"
//                                             className={({ isActive }) => `project-item block px-4 py-2.5 text-sm rounded-lg transition-all ${isActive ? 'active' : 'text-white/90 hover:text-white'}`}
//                                         >
//                                             View My Projects
//                                         </NavLink>
//                                     </li>
//                                     {projects.map((project, index) => (
//                                         <li key={project.id} style={{ animationDelay: `${index * 0.05}s` }}>
//                                             <NavLink
//                                                 to={`/tester/backlog/${project.id}`}
//                                                 title={project.name}
//                                                 className={({ isActive }) => `project-item block px-4 py-2.5 text-sm rounded-lg transition-all ${isActive ? 'active' : 'text-white/90 hover:text-white'}`}
//                                             >
//                                                 {project.name}
//                                             </NavLink>
//                                         </li>
//                                     ))}
//                                 </ul>
//                             </div>
//                         )}
//                     </li>

//                     <div className="section-divider"></div>

//                     {/* Other Static Nav Items */}
//                     {staticNavItems.map((item, index) => (
//                         <li key={item.name} style={{ animationDelay: `${index * 0.05}s` }}>
//                             <NavLink 
//                                 to={`/tester/${item.path}`} 
//                                 title={item.name} 
//                                 className={({ isActive }) => `nav-item flex items-center gap-4 px-4 py-3.5 rounded-xl cursor-pointer ${isActive ? 'active' : ''} ${!isOpen && 'justify-center'}`}
//                             >
//                                 <div className="nav-icon">
//                                     {item.icon}
//                                 </div>
//                                 {isOpen && <span className="font-medium">{item.name}</span>}
//                             </NavLink>
//                         </li>
//                     ))}
//                 </ul>
//             </div>
//         </>
//     );
// };

// export default TesterSideNav;





import React, { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
 
// --- ICONS (Defined here to resolve import error) ---
const ProjectsIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>);
const UserManagementIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>);
const InviteIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><line x1="19" x2="19" y1="8" y2="14"></line><line x1="22" x2="16" y1="11" y2="11"></line></svg>);
const UserDetailsIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>);
const StatsIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20V10M18 20V4M6 20V16" /></svg>);
const DocsIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>);
const BellIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>);
const WalletIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 12V8a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-4"></path><path d="M20 12l-2-2-2 2"></path><path d="M18 10V2"></path></svg>);
const SettingsIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>);
 
const TesterSideNav = ({ isOpen,openInviteModal }) => {
    const [projects, setProjects] = useState([]);
    const [isProjectsOpen, setIsProjectsOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
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
                                    to="/tester/projects"
                                    className={({ isActive }) => `block px-3 py-2 text-sm rounded-md transition-colors hover:bg-white/10 ${isActive ? 'bg-white/20 font-semibold' : 'text-white/80'}`}
                                >
                                    View My Projects
                                </NavLink>
                            </li>
                            {projects.map((project) => (
                                <li key={project.id}>
                                    <NavLink
                                        to={`/tester/backlog/${project.id}`}
                                        title={project.name}
                                        onClick={() => handleProjectClick(project)}
                                        className={({ isActive }) => `block px-3 py-2 text-sm rounded-md transition-colors hover:bg-white/10 ${isActive ? 'bg-white/20 font-semibold' : 'text-white/80'}`}
                                    >
                                        {project.name}
                                    </NavLink>
                                </li>
                            ))}
                        </ul>
                    )}
                </li>
               
                <li>
                    <button
                        onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                        className={`flex items-center w-full gap-4 px-3 py-3 rounded-lg cursor-pointer transition-colors duration-200 hover:bg-white/10 ${!isOpen && 'justify-center'}`}
                    >
                        <UserManagementIcon />
                        {isOpen && <span className="flex-grow text-left">User Management</span>}
                        {isOpen && (
                            <svg className={`w-4 h-4 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                        )}
                    </button>
                    {isOpen && isUserMenuOpen && (
                        <ul className="mt-2 space-y-1 pl-8 border-l border-white/20 ml-5">
                            <li>
                                <NavLink
                                    to="/tester/dev-user-details"
                                    className={({ isActive }) => `flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors hover:bg-white/10 ${isActive ? 'bg-white/20 font-semibold' : 'text-white/80'}`}
                                >
                                    <UserDetailsIcon />
                                    <span>User Details</span>
                                </NavLink>
                            </li>
                                <li>
                                <button
                                    onClick={openInviteModal}
                                    className="flex items-center gap-3 w-full px-3 py-2 text-sm text-left rounded-md transition-colors text-white/80 hover:bg-white/10"
                                >
                                    <InviteIcon />
                                    <span>Invite</span>
                                </button>
                            </li>
                        </ul>
                    )}
                </li>
 
                {/* Other Static Nav Items */}
                {staticNavItems.map((item) => (
                    <li key={item.name}>
                        <NavLink
                            to={`/tester/${item.path}`}
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
 
export default TesterSideNav;
 
 
 