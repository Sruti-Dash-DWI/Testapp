import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    LayoutList, Search, Info, ChevronUp, ChevronDown, 
    ArrowUpDown, Plus, MoreVertical, Calendar, 
    User, Building2, FileText, Activity 
} from 'lucide-react';
import Samanageteammodal from './Samanageteammodal';
import { useTheme } from '../../../context/ThemeContext';

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

const Saprojects = () => {
    // --- Data States ---
    const [projects, setProjects] = useState([]);
    const [managers, setManagers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // --- UI/Modal States ---
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    
    // --- Selection States ---
    const [selectedProject, setSelectedProject] = useState(null); // For Team Modal
    const [editingProject, setEditingProject] = useState(null);   // For Edit Modal
    const [openDropdownId, setOpenDropdownId] = useState(null);   // For Action Menu
    
    // --- Filter & Sort States ---
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("all");
    const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'ascending' });

    const dropdownRef = useRef(null);
    const { theme, colors, isDarkMode } = useTheme();

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        owner: '',
        status: 'PLANNED',
        project_manager_id: null
    });

    // --- Initial Fetch ---
    useEffect(() => {
        fetchProjects();
        // Close dropdown when clicking outside
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setOpenDropdownId(null);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // --- API Functions ---
    const fetchProjects = async () => {
        setLoading(true);
        try {
            const authToken = localStorage.getItem('authToken');
            if (!authToken) throw new Error('Please login to view projects');

            const response = await fetch(`${API_BASE_URL}/reports/projects/`, {
                headers: { 'Authorization': `Bearer ${authToken}` },
            });

            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            const groupedData = await response.json();
            // Flatten the grouped object into a single array
            const allProjects = Object.values(groupedData).flat();
            setProjects(allProjects);
            setError(null);
        } catch (error) {
            console.error('Error fetching projects:', error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchManagers = async () => {
        try {
            const authToken = localStorage.getItem('authToken');
            if (!authToken) return;
            const response = await fetch(`${API_BASE_URL}/users/list/?role=manager`, {
                headers: { 'Authorization': `Bearer ${authToken}` },
            });
            if (response.ok) {
                const data = await response.json();
                setManagers(data.results || data);
            }
        } catch (error) {
            console.error('Error fetching managers:', error);
        }
    };

    // --- Modal Handlers ---
    const handleCloseCreate = () => {
        setShowCreateModal(false);
        resetForm();
    };
    
    const handleOpenCreate = () => {
        fetchManagers();
        setShowCreateModal(true);
    };

    const handleOpenEdit = (e, project) => {
        e.preventDefault(); e.stopPropagation();
        setEditingProject(project);
        setFormData({
            name: project.name,
            description: project.description,
            owner: project.owner?.id || '',
            status: project.status,
            project_manager_id: project.project_manager?.id || null
        });
        fetchManagers();
        setIsEditModalOpen(true);
        setOpenDropdownId(null);
    };

    const handleCloseEdit = () => {
        setIsEditModalOpen(false);
        setEditingProject(null);
        resetForm();
    };

    const handleOpenTeam = (project) => {
        setSelectedProject(project);
        setIsTeamModalOpen(true);
        setOpenDropdownId(null);
    };

    const resetForm = () => {
        setFormData({
            name: '',
            description: '',
            owner: '',
            status: 'PLANNED',
            project_manager_id: null
        });
    };

    // --- Form Submissions ---
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: (name === 'project_manager_id' && value === '') ? null : value
        }));
    };

    const handleSubmitCreate = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const authToken = localStorage.getItem('authToken');
            const response = await fetch(`${API_BASE_URL}/projects/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) throw new Error('Failed to create project');
            
            fetchProjects();
            handleCloseCreate();
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmitEdit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const authToken = localStorage.getItem('authToken');
            const response = await fetch(`${API_BASE_URL}/projects/${editingProject.id}/`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) throw new Error('Failed to update project');

            fetchProjects();
            handleCloseEdit();
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (e, projectId) => {
        e.preventDefault(); e.stopPropagation();
        if (!window.confirm("Are you sure you want to delete this project?")) return;

        try {
            const authToken = localStorage.getItem('authToken');
            const response = await fetch(`${API_BASE_URL}/projects/${projectId}/`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${authToken}` },
            });

            if (response.ok) {
                setProjects(prev => prev.filter(p => p.id !== projectId));
            } else {
                alert("Error: Could not delete the project.");
            }
        } catch (error) {
            alert("Network error while deleting.");
        }
        setOpenDropdownId(null);
    };

    // --- Helper Functions ---
    const getStatusColor = (status) => {
        switch (status) {
            case 'COMPLETED': return 'bg-green-100 text-green-800';
            case 'ONGOING': return 'bg-blue-100 text-blue-800';
            case 'ARCHIVED': return 'bg-gray-200 text-gray-800';
            case 'DELAYED': return 'bg-red-100 text-red-800';
            case 'PLANNED': return 'bg-cyan-100 text-cyan-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getOwnerName = (project) => {
        if (project.owner && typeof project.owner === 'object') {
            return `${project.owner.first_name || ''} ${project.owner.last_name || ''}`.trim() || 'Unknown';
        }
        return "Unknown";
    };

    // --- Filtering & Sorting Logic ---
    const handleSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const processedProjects = useMemo(() => {
        let filtered = projects.filter((p) => {
            const pName = p.name || "";
            const orgName = p.organization_name || p.organization?.name || "";
            const ownerName = getOwnerName(p);
            const searchLower = searchTerm.toLowerCase();

            const matchesSearch = 
                pName.toLowerCase().includes(searchLower) || 
                orgName.toLowerCase().includes(searchLower) ||
                ownerName.toLowerCase().includes(searchLower);

            const matchesStatus = selectedStatus === "all" || p.status === selectedStatus;

            return matchesSearch && matchesStatus;
        });

        if (sortConfig.key) {
            filtered.sort((a, b) => {
                let aValue = "";
                let bValue = "";

                if (sortConfig.key === 'owner') {
                    aValue = getOwnerName(a);
                    bValue = getOwnerName(b);
                } else if (sortConfig.key === 'organization') {
                    aValue = a.organization_name || a.organization?.name || "";
                    bValue = b.organization_name || b.organization?.name || "";
                } else {
                    aValue = a[sortConfig.key] ? a[sortConfig.key].toString().toLowerCase() : "";
                    bValue = b[sortConfig.key] ? b[sortConfig.key].toString().toLowerCase() : "";
                }

                if (aValue < bValue) return sortConfig.direction === 'ascending' ? -1 : 1;
                if (aValue > bValue) return sortConfig.direction === 'ascending' ? 1 : -1;
                return 0;
            });
        }
        return filtered;
    }, [projects, searchTerm, selectedStatus, sortConfig]);

    // --- Styling ---
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
            style={{ backgroundColor: colors.background, color: colors.text }}
        >
            {/* Header & Controls */}
            <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-6 mb-8">
                <div>
                    <h1 className="text-4xl font-bold tracking-tight" style={{ color: colors.text }}>My Projects</h1>
                    <p className="mt-1 text-lg opacity-70" style={{ color: colors.text }}>Manage and track all project progress.</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 w-full xl:w-auto">
                    {/* Search */}
                    <div className="relative flex-grow sm:flex-grow-0 sm:w-64">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search size={18} className="text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search projects..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all shadow-sm w-full"
                            style={dropdownStyle}
                        />
                    </div>

                    {/* Status Filter */}
                    <div className="relative sm:w-48">
                        <select
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value)}
                            className="appearance-none w-full px-4 py-2.5 pr-10 rounded-xl border focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm font-medium transition-all"
                            style={dropdownStyle}
                        >
                            <option value="all">All Status</option>
                            <option value="PLANNED">Planned</option>
                            <option value="ONGOING">Ongoing</option>
                            <option value="DELAYED">Delayed</option>
                            <option value="COMPLETED">Completed</option>
                            <option value="ARCHIVED">Archived</option>
                        </select>
                        <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400">▼</span>
                    </div>

                    
                    {/* <motion.button
                        className="relative group bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold px-6 py-2.5 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/25 overflow-hidden"
                        onClick={handleOpenCreate}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                        <div className="relative flex items-center gap-2">
                            <div className="bg-white/20 p-1 rounded-lg">
                                <Plus size={16} strokeWidth={3} />
                            </div>
                            <span>Create Project</span>
                        </div>
                    </motion.button> */}
                </div>
            </div>

            {/* Table Container */}
            <div 
                className="rounded-2xl shadow-xl overflow-hidden border backdrop-blur-xl mb-20"
                style={{ 
                    backgroundColor: isDarkMode ? "rgba(30, 41, 59, 0.4)" : "rgba(255, 255, 255, 0.6)",
                    borderColor: "rgba(255,255,255, 0.2)" 
                }}
            >
                {loading && projects.length === 0 ? (
                    <div className="p-6"><TableSkeleton /></div>
                ) : error ? (
                    <div className="p-10 text-center text-red-500 bg-red-50/50">{error}</div>
                ) : processedProjects.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                        <div className="bg-gray-100/50 p-4 rounded-full mb-3">
                            <Info size={32} className="text-gray-400" />
                        </div>
                        <h3 className="text-lg font-semibold opacity-80" style={{ color: colors.text }}>No projects found</h3>
                    </div>
                ) : (
                    <div className="overflow-x-auto min-h-[400px]">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="text-sm font-semibold uppercase tracking-wider" style={tableHeaderStyle}>
                                    {[
                                        { key: 'name', label: 'Project Name', icon: LayoutList },
                                        { key: 'organization', label: 'Organization', icon: Building2 },
                                        { key: 'status', label: 'Status', icon: Activity },
                                        { key: 'owner', label: 'Owner', icon: User },
                                        { key: 'description', label: 'Description', icon: FileText },
                                        { key: 'created_at', label: 'Created', icon: Calendar },
                                        { key: 'actions', label: '', icon: null } 
                                    ].map((header) => (
                                        <th 
                                            key={header.key} 
                                            className={`px-6 py-5 whitespace-nowrap ${header.key !== 'actions' ? 'cursor-pointer hover:opacity-70 transition-opacity' : ''}`}
                                            onClick={() => header.key !== 'actions' && handleSort(header.key)}
                                        >
                                            <div className="flex items-center gap-2">
                                                {header.icon && <header.icon size={16} className="opacity-70" />}
                                                {header.label}
                                                {header.key !== 'actions' && sortConfig.key === header.key && (
                                                    sortConfig.direction === 'ascending' ? <ChevronUp size={14}/> : <ChevronDown size={14}/>
                                                )}
                                                {header.key !== 'actions' && sortConfig.key !== header.key && <ArrowUpDown size={12} className="opacity-30" />}
                                            </div>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y" style={{ divideColor: colors.border }}>
                                <AnimatePresence>
                                    {processedProjects.map((project) => (
                                        <motion.tr 
                                            key={project.id}
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
                                                    {project.name}
                                                </div>
                                            </td>

                                            {/* Organization */}
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm opacity-80" style={{ color: colors.text }}>
                                                    {project.organization_name || project.organization?.name || '—'}
                                                </div>
                                            </td>

                                            {/* Status */}
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                                                    {project.status}
                                                </span>
                                            </td>

                                            {/* Owner */}
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-2" style={{ color: colors.text }}>
                                                    {getOwnerName(project)}
                                                </div>
                                            </td>

                                            {/* Description */}
                                            <td className="px-6 py-4">
                                                <div className="text-sm opacity-70 truncate max-w-[200px]" style={{ color: colors.text }} title={project.description}>
                                                    {project.description || '—'}
                                                </div>
                                            </td>

                                            {/* Date */}
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm opacity-70" style={{ color: colors.text }}>
                                                    {new Date(project.created_at).toLocaleDateString()}
                                                </div>
                                            </td>

                                            {/* Actions Dropdown */}
                                            <td className="px-6 py-4 whitespace-nowrap text-right relative">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setOpenDropdownId(openDropdownId === project.id ? null : project.id);
                                                    }}
                                                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                                                    style={{ color: colors.text }}
                                                >
                                                    <MoreVertical size={18} />
                                                </button>

                                                {openDropdownId === project.id && (
                                                    <div 
                                                        ref={dropdownRef}
                                                        className="absolute right-8 top-10 w-40 rounded-lg shadow-xl z-50 overflow-hidden border"
                                                        style={{ 
                                                            backgroundColor: colors.card,
                                                            borderColor: colors.border
                                                        }}
                                                    >
                                                        <button
                                                            onClick={(e) => handleOpenEdit(e, project)}
                                                            className="w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-2"
                                                            style={{ color: colors.text }}
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            onClick={(e) => {
                                                                e.preventDefault(); e.stopPropagation();
                                                                handleOpenTeam(project);
                                                            }}
                                                            className="w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-2"
                                                            style={{ color: colors.text }}
                                                        >
                                                            Manage Team
                                                        </button>
                                                        <button
                                                            onClick={(e) => handleDelete(e, project.id)}
                                                            className="w-full text-left px-4 py-2.5 text-sm hover:bg-red-50 text-red-600 transition-colors flex items-center gap-2"
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                )}
                                            </td>
                                        </motion.tr>
                                    ))}
                                </AnimatePresence>
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* --- MODALS --- */}
            
            {/* Create Project Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={handleCloseCreate}>
                    <div 
                        className="w-full max-w-md rounded-2xl border shadow-2xl overflow-hidden"
                        style={{ backgroundColor: colors.card, borderColor: colors.border }}
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="px-6 py-4 border-b flex justify-between items-center" style={{ borderColor: colors.border }}>
                            <h2 className="text-xl font-bold" style={{ color: colors.text }}>Create Project</h2>
                            <button onClick={handleCloseCreate} className="text-2xl opacity-50 hover:opacity-100">&times;</button>
                        </div>
                        <form onSubmit={handleSubmitCreate} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1" style={{ color: colors.text }}>Name</label>
                                <input 
                                    name="name" 
                                    value={formData.name} 
                                    onChange={handleInputChange} 
                                    required 
                                    className="w-full px-3 py-2 rounded-lg border bg-transparent outline-none focus:ring-2 focus:ring-indigo-500"
                                    style={{ color: colors.text, borderColor: colors.border }}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1" style={{ color: colors.text }}>Description</label>
                                <textarea 
                                    name="description" 
                                    value={formData.description} 
                                    onChange={handleInputChange} 
                                    required rows={3}
                                    className="w-full px-3 py-2 rounded-lg border bg-transparent outline-none focus:ring-2 focus:ring-indigo-500"
                                    style={{ color: colors.text, borderColor: colors.border }}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1" style={{ color: colors.text }}>Manager</label>
                                <select 
                                    name="project_manager_id" 
                                    value={formData.project_manager_id || ''} 
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 rounded-lg border bg-transparent outline-none focus:ring-2 focus:ring-indigo-500"
                                    style={{ color: colors.text, borderColor: colors.border }}
                                >
                                    <option value="" className="text-gray-800">Select Manager</option>
                                    {managers.map(m => (
                                        <option key={m.id} value={m.id} className="text-gray-800">{m.first_name} {m.last_name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1" style={{ color: colors.text }}>Status</label>
                                <select 
                                    name="status" 
                                    value={formData.status} 
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 rounded-lg border bg-transparent outline-none focus:ring-2 focus:ring-indigo-500"
                                    style={{ color: colors.text, borderColor: colors.border }}
                                >
                                    <option value="PLANNED" className="text-gray-800">Planned</option>
                                    <option value="ONGOING" className="text-gray-800">Ongoing</option>
                                    <option value="DELAYED" className="text-gray-800">Delayed</option>
                                    <option value="COMPLETED" className="text-gray-800">Completed</option>
                                    <option value="ARCHIVED" className="text-gray-800">Archived</option>
                                </select>
                            </div>
                            <div className="pt-4 flex justify-end gap-3">
                                <button type="button" onClick={handleCloseCreate} className="px-4 py-2 rounded-lg border hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors" style={{ color: colors.text, borderColor: colors.border }}>Cancel</button>
                                <button type="submit" disabled={loading} className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors">
                                    {loading ? 'Creating...' : 'Create'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Project Modal (Reuses similar structure) */}
            {isEditModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={handleCloseEdit}>
                    <div 
                        className="w-full max-w-md rounded-2xl border shadow-2xl overflow-hidden"
                        style={{ backgroundColor: colors.card, borderColor: colors.border }}
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="px-6 py-4 border-b flex justify-between items-center" style={{ borderColor: colors.border }}>
                            <h2 className="text-xl font-bold" style={{ color: colors.text }}>Edit Project</h2>
                            <button onClick={handleCloseEdit} className="text-2xl opacity-50 hover:opacity-100">&times;</button>
                        </div>
                        <form onSubmit={handleSubmitEdit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1" style={{ color: colors.text }}>Name</label>
                                <input 
                                    name="name" 
                                    value={formData.name} 
                                    onChange={handleInputChange} 
                                    required 
                                    className="w-full px-3 py-2 rounded-lg border bg-transparent outline-none focus:ring-2 focus:ring-indigo-500"
                                    style={{ color: colors.text, borderColor: colors.border }}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1" style={{ color: colors.text }}>Description</label>
                                <textarea 
                                    name="description" 
                                    value={formData.description} 
                                    onChange={handleInputChange} 
                                    required rows={3}
                                    className="w-full px-3 py-2 rounded-lg border bg-transparent outline-none focus:ring-2 focus:ring-indigo-500"
                                    style={{ color: colors.text, borderColor: colors.border }}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1" style={{ color: colors.text }}>Manager</label>
                                <select 
                                    name="project_manager_id" 
                                    value={formData.project_manager_id || ''} 
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 rounded-lg border bg-transparent outline-none focus:ring-2 focus:ring-indigo-500"
                                    style={{ color: colors.text, borderColor: colors.border }}
                                >
                                    <option value="" className="text-gray-800">Select Manager</option>
                                    {managers.map(m => (
                                        <option key={m.id} value={m.id} className="text-gray-800">{m.first_name} {m.last_name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1" style={{ color: colors.text }}>Status</label>
                                <select 
                                    name="status" 
                                    value={formData.status} 
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 rounded-lg border bg-transparent outline-none focus:ring-2 focus:ring-indigo-500"
                                    style={{ color: colors.text, borderColor: colors.border }}
                                >
                                    <option value="PLANNED" className="text-gray-800">Planned</option>
                                    <option value="ONGOING" className="text-gray-800">Ongoing</option>
                                    <option value="DELAYED" className="text-gray-800">Delayed</option>
                                    <option value="COMPLETED" className="text-gray-800">Completed</option>
                                    <option value="ARCHIVED" className="text-gray-800">Archived</option>
                                </select>
                            </div>
                            <div className="pt-4 flex justify-end gap-3">
                                <button type="button" onClick={handleCloseEdit} className="px-4 py-2 rounded-lg border hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors" style={{ color: colors.text, borderColor: colors.border }}>Cancel</button>
                                <button type="submit" disabled={loading} className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors">
                                    {loading ? 'Updating...' : 'Update'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Team Modal */}
            {isTeamModalOpen && (
                <Samanageteammodal
                    project={selectedProject}
                    onClose={() => setIsTeamModalOpen(false)}
                />
            )}

        </motion.section>
    );
};

export default Saprojects;