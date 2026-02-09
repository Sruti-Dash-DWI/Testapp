import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { X, ChevronDown, Plus, Save, Trash2, Wand2, AlertCircle, RefreshCw } from 'lucide-react';

export default function ManualTestCaseModals({ isOpen, onClose, projectId, onSaveSuccess, preSelectedModule }) {
  const navigate = useNavigate(); 
  const [step, setStep] = useState(1); 
  const [creationMode, setCreationMode] = useState('manual'); 
  const [loading, setLoading] = useState(false);
  const [modulesLoading, setModulesLoading] = useState(false); 
  const [error, setError] = useState(null);
  const [fetchedModules, setFetchedModules] = useState([]); 

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const authToken = localStorage.getItem('authToken');

  const PRIORITIES = ['LOWEST', 'LOW', 'MEDIUM', 'HIGH', 'HIGHEST'];
  const SEVERITIES = ['BLOCKER', 'CRITICAL', 'MAJOR', 'MINOR'];
  const LABELS = ['FUNCTIONAL', 'SMOKE', 'REGRESSION', 'NEGATIVE', 'SECURITY', 'VALIDATION', 'EDGE', 'PERFORMANCE', 'INTEGRATION', 'USABILITY'];
  const STATUS_OPTIONS = [{ value: 'PASSED', label: 'Passed' }, { value: 'FAILED', label: 'Failed' }, { value: 'WARNING', label: 'Warning' }, { value: 'SKIPPED', label: 'Skipped' }, { value: 'NOT_EXECUTED', label: 'Not Executed' }];

  useEffect(() => {
    if (isOpen && projectId) {
      const getModules = async () => {
        setModulesLoading(true);
        try {
          const response = await fetch(`${API_BASE_URL}/testcase/modules/?project=${projectId}`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
          });
          if (!response.ok) throw new Error("Failed to fetch modules");
          const data = await response.json();
          setFetchedModules(data);
        } catch (err) { setError("Failed to load modules"); } 
        finally { setModulesLoading(false); }
      };
      getModules();
    }
  }, [isOpen, projectId]);

  const flatModules = useMemo(() => {
    const flatten = (nodes, depth = 0) => {
      let result = [];
      if (!nodes) return result;
      nodes.forEach(node => {
        result.push({ id: node.id, name: node.name, depth });
        if (node.children) result = result.concat(flatten(node.children, depth + 1));
      });
      return result;
    };
    return flatten(fetchedModules); 
  }, [fetchedModules]);

  useEffect(() => {
      if(preSelectedModule) setFormData(prev => ({...prev, parentModule: preSelectedModule}));
  }, [preSelectedModule]);

  const [formData, setFormData] = useState({
    name: '', type: 'FUNCTIONAL', description: '', parentModule: preSelectedModule || '', 
    labels: 'FUNCTIONAL', status: 'NOT_EXECUTED', priority: 'MEDIUM', severity: 'MINOR', 
    preConditions: '', feature: '', min_case: '2'
  });

  const [testSteps, setTestSteps] = useState([{ id: Date.now(), step: '', input: '', expected: '' }]);

  const handleClose = () => {
    setStep(1); setCreationMode('manual'); setError(null);
    setFormData({ name: '', type: 'FUNCTIONAL', description: '', parentModule: '', 
      labels: 'FUNCTIONAL', feature: '', priority: 'MEDIUM', severity: 'MINOR', 
      status: 'NOT_EXECUTED', preConditions: '', min_case: '2' });
    setTestSteps([{ id: Date.now(), step: '', input: '', expected: '' }]);
    onClose();
  };

  const handleNextStep = () => {
    if (creationMode === 'manual') {
      if (!formData.name) return alert("Name is required");
      if (!formData.parentModule) return alert("Parent Module is required");
      setStep(2);
    } else {
        // AI MODE
        handleAiGenerate();
    }
  };

  
  const handleAiGenerate = async () => {
      if (!formData.feature) return alert("Feature description is required");
      
      setLoading(true);
      try {
          const response = await fetch(`${API_BASE_URL}/testcase/interact/generate_excel/`, {
              method: 'POST',
              headers: { 
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${authToken}` 
              },
              body: JSON.stringify({
                  feature: formData.feature,
                  min_case: formData.min_case
              })
          });

          if (!response.ok) throw new Error("AI Generation Failed");

         
          const blob = await response.blob();

         
          onClose(); 
          navigate(`/project/${projectId}/ai-review`, { 
              state: { 
                  fileBlob: blob, 
                  initialModuleId: formData.parentModule,
                  fileName: 'ai_generated_cases.xlsx' 
              } 
          });

      } catch (err) {
          console.error(err);
          setError("Failed to generate test cases: " + err.message);
      } finally {
          setLoading(false);
      }
  };

  const handleSave = async () => {
    setLoading(true); setError(null);
    const validSteps = testSteps.filter(s => s.step.trim() !== '').map((s, index) => ({
        order: index + 1, action: s.step, data: s.input, expected: s.expected
    }));
    const payload = {
        title: formData.name,
        natural_language: formData.description, preconditions: formData.preConditions,
        expected_result: "See steps", priority: formData.priority, status: formData.status,
        labels: formData.type, severity: formData.severity,
        module: formData.parentModule ? parseInt(formData.parentModule) : null, 
        project: parseInt(projectId), steps: validSteps
    };
    try {
        const response = await fetch(`${API_BASE_URL}/testcase/cases/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authToken}` },
            body: JSON.stringify(payload)
        });
        if (!response.ok) throw new Error("Failed to create test case");
        if (onSaveSuccess) onSaveSuccess();
        handleClose();
    } catch (err) { setError(err.message); } finally { setLoading(false); }
  };

  if (!isOpen) return null;
  const overlayStyle = "fixed inset-0 z-50 flex items-center justify-center bg-blue-900/20 backdrop-blur-sm p-4 animate-in fade-in duration-200";
  const glassContainer = "bg-white/95 backdrop-blur-xl border border-white/50 shadow-2xl rounded-2xl flex flex-col overflow-hidden";
  const labelStyle = "block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide";
  const inputStyle = "w-full px-4 py-2 bg-blue-50/30 border border-blue-100 rounded-lg text-gray-700 focus:outline-none focus:border-blue-400";
  const selectStyle = "w-full px-4 py-2 bg-blue-50/30 border border-blue-100 rounded-lg text-gray-700 appearance-none focus:outline-none focus:border-blue-400 cursor-pointer";

  if (step === 1) {
    return (
      <div className={overlayStyle}>
        <div className={`${glassContainer} w-full max-w-lg`}>
          <div className="flex justify-between items-center px-6 py-5 border-b bg-gradient-to-r from-white via-blue-50/30 to-white">
            <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-indigo-600">Create Manual Test Case</h2>
            <button onClick={handleClose}><X className="w-5 h-5 text-gray-400 hover:text-red-500" /></button>
          </div>
          <div className="p-6 space-y-6">
             <div className="flex gap-4">
                <button onClick={()=>setCreationMode('manual')} className={`flex-1 p-3 rounded-xl border text-center font-bold transition-all ${creationMode==='manual'?'border-blue-500 bg-blue-50 text-blue-600 shadow-sm':'border-gray-200 hover:bg-gray-50'}`}>Manual Creation</button>
                <button onClick={()=>setCreationMode('ai')} className={`flex-1 p-3 rounded-xl border text-center font-bold transition-all ${creationMode==='ai'?'border-indigo-500 bg-indigo-50 text-indigo-600 shadow-sm':'border-gray-200 hover:bg-gray-50'}`}>AI Generate <Wand2 className="inline w-3 h-3"/></button>
             </div>
             
             {error && <div className="text-red-500 text-sm p-2 bg-red-50 rounded">{error}</div>}

             {creationMode === 'manual' ? (
                 <div className="space-y-4 animate-in fade-in">
                    <div><label className={labelStyle}>Name <span className="text-red-500">*</span></label><input className={inputStyle} value={formData.name} onChange={e=>setFormData({...formData, name: e.target.value})} placeholder="E.g. Login Validation" /></div>
                    <div><label className={labelStyle}>Type</label><select className={selectStyle} value={formData.type} onChange={e=>setFormData({...formData, type: e.target.value})}>{LABELS.map(l=><option key={l} value={l}>{l}</option>)}</select></div>
                    <div><label className={labelStyle}>Description</label><input className={inputStyle} value={formData.description} onChange={e=>setFormData({...formData, description: e.target.value})} placeholder="Brief description" /></div>
                    <div><label className={labelStyle}>Parent Module <span className="text-red-500">*</span></label><select className={selectStyle} value={formData.parentModule} onChange={e=>setFormData({...formData, parentModule: e.target.value})}><option value="">Select Module</option>{flatModules.map(m=><option key={m.id} value={m.id}>{'\u00A0'.repeat(m.depth*2)}{m.name}</option>)}</select></div>
                 </div>
             ) : (
                 <div className="space-y-4 animate-in fade-in">
                     <div><label className={labelStyle}>Feature Description <span className="text-red-500">*</span></label><textarea className={inputStyle} rows={4} value={formData.feature} onChange={e=>setFormData({...formData, feature: e.target.value})} placeholder="Describe what to test..." /></div>
                     <div><label className={labelStyle}>Parent Module (For Import)</label><select className={selectStyle} value={formData.parentModule} onChange={e=>setFormData({...formData, parentModule: e.target.value})}><option value="">Select Module</option>{flatModules.map(m=><option key={m.id} value={m.id}>{'\u00A0'.repeat(m.depth*2)}{m.name}</option>)}</select></div>
                     <div><label className={labelStyle}>Min Cases</label><input type="number" className={inputStyle} value={formData.min_case} onChange={e=>setFormData({...formData, min_case: e.target.value})} /></div>
                 </div>
             )}
          </div>
          <div className="p-4 bg-gray-50 flex justify-end gap-3 border-t">
             <button onClick={handleClose} className="px-5 py-2 text-sm font-semibold bg-white border rounded-xl hover:bg-gray-50">Cancel</button>
             <button onClick={handleNextStep} disabled={loading} className="px-6 py-2 text-sm font-semibold text-white bg-blue-600 rounded-xl shadow-lg hover:bg-blue-700 flex items-center gap-2">
                 {loading && <RefreshCw className="w-4 h-4 animate-spin"/>}
                 {creationMode === 'ai' ? 'Generate & Review' : 'Next Step'}
             </button>
          </div>
        </div>
      </div>
    );
  }

  
  return (
    <div className={overlayStyle}>
       
        <div className={`${glassContainer} w-full max-w-7xl h-[90vh]`}>
            <div className="flex justify-between items-center px-8 py-4 border-b bg-white/50 sticky top-0 z-10">
                <div><h1 className="text-xl font-extrabold text-gray-800">{formData.name || 'New Test Case'}</h1></div>
                <div className="flex gap-3"><button onClick={handleSave} className="px-6 py-2 bg-gradient-to-r from-blue-700 to-blue-600 text-white font-semibold rounded-lg shadow-lg flex items-center gap-2">{loading ? 'Saving...' : <><Save className="w-4 h-4"/> Save Test Case</>}</button><button onClick={handleClose}><X className="w-6 h-6 text-gray-400 hover:text-red-500"/></button></div>
            </div>
            <div className="flex-1 overflow-y-auto p-8 grid grid-cols-12 gap-8 bg-gradient-to-b from-white/60 to-blue-50/10">
                <div className="col-span-4 space-y-6">
                    <div><label className={labelStyle}>Pre-conditions</label><textarea className={`${inputStyle} resize-none`} rows={3} value={formData.preConditions} onChange={e=>setFormData({...formData, preConditions: e.target.value})} placeholder="Prerequisites..." /></div>
                    <div><label className={labelStyle}>Status</label><select className={selectStyle} value={formData.status} onChange={e=>setFormData({...formData, status: e.target.value})}>{STATUS_OPTIONS.map(o=><option key={o.value} value={o.value}>{o.label}</option>)}</select></div>
                    <div className="grid grid-cols-2 gap-4">
                        <div><label className={labelStyle}>Priority</label><select className={selectStyle} value={formData.priority} onChange={e=>setFormData({...formData, priority: e.target.value})}>{PRIORITIES.map(p=><option key={p} value={p}>{p}</option>)}</select></div>
                        <div><label className={labelStyle}>Severity</label><select className={selectStyle} value={formData.severity} onChange={e=>setFormData({...formData, severity: e.target.value})}>{SEVERITIES.map(s=><option key={s} value={s}>{s}</option>)}</select></div>
                    </div>
                </div>
                <div className="col-span-8">
                     <div className="bg-white/70 border border-blue-100 rounded-2xl shadow-sm overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-blue-50/50 border-b border-blue-100"><tr><th className="p-4 w-12 text-center text-xs font-bold text-gray-500">#</th><th className="p-4 text-xs font-bold text-gray-500 uppercase">Step Action</th><th className="p-4 text-xs font-bold text-gray-500 uppercase">Input Data</th><th className="p-4 text-xs font-bold text-gray-500 uppercase">Expected Result</th><th className="w-12"></th></tr></thead>
                            <tbody className="divide-y divide-blue-50">
                                {testSteps.map((step, i) => (
                                    <tr key={step.id} className="hover:bg-blue-50/30">
                                        <td className="p-4 text-center text-gray-400 text-xs font-mono">{i+1}</td>
                                        <td className="p-2 border-r border-blue-50"><textarea className="w-full bg-transparent p-2 text-sm outline-none resize-none" rows={1} value={step.step} onChange={e=>{const n=[...testSteps];n[i].step=e.target.value;setTestSteps(n)}} placeholder="Describe action..." /></td>
                                        <td className="p-2 border-r border-blue-50"><textarea className="w-full bg-transparent p-2 text-sm outline-none resize-none" rows={1} value={step.input} onChange={e=>{const n=[...testSteps];n[i].input=e.target.value;setTestSteps(n)}} /></td>
                                        <td className="p-2"><textarea className="w-full bg-transparent p-2 text-sm outline-none resize-none" rows={1} value={step.expected} onChange={e=>{const n=[...testSteps];n[i].expected=e.target.value;setTestSteps(n)}} placeholder="Result..." /></td>
                                        <td className="p-2 text-center"><button onClick={()=>{if(testSteps.length>1)setTestSteps(testSteps.filter(s=>s.id!==step.id))}}><Trash2 className="w-4 h-4 text-gray-300 hover:text-red-500"/></button></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <button onClick={()=>setTestSteps([...testSteps, {id:Date.now(), step:'', input:'', expected:''}])} className="w-full py-3 bg-gray-50/50 hover:bg-blue-50 text-blue-600 font-bold text-sm border-t border-blue-100 flex items-center justify-center gap-2"><Plus className="w-4 h-4"/> Add Step</button>
                     </div>
                </div>
            </div>
        </div>
    </div>
  );
}