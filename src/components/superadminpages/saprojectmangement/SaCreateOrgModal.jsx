import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Building2, X, Plus, Pencil, Trash2, ArrowLeft, Globe, FileText, Loader2 } from "lucide-react";
import { useTheme } from "../../../context/ThemeContext";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const SaCreateOrgModal = ({ isOpen, onClose, onSuccess }) => {
  const { colors, theme } = useTheme(); // Import theme context

  // View State: 'list' or 'form'
  const [view, setView] = useState("list"); 
  
  // Data States
  const [organizations, setOrganizations] = useState([]);
  const [organizationToEdit, setOrganizationToEdit] = useState(null);
  
  // Form States
  const [name, setName] = useState("");
  const [domain, setDomain] = useState("");
  const [description, setDescription] = useState("");

  // UI States
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState("");

  // --- 1. Fetch Organizations (List View) ---
  const fetchOrganizations = async () => {
    setIsLoading(true);
    try {
      const authToken = localStorage.getItem("authToken");
      const response = await fetch(`${API_BASE_URL}/organizations/`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (!response.ok) throw new Error("Failed to load organizations");
      const data = await response.json();
      setOrganizations(data);
    } catch (err) {
      console.error(err);
      setError("Could not load organizations.");
    } finally {
      setIsLoading(false);
    }
  };

  // Reset when modal opens
  useEffect(() => {
    if (isOpen) {
      setView("list");
      setError(null);
      setSuccessMsg("");
      fetchOrganizations();
    }
  }, [isOpen]);

  // --- 2. Navigation Handlers ---
  const handleSwitchToCreate = () => {
    setOrganizationToEdit(null);
    setName("");
    setDomain("");
    setDescription("");
    setError(null);
    setSuccessMsg("");
    setView("form");
  };

  const handleSwitchToEdit = (org) => {
    setOrganizationToEdit(org);
    setName(org.name);
    setDomain(org.domain);
    setDescription(org.description || "");
    setError(null);
    setSuccessMsg("");
    setView("form");
  };

  const handleBackToList = () => {
    setError(null);
    setSuccessMsg("");
    setView("list");
  };

  const handleClose = () => {
    onClose();
    if (onSuccess) onSuccess(); 
  };

  // --- 3. CRUD Operations ---

  // DELETE
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure? This cannot be undone.")) return;

    try {
      const authToken = localStorage.getItem("authToken");
      const response = await fetch(`${API_BASE_URL}/organizations/${id}/`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${authToken}` },
      });

      if (!response.ok) throw new Error("Failed to delete.");

      setOrganizations((prev) => prev.filter((o) => o.id !== id));
      setSuccessMsg("Organization deleted.");
      setTimeout(() => setSuccessMsg(""), 2000);
      if (onSuccess) onSuccess();

    } catch (err) {
      setError(err.message);
    }
  };

  // CREATE / UPDATE
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const authToken = localStorage.getItem("authToken");
      const isEdit = !!organizationToEdit;
      
      const url = isEdit 
        ? `${API_BASE_URL}/organizations/${organizationToEdit.id}/` 
        : `${API_BASE_URL}/organizations/`;
      
      const method = isEdit ? "PUT" : "POST";

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ name, domain, description }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Operation failed.");
      }

      await fetchOrganizations();
      setView("list");
      setSuccessMsg(isEdit ? "Organization updated!" : "Organization created!");
      setTimeout(() => setSuccessMsg(""), 2000);
      if (onSuccess) onSuccess();

    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Animations ---
  const backdropVariants = {
    visible: { opacity: 1 },
    hidden: { opacity: 0 },
  };

  const modalVariants = {
    hidden: { y: "100%", opacity: 0 },
    visible: { 
        y: "0%", 
        opacity: 1, 
        transition: { type: "spring", stiffness: 100, damping: 15 } 
    },
    exit: { y: "100%", opacity: 0, transition: { duration: 0.3 } },
  };

  // Common Styles based on theme
  const modalBg = { backgroundColor: colors.card, color: colors.text };
  const inputStyle = { 
    backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff', 
    color: colors.text, 
    borderColor: colors.border 
  };
  const listBg = { backgroundColor: theme === 'dark' ? '#111827' : '#F9FAFB' }; // Slightly darker than card for content area
  const itemBg = { backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff', borderColor: colors.border };

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex justify-center items-end sm:items-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          onClick={handleClose}
        >
          <motion.div
            className="border rounded-t-2xl sm:rounded-2xl shadow-2xl w-full max-w-2xl relative flex flex-col max-h-[90vh] sm:max-h-[85vh] overflow-hidden"
            style={{ ...modalBg, borderColor: colors.border }}
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
          >
            {/* --- Header --- */}
            <div 
                className="flex justify-between items-center p-5 border-b z-10"
                style={{ borderBottomColor: colors.border, backgroundColor: colors.card }}
            >
              <div className="flex items-center gap-3">
                {view === "form" ? (
                    <button 
                        onClick={handleBackToList}
                        className="p-1.5 rounded-full hover:bg-gray-100/10 text-gray-500 transition-colors"
                    >
                        <ArrowLeft size={20} />
                    </button>
                ) : (
                    <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
                        <Building2 size={20} />
                    </div>
                )}
                <h2 className="text-xl font-bold" style={{ color: colors.text }}>
                  {view === "list" ? "Manage Organizations" : (organizationToEdit ? "Edit Organization" : "Create Organization")}
                </h2>
              </div>
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* --- Content Area (Scrollable) --- */}
            <div className="flex-1 overflow-y-auto p-5" style={listBg}>
                
                {/* Messages */}
                {error && (
                    <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm text-center">
                        {error}
                    </div>
                )}
                {successMsg && (
                    <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg text-sm text-center font-medium">
                        {successMsg}
                    </div>
                )}

                {/* --- VIEW: LIST --- */}
                {view === "list" && (
                    <div className="space-y-4">
                        <motion.button
                            onClick={handleSwitchToCreate}
                            className="w-full py-3 border-2 border-dashed rounded-xl flex items-center justify-center gap-2 transition-all group font-semibold"
                            style={{ 
                                borderColor: colors.border, 
                                color: colors.text,
                                opacity: 0.7 
                            }}
                            whileHover={{ scale: 1.01, opacity: 1, borderColor: '#6366f1', color: '#6366f1' }}
                            whileTap={{ scale: 0.99 }}
                        >
                            <Plus size={20} /> Create New Organization
                        </motion.button>

                        {isLoading ? (
                             <div className="flex justify-center py-10 text-gray-400"><Loader2 className="animate-spin" /></div>
                        ) : organizations.length === 0 ? (
                            <div className="text-center py-10 text-gray-400">No organizations found.</div>
                        ) : (
                            <div className="space-y-3">
                                {organizations.map(org => (
                                    <motion.div 
                                        key={org.id} 
                                        layoutId={org.id}
                                        className="p-4 rounded-xl border shadow-sm hover:shadow-md transition-shadow flex justify-between items-start"
                                        style={itemBg}
                                    >
                                        <div className="space-y-1">
                                            <h3 className="font-bold" style={{ color: colors.text }}>{org.name}</h3>
                                            <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
                                                <Globe size={12}/> {org.domain}
                                            </div>
                                            {org.description && (
                                                <p className="text-sm text-gray-500 mt-1 line-clamp-1 flex items-center gap-1">
                                                    <FileText size={12} className="text-gray-400"/> {org.description}
                                                </p>
                                            )}
                                        </div>
                                        <div className="flex gap-2">
                                            <button 
                                                onClick={() => handleSwitchToEdit(org)}
                                                className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50/10 rounded-lg transition-colors"
                                            >
                                                <Pencil size={18} />
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(org.id)}
                                                className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50/10 rounded-lg transition-colors"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* --- VIEW: FORM (Create/Edit) --- */}
                {view === "form" && (
                    <motion.form 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        onSubmit={handleSubmit}
                        className="space-y-4"
                    >
                        <div className="space-y-1">
                            <label className="text-sm font-semibold" style={{ color: colors.text }}>Organization Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                placeholder="e.g. Dreamwave Innovations"
                                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all placeholder-gray-400"
                                style={inputStyle}
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-semibold" style={{ color: colors.text }}>Domain</label>
                            <input
                                type="text"
                                value={domain}
                                onChange={(e) => setDomain(e.target.value)}
                                required
                                placeholder="e.g. dreamwave.com"
                                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all placeholder-gray-400"
                                style={inputStyle}
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-semibold" style={{ color: colors.text }}>Description</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={4}
                                placeholder="Brief description..."
                                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all resize-none placeholder-gray-400"
                                style={inputStyle}
                            />
                        </div>

                        <div className="pt-4 flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={handleBackToList}
                                className="px-5 py-2.5 rounded-lg font-medium transition-colors"
                                style={{ backgroundColor: theme === 'dark' ? '#374151' : '#f3f4f6', color: colors.text }}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="px-5 py-2.5 rounded-lg text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                style={{ backgroundColor: '#111827' }} // Keeping primary button black/dark for consistency
                            >
                                {isSubmitting ? <Loader2 size={18} className="animate-spin"/> : null}
                                {organizationToEdit ? "Save Changes" : "Create Organization"}
                            </button>
                        </div>
                    </motion.form>
                )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SaCreateOrgModal;