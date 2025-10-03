import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion'; // For animations
import { UserSelector, PriorityDropdown, StatusDropdown } from './ReusableComponents';
import {
    MoreHorizontalIcon,
    CloseIcon,
    AddItemIcon,
} from '../../Icons'; // Make sure path is correct

// --- Placeholder Icons for the new modal ---
// You can move these to your main Icons.jsx file later
const CheckCircleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
    </svg>
);
const ExclamationCircleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
    </svg>
);
// --- End Placeholder Icons ---


// This is the UserAvatar component, used by multiple modals in this file.
const UserAvatar = ({ user }) => {
    const initials = user ? user.name.split(' ').map(n => n[0]).join('') : 'U';
    const colors = ['bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500'];
    const color = (user && user.id) ? colors[user.id.toString().charCodeAt(0) % colors.length] : 'bg-gray-400';

    return (
        <div className={`w-6 h-6 rounded-full ${color} flex items-center justify-center text-white text-xs font-bold`}>
            {initials}
        </div>
    );
};

// In BacklogModals.jsx

export const ItemDetailModal = ({ item, users, sprintName, onClose, onUpdate, onCreateSubtask }) => {
    if (!item) return null;

    const [title, setTitle] = useState(item.title || '');
    const [description, setDescription] = useState(item.description || '');
    const [subtasks, setSubtasks] = useState([]);
    const [newSubtaskText, setNewSubtaskText] = useState('');

   
    useEffect(() => {
        setSubtasks(item.subtasks || []);
    }, [item]);

    
    const reporterUser = users.find(u => u.id === item.reporter);

    // --- Handlers ---
    const handleDetailUpdate = (field, value) => {
        onUpdate(item.id, { [field]: value });
    };

    // This now calls the powerful handler in the parent component
    const handleAddSubtask = () => {
        if (newSubtaskText.trim() === '') return;
        onCreateSubtask(item.id, newSubtaskText);
        setNewSubtaskText('');
    };
    
    const toggleSubtask = (subtaskId) => {
        console.log("Toggling subtask completion needs a dedicated API call.", subtaskId);
        // You would call a function like onUpdate(subtaskId, { is_completed: true }) here
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 w-full max-w-4xl h-[95vh] flex flex-col text-gray-800">
                <header className="p-3 border-b border-black/10 flex justify-between items-center bg-white/50 rounded-t-2xl flex-shrink-0">
                    <div>
                        <span className="text-sm text-gray-600 font-medium">TASK / {item.id}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="p-1.5 text-gray-600 hover:bg-black/10 rounded"><MoreHorizontalIcon/></button>
                        <button onClick={onClose} className="p-1.5 text-gray-600 hover:bg-black/10 rounded"><CloseIcon width="24" height="24"/></button>
                    </div>
                </header>

                <main className="flex-grow overflow-y-auto p-6">
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        onBlur={() => handleDetailUpdate('title', title)}
                        className="text-2xl font-bold w-full bg-transparent focus:outline-none focus:bg-white/50 focus:ring-2 focus:ring-blue-500 rounded px-2 py-1 mb-4"
                    />

                    <div className="mb-6">
                        <StatusDropdown
                            currentStatus={item.status}
                            onItemUpdate={(updates) => onUpdate(item.id, updates)}
                            menuAlign="left"
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-semibold text-gray-600">Description</label>
                        <textarea
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            onBlur={() => handleDetailUpdate('description', description)}
                            placeholder="Add a description..."
                            className="mt-1 w-full p-2 border bg-white/70 border-black/10 rounded-md min-h-[100px] text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        ></textarea>
                    </div>

                    <div className="mb-6">
                        <h4 className="text-sm font-semibold text-gray-600 mb-2">Subtasks</h4>
                        <div className="space-y-2">
                            {subtasks.map(st => (
                                <div key={st.id} className="flex items-center bg-black/5 p-2 rounded">
                                    <input type="checkbox" checked={st.completed || false} onChange={() => toggleSubtask(st.id)} className="form-checkbox h-4 w-4 mr-3"/>
                                    <span className={`flex-grow text-sm ${st.completed ? 'line-through text-gray-500' : ''}`}>{st.title}</span>
                                </div>
                            ))}
                        </div>
                        <div className="flex items-center mt-2">
                            <input
                                type="text"
                                value={newSubtaskText}
                                onChange={(e) => setNewSubtaskText(e.target.value)}
                                placeholder="Add subtask"
                                className="flex-grow p-2 border bg-white/70 border-black/10 rounded-l-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <button onClick={handleAddSubtask} className="bg-gray-200 p-2 rounded-r-md hover:bg-gray-300"><AddItemIcon/></button>
                        </div>
                    </div>

                    <div className="p-4 border rounded-md bg-white/70 border-black/10">
                        <h3 className="font-semibold mb-4">Details</h3>
                        <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-sm">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600 font-medium">Assignee</span>
                                <UserSelector selectedUserId={item.assignee} users={users} onUpdate={(userId) => handleDetailUpdate('assignee', userId)} />
                            </div>

                            {/* ✅ NEW: Static Reporter Field */}
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600 font-medium">Reporter</span>
                                {reporterUser ? (
                                    <div className="flex items-center gap-2 p-1">
                                        <UserAvatar user={reporterUser} />
                                        <span>{reporterUser.name}</span>
                                    </div>
                                ) : (
                                    <span>-</span>
                                )}
                            </div>
                            
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600 font-medium">Priority</span>
                                <PriorityDropdown currentPriority={item.priority} onItemUpdate={(update) => handleDetailUpdate('priority', update.priority)}/>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600 font-medium">Sprint</span>
                                <span className="font-semibold text-blue-600">{sprintName}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600 font-medium">Story point estimate</span>
                                <input type="number" defaultValue={item.story_points} onBlur={(e) => handleDetailUpdate('story_points', e.target.value)} className="w-20 text-right p-1 rounded border bg-white/50 border-black/10 focus:outline-none focus:ring-1 focus:ring-blue-400"/>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600 font-medium">Due date</span>
                                <input type="date" defaultValue={item.due_date} onBlur={(e) => handleDetailUpdate('due_date', e.target.value)} className="p-1 rounded border bg-white/50 border-black/10 focus:outline-none focus:ring-1 focus:ring-blue-400"/>
                            </div>
                        </div>
                    </div>
                </main>
                
                <footer className="p-3 bg-white/50 border-t border-black/10 rounded-b-2xl flex-shrink-0 flex justify-end">
                    <button onClick={onClose} className="bg-blue-600 text-white px-4 py-2 text-sm font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-lg shadow-blue-500/30 transition">
                        Submit
                    </button>
                </footer>
            </div>
        </div>
    );
};

