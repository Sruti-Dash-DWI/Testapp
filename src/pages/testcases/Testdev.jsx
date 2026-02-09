import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';

import { 
  Home, Play, Settings, Plus, Search, Filter, 
  MoreVertical, Menu, X, ChevronRight, ChevronDown, 
  Package, FileText, Edit, Trash2, CornerDownRight, Eye, Move, Upload
} from 'lucide-react';

import ManualTestCaseModals from './ManualTestCaseModals';
import MoveEntityModal from './MoveEntityModal'; 

export default function TestScriptsUI() {
  const navigate = useNavigate();
  const { projectId } = useParams();
  
  
  const [modules, setModules] = useState([]); 
  const [simpleModules, setSimpleModules] = useState([]); 
  const [expandedModules, setExpandedModules] = useState({}); 
  const [actionMenuOpenId, setActionMenuOpenId] = useState(null); 

  
  const [loadingData, setLoadingData] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false);
  const [loadingEdit, setLoadingEdit] = useState(false); 

  const [activeTab, setActiveTab] = useState('scripts');
  const [showModal, setShowModal] = useState(false); 
  const [showManualTestCaseModal, setShowManualTestCaseModal] = useState(false);
  const [showMoveModal, setShowMoveModal] = useState(false);
  
  
  const [selectedModuleDetails, setSelectedModuleDetails] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [moduleToMove, setModuleToMove] = useState(null);
  const [preSelectedModuleForCase, setPreSelectedModuleForCase] = useState(null);

  
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);


  const [formData, setFormData] = useState({
    name: '',
    description: '',
    parent: ''
  });

  const { colors } = useTheme();
  const actionMenuRef = useRef(null);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const authToken = localStorage.getItem('authToken');


  useEffect(() => {
    if (!authToken) navigate("/login");
  }, [authToken, navigate]);

  const fetchModules = async () => {
    if (!projectId) return;
    setLoadingData(true);
    try {
      const response = await fetch(`${API_BASE_URL}/testcase/modules/?project=${projectId}`, {
        headers: { 'Authorization': `Bearer ${authToken}`, 'Content-Type': 'application/json' }
      });
      if (!response.ok) throw new Error('Failed to fetch modules');
      const data = await response.json();
      setModules(data);
    } catch (error) {
      console.error("Error fetching modules:", error);
    } finally {
      setLoadingData(false);
    }
  };

  const fetchSimpleModules = async () => {
    if (!projectId) return;
    try {
      const response = await fetch(`${API_BASE_URL}/testcase/modules/simple-modules/?project=${projectId}`, {
        headers: { 'Authorization': `Bearer ${authToken}`, 'Content-Type': 'application/json' }
      });
      if (response.ok) {
        const data = await response.json();
        setSimpleModules(flattenModules(data));
      }
    } catch (error) {
      console.error("Error fetching simple modules:", error);
    }
  };

  const flattenModules = (nestedModules, depth = 0, result = []) => {
    nestedModules.forEach(mod => {
      result.push({ ...mod, depth });
      if (mod.children && mod.children.length > 0) {
        flattenModules(mod.children, depth + 1, result);
      }
    });
    return result;
  };

  useEffect(() => {
    fetchModules();
    const handleClickOutside = (event) => {
        if (actionMenuRef.current && !actionMenuRef.current.contains(event.target)) {
            setActionMenuOpenId(null);
        }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [projectId]);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString();
  };

 

 
  const handleFileUpload = (e) => {
      const file = e.target.files[0];
      if (file) {
          
          navigate(`/project/${projectId}/ai-review`, { 
              state: { fileBlob: file, fileName: file.name } 
          });
      }
  };

  const handleTestCaseSaved = () => {
    setShowManualTestCaseModal(false);
    fetchModules(); 
  };

  const openCreateModal = (parentModule = null) => {
    setIsEditing(false);
    setEditingId(null);
    setFormData({
      name: '',
      description: '',
      parent: parentModule ? parentModule.id : '' 
    });
    fetchSimpleModules(); 
    setShowModal(true);
    setActionMenuOpenId(null);
  };

  const openEditModal = async (module) => {
    setIsEditing(true);
    setEditingId(module.id);
    setActionMenuOpenId(null);
    setShowModal(true); 
    setLoadingEdit(true); 

    setFormData({
      name: module.name,
      description: module.description || '', 
      parent: ''
    });

    try {
        const response = await fetch(`${API_BASE_URL}/testcase/modules/${module.id}/`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        if (response.ok) {
            const data = await response.json();
            setFormData({
                name: data.name,
                description: data.description || '', 
                parent: data.parent || ''
            });
        }
    } catch (error) {
        console.error("Failed to fetch module details", error);
    } finally {
        setLoadingEdit(false);
    }
    fetchSimpleModules();
  };

  const openMoveModal = (module) => {
    setModuleToMove(module);
    fetchSimpleModules();
    setActionMenuOpenId(null);
    setShowMoveModal(true);
  };

  
  const openDetailsModal = async (module) => {
    try {
        const response = await fetch(`${API_BASE_URL}/testcase/modules/${module.id}/`, {
             headers: { 'Authorization': `Bearer ${authToken}` }
        });
        
        if (response.ok) {
            const data = await response.json();
            setSelectedModuleDetails(data);
            setShowDetailsModal(true);
            setActionMenuOpenId(null);
        } else {
            alert("Could not fetch module details");
        }
    } catch (e) {
        console.error(e);
    }
  };

  const openCreateTestCaseModal = (module) => {
    setPreSelectedModuleForCase(module ? module.id : null);
    setShowManualTestCaseModal(true);
    setActionMenuOpenId(null);
  };

  

  const handleSaveModule = async () => {
    if (!formData.name.trim()) return alert("Module name is required");
    setLoadingSave(true);
    try {
      let url = isEditing ? `${API_BASE_URL}/testcase/modules/${editingId}/` : `${API_BASE_URL}/testcase/modules/`;
      let method = isEditing ? 'PATCH' : 'POST';
      let payload = {
            name: formData.name.trim(),
            description: formData.description.trim(),
            project: isEditing ? undefined : parseInt(projectId),
            parent: formData.parent ? parseInt(formData.parent) : null
      };

      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authToken}` },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error('Operation failed');

      alert(`Module ${isEditing ? 'updated' : 'created'} successfully!`);
      setShowModal(false);
      fetchModules(); 
    } catch (error) {
      alert(`Error: ${error.message}`);
    } finally {
      setLoadingSave(false);
    }
  };

  const handleMoveModuleConfirm = async (targetModuleId) => {
      if(!moduleToMove) return;
      try {
        const payload = { parent: targetModuleId === 'root' ? null : parseInt(targetModuleId) };
        const response = await fetch(`${API_BASE_URL}/testcase/modules/${moduleToMove.id}/move/`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authToken}` },
            body: JSON.stringify(payload)
        });
        if (!response.ok) throw new Error('Failed to move module');
        alert("Module moved successfully");
        fetchModules();
      } catch (error) {
        alert("Error moving module: " + error.message);
      }
  };

  const handleDeleteModule = async (id) => {
    if (!window.confirm("Are you sure you want to delete this module?")) return;

    try {
      const response = await fetch(`${API_BASE_URL}/testcase/modules/${id}/`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${authToken}` }
      });

      if (!response.ok) {
        
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to delete module');
      }

      alert("Module deleted successfully");
      fetchModules();
    } catch (error) {
      // This will now show: "Cannot delete module while it still has test cases..."
      alert(error.message);
    }
  };

  

  const toggleModule = (moduleId) => {
    setExpandedModules(prev => ({ ...prev, [moduleId]: !prev[moduleId] }));
  };

  const renderModuleRow = (module, level = 0) => {
    const isExpanded = expandedModules[module.id];
    const isMenuOpen = actionMenuOpenId === module.id;
    const paddingLeft = `${level * 20 + 16}px`;

    return (
      <React.Fragment key={`module-${module.id}`}>
        <div className="grid grid-cols-12 gap-4 px-4 py-3 items-center border-b border-gray-100 hover:bg-black/5 transition-colors relative">
          <div className="col-span-5 flex items-center gap-3" style={{ paddingLeft }}>
            <button onClick={() => toggleModule(module.id)} className="p-1 hover:bg-gray-200 rounded">
                {(module.children?.length > 0 || module.testcases?.length > 0) ? (
                    isExpanded ? <ChevronDown className="w-4 h-4 text-gray-500" /> : <ChevronRight className="w-4 h-4 text-gray-500" />
                ) : <span className="w-4 h-4" />} 
            </button>
            {level > 0 && <CornerDownRight className="w-4 h-4 text-gray-400" />}
            <Package className="w-4 h-4 text-indigo-500" />
            <span className="font-medium" style={{color: colors.text}}>{module.name}</span>
          </div>
          <div className="col-span-3 text-sm text-gray-500">Module</div>
          <div className="col-span-3 text-sm text-gray-500">-</div>
          <div className="col-span-1 flex items-center gap-2 relative">
             
             <button className="p-1 hover:bg-gray-200 rounded" title="Add Test Case" onClick={() => openCreateTestCaseModal(module)}>
                <Plus className="w-4 h-4 text-blue-600" />
            </button>

            <div className="relative">
                <button className="p-1 hover:bg-gray-200 rounded" onClick={(e) => { e.stopPropagation(); setActionMenuOpenId(isMenuOpen ? null : module.id); }}>
                    <MoreVertical className="w-4 h-4 text-gray-500" />
                </button>
                {isMenuOpen && (
                    <div ref={actionMenuRef} className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded shadow-lg z-50">
                        <button onClick={() => openCreateModal(module)} className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                            <Plus className="w-3 h-3 mr-2" /> Add Sub-Module
                        </button>
                        <button onClick={() => openDetailsModal(module)} className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                            <Eye className="w-3 h-3 mr-2" /> View Details
                        </button>
                        <button onClick={() => openEditModal(module)} className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                            <Edit className="w-3 h-3 mr-2" /> Edit
                        </button>
                        <button onClick={() => openMoveModal(module)} className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                            <Move className="w-3 h-3 mr-2" /> Move Module
                        </button>
                        <button onClick={() => handleDeleteModule(module.id)} className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                            <Trash2 className="w-3 h-3 mr-2" /> Delete
                        </button>
                    </div>
                )}
            </div>
          </div>
        </div>

        {isExpanded && (
          <>
            {module.testcases && module.testcases.map(tc => (
               <div key={`tc-${tc.id}`} onClick={() => navigate(`/project/${projectId}/test-case/${tc.id}`)} className="grid grid-cols-12 gap-4 px-4 py-2 items-center border-b border-gray-100 hover:bg-blue-50 cursor-pointer bg-gray-50/50 transition-colors">
                 <div className="col-span-5 flex items-center gap-3" style={{ paddingLeft: `${(level + 1) * 20 + 44}px` }}>
                   <FileText className="w-4 h-4 text-blue-400" />
                   <span className="text-sm font-medium" style={{color: colors.text}}>{tc.title}</span>
                 </div>
                 <div className="col-span-3 text-sm text-gray-500">Test Case</div>
                 <div className="col-span-3 text-sm text-gray-500">{tc.labels || 'Functional'}</div>
                 <div className="col-span-1"></div>
               </div>
            ))}
            {module.children && module.children.map(child => renderModuleRow(child, level + 1))}
          </>
        )}
      </React.Fragment>
    );
  };

  return (
    <div className="min-h-screen" style={{backgroundColor: colors.card, color: colors.text, borderColor: colors.border}}>
      
      <div className="bg-white border-b border-gray-200 px-4 py-3" style={{backgroundColor: colors.card, color: colors.text, borderColor: colors.border}}>
        <div className="flex items-center gap-2 text-sm">
          <Home className="w-5 h-5" />
          <span className="text-gray-400">{'>'}</span>
          <span className="font-medium">Test Development</span>
          <span className="text-gray-400">{'>'}</span>
          <span>Scripts</span>
        </div>
      </div>

      
      <div className="bg-white border-b border-gray-200 px-4" style={{backgroundColor: colors.card, color: colors.text, borderColor: colors.border}}>
        <div className="flex gap-8">
            <button onClick={() => setActiveTab('scripts')} className={`py-4 px-2 text-sm font-medium border-b-2 ${activeTab === 'scripts' ? 'border-blue-400 text-blue-500' : 'border-transparent text-gray-400'}`}>Scripts</button>
            <button onClick={() => setActiveTab('execution')} className={`py-4 px-2 text-sm font-medium border-b-2 ${activeTab === 'execution' ? 'border-blue-400 text-blue-500' : 'border-transparent text-gray-400'}`}>Execution Dashboard</button>
        </div>
      </div>

   
      <div className="p-6">
        <div className="flex items-center justify-between mb-6" >
          <h1 className="text-2xl font-semibold">Scripts</h1>
          <div className="flex items-center gap-3">
            <button className="p-2 hover:bg-gray-100 rounded"><Search className="w-5 h-5" /></button>
            <button className="p-2 hover:bg-gray-100 rounded"><Filter className="w-5 h-5" /></button>
            
            
            <label className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-50 flex items-center gap-2 text-sm font-medium shadow-sm cursor-pointer transition-all">
                <Upload className="w-4 h-4 text-gray-500" />
                Import Excel
                <input type="file" accept=".xlsx, .xls" className="hidden" onChange={handleFileUpload} />
            </label>

            <button onClick={() => openCreateModal(null)} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2 text-sm font-medium shadow-md">
              <Plus className="w-4 h-4" /> Root Module
            </button>
            <button onClick={() => openCreateTestCaseModal(null)} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 flex items-center gap-2 text-sm font-medium shadow-md">
              <Plus className="w-4 h-4" /> Manual Test Case
            </button>
          </div>
        </div>

        <div className="bg-white rounded-t-lg border border-gray-200 shadow-sm" style={{backgroundColor: colors.card, borderColor: colors.border}}>
          <div className="grid grid-cols-12 gap-4 px-4 py-3 bg-gray-50 border-b border-gray-200 text-sm font-medium text-gray-700">
            <div className="col-span-5 flex items-center gap-3"><span>MODULE</span><Menu className="w-4 h-4"/></div>
            <div className="col-span-3">TEST CASE TYPE</div>
            <div className="col-span-3">TYPE</div>
            <div className="col-span-1">ACTIONS</div>
          </div>
          {loadingData ? <div className="p-8 text-center text-gray-500">Loading modules...</div> : 
           modules.length === 0 ? <div className="p-12 text-center text-gray-500">No modules found.</div> : 
           <div className="divide-y divide-gray-200">{modules.map(module => renderModuleRow(module))}</div>}
        </div>
      </div>

      {/* --- MODULE DETAILS MODAL --- */}
      {showDetailsModal && selectedModuleDetails && (
        <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-lg p-6 border border-gray-200" style={{backgroundColor: colors.card, color: colors.text, borderColor: colors.border}}>
                <div className="flex items-center justify-between mb-6 pb-2 border-b border-gray-100">
                    <h2 className="text-xl font-semibold flex items-center gap-2" style={{color: colors.text}}>
                        <Eye className="w-5 h-5 text-blue-500" />
                        Module Details
                    </h2>
                    <button onClick={() => setShowDetailsModal(false)} className="p-1 hover:bg-gray-100 rounded">
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>
                
                <div className="space-y-4 text-sm">
                    <div className="grid grid-cols-3 gap-2">
                        <span className="font-semibold text-gray-500">Name:</span>
                        <span className="col-span-2 font-medium" style={{color: colors.text}}>{selectedModuleDetails.name}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                        <span className="font-semibold text-gray-500">Description:</span>
                        <span className="col-span-2 text-gray-600" style={{color: colors.text}}>
                            {selectedModuleDetails.description || 'No description provided'}
                        </span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                        <span className="font-semibold text-gray-500">Module ID:</span>
                        <span className="col-span-2 font-mono" style={{color: colors.text}}>{selectedModuleDetails.id}</span>
                    </div>
                      <div className="grid grid-cols-3 gap-2">
                        <span className="font-semibold text-gray-500">Project ID:</span>
                        <span className="col-span-2 font-mono" style={{color: colors.text}}>{selectedModuleDetails.project}</span>
                    </div>
                    {selectedModuleDetails.parent && (
                         <div className="grid grid-cols-3 gap-2">
                            <span className="font-semibold text-gray-500">Parent ID:</span>
                            <span className="col-span-2 font-mono" style={{color: colors.text}}>{selectedModuleDetails.parent}</span>
                        </div>
                    )}
                    <div className="border-t border-gray-100 my-2 pt-2"></div>
                    <div className="grid grid-cols-3 gap-2">
                        <span className="font-semibold text-gray-500">Created At:</span>
                        <span className="col-span-2" style={{color: colors.text}}>{formatDate(selectedModuleDetails.created_at)}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                        <span className="font-semibold text-gray-500">Updated At:</span>
                        <span className="col-span-2" style={{color: colors.text}}>{formatDate(selectedModuleDetails.updated_at)}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                        <span className="font-semibold text-gray-500">Created By (ID):</span>
                        <span className="col-span-2" style={{color: colors.text}}>{selectedModuleDetails.created_by}</span>
                    </div>
                </div>

                <div className="flex justify-end mt-6">
                    <button 
                        onClick={() => setShowDetailsModal(false)}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm font-medium"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
      )}

      
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm bg-black/20">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-md p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">{isEditing ? 'Edit Module' : 'Create Module'}</h2>
              <button onClick={() => setShowModal(false)} className="p-1 hover:bg-gray-100 rounded"><X className="w-5 h-5 text-gray-500" /></button>
            </div>
            {loadingEdit ? <div className="text-center py-4">Loading...</div> : (
                <div className="space-y-4">
                    <div><label className="block text-sm font-medium mb-1"><span className="text-red-500">*</span> Name</label>
                    <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500" /></div>
                    <div><label className="block text-sm font-medium mb-1">Description</label>
                    <textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} rows={4} maxLength={200} className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 resize-none" /></div>
                    {!isEditing && (
                        <div><label className="block text-sm font-medium mb-1">Parent Module</label>
                        <select value={formData.parent} onChange={(e) => setFormData({...formData, parent: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500">
                            <option value="">Root Module (No Parent)</option>
                            {simpleModules.map((mod) => <option key={mod.id} value={mod.id}>{'\u00A0'.repeat(mod.depth * 3)} {mod.name}</option>)}
                        </select></div>
                    )}
                </div>
            )}
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200 text-sm font-medium">Cancel</button>
              <button onClick={handleSaveModule} disabled={loadingSave} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm font-medium">{loadingSave ? "Saving..." : (isEditing ? "Update" : "Create")}</button>
            </div>
          </div>
        </div>
      )}

      
      <ManualTestCaseModals 
        isOpen={showManualTestCaseModal}
        onClose={() => setShowManualTestCaseModal(false)}
        projectId={projectId}
        onSaveSuccess={handleTestCaseSaved}
        preSelectedModule={preSelectedModuleForCase}
      />

     
      <MoveEntityModal 
        isOpen={showMoveModal}
        onClose={() => setShowMoveModal(false)}
        modules={simpleModules}
        onMove={handleMoveModuleConfirm}
        title="Move Module"
        entityName={moduleToMove?.name || 'Module'}
      />
    </div>
  );
}