import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheme } from '../../../context/ThemeContext';
import { Users, Plus, MoreHorizontal, Info, CheckSquare } from 'lucide-react';
import AddTeamMembersModal from '../../../components/modals/AddTeamMembersModal';
import TeamSettingsModal from '../../../components/modals/TeamSettingsModal';
import Toast from '../../../components/Toast';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Developerteamdetails = () => {
    const { teamId } = useParams();
    const navigate = useNavigate();
    const { theme, colors } = useTheme();
    const [team, setTeam] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAddMembersModalOpen, setIsAddMembersModalOpen] = useState(false);
    const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
    const menuRef = useRef(null);

    useEffect(() => {
        fetchTeamDetails();
    }, [teamId]);

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const fetchTeamDetails = async () => {
        try {
            const authToken = localStorage.getItem('authToken');
            if (!authToken) {
                navigate('/login');
                return;
            }

            const response = await fetch(`${API_BASE_URL}/teams/${teamId}/`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                setTeam(data);
            } else if (response.status === 404) {
                console.error("Team not found");
                navigate('/teams/teams');
            }
        } catch (error) {
            console.error("Error fetching team details:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteTeam = async () => {
        if (!window.confirm(`Are you sure you want to delete "${team.name}"? This action cannot be undone.`)) {
            return;
        }

        try {
            const authToken = localStorage.getItem('authToken');
            if (!authToken) return;

            const response = await fetch(`${API_BASE_URL}/teams/${teamId}/`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`,
                },
            });

            if (response.ok) {
                navigate('/teams/teams');
            } else {
                const errorData = await response.json();
                setToast({ show: true, message: 'Failed to delete team', type: 'error' });
            }
        } catch (error) {
            console.error("Error deleting team:", error);
            setToast({ show: true, message: 'Failed to delete team. Please try again.', type: 'error' });
        }
    };

    const handleMembersAdded = () => {
        fetchTeamDetails();
        setToast({ show: true, message: 'Team members invited successfully', type: 'success' });
    };

    const handleTeamUpdated = (updatedTeam) => {
        
        setTeam((prevTeam) => ({
            ...prevTeam,       
            ...updatedTeam,    
            team_memberships: prevTeam.team_memberships 
        }));

        setToast({ show: true, message: 'Your team settings have been saved', type: 'success' });
        
     
    };

    const getInitials = (firstName, lastName) => {
        return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
    };

    const getAvatarColor = (name) => {
        const colors = ['#0891b2', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];
        const index = name ? name.charCodeAt(0) % colors.length : 0;
        return colors[index];
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: colors.background }}>
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p style={{ color: colors.text }}>Loading team details...</p>
                </div>
            </div>
        );
    }

    if (!team) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: colors.background }}>
                <div className="text-center">
                    <Users size={64} style={{ color: theme === 'dark' ? '#4b5563' : '#d1d5db', margin: '0 auto 16px' }} />
                    <p className="text-xl mb-4" style={{ color: colors.text }}>Team not found</p>
                    <button
                        onClick={() => navigate('/teams/teams')}
                        className="px-6 py-2 rounded-lg text-white font-medium"
                        style={{ backgroundColor: '#2563eb' }}
                    >
                        Back to Teams
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div
            className="min-h-screen"
            style={{
                backgroundColor: colors.background,
                color: colors.text
            }}
        >
            {/* Breadcrumb */}
            <div className="px-8 pt-4 pb-2">
                <button
                    onClick={() => navigate('/teams/teams')}
                    className="text-sm hover:underline"
                    style={{ color: theme === 'dark' ? '#9ca3af' : '#6b7280' }}
                >
                    Teams
                </button>
            </div>

            {/* Purple Gradient Banner */}
            <div
                className="mx-8 rounded-xl overflow-hidden relative"
                style={{
                    height: '230px',
                    background: team.color
                        ? `linear-gradient(135deg, ${team.color} 0%, ${team.color}dd 50%, ${team.color}bb 100%)`
                        : 'linear-gradient(135deg, #a78bfa 0%, #8b5cf6 25%, #7c3aed 50%, #6d28d9 75%, #5b21b6 100%)',
                }}
            >
                {/* Decorative patterns */}
                <div className="absolute inset-0 opacity-30">
                    <div className="absolute left-16 top-1/2 transform -translate-y-1/2">
                        <div className="flex items-center gap-2">
                            <div className="w-24 h-24 border-2 border-dashed border-white/40 rounded"></div>
                            <div className="flex gap-1">
                                <div className="w-2 h-2 rounded-full bg-white/40"></div>
                                <div className="w-2 h-2 rounded-full bg-white/40"></div>
                                <div className="w-2 h-2 rounded-full bg-white/40"></div>
                            </div>
                        </div>
                    </div>
                    <div className="absolute right-1/3 top-8">
                        <div className="space-y-2 transform rotate-45">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="w-32 h-0.5 bg-white/30"></div>
                            ))}
                        </div>
                    </div>
                    <div className="absolute right-16 top-1/3">
                        <svg width="200" height="100" viewBox="0 0 200 100" fill="none">
                            {[...Array(6)].map((_, i) => (
                                <path
                                    key={i}
                                    d={`M 0 ${20 + i * 8} Q 25 ${10 + i * 8} 50 ${20 + i * 8} T 100 ${20 + i * 8} T 150 ${20 + i * 8} T 200 ${20 + i * 8}`}
                                    stroke="rgba(255,255,255,0.3)"
                                    strokeWidth="1.5"
                                    fill="none"
                                />
                            ))}
                        </svg>
                    </div>
                    <div className="absolute top-12 right-1/4">
                        <div className="w-1.5 h-1.5 rounded-full bg-white/40"></div>
                    </div>
                    <div className="absolute top-20 left-1/3">
                        <div className="w-1.5 h-1.5 rounded-full bg-white/40"></div>
                    </div>
                </div>
            </div>

            {/* Team Header */}
            <div className="px-8 py-6">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <div
                            className="w-16 h-16 rounded-xl flex items-center justify-center"
                            style={{ backgroundColor: team.color || '#a78bfa' }}
                        >
                            <Users size={32} color="#ffffff" />
                        </div>
                        <h1 className="text-4xl font-bold" style={{ color: colors.text }}>
                            {team.name}
                        </h1>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setIsAddMembersModalOpen(true)}
                            className="px-5 py-2.5 rounded-lg font-medium transition-all"
                            style={{
                                backgroundColor: theme === 'dark' ? '#374151' : '#f3f4f6',
                                color: colors.text,
                                border: `1px solid ${colors.border}`,
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = theme === 'dark' ? '#4b5563' : '#e5e7eb';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = theme === 'dark' ? '#374151' : '#f3f4f6';
                            }}
                        >
                            Add people
                        </button>

                        {/* Three Dot Menu */}
                        <div className="relative" ref={menuRef}>
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="w-10 h-10 rounded-lg flex items-center justify-center transition-all"
                                style={{
                                    backgroundColor: theme === 'dark' ? '#374151' : '#f3f4f6',
                                    color: colors.text,
                                    border: `1px solid ${colors.border}`,
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = theme === 'dark' ? '#4b5563' : '#e5e7eb';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = theme === 'dark' ? '#374151' : '#f3f4f6';
                                }}
                            >
                                <MoreHorizontal size={20} />
                            </button>

                            {/* Dropdown Menu */}
                            {isMenuOpen && (
                                <div
                                    className="absolute right-0 mt-2 w-48 rounded-lg shadow-lg z-10"
                                    style={{
                                        backgroundColor: colors.background,
                                        border: `1px solid ${colors.border}`,
                                    }}
                                >
                                    <button
                                        onClick={() => {
                                            setIsSettingsModalOpen(true);
                                            setIsMenuOpen(false);
                                        }}
                                        className="w-full px-4 py-2 text-left hover:bg-opacity-50 transition-colors"
                                        style={{ color: colors.text }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.backgroundColor = theme === 'dark' ? '#1f2937' : '#f9fafb';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.backgroundColor = 'transparent';
                                        }}
                                    >
                                        Team settings
                                    </button>
                                    <button
                                        onClick={() => {
                                            handleDeleteTeam();
                                            setIsMenuOpen(false);
                                        }}
                                        className="w-full px-4 py-2 text-left hover:bg-opacity-50 transition-colors rounded-b-lg"
                                        style={{ color: '#ef4444' }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.backgroundColor = theme === 'dark' ? '#1f2937' : '#f9fafb';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.backgroundColor = 'transparent';
                                        }}
                                    >
                                        Delete team
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="space-y-8">
                        <div>
                            <h2 className="text-xl font-semibold mb-3" style={{ color: colors.text }}>
                                About
                            </h2>
                            <p style={{ color: theme === 'dark' ? '#9ca3af' : '#6b7280' }}>
                                {team.about || 'Going up? Write your elevator pitch here.'}
                            </p>
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <h2 className="text-xl font-semibold" style={{ color: colors.text }}>
                                        Members
                                    </h2>
                                    <span
                                        className="px-2 py-0.5 rounded text-sm font-medium"
                                        style={{
                                            backgroundColor: theme === 'dark' ? '#374151' : '#e5e7eb',
                                            color: colors.text,
                                        }}
                                    >
                                        {team.team_memberships?.length || 0}
                                    </span>
                                    <button className="w-6 h-6 rounded-full flex items-center justify-center"
                                        style={{
                                            backgroundColor: theme === 'dark' ? '#374151' : '#e5e7eb',
                                            color: colors.text,
                                        }}>
                                        <Info size={14} />
                                    </button>
                                </div>
                                <button
                                    onClick={() => setIsAddMembersModalOpen(true)}
                                    className="w-8 h-8 rounded flex items-center justify-center transition-all"
                                    style={{
                                        backgroundColor: theme === 'dark' ? '#374151' : '#f3f4f6',
                                        color: colors.text,
                                        border: `1px solid ${colors.border}`,
                                    }}>
                                    <Plus size={18} />
                                </button>
                            </div>

                            <div className="rounded-lg p-4 space-y-3"
                                style={{
                                    backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff',
                                    border: `1px solid ${colors.border}`,
                                }}>
                                {team.team_memberships && team.team_memberships.length > 0 ? (
                                    team.team_memberships.map((member) => (
                                        <div key={member.user?.id || member.id} className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold"
                                                style={{
                                                    backgroundColor: getAvatarColor(member.user?.first_name || 'User'),
                                                    color: '#ffffff',
                                                }}>
                                                {getInitials(member.user?.first_name, member.user?.last_name)}
                                            </div>
                                            <div>
                                                <p className="font-medium" style={{ color: colors.text }}>
                                                    {member.user?.first_name} {member.user?.last_name}
                                                </p>
                                                <p className="text-xs" style={{ color: theme === 'dark' ? '#9ca3af' : '#6b7280' }}>
                                                    {member.role || 'Member'}

                                                    {member.status === 'PENDING' ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-semibold"
                                style={{ backgroundColor: '#fef3c7', color: '#d97706' }}>
                                Pending
                            </span>
                        ) : member.status === 'ACCEPTED' ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-semibold"
                                style={{ backgroundColor: '#dcfce7', color: '#16a34a' }}>
                                Accepted
                            </span>
                        ) : null}
                                                </p>

                                                
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-center py-4" style={{ color: theme === 'dark' ? '#9ca3af' : '#6b7280' }}>
                                        No members yet
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-2 space-y-8">
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-semibold" style={{ color: colors.text }}>
                                    Team links
                                </h2>
                                <button className="w-8 h-8 rounded flex items-center justify-center transition-all"
                                    style={{
                                        backgroundColor: theme === 'dark' ? '#374151' : '#f3f4f6',
                                        color: colors.text,
                                        border: `1px solid ${colors.border}`,
                                    }}>
                                    <Plus size={18} />
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {team.links && team.links.length > 0 ? (
                                    team.links.map((link) => (
                                        <div key={link.id} className="rounded-lg p-4 flex items-center gap-3 cursor-pointer transition-all"
                                            style={{
                                                backgroundColor: theme === 'dark' ? '#1f2937' : '#f9fafb',
                                                border: `1px solid ${colors.border}`,
                                            }}>
                                            <Plus size={20} style={{ color: theme === 'dark' ? '#9ca3af' : '#6b7280' }} />
                                            <div>
                                                <h3 className="font-medium" style={{ color: colors.text }}>
                                                    {link.title}
                                                </h3>
                                                <p className="text-sm" style={{ color: theme === 'dark' ? '#9ca3af' : '#6b7280' }}>
                                                    {link.description}
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="rounded-lg p-4 flex items-center gap-3 cursor-pointer transition-all"
                                        style={{
                                            backgroundColor: theme === 'dark' ? '#1f2937' : '#f9fafb',
                                            border: `1px solid ${colors.border}`,
                                        }}>
                                        <Plus size={20} style={{ color: theme === 'dark' ? '#9ca3af' : '#6b7280' }} />
                                        <div>
                                            <h3 className="font-medium" style={{ color: colors.text }}>
                                                TestApp project
                                            </h3>
                                            <p className="text-sm" style={{ color: theme === 'dark' ? '#9ca3af' : '#6b7280' }}>
                                                Plan out project tasks
                                            </p>
                                        </div>
                                    </div>
                                )}

                                <div className="rounded-lg p-4 flex items-center gap-3 cursor-pointer transition-all"
                                    style={{
                                        backgroundColor: theme === 'dark' ? '#1f2937' : '#f9fafb',
                                        border: `1px solid ${colors.border}`,
                                    }}>
                                    <Plus size={20} style={{ color: theme === 'dark' ? '#9ca3af' : '#6b7280' }} />
                                    <span className="font-medium" style={{ color: colors.text }}>
                                        Add any web link
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* <div>
                            <h2 className="text-xl font-semibold mb-4" style={{ color: colors.text }}>
                                Team activity
                            </h2>

                            <div className="space-y-4">
                                {team.activities && team.activities.length > 0 ? (
                                    team.activities.map((activity) => (
                                        <div key={activity.id} className="rounded-lg p-4 flex gap-3"
                                            style={{
                                                backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff',
                                                border: `1px solid ${colors.border}`,
                                            }}>
                                            <div className="w-10 h-10 rounded flex items-center justify-center flex-shrink-0"
                                                style={{ backgroundColor: '#dbeafe' }}>
                                                <CheckSquare size={20} color="#2563eb" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold mb-1" style={{ color: colors.text }}>
                                                    {activity.projectName || activity.title}
                                                </h3>
                                                <p className="text-sm" style={{ color: theme === 'dark' ? '#9ca3af' : '#6b7280' }}>
                                                    {activity.details || activity.description}
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-8">
                                        <p style={{ color: theme === 'dark' ? '#9ca3af' : '#6b7280' }}>
                                            No recent activity
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div> */}
                    </div>
                </div>
            </div>

            {/* Modals */}
            <AddTeamMembersModal
                isOpen={isAddMembersModalOpen}
                onClose={() => setIsAddMembersModalOpen(false)}
                teamId={teamId}
                onMembersAdded={handleMembersAdded}
            />

            <TeamSettingsModal
                isOpen={isSettingsModalOpen}
                onClose={() => setIsSettingsModalOpen(false)}
                team={team}
                onTeamUpdated={handleTeamUpdated}
            />

            {/* Toast Notification */}
            <Toast
                message={toast.message}
                type={toast.type}
                isVisible={toast.show}
                onClose={() => setToast({ ...toast, show: false })}
            />
        </div>
    );
};

export default Developerteamdetails;