import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
    Plus, Trash2, Calendar, User, Search, 
    Loader2, CornerDownRight, BookOpen, Edit2, Check, X 
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import PageEditorModal from '../PageEditorModal';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const PageContent = () => {
    const { projectId } = useParams();
    const { theme, colors } = useTheme();
    
 
    const [pages, setPages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    
   
    const [showModal, setShowModal] = useState(false);
    const [selectedPageId, setSelectedPageId] = useState(null);
    const [editingTitleId, setEditingTitleId] = useState(null);
    const [tempTitle, setTempTitle] = useState("");

    //  PAGES 
    const fetchPages = async () => {
        try {
            const authToken = localStorage.getItem('authToken');
            if (!projectId) return;

            const response = await fetch(`${API_BASE_URL}/projects/${projectId}/pages/`, {
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) throw new Error('Failed to fetch pages');
            
            const data = await response.json();
            const sortedData = data.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
            setPages(sortedData);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setError("Could not load pages.");
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPages();
    }, [projectId]);

    // PATCH TITLE
    const handleUpdateTitle = async (e, pageId) => {
        e.stopPropagation();
        if (!tempTitle.trim()) return;

        try {
            const authToken = localStorage.getItem('authToken');
            
           
            const oldPages = [...pages];
            setPages(prev => prev.map(p => {
                if (p.id === pageId) return { ...p, title: tempTitle };
                if (p.parent && p.parent.id === pageId) return { ...p, parent: { ...p.parent, title: tempTitle } };
                return p;
            }));
            
            setEditingTitleId(null); 

            const response = await fetch(`${API_BASE_URL}/projects/${projectId}/pages/${pageId}/`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ title: tempTitle })
            });

            if (!response.ok) {
                setPages(oldPages);
                throw new Error('Failed to update title');
            }
        } catch (err) {
            console.error(err);
            alert("Failed to update title");
        }
    };

    //PATCH CONTENT
    const handleUpdateContent = async (pageId, newContent) => {
        try {
            const authToken = localStorage.getItem('authToken');
            const response = await fetch(`${API_BASE_URL}/projects/${projectId}/pages/${pageId}/`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ content: newContent })
            });

            if (!response.ok) throw new Error('Failed to update content');

            await fetchPages(); 
            return true;
        } catch (err) {
            console.error(err);
            return false;
        }
    };

    // CREATE ROOT PAGE
    const handleCreateRootPage = async () => {
        try {
            const authToken = localStorage.getItem('authToken');
            const uniqueTitle = `Untitled Page ${Date.now().toString().slice(-4)}`;

            const response = await fetch(`${API_BASE_URL}/projects/${projectId}/pages/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    project: parseInt(projectId),
                    title: uniqueTitle,
                    content: `# ${uniqueTitle}\nStart writing content here...`
                })
            });

            if (!response.ok) throw new Error('Failed to create page');
            await fetchPages();
        } catch (err) {
            console.error(err);
            alert("Failed to create new page.");
        }
    };

    // CREATE CHILD PAGE 
    const handleCreateChildPage = async (e, parentId) => {
        e.stopPropagation();
        
        try {
            const authToken = localStorage.getItem('authToken');
            const uniqueTitle = `Sub-Page ${Date.now().toString().slice(-4)}`;

            const response = await fetch(`${API_BASE_URL}/projects/${projectId}/pages/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    project: parseInt(projectId),
                    title: uniqueTitle,
                    content: `## ${uniqueTitle}\nStart writing content here...`,
                    parent_id: parseInt(parentId)
                })
            });

            if (!response.ok) throw new Error(`Server returned ${response.status}`);
            await fetchPages();
        } catch (err) {
            console.error("Create Child Error:", err);
            alert("Failed to create sub-page.");
        }
    };

    // DELETE PAGE
    const handleDeletePage = async (pageId) => {
        if (!window.confirm("Are you sure? This will delete the page and all versions.")) return;

        try {
            const authToken = localStorage.getItem('authToken');
            const response = await fetch(`${API_BASE_URL}/projects/${projectId}/pages/${pageId}/`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${authToken}` }
            });

            if (!response.ok) throw new Error('Failed to delete');
            setPages(prev => prev.filter(p => p.id !== pageId));
            
           
            if (showModal && selectedPageId === pageId) {
                setShowModal(false);
            }
        } catch (err) {
            console.error(err);
            alert("Could not delete page.");
        }
    };

    const startEditing = (e, page) => {
        e.stopPropagation();
        setEditingTitleId(page.id);
        setTempTitle(page.title);
    };

    const handleCardClick = (page) => {
        if (editingTitleId === page.id) return;
        setSelectedPageId(page.id);
        setShowModal(true);
    };

    const filteredPages = pages.filter(page => 
        page.title?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const selectedPageData = pages.find(p => p.id === selectedPageId);

    if (loading) return <div className="flex justify-center items-center h-full"><Loader2 className="animate-spin text-blue-500"/></div>;

    return (
        <div className="flex-grow p-6 md:p-8 flex flex-col min-h-screen transition-colors duration-300"
            style={{ backgroundColor: colors.background, color: colors.text }}
        >
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        <BookOpen className="text-blue-500 w-8 h-8" />
                        <span className="bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">
                            Workspace Pages
                        </span>
                    </h1>
                    <p className="mt-2 text-sm opacity-60 max-w-lg">
                        Document concepts, outline plans, and structure your work efficiently.
                    </p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto mt-4 md:mt-0">
                    <div className="relative w-full md:w-64">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                        <input 
                            type="text" placeholder="Search pages..." 
                            value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 rounded-xl bg-black/5 dark:bg-white/5 border border-transparent focus:border-blue-500 outline-none transition-all"
                            style={{ color: colors.text }}
                        />
                    </div>
                    <button onClick={handleCreateRootPage} className="flex items-center justify-center gap-2 px-5 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/30 font-medium transition-all active:scale-95">
                        <Plus className="w-5 h-5" /> <span>New Page</span>
                    </button>
                </div>
            </div>

            {error && <div className="p-4 mb-6 bg-red-500/10 text-red-500 rounded-xl">{error}</div>}

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pb-10">
                {filteredPages.map((page) => (
                    <div 
                        key={page.id} 
                        onClick={() => handleCardClick(page)}
                        className="group relative flex flex-col p-6 rounded-2xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl cursor-pointer overflow-hidden"
                        style={{
                            borderColor: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.4)',
                            backgroundColor: theme === 'dark' ? 'rgba(30,30,40,0.6)' : 'rgba(255,255,255,0.25)',
                            backdropFilter: 'blur(16px)',
                            WebkitBackdropFilter: 'blur(16px)',
                            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.07)'
                        }}
                    >
                        
                        <div className="absolute -top-12 -right-12 w-32 h-32 bg-blue-500/20 rounded-full blur-[50px] group-hover:bg-blue-500/30 transition-all duration-500"></div>

                      
                        {page.parent && (
                            <div className="relative z-10 flex items-center gap-1.5 text-[10px] font-bold text-blue-500 mb-2 uppercase">
                                <CornerDownRight className="w-3 h-3" />
                                <span className="truncate">Sub-page of {page.parent.title}</span>
                            </div>
                        )}

                        {/* Editable Title */}
                        <div className="relative z-20 flex justify-between items-start mb-3 min-h-[32px]">
                            {editingTitleId === page.id ? (
                                <div className="flex items-center gap-2 w-full" onClick={e => e.stopPropagation()}>
                                    <input 
                                        type="text" 
                                        value={tempTitle}
                                        onChange={(e) => setTempTitle(e.target.value)}
                                        className="w-full bg-white/80 dark:bg-black/50 border border-blue-500 rounded px-2 py-1 text-lg font-bold outline-none backdrop-blur-md"
                                        autoFocus
                                        onKeyDown={(e) => {
                                            if(e.key === 'Enter') handleUpdateTitle(e, page.id);
                                            if(e.key === 'Escape') setEditingTitleId(null);
                                        }}
                                    />
                                    <button onClick={(e) => handleUpdateTitle(e, page.id)} className="bg-green-500 text-white p-1 rounded"><Check className="w-4 h-4"/></button>
                                    <button onClick={(e) => { e.stopPropagation(); setEditingTitleId(null); }} className="bg-red-500 text-white p-1 rounded"><X className="w-4 h-4"/></button>
                                </div>
                            ) : (
                                <div className="group/title flex items-start justify-between w-full gap-2">
                                    <h3 className="text-lg font-bold leading-tight line-clamp-2 relative z-10">{page.title}</h3>
                                    <button onClick={(e) => startEditing(e, page)} className="opacity-0 group-hover/title:opacity-100 p-1 hover:bg-black/10 rounded relative z-10">
                                        <Edit2 className="w-3.5 h-3.5 text-gray-500" />
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Content Snippet */}
                        <p className="text-sm opacity-70 line-clamp-3 mb-6 flex-grow font-light relative z-10">
                            {page.latest?.content_markdown || page.latest?.content || 'Start writing...'}
                        </p>

                        {/* Footer */}
                        <div className="flex items-end justify-between pt-4 border-t border-dashed border-gray-400/30 relative z-10">
                            <div className="flex flex-col gap-1 text-xs opacity-60">
                                <div className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(page.updated_at).toLocaleDateString()}</div>
                                <div className="flex items-center gap-1"><User className="w-3 h-3" /> {page.latest?.edited_by?.split(' ')[0] || 'Unknown'}</div>
                            </div>
                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
                                <button onClick={(e) => handleCreateChildPage(e, page.id)} className="p-2 hover:bg-blue-100 text-blue-600 rounded"><Plus className="w-4 h-4" /></button>
                                <button onClick={(e) => { 
        e.stopPropagation(); 
        handleDeletePage(page.id); 
    }} 
    className="p-2 hover:bg-red-100 text-red-600 rounded"
>
    <Trash2 className="w-4 h-4" />
</button>

                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <PageEditorModal
                show={showModal}
                onHide={() => { setShowModal(false); fetchPages(); }}
                pageId={selectedPageId}
                projectId={projectId}
                onSaveContent={handleUpdateContent}
                onDelete={handleDeletePage}
                initialPageData={selectedPageData} 
            />
        </div>
    );
};

export default PageContent;