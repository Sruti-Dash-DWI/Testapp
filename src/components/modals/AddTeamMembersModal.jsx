import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { X, ChevronDown } from 'lucide-react';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const AddTeamMembersModal = ({ isOpen, onClose, teamId, onMembersAdded }) => {
    const { theme, colors } = useTheme();
    const [users, setUsers] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [role, setRole] = useState('MANAGER');
    const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const roles = [
        { value: 'OWNER', label: 'Owner' },
        { value: 'ADMIN', label: 'Admin' },
        { value: 'SCRUM_MASTER', label: 'Scrum Master' },
        { value: 'MANAGER', label: 'Manager' },
        { value: 'DEVELOPER', label: 'Developer' },
        { value: 'TESTER', label: 'Tester' },
    ];

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

    const toggleUserSelection = (userEmail) => {
        setSelectedUsers(prev =>
            prev.includes(userEmail)
                ? prev.filter(email => email !== userEmail)
                : [...prev, userEmail]
        );
    };

    const removeUser = (userEmail) => {
        setSelectedUsers(prev => prev.filter(email => email !== userEmail));
    };

    const filteredUsers = users.filter(user =>
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        `${user.first_name} ${user.last_name}`.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (selectedUsers.length === 0) {
            setError('Please select at least one user');
            return;
        }

        setLoading(true);
        try {
            const authToken = localStorage.getItem('authToken');
            if (!authToken) {
                setError('Authentication token not found');
                return;
            }

            const response = await fetch(`${API_BASE_URL}/teams/${teamId}/invite/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`,
                },
                body: JSON.stringify({
                    members_to_invite: selectedUsers
                })
            });

            if (response.ok) {
                onMembersAdded();
                handleClose();
                alert(`Invitations sent successfully to ${selectedUsers.length} user(s)`);
            } else {
                const errorData = await response.json();
                setError(errorData.error || 'Failed to send invitations');
            }
        } catch (error) {
            console.error("Error inviting users:", error);
            setError('Failed to send invitations. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setSelectedUsers([]);
        setSearchQuery('');
        setRole('MANAGER');
        setError('');
        setIsDropdownOpen(false);
        setIsRoleDropdownOpen(false);
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
                    <h2 className="text-xl font-semibold" style={{ color: colors.text }}>
                        Add people to team
                    </h2>
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
                    {/* Selected Members */}
                    {selectedUsers.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                            {selectedUsers.map(email => {
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
                    <div className="mb-6">
                        <label className="block text-sm font-medium mb-2" style={{ color: colors.text }}>
                            Select team members
                        </label>
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

                                    {/* User List */}
                                    <div className="max-h-48 overflow-y-auto">
                                        {filteredUsers.map(user => (
                                            <button
                                                key={user.id}
                                                type="button"
                                                onClick={() => toggleUserSelection(user.email)}
                                                className="w-full px-4 py-2 text-left hover:bg-opacity-50 transition-colors flex items-center justify-between"
                                                style={{
                                                    backgroundColor: selectedUsers.includes(user.email)
                                                        ? (theme === 'dark' ? '#374151' : '#e5e7eb')
                                                        : 'transparent'
                                                }}
                                                onMouseEnter={(e) => {
                                                    if (!selectedUsers.includes(user.email)) {
                                                        e.currentTarget.style.backgroundColor = theme === 'dark' ? '#1f2937' : '#f9fafb';
                                                    }
                                                }}
                                                onMouseLeave={(e) => {
                                                    if (!selectedUsers.includes(user.email)) {
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
                                                {selectedUsers.includes(user.email) && (
                                                    <div className="w-5 h-5 rounded bg-blue-500 flex items-center justify-center">
                                                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                                            <path d="M10 3L4.5 8.5L2 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
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

                    {error && (
                        <p className="text-sm mb-4" style={{ color: '#ef4444' }}>
                            {error}
                        </p>
                    )}
                    {/* Role Dropdown */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium mb-2" style={{ color: colors.text }}>
                            Role <span style={{ color: '#ef4444' }}>*</span>
                        </label>
                        <div className="relative">
                            <button
                                type="button"
                                onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
                                className="w-full px-4 py-2 rounded-lg flex items-center justify-between transition-colors"
                                style={{
                                    backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff',
                                    border: `1px solid ${colors.border}`,
                                    color: colors.text
                                }}
                            >
                                <span>{roles.find(r => r.value === role)?.label || 'Select role'}</span>
                                <ChevronDown size={18} />
                            </button>

                            {isRoleDropdownOpen && (
                                <div
                                    className="absolute z-10 w-full mt-2 rounded-lg shadow-lg"
                                    style={{
                                        backgroundColor: colors.background,
                                        border: `1px solid ${colors.border}`,
                                        maxHeight: '240px',
                                        overflowY: 'auto'
                                    }}
                                >
                                    {roles.map((roleOption) => (
                                        <button
                                            key={roleOption.value}
                                            type="button"
                                            onClick={() => {
                                                setRole(roleOption.value);
                                                setIsRoleDropdownOpen(false);
                                            }}
                                            className="w-full px-4 py-2 text-left hover:bg-opacity-50 transition-colors"
                                            style={{
                                                backgroundColor: role === roleOption.value
                                                    ? (theme === 'dark' ? '#374151' : '#e5e7eb')
                                                    : 'transparent',
                                                color: colors.text
                                            }}
                                            onMouseEnter={(e) => {
                                                if (role !== roleOption.value) {
                                                    e.currentTarget.style.backgroundColor = theme === 'dark' ? '#1f2937' : '#f9fafb';
                                                }
                                            }}
                                            onMouseLeave={(e) => {
                                                if (role !== roleOption.value) {
                                                    e.currentTarget.style.backgroundColor = 'transparent';
                                                }
                                            }}
                                        >
                                            {roleOption.label}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex items-center justify-end gap-3">
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
                            {loading ? 'Adding...' : 'Add'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddTeamMembersModal;