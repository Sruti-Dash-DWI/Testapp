// src/components/projectmanager/pmpages/Pmnavitem.jsx  (or your correct path)

import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { getIcon } from '../../../../assets/icons'; // Assuming this path is correct
import { useTheme } from '../../../../context/ThemeContext.jsx';

const Pmnavitem = ({ item, onDragStart, onDrop, onMove, onRename, onSetDefault, onRemove }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editText, setEditText] = useState(item.text);

    const contextMenuRef = useRef(null);
    const location = useLocation();

    const activeProjectId = localStorage.getItem('activeProjectId');
    const slug = item.text.toLowerCase().replace(/\s+/g, '-');
    const { theme, colors } = useTheme();

    // --- UPDATED LOGIC ---
    // Added the '/pm' prefix to all generated routes.
    const routePath = activeProjectId ? `/pm/${slug}/${activeProjectId}` : '/pm/projects';
    const basePath = `/pm/${slug}`;
    const isActive = location.pathname.startsWith(basePath);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (contextMenuRef.current && !contextMenuRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleRenameStart = () => {
        setIsMenuOpen(false);
        setIsEditing(true);
    };

    const handleRenameSubmit = (e) => {
        if (e.key === 'Enter' || e.key === 'Escape') {
            if (e.key === 'Enter') {
                onRename(item.id, editText);
            }
            setIsEditing(false);
        }
    };
    
    const handleRenameBlur = () => {
        onRename(item.id, editText);
        setIsEditing(false);
    };

    const handleMenuToggle = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsMenuOpen(prev => !prev);
    };

    return (
        <div
            className="relative"
            onMouseEnter={() => !isEditing && setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => onDrop(e, item.id)}
        >
            <Link
                to={routePath}
                draggable
                onDragStart={(e) => onDragStart(e, item.id)}
                className={`flex items-center gap-2 px-4 pr-8 py-3 text-sm font-medium transition-colors duration-150 relative ${isActive ? 'text-red-800 border-b-2 border-red-800 font-bold' : 'text-gray-700 hover:bg-gray-200/50'}`}
                style={{
                    color: isActive ? colors.accent || '#3b82f6' : colors.text,
                }}
            >
                {getIcon(item.text)}
                {isEditing ? (
                    <input type="text" value={editText} onChange={(e) => setEditText(e.target.value)} onKeyDown={handleRenameSubmit} onBlur={handleRenameBlur} autoFocus className="bg-white border border-blue-500 rounded px-1 py-0.5" />
                ) : (
                    <span>{item.text}</span>
                )}
            </Link>

            {isHovered && !isEditing && (
                <button onClick={handleMenuToggle} className="absolute top-1/2 right-2 -translate-y-1/2 p-1 rounded-full focus:outline-none z-10" aria-label="Item options">
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"></path></svg>
                </button>
            )}

            {isMenuOpen && (
                <div ref={contextMenuRef} className="absolute top-full left-1/2 -translate-x-1/2 mt-1 w-40 bg-white border border-gray-200 rounded-md shadow-lg z-20">
                    <button onClick={() => { onMove(item.id, -1); setIsMenuOpen(false); }} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Move Left</button>
                    <button onClick={() => { onMove(item.id, 1); setIsMenuOpen(false); }} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Move Right</button>
                    <button onClick={handleRenameStart} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Rename</button>
                    <button onClick={() => { onSetDefault(item.id); setIsMenuOpen(false); }} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Set as Default</button>
                    <div className="border-t my-1"></div>
                    <button onClick={() => { onRemove(item.id); setIsMenuOpen(false); }} className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50">Remove</button>
                </div>
            )}
        </div>
    );
};

export default Pmnavitem;