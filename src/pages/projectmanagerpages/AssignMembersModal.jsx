import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Users, X, AlertTriangle, Loader2, ShieldCheck, CheckSquare, Square, Search } from 'lucide-react';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Custom hook to detect clicks outside of a component
const useClickOutside = (ref, handler) => {
    useEffect(() => {
        const listener = (event) => {
            if (!ref.current || ref.current.contains(event.target)) {
                return;
            }
            handler(event);
        };
        document.addEventListener('mousedown', listener);
        document.addEventListener('touchstart', listener);
        return () => {
            document.removeEventListener('mousedown', listener);
            document.removeEventListener('touchstart', listener);
        };
    }, [ref, handler]);
};

// Unified Searchable Dropdown Component
const SearchableDropdown = ({ allMembers, selectedDeveloperIds, selectedTesterIds, onSelect }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    useClickOutside(dropdownRef, () => setIsOpen(false));

    const filteredMembers = allMembers.filter(member =>
        `${member.first_name} ${member.last_name}`.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getSelectedMembers = () => {
        const selectedDevs = allMembers.filter(m => m.role === 'developer' && selectedDeveloperIds.includes(m.id));
        const selectedTesters = allMembers.filter(m => m.role === 'tester' && selectedTesterIds.includes(m.id));
        return [...selectedDevs, ...selectedTesters];
    };

    return (
        <div className="flex-1" ref={dropdownRef}>
            <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
                <Users className="mr-2 h-5 w-5 text-indigo-700" />
                Assign Developers or Testers
            </h3>
            <div className="relative">
                <div 
                    onClick={() => setIsOpen(prev => !prev)} 
                    className="bg-white/60 rounded-lg p-2 flex flex-wrap gap-2 items-center cursor-text min-h-[44px]"
                >
                    {getSelectedMembers().map(member => (
                        <span key={member.id} className="bg-indigo-600 text-white text-xs font-medium px-2 py-1 rounded-full flex items-center">
                            {member.first_name}
                            <X onClick={(e) => { e.stopPropagation(); onSelect(member, member.role); }} className="ml-1 h-3 w-3 cursor-pointer" />
                        </span>
                    ))}
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onFocus={() => setIsOpen(true)}
                        placeholder="Search for developers or testers..."
                        className="flex-grow bg-transparent outline-none text-gray-900 placeholder-gray-700 text-sm"
                    />
                </div>

                {isOpen && (
                    <div className="absolute top-full mt-2 w-full bg-white/90 backdrop-blur-md rounded-lg shadow-xl z-10 max-h-60 overflow-y-auto">
                        {filteredMembers.length > 0 ? filteredMembers.map(member => {
                            const isSelected = selectedDeveloperIds.includes(member.id) || selectedTesterIds.includes(member.id);
                            return (
                                <div key={member.id} onClick={() => onSelect(member, member.role)} className={`flex items-center justify-between p-3 cursor-pointer text-gray-900 hover:bg-indigo-100 transition-colors ${isSelected ? 'font-semibold' : ''}`}>
                                    <span>{member.first_name} {member.last_name} <span className="text-gray-500 text-xs">({member.role})</span></span>
                                    {isSelected ? <CheckSquare className="h-5 w-5 text-indigo-600" /> : <Square className="h-5 w-5 text-gray-400" />}
                                </div>
                            );
                        }) : <p className="text-sm text-gray-700 p-3">No members found.</p>}
                    </div>
                )}
            </div>
        </div>
    );
};


const AssignMembersModal = ({ project, onClose }) => {
  const [assignedMembers, setAssignedMembers] = useState([]);
  const [allAvailableMembers, setAllAvailableMembers] = useState([]);
  const [selectedDevelopers, setSelectedDevelopers] = useState([]);
  const [selectedTesters, setSelectedTesters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [showWarning, setShowWarning] = useState(false);

  const fetchData = useCallback(async () => {
    if (!project) return;
    setLoading(true);
    setError('');
    const authToken = localStorage.getItem('authToken');
    try {
      const [assignedResponse, devResponse, testerResponse] = await Promise.all([
        fetch(`${API_BASE_URL}/projects/${project.id}/members/`, { headers: { 'Authorization': `Bearer ${authToken}` } }),
        fetch(`${API_BASE_URL}/projects/${project.id}/available-members/developer/`, { headers: { 'Authorization': `Bearer ${authToken}` } }),
        fetch(`${API_BASE_URL}/projects/${project.id}/available-members/tester/`, { headers: { 'Authorization': `Bearer ${authToken}` } })
      ]);
      if (!assignedResponse.ok || !devResponse.ok || !testerResponse.ok) {
        throw new Error('Failed to fetch project member data.');
      }
      const assignedData = await assignedResponse.json();
      const devData = await devResponse.json();
      const testerData = await testerResponse.json();
      setAssignedMembers(assignedData.results || assignedData);

      // Combine developers and testers into a single list with a 'role' property
      const combined = [
          ...devData.map(d => ({...d, role: 'developer'})),
          ...testerData.map(t => ({...t, role: 'tester'})),
      ];
      setAllAvailableMembers(combined);

    } catch (err) {
      setError(err.message || 'An error occurred while fetching data.');
    } finally {
      setLoading(false);
    }
  }, [project]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSelect = (user, role) => {
    setShowWarning(false);
    if (role === 'developer') {
      if (selectedTesters.length > 0) {
        setSelectedTesters([]);
        setShowWarning(true);
      }
      setSelectedDevelopers(prev => prev.includes(user.id) ? prev.filter(id => id !== user.id) : [...prev, user.id]);
    } 
    if (role === 'tester') {
      if (selectedDevelopers.length > 0) {
        setSelectedDevelopers([]);
        setShowWarning(true);
      }
      setSelectedTesters(prev => prev.includes(user.id) ? prev.filter(id => id !== user.id) : [...prev, user.id]);
    }
  };
  
  const handleSubmit = async () => {
    const hasDevs = selectedDevelopers.length > 0;
    const hasTesters = selectedTesters.length > 0;
    if (!hasDevs && !hasTesters) return;
    setSubmitting(true);
    setError('');
    const authToken = localStorage.getItem('authToken');
    try {
      let endpoint = '';
      let body = {};
      if (hasDevs) {
        endpoint = `${API_BASE_URL}/projects/${project.id}/members/bulk-assign/developer/`;
        body = { user_ids: selectedDevelopers };
      } else if (hasTesters) {
        endpoint = `${API_BASE_URL}/projects/${project.id}/members/bulk-assign/tester/`;
        body = { user_ids: selectedTesters };
      }
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authToken}` },
        body: JSON.stringify(body)
      });
      if (!response.ok) {
        throw new Error('An error occurred during assignment.');
      }
      setSelectedDevelopers([]);
      setSelectedTesters([]);
      setShowWarning(false);
      await fetchData();
    } catch (err) {
      setError(err.message || 'Failed to assign members.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm" onClick={onClose}>
      <div className="rounded-2xl shadow-2xl w-full max-w-3xl m-4" style={{ background: 'linear-gradient(135deg, rgba(255, 205, 178, 0.95) 0%, rgba(255, 180, 162, 0.95) 30%, rgba(229, 152, 155, 0.95) 70%, rgba(181, 130, 140, 0.95) 100%)' }} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b border-white/30">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Assign Members</h2>
            <p className="text-sm text-gray-800">Project: {project.name}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-full text-gray-700 hover:bg-white/30 transition-colors">
            <X size={24} />
          </button>
        </div>
        <div className="p-6 min-h-[450px]">
          {loading ? (
            <div className="flex justify-center items-center h-full"><Loader2 className="h-12 w-12 animate-spin text-indigo-700" /></div>
          ) : (
            <>
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center"><ShieldCheck className="mr-2 h-5 w-5 text-green-700" />Current Team</h3>
                <div className="flex flex-wrap gap-3 p-3 bg-white/30 rounded-lg min-h-[50px]">
                  {assignedMembers.length > 0 ? (
                    assignedMembers.map(member => (
                      <div key={member.user.id} className="bg-white/80 text-gray-800 text-sm font-medium px-3 py-1.5 rounded-full flex items-center shadow">
                        {member.user.first_name} {member.user.last_name}
                        <span className="ml-2 text-xs text-gray-500 capitalize">({member.role})</span>
                      </div>
                    ))
                  ) : (<p className="text-sm text-gray-600 p-2">No members assigned yet.</p>)}
                </div>
              </div>
              <div className="flex flex-col md:flex-row gap-8">
                <SearchableDropdown 
                    allMembers={allAvailableMembers} 
                    selectedDeveloperIds={selectedDevelopers} 
                    selectedTesterIds={selectedTesters} 
                    onSelect={handleSelect}
                />
              </div>
            </>
          )}
          
          {showWarning && (
            <div className="mt-6 p-4 bg-amber-100 border border-amber-400 rounded-lg flex items-start">
              <AlertTriangle className="h-5 w-5 text-amber-600 mr-3 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-amber-800">Important Note</h4>
                <p className="text-sm text-amber-700">You can assign multiple developers OR multiple testers at once, but not both. Your previous selections for the other role have been cleared.</p>
              </div>
            </div>
          )}
          
          {error && <p className="text-red-600 font-medium text-sm mt-4 text-center">{error}</p>}
        </div>
        <div className="flex justify-end items-center gap-4 p-5 bg-white/20 border-t border-white/30 rounded-b-2xl">
          <button onClick={onClose} className="px-5 py-2 rounded-lg text-gray-800 bg-white/50 hover:bg-white/80 transition-colors">Close</button>
          <button onClick={handleSubmit} className="px-5 py-2 rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center" disabled={submitting || loading || (selectedDevelopers.length === 0 && selectedTesters.length === 0)}>
            {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {submitting ? 'Assigning...' : 'Assign & Refresh'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssignMembersModal;

