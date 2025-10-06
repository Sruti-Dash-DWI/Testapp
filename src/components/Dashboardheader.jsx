import React, { useState, useEffect } from 'react';
import { UsersIcon, MoreIcon, CopyLinkIcon, FullScreenIcon, ExitFullScreenIcon, ShareIcon, ThunderIcon } from '../assets/icons.jsx';

const Dashboardheader = ({projectName}) => {
    const [isFullScreen, setIsFullScreen] = useState(false);

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
        <header className="flex items-center rounded-t-2xl justify-between p-4 border-b border-gray-200/80 bg-white/50 backdrop-blur-sm flex-shrink-0">
            <div className="flex items-center gap-4">
                <p className="font-bold text-lg">{projectName}</p>
                <button className="text-gray-500 hover:text-gray-800"><UsersIcon /></button>
                <button className="text-gray-500 hover:text-gray-800"><MoreIcon /></button>
            </div>
            <div className="flex items-center gap-4">
                <button className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-md hover:bg-gray-200/50"><CopyLinkIcon /> Copy link</button>
                <button onClick={toggleFullScreen} className="text-gray-500 hover:text-gray-800 p-1.5 rounded-md hover:bg-gray-200/50">
                    {isFullScreen ? <ExitFullScreenIcon /> : <FullScreenIcon />}
                </button>
                <button className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-md hover:bg-gray-200/50"><ShareIcon /> Share</button>
                <button className="text-gray-500 hover:text-gray-800 p-1.5 rounded-md hover:bg-gray-200/50">
                    <ThunderIcon />
                </button>
            </div>
        </header>
    );
};

export default Dashboardheader;

