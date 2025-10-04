import React, { useState, useEffect } from 'react';
import DashboardLayout from '../layout/DashboardLayout';
import {Link} from "react-router-dom"
const Projects = () => {
  const [show, setShow] = useState(false);
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    owner: '',
    status: 'PLANNED'
  });

  
  useEffect(() => {
    fetchProjects();
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

      const response = await fetch('http://localhost:8000/api/projects/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${authToken}` 
        },
      });

      if (response.status === 401) {
        setError('Session expired. Please login again');
        // Optionally redirect to login page or handle expired token
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
    finally{
      setLoading(false);
    }
  };

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
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
      const response = await fetch('http://localhost:8000/api/projects/', {
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

      fetchProjects(); // Refresh the project list
      handleClose();
      setFormData({
        name: '',
        description: '',
        owner: '',
        status: 'PLANNED'
      });
    } catch (error) {
      console.error('Error creating project:', error);
      setError('Failed to create project. Please check server connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br p-6 md:p-8">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-white">My Projects</h1>
        <button 
          onClick={handleShow}
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center shadow-lg"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Create Project
        </button>
      </div>

      {/* Content Section */}
      <div className="container mx-auto">
        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded" role="alert">
            <p className="font-bold">Error</p>
            <p>{error}</p>
          </div>
        )}

        {/* Display Projects */}
        {projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
            <Link key={project.id} to={`/backlog/${project.id}`}>
              <div 
                key={project.id} 
                className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-gray-900 truncate pr-2">{project.name}</h3>
                    <span 
                      className={`px-3 py-1 text-xs font-semibold rounded-full whitespace-nowrap ${
                        project.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                        project.status === 'ONGOING' ? 'bg-blue-100 text-blue-800' :
                        project.status === 'ARCHIVED' ? 'bg-gray-200 text-gray-800' :
                        project.status === 'DELAYED' ? 'bg-red-100 text-red-800' :
                        project.status === 'PLANNED' ? 'bg-cyan-100 text-cyan-800' : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {project.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 mb-5 line-clamp-3">
                    {project.description || 'No description provided'}
                  </p>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center">
                      <div className="flex items-center justify-center w-10 h-10 bg-indigo-100 text-indigo-600 rounded-full font-medium">
                        {project.owner?.first_name?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">
                          {project.owner?.first_name || 'Unknown'}
                        </p>
                        <p className="text-xs text-gray-500">Project Owner</p>
                      </div>
                    </div>
                    <span className="text-xs text-gray-500">
                      {project.created_at ? new Date(project.created_at).toLocaleDateString() : ''}
                    </span>
                  </div>
                </div>
              </div> 
          </Link>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center bg-white/5 rounded-2xl backdrop-blur-sm">
            <svg 
              className="w-16 h-16 mb-4 text-gray-400" 
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
            <h3 className="text-xl font-medium text-white mb-2">No projects yet</h3>
            <p className="text-gray-400 max-w-md">Get started by creating your first project. Click the button above to begin.</p>
          </div>
          
        )}
      </div>

      {/* Custom Modal */}
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
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '16px',
              width: '500px',
              maxWidth: '90vw',
              maxHeight: '90vh',
              overflow: 'auto',
              boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div 
              style={{
                padding: '24px 24px 16px 24px',
                borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
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
                  color: 'white'
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
                  color: 'rgba(255, 255, 255, 0.7)',
                  cursor: 'pointer',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'color 0.2s'
                }}
                onMouseOver={(e) => e.target.style.color = 'white'}
                onMouseOut={(e) => e.target.style.color = 'rgba(255, 255, 255, 0.7)'}
              >
                ×
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} style={{ padding: '24px' }}>
              {/* Project Name */}
              <div style={{ marginBottom: '20px' }}>
                <label 
                  style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: 'rgba(255, 255, 255, 0.9)'
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
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    borderRadius: '8px',
                    fontSize: '14px',
                    color: 'white',
                    outline: 'none',
                    transition: 'all 0.2s',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#3b82f6';
                    e.target.style.boxShadow = '0 0 0 2px rgba(59, 130, 246, 0.4)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>

              {/* Description */}
              <div style={{ marginBottom: '20px' }}>
                <label 
                  style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: 'rgba(255, 255, 255, 0.9)'
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
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    borderRadius: '8px',
                    fontSize: '14px',
                    color: 'white',
                    outline: 'none',
                    resize: 'vertical',
                    minHeight: '100px',
                    transition: 'all 0.2s',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#3b82f6';
                    e.target.style.boxShadow = '0 0 0 2px rgba(59, 130, 246, 0.4)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>

              {/* Status */}
              <div style={{ marginBottom: '32px' }}>
                <label 
                  style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: 'rgba(255, 255, 255, 0.9)'
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
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    borderRadius: '8px',
                    fontSize: '14px',
                    color: 'black',
                    outline: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#3b82f6';
                    e.target.style.boxShadow = '0 0 0 2px rgba(59, 130, 246, 0.4)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  <option value="PLANNED">Planned</option>
                  <option value="ONGOING">On going</option>
                  <option value="DELAYED">Delayed</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="ARCHIVED">Archived</option>
                </select>
              </div>

              {/* Modal Footer */}
              <div 
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: '12px',
                  paddingTop: '16px',
                  borderTop: '1px solid rgba(255, 255, 255, 0.2)'
                }}
              >
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={loading}
                  style={{
                    padding: '12px 24px',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    borderRadius: '8px',
                    backgroundColor: 'transparent',
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    opacity: loading ? 0.6 : 1
                  }}
                  onMouseOver={(e) => {
                    if (!loading) {
                      e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                      e.target.style.color = 'white';
                    }
                  }}
                  onMouseOut={(e) => {
                    e.target.style.backgroundColor = 'transparent';
                    e.target.style.color = 'rgba(255, 255, 255, 0.8)';
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
                  onMouseOver={(e) => {
                    if (!loading) {
                      e.target.style.backgroundColor = '#3b82f6';
                      e.target.style.boxShadow = '0 6px 20px rgba(59, 130, 246, 0.4)';
                    }
                  }}
                  onMouseOut={(e) => {
                    if (!loading) {
                      e.target.style.backgroundColor = 'rgba(59, 130, 246, 0.8)';
                      e.target.style.boxShadow = '0 4px 15px rgba(59, 130, 246, 0.3)';
                    }
                  }}
                >
                  {loading ? 'Creating...' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
   
  );
};

export default Projects;