import React, { useState, useEffect, useRef } from 'react';
import '@toast-ui/editor/dist/toastui-editor.css';
import { Editor } from '@toast-ui/react-editor';
import { X, Save, Loader2, History, RotateCcw, Paperclip, Trash2, AlertTriangle } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const PageEditorModal = ({ show, onHide, pageId, projectId, initialPageData, onSaveContent, onDelete }) => {
  const editorRef = useRef();
  const fileInputRef = useRef();
  
  const [title, setTitle] = useState('Untitled');
  const [isSaving, setIsSaving] = useState(false);
  const [versions, setVersions] = useState([]);
  const [selectedVersion, setSelectedVersion] = useState(null);
  const [isRestoring, setIsRestoring] = useState(false);
  const [isDeletingVersion, setIsDeletingVersion] = useState(false); 
  const [isUploading, setIsUploading] = useState(false);
  
  const [originalContent, setOriginalContent] = useState('');


  useEffect(() => {
    if (show && initialPageData) {
      setTitle(initialPageData.title || 'Untitled');
      
      const content = initialPageData.latest?.content_markdown || initialPageData.latest?.content || '';
      setOriginalContent(content);
      
      if (editorRef.current) {
        editorRef.current.getInstance().setMarkdown(content);
      }
      setSelectedVersion(initialPageData.latest?.version);
    }
  }, [show, initialPageData]);

  const fetchVersions = async () => {
    if (!show || !pageId || !projectId) return;
    try {
      const authToken = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE_URL}/projects/${projectId}/pages/${pageId}/versions/`, {
          headers: { 'Authorization': `Bearer ${authToken}` }
      });
      if (response.ok) {
          const data = await response.json();
          setVersions(data);
      }
    } catch (error) {
      console.error("Failed to fetch versions", error);
    }
  };

  useEffect(() => {
    fetchVersions();
  }, [show, pageId, projectId]);


  const handleVersionChange = (e) => {
    const versionNum = parseInt(e.target.value);
    setSelectedVersion(versionNum);
    
    const versionData = versions.find(v => v.version === versionNum);
    if (versionData && editorRef.current) {
        const verContent = versionData.content_markdown || versionData.content || '';
        editorRef.current.getInstance().setMarkdown(verContent);
    }
  };

  const handleRestore = async () => {
    if (!selectedVersion) return;
    setIsRestoring(true);
    try {
        const authToken = localStorage.getItem('authToken');
        const response = await fetch(`${API_BASE_URL}/projects/${projectId}/pages/${pageId}/restore/`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ version: selectedVersion })
        });

        if (response.ok) {
            alert(`Restored to version ${selectedVersion}`);
            onHide(); 
        } else {
            alert("Failed to restore version");
        }
    } catch (error) {
        console.error(error);
        alert("Error restoring version");
    } finally {
        setIsRestoring(false);
    }
  };


  const handleDeleteVersion = async () => {
    if (!selectedVersion) return;
    if (!window.confirm(`Are you sure you want to delete Version ${selectedVersion}?`)) return;

    setIsDeletingVersion(true);
    try {
        const authToken = localStorage.getItem('authToken');
        const response = await fetch(`${API_BASE_URL}/projects/${projectId}/pages/${pageId}/delete-version/`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ version: selectedVersion })
        });

        if (response.ok) {
            alert(`Version ${selectedVersion} deleted.`);
            // Refresh versions list
            await fetchVersions();
            // Reset to latest content
            const latestVer = initialPageData.latest?.version;
            setSelectedVersion(latestVer);
            if (editorRef.current) {
                editorRef.current.getInstance().setMarkdown(originalContent);
            }
        } else {
            const errText = await response.text();
            console.error(errText);
            alert("Failed to delete version.");
        }
    } catch (error) {
        console.error(error);
        alert("Error deleting version");
    } finally {
        setIsDeletingVersion(false);
    }
  };


  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file); 

    try {
        const authToken = localStorage.getItem('authToken');
        const response = await fetch(`${API_BASE_URL}/pages/${pageId}/attachments/`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${authToken}` },
            body: formData
        });

        if (response.ok) {
            alert("File attached successfully!");
        } else {
            alert("Failed to upload attachment");
        }
    } catch (error) {
        console.error(error);
        alert("Error uploading file");
    } finally {
        setIsUploading(false);
        if (fileInputRef.current) fileInputRef.current.value = ""; 
    }
  };


  const handleSave = async () => {
    if (!editorRef.current) return;
    
    const currentContent = editorRef.current.getInstance().getMarkdown();
    const isLatest = versions.length > 0 && selectedVersion === versions[0]?.version;
    const normalizedCurrent = currentContent.trim();
    const normalizedOriginal = originalContent.trim();

    if (isLatest && normalizedCurrent === normalizedOriginal) {
        onHide();
        return; 
    }

    setIsSaving(true);
    try {
      const success = await onSaveContent(pageId, currentContent);
      if (success) onHide();
    } catch (error) {
      console.error('Error saving page:', error);
      alert('Failed to save content.');
    } finally {
      setIsSaving(false);
    }
  };

  if (!show) return null;

  const isOldVersion = versions.length > 0 && selectedVersion !== versions[0]?.version;
  const initialContent = initialPageData?.latest?.content_markdown || initialPageData?.latest?.content || '';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-7xl h-[85vh] flex flex-col overflow-hidden border border-gray-200 dark:border-gray-700">
        
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
          <div className="flex flex-col gap-1">
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">{title}</h2>
            
            
            {versions.length > 0 && (
                <div className="flex items-center gap-2 text-xs text-gray-500">
                    <History className="w-3 h-3" />
                    <select 
                        value={selectedVersion || ''} 
                        onChange={handleVersionChange}
                        className="bg-transparent border-none outline-none cursor-pointer font-medium hover:text-blue-600 p-0"
                    >
                        {versions.map(v => (
                            <option key={v.id} value={v.version}>
                                v{v.version} - {new Date(v.created_at).toLocaleString()}
                            </option>
                        ))}
                    </select>
                </div>
            )}
          </div>
          
          <div className="flex gap-3 items-center">
            {/* Attachment Button */}
            <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                onChange={handleFileUpload}
            />
            <button 
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                title="Attach File"
                className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50"
            >
                {isUploading ? <Loader2 className="w-5 h-5 animate-spin"/> : <Paperclip className="w-5 h-5" />}
            </button>

         
             <button
              onClick={() => onDelete(pageId)}
              className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
              title="Delete Entire Page"
            >
              <Trash2 className="w-5 h-5" />
            </button>

            <div className="h-6 w-px bg-gray-300 dark:bg-gray-700 mx-2"></div>

            <button
              onClick={onHide}
              className="px-4 py-2 text-gray-600 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>

          
            {isOldVersion ? (
                <div className="flex gap-2">
                     {/* Delete Specific Version */}
                     <button
                        onClick={handleDeleteVersion}
                        disabled={isDeletingVersion}
                        className="p-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg transition-colors border border-red-200 dark:border-red-900/30"
                        title={`Delete Version ${selectedVersion}`}
                    >
                        {isDeletingVersion ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                    </button>

                     <button
                        onClick={handleRestore}
                        disabled={isRestoring}
                        className="flex items-center gap-2 px-4 py-2 bg-orange-100 text-orange-700 hover:bg-orange-200 font-medium rounded-lg transition-all"
                    >
                        {isRestoring ? <Loader2 className="w-4 h-4 animate-spin" /> : <RotateCcw className="w-4 h-4" />}
                        Restore v{selectedVersion}
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-lg"
                    >
                         <Save className="w-4 h-4" /> Save as New
                    </button>
                </div>
            ) : (
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-lg shadow-blue-500/30 transition-all disabled:opacity-50"
                >
                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Save Changes
                </button>
            )}
          </div>
        </div>
        
        {/* Editor */}
        <div className="flex-1 overflow-hidden p-0 bg-white dark:bg-gray-900">
          <Editor
            key={`${pageId}-${show ? 'open' : 'closed'}`} 
            ref={editorRef}
            initialValue={initialContent}
            previewStyle="vertical"
            height="100%"
            initialEditType="wysiwyg" 
            useCommandShortcut={true}
            autofocus={true}
            hideModeSwitch={true} 
            toolbarItems={[
              ['heading', 'bold', 'italic', 'strike'],
              ['hr', 'quote'],
              ['ul', 'ol', 'task', 'indent', 'outdent'],
              ['table', 'image', 'link'],
              ['code', 'codeblock']
            ]}
          />
        </div>
      </div>
    </div>
  );
};

export default PageEditorModal;