import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { getIcon } from '../assets/icons.jsx';

const NavItem = ({ item, onDragStart, onDrop, onMove, onRename, onSetDefault, onRemove }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editText, setEditText] = useState(item.text);

    const contextMenuRef = useRef(null);
    const location = useLocation();
    const routePath = `/${item.text.toLowerCase().replace(/\s+/g, '-')}`;
    const isActive = location.pathname === routePath;

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (contextMenuRef.current && !contextMenuRef.current.contains(event.target)) {
                setIsHovered(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleRenameStart = () => {
        setIsEditing(true);
        setIsHovered(false);
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
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors duration-150 ${isActive ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
            >
                {getIcon(item.text)}
                {isEditing ? (
                    <input type="text" value={editText} onChange={(e) => setEditText(e.target.value)} onKeyDown={handleRenameSubmit} onBlur={handleRenameBlur} autoFocus className="bg-white border border-blue-500 rounded px-1 py-0.5" />
                ) : (
                    <span>{item.text}</span>
                )}
            </Link>
            {isHovered && (
                <div ref={contextMenuRef} className="absolute top-full left-1/2 -translate-x-1/2 mt-1 w-40 bg-white border border-gray-200 rounded-md shadow-lg z-20">
                    <button onClick={() => onMove(item.id, -1)} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Move Left</button>
                    <button onClick={() => onMove(item.id, 1)} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Move Right</button>
                    <button onClick={handleRenameStart} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Rename</button>
                    <button onClick={() => { onSetDefault(item.id); setIsHovered(false); }} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Set as Default</button>
                    <div className="border-t my-1"></div>
                    <button onClick={() => onRemove(item.id)} className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50">Remove</button>
                </div>
            )}
        </div>
    );
};

export default NavItem;

