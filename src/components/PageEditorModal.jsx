import React, { useState, useEffect, useRef } from 'react';
import '@toast-ui/editor/dist/toastui-editor.css';
import { Editor } from '@toast-ui/react-editor';

const PageEditorModal = ({ show, onHide, pageId, onSave }) => {
  const editorRef = useRef();
  const [page, setPage] = useState({
    id: '',
    title: 'Untitled',
    content: '',
    updatedAt: new Date().toISOString()
  });
  const [isSaving, setIsSaving] = useState(false);

  // Load page data when modal opens or pageId changes
  useEffect(() => {
    if (show && pageId) {
      const loadPage = () => {
        const savedPages = JSON.parse(localStorage.getItem('pages') || '[]');
        const existingPage = savedPages.find(p => p.id === pageId);
        
        if (existingPage) {
          setPage(existingPage);
        } else {
          // If this is a new page, create it
          const newPage = {
            id: pageId,
            title: 'Untitled',
            content: '#Enter Title here\n\nStart writing here...',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          setPage(newPage);
          
          // Save the new page to the pages list
          const updatedPages = [...savedPages, newPage];
          localStorage.setItem('pages', JSON.stringify(updatedPages));
        }
      };

      loadPage();
    }
  }, [show, pageId]);

  // Update editor content when page changes
  useEffect(() => {
    if (editorRef.current && page.content) {
      const editorInstance = editorRef.current.getInstance();
      editorInstance.setMarkdown(page.content);
    }
  }, [page.id, page.content]);

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this page? This action cannot be undone.')) {
      const savedPages = JSON.parse(localStorage.getItem('pages') || '[]');
      const updatedPages = savedPages.filter(p => p.id !== pageId);
      localStorage.setItem('pages', JSON.stringify(updatedPages));
      
      // Call onSave to refresh the parent component
      if (onSave) {
        onSave();
      }
      
      // Close the modal
      onHide();
    }
  };

  const handleSave = async () => {
    if (!editorRef.current) return;
    
    setIsSaving(true);
    
    try {
      const content = editorRef.current.getInstance().getMarkdown();
      const title = content.split('\n')[0]?.replace(/^#\s*/, '') || 'Untitled';
      
      const updatedPage = {
        ...page,
        title,
        content,
        updatedAt: new Date().toISOString()
      };
      
      // Update the page in localStorage
      const savedPages = JSON.parse(localStorage.getItem('pages') || '[]');
      const pageIndex = savedPages.findIndex(p => p.id === page.id);
      
      if (pageIndex !== -1) {
        savedPages[pageIndex] = updatedPage;
      } else {
        savedPages.push(updatedPage);
      }
      
      localStorage.setItem('pages', JSON.stringify(savedPages));
      
      setPage(updatedPage);
      
      // Call onSave callback to refresh parent component
      if (onSave) {
        onSave();
      }
      
      // Close the modal
      onHide();
    } catch (error) {
      console.error('Error saving page:', error);
      alert('Failed to save the page. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-7xl h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">{page.title}</h2>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleDelete}
              className="p-2 text-red-500 hover:bg-red-50 rounded-full"
              title="Delete page"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
            <button
              onClick={onHide}
              className="px-4 py-2 text-gray-700 font-semibold rounded-lg hover:bg-gray-100 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-5 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
        
        {/* Body - Editor */}
        <div className="flex-1 overflow-hidden p-6">
          <div className="border rounded-lg overflow-hidden" style={{ height: 'calc(85vh - 120px)' }}>
            <Editor
              key={pageId}
              ref={editorRef}
              initialValue={page.content || '# Untitled\n\nStart writing here...'}
              previewStyle="vertical"
              height="100%"
              initialEditType="markdown"
              useCommandShortcut={true}
              autofocus={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageEditorModal;
