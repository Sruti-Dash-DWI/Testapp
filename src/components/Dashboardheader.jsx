import React, { useState, useEffect } from 'react';
import { UsersIcon, MoreIcon, CopyLinkIcon, FullScreenIcon, ExitFullScreenIcon, ShareIcon, ThunderIcon } from '../assets/icons.jsx';
import { useTheme } from '../context/ThemeContext';

const Dashboardheader = ({projectName}) => {
    const [isFullScreen, setIsFullScreen] = useState(false);
    const { theme, colors } = useTheme();

    useEffect(() => {
        const handleFullScreenChange = () => setIsFullScreen(!!document.fullscreenElement);
        document.addEventListener('fullscreenchange', handleFullScreenChange);
        return () => document.removeEventListener('fullscreenchange', handleFullScreenChange);
    }, []);

    const toggleFullScreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.error(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
            });
        } else {
            document.exitFullscreen();
        }
    };

    return (
        <header 
            className="flex items-center justify-between p-4 border-b backdrop-blur-sm flex-shrink-0 transition-colors duration-300"
            style={{
                backgroundColor: theme === 'dark' ? '#0f172a' : '#ffffff',
                borderColor: colors.border
            }}
        >
            <div className="flex items-center gap-4">
                <p 
                    className="font-bold text-lg"
                    style={{ color: colors.text }}
                >
                    {projectName}
                </p>
                <button 
                    className="hover:text-gray-800 transition-colors"
                    style={{ color: theme === 'dark' ? '#94a3b8' : '#6b7280' }}
                    onMouseEnter={(e) => e.currentTarget.style.color = colors.text}
                    onMouseLeave={(e) => e.currentTarget.style.color = theme === 'dark' ? '#94a3b8' : '#6b7280'}
                >
                    <UsersIcon />
                </button>
                <button 
                    className="hover:text-gray-800 transition-colors"
                    style={{ color: theme === 'dark' ? '#94a3b8' : '#6b7280' }}
                    onMouseEnter={(e) => e.currentTarget.style.color = colors.text}
                    onMouseLeave={(e) => e.currentTarget.style.color = theme === 'dark' ? '#94a3b8' : '#6b7280'}
                >
                    <MoreIcon />
                </button>
            </div>
            <div className="flex items-center gap-4">
                <button 
                    className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-md transition-colors"
                    style={{ 
                        color: colors.text,
                        backgroundColor: 'transparent'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = theme === 'dark' ? 'rgba(51, 65, 85, 0.5)' : 'rgba(229, 231, 235, 0.5)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                >
                    <CopyLinkIcon /> Copy link
                </button>
                <button 
                    onClick={toggleFullScreen} 
                    className="p-1.5 rounded-md transition-colors"
                    style={{ 
                        color: theme === 'dark' ? '#94a3b8' : '#6b7280',
                        backgroundColor: 'transparent'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = theme === 'dark' ? 'rgba(51, 65, 85, 0.5)' : 'rgba(229, 231, 235, 0.5)';
                        e.currentTarget.style.color = colors.text;
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = theme === 'dark' ? '#94a3b8' : '#6b7280';
                    }}
                >
                    {isFullScreen ? <ExitFullScreenIcon /> : <FullScreenIcon />}
                </button>
                <button 
                    className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-md transition-colors"
                    style={{ 
                        color: colors.text,
                        backgroundColor: 'transparent'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = theme === 'dark' ? 'rgba(51, 65, 85, 0.5)' : 'rgba(229, 231, 235, 0.5)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                >
                    <ShareIcon /> Share
                </button>
                <button 
                    className="p-1.5 rounded-md transition-colors"
                    style={{ 
                        color: theme === 'dark' ? '#94a3b8' : '#6b7280',
                        backgroundColor: 'transparent'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = theme === 'dark' ? 'rgba(51, 65, 85, 0.5)' : 'rgba(229, 231, 235, 0.5)';
                        e.currentTarget.style.color = colors.text;
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = theme === 'dark' ? '#94a3b8' : '#6b7280';
                    }}
                >
                    <ThunderIcon />
                </button>
            </div>
        </header>
    );
};

export default Dashboardheader;