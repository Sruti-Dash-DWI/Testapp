import React, { useState, useEffect, useRef } from 'react';
// import DashboardLayout from '../layout/DashboardLayout';
import { Link } from "react-router-dom"
import { MoreVertical, Calendar, User, LayoutList } from 'lucide-react';
import Samanageteammodal from './Samanageteammodal';
import { useTheme } from '../../../context/ThemeContext';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Saprojects = () => {
  const [show, setShow] = useState(false);
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [managers, setManagers] = useState([]);
  const { theme, colors } = useTheme();

  // --- STATES ADDED FOR TEAM MODAL ---
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  // --- STATES ADDED FOR EDIT MODAL ---
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  // --- STATE FOR DROPDOWN MENU ---
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const dropdownRef = useRef(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    owner: '',
    status: 'PLANNED',
    project_manager_id: null
  });


  useEffect(() => {
    fetchProjects();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdownId(null);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    setError(null);

    try {
      const authToken = localStorage.getItem('authToken');

      if (!authToken) {
        setError('Please login to view projects');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/projects/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
      });

      if (response.status === 401) {
        setError('Session expired. Please login again');
        return;
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const groupedData = await response.json();
      const allProjects = Object.values(groupedData).flat();
      setProjects(allProjects);

    } catch (error) {
      console.error('Error fetching projects:', error);
      setError('Failed to fetch projects. Please try again.');
    }
    finally {
      setLoading(false);
    }
  };

  const fetchManagers = async () => {
    try {
      const authToken = localStorage.getItem('authToken');
      if (!authToken) {
        console.warn('Auth token not found.');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/users/list/?role=manager`, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch managers. Status: ${response.status}`);
      }

      const data = await response.json();
      const managerList = data.results || data;
      setManagers(managerList);
    } catch (error) {
      console.error('Error fetching managers:', error);
    }
  };



  const handleClose = () => {
    setShow(false);
    setFormData({
      name: '',
      description: '',
      owner: '',
      status: 'PLANNED',
      project_manager_id: '',
    });
  };
  const handleShow = () => {
    fetchManagers();
    setShow(true);
  };



  const handleInputChange = (e) => {
    const { name, value } = e.target;

    const finalValue = (name === 'project_manager_id' && value === '') ? null : value;

    setFormData(prevData => ({
      ...prevData,
      [name]: finalValue
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
      setError('You must be logged in to create a project.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/projects/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Failed to create project');
      }

      window.dispatchEvent(new CustomEvent('projectListUpdated'));

      fetchProjects();
      handleClose();
      setFormData({
        name: '',
        description: '',
        owner: '',
        status: 'PLANNED',
        project_manager_id: null
      });

    } catch (error) {
      console.error('Error creating project:', error);
      setError('Failed to create project. Please check server connection.');
    } finally {
      setLoading(false);
    }
  };

  // Helper for status colors
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

  const handleProjectClick = (project) => {
    localStorage.setItem("activeProjectId", project.id);
    localStorage.setItem("activeProjectName", project.name);
  }

  const handleDelete = async (e, activeProjectId) => {
    e.preventDefault();
    e.stopPropagation();

    const userConfirmed = window.confirm(
      "Are you sure you want to delete this project? This action cannot be undone."
    );

    if (userConfirmed) {
      try {
        const authToken = localStorage.getItem('authToken');
        const response = await fetch(`${API_BASE_URL}/projects/${activeProjectId}/`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${authToken}`
          },
        });

        if (response.ok) {
          setProjects(currentProjects =>
            currentProjects.filter(project => project.id !== activeProjectId)
          );
          console.log(`Project with ID ${activeProjectId} deleted successfully.`);
        } else {
          const errorData = await response.json();
          console.error("Failed to delete project:", errorData.message || response.statusText);
          alert("Error: Could not delete the project.");
        }
      } catch (error) {
        console.error("An error occurred during the delete request:", error);
        alert("An error occurred. Please check your network and try again.");
      }
    }
    setOpenDropdownId(null);
  };

  // --- FUNCTIONS ADDED FOR TEAM MODAL ---
  const handleOpenTeamModal = (project) => {
    setSelectedProject(project);
    setIsTeamModalOpen(true);
    setOpenDropdownId(null);
  };

  const handleCloseTeamModal = () => {
    setIsTeamModalOpen(false);
    setSelectedProject(null);
  };

  // --- FUNCTIONS ADDED FOR EDIT MODAL ---
  const handleOpenEditModal = (e, project) => {
    e.preventDefault();
    e.stopPropagation();
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

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditingProject(null);
    setFormData({
      name: '',
      description: '',
      owner: '',
      status: 'PLANNED',
      project_manager_id: null
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
      setError('You must be logged in to edit a project.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/projects/${editingProject.id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Failed to update project');
      }

      fetchProjects();
      handleCloseEditModal();

    } catch (error) {
      console.error('Error updating project:', error);
      setError('Failed to update project. Please check server connection.');
    } finally {
      setLoading(false);
    }
  };

  const toggleDropdown = (e, projectId) => {
    e.preventDefault();
    e.stopPropagation();
    setOpenDropdownId(openDropdownId === projectId ? null : projectId);
  };



  return (
    <>
      <div
        className="min-h-screen p-6 md:p-8 transition-colors duration-300"
        style={{ backgroundColor: colors.background }}
      >

        <div className="flex justify-between items-center mb-8">
          <h1
            className="text-3xl md:text-4xl font-bold"
            style={{ color: colors.text }}
          >
            My Projects
          </h1>
          {/* <button
            onClick={handleShow}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center shadow-lg"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Create Project
          </button> */}
        </div>


        <div className="container mx-auto">

          {error && (
            <div className="mb-6 p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded" role="alert">
              <p className="font-bold">Error</p>
              <p>{error}</p>
            </div>
          )}


          {projects.length > 0 ? (
            /* --- CHANGED: Grid System removed, switched to Flex Column for List View --- */
            <div className="flex flex-col gap-4">
              {projects.map((project) => (
                <div key={project.id} className="relative">
                  {/* --- CHANGED: Removed wrapping <Link> component to stop redirection --- */}
                  <div
                    className="rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border flex flex-col md:flex-row items-center p-4 md:p-5 gap-4 md:gap-6"
                    onClick={() => handleProjectClick(project)} // Kept localStorage logic but removed navigation
                    style={{
                      backgroundColor: colors.card,
                      borderColor: colors.border,
                    }}
                  >

                    {/* SECTION 1: Icon & Main Info (Name, Description, Status) */}
                    <div className="flex items-start gap-4 flex-grow min-w-0 w-full md:w-auto">
                      <div className={`p-3 rounded-lg hidden md:block ${theme === 'dark' ? 'bg-slate-800' : 'bg-gray-100'}`}>
                        <LayoutList size={24} style={{ color: colors.text }} />
                      </div>
                      
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <h3
                            className="text-lg font-bold truncate"
                            style={{ color: colors.text }}
                          >
                            {project.name}
                          </h3>
                          <span
                            className={`px-2 py-0.5 text-xs font-semibold rounded-full whitespace-nowrap ${getStatusColor(project.status)}`}
                          >
                            {project.status.replace('_', ' ').toUpperCase()}
                          </span>
                        </div>
                        <p className="text-sm line-clamp-1"
                        style={{color: theme === 'dark' ? '#94a3b8' : '#4b5563' }}>
                            Organization: {project.organization?.name || 'No organization'}
                        </p>
                        <p
                          className="text-sm line-clamp-1"
                          style={{ color: theme === 'dark' ? '#94a3b8' : '#4b5563' }}
                        >
                          {project.description || 'No description provided'}
                        </p>
                      </div>
                    </div>

                    {/* SECTION 2: Progress Bar */}
                    <div className="w-full md:w-1/4 min-w-[150px]">
                      <div className="flex justify-between items-center mb-1">
                        <span
                          className="text-xs"
                          style={{ color: theme === 'dark' ? '#94a3b8' : '#4b5563' }}
                        >
                          Progress
                        </span>
                        <span
                          className="text-xs font-semibold"
                          style={{ color: colors.text }}
                        >
                          {project.progress || 0}%
                        </span>
                      </div>
                      <div
                        className="w-full rounded-full h-1.5"
                        style={{ backgroundColor: theme === 'dark' ? '#334155' : '#e5e7eb' }}
                      >
                        <div
                          className="bg-blue-500 h-1.5 rounded-full transition-all duration-300"
                          style={{ width: `${project.progress || 0}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* SECTION 3: Meta Data (Owner & Date) */}
                    <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto min-w-[200px] border-t md:border-t-0 pt-3 md:pt-0" style={{ borderColor: colors.border }}>
                      
                      {/* Owner */}
                      <div className="flex items-center gap-2">
                        <div className="flex items-center justify-center w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full font-medium text-xs">
                          {project.owner?.first_name?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs font-medium" style={{ color: colors.text }}>
                             {project.owner?.first_name || 'Unknown'}
                          </span>
                          <span className="text-[10px]" style={{ color: theme === 'dark' ? '#64748b' : '#6b7280' }}>
                            Owner
                          </span>
                        </div>
                      </div>

                      {/* Date */}
                      <div className="flex items-center gap-2">
                         <Calendar size={14} style={{ color: theme === 'dark' ? '#64748b' : '#9ca3af' }} />
                         <span className="text-xs" style={{ color: theme === 'dark' ? '#94a3b8' : '#6b7280' }}>
                            {project.created_at ? new Date(project.created_at).toLocaleDateString() : 'N/A'}
                         </span>
                      </div>
                    </div>

                    {/* SECTION 4: Actions (Dropdown) */}
                    <div className="absolute top-4 right-4 md:static md:ml-2" ref={openDropdownId === project.id ? dropdownRef : null}>
                      <button
                        onClick={(e) => toggleDropdown(e, project.id)}
                        className="p-2 rounded-full transition-colors hover:bg-gray-100 dark:hover:bg-slate-800"
                        style={{
                          color: theme === 'dark' ? '#94a3b8' : '#9ca3af',
                        }}
                      >
                        <MoreVertical size={20} />
                      </button>

                      {/* Dropdown Menu - Kept Exactly as it was */}
                      {openDropdownId === project.id && (
                        <div
                          className="absolute right-0 mt-2 w-48 rounded-md shadow-xl ring-1 ring-opacity-5 z-50 border"
                          style={{
                            backgroundColor: colors.card,
                            borderColor: colors.border,
                          }}
                        >
                          <div className="py-1">
                            <button
                              onClick={(e) => handleOpenEditModal(e, project)}
                              className="flex items-center w-full px-4 py-2 text-sm transition-colors"
                              style={{ color: colors.text }}
                              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theme === 'dark' ? '#1e293b' : '#f3f4f6'}
                              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                              Edit
                            </button>
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleOpenTeamModal(project);
                              }}
                              className="flex items-center w-full px-4 py-2 text-sm transition-colors"
                              style={{ color: colors.text }}
                              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theme === 'dark' ? '#1e293b' : '#f3f4f6'}
                              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                              </svg>
                              Manage Team
                            </button>
                            <button
                              onClick={(e) => handleDelete(e, project.id)}
                              className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                              Delete
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div
              className="flex flex-col items-center justify-center py-16 px-4 text-center rounded-2xl backdrop-blur-sm"
              style={{ backgroundColor: theme === 'dark' ? 'rgba(30, 41, 59, 0.3)' : 'rgba(255, 255, 255, 0.05)' }}
            >
              <svg
                className="w-16 h-16 mb-4"
                style={{ color: theme === 'dark' ? '#64748b' : '#9ca3af' }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3
                className="text-xl font-medium mb-2"
                style={{ color: colors.text }}
              >
                No projects yet
              </h3>
              <p
                className="max-w-md"
                style={{ color: theme === 'dark' ? '#64748b' : '#9ca3af' }}
              >
                Get started by creating your first project. Click the button above to begin.
              </p>
            </div>
          )}
        </div>


        {/* CREATE PROJECT MODAL */}
        {show && (
          <div
            className="modal-overlay"
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              backdropFilter: 'blur(15px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1050
            }}
            onClick={handleClose}
          >
            <div
              className="modal-content"
              style={{
                backgroundColor: theme === 'dark' ? 'rgba(30, 41, 59, 0.95)' : 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(20px)',
                border: `1px solid ${colors.border}`,
                borderRadius: '16px',
                width: '500px',
                maxWidth: '90vw',
                maxHeight: '90vh',
                overflow: 'auto',
                boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25)'
              }}
              onClick={(e) => e.stopPropagation()}
            >

              <div
                style={{
                  padding: '24px 24px 16px 24px',
                  borderBottom: `1px solid ${colors.border}`,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <h2
                  style={{
                    margin: 0,
                    fontSize: '24px',
                    fontWeight: '600',
                    color: colors.text
                  }}
                >
                  Create New Project
                </h2>
                <button
                  onClick={handleClose}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '24px',
                    color: theme === 'dark' ? 'rgba(248, 250, 252, 0.7)' : 'rgba(0, 0, 0, 0.5)',
                    cursor: 'pointer',
                    padding: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'color 0.2s'
                  }}
                  onMouseOver={(e) => e.target.style.color = colors.text}
                  onMouseOut={(e) => e.target.style.color = theme === 'dark' ? 'rgba(248, 250, 252, 0.7)' : 'rgba(0, 0, 0, 0.5)'}
                >
                  ×
                </button>
              </div>


              <form onSubmit={handleSubmit} style={{ padding: '24px' }}>

                <div style={{ marginBottom: '20px' }}>
                  <label
                    style={{
                      display: 'block',
                      marginBottom: '8px',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: colors.text
                    }}
                  >
                    Project Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter project name"
                    required
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      backgroundColor: theme === 'dark' ? '#0f172a' : '#f9fafb',
                      border: `1px solid ${colors.border}`,
                      borderRadius: '8px',
                      fontSize: '14px',
                      color: colors.text,
                      outline: 'none',
                      transition: 'all 0.2s',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>


                <div style={{ marginBottom: '20px' }}>
                  <label
                    style={{
                      display: 'block',
                      marginBottom: '8px',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: colors.text
                    }}
                  >
                    Description
                  </label>
                  <textarea
                    type="text"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Enter project description"
                    required
                    rows={4}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      backgroundColor: theme === 'dark' ? '#0f172a' : '#f9fafb',
                      border: `1px solid ${colors.border}`,
                      borderRadius: '8px',
                      fontSize: '14px',
                      color: colors.text,
                      outline: 'none',
                      resize: 'vertical',
                      minHeight: '100px',
                      transition: 'all 0.2s',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div className="mb-4">
                  <label
                    className="block text-sm font-medium mb-1"
                    style={{ color: colors.text }}
                  >
                    Select Project Manager
                  </label>
                  <select
                    name="project_manager_id"
                    value={formData.project_manager_id || ''}
                    onChange={handleInputChange}

                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      backgroundColor: theme === 'dark' ? '#0f172a' : '#f9fafb',
                      border: `1px solid ${colors.border}`,
                      borderRadius: '6px',
                      color: colors.text,
                      fontSize: '14px'
                    }}
                  >
                    <option value="" >
                      {managers.length ? 'Select a manager' : 'No managers available'}
                    </option>
                    {managers.map((manager) => (
                      <option key={manager.id} value={manager.id}>
                        {manager.first_name} {manager.last_name}
                      </option>
                    ))}
                  </select>
                </div>


                <div style={{ marginBottom: '32px' }}>
                  <label
                    style={{
                      display: 'block',
                      marginBottom: '8px',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: colors.text
                    }}
                  >
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    required
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      backgroundColor: theme === 'dark' ? '#0f172a' : '#f9fafb',
                      border: `1px solid ${colors.border}`,
                      borderRadius: '8px',
                      fontSize: '14px',
                      color: colors.text,
                      outline: 'none',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      boxSizing: 'border-box'
                    }}
                  >
                    <option value="PLANNED">Planned</option>
                    <option value="ONGOING">On going</option>
                    <option value="DELAYED">Delayed</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="ARCHIVED">Archived</option>
                  </select>
                </div>


                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    gap: '12px',
                    paddingTop: '16px',
                    borderTop: `1px solid ${colors.border}`
                  }}
                >
                  <button
                    type="button"
                    onClick={handleClose}
                    disabled={loading}
                    style={{
                      padding: '12px 24px',
                      border: `1px solid ${colors.border}`,
                      borderRadius: '8px',
                      backgroundColor: 'transparent',
                      color: colors.text,
                      fontSize: '14px',
                      fontWeight: '500',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      opacity: loading ? 0.6 : 1
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    style={{
                      padding: '12px 24px',
                      border: 'none',
                      borderRadius: '8px',
                      backgroundColor: 'rgba(30, 80, 255, 0.8)',


                      color: 'white',
                      fontSize: '14px',
                      fontWeight: '500',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      opacity: loading ? 0.6 : 1,
                      boxShadow: '0 4px 15px rgba(59, 130, 246, 0.3)'
                    }}
                  >
                    {loading ? 'Creating...' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* EDIT PROJECT MODAL */}
        {isEditModalOpen && (
          <div
            className="modal-overlay"
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              backdropFilter: 'blur(15px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1050
            }}
            onClick={handleCloseEditModal}
          >
            <div
              className="modal-content"
              style={{
                backgroundColor: theme === 'dark' ? 'rgba(30, 41, 59, 0.95)' : 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(20px)',
                border: `1px solid ${colors.border}`,
                borderRadius: '16px',
                width: '500px',
                maxWidth: '90vw',
                maxHeight: '90vh',
                overflow: 'auto',
                boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25)'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div
                style={{
                  padding: '24px 24px 16px 24px',
                  borderBottom: `1px solid ${colors.border}`,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <h2
                  style={{
                    margin: 0,
                    fontSize: '24px',
                    fontWeight: '600',
                    color: colors.text
                  }}
                >
                  Edit Project
                </h2>
                <button
                  onClick={handleCloseEditModal}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '24px',
                    color: theme === 'dark' ? 'rgba(248, 250, 252, 0.7)' : 'rgba(0, 0, 0, 0.5)',
                    cursor: 'pointer',
                    padding: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'color 0.2s'
                  }}
                  onMouseOver={(e) => e.target.style.color = colors.text}
                  onMouseOut={(e) => e.target.style.color = theme === 'dark' ? 'rgba(248, 250, 252, 0.7)' : 'rgba(0, 0, 0, 0.5)'}
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleEditSubmit} style={{ padding: '24px' }}>
                <div style={{ marginBottom: '20px' }}>
                  <label
                    style={{
                      display: 'block',
                      marginBottom: '8px',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: colors.text
                    }}
                  >
                    Project Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter project name"
                    required
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      backgroundColor: theme === 'dark' ? '#0f172a' : '#f9fafb',
                      border: `1px solid ${colors.border}`,
                      borderRadius: '8px',
                      fontSize: '14px',
                      color: colors.text,
                      outline: 'none',
                      transition: 'all 0.2s',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label
                    style={{
                      display: 'block',
                      marginBottom: '8px',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: colors.text
                    }}
                  >
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Enter project description"
                    required
                    rows={4}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      backgroundColor: theme === 'dark' ? '#0f172a' : '#f9fafb',
                      border: `1px solid ${colors.border}`,
                      borderRadius: '8px',
                      fontSize: '14px',
                      color: colors.text,
                      outline: 'none',
                      resize: 'vertical',
                      minHeight: '100px',
                      transition: 'all 0.2s',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div className="mb-4">
                  <label
                    className="block text-sm font-medium mb-1"
                    style={{ color: colors.text }}
                  >
                    Select Project Manager
                  </label>
                  <select
                    name="project_manager_id"
                    value={formData.project_manager_id || ''}
                    onChange={handleInputChange}

                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      backgroundColor: theme === 'dark' ? '#0f172a' : '#f9fafb',
                      border: `1px solid ${colors.border}`,
                      borderRadius: '6px',
                      color: colors.text,
                      fontSize: '14px'
                    }}
                  >
                    <option value="" >
                      {managers.length ? 'Select a manager' : 'No managers available'}
                    </option>
                    {managers.map((manager) => (
                      <option key={manager.id} value={manager.id}>
                        {manager.first_name} {manager.last_name}
                      </option>
                    ))}
                  </select>
                </div>

                <div style={{ marginBottom: '32px' }}>
                  <label
                    style={{
                      display: 'block',
                      marginBottom: '8px',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: colors.text
                    }}
                  >
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    required
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      backgroundColor: theme === 'dark' ? '#0f172a' : '#f9fafb',
                      border: `1px solid ${colors.border}`,
                      borderRadius: '8px',
                      fontSize: '14px',
                      color: colors.text,
                      outline: 'none',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      boxSizing: 'border-box'
                    }}
                  >
                    <option value="PLANNED">Planned</option>
                    <option value="ONGOING">On going</option>
                    <option value="DELAYED">Delayed</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="ARCHIVED">Archived</option>
                  </select>
                </div>

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    gap: '12px',
                    paddingTop: '16px',
                    borderTop: `1px solid ${colors.border}`
                  }}
                >
                  <button
                    type="button"
                    onClick={handleCloseEditModal}
                    disabled={loading}
                    style={{
                      padding: '12px 24px',
                      border: `1px solid ${colors.border}`,
                      borderRadius: '8px',
                      backgroundColor: 'transparent',
                      color: colors.text,
                      fontSize: '14px',
                      fontWeight: '500',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      opacity: loading ? 0.6 : 1
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    style={{
                      padding: '12px 24px',
                      border: 'none',
                      borderRadius: '8px',
                      backgroundColor: 'rgba(59, 130, 246, 0.8)',
                      color: 'white',
                      fontSize: '14px',
                      fontWeight: '500',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      opacity: loading ? 0.6 : 1,
                      boxShadow: '0 4px 15px rgba(59, 130, 246, 0.3)'
                    }}
                  >
                    {loading ? 'Updating...' : 'Update'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* --- RENDER THE TEAM MODAL --- */}
        {isTeamModalOpen && (
          <Samanageteammodal
            project={selectedProject}
            onClose={handleCloseTeamModal}
          />
        )}
      </div>
    </>
  );
};

export default Saprojects;