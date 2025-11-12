import React, { useState, useEffect, useRef } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";


import { Editor } from '@toast-ui/react-editor';

import {
  FileText,
  Sparkles,
  Bug,
  TriangleAlert,
  Settings,
  GitPullRequestArrow,
  Share2,
  EllipsisVertical,
  Plus,
  ArrowLeft,
  ChevronDown,
  GripVertical,
  User,
  Tags,
  Users,
  Calendar,
  Baseline,
  MessageSquareText,
  Lock,
  Pencil,
  Trash2,
  Check,
  Package,
  Radio,
  ListTodo
} from 'lucide-react';


const MOCK_PROJECT_ID = 'default-project'; 


const seedLocalStorage = () => {
  
  if (!localStorage.getItem('sidebarFields')) {
    const DEFAULT_SIDEBAR_FIELDS = [
      { id: 'assignee', name: 'Assignee', icon: 'User', type: 'user' },
      { id: 'labels', name: 'Labels', icon: 'Tags', type: 'tags' },
      { id: 'parent', name: 'Parent', icon: 'Users', type: 'parent-link' },
      { id: 'start-date', name: 'Start date', icon: 'Calendar', type: 'date' },
      { id: 'team', name: 'Team', icon: 'Users', type: 'team' },
      { id: 'short-text', name: 'Short text', icon: 'Baseline', type: 'short-text' },
      { id: 'long-text', name: 'Long text', icon: 'MessageSquareText', type: 'long-text' },
      { id: 'checkbox', name: 'Checkboxes', icon: 'ListTodo', type: 'checkbox' },
      { id: 'radio', name: 'Radio', icon: 'Radio', type: 'radio' },
    ];
    localStorage.setItem('sidebarFields', JSON.stringify(DEFAULT_SIDEBAR_FIELDS));
  }


  const allForms = JSON.parse(localStorage.getItem('forms') || '[]');
  if (allForms.length === 0) {
    console.log('Seeding local storage with initial mock data...');
    localStorage.setItem('forms', JSON.stringify([
      { 
        id: 'form-123', 
        projectId: MOCK_PROJECT_ID,
        title: 'Feature request', 
        formType: 'Task',
        description: 'Use this form to request new features.',
        lastEdited: '2 minutes ago',
        type: 'template',
        fields: [
          { id: 'field-1', type: 'short-text', title: 'Feature Title', label: 'Summary *', placeholder: 'Enter the name of the feature.' },
          { id: 'field-2', type: 'long-text', title: 'Feature Overview', label: 'Description', placeholder: 'Provide an overview of the feature.' },
        ]
      },
      { 
        id: 'form-456', 
        projectId: MOCK_PROJECT_ID,
        title: 'Bug report', 
        formType: 'Bug',
        description: 'A form for reporting bugs.',
        lastEdited: '3 minutes ago',
        type: 'custom',
        fields: [
          { id: 'field-3', type: 'short-text', title: 'Bug Title', label: 'Summary *', placeholder: 'A brief summary of the bug.' },
          { id: 'field-4', type: 'long-text', title: 'Steps to Reproduce', label: 'Steps', placeholder: '1. ...\n2. ...\n3. ...' },
        ]
      },
    ]));
  }
};

seedLocalStorage();


