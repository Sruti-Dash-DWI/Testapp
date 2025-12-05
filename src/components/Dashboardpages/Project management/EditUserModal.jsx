// src/components/Dashboardpages/Project management/EditUserModal.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Trash2 } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext'; // Adjusted path based on folder structure

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const EditUserModal = ({ member, onClose, onUpdate, onDeleteSuccess }) => { 
    if (!member) return null;

    const { colors, theme } = useTheme(); // Access theme colors
    const [formData, setFormData] = useState({ ...member });
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState(null);
    const [confirmingDelete, setConfirmingDelete] = useState(false);

    useEffect(() => {
        setFormData({ ...member });
        setConfirmingDelete(false); 
    }, [member]);

    const [debouncedFormData, setDebouncedFormData] = useState(formData);
    useEffect(() => {
        const handler = setTimeout(() => setDebouncedFormData(formData), 750);
        return () => clearTimeout(handler);
    }, [formData]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const autoSave = useCallback(async (dataToSave) => {
        try {
            const authToken = localStorage.getItem('authToken');
            const response = await fetch(`${API_BASE_URL}/users/${member.id}/`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authToken}` },
                body: JSON.stringify(dataToSave)
            });
            if (!response.ok) throw new Error('Failed to auto-save.');
            
            const updatedMember = await response.json();
            onUpdate(updatedMember);
        } catch (err) {
            console.error("Auto-save failed:", err);
        }
    }, [member.id, onUpdate]);

    useEffect(() => {
        if (JSON.stringify(debouncedFormData) !== JSON.stringify(member)) {
            autoSave(debouncedFormData);
        }
    }, [debouncedFormData, member, autoSave]);

    const handleFinalSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        setError(null);
        let wasSuccessful = false;
    
        try {
            const authToken = localStorage.getItem('authToken');
            const payload = {
                email: formData.email,
                first_name: formData.first_name,
                last_name: formData.last_name,
                role: formData.role,
                phone: formData.phone,
            };
    
            const response = await fetch(`${API_BASE_URL}/users/${member.id}/`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authToken}` },
                body: JSON.stringify(payload)
            });
            if (!response.ok) throw new Error('Failed to save changes.');
    
            const updatedMember = await response.json();
            onUpdate(updatedMember);
            wasSuccessful = true;
        } catch (err) {
            setError(err.message);
        } finally {
            setIsSaving(false);
        }
    
        if (wasSuccessful) {
            onClose();
        }
    };
    
    const handleDelete = async () => {
        if (!confirmingDelete) {
            setConfirmingDelete(true);
            setTimeout(() => setConfirmingDelete(false), 3000); 
            return;
        }

        setIsSaving(true);
        try {
            const authToken = localStorage.getItem('authToken');
            const response = await fetch(`${API_BASE_URL}/user/${member.id}/delete/`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${authToken}` },
            });

            if (response.status === 204 || response.ok) {
               onDeleteSuccess(member.id);
               await new Promise(resolve => setTimeout(resolve, 300)); 
               window.dispatchEvent(new Event('teamMemberDeleted'));
               onClose();

            } else {
                 throw new Error('Failed to delete user.');
            }
        } catch (err) {
            setError(err.message);
            setIsSaving(false);
        }
    };

    const backdropVariants = { visible: { opacity: 1 }, hidden: { opacity: 0 } };
    const modalVariants = {
        hidden: { scale: 0.9, opacity: 0 },
        visible: { scale: 1, opacity: 1, transition: { type: "spring", stiffness: 150, damping: 20 } },
        exit: { scale: 0.9, opacity: 0, transition: { duration: 0.2 } }
    };

    // Dynamic Input Styles
    const inputStyle = {
        backgroundColor: colors.background,
        color: colors.text,
        borderColor: colors.border,
    };

    return (
        <AnimatePresence>
            {member && (
                <motion.div className="fixed inset-0 z-50 flex justify-center items-center p-4 bg-black/50 backdrop-blur-sm" variants={backdropVariants} initial="hidden" animate="visible" exit="hidden" onClick={onClose}>
                    <motion.div className="w-full max-w-lg" variants={modalVariants} initial="hidden" animate="visible" exit="exit" onClick={(e) => e.stopPropagation()}>
                        
                        {/* Main Modal Card with Dynamic Theme Colors */}
                        <div 
                            className="backdrop-blur-xl border rounded-2xl shadow-[0_0_50px_-12px_rgba(6,182,212,0.5)] relative p-10"
                            style={{ 
                                backgroundColor: theme === 'dark' ? 'rgba(17, 24, 39, 0.9)' : 'rgba(255, 255, 255, 0.95)', 
                                borderColor: colors.border,
                                color: colors.text
                            }}
                        >
                            
                            <div className="flex justify-between items-start mb-8">
                                <div>
                                    <h2 className="text-3xl font-bold" style={{ color: colors.text }}>Edit Team Member</h2>
                                    <p className="mt-2 font-medium opacity-70" style={{ color: colors.text }}>Update the details for the user.</p>
                                </div>
                                <motion.button 
                                    onClick={onClose} 
                                    className="p-2 rounded-full transition-colors"
                                    style={{ color: colors.text }}
                                    whileHover={{ scale: 1.1, backgroundColor: colors.border }} 
                                    whileTap={{ scale: 0.9 }}
                                > 
                                    <X /> 
                                </motion.button>
                            </div>

                            <form onSubmit={handleFinalSubmit} className="space-y-6">
                                {/* Inputs using inline styles for dynamic theme */}
                                <input type="text" name="first_name" value={formData.first_name} onChange={handleInputChange} placeholder="First Name" 
                                    className="w-full rounded-lg p-3 outline-none focus:ring-2 focus:ring-cyan-400 border transition-all"
                                    style={inputStyle}
                                />
                                <input type="text" name="last_name" value={formData.last_name} onChange={handleInputChange} placeholder="Last Name" 
                                    className="w-full rounded-lg p-3 outline-none focus:ring-2 focus:ring-cyan-400 border transition-all"
                                    style={inputStyle}
                                />
                                <input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="Email Address" 
                                    className="w-full rounded-lg p-3 outline-none focus:ring-2 focus:ring-cyan-400 border transition-all"
                                    style={inputStyle}
                                />
                                <input type="tel" name="phone" value={formData.phone || ''} onChange={handleInputChange} placeholder="Phone Number" 
                                    className="w-full rounded-lg p-3 outline-none focus:ring-2 focus:ring-cyan-400 border transition-all"
                                    style={inputStyle}
                                />
                                
                                <div className="relative">
                                    <select name="role" value={formData.role} onChange={handleInputChange} 
                                        className="w-full rounded-lg p-3 outline-none focus:ring-2 focus:ring-cyan-400 border transition-all appearance-none cursor-pointer"
                                        style={inputStyle}
                                    >
                                        <option value="DEVELOPER">Developer</option>
                                        <option value="MANAGER">Manager</option>
                                        <option value="OWNER">Owner</option>
                                        <option value="TESTER">Tester</option>
                                    </select>
                                    <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none" style={{ color: colors.text }}>
                                        <svg className="w-4 h-4 fill-current opacity-50" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" fillRule="evenodd"></path></svg>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center pt-6">
                                    <motion.button 
                                        type="button"
                                        onClick={handleDelete}
                                        className={`flex items-center gap-2 font-semibold text-sm transition-colors ${confirmingDelete ? 'text-red-500' : 'opacity-60 hover:opacity-100 hover:text-red-500'}`}
                                        style={{ color: confirmingDelete ? undefined : colors.text }}
                                        whileHover={{ scale: 1.05 }} 
                                        whileTap={{ scale: 0.95 }}
                                        disabled={isSaving}
                                    >
                                        <Trash2 size={16} />
                                        {confirmingDelete ? 'Confirm Delete?' : 'Delete User'}
                                    </motion.button>
                                    
                                    <motion.button type="submit" disabled={isSaving} className="px-6 py-3 bg-cyan-500 text-white rounded-lg font-bold hover:bg-cyan-400 shadow-lg shadow-cyan-500/30 transition-all disabled:opacity-50 flex items-center justify-center gap-2" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                        <Save size={18} /> {isSaving ? 'Saving...' : 'Save All Changes'}
                                    </motion.button>
                                </div>
                                {error && <p className="text-center text-red-500 mt-4 font-medium">{error}</p>}
                            </form>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default EditUserModal;