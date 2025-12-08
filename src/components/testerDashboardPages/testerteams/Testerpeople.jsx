import React, { useState, useEffect } from 'react';
import { useTheme } from '../../../context/ThemeContext';
import { Search, Users, Briefcase, UserCheck, MapPin, ChevronDown, Network } from 'lucide-react';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Testerpeople = () => {
    const { theme, colors } = useTheme();
    const [people, setPeople] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filters, setFilters] = useState({
        team: '',
        jobTitle: '',
        manager: '',
        department: '',
        location: ''
    });
    const [showFilterDropdown, setShowFilterDropdown] = useState({
        team: false,
        jobTitle: false,
        manager: false,
        department: false,
        location: false
    });

    useEffect(() => {
        fetchPeople();
    }, []);

    const fetchPeople = async () => {
        try {
            const authToken = localStorage.getItem('authToken');
            if (!authToken) return;

            const response = await fetch(`${API_BASE_URL}/people/`, {
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
            // Mock data for demonstration
            setPeople([
                { id: 1, name: 'SONU KACHHAP', team: 'Development', jobTitle: 'Developer', department: 'Engineering', location: 'New York' },
                { id: 2, name: 'sheikh shadik', team: 'Development', jobTitle: 'Designer', department: 'Design', location: 'San Francisco' }
            ]);
        }
    };

    const getInitials = (name) => {
        if (!name) return '??';
        const parts = name.split(' ');
        if (parts.length >= 2) {
            return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    };

    const getAvatarColor = (name) => {
        const colors = ['#17a2b8', '#6f42c1', '#e83e8c', '#fd7e14', '#20c997'];
        const index = name ? name.charCodeAt(0) % colors.length : 0;
        return colors[index];
    };

    const filteredPeople = people.filter(person => {
        const matchesSearch = person.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesTeam = !filters.team || person.team === filters.team;
        const matchesJobTitle = !filters.jobTitle || person.jobTitle === filters.jobTitle;
        const matchesDepartment = !filters.department || person.department === filters.department;
        const matchesLocation = !filters.location || person.location === filters.location;
        
        return matchesSearch && matchesTeam && matchesJobTitle && matchesDepartment && matchesLocation;
    });

    const FilterButton = ({ label, icon: Icon, filterKey }) => (
        <div className="relative">
            <button
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all"
                style={{
                    backgroundColor: filters[filterKey] 
                        ? (theme === 'dark' ? '#3b82f6' : '#2563eb')
                        : (theme === 'dark' ? '#374151' : '#f3f4f6'),
                    color: filters[filterKey] 
                        ? '#ffffff' 
                        : colors.text,
                    border: `1px solid ${filters[filterKey] ? 'transparent' : colors.border}`,
                }}
                onClick={() => setShowFilterDropdown(prev => ({
                    ...prev,
                    [filterKey]: !prev[filterKey]
                }))}
                onMouseEnter={(e) => {
                    if (!filters[filterKey]) {
                        e.currentTarget.style.backgroundColor = theme === 'dark' ? '#4b5563' : '#e5e7eb';
                    }
                }}
                onMouseLeave={(e) => {
                    if (!filters[filterKey]) {
                        e.currentTarget.style.backgroundColor = theme === 'dark' ? '#374151' : '#f3f4f6';
                    }
                }}
            >
                <Icon size={18} />
                <span>{label}</span>
                <ChevronDown size={16} />
            </button>
        </div>
    );

    return (
        <div 
            className="min-h-screen p-8"
            style={{ 
                backgroundColor: colors.background,
                color: colors.text 
            }}
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-4xl font-bold" style={{ color: colors.text }}>
                    People
                </h1>
                <button
                    className="px-6 py-2.5 rounded-lg text-white font-medium transition-all hover:opacity-90"
                    style={{
                        backgroundColor: '#2563eb',
                    }}
                >
                    Add people
                </button>
            </div>

            {/* Search Bar */}
            <div className="mb-6">
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
                        placeholder="Search by name"
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

            {/* Filter Buttons */}
            <div className="flex flex-wrap items-center gap-3 mb-8">
                <FilterButton label="Filter by Team" icon={Users} filterKey="team" />
                <FilterButton label="Job title" icon={Briefcase} filterKey="jobTitle" />
                <FilterButton label="Manager" icon={UserCheck} filterKey="manager" />
                <FilterButton label="Department" icon={Network} filterKey="department" />
                <FilterButton label="Location" icon={MapPin} filterKey="location" />
            </div>

            {/* People Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {filteredPeople.map((person) => (
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
                                backgroundColor: getAvatarColor(person.name),
                                color: '#1e3a5f',
                            }}
                        >
                            {getInitials(person.name)}
                        </div>
                        <h3 className="text-center font-medium text-lg" style={{ color: colors.text }}>
                            {person.name}
                        </h3>
                        {person.jobTitle && (
                            <p className="text-center text-sm mt-1" style={{ color: theme === 'dark' ? '#9ca3af' : '#6b7280' }}>
                                {person.jobTitle}
                            </p>
                        )}
                        {person.department && (
                            <p className="text-center text-xs mt-1" style={{ color: theme === 'dark' ? '#9ca3af' : '#6b7280' }}>
                                {person.department}
                            </p>
                        )}
                    </div>
                ))}
            </div>

            {/* No Results */}
            {filteredPeople.length === 0 && (
                <div className="text-center py-16">
                    <Users size={64} style={{ color: theme === 'dark' ? '#4b5563' : '#d1d5db', margin: '0 auto 16px' }} />
                    <p className="text-lg" style={{ color: theme === 'dark' ? '#9ca3af' : '#6b7280' }}>
                        No people found
                    </p>
                </div>
            )}
        </div>
    );
};

export default Testerpeople;