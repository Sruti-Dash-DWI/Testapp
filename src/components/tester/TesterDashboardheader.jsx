import React, { useState, useEffect } from 'react';
import { UsersIcon, MoreIcon, CopyLinkIcon, FullScreenIcon, ExitFullScreenIcon, ShareIcon, ThunderIcon } from '../../assets/icons.jsx';

const TesterDashboardheader = () => {
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
        <>
            <style>{`
                @keyframes shimmerHeader {
                    0% {
                        background-position: -1000px 0;
                    }
                    100% {
                        background-position: 1000px 0;
                    }
                }

                @keyframes fadeInDown {
                    from {
                        opacity: 0;
                        transform: translateY(-10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
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

                @keyframes buttonGlow {
                    0%, 100% {
                        box-shadow: 0 0 5px rgba(240, 147, 251, 0.3);
                    }
                    50% {
                        box-shadow: 0 0 15px rgba(240, 147, 251, 0.5), 0 0 25px rgba(118, 75, 162, 0.3);
                    }
                }

                .header-container {
                    background: linear-gradient(135deg, rgba(102, 126, 234, 0.25) 0%, rgba(118, 75, 162, 0.3) 50%, rgba(240, 147, 251, 0.25) 100%);
                    backdrop-filter: blur(20px);
                    border-bottom: 2px solid rgba(240, 147, 251, 0.4);
                    box-shadow: 0 4px 20px rgba(118, 75, 162, 0.15);
                    position: relative;
                    overflow: hidden;
                    animation: fadeInDown 0.5s ease-out;
                }

                .header-container::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: -100%;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(
                        90deg,
                        transparent,
                        rgba(240, 147, 251, 0.1),
                        transparent
                    );
                    animation: shimmerHeader 3s infinite;
                }

                .dashboard-header-wrapper .project-title {
                    color: white;
                    font-weight: 700;
                    text-shadow: 0 2px 10px rgba(240, 147, 251, 0.5);
                    animation: titleGlow 3s ease-in-out infinite;
                }

                @keyframes titleGlow {
                    0%, 100% {
                        text-shadow: 0 2px 10px rgba(240, 147, 251, 0.5);
                    }
                    50% {
                        text-shadow: 0 2px 20px rgba(240, 147, 251, 0.8), 0 0 30px rgba(118, 75, 162, 0.6);
                    }
                }

                .dashboard-header-wrapper .header-button {
                    position: relative;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    color: white;
                }

                .header-button::before {
                    content: '';
                    position: absolute;
                    inset: 0;
                    border-radius: 0.375rem;
                    background: linear-gradient(135deg, rgba(255, 255, 255, 0.2), rgba(240, 147, 251, 0.2));
                    opacity: 0;
                    transition: opacity 0.3s ease;
                }

                .header-button:hover::before {
                    opacity: 1;
                }

                .header-button:hover {
                    color: white;
                    transform: translateY(-2px);
                    text-shadow: 0 0 10px rgba(240, 147, 251, 0.8);
                }

                .header-button:active {
                    transform: translateY(0);
                }

                .dashboard-header-wrapper .icon-button {
                    position: relative;
                    transition: all 0.3s ease;
                    color: white;
                }

                .icon-button:hover {
                    color: white;
                    transform: scale(1.15) rotate(8deg);
                    filter: drop-shadow(0 0 12px rgba(240, 147, 251, 0.8));
                }

                .icon-button:active {
                    transform: scale(0.95);
                }

                .dashboard-header-wrapper .action-button {
                    position: relative;
                    overflow: hidden;
                    transition: all 0.3s ease;
                    background: rgba(255, 255, 255, 0.15);
                    border: 2px solid rgba(255, 255, 255, 0.3);
                    color: white;
                    font-weight: 600;
                }

                .action-button::after {
                    content: '';
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    width: 0;
                    height: 0;
                    border-radius: 50%;
                    background: rgba(255, 255, 255, 0.3);
                    transform: translate(-50%, -50%);
                    transition: width 0.5s, height 0.5s;
                }

                .action-button:hover::after {
                    width: 300px;
                    height: 300px;
                }

                .action-button:hover {
                    background: rgba(255, 255, 255, 0.25);
                    border-color: rgba(255, 255, 255, 0.5);
                    transform: translateY(-2px);
                    box-shadow: 0 6px 20px rgba(240, 147, 251, 0.4), 0 0 20px rgba(255, 255, 255, 0.3);
                    color: white;
                }

                .dashboard-header-wrapper .fullscreen-button {
                    position: relative;
                    transition: all 0.3s ease;
                }

                .fullscreen-button:hover {
                    animation: buttonGlow 1.5s infinite;
                    transform: scale(1.1);
                }

                .dashboard-header-wrapper .thunder-button {
                    position: relative;
                    transition: all 0.3s ease;
                }

                .thunder-button:hover {
                    animation: buttonGlow 1s infinite;
                    color: white;
                    filter: drop-shadow(0 0 15px rgba(240, 147, 251, 0.9));
                }

                .dashboard-header-wrapper .divider {
                    width: 1px;
                    height: 24px;
                    background: linear-gradient(to bottom, transparent, rgba(255, 255, 255, 0.5), transparent);
                    margin: 0 8px;
                }
            `}</style>

            <div className="dashboard-header-wrapper">
                <header className="header-container flex items-center rounded-t-2xl justify-between p-4 flex-shrink-0">
                <div className="flex items-center gap-4 relative z-10">
                    <p className="project-title text-lg">Scrum Project</p>
                    <div className="divider"></div>
                    <button className="icon-button hover:text-gray-800">
                        <UsersIcon />
                    </button>
                    <button className="icon-button hover:text-gray-800">
                        <MoreIcon />
                    </button>
                </div>
                <div className="flex items-center gap-3 relative z-10">
                    <button className="action-button flex items-center gap-2 px-4 py-2 text-sm rounded-lg font-medium">
                        <CopyLinkIcon /> Copy link
                    </button>
                    <button 
                        onClick={toggleFullScreen} 
                        className="fullscreen-button icon-button p-2 rounded-lg"
                    >
                        {isFullScreen ? <ExitFullScreenIcon /> : <FullScreenIcon />}
                    </button>
                    <button className="action-button flex items-center gap-2 px-4 py-2 text-sm rounded-lg font-medium">
                        <ShareIcon /> Share
                    </button>
                    <button className="thunder-button icon-button p-2 rounded-lg">
                        <ThunderIcon />
                    </button>
                </div>
                            </header>
            </div>
        </>
    );
};

export default TesterDashboardheader;