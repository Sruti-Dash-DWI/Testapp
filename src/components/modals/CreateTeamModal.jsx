import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { X, Users, ChevronDown } from 'lucide-react';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const CreateTeamModal = ({ isOpen, onClose, onTeamCreated }) => {
    const { theme, colors } = useTheme();
    const [formData, setFormData] = useState({
        name: '',
        about: '',
        members_to_invite: []
    });
    const [users, setUsers] = useState([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (isOpen) {
            fetchUsers();
        }
    }, [isOpen]);

    const fetchUsers = async () => {
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
                setUsers(data);
            }
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error for this field
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const toggleUserSelection = (userEmail) => {
        setFormData(prev => ({
            ...prev,
            members_to_invite: prev.members_to_invite.includes(userEmail)
                ? prev.members_to_invite.filter(email => email !== userEmail)
                : [...prev.members_to_invite, userEmail]
        }));
    };

    const removeUser = (userEmail) => {
        setFormData(prev => ({
            ...prev,
            members_to_invite: prev.members_to_invite.filter(email => email !== userEmail)
        }));
    };

    const filteredUsers = users.filter(user => 
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        `${user.first_name} ${user.last_name}`.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const validateForm = () => {
        const newErrors = {};
        if (!formData.name.trim()) {
            newErrors.name = 'Team name is required';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) return;

        setLoading(true);
        try {
            const authToken = localStorage.getItem('authToken');
            if (!authToken) {
                alert('Authentication token not found');
                return;
            }

            const response = await fetch(`${API_BASE_URL}/teams/`, {
                method: 'POST', 
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`,
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                const data = await response.json();
                // Call the callback with the newly created team ID
                onTeamCreated(data.team_details.id);
                handleClose();
            } else {
                const errorData = await response.json();
                alert(`Error: ${JSON.stringify(errorData)}`);
            }
        } catch (error) {
            console.error("Error creating team:", error);
            alert('Failed to create team. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setFormData({
            name: '',
            about: '',
            members_to_invite: []
        });
        setSearchQuery('');
        setErrors({});
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
            onClick={handleClose}
        >
            <div 
                className="rounded-lg shadow-xl max-w-md w-full mx-4"
                style={{
                    backgroundColor: colors.background,
                    maxHeight: '90vh',
                    overflowY: 'auto'
                }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div 
                    className="flex items-center justify-between p-6 border-b"
                    style={{ borderColor: colors.border }}
                >
                    <div className="flex items-center gap-3">
                        <Users size={24} style={{ color: colors.text }} />
                        <h2 className="text-xl font-semibold" style={{ color: colors.text }}>
                            Create team
                        </h2>
                    </div>
                    <button
                        onClick={handleClose}
                        className="p-1 rounded-lg transition-colors"
                        style={{ color: colors.text }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = theme === 'dark' ? '#374151' : '#f3f4f6';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6">
                    <p className="text-sm mb-6" style={{ color: theme === 'dark' ? '#9ca3af' : '#6b7280' }}>
                        Required fields are marked with an asterisk *
                    </p>

                    {/* Team Name */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium mb-2" style={{ color: colors.text }}>
                            Name <span style={{ color: '#ef4444' }}>*</span>
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 rounded-lg outline-none transition-colors"
                            style={{
                                backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff',
                                border: `1px solid ${errors.name ? '#ef4444' : colors.border}`,
                                color: colors.text
                            }}
                            placeholder="Enter team name"
                        />
                        {errors.name && (
                            <p className="text-sm mt-1" style={{ color: '#ef4444' }}>
                                {errors.name}
                            </p>
                        )}
                    </div>

                    {/* About */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium mb-2" style={{ color: colors.text }}>
                            About
                        </label>
                        <textarea
                            name="about"
                            value={formData.about}
                            onChange={handleInputChange}
                            rows={3}
                            className="w-full px-4 py-2 rounded-lg outline-none transition-colors resize-none"
                            style={{
                                backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff',
                                border: `1px solid ${colors.border}`,
                                color: colors.text
                            }}
                            placeholder="Going up? Write your elevator pitch here."
                        />
                    </div>

                    {/* Add Team Members */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium mb-2" style={{ color: colors.text }}>
                            Add team members <span style={{ color: '#ef4444' }}>*</span>
                        </label>
                        
                        {/* Selected Members */}
                        {formData.members_to_invite.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-3">
                                {formData.members_to_invite.map(email => {
                                    const user = users.find(u => u.email === email);
                                    return (
                                        <div
                                            key={email}
                                            className="flex items-center gap-2 px-3 py-1 rounded-full text-sm"
                                            style={{
                                                backgroundColor: theme === 'dark' ? '#374151' : '#e5e7eb',
                                                color: colors.text
                                            }}
                                        >
                                            <span>{user ? `${user.first_name} ${user.last_name}` : email}</span>
                                            <button
                                                type="button"
                                                onClick={() => removeUser(email)}
                                                className="hover:opacity-70"
                                            >
                                                <X size={14} />
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        {/* Dropdown */}
                        <div className="relative">
                            <button
                                type="button"
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className="w-full px-4 py-2 rounded-lg flex items-center justify-between transition-colors"
                                style={{
                                    backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff',
                                    border: `1px solid ${colors.border}`,
                                    color: colors.text
                                }}
                            >
                                <span style={{ color: theme === 'dark' ? '#9ca3af' : '#6b7280' }}>
                                    Search for team members
                                </span>
                                <ChevronDown size={18} />
                            </button>

                            {isDropdownOpen && (
                                <div 
                                    className="absolute z-10 w-full mt-2 rounded-lg shadow-lg"
                                    style={{
                                        backgroundColor: colors.background,
                                        border: `1px solid ${colors.border}`,
                                        maxHeight: '240px',
                                        overflowY: 'auto'
                                    }}
                                >
                                    {/* Search Input */}
                                    {/* <div className="p-2 border-b" style={{ borderColor: colors.border }}>
                                        <input
                                            type="text"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            placeholder="Search users..."
                                            className="w-full px-3 py-2 rounded outline-none"
                                            style={{
                                                backgroundColor: theme === 'dark' ? '#1f2937' : '#f9fafb',
                                                color: colors.text
                                            }}
                                            onClick={(e) => e.stopPropagation()}
                                        />
                                    </div> */}

                                    {/* User List */}
                                    <div className="max-h-48 overflow-y-auto">
                                        {filteredUsers.map(user => (
                                            <button
                                                key={user.id}
                                                type="button"
                                                onClick={() => toggleUserSelection(user.email)}
                                                className="w-full px-4 py-2 text-left hover:bg-opacity-50 transition-colors flex items-center justify-between"
                                                style={{
                                                    backgroundColor: formData.members_to_invite.includes(user.email)
                                                        ? (theme === 'dark' ? '#374151' : '#e5e7eb')
                                                        : 'transparent'
                                                }}
                                                onMouseEnter={(e) => {
                                                    if (!formData.members_to_invite.includes(user.email)) {
                                                        e.currentTarget.style.backgroundColor = theme === 'dark' ? '#1f2937' : '#f9fafb';
                                                    }
                                                }}
                                                onMouseLeave={(e) => {
                                                    if (!formData.members_to_invite.includes(user.email)) {
                                                        e.currentTarget.style.backgroundColor = 'transparent';
                                                    }
                                                }}
                                            >
                                                <div>
                                                    <p className="font-medium" style={{ color: colors.text }}>
                                                        {user.first_name} {user.last_name}
                                                    </p>
                                                    <p className="text-sm" style={{ color: theme === 'dark' ? '#9ca3af' : '#6b7280' }}>
                                                        {user.email}
                                                    </p>
                                                </div>
                                                {formData.members_to_invite.includes(user.email) && (
                                                    <div className="w-5 h-5 rounded bg-blue-500 flex items-center justify-center">
                                                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                                            <path d="M10 3L4.5 8.5L2 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                        </svg>
                                                    </div>
                                                )}
                                            </button>
                                        ))}
                                        {filteredUsers.length === 0 && (
                                            <p className="px-4 py-3 text-center text-sm" style={{ color: theme === 'dark' ? '#9ca3af' : '#6b7280' }}>
                                                No users found
                                            </p>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex items-center justify-end gap-3 pt-4">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="px-5 py-2 rounded-lg font-medium transition-colors"
                            style={{
                                backgroundColor: theme === 'dark' ? '#374151' : '#f3f4f6',
                                color: colors.text
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = theme === 'dark' ? '#4b5563' : '#e5e7eb';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = theme === 'dark' ? '#374151' : '#f3f4f6';
                            }}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-5 py-2 rounded-lg font-medium text-white transition-opacity"
                            style={{
                                backgroundColor: '#2563eb',
                                opacity: loading ? 0.6 : 1
                            }}
                        >
                            {loading ? 'Creating...' : 'Create'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateTeamModal;