import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { X } from 'lucide-react';

const TeamSettingsModal = ({ isOpen, onClose, team, onTeamUpdated }) => {
    const { theme, colors } = useTheme();
    const [formData, setFormData] = useState({
        name: '',
        about: ''
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (team) {
            setFormData({
                name: team.name || '',
                about: team.about || ''
            });
        }
    }, [team]);

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

            const response = await fetch(`http://localhost:8000/api/teams/${team.id}/`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`,
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                const data = await response.json();
                onTeamUpdated(data);
                handleClose();
            } else {
                const errorData = await response.json();
                setErrors({ submit: errorData.error || 'Failed to update team settings' });
            }
        } catch (error) {
            console.error("Error updating team:", error);
            alert('Failed to update team settings. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
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
                }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div 
                    className="flex items-center justify-between p-6 border-b"
                    style={{ borderColor: colors.border }}
                >
                    <h2 className="text-xl font-semibold" style={{ color: colors.text }}>
                        Team settings
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
                    <p className="text-sm mb-6" style={{ color: theme === 'dark' ? '#9ca3af' : '#6b7280' }}>
                        Required fields are marked with an asterisk *
                    </p>

                    {/* Team Name */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium mb-2" style={{ color: colors.text }}>
                            Team name <span style={{ color: '#ef4444' }}>*</span>
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

                    {/* Team Description */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium mb-2" style={{ color: colors.text }}>
                            Team description
                        </label>
                        <textarea
                            name="about"
                            value={formData.about}
                            onChange={handleInputChange}
                            rows={4}
                            className="w-full px-4 py-2 rounded-lg outline-none transition-colors resize-none"
                            style={{
                                backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff',
                                border: `1px solid ${colors.border}`,
                                color: colors.text
                            }}
                            placeholder="Enter team description"
                        />
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
                            {loading ? 'Saving...' : 'Save'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TeamSettingsModal;