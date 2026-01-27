import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PlusCircle, Building2 } from 'lucide-react';
import StatCard from './Sastatcard';
import TeamMembersList from './Sateammemberslist';
import SaCreateOrgModal from './SaCreateOrgModal';
import { useTheme } from '../../../context/ThemeContext';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Sateammanagement = () => {
    const { openModal } = useOutletContext();
    const [isCreateOrgModalOpen, setIsCreateOrgModalOpen] = useState(false);

    const [stats, setStats] = useState({ 
        total_members: 0, 
        active_members: 0, 
        active_projects: 0, 
        total_organizations: 0 
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { colors } = useTheme();

    const fetchStats = async () => {
        setLoading(true);
        setError(null);

        try {
            const authToken = localStorage.getItem('authToken');
            if (!authToken) throw new Error("Authentication token not found.");

            const headers = {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json'
            };

            let newStats = { total_members: 0, active_members: 0, active_projects: 0 };
            let orgCount = 0;

          
            try {
                const response = await fetch(`${API_BASE_URL}/team/stats/`, { headers });
                if (response.ok) {
                    newStats = await response.json();
                } else {
                    console.error("Failed to fetch team stats:", response.status);
                }
            } catch (err) {
                console.error("Error fetching team stats:", err);
            }

          
            try {
                const response = await fetch(`${API_BASE_URL}/organizations/stats/`, { headers });
                if (response.ok) {
                    const data = await response.json();
                   
                    orgCount = data.total_organizations; 
                } else {
                    console.error("Failed to fetch organization stats:", response.status);
                }
            } catch (err) {
                console.error("Error fetching organization stats:", err);
            }

            setStats({
                ...newStats, 
                total_organizations: orgCount 
            });

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const handleRefresh = async () => {
            await new Promise(resolve => setTimeout(resolve, 300));
            fetchStats();
        };

        fetchStats();

        window.addEventListener('teamMemberAdded', handleRefresh);
        window.addEventListener('teamMemberUpdated', handleRefresh);
        window.addEventListener('teamMemberDeleted', handleRefresh);

        return () => {
            window.removeEventListener('teamMemberAdded', handleRefresh);
            window.removeEventListener('teamMemberUpdated', handleRefresh);
            window.removeEventListener('teamMemberDeleted', handleRefresh);
        };
    }, []);

    const statCardsData = [
        { title: "Total Members", value: stats.total_members },
        { title: "Active Members", value: stats.active_members },
        { title: "Active Projects", value: stats.active_projects },
        { title: "Total Organizations", value: stats.total_organizations },
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
            className="pt-4 pd:pt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{
                backgroundColor: colors.background,
                color: colors.text,
                borderColor: colors.border
            }}>
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 " >
                <div>
                    <h1 className="pl-2 text-4xl font-bold text-gray-900 tracking-tight" style={{ color: colors.text }}>User Management</h1>
                    <p className="pl-2 text-gray-600 mt-1 text-lg" style={{ color: colors.text }}>Oversee team members, roles, and project access.</p>
                </div>
                
                
                <div className="flex flex-wrap gap-3">
                    <motion.button
                        className="bg-indigo-600 text-white font-semibold px-6 py-3 rounded-full flex items-center gap-2 hover:bg-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                        onClick={() => setIsCreateOrgModalOpen(true)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Building2 size={20} />
                        Create Organization
                    </motion.button>

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
            </div>

            {loading && <p className="text-center mt-10 text-gray-600">Loading statistics...</p>}
            {error && <p className="text-center mt-10 text-red-600 bg-red-100 p-3 rounded-lg">Error: {error}</p>}

            {!loading && !error && (
                <motion.div
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 xl:gap-6 mt-8"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {statCardsData.map((stat) => (
                        <StatCard key={stat.title} title={stat.title} value={stat.value} />
                    ))}
                </motion.div>
            )}

            <TeamMembersList />

            
            <SaCreateOrgModal 
                isOpen={isCreateOrgModalOpen} 
                onClose={() => setIsCreateOrgModalOpen(false)}
                onSuccess={fetchStats} 
            />

        </motion.section>
    );
};

export default Sateammanagement;