const api = {
  fetchRecentForms: async (projectId) => {
    console.log(`API (LS): Fetching recent forms for project ${projectId}...`);
    const allForms = JSON.parse(localStorage.getItem('forms') || '[]');
    const projectForms = allForms.filter(f => f.projectId === projectId || f.projectId === MOCK_PROJECT_ID);
    return projectForms;
  },

  fetchFormData: async (projectId, formId) => {
    console.log(`API (LS): Fetching form ${formId} for project ${projectId}...`);
    const allForms = JSON.parse(localStorage.getItem('forms') || '[]');
    const form = allForms.find(f => f.id === formId && (f.projectId === projectId || f.projectId === MOCK_PROJECT_ID));
    if (form) return form;
    throw new Error("Form not found");
  },
  
  createForm: async (projectId, templateId) => {
    console.log(`API (LS): Creating new form from template ${templateId} for project ${projectId}...`);
    const allForms = JSON.parse(localStorage.getItem('forms') || '[]');
    
    let newForm = {
      id: `form-${new Date().getTime()}`,
      projectId: projectId || MOCK_PROJECT_ID,
      formType: 'Task', // Default
      title: 'New Form',
      description: `# New Form\n\nStart writing your description here...`,
      fields: [
        { id: `field-${new Date().getTime()}`, type: 'short-text', title: 'Summary', label: 'Summary *', placeholder: 'Add a description' },
      ],
      lastEdited: 'Just now',
      type: 'custom',
    };

   
    switch(templateId) {
      case 'bug':
        newForm.formType = 'Bug';
        newForm.title = 'Bug report';
        newForm.description = 'Use this form to report a bug.';
        newForm.fields = [
          { id: `field-${new Date().getTime()}-1`, type: 'short-text', title: 'Bug Title', label: 'Summary *', placeholder: 'A brief summary of the bug.' },
          { id: `field-${new Date().getTime()}-2`, type: 'long-text', title: 'Steps to Reproduce', label: 'Steps', placeholder: '1. ...\n2. ...\n3. ...' },
        ];
        break;
      case 'feature':
        newForm.formType = 'Task';
        newForm.title = 'Feature request';
        newForm.description = 'Use this form to request a new feature.';
        newForm.fields = [
          { id: `field-${new Date().getTime()}-1`, type: 'short-text', title: 'Feature Title', label: 'Summary *', placeholder: 'Enter the name of the feature.' },
          { id: `field-${new Date().getTime()}-2`, type: 'long-text', title: 'Feature Overview', label: 'Description', placeholder: 'Provide an overview of the feature, including purpose, benefits, and impact.' },
        ];
        break;
    
      case 'blank':
      default:
        
        break;
    }
    
    allForms.push(newForm);
    localStorage.setItem('forms', JSON.stringify(allForms));
    return newForm;
  },

  saveFormData: async (projectId, formId, formData) => {
    console.log(`API (LS): Saving form ${formId} for project ${projectId}...`);
    const allForms = JSON.parse(localStorage.getItem('forms') || '[]');
    const formIndex = allForms.findIndex(f => f.id === formId);
    
    const updatedForm = { ...formData, id: formId, projectId: projectId || MOCK_PROJECT_ID, lastEdited: 'Just now' };

    if (formIndex !== -1) allForms[formIndex] = updatedForm;
    else allForms.push(updatedForm);
    
    localStorage.setItem('forms', JSON.stringify(allForms));
    await new Promise(resolve => setTimeout(resolve, 300));
    console.log('API (LS): Save complete.');
    return { ...updatedForm, allChangesSaved: true };
  },

  deleteForm: async (formId) => {
    console.log(`API (LS): Deleting form ${formId}...`);
    let allForms = JSON.parse(localStorage.getItem('forms') || '[]');
    allForms = allForms.filter(f => f.id !== formId);
    localStorage.setItem('forms', JSON.stringify(allForms));
  },
  
  fetchSidebarFields: async () => {
    console.log("API (LS): Fetching sidebar fields...");
    return JSON.parse(localStorage.getItem('sidebarFields') || '[]');
  },
  
  saveSidebarField: async (newField) => {
    console.log("API (LS): Saving new sidebar field...");
    const fields = await api.fetchSidebarFields();
    const updatedFields = [...fields, newField];
    localStorage.setItem('sidebarFields', JSON.stringify(updatedFields));
    return updatedFields;
  }
};

// --- Icon Mapper ---
const LucideIcon = ({ name, ...props }) => {
  const IconComponent = {
    FileText, Sparkles, Bug, TriangleAlert, Settings, GitPullRequestArrow,
    Share2, EllipsisVertical, Plus, ArrowLeft, ChevronDown, GripVertical,
    User, Tags, Users, Calendar, Baseline, MessageSquareText, Lock,
    Pencil, Trash2, Check, Package, Radio, ListTodo
  }[name];
  return IconComponent ? <IconComponent {...props} /> : <Package {...props} />;
};

// --- Helper: Dropdown Component ---
const Dropdown = ({ button, children, align = 'right', buttonClassName, contentClassName }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
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
   
        <div onClick={() => setIsOpen(false)} className={`absolute mt-2 z-50 bg-white border border-gray-200 rounded-lg shadow-lg py-1 w-56 overflow-hidden ${align === 'right' ? 'right-0' : 'left-0'} ${contentClassName || ''}`}>
          {children}
        </div>
      )}
    </div>
  );
};



// COMPONENT 1: Form Dashboard

export const FormDashboard = () => {
  const [recentForms, setRecentForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTemplate, setActiveTemplate] = useState('blank');
  
  const { projectId } = useParams();
  const navigate = useNavigate();

  const loadForms = async () => {
    try {
      setLoading(true);
      const forms = await api.fetchRecentForms(projectId || MOCK_PROJECT_ID);
      setRecentForms(forms);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadForms();
  }, [projectId]);
  
  const handleSelectTemplate = (templateId) => {
    setActiveTemplate(templateId);
    handleCreateNewForm(templateId); // Pass the templateId
  };
  
  const handleCreateNewForm = async (templateId = 'blank') => {
    console.log(`Creating new form from template ${templateId}...`);
    try {
      setLoading(true);
      const newForm = await api.createForm(projectId, templateId);
      navigate(`/forms/${newForm.projectId}/${newForm.id}`);
    } catch (err) {
      console.error("Failed to create form:", err);
      setError("Failed to create a new form.");
      setLoading(false);
    }
  };

  const handleDeleteForm = async (e, formId) => {
    e.stopPropagation(); 
    e.preventDefault(); 
    if (window.confirm('Are you sure you want to delete this form?')) {
      try {
        await api.deleteForm(formId);
        await loadForms(); 
      } catch (err) {
        setError('Failed to delete form.');
      }
    }
  };

  const templates = [
    { id: 'blank', title: 'Blank form', icon: 'FileText' },
    { id: 'feature', title: 'Feature request', icon: 'Sparkles' },
    { id: 'bug', title: 'Bug report', icon: 'Bug' },
    { id: 'incident', title: 'Incident report', icon: 'TriangleAlert' },
    { id: 'tech-review', title: 'Technical review', icon: 'Settings' },
    { id: 'change', title: 'Change request', icon: 'GitPullRequestArrow' },
  ];

  return (
    <div className="min-h-screen bg-white text-gray-900 p-8">
      <header className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold text-gray-800">Create a new form</h1>
        <button className="text-sm font-medium text-blue-600 hover:text-blue-800">
          Hide templates
        </button>
      </header>

      {/* Templates Section */}
      <div className="flex flex-wrap gap-3 mb-12">
        {templates.map((template) => (
          <button
            key={template.id}
            onClick={() => handleSelectTemplate(template.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border
              ${activeTemplate === template.id
                ? 'bg-blue-100 border-blue-500 text-blue-700'
                : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-100'
              }
            `}
          >
            <LucideIcon name={template.icon} className="w-4 h-4" />
            <span className="text-sm font-medium">{template.title}</span>
          </button>
        ))}
      </div>

      {/* Recent Forms Section */}
      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent forms</h2>
        {loading && <p>Loading recent forms...</p>}
        {error && <p className="text-red-500">{error}</p>}
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {recentForms.map((form) => (
            <FormCard key={form.id} form={form} onDelete={handleDeleteForm} />
          ))}
          
          {/* Create New Form Card */}
          <Dropdown
            align="left"
            buttonClassName="w-full h-full"
            contentClassName="w-48"
            button={
              <div className="flex flex-col items-center justify-center p-4 h-full border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-blue-500 hover:text-blue-600 hover:bg-gray-50 transition-all duration-200 aspect-square">
                <Plus className="w-16 h-16" />
                <span className="mt-2 font-medium">Create form</span>
              </div>
            }
          >
            <div className="p-2 text-sm font-medium text-gray-500">Create new...</div>
            <div onClick={() => handleCreateNewForm('Task')} className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"><FileText className="w-4 h-4 text-blue-600" /> Task</div>
            <div onClick={() => handleCreateNewForm('Story')} className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"><FileText className="w-4 h-4 text-green-600" /> Story</div>
            <div onClick={() => handleCreateNewForm('Epic')} className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"><FileText className="w-4 h-4 text-purple-600" /> Epic</div>
            <div onClick={() => handleCreateNewForm('bug')} className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"><Bug className="w-4 h-4 text-red-600" /> Bug</div>
          </Dropdown>
        </div>
      </div>
    </div>
  );
};


const FormCard = ({ form, onDelete }) => {
  const getBorderColor = () => {
    switch (form.formType) {
      case 'Task': return 'border-blue-500';
      case 'Bug': return 'border-red-500';
      case 'Story': return 'border-green-500';
      case 'Epic': return 'border-purple-500';
      default: return 'border-gray-400';
    }
  };

  return (
    <Link 
      to={`/forms/${form.projectId}/${form.id}`} 
      className={`group relative flex flex-col justify-between bg-gradient-to-br from-white to-gray-50 rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-200 border-t-4 ${getBorderColor()} aspect-square`}
    >
      
      <button 
        onClick={(e) => onDelete(e, form.id)}
        className="absolute top-2 right-2 p-1.5 rounded-full text-gray-400 bg-white/50 opacity-0 group-hover:opacity-100 hover:bg-red-100 hover:text-red-600 transition-all z-10"
        title="Delete form"
      >
        <Trash2 className="w-4 h-4" />
      </button>

   
      <div className="p-5 flex flex-col">
        <LucideIcon 
          name={form.formType === 'Bug' ? 'Bug' : 'FileText'} 
          className={`w-8 h-8 mb-4 ${
            form.formType === 'Bug' ? 'text-red-500' :
            form.formType === 'Task' ? 'text-blue-500' :
            form.formType === 'Story' ? 'text-green-500' :
            'text-purple-500'
          }`} 
        />
        <h3 className="font-semibold text-gray-800 break-words">{form.title}</h3>
      </div>

    
      <div className="p-4 bg-white/50 border-t border-gray-100">
        <p className="text-sm text-gray-500">Last edited {form.lastEdited}</p>
        <div className="flex justify-between items-center mt-3">
          <div className="flex space-x-2">
            <LucideIcon name={form.type === 'template' ? 'Sparkles' : 'User'} className="w-4 h-4 text-gray-400" />
            <span className="text-xs text-gray-400 uppercase font-medium">{form.type}</span>
          </div>
          <button className="text-gray-400 hover:text-gray-800 opacity-0 group-hover:opacity-100 transition-opacity">
            <EllipsisVertical className="w-5 h-5" />
          </button>
        </div>
      </div>
    </Link>
  );
};


// COMPONENT 2: Form Editor

export const FormEditor = () => {
  const { projectId, formId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ title: '', formType: 'Task', description: '', fields: [] });
  const [sidebarFields, setSidebarFields] = useState([]);
  const descriptionEditorRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [allChangesSaved, setAllChangesSaved] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const isInitialLoad = useRef(true);

  const debouncedSave = useRef(
    debounce(async (dataToSave) => {
      setSaving(true);
      await api.saveFormData(dataToSave.projectId, dataToSave.id, dataToSave);
      setSaving(false);
      setAllChangesSaved(true);
    }, 1500)
  ).current;
  
  useEffect(() => {
    const loadAllData = async () => {
      isInitialLoad.current = true;
      try {
        setLoading(true);
        const sFields = await api.fetchSidebarFields();
        setSidebarFields(sFields);
        const data = await api.fetchFormData(projectId, formId);
        setFormData(data);
        setAllChangesSaved(true);
      } catch (err) {
        console.error("Failed to load form:", err);
        navigate(`/forms/${projectId || MOCK_PROJECT_ID}`);
      } finally {
        setLoading(false);
        setTimeout(() => { isInitialLoad.current = false; }, 100);
      }
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
        placeholder: 'Answer will be written here',
      };
      const newFields = Array.from(formData.fields);
      newFields.splice(destination.index, 0, newField);
      setFormData(f => ({ ...f, fields: newFields }));
    } else if (source.droppableId === 'form-canvas' && destination.droppableId === 'form-canvas') {
      const items = reorder(formData.fields, source.index, destination.index);
      setFormData(f => ({ ...f, fields: items }));
    }
  };

  const handleDeleteField = (fieldId) => {
    if (window.confirm('Are you sure you want to delete this field?')) {
      setFormData(f => ({ ...f, fields: f.fields.filter(field => field.id !== fieldId) }));
    }
  };

  const handleFieldUpdate = (fieldId, updatedValues) => {
    setFormData(f => ({
      ...f,
      fields: f.fields.map(field => 
        field.id === fieldId ? { ...field, ...updatedValues } : field
      )
    }));
  };

  const handleTypeChange = (newType) => setFormData(f => ({ ...f, formType: newType }));
  const handleDeleteForm = async () => {
    if (window.confirm('Are you sure you want to delete this entire form?')) {
      await api.deleteForm(formId);
      navigate(`/forms/${projectId || MOCK_PROJECT_ID}`);
    }
  };

  const handleOpenCreateModal = () => setIsCreateModalOpen(true);
  const handleCloseCreateModal = () => setIsCreateModalOpen(false);
  const handleSaveNewField = async (newFieldData) => {
    const newField = { ...newFieldData, id: `custom-${new Date().getTime()}` };
    const updatedFields = await api.saveSidebarField(newField);
    setSidebarFields(updatedFields);
    handleCloseCreateModal();
  };

  if (loading) {
    return <div className="flex h-screen items-center justify-center"><Check className="animate-spin w-8 h-8" /></div>;
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex flex-col h-screen bg-white text-gray-900">
        
        
        <header className="flex-shrink-0 flex items-center px-6 py-3 border-b border-gray-200 bg-white z-30">
  
  
  <div className="flex items-center gap-2 flex-1">
    <Link to={`/forms/${projectId || MOCK_PROJECT_ID}`} className="p-1 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded">
      <ArrowLeft className="w-5 h-5" />
    </Link>
    
    <div className="text-sm text-gray-500">
      {saving ? 'Saving...' : (allChangesSaved ? 'All changes saved' : 'Unsaved changes')}
    </div>
  </div>

 
  <div className="flex flex-1 justify-center">
    <Dropdown
      align="right" 
      buttonClassName="flex items-center gap-2 px-3 py-1.5 rounded-md hover:bg-gray-100"
      button={<><FileText className="w-5 h-5 text-blue-600" /><span className="font-medium text-sm">{formData.formType}</span><ChevronDown className="w-4 h-4 text-gray-500" /></>}
    >
      <div onClick={() => handleTypeChange('Task')} className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"><FileText className="w-4 h-4 text-blue-600" /> Task</div>
      <div onClick={() => handleTypeChange('Story')} className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"><FileText className="w-4 h-4 text-green-600" /> Story</div>
      <div onClick={() => handleTypeChange('Epic')} className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"><FileText className="w-4 h-4 text-purple-600" /> Epic</div>
      <div onClick={() => handleTypeChange('Bug')} className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"><Bug className="w-4 h-4 text-red-600" /> Bug</div>
    </Dropdown>
  </div>

  
  <div className="flex items-center gap-4 flex-1 justify-end">
    <button onClick={handleDeleteForm} className="text-gray-600 hover:text-red-600" title="Delete Form"><Trash2 className="w-5 h-5" /></button>
    <button className="text-gray-600 hover:text-gray-900" title="Lock"><Lock className="w-5 h-5" /></button>
    <button className="text-gray-600 hover:text-gray-900" title="Share"><Share2 className="w-5 h-5" /></button>
    <button className="text-gray-600 hover:text-gray-900" title="More options"><EllipsisVertical className="w-5 h-5" /></button>
  </div>
</header>

       
        <div className="flex flex-1 overflow-hidden z-10">
          
      
          <Droppable droppableId="form-canvas">
            {(provided, snapshot) => (
              <main ref={provided.innerRef} {...provided.droppableProps} className={`flex-1 overflow-y-auto p-12 space-y-4 bg-gray-50 ${snapshot.isDraggingOver ? 'bg-blue-50' : ''}`}>
                <div className="max-w-3xl mx-auto">
                  
                
                  <div className="mb-8 p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
                    <InlineEdit
                      value={formData.title}
                      onChange={(newTitle) => setFormData(f => ({ ...f, title: newTitle }))}
                      className="text-3xl font-bold text-gray-800 w-full p-2 -m-2"
                    />
                    <div className="mt-4">
                      <Editor
                        key={formId}
                        ref={descriptionEditorRef}
                        initialValue={formData.description}
                        previewStyle="vertical"
                        height="300px"
                        initialEditType="markdown"
                        useCommandShortcut={true}
                        onChange={onEditorChange}
                      />
                    </div>
                  </div>
                
                  
                  {formData.fields.map((field, index) => (
                    <Draggable key={field.id} draggableId={field.id} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className={`bg-white p-6 rounded-lg border border-gray-200 shadow-sm mb-4 group ${snapshot.isDragging ? 'shadow-lg ring-2 ring-blue-500' : ''}`}
                        >
                          <EditableFormField
                            field={field}
                            dragHandleProps={provided.dragHandleProps}
                            onFieldUpdate={handleFieldUpdate}
                            onDelete={() => handleDeleteField(field.id)}
                          />
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
              <aside ref={provided.innerRef} {...provided.droppableProps} className="w-80 flex-shrink-0 bg-white border-l border-gray-200 overflow-y-auto p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-gray-800">Fields</h2>
                  <a href="#" className="text-sm text-blue-600">Manage your fields</a>
                </div>
                <div className="space-y-2">
                  {sidebarFields.map((field, index) => (
                    <Draggable key={field.id} draggableId={field.id} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`flex items-center gap-3 p-3 rounded-md border border-gray-200 bg-gray-50 shadow-sm ${snapshot.isDragging ? 'shadow-lg ring-2 ring-blue-500' : ''}`}
                        >
                          <LucideIcon name={field.icon} className="w-5 h-5 text-gray-600" />
                          <span className="text-sm font-medium text-gray-700">{field.name}</span>
                        </div>
                      )}
                    </Draggable>
                  ))}
                </div>
                {provided.placeholder}
                <button onClick={handleOpenCreateModal} className="w-full bg-blue-600 text-white text-sm font-medium py-2 px-4 rounded-md hover:bg-blue-700 mt-6">
                  <Plus className="w-4 h-4 inline-block mr-1" /> Create new field
                </button>
                <div className="mt-8 space-y-2">
                  <Accordion title="Common fields" />
                  <Accordion title="Advanced fields" />
                  <Accordion title="Custom fields" />
                </div>
                <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-md">
                  <h4 className="font-semibold text-blue-800">Pro Tip</h4>
                  <p className="text-sm text-blue-700 mt-1">
                    Drag and drop fields to reorder them in your form. Click any field text to edit it.
                  </p>
                </div>
              </aside>
            )}
          </Droppable>
        </div>
      </div>
      
      {/* Create New Field Modal */}
      {isCreateModalOpen && (
        <CreateFieldModal
          onClose={handleCloseCreateModal}
          onSave={handleSaveNewField}
        />
      )}
    </DragDropContext>
  );
};


// --- Helper Components ---

// --- Inline Editable Input ---
const InlineEdit = ({ value, onChange, className }) => {
  const [internalValue, setInternalValue] = useState(value);
  const inputRef = useRef(null);

  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  const onBlur = () => {
    if (internalValue !== value) {
      onChange(internalValue);
    }
  };

  const onKeyDown = (e) => {
    if (e.key === 'Enter') {
      inputRef.current.blur();
    }
  };

  return (
    <input
      ref={inputRef}
      type="text"
      value={internalValue}
      onChange={(e) => setInternalValue(e.target.value)}
      onBlur={onBlur}
      onKeyDown={onKeyDown}
      className={`p-0 m-0 border-none focus:ring-2 focus:ring-blue-500 rounded-md ${className}`}
    />
  );
};

// --- In-Place Editable Form Field ---
const EditableFormField = ({ field, dragHandleProps, onFieldUpdate, onDelete }) => {
  
  const handleUpdate = (key, newValue) => {
    onFieldUpdate(field.id, { [key]: newValue });
  };

  return (
  
    <div className="relative flex items-center gap-2">
    
      <div {...dragHandleProps} className="p-2 opacity-0 group-hover:opacity-100 cursor-grab text-gray-400 hover:text-gray-700">
        <GripVertical className="w-5 h-5" />
      </div>

     
      <div className="flex-1">
        <div className="flex justify-between items-center mb-2">
       
          <InlineEdit
            value={field.title}
            onChange={(val) => handleUpdate('title', val)}
            className="text-sm font-medium text-gray-700"
          />
      
          <InlineEdit
            value={field.label}
            onChange={(val) => handleUpdate('label', val)}
            className="text-sm font-medium text-blue-600 text-right"
          />
        </div>
        
        <InlineEdit
          value={field.placeholder}
          onChange={(val) => handleUpdate('placeholder', val)}
          className="text-gray-400 text-base p-3 border border-gray-200 rounded-md bg-gray-50 min-h-[44px] w-full"
        />
      </div>
      
      {/* Delete Button */}
      <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100">
        <button onClick={onDelete} className="p-1 text-gray-500 hover:text-red-600 bg-white rounded-full shadow">
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};


//  Create New Field Modal Component 
const CreateFieldModal = ({ onClose, onSave }) => {
  const [fieldName, setFieldName] = useState('');
  const [fieldType, setFieldType] = useState('short-text');

  const fieldTypes = [
    { id: 'short-text', name: 'Short text', icon: 'Baseline' },
    { id: 'long-text', name: 'Long text (Markdown)', icon: 'MessageSquareText' },
    { id: 'date', name: 'Date', icon: 'Calendar' },
    { id: 'user', name: 'User', icon: 'User' },
    { id: 'checkbox', name: 'Checkboxes', icon: 'ListTodo' },
    { id: 'radio', name: 'Radio buttons', icon: 'Radio' },
    { id: 'tags', name: 'Tags', icon: 'Tags' },
  ];

  const handleSave = (e) => {
    e.preventDefault();
    if (!fieldName.trim()) return alert('Please enter a field name.');
    const selectedType = fieldTypes.find(t => t.id === fieldType);
    onSave({ name: fieldName, type: fieldType, icon: selectedType.icon });
  };

  return (
    // --- FIX: Light blurred backdrop ---
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-100 bg-opacity-75 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
        <h3 className="text-lg font-medium mb-4">Create new field</h3>
        <form onSubmit={handleSave}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Field Name</label>
            <input type="text" value={fieldName} onChange={(e) => setFieldName(e.target.value)} placeholder="e.g., 'Due Date'"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" autoFocus />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Field Type</label>
            <select value={fieldType} onChange={(e) => setFieldType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white">
              {fieldTypes.map(type => <option key={type.id} value={type.id}>{type.name}</option>)}
            </select>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700">Create Field</button>
          </div>
        </form>
      </div>
    </div>
  );
};


// Simple Accordion for the sidebar
const Accordion = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div>
      <button onClick={() => setIsOpen(!isOpen)} className="flex justify-between items-center w-full py-2 text-sm font-medium text-gray-700">
        <span>{title}</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && <div className="pl-4">{children || <p className="text-sm text-gray-500 py-2">(No fields)</p>}</div>}
    </div>
  );
};


const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};


function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}