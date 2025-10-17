import React, { useState, useEffect, useCallback } from 'react';
import { Users, X, AlertTriangle, Loader2, ShieldCheck, CheckSquare, Square } from 'lucide-react';

const ManageTeamModal = ({ project, onClose }) => {
    const [assignedMembers, setAssignedMembers] = useState([]);
    const [available, setAvailable] = useState({ developers: [], testers: [], managers: [] });
    const [selections, setSelections] = useState({ developers: [], testers: [], managers: [] });
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [showWarning, setShowWarning] = useState(false);

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError('');
        const authToken = localStorage.getItem('authToken');
        try {
            const responses = await Promise.all([
                fetch(`http://localhost:8000/api/projects/${project.id}/members/`, { headers: { 'Authorization': `Bearer ${authToken}` } }),
                fetch(`http://localhost:8000/api/projects/${project.id}/available-members/developer/`, { headers: { 'Authorization': `Bearer ${authToken}` } }),
                fetch(`http://localhost:8000/api/projects/${project.id}/available-members/tester/`, { headers: { 'Authorization': `Bearer ${authToken}` } }),
                fetch(`http://localhost:8000/api/projects/${project.id}/available-members/manager/`, { headers: { 'Authorization': `Bearer ${authToken}` } }),
            ]);
            // Check if any API call failed
            for (const res of responses) {
                if (!res.ok) throw new Error('Failed to fetch some team data. Please check API endpoints.');
            }
            const [assigned, devs, testers, managers] = await Promise.all(responses.map(res => res.json()));
            setAssignedMembers(assigned.results || assigned);
            setAvailable({ developers: devs, testers: testers, managers: managers });
        } catch (err) {
            setError(err.message || 'Could not load team data.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [project.id]);

    useEffect(() => { fetchData(); }, [fetchData]);

    const handleSelect = (user, role) => {
        setShowWarning(false);
        const otherRoles = Object.keys(selections).filter(r => r !== role);
        let warningNeeded = false;
        
        // Check if any other role list has selections
        otherRoles.forEach(r => {
            if (selections[r].length > 0) warningNeeded = true;
        });
        
        if (warningNeeded) setShowWarning(true);
        
        // Update state: clear all other roles and toggle the current one
        setSelections(prev => {
            const newSelections = { developers: [], testers: [], managers: [] };
            const currentRoleSelection = prev[role].includes(user.id)
                ? prev[role].filter(id => id !== user.id)
                : [...prev[role], user.id];
            newSelections[role] = currentRoleSelection;
            return newSelections;
        });
    };

    const handleSubmit = async () => {
        const roleToSubmit = Object.keys(selections).find(role => selections[role].length > 0);
        if (!roleToSubmit) return;
        
        setSubmitting(true);
        setError('');
        const authToken = localStorage.getItem('authToken');
        
        const roleApiMap = {
            developers: 'developer',
            testers: 'tester',
            managers: 'PROJECT_MANAGER'
        };

        try {
            const response = await fetch(`http://localhost:8000/api/projects/${project.id}/members/bulk-assign/${roleApiMap[roleToSubmit]}/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authToken}` },
                body: JSON.stringify({ user_ids: selections[roleToSubmit] })
            });
            if (!response.ok) throw new Error('Assignment failed.');
            
            setSelections({ developers: [], testers: [], managers: [] }); // Clear selections
            await fetchData(); // Refresh data
        } catch (err) {
            setError(err.message || 'Failed to assign members.');
            console.error(err);
        } finally {
            setSubmitting(false);
        }
    };

    const MemberList = ({ title, members, selectedIds, onSelect, role }) => (
        <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">{title}</h3>
            <div className="space-y-2 max-h-60 overflow-y-auto bg-white/30 p-2 rounded-md">
                {members.length > 0 ? members.map(member => {
                    const isSelected = selectedIds.includes(member.id);
                    return (
                        <div key={member.id} onClick={() => onSelect(member, role)} className={`flex items-center justify-between p-2 rounded-md cursor-pointer text-gray-900 ${isSelected ? 'bg-indigo-500 text-white' : 'hover:bg-white/50'}`}>
                            <span>{member.first_name} {member.last_name}</span>
                            {isSelected ? <CheckSquare size={20} /> : <Square size={20} className="text-gray-600" />}
                        </div>
                    );
                }) : <p className="text-sm text-gray-700 p-2">No available members.</p>}
            </div>
        </div>
    );

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
            <div 
                className="rounded-2xl shadow-2xl w-full max-w-4xl m-4"
                style={{ background: "linear-gradient(135deg, rgba(173, 151, 253, 0.95) 0%, rgba(246, 165, 220, 0.95) 100%)" }}
                onClick={e => e.stopPropagation()}
            >
                <div className="p-5 border-b border-white/30">
                    <h2 className="text-2xl font-bold text-gray-900">Manage Team: {project.name}</h2>
                </div>
                <div className="p-6 min-h-[450px]">
                    {loading ? <div className="flex justify-center items-center h-full"><Loader2 className="animate-spin h-12 w-12 text-indigo-700" /></div> : (
                        <>
                            <div className="mb-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center"><ShieldCheck className="text-green-800 mr-2" /> Current Team</h3>
                                <div className="flex flex-wrap gap-2 p-2 bg-white/30 rounded-md min-h-[40px]">
                                    {assignedMembers.length > 0 ? assignedMembers.map(m => <span key={m.user.id} className="bg-white/70 text-gray-800 text-sm px-3 py-1 rounded-full">{m.user.first_name} ({m.role})</span>) : <span className="text-gray-700 p-1">No members assigned.</span>}
                                </div>
                            </div>

                            <div className="flex flex-col md:flex-row gap-6">
                                <MemberList title="Available Developers" members={available.developers} selectedIds={selections.developers} onSelect={handleSelect} role="developers" />
                                <MemberList title="Available Testers" members={available.testers} selectedIds={selections.testers} onSelect={handleSelect} role="testers" />
                                <MemberList title="Available Managers" members={available.managers} selectedIds={selections.managers} onSelect={handleSelect} role="managers" />
                            </div>

                            {showWarning && (
                                <div className="mt-4 p-3 bg-amber-100 border border-amber-400 text-amber-800 rounded-md flex items-start gap-3">
                                    <AlertTriangle />
                                    <p className="text-sm">You can only assign from one role at a time. Your selections for the other role(s) have been cleared.</p>
                                </div>
                            )}
                             {error && <p className="text-red-800 font-semibold text-sm mt-4 text-center">{error}</p>}
                        </>
                    )}
                </div>
                <div className="flex justify-end gap-4 p-4 bg-white/20 border-t border-white/30">
                    <button onClick={onClose} className="px-4 py-2 bg-white/50 hover:bg-white/80 text-gray-800 rounded-md">Close</button>
                    <button onClick={handleSubmit} disabled={submitting || loading || Object.values(selections).every(arr => arr.length === 0)} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md disabled:bg-indigo-400 disabled:cursor-not-allowed flex items-center">
                        {submitting && <Loader2 className="animate-spin mr-2" />}
                        Assign
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ManageTeamModal;

