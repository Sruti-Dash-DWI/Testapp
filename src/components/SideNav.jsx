import React from 'react';
import { NavLink } from 'react-router-dom';
// 👇 1. Imported the new ProjectsIcon
import { HomeIcon, ProjectsIcon, CartIcon, StatsIcon, DocsIcon, BellIcon, WalletIcon, SettingsIcon } from './Icons';

const SideNav = ({ isOpen }) => {
    const navItems = [
        // { icon: <HomeIcon />, name: 'Home', path: '/' },
        // 👇 2. Replaced HomeIcon with ProjectsIcon
        { icon: <ProjectsIcon />, name: 'Projects', path: 'projects' },
        { icon: <CartIcon />, name: 'Cart', path: 'cart' },
        { icon: <StatsIcon />, name: 'Statistics', path: 'statistics' },
        { icon: <DocsIcon />, name: 'Documents', path: 'documents' },
        { icon: <BellIcon />, name: 'Notifications', path: 'notifications' },
        { icon: <WalletIcon />, name: 'Wallet', path: 'wallet' },
        { icon: <SettingsIcon />, name: 'Settings', path: 'settings' },
    ];
    return (
        <div className={`transition-all duration-300 bg-black/20 backdrop-blur-md rounded-3xl shadow-lg border border-white/20 h-full flex flex-col p-5 text-white ${isOpen ? 'w-70' : 'w-20 items-center'}`}>
            {isOpen && (
                <div className="mb-10">
                    {/* <h1 className="font-bold text-2xl text-white/90">Test App</h1> */}
                </div>
            )}
            <ul className="flex flex-col gap-2 flex-grow">
                {navItems.map((item) => (
                    <li key={item.name}>
                        {/* 👇 3. Changed hover:bg-white/20 to hover:bg-white/10 to differentiate it from the active state */}
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

export default SideNav;