

import React from 'react';
import Devnavitem from '../../components/developer/DevNavitem.jsx'; 
import AddItemDropdown from '../AddItemDropdown.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';
import DevNavitem from '../../components/developer/DevNavitem.jsx'

const DeveloperDashboardinNav = ({ navItems, setNavItems, availableOptions }) => {
    
    const { theme, colors } = useTheme();

    const handleDragStart = (e, id) => {
        e.dataTransfer.setData('text/plain', id);
    };

    const handleDrop = (e, targetId) => {
        e.preventDefault();
        const sourceId = e.dataTransfer.getData('text/plain');
        if (sourceId === targetId) return;

        const reorderedItems = [...navItems];
        const sourceIndex = navItems.findIndex(item => item.id === sourceId);
        const targetIndex = navItems.findIndex(item => item.id === targetId);
        

        const [removed] = reorderedItems.splice(sourceIndex, 1);
        reorderedItems.splice(targetIndex, 0, removed);
        setNavItems(reorderedItems);
    };

    const handleMove = (id, direction) => {
        const index = navItems.findIndex(item => item.id === id);
        if ((direction === -1 && index === 0) || (direction === 1 && index === navItems.length - 1)) return;
        
        const reorderedItems = [...navItems];
        const [item] = reorderedItems.splice(index, 1);
        reorderedItems.splice(index + direction, 0, item);
        setNavItems(reorderedItems);
    };

    const handleRename = (id, newText) => {
        setNavItems(navItems.map(item => item.id === id ? { ...item, text: newText } : item));
    };

    const handleSetDefault = (id) => {
        setNavItems(navItems.map(item => ({ ...item, default: item.id === id })));
    };

    const handleRemove = (id) => {
        setNavItems(navItems.filter(item => item.id !== id));
    };

    const handleAddItem = (option) => {
        setNavItems([...navItems, option]);
    };

    return (
        <nav 
            className="flex items-center border-b backdrop-blur-sm px-4 flex-shrink-0 z-50 transition-colors duration-300"
            style={{
                backgroundColor: theme === 'dark' ? '#0f172a' : '#ffffff',
                borderColor: colors.border,
                color: colors.text
            }}
        >
            <div className="flex items-center flex-wrap " >
                {navItems.map(item => (
                    <DevNavitem
                        key={item.id}
                        item={item}
                        onDragStart={handleDragStart}
                        onDrop={handleDrop}
                        onMove={handleMove}
                        onRename={handleRename}
                        onSetDefault={handleSetDefault}
                        onRemove={handleRemove}
                        
                        
                    />
                ))}
            </div>
            <AddItemDropdown availableOptions={availableOptions} onAddItem={handleAddItem} />
        </nav>
    );
};

export default DeveloperDashboardinNav;