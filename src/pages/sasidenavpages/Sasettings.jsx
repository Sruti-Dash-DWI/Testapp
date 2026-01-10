import React, { useState, useEffect } from 'react';
import { UserCog, Shield, X, Save, Plus, CheckCircle, Circle, User, Trash2 } from 'lucide-react';
import CreateRoleModal from '../../components/modals/CreateRoleModal';
import { useTheme } from '../../context/ThemeContext';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


const EditProfileModal = ({ onClose, userData, onSave }) => {
    const { colors, theme } = useTheme(); 
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


const UserPermissionsModal = ({ onClose, targetUser }) => {
    const { colors, theme } = useTheme();
    const [assignedPerms, setAssignedPerms] = useState([]);
    const [unassignedPerms, setUnassignedPerms] = useState([]);
    const [roleDetails, setRoleDetails] = useState(null);
    const [loading, setLoading] = useState(true);

    const modalBgStyle = {
        backgroundColor: theme === 'dark' ? 'rgba(17, 24, 39, 0.95)' : 'rgba(255, 255, 255, 0.95)',
        color: colors.text,
        borderColor: colors.border
    };

    const getHeaders = () => {
        const token = localStorage.getItem('authToken');
        return {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        };
    };

   
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                
                const permsResponse = await fetch(`${API_BASE_URL}/permissions/`, {
                    headers: getHeaders()
                });
                const allPermissions = await permsResponse.json();

                // Fetch Role Details to see current permissions (Using filter by name)
                let roleData = null;
                let currentRolePerms = [];

                if (targetUser.role) {
                    const roleResponse = await fetch(`${API_BASE_URL}/roles/by-name/?name=${targetUser.role}`, {
                        headers: getHeaders()
                    });
                    
                    if (roleResponse.ok) {
                        roleData = await roleResponse.json();
                        setRoleDetails(roleData);
                        currentRolePerms = roleData.permissions || [];
                    } else {
                        console.log(`Role ${targetUser.role} not found via API`);
                    }
                }

               
                const assignedIds = currentRolePerms.map(p => p.id);
                
                const assigned = allPermissions.filter(p => assignedIds.includes(p.id));
                const unassigned = allPermissions.filter(p => !assignedIds.includes(p.id));

                setAssignedPerms(assigned);
                setUnassignedPerms(unassigned);

            } catch (err) {
                console.log("Error loading permission data", err);
            } finally {
                setLoading(false);
            }
        };

        if (targetUser) fetchData();
    }, [targetUser]);

    
    const updateRolePermissions = async (newPermissionIds) => {
        if (!roleDetails || !roleDetails.id) {
            console.log("Cannot update: Role ID missing");
            return;
        }

        try {
            const payload = {
                name: roleDetails.name,
                permission_ids: newPermissionIds
            };

            const response = await fetch(`${API_BASE_URL}/roles/${roleDetails.id}/`, {
                method: 'PATCH',
                headers: getHeaders(),
                body: JSON.stringify(payload)
            });

            if (!response.ok) throw new Error("Failed to update role permissions");
            const data = await response.json();
            console.log("Role Updated via PATCH:", data);

        } catch (error) {
            console.log("Error patching role:", error);
           
        }
    };

    
    const handleAddPermission = async (permission) => {
      
        const newAssigned = [...assignedPerms, permission];
        const newUnassigned = unassignedPerms.filter(p => p.id !== permission.id);
        
        setAssignedPerms(newAssigned);
        setUnassignedPerms(newUnassigned);

       
        const newIds = newAssigned.map(p => p.id);
        await updateRolePermissions(newIds);
    };

    
    const handleRemovePermission = async (permission) => {
     
        const newAssigned = assignedPerms.filter(p => p.id !== permission.id);
        const newUnassigned = [...unassignedPerms, permission];

        setAssignedPerms(newAssigned);
        setUnassignedPerms(newUnassigned);

       
        const newIds = newAssigned.map(p => p.id);
        await updateRolePermissions(newIds);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
            <div 
                className="backdrop-blur-xl border rounded-2xl shadow-xl w-full max-w-3xl m-4 relative flex flex-col max-h-[90vh]"
                style={modalBgStyle}
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b shrink-0" style={{ borderColor: colors.border }}>
                    <div>
                        <h2 className="text-2xl font-bold">Manage User Permissions</h2>
                        <div className="mt-1 opacity-80 text-sm flex gap-4">
                            <span>User: <strong>{targetUser.first_name} {targetUser.last_name}</strong></span>
                            <span>Role: <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-500 text-xs uppercase font-bold">{targetUser.role || 'User'}</span></span>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-500/10">
                        <X size={24} />
                    </button>
                </div>

              
                <div className="p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-8">
                    {loading ? (
                        <div className="col-span-2 text-center py-10">Loading permissions...</div>
                    ) : (
                        <>
                            
                            <div className="flex flex-col gap-3">
                                <h3 className="text-lg font-semibold flex items-center gap-2 text-green-500 border-b pb-2" style={{borderColor: colors.border}}>
                                    <Shield size={18} /> Assigned Permissions ({assignedPerms.length})
                                </h3>
                                
                                <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
                                    {assignedPerms.length === 0 ? (
                                        <p className="opacity-50 text-sm italic py-4 text-center">No permissions assigned.</p>
                                    ) : (
                                        assignedPerms.map(perm => (
                                            <button 
                                                key={perm.id} 
                                                onClick={() => handleRemovePermission(perm)}
                                                className="w-full p-3 rounded-lg border flex items-center justify-between gap-3 group transition-all hover:bg-red-500/10 hover:border-red-500/30 text-left"
                                                style={{ backgroundColor: 'rgba(34, 197, 94, 0.05)', borderColor: 'rgba(34, 197, 94, 0.2)' }}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <CheckCircle size={18} className="text-green-500 group-hover:hidden" />
                                                    <Trash2 size={18} className="text-red-500 hidden group-hover:block" />
                                                    <span className="font-medium text-sm">{perm.name}</span>
                                                </div>
                                                <span className="text-xs text-red-500 opacity-0 group-hover:opacity-100 font-bold uppercase">Remove</span>
                                            </button>
                                        ))
                                    )}
                                </div>
                            </div>

                           
                            <div className="flex flex-col gap-3">
                                <h3 className="text-lg font-semibold flex items-center gap-2 opacity-80 border-b pb-2" style={{borderColor: colors.border}}>
                                    <Circle size={18} /> Available Permissions ({unassignedPerms.length})
                                </h3>
                                
                                <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
                                    {unassignedPerms.length === 0 ? (
                                        <p className="opacity-50 text-sm italic py-4 text-center">All permissions assigned.</p>
                                    ) : (
                                        unassignedPerms.map(perm => (
                                            <button 
                                                key={perm.id} 
                                                onClick={() => handleAddPermission(perm)}
                                                className="w-full p-3 rounded-lg border flex items-center gap-3 transition-all hover:bg-cyan-500/10 hover:border-cyan-500 hover:shadow-md text-left group"
                                                style={{ borderColor: colors.border }}
                                            >
                                                <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center group-hover:border-cyan-500 transition-colors" style={{ borderColor: colors.text, opacity: 0.4 }}>
                                                    <Plus size={12} className="opacity-0 group-hover:opacity-100 text-cyan-500" />
                                                </div>
                                                <span className="font-medium text-sm opacity-80 group-hover:opacity-100 group-hover:text-cyan-500">{perm.name}</span>
                                            </button>
                                        ))
                                    )}
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};


const ManageUsersModal = ({ onClose, onCreateRoleClick, onManageUserClick }) => {
    const { colors, theme } = useTheme();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const modalBgStyle = {
        backgroundColor: theme === 'dark' ? 'rgba(17, 24, 39, 0.95)' : 'rgba(255, 255, 255, 0.95)',
        color: colors.text,
        borderColor: colors.border
    };

    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem('authToken');
                const response = await fetch(`${API_BASE_URL}/users/`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                
                if (!response.ok) throw new Error("Failed to fetch users");
                
                const data = await response.json();
                console.log("Fetched Users:", data);
                setUsers(data);
            } catch (err) {
                console.log("Error fetching users", err);
               
                // setUsers([
                //     { id: 1, first_name: 'Jhasketan', last_name: 'S', email: 'jhasketan@example.com', role: 'Super Admin' },
                //     { id: 2, first_name: 'Jeemut', last_name: 'V', email: 'jeemut@test.com', role: 'Manager' },
                //     { id: 3, first_name: 'Sruti', last_name: 'Das', email: 'sruti@demo.com', role: 'Editor' },
                // ]);
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
            <div 
                className="backdrop-blur-xl border rounded-2xl shadow-xl w-full max-w-4xl m-4 relative flex flex-col max-h-[85vh]"
                style={modalBgStyle}
                onClick={e => e.stopPropagation()}
            >
               
                <div className="flex items-center justify-between p-6 border-b shrink-0" style={{ borderColor: colors.border }}>
                    <div>
                        <h2 className="text-2xl font-bold">User Management</h2>
                        <p className="text-sm mt-1 opacity-70">Manage users, roles, and assign specific permissions.</p>
                    </div>
                    <div className="flex gap-3">
                        {/* <button 
                            onClick={() => { onClose(); onCreateRoleClick(); }} 
                            className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-white font-bold rounded-lg shadow-lg shadow-cyan-500/30 flex items-center gap-2 transition-all"
                        >
                            <Plus size={18} /> Create New Role
                        </button> */}
                        <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-500/10">
                            <X size={24} />
                        </button>
                    </div>
                </div>

                
                <div className="p-6 overflow-y-auto">
                    {loading ? (
                        <div className="text-center py-10 opacity-70">Loading users...</div>
                    ) : (
                        <div className="border rounded-xl overflow-hidden" style={{ borderColor: colors.border }}>
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-gray-500/5">
                                    <tr>
                                        <th className="p-4 font-semibold text-sm opacity-80">User</th>
                                        <th className="p-4 font-semibold text-sm opacity-80">Email</th>
                                        <th className="p-4 font-semibold text-sm opacity-80">Role</th>
                                        <th className="p-4 font-semibold text-sm opacity-80 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y" style={{ divideColor: colors.border }}>
                                    {users.map(user => (
                                        <tr key={user.id} className="hover:bg-gray-500/5 transition-colors">
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-500">
                                                        <User size={16} />
                                                    </div>
                                                    <span className="font-medium">{user.first_name || 'User'} {user.last_name}</span>
                                                </div>
                                            </td>
                                            <td className="p-4 opacity-80">{user.email}</td>
                                            <td className="p-4">
                                                <span className="px-2 py-1 rounded text-xs font-bold uppercase bg-gray-500/10 opacity-80 border border-gray-500/20">
                                                    {user.role || 'No Role'}
                                                </span>
                                            </td>
                                            <td className="p-4 text-right">
                                                <button 
                                                    onClick={() => { onClose(); onManageUserClick(user); }}
                                                    className="px-3 py-1.5 text-sm font-medium rounded-lg bg-cyan-500/10 text-cyan-500 hover:bg-cyan-500 hover:text-white transition-all"
                                                >
                                                    Manage
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};


const Sasettings = () => {
    const [showEditModal, setShowEditModal] = useState(false);
    
   
    const [showManageUsersModal, setShowManageUsersModal] = useState(false);
    const [showCreateRoleModal, setShowCreateRoleModal] = useState(false);
    const [selectedUserForPermissions, setSelectedUserForPermissions] = useState(null);

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
                const response = await fetch(`${API_BASE_URL}/admin/users/${userId}/`, {
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
            const response = await fetch(`${API_BASE_URL}/admin/users/${userId}/`, {
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

    const handleCreateRole = (roleData) => {
        console.log('New role created:', roleData);
       
        setShowManageUsersModal(true);
    };

    const settingCards = [
        { 
            title: "Edit Profile", 
            description: "Update your personal details.", 
            icon: UserCog, 
            color: "bg-blue-100", 
            action: () => setShowEditModal(true), 
            disabled: loadingUser 
        },
        { 
            title: "Manage Permissions", 
            description: "Control user roles and access.", 
            icon: Shield, 
            color: "bg-yellow-100", 
            action: () => setShowManageUsersModal(true) // Opens the User List first
        },
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
            
            
            {showManageUsersModal && (
                <ManageUsersModal 
                    onClose={() => setShowManageUsersModal(false)}
                    onCreateRoleClick={() => setShowCreateRoleModal(true)}
                    onManageUserClick={(user) => setSelectedUserForPermissions(user)}
                />
            )}

            {/* 2. Create Role Modal (Triggered from Manage Users) */}
            {showCreateRoleModal && (
                <CreateRoleModal
                    onClose={() => {
                        setShowCreateRoleModal(false);
                        setShowManageUsersModal(true); // Return to user list on close
                    }}
                    onCreate={handleCreateRole}
                />
            )}

         
            {selectedUserForPermissions && (
                <UserPermissionsModal 
                    targetUser={selectedUserForPermissions}
                    onClose={() => {
                        setSelectedUserForPermissions(null);
                        setShowManageUsersModal(true);
                    }}
                />
            )}
        </>
    );
};

export default Sasettings;