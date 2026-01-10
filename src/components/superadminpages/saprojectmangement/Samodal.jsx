import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UserPlus, X } from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Samodal = ({ isOpen, onClose }) => {
  const [inviteType, setInviteType] = useState("project");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");

  const [projects, setProjects] = useState([]);
  const [organizations, setOrganizations] = useState([]);
  const [roles, setRoles] = useState([]);

  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [selectedOrgId, setSelectedOrgId] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

 
  useEffect(() => {
    if (isOpen) {
      const authToken = localStorage.getItem("authToken");
      if (!authToken) {
        setError("Authentication token not found. Please log in again.");
        return;
      }

      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      };

      
      const fetchRoles = async () => {
        try {
          const res = await fetch(`${API_BASE_URL}/roles/`, { headers });
          if (!res.ok) throw new Error("Failed to fetch roles");
          const data = await res.json();
          setRoles(data);
          
         
          if (data.length > 0 && !role) {
            setRole(data[0].name);
          }
        } catch (err) {
          console.error("Error loading roles:", err);
        }
      };

    
      const fetchProjects = async () => {
        try {
          const res = await fetch(`${API_BASE_URL}/projects/`, { headers });
          if (!res.ok) throw new Error("Failed to fetch projects");
          const data = await res.json();
          const allProjects = Object.values(data).flat();
          setProjects(allProjects);
        } catch (err) {
          console.error("Error loading projects:", err);
        }
      };

      
      const fetchOrganizations = async () => {
        try {
          const res = await fetch(`${API_BASE_URL}/organizations/`, { headers });
          if (!res.ok) throw new Error("Failed to fetch organizations");
          const data = await res.json();
          setOrganizations(data);
        } catch (err) {
          console.error("Error loading organizations:", err);
        }
      };

      // Execute all fetches
      fetchRoles();
      fetchProjects();
      fetchOrganizations();
    }
  }, [isOpen]);

  const handleCloseAndReset = () => {
    onClose();
    setTimeout(() => {
      setInviteType("project");
      setEmail("");
      setRole("");
      setProjects([]);
      setOrganizations([]);
      setRoles([]);
      setSelectedProjectId("");
      setSelectedOrgId("");
      setSuccess(false);
      setIsSubmitting(false);
      setError(null);
    }, 300);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    const invitationData = {
      email,
      role,
    };

    let fetchUrl = "";

    if (inviteType === "project") {
      if (!selectedProjectId) {
        setError("Please select a project before sending an invitation.");
        setIsSubmitting(false);
        return;
      }
      fetchUrl = `${API_BASE_URL}/projects/${selectedProjectId}/members/invite-member/`;
    } else {
      if (!selectedOrgId) {
        setError("Please select an organization before sending an invitation.");
        setIsSubmitting(false);
        return;
      }
      invitationData.organization = selectedOrgId;
      fetchUrl = `${API_BASE_URL}/users/invite/`;
    }

    try {
      const authToken = localStorage.getItem("authToken");
      const response = await fetch(fetchUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(invitationData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage =
          errorData.detail ||
          errorData.email?.[0] ||
          "Failed to send invitation.";
        throw new Error(errorMessage);
      }
      setSuccess(true);
      setTimeout(handleCloseAndReset, 2000);
    } catch (err) {
      setError(err.message);
      setIsSubmitting(false);
    }
  };

  const backdropVariants = {
    visible: { opacity: 1 },
    hidden: { opacity: 0 },
  };

  const modalVariants = {
    hidden: { y: "-50vh", opacity: 0 },
    visible: {
      y: "0",
      opacity: 1,
      transition: { type: "spring", stiffness: 120, damping: 15 },
    },
    exit: { y: "50vh", opacity: 0, transition: { duration: 0.3 } },
  };

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex justify-center items-center p-4 bg-black/60 backdrop-blur-sm"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          onClick={handleCloseAndReset}
        >
          <motion.div
            className="bg-white/50 backdrop-blur-xl border border-white/30 rounded-2xl shadow-2xl z-50 w-full max-w-lg relative p-6"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <UserPlus /> Invite New Member
              </h2>
              <motion.button
                onClick={handleCloseAndReset}
                className="text-gray-500 p-2 rounded-full hover:bg-gray-500/10 hover:text-gray-800 focus:outline-none"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X />
              </motion.button>
            </div>

            {success ? (
              <div className="text-center py-8">
                <h3 className="text-xl font-semibold text-green-700">
                  Invitation Sent!
                </h3>
                <p className="text-gray-600 mt-2">
                  An invitation has been sent successfully.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                {error && (
                  <p className="mb-4 text-center text-red-600 bg-red-100 p-3 rounded-lg">
                    {error}
                  </p>
                )}

                {/* Invitation Type */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Invitation Type
                  </label>
                  <select
                    value={inviteType}
                    onChange={(e) => setInviteType(e.target.value)}
                    className="modal-input w-full p-3 rounded-lg bg-white/70 border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                  >
                    <option value="project">Invite to a Project</option>
                    <option value="organization">Invite to an Organization</option>
                  </select>
                </div>

                {/* Project Selection */}
                {inviteType === "project" && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Project
                    </label>
                    <select
                      value={selectedProjectId}
                      onChange={(e) => setSelectedProjectId(e.target.value)}
                      required
                      className="modal-input w-full p-3 rounded-lg bg-white/70 border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                    >
                      <option value="" disabled>
                        Select a project
                      </option>
                      {projects.length > 0 ? (
                        projects.map((project) => (
                          <option key={project.id} value={project.id}>
                            {project.name}
                          </option>
                        ))
                      ) : (
                        <option disabled>Loading projects...</option>
                      )}
                    </select>
                  </div>
                )}

                {/* Organization Selection */}
                {inviteType === "organization" && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Organization
                    </label>
                    <select
                      value={selectedOrgId}
                      onChange={(e) => setSelectedOrgId(e.target.value)}
                      required
                      className="modal-input w-full p-3 rounded-lg bg-white/70 border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                    >
                      <option value="" disabled>
                        Select an organization
                      </option>
                      {organizations.length > 0 ? (
                        organizations.map((org) => (
                          <option key={org.id} value={org.id}>
                            {org.name}
                          </option>
                        ))
                      ) : (
                        <option disabled>Loading organizations...</option>
                      )}
                    </select>
                  </div>
                )}

                {/* Email Input */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="Enter member's email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="modal-input w-full p-3 rounded-lg bg-white/70 border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                  />
                </div>

                {/* Role Selection */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Role
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    required
                    className="modal-input w-full p-3 rounded-lg bg-white/70 border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                  >
                    {roles.length === 0 ? (
                      <option value="" disabled>
                        Loading roles...
                      </option>
                    ) : (
                      roles.map((r) => (
                        <option key={r.id} value={r.name}>
                          {r.name}
                        </option>
                      ))
                    )}
                  </select>
                </div>

                {/* Buttons */}
                <div className="flex justify-end gap-3">
                  <motion.button
                    type="button"
                    onClick={handleCloseAndReset}
                    className="px-5 py-2.5 bg-gray-200/50 text-gray-800 rounded-lg font-semibold hover:bg-gray-200/80 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2.5 bg-gray-900 text-white rounded-lg font-semibold hover:bg-gray-700 transition-colors disabled:bg-gray-400"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {isSubmitting ? "Sending..." : "Send Invitation"}
                  </motion.button>
                </div>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Samodal;