// src/components/projectmanager/projectmanagercomp/Pmdashboardinnav.jsx

import React from 'react';
import Pmnavitem from './Pmnavitem.jsx'; // Use the new PM-specific NavItem
import AddItemDropdown from '../../../AddItemDropdown.jsx';

const Pmdashboardinnav = ({ navItems, setNavItems, availableOptions }) => {

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
        <nav className="flex items-center border-b border-gray-400/80 bg-stone-300/30 backdrop-blur-sm px-4 flex-shrink-0 z-50">
            <div className="flex items-center flex-wrap">
                {navItems.map(item => (
                    <Pmnavitem
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

export default Pmdashboardinnav;