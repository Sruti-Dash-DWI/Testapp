import React, { useState, useEffect, useRef } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Editor } from '@toast-ui/react-editor';
import { useTheme } from '../../../../context/ThemeContext';

import {
  FileText, Sparkles, Bug, TriangleAlert, Settings, GitPullRequestArrow,
  Share2, EllipsisVertical, Plus, ArrowLeft, ChevronDown, GripVertical,
  User, Tags, Users, Calendar, Baseline, MessageSquareText, Lock,
  Pencil, Trash2, Check, Package, Radio, ListTodo, TrendingUp, Send, Loader2, X
} from 'lucide-react';


const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


const getAuthHeaders = () => {
    const token = localStorage.getItem('authToken');
    return {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : ''
    };
};


const api = {
  fetchRecentForms: async (projectId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/projects/${projectId}/forms/`, {
        method: 'GET',
        headers: getAuthHeaders()
      });
      if (response.status === 401) return [];
      if (!response.ok) throw new Error('Failed to fetch forms');
      return await response.json();
    } catch (error) {
      console.error("[API] Error fetching forms:", error);
      return [];
    }
  },

  fetchFormData: async (projectId, formId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/projects/${projectId}/forms/${formId}/`, {
        method: 'GET',
        headers: getAuthHeaders()
      });
      if (!response.ok) throw new Error('Failed to fetch form details');
      return await response.json();
    } catch (error) {
      console.error("[API] Error fetching form data:", error);
      throw error;
    }
  },

  createForm: async (projectId, templateId) => {
    const timestamp = new Date().getTime();
    let payload = {
      title: "New Form",
      description: "Description here...",
      formType: "FEATURE",
      fields: []
    };

    if (templateId === 'bug') {
        payload.title = "Bug Report";
        payload.description = "I cannot login with google."; 
        payload.formType = "BUG"; 
        payload.fields = [
          { id: `field-${timestamp}-1`, type: 'short-text', title: 'Summary', label: 'Issue Summary', placeholder: 'Briefly describe the bug...', required: true },
          { id: `field-${timestamp}-2`, type: 'radio', title: 'Priority', label: 'Severity Level', options: ["Low", "Medium", "High", "Critical"], required: true },
          { id: `field-${timestamp}-3`, type: 'long-text', title: 'Description', label: 'Steps to Reproduce', placeholder1: '1. Go to settings...\n2. Click save...', required: false }
        ];
    } else if (templateId === 'feature') {
        payload.title = "New Feature";
        payload.description = "Request a new feature.";
        payload.formType = "FEATURE";
        payload.fields = [
            { id: `field-${timestamp}-1`, type: 'short-text', title: 'Summary', label: 'Feature Name', required: true }
        ];
    } else if (templateId === 'improvement') {
        payload.title = "Improvement";
        payload.description = "Suggest an improvement.";
        payload.formType = "IMPROVEMENT";
        payload.fields = [
            { id: `field-${timestamp}-1`, type: 'short-text', title: 'Summary', label: 'Improvement Area', required: true }
        ];
    }

    try {
      const response = await fetch(`${API_BASE_URL}/projects/${projectId}/forms/`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload)
      });
      if (!response.ok) throw new Error('Failed to create form');
      let data = await response.json();

     
      if (data.formType !== payload.formType) {
          await fetch(`${API_BASE_URL}/projects/${projectId}/forms/${data.id}/`, {
              method: 'PUT',
              headers: getAuthHeaders(),
              body: JSON.stringify({ ...data, formType: payload.formType })
          });
      }
      return data;
    } catch (error) {
      console.error("[API] Create Error:", error);
      throw error;
    }
  },

  saveFormData: async (projectId, formId, formData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/projects/${projectId}/forms/${formId}/`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(formData)
      });
      if (!response.ok) throw new Error('Failed to save form');
      return await response.json();
    } catch (error) {
      console.error("[API] Save Error:", error);
      throw error;
    }
  },

  deleteForm: async (projectId, formId) => {
    try {
      await fetch(`${API_BASE_URL}/projects/${projectId}/forms/${formId}/`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
    } catch (error) {
      console.error("[API] Delete Error:", error);
    }
  },

  submitForm: async (projectId, formId, formData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/projects/${projectId}/forms/${formId}/submit/`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(formData)
      });
      if (!response.ok) throw new Error('Failed to submit form');
      return await response.json();
    } catch (error) {
      console.error("[API] Submit Error:", error);
      throw error;
    }
  },

  fetchSidebarFields: async () => {
    return [
      { id: 'assignee', name: 'Assignee', icon: 'User', type: 'user' },
      { id: 'labels', name: 'Labels', icon: 'Tags', type: 'tags' },
      { id: 'start-date', name: 'Start date', icon: 'Calendar', type: 'date' },
      { id: 'short-text', name: 'Short text', icon: 'Baseline', type: 'short-text' },
      { id: 'long-text', name: 'Long text', icon: 'MessageSquareText', type: 'long-text' },
      { id: 'checkbox', name: 'Checkboxes', icon: 'ListTodo', type: 'checkbox' },
      { id: 'radio', name: 'Radio', icon: 'Radio', type: 'radio' },
    ];
  },

  fetchUsers: async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/users/`, {
            headers: getAuthHeaders()
        });
        if(response.ok) return await response.json();
        return [];
      } catch(e) { return []; }
  }
};

// --- Icon Mapper ---
const LucideIcon = ({ name, ...props }) => {
  const IconComponent = {
    FileText, Sparkles, Bug, TriangleAlert, Settings, GitPullRequestArrow,
    Share2, EllipsisVertical, Plus, ArrowLeft, ChevronDown, GripVertical,
    User, Tags, Users, Calendar, Baseline, MessageSquareText, Lock,
    Pencil, Trash2, Check, Package, Radio, ListTodo, TrendingUp, Send, Loader2, X
  }[name];
  return IconComponent ? <IconComponent {...props} /> : <Package {...props} />;
};

// --- Helper: Dropdown Component ---
const Dropdown = ({ button, children, align = 'right', buttonClassName, contentClassName }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { theme, colors } = useTheme();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block z-30" ref={dropdownRef}>
      <button onClick={() => setIsOpen((prev) => !prev)} className={buttonClassName || "focus:outline-none flex items-center gap-2"}>
        {button}
      </button>
      {isOpen && (
        <div 
            onClick={() => setIsOpen(false)} 
            className={`absolute mt-2 z-50 rounded-lg shadow-lg py-1 w-56 overflow-hidden border ${align === 'right' ? 'right-0' : 'left-0'} ${contentClassName || ''}`}
            style={{ 
                backgroundColor: theme === 'dark' ? 'rgba(30,30,40,0.95)' : 'white',
                borderColor: theme === 'dark' ? 'rgba(255,255,255,0.1)' : '#e5e7eb',
                color: colors.text
            }}
        >
          {children}
        </div>
      )}
    </div>
  );
};

// COMPONENT 1: Form Dashboard
export const PmFormDashboard = () => {
  const [recentForms, setRecentForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTemplate, setActiveTemplate] = useState('blank');
  
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { theme, colors } = useTheme();

  const loadForms = async () => {
    if (!projectId) { setLoading(false); return; }
    try {
      setLoading(true);
      const forms = await api.fetchRecentForms(projectId);
      setRecentForms(Array.isArray(forms) ? forms : []);
    } catch (err) {
      setError(err.message);
      setRecentForms([]); 
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadForms(); }, [projectId]);
  
  const handleSelectTemplate = (templateId) => {
    setActiveTemplate(templateId);
    handleCreateNewForm(templateId);
  };
  
  const handleCreateNewForm = async (templateId = 'blank') => {
    if (!projectId) return alert("Project ID not found");
    try {
      setLoading(true);
      const newForm = await api.createForm(projectId, templateId);
      if(newForm && newForm.id) navigate(`/forms/${projectId}/${newForm.id}`);
    } catch (err) {
      setError("Failed to create form.");
      setLoading(false);
    }
  };

  const handleDeleteForm = async (e, formId) => {
    e.stopPropagation(); e.preventDefault(); 
    if (window.confirm('Delete this form?')) {
      try {
        await api.deleteForm(projectId, formId);
        await loadForms(); 
      } catch (err) { setError('Failed to delete form.'); }
    }
  };

  const templates = [
    { id: 'blank', title: 'Blank form', icon: 'FileText' },
    { id: 'feature', title: 'Feature request', icon: 'Sparkles' },
    { id: 'bug', title: 'Bug report', icon: 'Bug' },
    { id: 'improvement', title: 'Improvement', icon: 'TrendingUp' },
  ];

  return (
    <div className="min-h-screen p-8 transition-colors duration-300" style={{ backgroundColor: colors.background, color: colors.text }}>
      <header className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold">Create a new form</h1>
      </header>
      <div className="flex flex-wrap gap-3 mb-12">
        {templates.map((template) => (
          <button key={template.id} onClick={() => handleSelectTemplate(template.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors`}
            style={{
                borderColor: activeTemplate === template.id ? '#3b82f6' : (theme === 'dark' ? 'rgba(255,255,255,0.1)' : '#e5e7eb'),
                backgroundColor: activeTemplate === template.id ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                color: activeTemplate === template.id ? '#3b82f6' : colors.text
            }}
          >
            <LucideIcon name={template.icon} className="w-4 h-4" />
            <span className="text-sm font-medium">{template.title}</span>
          </button>
        ))}
      </div>
      <div>
        <h2 className="text-xl font-semibold mb-4">Recent forms</h2>
        {loading && <Loader2 className="animate-spin" />}
        {error && <p className="text-red-500">{error}</p>}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Create Form Card (FIRST) */}
          <Dropdown align="left" buttonClassName="w-full h-full" contentClassName="w-48"
            button={
              <div className="flex flex-col items-center justify-center p-4 h-full border-2 border-dashed rounded-lg hover:border-blue-500 hover:text-blue-500 transition-all duration-200 aspect-square"
                   style={{ borderColor: theme === 'dark' ? 'rgba(255,255,255,0.2)' : '#e5e7eb', color: colors.text }}>
                <Plus className="w-16 h-16" />
                <span className="mt-2 font-medium">Create form</span>
              </div>
            }>
            <div className="p-2 text-sm font-medium opacity-70">Create new...</div>
            <div onClick={() => handleCreateNewForm('feature')} className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-black/5 cursor-pointer"><Sparkles className="w-4 h-4 text-purple-600" /> Feature</div>
            <div onClick={() => handleCreateNewForm('bug')} className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-black/5 cursor-pointer"><Bug className="w-4 h-4 text-red-600" /> Bug</div>
            <div onClick={() => handleCreateNewForm('improvement')} className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-black/5 cursor-pointer"><TrendingUp className="w-4 h-4 text-green-600" /> Improvement</div>
          </Dropdown>

         
          {recentForms.map((form) => (
            <FormCard key={form.id} form={form} onDelete={handleDeleteForm} />
          ))}
        </div>
      </div>
    </div>
  );
};

