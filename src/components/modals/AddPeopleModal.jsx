import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { X, MoreHorizontal, ChevronDown } from 'lucide-react';

const AddPeopleModal = ({ isOpen, onClose, onPeopleAdded }) => {
    const { theme, colors } = useTheme();
    const [email, setEmail] = useState('');
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

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!email.trim()) {
            setError('Email is required');
            return;
        }

        if (!validateEmail(email)) {
            setError('Please enter a valid email address');
            return;
        }

        setLoading(true);
        try {
            const authToken = localStorage.getItem('authToken');
            if (!authToken) {
                setError('Authentication token not found');
                return;
            }

            const response = await fetch('http://localhost:8000/api/users/invite/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`,
                },
                body: JSON.stringify({
                    email: email.trim(),
                    role: role
                })
            });

            if (response.ok) {
                const data = await response.json();
                onPeopleAdded();
                handleClose();
                alert(`Invitation sent successfully to ${email}`);
            } else {
                const errorData = await response.json();
                setError(errorData.error || 'Failed to send invitation');
            }
        } catch (error) {
            console.error("Error inviting user:", error);
            setError('Failed to send invitation. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setEmail('');
        setRole('MANAGER');
        setError('');
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
                }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div 
                    className="flex items-center justify-between p-6 border-b"
                    style={{ borderColor: colors.border }}
                >
                    <h2 className="text-xl font-semibold" style={{ color: colors.text }}>
                        Add people to TestApp
                    </h2>
                    <div className="flex items-center gap-2">
                        {/* <button
                            className="p-1 rounded-lg transition-colors"
                            style={{ color: colors.text }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = theme === 'dark' ? '#374151' : '#f3f4f6';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = 'transparent';
                            }}
                        >
                            <MoreHorizontal size={20} />
                        </button> */}
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
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6">
                    {/* Email Input */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium mb-2" style={{ color: colors.text }}>
                            Names or emails <span style={{ color: '#ef4444' }}>*</span>
                        </label>
                        <input
                            type="text"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                setError('');
                            }}
                            placeholder="e.g., Maria, maria@gmail.com"
                            className="w-full px-4 py-2 rounded-lg outline-none transition-colors"
                            style={{
                                backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff',
                                border: `1px solid ${error ? '#ef4444' : colors.border}`,
                                color: colors.text
                            }}
                        />
                        {error && (
                            <p className="text-sm mt-1" style={{ color: '#ef4444' }}>
                                {error}
                            </p>
                        )}
                    </div>

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

export default AddPeopleModal;