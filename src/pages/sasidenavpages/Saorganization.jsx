import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Building2, Search, Info, ChevronUp, ChevronDown, Globe, Users, ArrowUpDown, Plus, FileText, User } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext'; 
import SaCreateOrgModal from '../../components/superadminpages/saprojectmangement/Sacreateorgmodal'; 

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// --- Skeleton Loader ---
const TableSkeleton = () => (
    <div className="animate-pulse">
        {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-4 p-4 border-b border-gray-200/50">
                <div className="w-10 h-10 rounded-lg bg-gray-300/50" />
                <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-300/50 rounded w-1/4" />
                    <div className="h-3 bg-gray-300/50 rounded w-1/3" />
                </div>
                <div className="w-20 h-6 bg-gray-300/50 rounded-full" />
            </div>
        ))}
    </div>
);

const SaOrganization = () => {
    const [organizations, setOrganizations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isCreateOrgModalOpen, setIsCreateOrgModalOpen] = useState(false);
    
    // --- Filter States ---
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedOrg, setSelectedOrg] = useState("all");
    const [selectedOwner, setSelectedOwner] = useState("all"); // Added Owner Filter State
    const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'ascending' });

    const { colors, isDarkMode } = useTheme();

    const fetchOrganizations = async () => {
        setLoading(true);
        try {
            const authToken = localStorage.getItem('authToken');
            if (!authToken) throw new Error("Authentication token not found.");

            const response = await fetch(`${API_BASE_URL}/organizations/`, {
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) throw new Error("Failed to fetch organizations.");
            
            const data = await response.json();
            setOrganizations(data);
            setError(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrganizations();
        window.addEventListener('organizationCreated', fetchOrganizations);
        window.addEventListener('organizationUpdated', fetchOrganizations);
        return () => {
            window.removeEventListener('organizationCreated', fetchOrganizations);
            window.removeEventListener('organizationUpdated', fetchOrganizations);
        };
    }, []);

    // --- Helper: Safely get Owner Name ---
    // Handles cases where owner might be an object, a string, or null
    const getOwnerName = (org) => {
        if (org.owner_name) return org.owner_name;
        if (org.owner && typeof org.owner === 'object') {
            return `${org.owner.first_name || ''} ${org.owner.last_name || ''}`.trim() || 'Unknown';
        }
        return "Unknown"; 
    };

    // --- Compute Unique Dropdown Options ---
    const uniqueOrgNames = useMemo(() => {
        return [...new Set(organizations.map(org => org.name))].sort();
    }, [organizations]);

    const uniqueOwnerNames = useMemo(() => {
        const owners = organizations.map(org => getOwnerName(org)).filter(name => name !== "Unknown");
        return [...new Set(owners)].sort();
    }, [organizations]);

    // --- Sorting & Filtering Logic ---
    const handleSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const sortedAndFilteredOrgs = useMemo(() => {
        let filtered = organizations.filter((org) => {
            const orgName = org.name || "";
            const orgDomain = org.domain || "";
            const orgDesc = org.description || "";
            const ownerName = getOwnerName(org);
            
            const searchLower = searchTerm.toLowerCase();

            // 1. Search Filter
            const matchesSearch = 
                orgName.toLowerCase().includes(searchLower) || 
                orgDomain.toLowerCase().includes(searchLower) ||
                orgDesc.toLowerCase().includes(searchLower) ||
                ownerName.toLowerCase().includes(searchLower);

            // 2. Organization Dropdown Filter
            const matchesOrg = selectedOrg === "all" || orgName === selectedOrg;

            // 3. Owner Dropdown Filter
            const matchesOwner = selectedOwner === "all" || ownerName === selectedOwner;

            return matchesSearch && matchesOrg && matchesOwner;
        });

        if (sortConfig.key) {
            filtered.sort((a, b) => {
                let aValue = a[sortConfig.key];
                let bValue = b[sortConfig.key];
                
                // Special handling for calculated fields
                if (sortConfig.key === 'owner_name') {
                    aValue = getOwnerName(a);
                    bValue = getOwnerName(b);
                }

                aValue = aValue ? aValue.toString().toLowerCase() : "";
                bValue = bValue ? bValue.toString().toLowerCase() : "";

                if (aValue < bValue) return sortConfig.direction === 'ascending' ? -1 : 1;
                if (aValue > bValue) return sortConfig.direction === 'ascending' ? 1 : -1;
                return 0;
            });
        }
        return filtered;
    }, [organizations, searchTerm, selectedOrg, selectedOwner, sortConfig]);

    const tableHeaderStyle = {
        color: colors.text,
        borderBottom: `1px solid ${colors.border}`,
        backgroundColor: isDarkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.02)"
    };

    const dropdownStyle = {
        backgroundColor: "rgba(255, 255, 255, 0.5)",
        backdropFilter: "blur(10px)",
        borderColor: colors.border,
        color: colors.text
    };

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
            <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-6 mb-8" >
                <div>
                    <h1 className="text-4xl font-bold tracking-tight" style={{ color: colors.text }}>Organization</h1>
                    <p className="mt-1 text-lg opacity-70" style={{ color: colors.text }}>Manage your organizations and their structures.</p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 w-full xl:w-auto">
                     {/* Search Input */}
                    <div className="relative flex-grow sm:flex-grow-0 sm:w-64">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search size={18} className="text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search name, domain..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all shadow-sm w-full"
                            style={dropdownStyle}
                        />
                    </div>

                    {/* Organization Filter Dropdown */}
                    <div className="relative sm:w-48">
                        <select
                            value={selectedOrg}
                            onChange={(e) => setSelectedOrg(e.target.value)}
                            className="appearance-none w-full px-4 py-2.5 pr-10 rounded-xl border focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm font-medium transition-all"
                            style={dropdownStyle}
                        >
                            <option value="all">All Orgs</option>
                            {uniqueOrgNames.map(name => (
                                <option key={name} value={name}>{name}</option>
                            ))}
                        </select>
                        <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400">▼</span>
                    </div>

                    {/* Owner Filter Dropdown */}
                    <div className="relative sm:w-48">
                        <select
                            value={selectedOwner}
                            onChange={(e) => setSelectedOwner(e.target.value)}
                            className="appearance-none w-full px-4 py-2.5 pr-10 rounded-xl border focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm font-medium transition-all"
                            style={dropdownStyle}
                        >
                            <option value="all">All Owners</option>
                            {uniqueOwnerNames.map(name => (
                                <option key={name} value={name}>{name}</option>
                            ))}
                        </select>
                        <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400">▼</span>
                    </div>

                    {/* Create Button */}
                    <motion.button
                        className="relative group bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold px-6 py-2.5 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/25 overflow-hidden"
                        onClick={() => setIsCreateOrgModalOpen(true)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                        <div className="relative flex items-center gap-2">
                            <div className="bg-white/20 p-1 rounded-lg">
                                <Plus size={16} strokeWidth={3} />
                            </div>
                            <span>Create Org</span>
                        </div>
                    </motion.button>
                </div>
            </div>

            {/* --- Table Container --- */}
            <div 
                className="rounded-2xl shadow-xl overflow-hidden border backdrop-blur-xl"
                style={{ 
                    backgroundColor: isDarkMode ? "rgba(30, 41, 59, 0.4)" : "rgba(255, 255, 255, 0.6)",
                    borderColor: "rgba(255,255,255, 0.2)" 
                }}
            >
                {loading ? (
                    <div className="p-6"><TableSkeleton /></div>
                ) : error ? (
                    <div className="p-10 text-center text-red-500 bg-red-50/50">{error}</div>
                ) : sortedAndFilteredOrgs.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                        <div className="bg-gray-100/50 p-4 rounded-full mb-3">
                            <Info size={32} className="text-gray-400" />
                        </div>
                        <h3 className="text-lg font-semibold opacity-80" style={{ color: colors.text }}>No organizations found</h3>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="text-sm font-semibold uppercase tracking-wider" style={tableHeaderStyle}>
                                    {[
                                        { key: 'name', label: 'Organization Name', icon: Building2 },
                                        { key: 'domain', label: 'Domain', icon: Globe },
                                        { key: 'owner_name', label: 'Owner Name', icon: User }, // Added Owner Header
                                        { key: 'description', label: 'Description', icon: FileText },
                                        { key: 'user_count', label: 'Users', icon: Users }, 
                                    ].map((header) => (
                                        <th 
                                            key={header.key} 
                                            className="px-6 py-5 cursor-pointer hover:opacity-70 transition-opacity whitespace-nowrap"
                                            onClick={() => handleSort(header.key)}
                                        >
                                            <div className="flex items-center gap-2">
                                                {header.icon && <header.icon size={16} className="opacity-70" />}
                                                {header.label}
                                                {sortConfig.key === header.key && (
                                                    sortConfig.direction === 'ascending' ? <ChevronUp size={14}/> : <ChevronDown size={14}/>
                                                )}
                                                {sortConfig.key !== header.key && <ArrowUpDown size={12} className="opacity-30" />}
                                            </div>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y" style={{ divideColor: colors.border }}>
                                <AnimatePresence>
                                    {sortedAndFilteredOrgs.map((org) => (
                                        <motion.tr 
                                            key={org.id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            layout
                                            className="group transition-colors duration-200"
                                            style={{ borderTopColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}
                                            whileHover={{ backgroundColor: isDarkMode ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)' }}
                                        >
                                            {/* Name */}
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="font-semibold text-base" style={{ color: colors.text }}>
                                                    {org.name}
                                                </div>
                                            </td>

                                            {/* Domain */}
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-2 text-sm opacity-80" style={{ color: colors.text }}>
                                                    <Globe size={14} className="opacity-50"/>
                                                    {org.domain || '—'}
                                                </div>
                                            </td>

                                            {/* Owner Name (Added Back) */}
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-2" style={{ color: colors.text }}>
                                                    {getOwnerName(org)}
                                                </div>
                                            </td>

                                            {/* Description */}
                                            <td className="px-6 py-4">
                                                <div className="text-sm opacity-70 truncate max-w-[200px]" style={{ color: colors.text }} title={org.description}>
                                                    {org.description || '—'}
                                                </div>
                                            </td>

                                            {/* User Count */}
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-700 border border-blue-100">
                                                    {org.user_count ?? 0} Users
                                                </span>
                                            </td>

                                        </motion.tr>
                                    ))}
                                </AnimatePresence>
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <SaCreateOrgModal 
                isOpen={isCreateOrgModalOpen} 
                onClose={() => setIsCreateOrgModalOpen(false)}
                onSuccess={fetchOrganizations} 
            />

        </motion.section>
    );
};

export default SaOrganization;