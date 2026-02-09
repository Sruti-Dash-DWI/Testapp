import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Building2, Search, Info, ChevronUp, ChevronDown, 
    Calendar, CreditCard, Eye, CheckCircle, 
    User, HardDrive, FileCode, ArrowRight, ShieldCheck, X,
    Activity, DollarSign, Layers
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext'; 

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


const AVAILABLE_PLANS = [
    {
        id: 'free',
        name: 'Free Trial',
        price: '$0',
        period: '14 Days',
        features: { users: 5, storage: '1 GB', testCases: 100 },
        color: 'from-gray-500 to-gray-700'
    },
    {
        id: 'monthly',
        name: 'Pro Monthly',
        price: '$29',
        period: '/month',
        features: { users: 20, storage: '50 GB', testCases: 5000 },
        color: 'from-blue-500 to-indigo-600'
    },
    {
        id: 'yearly',
        name: 'Enterprise Yearly',
        price: '$290',
        period: '/year',
        features: { users: 100, storage: '1 TB', testCases: 'Unlimited' },
        color: 'from-violet-600 to-purple-600'
    }
];



const SummaryCard = ({ title, value, icon: Icon, colorClass, delay }) => {
    const { colors } = useTheme();
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay }}
            className="p-6 rounded-2xl shadow-lg border backdrop-blur-md flex items-center gap-4"
            style={{ 
                backgroundColor: "rgba(255,255,255,0.05)", 
                borderColor: colors.border,
                color: colors.text
            }}
        >
            <div className={`p-3 rounded-xl ${colorClass}`}>
                <Icon size={24} className="text-white" />
            </div>
            <div>
                <p className="text-sm opacity-70">{title}</p>
                <h3 className="text-2xl font-bold">{value}</h3>
            </div>
        </motion.div>
    );
};

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

