import React, { useState, useEffect, useCallback } from 'react';
import { Users, X, AlertTriangle, Loader2, ShieldCheck, CheckSquare, Square } from 'lucide-react';

const AssignMembersModal = ({ project, onClose }) => {
  const [assignedMembers, setAssignedMembers] = useState([]);
  const [developers, setDevelopers] = useState([]);
  const [testers, setTesters] = useState([]);
  // CHANGED: State now holds arrays for multiple selections
  const [selectedDevelopers, setSelectedDevelopers] = useState([]);
  const [selectedTesters, setSelectedTesters] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [showWarning, setShowWarning] = useState(false);

  const fetchData = useCallback(async () => {
    // ... this function remains the same ...
    if (!project) return;
    setLoading(true);
    setError('');
    const authToken = localStorage.getItem('authToken');
    try {
      const [assignedResponse, devResponse, testerResponse] = await Promise.all([
        fetch(`http://localhost:8000/api/projects/${project.id}/members/`, { headers: { 'Authorization': `Bearer ${authToken}` } }),
        fetch(`http://localhost:8000/api/projects/${project.id}/available-members/developer/`, { headers: { 'Authorization': `Bearer ${authToken}` } }),
        fetch(`http://localhost:8000/api/projects/${project.id}/available-members/tester/`, { headers: { 'Authorization': `Bearer ${authToken}` } })
      ]);
      if (!assignedResponse.ok || !devResponse.ok || !testerResponse.ok) {
        throw new Error('Failed to fetch project member data.');
      }
      const assignedData = await assignedResponse.json();
      const devData = await devResponse.json();
      const testerData = await testerResponse.json();
      setAssignedMembers(assignedData.results || assignedData);
      setDevelopers(devData);
      setTesters(testerData);
    } catch (err) {
      setError(err.message || 'An error occurred while fetching data.');
    } finally {
      setLoading(false);
    }
  }, [project]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // NEW: Rewritten handleSelect for multi-select and exclusive roles
  const handleSelect = (user, role) => {
    setShowWarning(false); // Hide warning on any new selection attempt
    if (role === 'developer') {
      // If user tries to select a dev while testers are selected
      if (selectedTesters.length > 0) {
        setSelectedTesters([]); // Clear tester selections
        setShowWarning(true);   // Show the warning
      }
      // Toggle the developer selection
      setSelectedDevelopers(prev => 
        prev.includes(user.id) 
          ? prev.filter(id => id !== user.id) 
          : [...prev, user.id]
      );
    } 
    
    if (role === 'tester') {
      // If user tries to select a tester while devs are selected
      if (selectedDevelopers.length > 0) {
        setSelectedDevelopers([]); // Clear developer selections
        setShowWarning(true);      // Show the warning
      }
      // Toggle the tester selection
      setSelectedTesters(prev => 
        prev.includes(user.id) 
          ? prev.filter(id => id !== user.id) 
          : [...prev, user.id]
      );
    }
  };
  
  // CHANGED: handleSubmit now sends arrays
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
        endpoint = `http://localhost:8000/api/projects/${project.id}/members/bulk-assign/developer/`;
        body = { user_ids: selectedDevelopers };
      } else if (hasTesters) {
        endpoint = `http://localhost:8000/api/projects/${project.id}/members/bulk-assign/tester/`;
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

  // CHANGED: MemberList now shows checkboxes
  const MemberList = ({ title, members, selectedIds, onSelect, role }) => (
    <div className="flex-1">
      <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
        <Users className="mr-2 h-5 w-5 text-indigo-700" />
        {title}
      </h3>
      <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
        {members.map(member => {
          const isSelected = selectedIds.includes(member.id);
          return (
            <div key={member.id} onClick={() => onSelect(member, role)} className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all duration-200 ${ isSelected ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white/60 hover:bg-white/90 text-gray-700' }`}>
              <div>
                <p className="font-medium">{member.first_name} {member.last_name}</p>
                <p className={`text-xs ${isSelected ? 'text-indigo-200' : 'text-gray-500'}`}>{member.email}</p>
              </div>
              {isSelected ? <CheckSquare className="h-5 w-5" /> : <Square className="h-5 w-5 text-gray-500" />}
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm" onClick={onClose}>
      {/* CHANGED: Gradient colors updated with transparency (0.95 alpha) */}
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
                <MemberList title="Available Developers" members={developers} selectedIds={selectedDevelopers} onSelect={handleSelect} role="developer" />
                <MemberList title="Available Testers" members={testers} selectedIds={selectedTesters} onSelect={handleSelect} role="tester" />
              </div>
            </>
          )}
          
          {showWarning && (
            <div className="mt-6 p-4 bg-amber-100 border border-amber-400 rounded-lg flex items-start">
              <AlertTriangle className="h-5 w-5 text-amber-600 mr-3 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-amber-800">Important Note</h4>
                {/* CHANGED: Warning message is updated */}
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