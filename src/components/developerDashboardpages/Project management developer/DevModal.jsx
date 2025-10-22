// src/components/Dashboardpages/Project management/Modal.jsx

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserPlus, X } from 'lucide-react';

const API_BASE_URL = 'http://localhost:8000/api';

const DevModal = ({ isOpen, onClose }) => {
    const [email, setEmail] = useState('');
    // const [firstName, setFirstName] = useState(''); 
    // const [lastName, setLastName] = useState('');   
    const [role, setRole] = useState('DEVELOPER'); 
    
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const handleCloseAndReset = () => {
        onClose();
        setTimeout(() => {
            setEmail('');
            // setFirstName(''); 
            // setLastName('');  
            setRole('DEVELOPER');
            setError(null);
            setSuccess(false);
            setIsSubmitting(false);
        }, 300);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);
        setSuccess(false);

        const invitationData = {
            email,
            role,
        };
        
        try {
            const authToken = localStorage.getItem('authToken');
            const response = await fetch(`${API_BASE_URL}/users/invite/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                },
                body: JSON.stringify(invitationData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                const errorMessage = errorData.detail || errorData.email?.[0] || 'Failed to send invitation.';
                throw new Error(errorMessage);
            }
            
            setSuccess(true);
            setTimeout(handleCloseAndReset, 2000); 

        } catch (err) {
            setError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const backdropVariants = {
        visible: { opacity: 1 },
        hidden: { opacity: 0 },
    };

    const modalVariants = {
        hidden: { y: "-50vh", opacity: 0 },
        visible: { y: "0", opacity: 1, transition: { type: "spring", stiffness: 120, damping: 15 } },
        exit: { y: "50vh", opacity: 0, transition: { duration: 0.3 } }
    };

    return (
        <AnimatePresence mode="wait">
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-50 flex justify-center items-center p-4 bg-black/60 backdrop-blur-sm"
                    variants={backdropVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    onClick={handleCloseAndReset}
                >
                    <motion.div
                        className="bg-white/50 backdrop-blur-xl border border-white/30 rounded-2xl shadow-2xl z-50 w-full max-w-lg relative p-6"
                        variants={modalVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                                <UserPlus /> Invite New Member
                            </h2>
                            <motion.button 
                                onClick={handleCloseAndReset} 
                                className="text-gray-500 p-2 rounded-full hover:bg-gray-500/10 hover:text-gray-800 focus:outline-none"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                <X />
                            </motion.button>
                        </div>
                        
                        {success ? (
                             <div className="text-center py-8">
                                <h3 className="text-xl font-semibold text-green-700">Invitation Sent!</h3>
                                <p className="text-gray-600 mt-2">An invitation has been sent to the user's email.</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit}>
                                {error && <p className="mb-4 text-center text-red-600 bg-red-100 p-3 rounded-lg">{error}</p>}
                                
                             
                                {/* <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                                    <input type="text" placeholder="First name (Optional)" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="modal-input" />
                                    <input type="text" placeholder="Last name (Optional)" value={lastName} onChange={(e) => setLastName(e.target.value)} className="modal-input" />
                                </div>
                                */}

                                <div className="mb-4">
                                    <input type="email" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} required className="modal-input" />
                                </div>
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                                    <select value={role} onChange={(e) => setRole(e.target.value)} className="modal-input">
                                        <option value="DEVELOPER">Developer</option>
                                        <option value="MANAGER">Manager</option>
                                        <option value="OWNER">Owner</option>
                                        <option value="TESTER">Tester</option>
                                    </select>
                                </div>
                                <div className="flex justify-end gap-3">
                                    <motion.button type="button" onClick={handleCloseAndReset} className="px-5 py-2.5 bg-gray-200/50 text-gray-800 rounded-lg font-semibold hover:bg-gray-200/80 transition-colors" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                        Cancel
                                    </motion.button>
                                    <motion.button type="submit" disabled={isSubmitting} className="px-5 py-2.5 bg-gray-900 text-white rounded-lg font-semibold hover:bg-gray-700 transition-colors disabled:bg-gray-400" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                        {isSubmitting ? 'Sending...' : 'Send Invitation'}
                                    </motion.button>
                                </div>
                            </form>
                        )}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default DevModal;