// --- Subscription Modal Component ---
const SubscriptionDetailsModal = ({ isOpen, onClose, subscription, onUpgrade }) => {
    const { colors } = useTheme();
    const [view, setView] = useState('details'); // 'details' | 'plans' | 'processing' | 'success'
    const [selectedPlan, setSelectedPlan] = useState(null);

    useEffect(() => {
        if (isOpen) {
            setView('details');
            setSelectedPlan(null);
        }
    }, [isOpen]);

    if (!isOpen || !subscription) return null;

    const handlePlanSelect = (plan) => {
        setSelectedPlan(plan);
    };

    const handleProceedPayment = () => {
        setView('processing');
        // Simulate API call for payment
        setTimeout(() => {
            setView('success');
            // Trigger the parent update function after animation
            setTimeout(() => {
                onUpgrade(subscription.org_id, selectedPlan);
            }, 1500); 
        }, 2000);
    };

    // Calculate usage percentages safely
    const getPercentage = (used, total) => {
        if (!total || total === 0) return 0;
        if (total === 'Unlimited') return 10; 
        return Math.min((used / total) * 100, 100);
    };

    // Handle data structure from API
    const details = subscription.details || subscription; // Fallback if structure varies slightly

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
                style={{ backgroundColor: colors.background, color: colors.text, border: `1px solid ${colors.border}` }}
            >
                {/* Header */}
                <div className="p-6 border-b flex justify-between items-center" style={{ borderColor: colors.border }}>
                    <div>
                        <h2 className="text-2xl font-bold">{details.org_name}</h2>
                        <div className="flex items-center gap-2 text-sm opacity-70">
                            <span>{details.domain}</span>
                            <span>•</span>
                            <span>{details.owner_email}</span>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100/10 rounded-full transition-colors">
                        <X size={24} />
                    </button>
                </div>

                {/* Content Area */}
                <div className="p-6 overflow-y-auto custom-scrollbar">
                    
                    {/* View 1: Usage Details */}
                    {view === 'details' && (
                        <div className="space-y-6">
                            {/* Current Plan Badge */}
                            <div className="flex items-center justify-between bg-gradient-to-r from-indigo-500/10 to-purple-500/10 p-4 rounded-xl border border-indigo-500/20">
                                <div>
                                    <p className="text-sm font-medium opacity-70">Current Plan</p>
                                    <h3 className="text-xl font-bold text-indigo-500">{details.plan_name}</h3>
                                    <span className={`text-xs px-2 py-0.5 rounded-full mt-1 inline-block ${details.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-700'}`}>
                                        {details.status}
                                    </span>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm opacity-70">Renewal Date</p>
                                    <p className="font-semibold">{details.renewal_date || 'N/A'}</p>
                                    {details.amount > 0 && <p className="text-sm font-medium text-green-600 mt-1">${details.amount}</p>}
                                </div>
                            </div>

                            {/* Usage Stats */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {/* Users */}
                                <div className="p-4 rounded-xl border bg-gray-50/5" style={{ borderColor: colors.border }}>
                                    <div className="flex items-center gap-2 mb-3 text-blue-500">
                                        <User size={20} />
                                        <span className="font-semibold">Users</span>
                                    </div>
                                    <div className="text-2xl font-bold mb-1">
                                        {details.users_used} <span className="text-sm opacity-50 font-normal">/ {details.users_limit}</span>
                                    </div>
                                    <div className="w-full h-2 bg-gray-200/20 rounded-full overflow-hidden">
                                        <div 
                                            className="h-full bg-blue-500" 
                                            style={{ width: `${getPercentage(details.users_used, details.users_limit)}%` }}
                                        />
                                    </div>
                                </div>

                                {/* Test Cases */}
                                <div className="p-4 rounded-xl border bg-gray-50/5" style={{ borderColor: colors.border }}>
                                    <div className="flex items-center gap-2 mb-3 text-green-500">
                                        <FileCode size={20} />
                                        <span className="font-semibold">Test Cases</span>
                                    </div>
                                    <div className="text-2xl font-bold mb-1">
                                        {details.testcases_used} <span className="text-sm opacity-50 font-normal">/ {details.testcases_limit}</span>
                                    </div>
                                    <div className="w-full h-2 bg-gray-200/20 rounded-full overflow-hidden">
                                        <div 
                                            className="h-full bg-green-500" 
                                            style={{ width: `${getPercentage(details.testcases_used, details.testcases_limit)}%` }}
                                        />
                                    </div>
                                </div>

                                {/* Storage - API only gives limit currently, handling gracefully */}
                                <div className="p-4 rounded-xl border bg-gray-50/5" style={{ borderColor: colors.border }}>
                                    <div className="flex items-center gap-2 mb-3 text-purple-500">
                                        <HardDrive size={20} />
                                        <span className="font-semibold">Storage</span>
                                    </div>
                                    <div className="text-2xl font-bold mb-1">
                                        {details.storage_limit} <span className="text-sm font-normal">GB</span>
                                    </div>
                                    <div className="w-full h-2 bg-gray-200/20 rounded-full overflow-hidden">
                                        {/* Just a full bar or empty since we don't know used */}
                                        <div className="h-full bg-purple-500 w-full opacity-20" />
                                    </div>
                                </div>
                            </div>

                            <button 
                                onClick={() => setView('plans')}
                                className="w-full py-3 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white rounded-xl font-semibold shadow-lg shadow-indigo-500/20 transition-all flex items-center justify-center gap-2"
                            >
                                <ShieldCheck size={18} /> Upgrade Plan
                            </button>
                        </div>
                    )}

                    {/* View 2: Select Plan */}
                    {view === 'plans' && (
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold mb-4">Select a Plan</h3>
                            <div className="grid gap-4">
                                {AVAILABLE_PLANS.map((plan) => (
                                    <div 
                                        key={plan.id}
                                        onClick={() => handlePlanSelect(plan)}
                                        className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all ${
                                            selectedPlan?.id === plan.id 
                                            ? 'border-indigo-500 bg-indigo-500/5' 
                                            : 'border-transparent bg-gray-100/5 hover:border-gray-300/30'
                                        }`}
                                    >
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center gap-4">
                                                <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${plan.color} flex items-center justify-center text-white font-bold text-xl`}>
                                                    {plan.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <h4 className="font-bold">{plan.name}</h4>
                                                    <p className="text-sm opacity-70">
                                                        {plan.features.users} Users • {plan.features.storage} • {plan.features.testCases === 'Unlimited' ? 'Unlimited Tests' : `${plan.features.testCases} Tests`}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-xl font-bold">{plan.price}</span>
                                                <span className="text-sm opacity-60">{plan.period}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            
                            <div className="flex gap-3 mt-6">
                                <button 
                                    onClick={() => setView('details')}
                                    className="flex-1 py-3 rounded-xl border hover:bg-gray-100/10 transition-colors font-medium"
                                    style={{ borderColor: colors.border }}
                                >
                                    Back
                                </button>
                                <button 
                                    disabled={!selectedPlan}
                                    onClick={handleProceedPayment}
                                    className={`flex-1 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all ${
                                        selectedPlan 
                                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25' 
                                        : 'bg-gray-300/20 text-gray-400 cursor-not-allowed'
                                    }`}
                                >
                                    Proceed to Payment <ArrowRight size={16} />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* View 3: Processing Payment */}
                    {view === 'processing' && (
                        <div className="flex flex-col items-center justify-center py-12">
                            <motion.div 
                                animate={{ rotate: 360 }}
                                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                                className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full mb-4"
                            />
                            <h3 className="text-xl font-semibold">Processing Payment...</h3>
                            <p className="opacity-60 text-sm mt-2">Please do not close this window.</p>
                        </div>
                    )}

                    {/* View 4: Success */}
                    {view === 'success' && (
                        <div className="flex flex-col items-center justify-center py-8">
                            <motion.div 
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", stiffness: 200, damping: 10 }}
                                className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center text-white mb-6 shadow-xl shadow-green-500/30"
                            >
                                <CheckCircle size={40} strokeWidth={3} />
                            </motion.div>
                            <h3 className="text-2xl font-bold text-green-500 mb-2">Payment Successful!</h3>
                            <p className="opacity-70 text-center mb-6 max-w-xs">
                                The organization <b>{details.org_name}</b> has been upgraded to the <b>{selectedPlan?.name}</b>.
                            </p>
                            <button 
                                onClick={onClose}
                                className="px-8 py-3 bg-gray-100/10 hover:bg-gray-100/20 border rounded-xl transition-all"
                                style={{ borderColor: colors.border }}
                            >
                                Close
                            </button>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

// --- Main Component ---
const Sasubscription = () => {
    const [organizations, setOrganizations] = useState([]);
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // Filtering & Sorting
    const [searchTerm, setSearchTerm] = useState("");
    const [sortConfig, setSortConfig] = useState({ key: 'org_name', direction: 'ascending' });
    
    // Modal States
    const [selectedSubscription, setSelectedSubscription] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loadingDetails, setLoadingDetails] = useState(false);

    const { colors, isDarkMode } = useTheme();

    const fetchSubscriptions = async () => {
        setLoading(true);
        try {
            const authToken = localStorage.getItem('authToken');
            if (!authToken) throw new Error("Authentication token not found.");

            const response = await fetch(`${API_BASE_URL}/admin/subscriptions/dashboard/`, {
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) throw new Error("Failed to fetch subscription dashboard.");
            
            const data = await response.json();
            setOrganizations(data.organizations || []);
            setSummary(data.summary || {});
            setError(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSubscriptions();
    }, []);

    // Fetch details for specific ID when clicking "View"
    const handleViewDetails = async (orgId) => {
        setLoadingDetails(true);
        try {
            const authToken = localStorage.getItem('authToken');
            const response = await fetch(`${API_BASE_URL}/admin/subscriptions/organizations/${orgId}/`, {
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) throw new Error("Failed to fetch organization details.");
            
            const data = await response.json();
            // Store the full details object
            setSelectedSubscription(data); 
            setIsModalOpen(true);
        } catch (err) {
            console.error(err.message);
            // Optional: Show toast error here
        } finally {
            setLoadingDetails(false);
        }
    };

    // Handle "Mock" Upgrade (Visual Update Only)
    const handleUpgradeSuccess = (orgId, newPlan) => {
        // 1. Update the organizations list locally
        setOrganizations(prev => prev.map(org => {
            if (org.org_id === orgId) {
                // Determine new limits based on mock plan data
                const usersLimit = newPlan.features.users;
                const testLimit = newPlan.features.testCases === 'Unlimited' ? 99999 : newPlan.features.testCases;
                const storageLimit = newPlan.features.storage === '1 TB' ? 1000 : parseInt(newPlan.features.storage);
                
                return {
                    ...org,
                    plan_name: newPlan.name,
                    status: 'Active',
                    renewal_date: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0], // Mock next month
                    users_limit: usersLimit,
                    testcases_limit: testLimit,
                    storage_limit: storageLimit
                };
            }
            return org;
        }));

        // 2. Also update the currently open details modal data if needed
        setSelectedSubscription(prev => ({
            ...prev,
            details: {
                ...prev.details,
                plan_name: newPlan.name,
                status: 'Active'
            }
        }));
    };

    // Sorting & Filtering Logic
    const handleSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const sortedAndFilteredOrgs = useMemo(() => {
        let filtered = organizations.filter((org) => {
            const searchLower = searchTerm.toLowerCase();
            return (
                (org.org_name || "").toLowerCase().includes(searchLower) ||
                (org.owner_email || "").toLowerCase().includes(searchLower) ||
                (org.plan_name || "").toLowerCase().includes(searchLower) ||
                (org.domain || "").toLowerCase().includes(searchLower)
            );
        });

        if (sortConfig.key) {
            filtered.sort((a, b) => {
                let aValue = a[sortConfig.key];
                let bValue = b[sortConfig.key];
                
                // Handle null/undefined
                if (!aValue) aValue = "";
                if (!bValue) bValue = "";

                // String comparison (case insensitive)
                if (typeof aValue === 'string') {
                    aValue = aValue.toLowerCase();
                    bValue = bValue.toLowerCase();
                }

                if (aValue < bValue) return sortConfig.direction === 'ascending' ? -1 : 1;
                if (aValue > bValue) return sortConfig.direction === 'ascending' ? 1 : -1;
                return 0;
            });
        }
        return filtered;
    }, [organizations, searchTerm, sortConfig]);

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
            <div className="mb-8">
                <h1 className="text-4xl font-bold tracking-tight mb-2" style={{ color: colors.text }}>Subscriptions</h1>
                <p className="text-lg opacity-70 mb-6" style={{ color: colors.text }}>Manage organization plans, billing and limits.</p>
                
                {/* Summary Cards */}
                {summary && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <SummaryCard 
                            title="Total Monthly Revenue" 
                            value={`$${summary.total_monthly_revenue || 0}`} 
                            icon={DollarSign} 
                            colorClass="bg-green-500" 
                            delay={0.1} 
                        />
                        <SummaryCard 
                            title="Active Subscriptions" 
                            value={summary.active_subscriptions || 0} 
                            icon={Activity} 
                            colorClass="bg-blue-500" 
                            delay={0.2} 
                        />
                        <SummaryCard 
                            title="Total Organizations" 
                            value={summary.total_organizations || 0} 
                            icon={Layers} 
                            colorClass="bg-purple-500" 
                            delay={0.3} 
                        />
                    </div>
                )}

                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                    {/* Search Input */}
                    <div className="relative w-full sm:w-96">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search size={18} className="text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search Org, Domain, Email or Plan..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all shadow-sm w-full"
                            style={dropdownStyle}
                        />
                    </div>
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
                        <h3 className="text-lg font-semibold opacity-80" style={{ color: colors.text }}>No subscriptions found</h3>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="text-sm font-semibold uppercase tracking-wider" style={tableHeaderStyle}>
                                    {[
                                        { key: 'org_name', label: 'Organization', icon: Building2 },
                                        { key: 'owner_email', label: 'Owner Email', icon: User },
                                        { key: 'plan_name', label: 'Current Plan', icon: ShieldCheck },
                                        { key: 'status', label: 'Status', icon: Info },
                                        { key: 'renewal_date', label: 'Renewal Date', icon: Calendar },
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
                                            </div>
                                        </th>
                                    ))}
                                    <th className="px-6 py-5 text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y" style={{ divideColor: colors.border }}>
                                <AnimatePresence>
                                    {sortedAndFilteredOrgs.map((org) => (
                                        <motion.tr 
                                            key={org.org_id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            layout
                                            className="group transition-colors duration-200"
                                            style={{ borderTopColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}
                                            whileHover={{ backgroundColor: isDarkMode ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)' }}
                                        >
                                            {/* Organization */}
                                            <td className="px-6 py-4 whitespace-nowrap font-medium">
                                                <div>{org.org_name}</div>
                                                <div className="text-xs opacity-50 font-normal">{org.domain}</div>
                                            </td>

                                            {/* Owner */}
                                            <td className="px-6 py-4 whitespace-nowrap text-sm opacity-90">
                                                {org.owner_email}
                                            </td>

                                            {/* Plan */}
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                                                    org.plan_name === 'No Plan' ? 'bg-gray-100 text-gray-800 border-gray-200' :
                                                    'bg-indigo-100 text-indigo-800 border-indigo-200'
                                                }`}>
                                                    {org.plan_name}
                                                </span>
                                            </td>

                                            {/* Status */}
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`text-sm ${
                                                    org.status === 'No Subscription' ? 'text-gray-500' : 'text-green-500 font-medium'
                                                }`}>
                                                    {org.status}
                                                </span>
                                            </td>

                                            {/* Date */}
                                            <td className="px-6 py-4 whitespace-nowrap text-sm opacity-80">
                                                {org.renewal_date || '—'}
                                            </td>

                                            {/* Action */}
                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                <motion.button 
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.9 }}
                                                    disabled={loadingDetails}
                                                    onClick={() => handleViewDetails(org.org_id)}
                                                    className={`p-2 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors ${loadingDetails ? 'opacity-50 cursor-wait' : ''}`}
                                                    title="View Details & Upgrade"
                                                >
                                                    <Eye size={18} />
                                                </motion.button>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </AnimatePresence>
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <SubscriptionDetailsModal 
                        isOpen={isModalOpen} 
                        onClose={() => setIsModalOpen(false)}
                        subscription={selectedSubscription}
                        onUpgrade={handleUpgradeSuccess}
                    />
                )}
            </AnimatePresence>

        </motion.section>
    );
};

export default Sasubscription;