const FormCard = ({ form, onDelete }) => {
  const { theme, colors } = useTheme();
  
  const getBorderColor = () => {
    switch (form.formType) {
      case 'FEATURE': return 'border-blue-500';
      case 'BUG': return 'border-red-500';
      case 'IMPROVEMENT': return 'border-green-500';
      default: return 'border-gray-400';
    }
  };

  return (
    <Link to={`/forms/${form.projectId}/${form.id}`} 
        className={`group relative flex flex-col justify-between rounded-lg shadow-sm hover:shadow-lg transition-all duration-200 border-t-4 ${getBorderColor()} aspect-square`}
        style={{
            backgroundColor: theme === 'dark' ? 'rgba(30,30,40,0.6)' : 'white',
            backdropFilter: 'blur(16px)',
            color: colors.text
        }}
    >
      <button onClick={(e) => onDelete(e, form.id)} className="absolute top-2 right-2 p-1.5 rounded-full bg-white/10 opacity-0 group-hover:opacity-100 hover:bg-red-100 hover:text-red-600 transition-all z-10"><Trash2 className="w-4 h-4" /></button>
      <div className="p-5 flex flex-col">
        <LucideIcon name={form.formType === 'BUG' ? 'Bug' : form.formType === 'IMPROVEMENT' ? 'TrendingUp' : 'Sparkles'} 
          className={`w-8 h-8 mb-4 ${form.formType === 'BUG' ? 'text-red-500' : form.formType === 'IMPROVEMENT' ? 'text-green-500' : 'text-blue-500'}`} />
        <h3 className="font-semibold break-words">{form.title}</h3>
      </div>
      <div className="p-4 border-t" style={{ borderColor: theme === 'dark' ? 'rgba(255,255,255,0.1)' : '#f3f4f6' }}>
        <p className="text-sm opacity-60">Last edited {form.lastEdited || 'recently'}</p>
        <div className="flex justify-between items-center mt-3">
          <div className="flex space-x-2">
            <LucideIcon name={form.type === 'template' ? 'Sparkles' : 'User'} className="w-4 h-4 opacity-60" />
            <span className="text-xs uppercase font-medium opacity-60">{form.type || 'Custom'}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

// COMPONENT 2: Form Editor
export const PmFormEditor = () => {
  const { projectId, formId } = useParams();
  const navigate = useNavigate();
  const { theme, colors } = useTheme();
  
  const [formData, setFormData] = useState({ title: '', formType: 'FEATURE', description: '', fields: [] });
  const [sidebarFields, setSidebarFields] = useState([]);
  const descriptionEditorRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [allChangesSaved, setAllChangesSaved] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const isInitialLoad = useRef(true);
  
  
  const [enabled, setEnabled] = useState(false);
  useEffect(() => {
    const animation = requestAnimationFrame(() => setEnabled(true));
    return () => {
      cancelAnimationFrame(animation);
      setEnabled(false);
    };
  }, []);

  const debouncedSave = useRef(
    debounce(async (dataToSave) => {
      setSaving(true);
      try {
        await api.saveFormData(projectId, formId, dataToSave);
        setAllChangesSaved(true);
      } catch (e) { console.error("Save failed", e); } 
      finally { setSaving(false); }
    }, 1500)
  ).current;
  
  useEffect(() => {
    const loadAllData = async () => {
      if (!projectId || !formId) return;
      isInitialLoad.current = true;
      try {
        setLoading(true);
        const sFields = await api.fetchSidebarFields();
        setSidebarFields(sFields);
        const data = await api.fetchFormData(projectId, formId);
        setFormData(data);
        setAllChangesSaved(true);
      } catch (err) { console.error("Load failed:", err); } 
      finally { setLoading(false); setTimeout(() => { isInitialLoad.current = false; }, 100); }
    };
    loadAllData();
  }, [projectId, formId, navigate]);

  useEffect(() => {
    if (isInitialLoad.current || loading) return;
    setAllChangesSaved(false);
    debouncedSave({ ...formData, projectId, id: formId });
  }, [formData, projectId, formId, debouncedSave, loading]);

  const onEditorChange = () => {
    if (isInitialLoad.current || loading || !descriptionEditorRef.current) return;
    const newDescription = descriptionEditorRef.current.getInstance().getMarkdown();
    if (newDescription !== formData.description) {
      setFormData(f => ({ ...f, description: newDescription }));
    }
  };

  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;
    if (source.droppableId === 'sidebar-fields' && destination.droppableId === 'form-canvas') {
      const fieldToAdd = sidebarFields[source.index];
      const newField = { 
          ...fieldToAdd, 
          id: `field-${new Date().getTime()}`, 
          title: fieldToAdd.name, 
          label: fieldToAdd.name, 
          placeholder: 'Value',
          options: (fieldToAdd.type === 'checkbox' || fieldToAdd.type === 'radio') ? ["Option 1", "Option 2"] : undefined 
      };
      const newFields = Array.from(formData.fields || []);
      newFields.splice(destination.index, 0, newField);
      setFormData(f => ({ ...f, fields: newFields }));
    } else if (source.droppableId === 'form-canvas' && destination.droppableId === 'form-canvas') {
      const items = reorder(formData.fields || [], source.index, destination.index);
      setFormData(f => ({ ...f, fields: items }));
    }
  };

  const handleDeleteField = (fieldId) => {
    if (window.confirm('Delete field?')) setFormData(f => ({ ...f, fields: f.fields.filter(field => field.id !== fieldId) }));
  };

  const handleFieldUpdate = (fieldId, updatedValues) => {
    setFormData(f => ({ ...f, fields: f.fields.map(field => field.id === fieldId ? { ...field, ...updatedValues } : field) }));
  };

  const handleTypeChange = (newType) => {
      setFormData(prev => {
          const updated = { ...prev, formType: newType };
          api.saveFormData(projectId, formId, updated).catch(e => console.error(e));
          return updated;
      });
  };
  
  const handleDeleteForm = async () => {
    if (window.confirm('Delete entire form?')) {
      await api.deleteForm(projectId, formId);
      navigate(`/forms/${projectId}`);
    }
  };

  const handleSubmitForm = async () => {
      try {
          setSaving(true);
          await api.submitForm(projectId, formId, formData);
          alert("Form submitted!");
          setSaving(false);
          setAllChangesSaved(true);
      } catch (error) { alert("Failed to submit."); setSaving(false); }
  };

  const handleOpenCreateModal = () => setIsCreateModalOpen(true);
  const handleCloseCreateModal = () => setIsCreateModalOpen(false);
  const handleSaveNewField = (newFieldData) => {
    const newField = { 
        ...newFieldData, 
        id: `custom-${new Date().getTime()}`, 
        label: newFieldData.name, 
        title: newFieldData.name, 
        placeholder: 'Enter value',
        options: (newFieldData.type === 'checkbox' || newFieldData.type === 'radio') ? ["Option 1"] : undefined
    };
    setFormData(f => ({ ...f, fields: [...(f.fields || []), newField] }));
    handleCloseCreateModal();
  };

  if (loading) return <div className="flex h-screen items-center justify-center"><Check className="animate-spin w-8 h-8" /></div>;

  const getCurrentIcon = () => {
      const type = formData.formType; 
      if (type === 'BUG') return <Bug className="w-5 h-5 text-red-600" />;
      if (type === 'IMPROVEMENT') return <TrendingUp className="w-5 h-5 text-green-600" />;
      return <Sparkles className="w-5 h-5 text-purple-600" />;
  };

  if (!enabled) return null; 

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex flex-col h-screen transition-colors duration-300" style={{ backgroundColor: colors.background, color: colors.text }}>
        <header className="flex-shrink-0 flex items-center px-6 py-3 border-b z-30" style={{ borderColor: theme === 'dark' ? 'rgba(255,255,255,0.1)' : '#e5e7eb', backgroundColor: colors.background }}>
          <div className="flex items-center gap-2 flex-1">
            <Link to={`/forms/${projectId}`} className="p-1 rounded hover:bg-black/10"><ArrowLeft className="w-5 h-5" /></Link>
            <div className="text-sm opacity-60">{saving ? 'Saving...' : (allChangesSaved ? 'All changes saved' : 'Unsaved changes')}</div>
          </div>
          <div className="flex flex-1 justify-center">
            <Dropdown align="right" buttonClassName="flex items-center gap-2 px-3 py-1.5 rounded-md hover:bg-black/5 transition-colors"
              button={<>{getCurrentIcon()}<span className="font-medium text-sm">{formData.formType}</span><ChevronDown className="w-4 h-4 opacity-50" /></>}>
              <div onClick={() => handleTypeChange('FEATURE')} className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-black/5 cursor-pointer"><Sparkles className="w-4 h-4 text-purple-600" /> Feature</div>
              <div onClick={() => handleTypeChange('BUG')} className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-black/5 cursor-pointer"><Bug className="w-4 h-4 text-red-600" /> Bug</div>
              <div onClick={() => handleTypeChange('IMPROVEMENT')} className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-black/5 cursor-pointer"><TrendingUp className="w-4 h-4 text-green-600" /> Improvement</div>
            </Dropdown>
          </div>
          <div className="flex items-center gap-4 flex-1 justify-end">
            <button onClick={handleSubmitForm} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-md text-sm font-medium transition-colors"><Send className="w-4 h-4" /> Submit</button>
            <button onClick={handleDeleteForm} className="hover:text-red-600 opacity-60 hover:opacity-100"><Trash2 className="w-5 h-5" /></button>
            <button className="opacity-60 hover:opacity-100"><EllipsisVertical className="w-5 h-5" /></button>
          </div>
        </header>

        <div className="flex flex-1 overflow-hidden z-10">
          <Droppable droppableId="form-canvas">
            {(provided, snapshot) => (
              <main ref={provided.innerRef} {...provided.droppableProps} className={`flex-1 overflow-y-auto p-12 space-y-4`} style={{ backgroundColor: theme === 'dark' ? '#0f172a' : '#f9fafb' }}>
                <div className="max-w-3xl mx-auto">
                  <div className="mb-8 p-6 rounded-lg shadow-sm border" style={{ backgroundColor: theme === 'dark' ? '#1e293b' : 'white', borderColor: theme === 'dark' ? '#334155' : '#e5e7eb' }}>
                    <InlineEdit value={formData.title} onChange={(newTitle) => setFormData(f => ({ ...f, title: newTitle }))} className="text-3xl font-bold w-full p-2 -m-2 bg-transparent" />
                    <div className="mt-4"><Editor key={formId} ref={descriptionEditorRef} initialValue={formData.description} previewStyle="vertical" height="300px" initialEditType="markdown" useCommandShortcut={true} onChange={onEditorChange} theme={theme === 'dark' ? 'dark' : 'light'} /></div>
                  </div>
                
{formData.fields.map((field, index) => (
  <Draggable key={field.id} draggableId={field.id} index={index}>
    {(provided, snapshot) => (
      <div
        ref={provided.innerRef}
        {...provided.draggableProps}
        
        style={{
          ...provided.draggableProps.style,
          zIndex: snapshot.isDragging ? 9999 : 'auto',
        }}
        className="mb-4 outline-none" 
      >
    
        <div
          className={`
            bg-white p-6 rounded-lg border border-gray-200 transition-all duration-200 ease-[cubic-bezier(0.25,0.8,0.25,1)]
            ${snapshot.isDragging 
              ? 'shadow-2xl ring-2 ring-blue-500 opacity-90 scale-105 -rotate-1 cursor-grabbing' 
              : 'shadow-sm group hover:border-blue-300'
            }
          `}
        >
          <EditableFormField
            field={field}
            dragHandleProps={provided.dragHandleProps}
            onFieldUpdate={handleFieldUpdate}
            onDelete={() => handleDeleteField(field.id)}
          />
        </div>
      </div>
    )}
  </Draggable>
))}
                  {provided.placeholder}
                </div>
              </main>
            )}
          </Droppable>

          <Droppable droppableId="sidebar-fields" isDropDisabled={true}>
            {(provided) => (
              <aside ref={provided.innerRef} {...provided.droppableProps} className="w-80 flex-shrink-0 border-l overflow-y-auto p-6" style={{ backgroundColor: colors.background, borderColor: theme === 'dark' ? '#334155' : '#e5e7eb' }}>
                <div className="flex justify-between items-center mb-4"><h2 className="text-lg font-semibold">Fields</h2></div>
                <div className="space-y-2">
                  
{sidebarFields.map((field, index) => (
  <Draggable key={field.id} draggableId={field.id} index={index}>
    {(provided, snapshot) => (
      <div
        ref={provided.innerRef}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
        
        style={{
          ...provided.draggableProps.style,
          zIndex: snapshot.isDragging ? 9999 : 'auto',
        }}
        className="mb-2 outline-none"
      >
       
        <div
          className={`
            flex items-center gap-3 p-3 rounded-md border border-gray-200 bg-white transition-all duration-200 ease-[cubic-bezier(0.25,0.8,0.25,1)]
            ${snapshot.isDragging 
              ? 'shadow-xl ring-2 ring-blue-500 opacity-80 scale-105 rotate-2 cursor-grabbing' 
              : 'shadow-sm hover:border-blue-400 hover:shadow-md cursor-grab'
            }
          `}
        >
          <LucideIcon name={field.icon} className="w-5 h-5 text-gray-600" />
          <span className="text-sm font-medium text-gray-700">{field.name}</span>
        </div>
      </div>
    )}
  </Draggable>
))}
                </div>
                {provided.placeholder}
                <button onClick={handleOpenCreateModal} className="w-full bg-blue-600 text-white text-sm font-medium py-2 px-4 rounded-md hover:bg-blue-700 mt-6"><Plus className="w-4 h-4 inline-block mr-1" /> Create new field</button>
              </aside>
            )}
          </Droppable>
        </div>
      </div>
      {isCreateModalOpen && <CreateFieldModal onClose={handleCloseCreateModal} onSave={handleSaveNewField} />}
    </DragDropContext>
  );
};

