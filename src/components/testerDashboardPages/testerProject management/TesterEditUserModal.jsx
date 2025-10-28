// src/components/Dashboardpages/Project management/EditUserModal.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Trash2 } from 'lucide-react';

const API_BASE_URL = 'http://localhost:8000/api';

const TesterEditUserModal = ({ member, onClose, onUpdate, onDeleteSuccess }) => { 
    if (!member) return null;

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

    return (
        <AnimatePresence>
            {member && (
                <motion.div className="fixed inset-0 z-50 flex justify-center items-center p-4 bg-black/70" variants={backdropVariants} initial="hidden" animate="visible" exit="hidden" onClick={onClose}>
                    <motion.div className="glowing-modal w-full max-w-lg" variants={modalVariants} initial="hidden" animate="visible" exit="exit" onClick={(e) => e.stopPropagation()}>
                        <div className="bg-gray-900/60 backdrop-blur-2xl border border-white/20 rounded-2xl shadow-2xl relative p-10">
                            <div className="flex justify-between items-start mb-8">
                                <div>
                                    <h2 className="text-3xl font-bold text-white [text-shadow:0_2px_4px_rgba(0,0,0,0.5)]">Edit Team Member</h2>
                                    <p className="text-gray-300 mt-2 font-medium">Update the details for the user.</p>
                                </div>
                                <motion.button onClick={onClose} className="text-gray-400 p-2 rounded-full hover:bg-white/10 hover:text-white" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}> <X /> </motion.button>
                            </div>
                            <form onSubmit={handleFinalSubmit} className="space-y-6">
                                <input type="text" name="first_name" value={formData.first_name} onChange={handleInputChange} placeholder="First Name" className="edit-modal-input" />
                                <input type="text" name="last_name" value={formData.last_name} onChange={handleInputChange} placeholder="Last Name" className="edit-modal-input" />
                                <input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="Email Address" className="edit-modal-input" />
                                <input type="tel" name="phone" value={formData.phone || ''} onChange={handleInputChange} placeholder="Phone Number" className="edit-modal-input" />
                                <select name="role" value={formData.role} onChange={handleInputChange} className="edit-modal-input">
                                    <option value="DEVELOPER">Developer</option>
                                    <option value="MANAGER">Manager</option>
                                    <option value="OWNER">Owner</option>
                                    <option value="TESTER">Tester</option>
                                </select>
                                <div className="flex justify-between items-center pt-6">
                                    <motion.button 
                                        type="button"
                                        onClick={handleDelete}
                                        className={`flex items-center gap-2 font-semibold text-sm transition-colors ${confirmingDelete ? 'text-red-400' : 'text-gray-400 hover:text-red-400'}`}
                                        whileHover={{ scale: 1.05 }} 
                                        whileTap={{ scale: 0.95 }}
                                        disabled={isSaving}
                                    >
                                        <Trash2 size={16} />
                                        {confirmingDelete ? 'Confirm Delete?' : 'Delete User'}
                                    </motion.button>
                                    
                                    <motion.button type="submit" disabled={isSaving} className="px-6 py-3 bg-purple-600 text-white rounded-lg font-bold hover:bg-purple-500 transition-colors disabled:bg-gray-500 flex items-center justify-center gap-2" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                        <Save size={18} /> {isSaving ? 'Saving...' : 'Save All Changes'}
                                    </motion.button>
                                </div>
                                {error && <p className="text-center text-red-400 mt-4">{error}</p>}
                            </form>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default TesterEditUserModal;