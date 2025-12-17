import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PlusCircle } from 'lucide-react';
import DevStatCard from './DevStatcard'
import DevModal from './DevModal';
import DevTeamMembersList from './DevTeammemberlist';
import { useTheme } from '../../../context/ThemeContext';
 
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const DevTeamManagement = () => {
    const { isInviteModalOpen, openModal, closeModal } = useOutletContext();
    const [stats, setStats] = useState({ total_members: 0, active_members: 0, active_projects: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { theme, toggleTheme, colors } = useTheme();

    useEffect(() => {
        const fetchStats = async () => {
            setLoading(true);
            try {
                const authToken = localStorage.getItem('authToken');
                if (!authToken) throw new Error("Authentication token not found.");

                const headers = {
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'application/json'
                };


                const response = await fetch(`${API_BASE_URL}/team/stats/`, { headers });

                if (!response.ok) {
                    if (response.status === 404) {
                        throw new Error('The /api/team/stats/ endpoint was not found on the server.');
                    }
                    throw new Error('Failed to fetch team statistics.');
                }

                const data = await response.json();
                setStats(data); 
                setError(null);

            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const statCardsData = [
        { title: "Total Members", value: stats.total_members },
        { title: "Active Members", value: stats.active_members },
        { title: "Active Projects", value: stats.active_projects },
    ];
    
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
            },
        },
    };

    return (
      <motion.section 
            className="min-h-screen p-8 transition-colors duration-300"

            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{
            backgroundColor: colors.background,
            color: colors.text,
            borderColor: colors.border
          }}
        >
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div>
                   <h1 className="text-4xl font-bold text-gray-900 tracking-tight" style={{ color: colors.text }}>User Management</h1>
                    <p className="text-gray-600 mt-1 text-lg" style={{ color: colors.text }}>Oversee team members, roles, and project access.</p>
                </div>
                <motion.button
                    className="bg-gray-900 text-white font-semibold px-6 py-3 rounded-full flex items-center gap-2 hover:bg-gray-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                    onClick={openModal}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <PlusCircle size={20} />
                    Invite Member
                </motion.button>
            </div>

            {loading && <p className="text-center mt-10 text-gray-600">Loading statistics...</p>}
            {error && <p className="text-center mt-10 text-red-600 bg-red-100 p-3 rounded-lg">Error: {error}</p>}
            
            {!loading && !error && (
                 <motion.div 
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                 >
                    {statCardsData.map((stat) => (
                        <StatCard key={stat.title} title={stat.title} value={stat.value} />
                    ))}
                </motion.div>
            )}

            {/* <Modal isOpen={isInviteModalOpen} onClose={closeModal} /> */}
            <DevTeamMembersList />
        </motion.section>
    );
};

export default DevTeamManagement;