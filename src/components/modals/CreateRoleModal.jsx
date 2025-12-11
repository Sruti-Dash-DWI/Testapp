import React, { useState } from 'react';
import { X, CheckSquare, Square } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const CreateRoleModal = ({ onClose, onCreate }) => {
    const { colors, theme } = useTheme();
    const [roleName, setRoleName] = useState('');
    const [permissions, setPermissions] = useState({
        readUsers: false,
        createUsers: false,
        editUsers: false,
        deleteUsers: false,
        readRoles: false,
        createRoles: false,
        editRoles: false
    });
    const [selectAll, setSelectAll] = useState(false);

    const handlePermissionChange = (permission) => {
        const newPermissions = {
            ...permissions,
            [permission]: !permissions[permission]
        };
        setPermissions(newPermissions);
        
        // Update select all state
        const allSelected = Object.values(newPermissions).every(val => val);
        setSelectAll(allSelected);
    };

    const handleSelectAll = () => {
        const newSelectAll = !selectAll;
        setSelectAll(newSelectAll);
        
        const newPermissions = {};
        Object.keys(permissions).forEach(key => {
            newPermissions[key] = newSelectAll;
        });
        setPermissions(newPermissions);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!roleName.trim()) return;
        
        const selectedPermissions = Object.entries(permissions)
            .filter(([_, value]) => value)
            .map(([key]) => key);
            
        onCreate({
            name: roleName,
            permissions: selectedPermissions
        });
        
        onClose();
    };

    const modalStyle = {
        backgroundColor: theme === 'dark' ? 'rgba(17, 24, 39, 0.95)' : 'rgba(255, 255, 255, 0.95)',
        color: colors.text,
        borderColor: colors.border
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div 
                className="w-full max-w-md rounded-xl shadow-2xl overflow-hidden transition-all transform"
                style={modalStyle}
            >
                <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold">Create New User Role</h2>
                        <button 
                            onClick={onClose}
                            className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                            style={{ color: colors.text }}
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>
                    
                    <form onSubmit={handleSubmit}>
                        <div className="mb-6">
                            <label htmlFor="roleName" className="block text-sm font-medium mb-2" style={{ color: colors.text }}>
                                Role Name
                            </label>
                            <input
                                type="text"
                                id="roleName"
                                value={roleName}
                                onChange={(e) => setRoleName(e.target.value)}
                                className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                style={{
                                    backgroundColor: theme === 'dark' ? 'rgba(55, 65, 81, 0.5)' : 'white',
                                    borderColor: colors.border,
                                    color: colors.text
                                }}
                                placeholder="Enter role name"
                                required
                            />
                        </div>
                        
                        <div className="mb-6">
                            <div className="flex justify-between items-center mb-3">
                                <h3 className="font-medium" style={{ color: colors.text }}>Permissions</h3>
                                <button
                                    type="button"
                                    onClick={handleSelectAll}
                                    className="text-sm flex items-center text-gray-700 hover:text-blue-600 transition-colors"
                                >
                                    {selectAll ? (
                                        <CheckSquare className="h-4 w-4 mr-1" />
                                    ) : (
                                        <Square className="h-4 w-4 mr-1" />
                                    )}
                                    Select All
                                </button>
                            </div>
                            
                            <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                                <label className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                    <input
                                        type="checkbox"
                                        checked={permissions.readUsers}
                                        onChange={() => handlePermissionChange('readUsers')}
                                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    />
                                    <span className="text-sm" style={{ color: colors.text }}>Read Users</span>
                                </label>
                                
                                <label className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                    <input
                                        type="checkbox"
                                        checked={permissions.createUsers}
                                        onChange={() => handlePermissionChange('createUsers')}
                                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    />
                                    <span className="text-sm" style={{ color: colors.text }}>Create Users</span>
                                </label>
                                
                                <label className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                    <input
                                        type="checkbox"
                                        checked={permissions.editUsers}
                                        onChange={() => handlePermissionChange('editUsers')}
                                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    />
                                    <span className="text-sm" style={{ color: colors.text }}>Edit Users</span>
                                </label>
                                
                                <label className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                    <input
                                        type="checkbox"
                                        checked={permissions.deleteUsers}
                                        onChange={() => handlePermissionChange('deleteUsers')}
                                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    />
                                    <span className="text-sm" style={{ color: colors.text }}>Delete Users</span>
                                </label>
                                
                                <label className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                    <input
                                        type="checkbox"
                                        checked={permissions.readRoles}
                                        onChange={() => handlePermissionChange('readRoles')}
                                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    />
                                    <span className="text-sm" style={{ color: colors.text }}>Read Roles</span>
                                </label>
                                
                                <label className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                    <input
                                        type="checkbox"
                                        checked={permissions.createRoles}
                                        onChange={() => handlePermissionChange('createRoles')}
                                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    />
                                    <span className="text-sm" style={{ color: colors.text }}>Create Roles</span>
                                </label>
                                
                                <label className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                    <input
                                        type="checkbox"
                                        checked={permissions.editRoles}
                                        onChange={() => handlePermissionChange('editRoles')}
                                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    />
                                    <span className="text-sm" style={{ color: colors.text }}>Edit Roles</span>
                                </label>
                            </div>
                        </div>
                        
                        <div className="flex justify-end space-x-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                style={{
                                    color: colors.text,
                                    borderColor: colors.border
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Create Role
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateRoleModal;
