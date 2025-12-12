import React, { useState, useEffect } from 'react';
import { X, CheckSquare, Square } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const CreateRoleModal = ({ onClose, onCreate }) => {
    const { colors, theme } = useTheme();
    const [roleName, setRoleName] = useState('');
    const [availablePermissions, setAvailablePermissions] = useState([]);
    const [selectedPermIds, setSelectedPermIds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    
    useEffect(() => {
        const fetchPermissions = async () => {
            try {
                const token = localStorage.getItem('authToken');
                const response = await fetch(`${API_BASE_URL}/permissions/`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                
                if (!response.ok) throw new Error("Failed to fetch permissions");
                
                const data = await response.json();
                setAvailablePermissions(data);
            } catch (error) {
                console.log("Error fetching permissions:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPermissions();
    }, []);

    // Handle individual toggle
    const handlePermissionToggle = (id) => {
        setSelectedPermIds(prev => {
            if (prev.includes(id)) {
                return prev.filter(permId => permId !== id);
            } else {
                return [...prev, id];
            }
        });
    };

    // Handle Select All
    const handleSelectAll = () => {
        if (selectedPermIds.length === availablePermissions.length) {
            setSelectedPermIds([]); // Deselect all
        } else {
            const allIds = availablePermissions.map(p => p.id);
            setSelectedPermIds(allIds);
        }
    };

    const isAllSelected = availablePermissions.length > 0 && selectedPermIds.length === availablePermissions.length;

   
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!roleName.trim()) return;

        setSubmitting(true);

        try {
            const token = localStorage.getItem('authToken');
            const payload = {
                name: roleName,
                permission_ids: selectedPermIds
            };

            const response = await fetch(`${API_BASE_URL}/roles/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) throw new Error("Failed to create role");

            const data = await response.json();
            onCreate(data);
            onClose();
        } catch (error) {
            console.log("Error submitting role:", error);
            alert("Failed to create role");
        } finally {
            setSubmitting(false);
        }
    };

    const modalStyle = {
        backgroundColor: theme === 'dark' ? 'rgba(17, 24, 39, 0.95)' : 'rgba(255, 255, 255, 0.95)',
        color: colors.text,
        borderColor: colors.border
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm" onClick={onClose}>
            <div 
                className="w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden transition-all transform flex flex-col max-h-[85vh]"
                style={modalStyle}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-6 border-b shrink-0 flex justify-between items-center" style={{ borderColor: colors.border }}>
                    <h2 className="text-xl font-bold">Create New User Role</h2>
                    <button 
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                        style={{ color: colors.text }}
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>
                
                
                <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
                    
                  
                    <div className="p-6 pb-0 shrink-0">
                        <label htmlFor="roleName" className="block text-sm font-medium mb-2 opacity-80" style={{ color: colors.text }}>
                            Role Name
                        </label>
                        <input
                            type="text"
                            id="roleName"
                            value={roleName}
                            onChange={(e) => setRoleName(e.target.value)}
                            className="w-full px-4 py-2.5 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                            style={{
                                backgroundColor: theme === 'dark' ? 'rgba(55, 65, 81, 0.5)' : 'transparent',
                                borderColor: colors.border,
                                color: colors.text
                            }}
                            placeholder="e.g. Project Manager"
                            required
                        />
                    </div>
                    
                    {/* Permissions Section */}
                    <div className="flex-1 p-6 min-h-0 flex flex-col">
                        <div className="flex justify-between items-center mb-3 shrink-0">
                            <h3 className="font-medium flex items-center gap-2" style={{ color: colors.text }}>
                                Permissions
                                <span className="text-xs font-normal px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-500 border border-blue-500/20">
                                    {selectedPermIds.length} / {availablePermissions.length} selected
                                </span>
                            </h3>
                            <button
                                type="button"
                                onClick={handleSelectAll}
                                className="text-sm flex items-center font-medium hover:text-blue-500 transition-colors"
                                style={{ color: colors.text, opacity: 0.8 }}
                            >
                                {isAllSelected ? (
                                    <CheckSquare className="h-4 w-4 mr-1.5 text-blue-500" />
                                ) : (
                                    <Square className="h-4 w-4 mr-1.5" />
                                )}
                                Select All
                            </button>
                        </div>
                        
                      
                        <div 
                            className="flex-1 overflow-y-auto border rounded-xl p-2"
                            style={{ borderColor: colors.border, backgroundColor: theme === 'dark' ? 'rgba(0,0,0,0.1)' : 'rgba(0,0,0,0.02)' }}
                        >
                            {loading ? (
                                <div className="h-full flex items-center justify-center text-sm opacity-60">
                                    Loading permissions...
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                    {availablePermissions.map((perm) => (
                                        <label 
                                            key={perm.id}
                                            className={`flex items-start space-x-3 p-3 rounded-lg border transition-all cursor-pointer ${selectedPermIds.includes(perm.id) ? 'bg-blue-500/10 border-blue-500/50' : 'hover:bg-gray-500/5'}`}
                                            style={{ borderColor: selectedPermIds.includes(perm.id) ? '' : 'transparent' }}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={selectedPermIds.includes(perm.id)}
                                                onChange={() => handlePermissionToggle(perm.id)}
                                                className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 shrink-0"
                                            />
                                            <div className="flex flex-col">
                                                {/* CHANGED: Displaying codename instead of name */}
                                                <span className="text-sm font-medium font-mono" style={{ color: colors.text }}>
                                                    {perm.codename || perm.name}
                                                </span>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                    
                    {/* Fixed Footer */}
                    <div className="p-6 border-t shrink-0 flex justify-end space-x-3" style={{ borderColor: colors.border }}>
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2.5 rounded-lg border font-medium hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            style={{
                                color: colors.text,
                                borderColor: colors.border
                            }}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={submitting || loading}
                            className="px-6 py-2.5 bg-cyan-500 text-white font-bold rounded-lg hover:bg-cyan-400 transition-colors shadow-lg shadow-cyan-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {submitting ? 'Creating...' : 'Create Role'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateRoleModal;