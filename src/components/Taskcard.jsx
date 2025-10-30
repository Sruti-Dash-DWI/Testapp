import React, { useState } from 'react';
import { KebabMenuIcon, CalendarIcon, EditIcon } from './Icons';
const TaskCard = ({ task, onUpdateTask }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [newTitle, setNewTitle] = useState(task.title);
    const badgeColorMap = { 'highest':'bg-red-200 text-red-800', 'high': 'bg-red-200 text-red-800', 'medium': 'bg-yellow-200 text-yellow-800', 'low': 'bg-blue-200 text-blue-800','lowest': 'bg-green-200 text-green-800', 'bug': 'bg-pink-200 text-pink-800', 'feature': 'bg-purple-200 text-purple-800', 'improvement': 'bg-green-200 text-green-800', 'test_case': 'bg-gray-300 text-gray-800','default': 'bg-gray-200 text-gray-800' };

    const handleDragStart = (e) => {
        e.dataTransfer.setData('taskId', task.id);
    };

    return (
        <div
            draggable="true"
            onDragStart={handleDragStart}
            className="bg-black/5 text-gray-700 backdrop-blur-sm p-4 rounded-lg shadow-md cursor-grab active:cursor-grabbing hover:shadow-sm hover:-translate-y-1 transition-all border border-white/20"
        >
            <div className="flex justify-between items-start">
                {isEditing ? (
                    <input 
                        type="text"
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        onBlur={() => {
                            onUpdateTask(task.id.toString(), { title: newTitle });
                            setIsEditing(false);
                        }}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                onUpdateTask(task.id.toString(), { title: newTitle });
                                setIsEditing(false);
                            }
                            if (e.key === 'Escape') {
                                setNewTitle(task.title);
                                setIsEditing(false);
                            }
                        }}
                        className="font-semibold text-gray-100 bg-transparent border-b-2 border-blue-500 focus:outline-none w-full"
                        autoFocus
                    />
                ) : (
                    <h4 className="font-semibold text-gray-700 mb-1">{task.title}</h4>
                )}
                <div className="flex items-center gap-2">
                    <button onClick={() => setIsEditing(true)} className="text-gray-600 hover:text-black"><EditIcon /></button>
                    <button className="text-gray-600 hover:text-black"><KebabMenuIcon /></button>
                </div>
            </div>
            <p className="text-sm text-gray-600 mb-3">{task.description}</p>
            <div className="text-sm text-gray-600 mb-3 flex items-center">
                <CalendarIcon />
                <span>{new Date(task.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric'})}</span>
            </div>
            <div className="flex flex-wrap gap-2">
                {task.priority && (
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${badgeColorMap[task.priority.toLowerCase()] || badgeColorMap.default}`}>
                        {task.priority}
                    </span>
                )}
                {task.task_type && (
                     <span className={`px-2 py-1 text-xs font-semibold rounded-full ${badgeColorMap[task.task_type.toLowerCase()] || badgeColorMap.default}`}>
                        {task.task_type}
                    </span>
                )}
            </div> 
        </div>
    );
};

export default TaskCard;

