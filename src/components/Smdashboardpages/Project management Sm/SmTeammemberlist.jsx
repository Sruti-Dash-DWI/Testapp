// src/components/Dashboardpages/Project management/Teammeberlist.jsx

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import TeamMemberCard from './SmTeamcard';
import EditUserModal from './SmEditUserModal'; 
import { Info } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


// NEW: A stylish skeleton component that mimics the TeamMemberCard layout.
const TeamCardSkeleton = () => (
    <div className="bg-white/50 backdrop-blur-md border border-white/30 rounded-xl p-4 flex items-center gap-4 shadow-lg animate-pulse">
        <div className="w-16 h-16 rounded-full bg-gray-300/80 flex-shrink-0"></div>
        <div className="flex-grow space-y-2">
            <div className="h-4 bg-gray-300/80 rounded w-1/3"></div>
            <div className="h-3 bg-gray-300/80 rounded w-1/2"></div>
        </div>
        <div className="h-6 w-20 bg-gray-300/80 rounded-full"></div>
    </div>
);


const SmTeamMembersList = () => {
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingMember, setEditingMember] = useState(null);

    useEffect(() => {
        // Simulating a slightly longer load time to make the skeleton visible
        setTimeout(() => {
            const fetchMembers = async () => {
                setLoading(true);
                try {
                    const authToken = localStorage.getItem('authToken');
                    if (!authToken) throw new Error("Authentication token not found.");
                    const response = await fetch(`${API_BASE_URL}/users/`, {
                        headers: { 'Authorization': `Bearer ${authToken}`, 'Content-Type': 'application/json' },
                    });
                    if (!response.ok) throw new Error('Failed to fetch team members.');
                    const data = await response.json();
                    setMembers(data);
                    setError(null);
                } catch (err) {
                    setError(err.message);
                } finally {
                    setLoading(false);
                }
            };
            fetchMembers();
        }, 500); // Small delay to ensure skeleton is visible
    }, []);
    
    const handleUserUpdate = (updatedMember) => {
        setMembers(prevMembers => 
            prevMembers.map(m => m.id === updatedMember.id ? updatedMember : m)
        );
    };

    const handleDeleteSuccess = (deletedUserId) => {
        setMembers(prevMembers => prevMembers.filter(m => m.id !== deletedUserId));
    };

    const listVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };
    
    const renderContent = () => {
        // THE FIX: When loading, show the new skeleton component.
        if (loading) {
            return (
                <div className="space-y-4">
                    <TeamCardSkeleton />
                    <TeamCardSkeleton />
                    <TeamCardSkeleton />
                </div>
            );
        }
        
        if (error) {
            return <p className="text-center mt-4 text-red-600 bg-red-100 p-3 rounded-lg">Error: {error}</p>;
        }
        
        if (members.length === 0) {
            return (
                <div className="text-center mt-10 p-6 bg-white/50 backdrop-blur-md rounded-lg border border-white/30">
                    <Info className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-lg font-medium text-gray-900">No Team Members Found</h3>
                    <p className="mt-1 text-sm text-gray-500">
                        Click the "Invite Member" button to add people to your team.
                    </p>
                </div>
            );
        }

        return (
            <motion.div 
                className="space-y-4"
                variants={listVariants}
                initial="hidden"
                animate="visible"
            >
                {members.map((member) => (
                    <TeamMemberCard 
                        key={member.id} 
                        member={member} 
                        onEdit={() => setEditingMember(member)}
                    />
                ))}
            </motion.div>
        );
    };

    return (
        <section className="mt-16">
            <div className="flex items-center gap-3 mb-6">
                <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Team Members</h2>
            </div>
            {renderContent()}

            <EditUserModal 
                member={editingMember}
                onClose={() => setEditingMember(null)}
                onUpdate={handleUserUpdate}
                onDeleteSuccess={handleDeleteSuccess}
            />
        </section>
    );
};

export default SmTeamMembersList;