import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '@toast-ui/editor/dist/toastui-editor.css';
import { Editor } from '@toast-ui/react-editor';
import { useTheme } from '../context/ThemeContext';

const Dummypage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const editorRef = useRef();
  const [page, setPage] = useState({
    id: '',
    title: 'Untitled',
    content: '',
    updatedAt: new Date().toISOString()
  });
  const [isSaving, setIsSaving] = useState(false);
  const { theme, colors } = useTheme();

  // Load page data when component mounts or id changes
  useEffect(() => {
    const loadPage = () => {
      const savedPages = JSON.parse(localStorage.getItem('pages') || '[]');
      const existingPage = savedPages.find(p => p.id === id);
      
      if (existingPage) {
        setPage(existingPage);
      } else if (id) {
        // If this is a new page, create it
        const newPage = {
          id,
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
  }, [id]);

  const handleDelete = () => {
    const savedPages = JSON.parse(localStorage.getItem('pages') || '[]');
    const updatedPages = savedPages.filter(p => p.id !== id);
    localStorage.setItem('pages', JSON.stringify(updatedPages));
    
    // Navigate back to the pages list in the dashboard
    // Use a default pageId (e.g., '1') or any valid project ID
    navigate('/pages/1');
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
      const updatedPages = savedPages.map(p => p.id === page.id ? updatedPage : p);
      localStorage.setItem('pages', JSON.stringify(updatedPages));
      
      setPage(updatedPage);
      
      // Show success message
      alert('Page saved successfully!');
      
      // Navigate back to the pages list
      navigate('/pages/1');
    } catch (error) {
      console.error('Error saving page:', error);
      alert('Failed to save the page. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-6"
    style={{
      backgroundColor: colors.background,
      color: colors.text,
    }}
    >
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">{page.title}</h1>
        <div className="flex gap-2">
        <button
            type="button"
            onClick={() => {
              if (window.confirm('Are you sure you want to delete this page? This action cannot be undone.')) {
                handleDelete();
              }
            }}
            className="p-2 text-red-500 hover:bg-red-50 rounded-full"
            title="Delete page"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
          <button
            onClick={() => navigate('/pages/1')}
            className="px-4 py-2 border rounded-md hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
          >
            {isSaving ? 'Saving...' : 'Save'}
          </button>
          
        </div>
      </div>
      
      <div className="border rounded-lg overflow-hidden">
        <Editor
          ref={editorRef}
          initialValue={page.content || '# Untitled\n\nStart writing here...'}
          previewStyle="vertical"
          height="calc(100vh - 200px)"
          initialEditType="markdown"
          useCommandShortcut={true}
          autofocus={true}
        />
      </div>
    </div>
  );
};

export default Dummypage;