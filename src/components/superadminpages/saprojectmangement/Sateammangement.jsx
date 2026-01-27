import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PlusCircle, Building2 } from 'lucide-react';
import StatCard from './Sastatcard';
import TeamMembersList from './Sateammemberslist'; // Ensure file name matches
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
                if (response.ok) newStats = await response.json();
            } catch (err) { console.error(err); }

            try {
                const response = await fetch(`${API_BASE_URL}/organizations/stats/`, { headers });
                if (response.ok) {
                    const data = await response.json();
                    orgCount = data.total_organizations; 
                }
            } catch (err) { console.error(err); }

            setStats({ ...newStats, total_organizations: orgCount });

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

    return (
        <motion.section
            className="pt-4 pd:pt-8 min-h-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
                backgroundColor: colors.background,
                color: colors.text
            }}
        >
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6" >
                <div>
                    <h1 className="text-4xl font-bold tracking-tight" style={{ color: colors.text }}>User Management</h1>
                    <p className="mt-1 text-lg opacity-70" style={{ color: colors.text }}>Oversee team members, roles, and project access.</p>
                </div>
                
                <div className="flex flex-wrap gap-3">
                    {/* <motion.button
                        className="bg-indigo-600 text-white font-semibold px-6 py-3 rounded-xl flex items-center gap-2 hover:bg-indigo-700 transition-all shadow-lg hover:shadow-indigo-500/30"
                        onClick={() => setIsCreateOrgModalOpen(true)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <Building2 size={20} />
                        Create Organization
                    </motion.button> */}

                    <motion.button
                        className="bg-gray-900 text-white font-semibold px-6 py-3 rounded-xl flex items-center gap-2 hover:bg-gray-800 transition-all shadow-lg hover:shadow-gray-500/30"
                        onClick={openModal}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <PlusCircle size={20} />
                        Invite Member
                    </motion.button>
                </div>
            </div>

            {/* Stats Grid */}
            {!loading && !error && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {statCardsData.map((stat) => (
                        <StatCard key={stat.title} title={stat.title} value={stat.value} />
                    ))}
                </div>
            )}

            {/* The New Table List Component */}
            <TeamMembersList />

            {/* Modals */}
            <SaCreateOrgModal 
                isOpen={isCreateOrgModalOpen} 
                onClose={() => setIsCreateOrgModalOpen(false)}
                onSuccess={fetchStats} 
            />
        </motion.section>
    );
};

export default Sateammanagement;