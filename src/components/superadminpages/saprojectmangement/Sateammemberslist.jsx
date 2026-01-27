import React, { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Saeditusermodal from "./Saeditusermodal"; 
import { 
  Info, 
  Search, 
  Eye, 
  ChevronUp, 
  ChevronDown, 
  Mail,
  Phone,
  Building2,
  Shield
} from "lucide-react";
import { useTheme } from "../../../context/ThemeContext";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const getInitials = (firstName, lastName) => {
  const first = firstName ? firstName[0] : '';
  const last = lastName ? lastName[0] : '';
  return `${first}${last}`.toUpperCase() || '??';
};

const TableSkeleton = () => (
  <div className="animate-pulse">
    {[...Array(5)].map((_, i) => (
      <div key={i} className="flex items-center gap-4 p-4 border-b border-gray-200/50">
        <div className="w-10 h-10 rounded-full bg-gray-300/50" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-300/50 rounded w-1/4" />
          <div className="h-3 bg-gray-300/50 rounded w-1/3" />
        </div>
        <div className="w-20 h-6 bg-gray-300/50 rounded-full" />
      </div>
    ))}
  </div>
);

const Sateammemberlist = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingMember, setEditingMember] = useState(null);
  
  const [roles, setRoles] = useState(["all"]);
  const [organizations, setOrganizations] = useState(["all"]);
  const [selectedOrganization, setSelectedOrganization] = useState("all");
  const [selectedRole, setSelectedRole] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });

  const { colors, isDarkMode } = useTheme();

  const fetchMembers = useCallback(async () => {
    // We intentionally don't set loading(true) here if data already exists 
    // to prevent the table from flashing white during a background refresh.
    // We only set it on the very first load.
    if (members.length === 0) setLoading(true);
    
    try {
      const authToken = localStorage.getItem("authToken");
      if (!authToken) throw new Error("Authentication token not found.");

      const response = await fetch(`${API_BASE_URL}/users/`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Failed to fetch team members.");
      const data = await response.json();
      setMembers(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []); // Remove dependency on members to avoid loops, or handle carefully.

  const fetchroles = useCallback(async () => {
    try {
      const token = localStorage.getItem("authToken");
      const res = await fetch(`${API_BASE_URL}/roles/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch roles");
      const data = await res.json();
      setRoles(["all", ...data.map((r) => r.name)]);
    } catch (err) {
      console.error("Error fetching roles:", err);
    }
  }, []);

  const fetchOrganization = useCallback(async () => {
    try {
      const token = localStorage.getItem("authToken");
      const res = await fetch(`${API_BASE_URL}/organizations/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch organizations");
      const data = await res.json();
      setOrganizations(["all", ...data.map((a) => a.name)]);
    } catch (err) {
      console.log("Error fetching organizations:", err);
    }
  }, []);

  useEffect(() => {
    // Initial fetch
    setLoading(true);
    Promise.all([fetchMembers(), fetchroles(), fetchOrganization()]).finally(() => setLoading(false));

    const handleOrgUpdate = () => fetchOrganization();
    
    window.addEventListener("organizationCreated", handleOrgUpdate);
    window.addEventListener("organizationUpdated", handleOrgUpdate);
    window.addEventListener("organizationDeleted", handleOrgUpdate);
    window.addEventListener('teamMemberAdded', fetchMembers);
    window.addEventListener('teamMemberUpdated', fetchMembers);

    return () => {
      window.removeEventListener("organizationCreated", handleOrgUpdate);
      window.removeEventListener("organizationUpdated", handleOrgUpdate);
      window.removeEventListener("organizationDeleted", handleOrgUpdate);
      window.removeEventListener('teamMemberAdded', fetchMembers);
      window.removeEventListener('teamMemberUpdated', fetchMembers);
    };
  }, [fetchroles, fetchOrganization]); 
  // removed fetchMembers from dependency to prevent infinite loops if we use it inside useEffect logic

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const sortedAndFilteredMembers = useMemo(() => {
    let filtered = members.filter((member) => {
      const memberOrgName = member.organization?.name || "N/A";
      const orgMatch = selectedOrganization === "all" || memberOrgName === selectedOrganization;
      const roleMatch = selectedRole === "all" || member.role === selectedRole;
      
      const searchLower = searchTerm.toLowerCase();
      const searchMatch = 
        (member.first_name?.toLowerCase() || "").includes(searchLower) ||
        (member.last_name?.toLowerCase() || "").includes(searchLower) ||
        (member.email?.toLowerCase() || "").includes(searchLower) ||
        (member.role?.toLowerCase() || "").includes(searchLower) ||
        (memberOrgName.toLowerCase().includes(searchLower));

      return orgMatch && roleMatch && searchMatch;
    });

    if (sortConfig.key) {
      filtered.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];
        
        if (sortConfig.key === 'organization') {
           aValue = a.organization?.name || "";
           bValue = b.organization?.name || "";
        }
        
        aValue = aValue ? aValue.toString().toLowerCase() : "";
        bValue = bValue ? bValue.toString().toLowerCase() : "";

        if (aValue < bValue) return sortConfig.direction === 'ascending' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'ascending' ? 1 : -1;
        return 0;
      });
    }
    return filtered;
  }, [members, selectedOrganization, selectedRole, searchTerm, sortConfig]);

  const tableHeaderStyle = {
    color: colors.text,
    borderBottom: `1px solid ${colors.border}`,
    backgroundColor: isDarkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.02)"
  };

  return (
    <motion.section 
      className="mt-8 mb-10"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight" style={{ color: colors.text }}>
            Members
          </h2>
          <p className="text-sm mt-1 opacity-70" style={{ color: colors.text }}>
            Manage your team access and roles
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
           <div className="relative flex-grow sm:flex-grow-0 sm:w-64">
             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
               <Search size={18} className="text-gray-400" />
             </div>
             <input
               type="text"
               placeholder="Search members..."
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
               className="w-full pl-10 pr-4 py-2.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all shadow-sm"
               style={{ 
                 backgroundColor: "rgba(255, 255, 255, 0.5)",
                 backdropFilter: "blur(10px)",
                 borderColor: colors.border,
                 color: colors.text
               }}
             />
           </div>

          <div className="relative sm:w-48">
            <select
              value={selectedOrganization}
              onChange={(e) => setSelectedOrganization(e.target.value)}
              className="appearance-none w-full px-4 py-2.5 pr-10 rounded-xl border focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm font-medium transition-all"
              style={{ 
                backgroundColor: "rgba(255, 255, 255, 0.5)",
                borderColor: colors.border,
                color: colors.text
              }}
            >
              {organizations.map((org) => (
                <option key={org} value={org}>
                  {org === "all" ? "All Organizations" : org}
                </option>
              ))}
            </select>
            <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400">▼</span>
          </div>

          <div className="relative sm:w-40">
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="appearance-none w-full px-4 py-2.5 pr-10 rounded-xl border focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm font-medium transition-all"
              style={{ 
                 backgroundColor: "rgba(255, 255, 255, 0.5)",
                 borderColor: colors.border,
                 color: colors.text
              }}
            >
              {roles.map((role) => (
                <option key={role} value={role}>
                  {role === "all" ? "All Roles" : role}
                </option>
              ))}
            </select>
            <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400">▼</span>
          </div>
        </div>
      </div>

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
        ) : sortedAndFilteredMembers.length === 0 ? (
           <div className="flex flex-col items-center justify-center py-16 text-center">
             <div className="bg-gray-100/50 p-4 rounded-full mb-3">
               <Info size={32} className="text-gray-400" />
             </div>
             <h3 className="text-lg font-semibold opacity-80" style={{ color: colors.text }}>No members found</h3>
           </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-sm font-semibold uppercase tracking-wider" style={tableHeaderStyle}>
                  {[
                    { key: 'first_name', label: 'Member', className: 'min-w-[200px]' },
                    { key: 'organization', label: 'Organization', className: 'min-w-[150px]' },
                     { key: 'role', label: 'Role', className: 'min-w-[120px]' },
                    { key: 'contact', label: 'Contact', noSort: true, className: 'min-w-[200px]' },
                    { key: 'is_active', label: 'Status', className: 'min-w-[100px]' },
                    { key: 'actions', label: '', noSort: true, className: 'w-16' }
                  ].map((header) => (
                    <th 
                      key={header.key} 
                      className={`px-6 py-5 whitespace-nowrap ${header.className || ''} ${!header.noSort ? 'cursor-pointer hover:opacity-70 transition-opacity' : ''}`}
                      onClick={() => !header.noSort && handleSort(header.key)}
                    >
                      <div className="flex items-center gap-2">
                        {header.label}
                        {!header.noSort && sortConfig.key === header.key && (
                          sortConfig.direction === 'ascending' ? <ChevronUp size={14}/> : <ChevronDown size={14}/>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y" style={{ divideColor: colors.border }}>
                <AnimatePresence>
                  {sortedAndFilteredMembers.map((member) => (
                    <motion.tr 
                      key={member.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      layout
                      className="group transition-colors duration-200"
                      style={{ borderTopColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}
                      whileHover={{ backgroundColor: isDarkMode ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)' }}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 rounded-full flex items-center justify-center text-sm font-bold shadow-sm flex-shrink-0" 
                               style={{ backgroundColor: '#e2e8f0', color: '#475569' }}>
                            {getInitials(member.first_name, member.last_name)}
                          </div>
                          <div className="min-w-0">
                            <div className="font-semibold text-base truncate" style={{ color: colors.text }}>
                              {member.first_name} {member.last_name}
                            </div>
                          </div>
                        </div>
                      </td>

                     

                      <td className="px-6 py-4 whitespace-nowrap">
                         <div className="flex items-center gap-2 text-sm" style={{ color: colors.text }}>
                           <Building2 size={16} className="opacity-50 flex-shrink-0" />
                           <span className="truncate max-w-[200px]">{member.organization?.name || '—'}</span>
                         </div>
                      </td>

                       <td className="px-6 py-4 whitespace-nowrap">
                         <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-sm font-medium bg-indigo-50/50 text-indigo-700 border border-indigo-100">
                           <Shield size={12} />
                           {member.role ? member.role.charAt(0).toUpperCase() + member.role.slice(1) : 'N/A'}
                         </span>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2 text-sm opacity-80" style={{ color: colors.text }}>
                             <Mail size={14} className="flex-shrink-0" /> <span className="truncate">{member.email}</span>
                          </div>
                          {member.phone && (
                            <div className="flex items-center gap-2 text-xs opacity-60" style={{ color: colors.text }}>
                               <Phone size={12} className="flex-shrink-0" /> <span className="truncate">{member.phone}</span>
                            </div>
                          )}
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ring-1 ring-inset ${
                          member.is_active 
                            ? 'bg-green-50 text-green-700 ring-green-600/20' 
                            : 'bg-red-50 text-red-700 ring-red-600/20'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${member.is_active ? 'bg-green-600' : 'bg-red-600'}`}></span>
                          {member.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-right whitespace-nowrap">
                         <button 
                           onClick={() => setEditingMember(member)}
                           className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-500 hover:text-indigo-600 tooltip"
                           title="View/Edit Details"
                         >
                           <Eye size={20} />
                         </button>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Saeditusermodal
        member={editingMember}
        onClose={() => setEditingMember(null)}
        /* FIX: We now just call 'fetchMembers' on update. 
           This ensures we get the full nested organization object from the server
           instead of the partial data (just ID) that the update response might provide.
        */
        onUpdate={fetchMembers}
        onDeleteSuccess={fetchMembers}
      />
    </motion.section>
  );
};

export default Sateammemberlist;