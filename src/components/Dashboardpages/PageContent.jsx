import React, { useState, useEffect } from 'react';
import { getIcon } from '../../assets/icons.jsx';
import DashboardLayout from '../../layout/DashboardLayout.jsx';
import { useTheme } from '../../context/ThemeContext';
import PageEditorModal from '../PageEditorModal';

const PageContent = ({ page }) => {
    const { theme, colors } = useTheme();
    const [pages, setPages] = useState(() => {
        // Load pages from localStorage if available
        const savedPages = localStorage.getItem('pages');
        return savedPages ? JSON.parse(savedPages) : [];
    });
    const [showModal, setShowModal] = useState(false);
    const [selectedPageId, setSelectedPageId] = useState(null);

    // Save pages to localStorage whenever they change
    useEffect(() => {
        localStorage.setItem('pages', JSON.stringify(pages));
    }, [pages]);

    const handleNewPageClick = () => {
        const newPageId = Date.now().toString();
        setSelectedPageId(newPageId);
        setShowModal(true);
    };

    const handlePageClick = (page) => {
        setSelectedPageId(page.id);
        setShowModal(true);
    };

    const handleModalClose = () => {
        setShowModal(false);
        setSelectedPageId(null);
    };

    const handlePageSave = () => {
        // Reload pages from localStorage after save
        const savedPages = localStorage.getItem('pages');
        setPages(savedPages ? JSON.parse(savedPages) : []);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="flex-grow p-8 flex flex-col min-h-screen"
            style={{
                backgroundColor: colors.background,
                color: colors.text,
            }}
        >
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-semibold">Pages</h1>
                <button
                    onClick={handleNewPageClick}
                    className=" bg-black/20 flex items-center gap-2 px-4 py-2 rounded-md border border-2 border-gray-500"
                >
                    <span className="text-xl">+</span>
                    <span>New Page</span>
                </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pages.map((page) => (
                    <div 
                        key={page.id} 
                        className="border rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow"
                        onClick={() => handlePageClick(page)}
                        style={{
                            borderColor: colors.border,
                            backgroundColor: colors.cardBackground || colors.background
                        }}
                    >
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="font-medium text-lg">{page.title}</h3>
                            <div className="text-xs opacity-70">
                                {formatDate(page.updatedAt || page.createdAt)}
                            </div>
                        </div>
                        <div className="text-sm text-gray-500 line-clamp-3">
                            {page.content || 'No content yet...'}
                        </div>
                    </div>
                ))}
                {pages.length === 0 && (
                    <div className="col-span-full text-center py-10 text-gray-500">
                        No pages created yet. Click 'New Page' to get started.
                    </div>
                )}
            </div>

            {/* Page Editor Modal */}
            <PageEditorModal
                show={showModal}
                onHide={handleModalClose}
                pageId={selectedPageId}
                onSave={handlePageSave}
            />
        </div>
    );  
};

export default PageContent;
