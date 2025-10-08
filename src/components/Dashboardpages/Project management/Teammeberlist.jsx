
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import TeamMemberCard from './Teamcard';
import EditUserModal from './EditUserModal'; 
import { Info } from 'lucide-react';

const API_BASE_URL = 'http://localhost:8000/api';

const TeamMembersList = () => {
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingMember, setEditingMember] = useState(null);

    useEffect(() => {
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
    }, []);
    
    const handleUserUpdate = (updatedMember) => {
        setMembers(prevMembers => 
            prevMembers.map(m => m.id === updatedMember.id ? updatedMember : m)
        );
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
        if (loading) {
            return <p className="text-center mt-4 text-gray-600">Loading members...</p>;
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
            />
        </section>
    );
};

export default TeamMembersList;