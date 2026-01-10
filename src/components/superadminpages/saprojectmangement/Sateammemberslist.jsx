// src/components/Dashboardpages/Project management/Sateammemberlist.jsx

import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import TeamMemberCard from "./Sateamcard";
import Saeditusermodal from "./Saeditusermodal";
import { Info } from "lucide-react";
import { useTheme } from "../../../context/ThemeContext";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


const TeamCardSkeleton = () => (
  <div className="bg-white/50 backdrop-blur-md border border-white/30 rounded-xl p-4 flex items-center gap-4 shadow-lg animate-pulse">
    <div className="w-16 h-16 rounded-full bg-gray-300/80" />
    <div className="flex-grow space-y-2">
      <div className="h-4 bg-gray-300/80 rounded w-1/3" />
      <div className="h-3 bg-gray-300/80 rounded w-1/2" />
    </div>
    <div className="h-6 w-20 bg-gray-300/80 rounded-full" />
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

  const { colors } = useTheme();

 
  const fetchMembers = useCallback(async () => {
    setLoading(true);
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
  }, []);


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

  // --- Fetch Organizations (Wrapped in useCallback) ---
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

  // --- Initial Load & Event Listeners ---
  useEffect(() => {
    // 1. Initial Fetch
    fetchMembers();
    fetchroles();
    fetchOrganization();

    // 2. Define handler for refreshing orgs
    const handleOrgUpdate = () => {
      fetchOrganization();
    };

    // 3. Add Listeners for Global Events
    // Make sure your Create/Edit/Delete modals dispatch these events!
    window.addEventListener("organizationCreated", handleOrgUpdate);
    window.addEventListener("organizationUpdated", handleOrgUpdate);
    window.addEventListener("organizationDeleted", handleOrgUpdate);

    // 4. Cleanup Listeners
    return () => {
      window.removeEventListener("organizationCreated", handleOrgUpdate);
      window.removeEventListener("organizationUpdated", handleOrgUpdate);
      window.removeEventListener("organizationDeleted", handleOrgUpdate);
    };
  }, [fetchMembers, fetchroles, fetchOrganization]);

  const filteredMembers = members.filter((member) => {
    const orgMatch =
      selectedOrganization === "all" ||
      member.organization === selectedOrganization;

    const roleMatch =
      selectedRole === "all" || member.role === selectedRole;

    return orgMatch && roleMatch;
  });

  const renderContent = () => {
    if (loading) {
      return (
        <div className="space-y-4">
          <TeamCardSkeleton />
          <TeamCardSkeleton />
          <TeamCardSkeleton />
        </div>
      );
    }

    if (error) {
      return (
        <p className="text-center mt-4 text-red-600 bg-red-100 p-3 rounded-lg">
          Error: {error}
        </p>
      );
    }

    if (filteredMembers.length === 0) {
      return (
        <div className="text-center mt-10 p-6 bg-white/50 backdrop-blur-md rounded-lg border border-white/30">
          <Info className="mx-auto h-12 w-12 text-gray-400" />
          <h3
            className="mt-2 text-lg font-semibold"
            style={{ color: colors.text }}
          >
            No Members Found
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Try adjusting the filters.
          </p>
        </div>
      );
    }

    return (
      <motion.div className="space-y-4">
        {filteredMembers.map((member) => (
          <TeamMemberCard
            key={member.id}
            member={member}
            onEdit={() => setEditingMember(member)}
          />
        ))}
      </motion.div>
    );
  };

  return (
    <section className="mt-16">
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-6">
        <h2
          className="pl-2 text-3xl font-bold tracking-tight"
          style={{ color: colors.text }}
        >
          Members
        </h2>

        <div className="flex flex-wrap gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1">
              Organization
            </label>
            <div className="relative">
              <select
                value={selectedOrganization}
                onChange={(e) => setSelectedOrganization(e.target.value)}
                className="
                  appearance-none
                  w-56
                  px-4 py-2.5
                  pr-10
                  rounded-xl
                  bg-white/70 backdrop-blur-md
                  border border-gray-200
                  shadow-sm
                  text-gray-800
                  font-medium
                  hover:shadow-md
                  focus:outline-none
                  focus:ring-2 focus:ring-gray-300
                  transition-all
                "
              >
                {organizations.map((org) => (
                  <option key={org} value={org}>
                    {org === "all" ? "All Organizations" : org}
                  </option>
                ))}
              </select>

              <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400">
                ▼
              </span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1">
              Role
            </label>
            <div className="relative">
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="
                  appearance-none
                  w-48
                  px-4 py-2.5
                  pr-10
                  rounded-xl
                  bg-white/70 backdrop-blur-md
                  border border-gray-200
                  shadow-sm
                  text-gray-800
                  font-medium
                  hover:shadow-md
                  focus:outline-none
                  focus:ring-2 focus:ring-gray-300
                  transition-all
                "
              >
                {roles.map((role) => (
                  <option key={role} value={role}>
                    {role === "all" ? "All Roles" : role}
                  </option>
                ))}
              </select>

              <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400">
                ▼
              </span>
            </div>
          </div>
        </div>
      </div>

      {renderContent()}

      <Saeditusermodal
        member={editingMember}
        onClose={() => setEditingMember(null)}
        onUpdate={(updated) =>
          setMembers((prev) =>
            prev.map((m) => (m.id === updated.id ? updated : m))
          )
        }
        onDeleteSuccess={(id) =>
          setMembers((prev) => prev.filter((m) => m.id !== id))
        }
      />
    </section>
  );
};

export default Sateammemberlist;