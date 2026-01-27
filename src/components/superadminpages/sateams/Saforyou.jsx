import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../../context/ThemeContext';
import { Users, ArrowRight } from 'lucide-react';
import AddPeopleModal from '../../../components/modals/AddPeopleModall';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Saforyou = () => {
    const navigate = useNavigate();
    const { theme, colors } = useTheme();
    const [people, setPeople] = useState([]);
    const [teams, setTeams] = useState([]);
    const [isAddPeopleModalOpen, setIsAddPeopleModalOpen] = useState(false);

    useEffect(() => {
        fetchPeople();
        fetchTeams();
    }, []);

    // Fetch people data
    const fetchPeople = async () => {
        try {
            const authToken = localStorage.getItem('authToken');
            if (!authToken) return;

            const response = await fetch(`${API_BASE_URL}/users/`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                setPeople(data);
            }
        } catch (error) {
            console.error("Error fetching people:", error);
        }
    };

    // Fetch teams data
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
        }
    };

    const getInitials = (firstName, lastName) => {
        if (!firstName && !lastName) return '??';
        return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
    };

    const getAvatarColor = (name) => {
        const colors = ['#17a2b8', '#6f42c1', '#e83e8c', '#fd7e14', '#20c997'];
        const index = name ? name.charCodeAt(0) % colors.length : 0;
        return colors[index];
    };

    const handlePeopleAdded = () => {
        fetchPeople(); // Refresh the people list
    };

    const handleTeamClick = (teamId) => {
        navigate(`/teams/${teamId}`);
    };

    return (
        <div 
            className="min-h-screen p-8"
            style={{ 
                backgroundColor: colors.background,
                color: colors.text 
            }}
        >
            {/* People you work with Section */}
            <div className="mb-12">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <h2 className="text-2xl font-semibold" style={{ color: colors.text }}>
                            People you work with
                        </h2>
                        <button
                            onClick={() => setIsAddPeopleModalOpen(true)}
                            className="px-4 py-1.5 text-sm rounded-md transition-colors"
                            style={{
                                backgroundColor: theme === 'dark' ? '#374151' : '#e5e7eb',
                                color: colors.text,
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = theme === 'dark' ? '#4b5563' : '#d1d5db';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = theme === 'dark' ? '#374151' : '#e5e7eb';
                            }}
                        >
                            Add people
                        </button>
                    </div>
                    <button 
                        onClick={() => navigate('/teams/people')}
                        className="flex items-center gap-2 text-sm transition-colors hover:opacity-70"
                        style={{ color: colors.text }}
                    >
                        Browse everyone
                        <ArrowRight size={18} />
                    </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {people.length > 0 ? (
                        people.map((person) => (
                            <div
                                key={person.id}
                                className="rounded-lg p-6 flex flex-col items-center cursor-pointer transition-all hover:scale-105"
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
                                <div
                                    className="w-32 h-32 rounded-full flex items-center justify-center text-4xl font-bold mb-4"
                                    style={{
                                        backgroundColor: getAvatarColor(person.first_name || person.email),
                                        color: '#ffffff',
                                    }}
                                >
                                    {getInitials(person.first_name, person.last_name)}
                                </div>
                                <h3 className="text-center font-medium" style={{ color: colors.text }}>
                                    {person.first_name} {person.last_name}
                                </h3>
                                <p className="text-xs mt-1" style={{ color: theme === 'dark' ? '#9ca3af' : '#6b7280' }}>
                                    {person.role}
                                </p>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full text-center py-16">
                            <Users size={64} style={{ color: theme === 'dark' ? '#4b5563' : '#d1d5db', margin: '0 auto 16px' }} />
                            <p className="text-lg mb-2" style={{ color: colors.text }}>No people yet</p>
                            <p className="text-sm mb-4" style={{ color: theme === 'dark' ? '#9ca3af' : '#6b7280' }}>
                                Start by adding people to your organization
                            </p>
                            <button
                                onClick={() => setIsAddPeopleModalOpen(true)}
                                className="px-6 py-2 rounded-lg text-white font-medium"
                                style={{ backgroundColor: '#2563eb' }}
                            >
                                Add people
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Your teams Section */}
            <div>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-semibold" style={{ color: colors.text }}>
                        Your teams
                    </h2>
                    <button 
                        onClick={() => navigate('/teams/teams')}
                        className="flex items-center gap-2 text-sm transition-colors hover:opacity-70"
                        style={{ color: colors.text }}
                    >
                        Browse all teams
                        <ArrowRight size={18} />
                    </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {teams.length > 0 ? (
                        teams.map((team) => (
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
                                    <div
                                        className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                                        style={{
                                            backgroundColor: team.color || '#a78bfa',
                                        }}
                                    >
                                        <Users size={24} color="#ffffff" />
                                    </div>
                                    <div className="flex-grow relative">
                                        <h3 className="font-semibold mb-1" style={{ color: colors.text }}>
                                            {team.name}
                                        </h3>
                                        <p className="text-sm" style={{ color: theme === 'dark' ? '#9ca3af' : '#6b7280' }}>
                                            {team.members?.length || 0} {team.members?.length === 1 ? 'member' : 'members'}
                                        </p>
                                        {team.members && team.members.length > 0 && (
                                            <div className="absolute top-0 right-0">
                                                <div
                                                    className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                                                    style={{
                                                        backgroundColor: '#17a2b8',
                                                        color: '#ffffff',
                                                    }}
                                                >
                                                    {getInitials(
                                                        team.members[0].user?.first_name,
                                                        team.members[0].user?.last_name
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full text-center py-16">
                            <Users size={64} style={{ color: theme === 'dark' ? '#4b5563' : '#d1d5db', margin: '0 auto 16px' }} />
                            <p className="text-lg mb-2" style={{ color: colors.text }}>No teams yet</p>
                            <p className="text-sm mb-4" style={{ color: theme === 'dark' ? '#9ca3af' : '#6b7280' }}>
                                Create a team to start collaborating
                            </p>
                            <button
                                onClick={() => navigate('/teams/teams')}
                                className="px-6 py-2 rounded-lg text-white font-medium"
                                style={{ backgroundColor: '#2563eb' }}
                            >
                                View all teams
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Add People Modal */}
            <AddPeopleModal 
                isOpen={isAddPeopleModalOpen}
                onClose={() => setIsAddPeopleModalOpen(false)}
                onPeopleAdded={handlePeopleAdded}
            />
        </div>
    );
};

export default Saforyou;