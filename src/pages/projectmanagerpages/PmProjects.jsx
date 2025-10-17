import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { MoreVertical } from 'lucide-react';
import AssignMembersModal from './AssignMembersModal';

const PmProjects = () => {
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // State for the assignment modal
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedProjectForAssignment, setSelectedProjectForAssignment] = useState(null);

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
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const groupedData = await response.json();
      const allProjects = Object.values(groupedData).flat();
      setProjects(allProjects);

    } catch (error) {
      console.error('Error fetching projects:', error);
      setError('Failed to fetch projects. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleProjectClick = (project) => {
    localStorage.setItem("activeProjectId", project.id);
    localStorage.setItem("activeProjectName", project.name);
  };

  // Handlers to open/close the assignment modal
  const handleOpenAssignModal = (project) => {
    setSelectedProjectForAssignment(project);
    setIsAssignModalOpen(true);
  };

  const handleCloseAssignModal = () => {
    setIsAssignModalOpen(false);
    setSelectedProjectForAssignment(null);
  };

  return (
    <>
      <div
        className="w-full h-screen overflow-y-auto p-8 rounded-2xl"
        style={{ background: 'linear-gradient(135deg, #FFCDB2 0%, #FFB4A2 30%, #E5989B 70%, #B5828C 100%)' }}
      >
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white">My Projects</h1>
        </div>

        <div className="container mx-auto">
          {loading && <p className="text-white text-center">Loading projects...</p>}
          {error && (
            <div className="mb-6 p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded" role="alert">
              <p className="font-bold">Error</p>
              <p>{error}</p>
            </div>
          )}
          
          {!loading && projects.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <div key={project.id} className="relative group">
                  <Link to={`/pm/backlog/${project.id}`} onClick={() => handleProjectClick(project)}>
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 h-full flex flex-col">
                      <div className="p-6 flex-grow">
                        <div className="flex justify-between items-start mb-4 pr-7">
                          <h3 className="text-xl font-bold text-gray-900 truncate pr-2">{project.name}</h3>
                          <span className={`px-3 py-1 text-xs font-semibold rounded-full whitespace-nowrap ${
                            project.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                            project.status === 'ONGOING' ? 'bg-blue-100 text-blue-800' :
                            project.status === 'PLANNED' ? 'bg-cyan-100 text-cyan-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {project.status.replace('_', ' ').toUpperCase()}
                          </span>
                        </div>
                        <p className="text-gray-600 mb-5 line-clamp-3">
                          {project.description || 'No description provided'}
                        </p>
                      </div>
                      <div className="p-6 flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
                        <div className="flex items-center">
                          <div className="flex items-center justify-center w-10 h-10 bg-indigo-100 text-indigo-600 rounded-full font-medium">
                            {project.owner?.first_name?.charAt(0).toUpperCase() || 'U'}
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900">{project.owner?.first_name || 'Unknown'}</p>
                            <p className="text-xs text-gray-500">Project Owner</p>
                          </div>
                        </div>
                        <span className="text-xs text-gray-500">
                          {project.created_at ? new Date(project.created_at).toLocaleDateString() : ''}
                        </span>
                      </div>
                    </div>
                  </Link>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent link navigation
                      handleOpenAssignModal(project);
                    }}
                    className="absolute top-3 right-3 p-2 rounded-full text-gray-400 bg-white/50 hover:bg-gray-200 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300"
                  >
                    <MoreVertical size={20} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {isAssignModalOpen && (
        <AssignMembersModal
          project={selectedProjectForAssignment}
          onClose={handleCloseAssignModal}
        />
      )}
    </>
  );
};

export default PmProjects;