export const EditSprintModal = ({ sprint, onClose, onUpdate }) => {
    if (!sprint) return null;

    const [name, setName] = useState('');
    const [duration, setDuration] = useState('custom');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [goal, setGoal] = useState('');

    useEffect(() => {
        if (sprint) {
            setName(sprint.name || '');
            setGoal(sprint.goal || '');
            setStartDate(sprint.startDate || '');
            setEndDate(sprint.endDate || '');
            setDuration(sprint.duration || 'custom');
        }
    }, [sprint]);

    useEffect(() => {
        if (duration !== 'custom' && startDate) {
            const weeks = parseInt(duration, 10);
            if (!isNaN(weeks)) {
                const start = new Date(startDate);
                if (!isNaN(start.getTime())) {
                    const end = new Date(start.getTime() + weeks * 7 * 24 * 60 * 60 * 1000);
                    setEndDate(end.toISOString().split('T')[0]);
                }
            }
        }
    }, [duration, startDate]);

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // ✅ FIX: The keys here now match your backend (snake_case)
        const sprintData = { 
            name, 
            duration, 
            start_date: startDate, // Changed from startDate
            end_date: endDate,     // Changed from endDate
            goal 
        };

        onUpdate(sprint.id, sprintData);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <form onSubmit={handleSubmit} className="bg-white/90 backdrop-blur-xl rounded-lg shadow-xl w-full max-w-lg">
                <header className="p-4 border-b">
                    <h2 className="text-xl font-semibold text-gray-800">Edit sprint: {sprint.name}</h2>
                </header>
                <main className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Sprint name <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                        <select
                            value={duration}
                            onChange={(e) => setDuration(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="custom">Custom</option>
                            <option value="1">1 week</option>
                            <option value="2">2 weeks</option>
                            <option value="3">3 weeks</option>
                            <option value="4">4 weeks</option>
                        </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Start date</label>
                            <input
                                type="date"
                                value={startDate}
                                onChange={e => setStartDate(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <div>
                           <label className="block text-sm font-medium text-gray-700 mb-1">End date</label>
                            <input
                                type="date"
                                value={endDate}
                                onChange={e => setEndDate(e.target.value)}
                                disabled={duration !== 'custom'}
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Sprint goal</label>
                        <textarea
                            value={goal}
                            onChange={(e) => setGoal(e.target.value)}
                            placeholder="e.g. Finalize Q3 features"
                            className="w-full p-2 border border-gray-300 rounded-md h-24 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        ></textarea>
                    </div>
                </main>
                <footer className="px-6 py-3 bg-gray-50 flex justify-end items-center rounded-b-lg">
                      <button type="button" onClick={onClose} className="text-gray-600 font-semibold px-4 py-2 rounded-lg hover:bg-gray-200 transition">Cancel</button>
                    <button type="submit" className="bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-blue-700 transition ml-2">Update</button>
                </footer>
            </form>
        </div>
    );
};

export const StartSprintModal = ({ sprint, onClose, onStart }) => {
    if (!sprint) return null;

    const [sprintData, setSprintData] = useState({
        name: '',
        duration: 'custom',
        startDate: '',
        endDate: '',
        goal: ''
    });

    useEffect(() => {
        if(sprint) {
            setSprintData({
                name: sprint.name || '',
                duration: sprint.duration || '2', // Default to 2 weeks
                startDate: sprint.startDate || new Date().toISOString().split('T')[0],
                endDate: sprint.endDate || '',
                goal: sprint.goal || ''
            });
        }
    }, [sprint]);
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setSprintData(prev => ({...prev, [name]: value}));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onStart(sprint.id, sprintData);
        onClose();
    };

    return (
         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <form onSubmit={handleSubmit} className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 w-full max-w-lg text-gray-800">
                 <header className="p-4 border-b border-black/10">
                    <h2 className="text-xl font-semibold">Start Sprint</h2>
                    <p className="text-sm text-gray-600 mt-1">{sprint.itemIds.length} work item will be included in this sprint.</p>
                </header>
                 <main className="p-6 space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Sprint name <span className="text-red-500">*</span></label>
                        <input name="name" type="text" value={sprintData.name} onChange={handleChange} required className="w-full p-2 bg-white/70 border border-black/20 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Duration</label>
                        <select name="duration" value={sprintData.duration} onChange={handleChange} className="w-full p-2 bg-white/70 border border-black/20 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option value="custom">Custom</option>
                            <option value="1">1 week</option>
                            <option value="2">2 weeks</option>
                            <option value="3">3 weeks</option>
                            <option value="4">4 weeks</option>
                        </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Start date</label>
                            <input name="startDate" type="date" value={sprintData.startDate} onChange={handleChange} className="w-full p-2 bg-white/70 border border-black/20 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                        <div>
                           <label className="block text-sm font-medium mb-1">End date</label>
                            <input name="endDate" type="date" value={sprintData.endDate} onChange={handleChange} disabled={sprintData.duration !== 'custom'} className="w-full p-2 bg-white/70 border border-black/20 rounded-md disabled:bg-black/5 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Sprint goal</label>
                        <textarea name="goal" value={sprintData.goal} onChange={handleChange} className="w-full p-2 h-24 bg-white/70 border border-black/20 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
                    </div>
                </main>
                 <footer className="px-6 py-3 bg-black/5 flex justify-end items-center rounded-b-2xl">
                     <button type="button" onClick={onClose} className="font-semibold px-4 py-2 rounded-lg hover:bg-black/10 transition">Cancel</button>
                    <button type="submit" className="bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-blue-700 transition ml-2">Start</button>
                </footer>
            </form>
        </div>
    )
};

export const CreateEpicModal = ({ onClose, onCreate, sprints, users, reporterId, projectName }) => {
    const [formData, setFormData] = useState({
        epicName: '',
        summary: '',
        description: '',
        reporter: reporterId || null,
        assignee: null,
        sprint: '',
        priority: 'Medium',
        status: 'TO DO',
        labels: '',
        startDate: '',
        dueDate: '',
        attachment: null,
        workType: 'Epic',
    });
    const [fileName, setFileName] = useState('');

    useEffect(() => {
        setFormData(prev => ({ ...prev, reporter: reporterId }));
    }, [reporterId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        if (e.target.files[0]) {
            setFormData(prev => ({ ...prev, attachment: e.target.files[0] }));
            setFileName(e.target.files[0].name);
        }
    };
    
    const handleUpdate = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.summary || !formData.epicName) {
            alert("Please fill in the required fields: Epic Name and Summary.");
            return;
        }
        onCreate(formData);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <form onSubmit={handleSubmit} className="bg-white/95 backdrop-blur-xl rounded-lg shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col">
                <header className="p-4 border-b flex justify-between items-center flex-shrink-0">
                    <h2 className="text-xl font-semibold text-gray-800">Create</h2>
                    <button type="button" onClick={onClose} className="p-1.5 text-gray-600 hover:bg-black/10 rounded-full"><CloseIcon width="24" height="24"/></button>
                </header>

                <main className="p-6 space-y-5 overflow-y-auto">
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Project</label>
                            <input type="text" value={projectName} disabled className="w-full p-2 bg-gray-100 border border-gray-300 rounded-md cursor-not-allowed" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Work Type</label>
                            <select 
                                name="workType" 
                                value={formData.workType} 
                                onChange={handleChange} 
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="Epic">Epic</option>
                                <option value="Task">Task</option>
                                <option value="Story">Story</option>
                            </select>
                        </div>
                    </div>
                    
                    <hr/>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Epic Name <span className="text-red-500">*</span></label>
                        <input name="epicName" type="text" value={formData.epicName} onChange={handleChange} required className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Summary <span className="text-red-500">*</span></label>
                        <input name="summary" type="text" value={formData.summary} onChange={handleChange} required className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea name="description" value={formData.description} onChange={handleChange} placeholder="What is this epic about?" className="w-full p-2 border border-gray-300 rounded-md h-28 focus:ring-2 focus:ring-blue-500"></textarea>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                         <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                            <StatusDropdown currentStatus={formData.status} onItemUpdate={(update) => handleUpdate('status', update.status)} menuAlign="left" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Sprint</label>
                            <select name="sprint" value={formData.sprint} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500">
                                <option value="">None</option>
                                {sprints.map(sprint => (
                                    <option key={sprint.id} value={sprint.id}>{sprint.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                     <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                            <input name="startDate" type="date" value={formData.startDate} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                            <input name="dueDate" type="date" value={formData.dueDate} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Assignee</label>
                            <UserSelector selectedUserId={formData.assignee} users={users} onUpdate={(userId) => handleUpdate('assignee', userId)} />
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Reporter</label>
                            <UserSelector
                                selectedUserId={formData.reporter}
                                users={users.filter(u => u.id !== null)}
                                onUpdate={(userId) => handleUpdate('reporter', userId)}
                            />
                        </div>
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                        <PriorityDropdown currentPriority={formData.priority} onItemUpdate={(update) => handleUpdate('priority', update.priority)} />
                    </div>

                     <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Labels</label>
                        <input name="labels" type="text" value={formData.labels} onChange={handleChange} placeholder="e.g., mobile-app, q4-release" className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Attachment</label>
                        <label htmlFor="file-upload" className="w-full flex items-center justify-center p-2 border-2 border-dashed border-gray-300 rounded-md cursor-pointer hover:border-blue-500 hover:bg-gray-50">
                            <AddItemIcon />
                            <span className="ml-2 text-sm text-gray-600">{fileName || "Choose a file"}</span>
                        </label>
                        <input id="file-upload" name="attachment" type="file" onChange={handleFileChange} className="hidden" />
                    </div>

                </main>

                <footer className="px-6 py-3 bg-gray-50 flex justify-end items-center rounded-b-lg flex-shrink-0">
                    <button type="button" onClick={onClose} className="text-gray-600 font-semibold px-4 py-2 rounded-lg hover:bg-gray-200 transition">Cancel</button>
                    <button type="submit" className="bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-blue-700 transition ml-2">Create</button>
                </footer>
            </form>
        </div>
    );
};

// --- NEW COMPONENT ---
export const CompleteSprintModal = ({ sprint, onClose, onComplete }) => {
    if (!sprint) return null;

    const [destination, setDestination] = useState('backlog');

    const handleSubmit = () => {
        onComplete(sprint.id, sprint.openIssueIds, destination);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ ease: "easeOut", duration: 0.2 }}
                className="bg-white/95 backdrop-blur-xl rounded-lg shadow-2xl w-full max-w-lg"
            >
                <header className="p-4 border-b flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-gray-800">
                        Complete: <span className="font-bold">{sprint.name}</span>
                    </h2>
                    <button onClick={onClose} className="p-1.5 text-gray-500 hover:bg-gray-200 rounded-full">
                        <CloseIcon width="20" height="20" />
                    </button>
                </header>

                <main className="p-6 space-y-4">
                    <div className="flex items-center space-x-3 bg-green-50 p-3 rounded-lg">
                        <CheckCircleIcon />
                        <p className="text-sm text-green-800">
                            <span className="font-bold">{sprint.completedCount} completed issues</span> will be marked as done.
                        </p>
                    </div>

                    {sprint.openCount > 0 && (
                        <>
                            <div className="flex items-center space-x-3 bg-yellow-50 p-3 rounded-lg">
                                <ExclamationCircleIcon />
                                <p className="text-sm text-yellow-800">
                                    <span className="font-bold">{sprint.openCount} open issues</span> need to be moved.
                                </p>
                            </div>

                            <div>
                                <label htmlFor="move-issues-to" className="block text-sm font-semibold text-gray-700 mb-1">
                                    Move open issues to:
                                </label>
                                <select
                                    id="move-issues-to"
                                    value={destination}
                                    onChange={(e) => setDestination(e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="backlog">Backlog</option>
                                    {sprint.futureSprints.map(futureSprint => (
                                        <option key={futureSprint.id} value={futureSprint.id}>
                                            {futureSprint.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </>
                    )}
                </main>

                <footer className="px-6 py-3 bg-gray-50 flex justify-end items-center space-x-3 rounded-b-lg">
                    <button 
                        type="button" 
                        onClick={onClose} 
                        className="text-gray-700 font-semibold px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                        Cancel
                    </button>
                    <button 
                        type="button"
                        onClick={handleSubmit}
                        className="bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                    >
                        Complete Sprint
                    </button>
                </footer>
            </motion.div>
        </div>
    );
};

