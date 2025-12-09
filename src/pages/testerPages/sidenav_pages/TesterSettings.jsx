import React, { useState, useEffect } from 'react';

import { UserCog, LogOut, Shield, Bell, X, Save } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// --- EditProfileModal with Theme Integration ---
const EditProfileModal = ({ onClose, userData, onSave }) => {
    const { colors, theme } = useTheme(); // Hook usage inside modal
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (userData) {
            setFormData({
                first_name: userData.first_name || '',
                last_name: userData.last_name || '',
                email: userData.email || '',
                phone: userData.phone || null, 
            });
        }
    }, [userData]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        await onSave(formData);
        setLoading(false);
    };

    // Styles derived from Theme Context
    const modalBgStyle = {
        backgroundColor: theme === 'dark' ? 'rgba(17, 24, 39, 0.95)' : 'rgba(255, 255, 255, 0.95)',
        color: colors.text,
        borderColor: colors.border
    };

    const inputStyle = {
        backgroundColor: colors.background,
        color: colors.text,
        borderColor: colors.border
    };

    const labelClasses = "block text-sm font-semibold mb-1 opacity-80";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
            <div 
                className="backdrop-blur-xl border rounded-2xl shadow-[0_0_50px_-12px_rgba(6,182,212,0.5)] w-full max-w-md m-4 relative"
                style={modalBgStyle}
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: colors.border }}>
                    <div>
                        <h2 className="text-2xl font-bold" style={{ color: colors.text }}>Edit Your Profile</h2>
                        <p className="text-sm mt-1 opacity-70" style={{ color: colors.text }}>Update your personal details below.</p>
                    </div>
                    <button 
                        onClick={onClose} 
                        className="p-2 rounded-full transition-colors hover:bg-cyan-500/10 hover:text-cyan-500"
                        style={{ color: colors.text }}
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className={labelClasses} style={{ color: colors.text }}>First Name</label>
                            <input type="text" name="first_name" value={formData.first_name} onChange={handleInputChange} 
                                className="w-full rounded-lg p-3 outline-none focus:ring-2 focus:ring-cyan-400 border transition-all"
                                style={inputStyle} placeholder="First Name" 
                            />
                        </div>
                        <div>
                            <label className={labelClasses} style={{ color: colors.text }}>Last Name</label>
                            <input type="text" name="last_name" value={formData.last_name} onChange={handleInputChange} 
                                className="w-full rounded-lg p-3 outline-none focus:ring-2 focus:ring-cyan-400 border transition-all"
                                style={inputStyle} placeholder="Last Name" 
                            />
                        </div>
                    </div>
                    <div>
                        <label className={labelClasses} style={{ color: colors.text }}>Email Address</label>
                        <input type="email" name="email" value={formData.email} onChange={handleInputChange} 
                            className="w-full rounded-lg p-3 outline-none focus:ring-2 focus:ring-cyan-400 border transition-all"
                            style={inputStyle} placeholder="john@example.com" 
                        />
                    </div>
                    <div>
                        <label className={labelClasses} style={{ color: colors.text }}>Phone Number</label>
                        <input type="tel" name="phone" value={formData.phone || ''} onChange={handleInputChange} 
                            className="w-full rounded-lg p-3 outline-none focus:ring-2 focus:ring-cyan-400 border transition-all"
                            style={inputStyle} placeholder="+1 234 567 890" 
                        />
                    </div>
                    
                    {error && <p className="text-red-500 text-sm text-center font-medium bg-red-500/10 p-2 rounded-lg border border-red-500/20">{error}</p>}
                    
                    <div className="flex justify-end gap-3 pt-2">
                        <button 
                            type="button" 
                            onClick={onClose} 
                            className="px-5 py-2.5 rounded-lg font-semibold transition-colors hover:opacity-80"
                            style={{ color: colors.text, backgroundColor: colors.background }}
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            disabled={loading} 
                            className="px-6 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-white font-bold rounded-lg shadow-lg shadow-cyan-500/30 flex items-center gap-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Saving...' : <><Save size={18} /> Save Changes</>}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// --- Main Settings Component ---
const TesterSettings = () => {
    const [showEditModal, setShowEditModal] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [loadingUser, setLoadingUser] = useState(true);
    const { theme, toggleTheme, colors } = useTheme();

    useEffect(() => {
        const fetchUserData = async () => {
            const userId = localStorage.getItem('userId'); 
            const authToken = localStorage.getItem('authToken');

            if (!userId || !authToken) {
                console.error("User ID or Auth Token not found.");
                setLoadingUser(false);
                return;
            }

            try {
                const response = await fetch(`${API_BASE_URL}/users/me/`, {
                    headers: { 'Authorization': `Bearer ${authToken}` }
                });
                if (!response.ok) throw new Error("Could not fetch user data.");
                const data = await response.json();
                setCurrentUser(data);
            } catch (error) {
                console.error("Error fetching user data:", error);
            } finally {
                setLoadingUser(false);
            }
        };

        fetchUserData();
    }, []);

    const handleUpdateUser = async (updatedData) => {
        const userId = localStorage.getItem('userId'); 
        const authToken = localStorage.getItem('authToken');

        try {
            const response = await fetch(`${API_BASE_URL}/users/${userId}/`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`,
                },
                body: JSON.stringify({ ...currentUser, ...updatedData })
            });

            if (!response.ok) throw new Error("Failed to update profile.");

            const savedUser = await response.json();
            setCurrentUser(savedUser); 
            setShowEditModal(false); 

        } catch (error) {
            console.error("Update error:", error);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userId'); 
        window.location.href = '/login';
    };

    const settingCards = [
        { title: "Edit Profile", description: "Update your personal details.", icon: UserCog, color: "bg-blue-100", action: () => setShowEditModal(true), disabled: loadingUser },
        { title: "Manage Permissions", description: "Control user roles and access.", icon: Shield, color: "bg-yellow-100", action: () => alert("Feature coming soon!") },
        { title: "Notifications", description: "Set your alert preferences.", icon: Bell, color: "bg-green-100", action: () => alert("Feature coming soon!") },
        { title: "Logout", description: "Sign out of your account.", icon: LogOut, color: "bg-red-100", action: handleLogout },
    ];

    return (
        <>
            <div className="min-h-screen p-8 transition-colors duration-300" style={{
            backgroundColor: colors.background,
            color: colors.text,
            borderColor: colors.border
          }}>
                <h1 className="text-3xl font-bold" style={{ color: colors.text }}>Settings</h1>
                <p className="mt-1" style={{ color: colors.text, opacity: 0.8 }}>Manage your account settings and preferences.</p>
            
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8" >
                    {settingCards.map((card, index) => (
                        <div 
                            key={index} 
                            className={`${card.color} p-6 rounded-xl shadow-md cursor-pointer transition-transform hover:-translate-y-1 ${card.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                            onClick={!card.disabled ? card.action : undefined}
                        >
                            <card.icon className="h-8 w-8 text-gray-700 mb-3" />
                            <h3 className="text-xl font-semibold text-gray-900">{card.title}</h3>
                            <p className="text-gray-600 mt-1">{card.description}</p>
                        </div>
                    ))}
                </div>
            </div>

            {showEditModal && currentUser && (
                <EditProfileModal 
                    onClose={() => setShowEditModal(false)}
                    userData={currentUser}
                    onSave={handleUpdateUser}
                />
            )}
        </>
    );
};

export default TesterSettings;