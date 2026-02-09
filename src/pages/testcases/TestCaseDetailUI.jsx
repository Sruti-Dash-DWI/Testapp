import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { ArrowLeft, Save, Trash2, Plus, Edit2, Check, X, Move, Clock, User, FileText, Tag } from 'lucide-react';
import MoveEntityModal from './MoveEntityModal'; 

export default function TestCaseDetailUI() {
  const { projectId, testCaseId } = useParams();
  const navigate = useNavigate();
  const { colors } = useTheme();

  const [testCase, setTestCase] = useState(null);
  const [loading, setLoading] = useState(true);
  const [steps, setSteps] = useState([]);
  const [modules, setModules] = useState([]); 
  const [showMoveModal, setShowMoveModal] = useState(false);

  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [infoForm, setInfoForm] = useState({});
  const [editingStepId, setEditingStepId] = useState(null); 
  const [tempStepData, setTempStepData] = useState({}); 

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const authToken = localStorage.getItem('authToken');

  const formatDate = (dateString) => dateString ? new Date(dateString).toLocaleString() : 'N/A';

  useEffect(() => {
    fetchTestCaseDetails();
    fetchModules();
  }, [testCaseId]);

  const fetchTestCaseDetails = async () => {
    setLoading(true);
    try {
        let response = await fetch(`${API_BASE_URL}/testcase/cases/`, { headers: { 'Authorization': `Bearer ${authToken}` }});
        if(!response.ok) throw new Error("Failed to fetch cases");
        const allCases = await response.json();
        const foundCase = allCases.find(c => c.id === parseInt(testCaseId));
        if (foundCase) {
            setTestCase(foundCase);
            setInfoForm(foundCase);
            if (foundCase.steps) setSteps(foundCase.steps.sort((a,b) => a.order - b.order));
            else fetchSteps(foundCase.id);
        } else {
            alert("Test Case not found");
            navigate(`/project/${projectId}/test-scripts`);
        }
    } catch (error) { console.error(error); } finally { setLoading(false); }
  };

  const fetchSteps = async (caseId) => {
      try {
          const res = await fetch(`${API_BASE_URL}/testcase/steps/?case=${caseId}`, { headers: { 'Authorization': `Bearer ${authToken}` }});
          if(res.ok) { const data = await res.json(); setSteps(data.sort((a,b) => a.order - b.order)); }
      } catch(e) { console.error("Error fetching steps", e); }
  };

  const fetchModules = async () => {
      try {
          const res = await fetch(`${API_BASE_URL}/testcase/modules/simple-modules/?project=${projectId}`, { headers: { 'Authorization': `Bearer ${authToken}` }});
          if(res.ok) {
              const data = await res.json();
              const flatten = (nodes, depth=0) => {
                  let r = []; nodes.forEach(n => { r.push({...n, depth}); if(n.children) r = r.concat(flatten(n.children, depth+1)); }); return r;
              }
              setModules(flatten(data));
          }
      } catch(e) { console.error(e); }
  }

  const handleSaveInfo = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/testcase/cases/${testCaseId}/`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authToken}` },
            body: JSON.stringify({
                title: infoForm.title, preconditions: infoForm.preconditions, expected_result: infoForm.expected_result,
                priority: infoForm.priority, severity: infoForm.severity, status: infoForm.status, labels: infoForm.labels,
                natural_language: infoForm.natural_language
            })
        });
        if (!response.ok) throw new Error("Failed to update");
        const updated = await response.json();
        setTestCase(updated); setIsEditingInfo(false); alert("Details updated successfully");
    } catch (error) { alert("Error updating details: " + error.message); }
  };

  const handleMoveCaseConfirm = async (targetModuleId) => {
      if(!targetModuleId) return;
      try {
          const res = await fetch(`${API_BASE_URL}/testcase/cases/${testCaseId}/move/`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authToken}` },
              body: JSON.stringify({ module: parseInt(targetModuleId) })
          });
          if(!res.ok) throw new Error("Failed to move");
          alert("Test Case Moved Successfully");
          setTestCase(prev => ({...prev, module: parseInt(targetModuleId)}));
      } catch (e) { alert(e.message); }
  }

  const handleDeleteCase = async () => {
      if(!window.confirm("Delete this test case permanently?")) return;
      try {
          const res = await fetch(`${API_BASE_URL}/testcase/cases/${testCaseId}/`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${authToken}` }});
          if(!res.ok) throw new Error("Failed to delete");
          navigate(`/project/${projectId}/test-scripts`);
      } catch (e) { alert(e.message); }
  }

  const handleAddStep = async () => {
      const newOrder = steps.length > 0 ? steps[steps.length-1].order + 1 : 1;
      const payload = { case: parseInt(testCaseId), order: newOrder, action: "New Step", data: "", expected: "Result" };
      try {
          const res = await fetch(`${API_BASE_URL}/testcase/steps/`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authToken}` }, body: JSON.stringify(payload) });
          if(!res.ok) throw new Error("Failed to add step");
          fetchSteps(testCaseId);
      } catch (e) { alert(e.message); }
  };

  const startEditStep = (step) => { setEditingStepId(step.id); setTempStepData(step); };
  
  const handleSaveStep = async () => {
      try {
          const res = await fetch(`${API_BASE_URL}/testcase/steps/${editingStepId}/`, {
              method: 'PATCH', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authToken}` },
              body: JSON.stringify({ case: parseInt(testCaseId), order: tempStepData.order, action: tempStepData.action, data: tempStepData.data, expected: tempStepData.expected })
          });
          if(!res.ok) throw new Error("Failed to update step");
          setEditingStepId(null); fetchSteps(testCaseId);
      } catch (e) { alert(e.message); }
  };

  const handleDeleteStep = async (stepId) => {
      if(!window.confirm("Delete this step?")) return;
      try {
          const res = await fetch(`${API_BASE_URL}/testcase/steps/${stepId}/`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${authToken}` }});
          if(!res.ok) throw new Error("Failed to delete step");
          fetchSteps(testCaseId);
      } catch (e) { alert(e.message); }
  };

  if (loading || !testCase) return <div className="p-10 text-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col" style={{color: colors.text}}>
      <div className="bg-white border-b px-6 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full"><ArrowLeft className="w-5 h-5 text-gray-600" /></button>
            <div><h1 className="text-xl font-bold text-gray-800">{testCase.title}</h1></div>
        </div>
        <div className="flex items-center gap-3">
            <button onClick={() => setShowMoveModal(true)} className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded text-sm text-gray-700 font-medium"><Move className="w-4 h-4" /> Move Case</button>
            <button onClick={handleDeleteCase} className="flex items-center gap-2 px-4 py-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg text-sm font-medium"><Trash2 className="w-4 h-4" /> Delete Case</button>
        </div>
      </div>

      <div className="p-8 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Col: Info & Meta */}
        <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4"><h2 className="font-semibold text-lg text-gray-800">Properties</h2><button onClick={() => setIsEditingInfo(!isEditingInfo)} className="text-blue-600 hover:underline text-sm font-medium">{isEditingInfo ? 'Cancel' : 'Edit'}</button></div>
                <div className="space-y-4">
                    <div><label className="text-xs font-bold text-gray-500 uppercase">Title</label>{isEditingInfo ? <input className="w-full border rounded p-2 text-sm mt-1" value={infoForm.title} onChange={e=>setInfoForm({...infoForm, title: e.target.value})} /> : <p className="text-sm font-medium">{testCase.title}</p>}</div>
                    <div><label className="text-xs font-bold text-gray-500 uppercase">Pre-conditions</label>{isEditingInfo ? <textarea className="w-full border rounded p-2 text-sm mt-1" rows={3} value={infoForm.preconditions} onChange={e=>setInfoForm({...infoForm, preconditions: e.target.value})} /> : <p className="text-sm text-gray-600">{testCase.preconditions || 'None'}</p>}</div>
                    <div className="grid grid-cols-2 gap-4">
                        <div><label className="text-xs font-bold text-gray-500 uppercase">Priority</label>{isEditingInfo ? <select className="w-full border rounded p-1 text-sm" value={infoForm.priority} onChange={e=>setInfoForm({...infoForm, priority: e.target.value})}>{['LOWEST','LOW','MEDIUM','HIGH','HIGHEST'].map(o=><option key={o} value={o}>{o}</option>)}</select> : <span className="block text-sm px-2 py-1 bg-yellow-50 text-yellow-700 rounded w-fit">{testCase.priority}</span>}</div>
                        <div><label className="text-xs font-bold text-gray-500 uppercase">Severity</label>{isEditingInfo ? <select className="w-full border rounded p-1 text-sm" value={infoForm.severity} onChange={e=>setInfoForm({...infoForm, severity: e.target.value})}>{['BLOCKER','CRITICAL','MAJOR','MINOR'].map(o=><option key={o} value={o}>{o}</option>)}</select> : <span className="block text-sm px-2 py-1 bg-red-50 text-red-700 rounded w-fit">{testCase.severity}</span>}</div>
                    </div>
                    <div><label className="text-xs font-bold text-gray-500 uppercase">Status</label>{isEditingInfo ? <select className="w-full border rounded p-1 text-sm mt-1" value={infoForm.status} onChange={e=>setInfoForm({...infoForm, status: e.target.value})}>{['PASSED','FAILED','WARNING','SKIPPED','NOT_EXECUTED'].map(o=><option key={o} value={o}>{o}</option>)}</select> : <span className="block text-sm text-gray-700">{testCase.status}</span>}</div>
                    {isEditingInfo && <button onClick={handleSaveInfo} className="w-full py-2 bg-blue-600 text-white rounded font-medium mt-4 flex items-center justify-center gap-2"><Save className="w-4 h-4" /> Save Details</button>}
                </div>
            </div>

            
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
                <h3 className="font-semibold text-gray-800 border-b pb-2 mb-2">Information</h3>
                <div className="grid grid-cols-2 gap-y-4 text-xs">
                    <div><span className="block text-gray-400 mb-1 flex items-center gap-1"><User className="w-3 h-3"/> Created By</span><span className="text-gray-700 font-mono">User ID: {testCase.created_by}</span></div>
                    <div><span className="block text-gray-400 mb-1 flex items-center gap-1"><Clock className="w-3 h-3"/> Created At</span><span className="text-gray-700">{formatDate(testCase.created_at)}</span></div>
                    <div><span className="block text-gray-400 mb-1 flex items-center gap-1"><User className="w-3 h-3"/> Updated By</span><span className="text-gray-700">{testCase.updated_by ? `User ID: ${testCase.updated_by}` : '-'}</span></div>
                    <div><span className="block text-gray-400 mb-1 flex items-center gap-1"><Clock className="w-3 h-3"/> Updated At</span><span className="text-gray-700">{formatDate(testCase.updated_at)}</span></div>
                    <div className="col-span-2"><span className="block text-gray-400 mb-1 flex items-center gap-1"><Tag className="w-3 h-3"/> Labels</span><span className="text-gray-700 bg-gray-100 px-2 py-1 rounded">{testCase.labels || 'None'}</span></div>
                    <div className="col-span-2"><span className="block text-gray-400 mb-1 flex items-center gap-1"><FileText className="w-3 h-3"/> Template</span><span className="text-gray-700">{testCase.template || 'Default'}</span></div>
                </div>
            </div>
        </div>

        {/* Right Col: Steps */}
        <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b bg-gray-50"><h2 className="font-semibold text-lg text-gray-800">Test Steps ({steps.length})</h2><button onClick={handleAddStep} className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-bold"><Plus className="w-4 h-4" /> Add Step</button></div>
                <table className="w-full text-left">
                    <thead className="bg-gray-100 text-xs text-gray-500 uppercase font-bold"><tr><th className="p-4 w-12 text-center">No</th><th className="p-4 w-1/3">Action</th><th className="p-4 w-1/4">Data</th><th className="p-4 w-1/3">Expected Result</th><th className="p-4 w-20"></th></tr></thead>
                    <tbody className="divide-y divide-gray-100">
                        {steps.map((step, index) => {
                            const isRowEditing = editingStepId === step.id;
                            return (
                                <tr key={step.id} className="hover:bg-gray-50 group">
                                    <td className="p-4 text-center text-gray-400 font-mono text-xs">{index + 1}</td>
                                    <td className="p-4 align-top">{isRowEditing ? <textarea className="w-full border p-1 rounded text-sm" rows={2} value={tempStepData.action} onChange={e => setTempStepData({...tempStepData, action: e.target.value})} /> : <div className="text-sm text-gray-800">{step.action}</div>}</td>
                                    <td className="p-4 align-top">{isRowEditing ? <textarea className="w-full border p-1 rounded text-sm" rows={2} value={tempStepData.data} onChange={e => setTempStepData({...tempStepData, data: e.target.value})} /> : <div className="text-sm text-gray-500">{step.data || '-'}</div>}</td>
                                    <td className="p-4 align-top">{isRowEditing ? <textarea className="w-full border p-1 rounded text-sm" rows={2} value={tempStepData.expected} onChange={e => setTempStepData({...tempStepData, expected: e.target.value})} /> : <div className="text-sm text-gray-800">{step.expected}</div>}</td>
                                    <td className="p-4 text-center align-top">{isRowEditing ? <div className="flex flex-col gap-2"><button onClick={handleSaveStep} className="text-green-600 hover:bg-green-50 p-1 rounded"><Check className="w-4 h-4" /></button><button onClick={() => setEditingStepId(null)} className="text-gray-500 hover:bg-gray-100 p-1 rounded"><X className="w-4 h-4" /></button></div> : <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity"><button onClick={() => startEditStep(step)} className="text-blue-500 hover:bg-blue-50 p-1 rounded"><Edit2 className="w-4 h-4" /></button><button onClick={() => handleDeleteStep(step.id)} className="text-red-500 hover:bg-red-50 p-1 rounded"><Trash2 className="w-4 h-4" /></button></div>}</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
      </div>

      <MoveEntityModal isOpen={showMoveModal} onClose={() => setShowMoveModal(false)} modules={modules} onMove={handleMoveCaseConfirm} title="Move Test Case" entityName={testCase.title} />
    </div>
  );
}