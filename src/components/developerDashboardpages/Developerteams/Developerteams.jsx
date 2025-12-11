import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../../context/ThemeContext';
import { Search, Users } from 'lucide-react';
import CreateTeamModal from '../../../components/modals/CreateTeamModal';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Developerteams = () => {
    const navigate = useNavigate();
    const { theme, colors } = useTheme();
    const [teams, setTeams] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState('all'); // 'all' or 'your'
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    useEffect(() => {
        fetchTeams();
    }, []);

    const fetchTeams = async () => {
        try {
            const authToken = localStorage.getItem('authToken');
            if (!authToken) return;

            const response = await fetch(`${API_BASE_URL}/teams/`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                setTeams(data);
            }
        } catch (error) {
            console.error("Error fetching teams:", error);
            
            setTeams([
                { 
                    id: 1, 
                    name: 'Team', 
                    memberCount: 1,
                    color: '#a78bfa',
                    members: [{ id: 1, name: 'SS' }]
                },
                { 
                    id: 2, 
                    name: 'WebDev', 
                    memberCount: 1,
                    color: '#06b6d4',
                    members: [{ id: 2, name: 'SS' }]
                }
            ]);
        }
    };

    const filteredTeams = teams.filter(team => 
        team.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleTeamClick = (teamId) => {
        navigate(`/developer/teams/${teamId}`);
    };

    const handleTeamCreated = (teamId) => {
      
        fetchTeams();
      
        navigate(`/developer/teams/${teamId}`);
    };

    return (
        <div 
            className="min-h-screen p-8"
            style={{ 
                backgroundColor: colors.background,
                color: colors.text 
            }}
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-4xl font-bold" style={{ color: colors.text }}>
                    Teams
                </h1>
                <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="px-6 py-2.5 rounded-lg font-medium transition-all"
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
                    Create team
                </button>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-6 mb-6 border-b" style={{ borderColor: colors.border }}>
                <button
                    onClick={() => setActiveTab('all')}
                    className="pb-3 px-1 font-medium transition-all relative"
                    style={{
                        color: activeTab === 'all' ? '#2563eb' : colors.text,
                    }}
                >
                    All teams
                    {activeTab === 'all' && (
                        <div 
                            className="absolute bottom-0 left-0 right-0 h-0.5"
                            style={{ backgroundColor: '#2563eb' }}
                        />
                    )}
                </button>
                <button
                    onClick={() => setActiveTab('your')}
                    className="pb-3 px-1 font-medium transition-all relative"
                    style={{
                        color: activeTab === 'your' ? '#2563eb' : colors.text,
                    }}
                >
                    Your teams
                    {activeTab === 'your' && (
                        <div 
                            className="absolute bottom-0 left-0 right-0 h-0.5"
                            style={{ backgroundColor: '#2563eb' }}
                        />
                    )}
                </button>
            </div>

            {/* Search Bar */}
            <div className="mb-8">
                <div 
                    className="flex items-center gap-3 px-4 py-3 rounded-lg"
                    style={{
                        backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff',
                        border: `1px solid ${colors.border}`,
                    }}
                >
                    <Search size={20} style={{ color: theme === 'dark' ? '#9ca3af' : '#6b7280' }} />
                    <input
                        type="text"
                        placeholder="Search teams"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="flex-grow outline-none text-base"
                        style={{
                            backgroundColor: 'transparent',
                            color: colors.text,
                        }}
                    />
                </div>
            </div>

            {/* Teams Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredTeams.map((team) => (
                    <div
                        key={team.id}
                        onClick={() => handleTeamClick(team.id)}
                        className="rounded-lg p-6 cursor-pointer transition-all hover:scale-105"
                        style={{
                            backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff',
                            border: `1px solid ${colors.border}`,
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.boxShadow = theme === 'dark' 
                                ? '0 4px 12px rgba(0, 0, 0, 0.3)' 
                                : '0 4px 12px rgba(0, 0, 0, 0.1)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.boxShadow = 'none';
                        }}
                    >
                        <div className="flex items-start gap-4">
                            {/* Team Icon */}
                            <div
                                className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                                style={{
                                    backgroundColor: team.color || '#a78bfa',
                                }}
                            >
                                <Users size={24} color="#ffffff" />
                            </div>
                            
                            <div className="flex-grow relative">
                                {/* Team Name */}
                                <h3 className="font-semibold text-lg mb-1" style={{ color: colors.text }}>
                                    {team.name}
                                </h3>
                                
                                {/* Member Count */}
                                <p className="text-sm" style={{ color: theme === 'dark' ? '#9ca3af' : '#6b7280' }}>
                                    {team.memberCount} {team.memberCount === 1 ? 'member' : 'members'}
                                </p>
                                
                                {/* Member Avatar */}
                                {team.members && team.members.length > 0 && (
                                    <div className="absolute top-0 right-0">
                                        <div
                                            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                                            style={{
                                                backgroundColor: '#0891b2',
                                                color: '#ffffff',
                                            }}
                                        >
                                            {team.members[0].name}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* No Results */}
            {filteredTeams.length === 0 && (
                <div className="text-center py-16">
                    <Users size={64} style={{ color: theme === 'dark' ? '#4b5563' : '#d1d5db', margin: '0 auto 16px' }} />
                    <p className="text-lg" style={{ color: theme === 'dark' ? '#9ca3af' : '#6b7280' }}>
                        No teams found
                    </p>
                </div>
            )}

            {/* Create Team Modal */}
            <CreateTeamModal 
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onTeamCreated={handleTeamCreated}
            />
        </div>
    );
};

export default Developerteams;