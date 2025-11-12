// src/pages/SetPasswordPage.jsx

import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LockKeyhole, X, Eye, EyeOff, CheckCircle } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


const SetPasswordPage = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const navigate = useNavigate();
    
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(true);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }
        
        setIsSubmitting(true);
        setError(null);
        setSuccess(false);

        try {
            const response = await fetch(`${API_BASE_URL}/users/set-password/`, { 
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    token: token,
                    password: password
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Failed to set password. The link may have expired.');
            }
            
            setSuccess(true);
            setTimeout(() => navigate('/login'), 3000);

        } catch (err) {
            setError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const backdropVariants = { visible: { opacity: 1 }, hidden: { opacity: 0 } };
    const modalVariants = {
        hidden: { scale: 0.9, opacity: 0 },
        visible: { scale: 1, opacity: 1, transition: { type: "spring", stiffness: 150, damping: 20 } },
    };

    return (
        <AnimatePresence>
            {isModalOpen && (
                <motion.div
                    className="fixed inset-0 z-50 flex justify-center items-center p-4 bg-gray-900/50 backdrop-blur-md"
                    variants={backdropVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                >
                    <motion.div
                        className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-2xl shadow-2xl z-50 w-full max-w-md relative"
                        variants={modalVariants}
                    >
                        <div className="p-8">
                            <div className="text-center mb-8">
                                <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-purple-500/20 flex items-center justify-center">
                                     <LockKeyhole className="w-8 h-8 text-purple-400" />
                                </div>
                                <h2 className="text-3xl font-bold text-white">Set Your Password</h2>
                                <p className="text-gray-400 mt-2">Create a secure password to access your account.</p>
                            </div>
                            
                            {success ? (
                                <div className="text-center py-8">
                                    <CheckCircle className="mx-auto w-16 h-16 text-green-500" />
                                    <h3 className="text-2xl font-semibold text-white mt-4">Success!</h3>
                                    <p className="text-gray-300 mt-2">Your password has been set. Redirecting to login...</p>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    {error && <p className="text-center text-red-400 bg-red-500/10 p-3 rounded-lg">{error}</p>}
                                    
                                    <div className="relative">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="New Password"
                                            required
                                            // STYLES ARE NOW SELF-CONTAINED HERE
                                            className="w-full px-4 py-3 border border-white/20 rounded-lg shadow-sm bg-black/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                                        />
                                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white">
                                            {showPassword ? <EyeOff /> : <Eye />}
                                        </button>
                                    </div>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            placeholder="Confirm New Password"
                                            required
                                            
                                            className="w-full px-4 py-3 border border-white/20 rounded-lg shadow-sm bg-black/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                                        />
                                    </div>
                                    
                                    <motion.button 
                                        type="submit" 
                                        disabled={isSubmitting} 
                                        className="w-full px-6 py-3 bg-purple-600 text-white rounded-lg font-bold hover:bg-purple-500 transition-colors disabled:bg-gray-500 flex items-center justify-center gap-2" 
                                        whileHover={{ scale: 1.05 }} 
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        {isSubmitting ? 'Saving...' : 'Set Password'}
                                    </motion.button>
                                </form>
                            )}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default SetPasswordPage;