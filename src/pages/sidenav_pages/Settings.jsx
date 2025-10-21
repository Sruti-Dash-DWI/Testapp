import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../layout/DashboardLayout';
import { UserCog, LogOut, Shield, Bell, X } from 'lucide-react';


const EditProfileModal = ({ onClose, userData, onSave }) => {
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

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md" onClick={onClose}>
            <div 
                className="rounded-2xl shadow-2xl w-full max-w-md m-4 text-gray-800"
                style={{ background: "linear-gradient(135deg, #ad97fd 0%, #f6a5dc 100%)" }}
                onClick={e => e.stopPropagation()}
            >
                <div className="flex items-center justify-between p-5 border-b border-white/30">
                    <h2 className="text-2xl font-bold text-gray-900">Edit Your Profile</h2>
                    <button onClick={onClose} className="p-2 rounded-full text-gray-700 hover:bg-white/30 transition-colors">
                        <X size={24} />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                            <input type="text" name="first_name" value={formData.first_name} onChange={handleInputChange} className="w-full bg-white/50 text-gray-900 border-white/30 rounded-md p-2 focus:ring-2 focus:ring-indigo-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                            <input type="text" name="last_name" value={formData.last_name} onChange={handleInputChange} className="w-full bg-white/50 text-gray-900 border-white/30 rounded-md p-2 focus:ring-2 focus:ring-indigo-500" />
                        </div>
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                        <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full bg-white/50 text-gray-900 border-white/30 rounded-md p-2 focus:ring-2 focus:ring-indigo-500" />
                    </div>
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                        <input type="tel" name="phone" value={formData.phone || ''} onChange={handleInputChange} className="w-full bg-white/50 text-gray-900 border-white/30 rounded-md p-2 focus:ring-2 focus:ring-indigo-500" />
                    </div>
                    {error && <p className="text-red-700 text-sm text-center mb-4">{error}</p>}
                    <div className="flex justify-end gap-4">
                        <button type="button" onClick={onClose} className="px-5 py-2 bg-white/40 hover:bg-white/70 rounded-md font-semibold">Cancel</button>
                        <button type="submit" disabled={loading} className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-md flex items-center disabled:opacity-70">
                            {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};



const Settings = () => {
    const [showEditModal, setShowEditModal] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [loadingUser, setLoadingUser] = useState(true);

    
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
                const response = await fetch(`http://localhost:8000/api/admin/users/${userId}/`, {
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
            const response = await fetch(`http://localhost:8000/api/admin/users/${userId}/`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`,
                },
                // Send only changed fields along with the full user object
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
            <div className="p-8">
                <h1 className="text-3xl font-bold text-gray-800">Settings</h1>
                <p className="mt-1 text-gray-600">Manage your account settings and preferences.</p>
            
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
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

export default Settings;