// --- Helper Components ---
const InlineEdit = ({ value, onChange, className }) => {
  const [internalValue, setInternalValue] = useState(value);
  const inputRef = useRef(null);
  useEffect(() => { setInternalValue(value); }, [value]);
  const onBlur = () => { if (internalValue !== value) onChange(internalValue); };
  const onKeyDown = (e) => { if (e.key === 'Enter') inputRef.current.blur(); };
  return <input ref={inputRef} type="text" value={internalValue || ''} onChange={(e) => setInternalValue(e.target.value)} onBlur={onBlur} onKeyDown={onKeyDown} className={`p-0 m-0 border-none focus:ring-2 focus:ring-blue-500 rounded-md outline-none ${className}`} style={{ color: 'inherit', background: 'transparent' }} />;
};

// --- UPDATED: Editable Form Field with Type Switching ---
const EditableFormField = ({ field, dragHandleProps, onFieldUpdate, onDelete, projectId }) => {
  const [users, setUsers] = useState([]);
  const { theme } = useTheme();

  useEffect(() => {
      if (field.type === 'user') {
          api.fetchUsers().then(data => setUsers(data));
      }
  }, [field.type, projectId]);

  const handleUpdate = (key, newValue) => onFieldUpdate(field.id, { [key]: newValue });

  // Render input based on type
  const renderInput = () => {
      if (field.type === 'user') {
          return (
             <div className="p-3 border rounded-md" style={{ borderColor: theme === 'dark' ? '#475569' : '#e5e7eb', backgroundColor: theme === 'dark' ? '#0f172a' : '#f9fafb' }}>
                 <span className="opacity-60 mr-2">Assign to: </span>
                 <select 
                    className="bg-transparent border-none focus:ring-0 cursor-pointer outline-none w-1/2"
                    style={{ color: theme === 'dark' ? 'white' : 'inherit', backgroundColor: 'transparent' }}
                    value={field.value || ""} 
                    onChange={(e) => handleUpdate('value', e.target.value)}
                 >
                     <option value="" className="bg-white dark:bg-slate-800">Select User...</option>
                     {users && users.length > 0 ? users.map((u) => (
                         <option key={u.id} value={u.username || u.email} className="bg-white dark:bg-slate-800 text-gray-900 dark:text-white">
                             {u.username || u.email}
                         </option>
                     )) : <option disabled>No users found</option>}
                 </select>
             </div>
          );
      } else if (field.type === 'date') {
          return (
              <input 
                type="date" 
                className="w-full p-3 border rounded-md outline-none"
                style={{ backgroundColor: theme === 'dark' ? '#0f172a' : '#f9fafb', borderColor: theme === 'dark' ? '#475569' : '#e5e7eb', color: 'inherit' }}
                value={field.value || ""}
                onChange={(e) => handleUpdate('value', e.target.value)}
              />
          );
      } else if (field.type === 'checkbox' || field.type === 'radio') {
          const isRadio = field.type === 'radio';
          const options = field.options || ["Option 1", "Option 2"];

          const addOption = () => handleUpdate('options', [...options, `Option ${options.length + 1}`]);
          const removeOption = (idx) => {
              const newOpts = [...options];
              newOpts.splice(idx, 1);
              handleUpdate('options', newOpts);
          };
          const updateOptionText = (idx, text) => {
              const newOpts = [...options];
              newOpts[idx] = text;
              handleUpdate('options', newOpts);
          };

          return (
              <div className="space-y-2">
                  {options.map((opt, i) => (
                      <div key={i} className="flex items-center gap-2 group/opt">
                          <input 
                            type={isRadio ? "radio" : "checkbox"} 
                            name={isRadio ? field.id : undefined}
                            className="w-4 h-4 text-blue-600" 
                            checked={field.value === opt}
                            onChange={() => handleUpdate('value', opt)} // Saves selected string
                          />
                          <InlineEdit 
                            value={opt} 
                            onChange={(val) => updateOptionText(i, val)} 
                            className="flex-1 text-sm border-b border-transparent hover:border-gray-300 focus:border-blue-500"
                          />
                          <button onClick={() => removeOption(i)} className="opacity-0 group-hover/opt:opacity-100 text-red-500 hover:bg-red-100 p-1 rounded">
                              <X className="w-3 h-3" />
                          </button>
                      </div>
                  ))}
                  <button onClick={addOption} className="flex items-center gap-1 text-xs text-blue-500 hover:text-blue-600 mt-2">
                      <Plus className="w-3 h-3" /> Add Option
                  </button>
              </div>
          );
      } else {
          // Default text input
          return (
            <InlineEdit 
                value={field.placeholder} 
                onChange={(val) => handleUpdate('placeholder', val)} 
                className="text-base p-3 border rounded-md w-full"
                style={{ backgroundColor: theme === 'dark' ? '#0f172a' : '#f9fafb', borderColor: theme === 'dark' ? '#475569' : '#e5e7eb', color: theme === 'dark' ? '#94a3b8' : '#9ca3af' }}
            />
          );
      }
  };

  return (
    <div className="relative flex items-center gap-2">
      <div {...dragHandleProps} className="p-2 opacity-0 group-hover:opacity-100 cursor-grab hover:text-blue-500"><GripVertical className="w-5 h-5" /></div>
      <div className="flex-1">
        <div className="flex justify-between items-center mb-2">
          <InlineEdit value={field.title} onChange={(val) => handleUpdate('title', val)} className="text-sm font-medium" />
          <InlineEdit value={field.label} onChange={(val) => handleUpdate('label', val)} className="text-sm font-medium text-blue-600 text-right" />
        </div>
        {renderInput()}
      </div>
      <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100"><button onClick={onDelete} className="p-1 hover:text-red-600 rounded-full"><Trash2 className="w-4 h-4" /></button></div>
    </div>
  );
};

