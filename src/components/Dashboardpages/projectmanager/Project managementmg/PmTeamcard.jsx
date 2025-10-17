// src/components/Dashboardpages/Project management/Teamcard.jsx

import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MessageSquare, Eye } from 'lucide-react';

const formatRole = (role) => {
    if (!role) return 'N/A';
    return role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
};

const getInitials = (firstName, lastName) => {
    const first = firstName ? firstName[0] : '';
    const last = lastName ? lastName[0] : '';
    return `${first}${last}`.toUpperCase() || '??';
};

const PmTeamcard = ({ member, onEdit }) => {
    const { first_name, last_name, role, email, phone, is_active } = member;

    const initials = getInitials(first_name, last_name);
    const fullName = `${first_name || ''} ${last_name || ''}`.trim();
    const formattedRole = formatRole(role);
    
    const status = is_active ? 'Active' : 'Inactive';
    const statusStyle = is_active 
        ? 'bg-green-500/20 text-green-800 ring-1 ring-inset ring-green-600/20' 
        : 'bg-gray-500/20 text-gray-800 ring-1 ring-inset ring-gray-500/20';
    
    const cardVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: { opacity: 1, x: 0 },
    };

    return (
        <motion.div 
            className="bg-white/60 backdrop-blur-lg border border-white/40 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4 shadow-lg hover:shadow-2xl hover:border-white/60 transition-all duration-300"
            variants={cardVariants}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        >
            <div className="w-16 h-16 rounded-full bg-gray-200 flex-shrink-0 flex items-center justify-center border-2 border-white shadow-md">
                <span className="text-2xl font-bold text-gray-600">{initials}</span>
            </div>
            
            <div className="flex-grow">
                <h3 className="text-xl font-bold text-gray-900">{fullName}</h3>
                <p className="text-gray-700 font-medium">{formattedRole}</p>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-y-1 gap-x-5 text-gray-600 text-sm mt-2">
                    <a href={`mailto:${email}`} className="flex items-center gap-2 hover:text-blue-600 transition-colors"><Mail size={16} /> {email}</a>
                    <a href={`tel:${phone}`} className="flex items-center gap-2 hover:text-blue-600 transition-colors"><Phone size={16} /> {phone || 'N/A'}</a>
                </div>
            </div>

            <div className="flex items-center gap-3 text-gray-600 w-full sm:w-auto mt-3 sm:mt-0 ml-auto">
                <span className={`text-xs font-semibold px-3 py-1.5 rounded-full ${statusStyle}`}>
                    {status}
                </span>
                <button className="p-2 rounded-full hover:bg-gray-900/10 hover:text-gray-900 transition-colors"><MessageSquare size={20} /></button>
                {/* <button 
                    onClick={onEdit}
                    className="p-2 rounded-full hover:bg-gray-900/10 hover:text-gray-900 transition-colors"
                >
                    <Eye size={20} />
                </button> */}
            </div>
        </motion.div>
    );
};

export default PmTeamcard;