const CreateFieldModal = ({ onClose, onSave }) => {
  const [fieldName, setFieldName] = useState('');
  const [fieldType, setFieldType] = useState('short-text');
  const { theme, colors } = useTheme();

  const fieldTypes = [
    { id: 'short-text', name: 'Short text', icon: 'Baseline' },
    { id: 'long-text', name: 'Long text (Markdown)', icon: 'MessageSquareText' },
    { id: 'date', name: 'Date', icon: 'Calendar' },
    { id: 'user', name: 'User', icon: 'User' },
    { id: 'checkbox', name: 'Checkboxes', icon: 'ListTodo' },
    { id: 'radio', name: 'Radio buttons', icon: 'Radio' },
    { id: 'tags', name: 'Tags', icon: 'Tags' },
  ];
  const handleSave = (e) => { e.preventDefault(); if (!fieldName.trim()) return alert('Enter name'); const t = fieldTypes.find(t => t.id === fieldType); onSave({ name: fieldName, type: fieldType, icon: t.icon }); };
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="rounded-lg shadow-xl w-full max-w-md p-6" style={{ backgroundColor: colors.background, color: colors.text, border: `1px solid ${theme === 'dark' ? '#334155' : 'white'}` }}>
        <h3 className="text-lg font-medium mb-4">Create new field</h3>
        <form onSubmit={handleSave}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Field Name</label>
            <input type="text" value={fieldName} onChange={(e) => setFieldName(e.target.value)} 
                className="w-full px-3 py-2 border rounded-md shadow-sm outline-none focus:ring-2 focus:ring-blue-500" 
                style={{ backgroundColor: theme === 'dark' ? '#1e293b' : 'white', borderColor: theme === 'dark' ? '#475569' : '#d1d5db', color: colors.text }}
                autoFocus />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Field Type</label>
            <select value={fieldType} onChange={(e) => setFieldType(e.target.value)} 
                className="w-full px-3 py-2 border rounded-md shadow-sm outline-none focus:ring-2 focus:ring-blue-500"
                style={{ backgroundColor: theme === 'dark' ? '#1e293b' : 'white', borderColor: theme === 'dark' ? '#475569' : '#d1d5db', color: colors.text }}>
                {fieldTypes.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <button type="button" onClick={onClose} className="px-4 py-2 border rounded-md text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-700" style={{ borderColor: theme === 'dark' ? '#475569' : '#d1d5db' }}>Cancel</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 rounded-md text-sm font-medium text-white hover:bg-blue-700">Create Field</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const reorder = (list, startIndex, endIndex) => { const result = Array.from(list); const [removed] = result.splice(startIndex, 1); result.splice(endIndex, 0, removed); return result; };
function debounce(func, wait) { let timeout; return function executedFunction(...args) { const later = () => { clearTimeout(timeout); func(...args); }; clearTimeout(timeout); timeout = setTimeout(later, wait); }; }