import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DeveloperDashboardLayout from '../../layout/DeveloperDashboardLayout';


// --- ICONS (Added TrashIcon) ---
const SearchIcon = () => (
    <svg className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" width="16" height="16" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" clipRule="evenodd" d="M11.396 10.396a6 6 0 111-1l5.317 5.317a.75.75 0 01-1.06 1.06l-5.317-5.317zm-5.396.604a5 5 0 100-10 5 5 0 000 10z" />
    </svg>
);
const ChevronDownIcon = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M7 10l5 5 5-5H7z" /></svg>);
const MoreHorizontalIcon = () => (<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><circle cx="6" cy="12" r="1.5" /><circle cx="12" cy="12" r="1.5" /><circle cx="18" cy="12" r="1.5" /></svg>);
const NewInsightsIcon = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg"><polyline points="3 17 9 11 13 15 21 7"></polyline><polyline points="15 7 21 7 21 13"></polyline></svg>);
const FiltersIcon = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" xmlns="http://www.w3.org/2000/svg"><line x1="4" y1="8" x2="20" y2="8" /><line x1="4" y1="16" x2="20" y2="16" /><circle cx="8" cy="8" r="2" fill="white" strokeWidth="2"/><circle cx="16" cy="16" r="2" fill="white" strokeWidth="2"/></svg>);
const CloseIcon = ({width="20", height="20"}) => (<svg width={width} height={height} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/></svg>);
const UserIcon = ({ user }) => {
    const initials = user ? user.name.split(' ').map(n => n[0]).join('') : 'U';
    const colors = ['bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500'];
    const color = (user && user.id) ? colors[user.id.toString().charCodeAt(0) % colors.length] : 'bg-gray-400';
    
    return (
        <div className={`w-6 h-6 rounded-full ${color} flex items-center justify-center text-white text-xs font-bold`}>
            {initials}
        </div>
    );
};
const PlusIcon = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>);
const PencilIcon = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>);
const TrashIcon = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>);


// Priority Icons
const PriorityHighestIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 5L17 10H7L12 5Z" fill="#D94C4C"/><path d="M12 12L17 17H7L12 12Z" fill="#D94C4C"/></svg>;
const PriorityHighIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 8L17 13H7L12 8Z" fill="#E07C3E"/></svg>;
const PriorityMediumIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 10H19" stroke="#5E6C84" strokeWidth="2" strokeLinecap="round" /><path d="M5 14H19" stroke="#5E6C84" strokeWidth="2" strokeLinecap="round" /></svg>;
const PriorityLowIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 16L7 11H17L12 16Z" fill="#4B8FD9"/></svg>;
const PriorityLowestIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 19L7 14H17L12 19Z" fill="#2D65A8 "/><path d="M12 12L7 7H17L12 12Z" fill="#2D65A8"/></svg>;


// --- Reusable Components ---
const ToggleSwitch = ({ isChecked, setIsChecked }) => (
    <button
        onClick={() => setIsChecked(!isChecked)}
        className={`relative inline-flex items-center h-5 rounded-full w-9 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${isChecked ? 'bg-green-500' : 'bg-gray-300'}`}
    >
        <span className={`inline-block w-3.5 h-3.5 transform bg-white rounded-full transition-transform ${isChecked ? 'translate-x-4' : 'translate-x-1'}`} />
    </button>
);

const Dropdown = ({ options, onSelect, children, customClasses = "w-40", menuAlign = "right" }) => {
    const [isOpen, setIsOpen] = useState(false);
    const alignmentClass = menuAlign === 'left' ? 'left-0' : 'right-0';
    return (
        <div className="relative" onMouseEnter={() => setIsOpen(true)} onMouseLeave={() => setIsOpen(false)}>
            {children}
            {isOpen && (
                <div className={`absolute z-30 ${alignmentClass} mt-1 bg-white rounded-md shadow-lg border ${customClasses}`}>
                    {options.map(option => (
                        <div key={option.value} onClick={(e) => { e.preventDefault(); onSelect(option.value); setIsOpen(false); }} className={`block px-3 py-1.5 text-sm  hover:bg-gray-100 cursor-pointer ${option.isDestructive ? 'text-red-600' : 'text-gray-700'}`}>
                            {option.label}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const StatusDropdown = ({ currentStatus, onItemUpdate, menuAlign }) => {
    const statuses = ['TO DO', 'IN PROGRESS', 'IN REVIEW', 'DONE', 'Testing'];
    const statusColors = {
        'TO DO': 'bg-gray-200 text-gray-700',
        'IN PROGRESS': 'bg-blue-100 text-blue-800',
        'IN REVIEW': 'bg-purple-100 text-purple-800',
        'DONE': 'bg-green-100 text-green-800',
        'Testing': 'bg-yellow-100 text-yellow-800',
    };
    const statusOptions = statuses.map(s => ({ value: s, label: s }));

    return (
         <Dropdown options={statusOptions} onSelect={(status) => onItemUpdate({ status })} menuAlign={menuAlign}>
            <div className={`inline-flex items-center gap-1 text-sm font-semibold px-2 py-1 rounded cursor-pointer ${statusColors[currentStatus]}`}>
                {currentStatus} <ChevronDownIcon/>
            </div>
         </Dropdown>
    );
};

const PriorityDropdown = ({ currentPriority, onItemUpdate, isIconOnly = false }) => {
    const priorities = ['Highest', 'High', 'Medium', 'Low', 'Lowest'];
    const priorityOptions = priorities.map(p => ({ value: p, label: p }));
    
    const priorityIcons = {
        'Highest': <PriorityHighestIcon />,
        'High': <PriorityHighIcon />,
        'Medium': <PriorityMediumIcon />,
        'Low': <PriorityLowIcon />,
        'Lowest': <PriorityLowestIcon />,
    };

    return (
        <Dropdown options={priorityOptions} onSelect={(priority) => onItemUpdate({ priority })}>
             <div className="flex items-center gap-2 text-sm text-gray-800 hover:bg-gray-200 p-1 rounded cursor-pointer">
                {priorityIcons[currentPriority] || <PriorityMediumIcon />}
                {!isIconOnly && <span>{currentPriority || 'Medium'}</span>}
            </div>
        </Dropdown>
    );
}

const UserSelector = ({ selectedUserId, users, onUpdate }) => {
    const selectedUser = users.find(u => u.id === selectedUserId);
    const userOptions = users.map(u => ({ value: u.id, label: u.name }));
    if (users.find(u => u.id === null)) { 
        userOptions.unshift({ value: null, label: "Unassigned" });
    }

    return (
         <Dropdown options={userOptions} onSelect={onUpdate} customClasses="w-48">
             <div className="flex items-center gap-2 text-sm text-gray-800 hover:bg-gray-200 p-1 rounded cursor-pointer">
                 <UserIcon user={selectedUser} /> 
                 <span>{selectedUser ? selectedUser.name : 'Unassigned'}</span>
             </div>
        </Dropdown>
    )
}

// --- MODAL COMPONENTS ---
const ItemDetailModal = ({ item, users, sprintName, onClose, onUpdate }) => {
    if (!item) return null;

    const [title, setTitle] = useState(item.title || '');
    const [description, setDescription] = useState(item.description || '');
    const [subtasks, setSubtasks] = useState(item.subtasks || []);
    const [newSubtaskText, setNewSubtaskText] = useState('');
    
    const handleDetailUpdate = (field, value) => {
        onUpdate(item.id, { [field]: value });
    };

    const handleAddSubtask = () => {
        if (newSubtaskText.trim() === '') return;
        const newSubtaskList = [...subtasks, { id: `sub-${Date.now()}`, text: newSubtaskText, completed: false }];
        setSubtasks(newSubtaskList);
        onUpdate(item.id, { subtasks: newSubtaskList });
        setNewSubtaskText('');
    };
    
    const toggleSubtask = (subtaskId) => {
        const newSubtaskList = subtasks.map(st => st.id === subtaskId ? {...st, completed: !st.completed} : st);
        setSubtasks(newSubtaskList);
        onUpdate(item.id, {subtasks: newSubtaskList});
    }

    const reporterUser = users.find(u => u.id === item.reporter);

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
                             {subtasks && subtasks.map(st => (
                                <div key={st.id} className="flex items-center bg-black/5 p-2 rounded">
                                    <input type="checkbox" checked={st.completed} onChange={() => toggleSubtask(st.id)} className="form-checkbox h-4 w-4 mr-3"/>
                                    <span className={`flex-grow text-sm ${st.completed ? 'line-through text-gray-500' : ''}`}>{st.text}</span>
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
                            <button onClick={handleAddSubtask} className="bg-gray-200 p-2 rounded-r-md hover:bg-gray-300"><PlusIcon/></button>
                        </div>
                    </div>

                    <div className="p-4 border rounded-md bg-white/70 border-black/10">
                        <h3 className="font-semibold mb-4">Details</h3>
                        <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-sm">
                            <div className="flex justify-between items-center"><span className="text-gray-600 font-medium">Assignee</span><UserSelector selectedUserId={item.assignee} users={users} onUpdate={(userId) => handleDetailUpdate('assignee', userId)} /></div>
                            <div className="flex justify-between items-center"><span className="text-gray-600 font-medium">Reporter</span><UserSelector selectedUserId={item.reporter} users={users.filter(u => u.id !== null)} onUpdate={(userId) => handleDetailUpdate('reporter', userId)} /></div>
                            <div className="flex justify-between items-center"><span className="text-gray-600 font-medium">Priority</span><PriorityDropdown currentPriority={item.priority} onItemUpdate={(update) => handleDetailUpdate('priority', update.priority)}/></div>
                            <div className="flex justify-between items-center"><span className="text-gray-600 font-medium">Sprint</span><span className="font-semibold text-blue-600">{sprintName}</span></div>
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

                     <div className="mt-6">
                         <h4 className="font-semibold text-gray-800 mb-3">Activity</h4>
                         <div className="space-y-4">
                             <div className="flex items-start gap-3">
                                 <UserIcon user={reporterUser} />
                                 <div className="w-full">
                                     <textarea placeholder="Add a comment..." className="w-full p-2 border bg-white/70 border-black/10 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
                                 </div>
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

const EditSprintModal = ({ sprint, onClose, onUpdate }) => {
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
        const sprintData = { name, duration, startDate, endDate, goal };
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

const StartSprintModal = ({ sprint, onClose, onStart }) => {
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

const CreateEpicModal = ({ onClose, onCreate }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!title) return;
        onCreate({ title, description });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <form onSubmit={handleSubmit} className="bg-white/90 backdrop-blur-xl rounded-lg shadow-xl w-full max-w-lg">
                <header className="p-4 border-b">
                    <h2 className="text-xl font-semibold text-gray-800">Create Epic</h2>
                </header>
                <main className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Epic Title <span className="text-red-500">*</span></label>
                        <input 
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea 
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="What is this epic about?"
                            className="w-full p-2 border border-gray-300 rounded-md h-24 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        ></textarea>
                    </div>
                </main>
                <footer className="px-6 py-3 bg-gray-50 flex justify-end items-center rounded-b-lg">
                     <button type="button" onClick={onClose} className="text-gray-600 font-semibold px-4 py-2 rounded-lg hover:bg-gray-200 transition">Cancel</button>
                    <button type="submit" className="bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-blue-700 transition ml-2">Create</button>
                </footer>
            </form>
        </div>
    );
};


export default function DeveloperBacklogPage() {
    // --- DYNAMIC ROUTE PARAMS & NAVIGATION ---
    const { projectId } = useParams(); 
    const navigate = useNavigate();

    // --- STATE MANAGEMENT ---
    const [boardData, setBoardData] = useState(null);
    const [users, setUsers] = useState([]);
    const [projectMembers, setProjectMembers] = useState([]);
    const [epics, setEpics] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const [draggedItemId, setDraggedItemId] = useState(null);
    const [activePanel, setActivePanel] = useState(null); 
    const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const [selectedItem, setSelectedItem] = useState(null);
    const [sprintToEdit, setSprintToEdit] = useState(null);
    const [sprintToStart, setSprintToStart] = useState(null);
    const [editingSprintId, setEditingSprintId] = useState(null);
    const [editingItemId, setEditingItemId] = useState(null);
    const [isEditingBacklogName, setIsEditingBacklogName] = useState(false);
    const [isCreatingSprint, setIsCreatingSprint] = useState(false);
    const [isCreatingEpic, setIsCreatingEpic] = useState(false);
    const [newSprintName, setNewSprintName] = useState("");

    const sprintNameInputRef = useRef(null);
    const backlogNameInputRef = useRef(null);
    const itemNameInputRef = useRef(null);
    const newSprintInputRef = useRef(null);

    // --- DATA FETCHING ---
    useEffect(() => {
        const fetchInitialData = async () => {
            if (!projectId) {
                setError("Project ID is missing from the URL. Please ensure your route is configured correctly (e.g., /backlog/:projectId).");
                setIsLoading(false);
                return;
            }

            setIsLoading(true);
            const authToken = localStorage.getItem('authToken'); 
            if (!authToken) {
                setError("Authentication token not found. Please log in.");
                setIsLoading(false);
                navigate('/login'); // Redirect to login if no token
                return;
            }

            try {
                const fullUrl = `http://127.0.0.1:8000/api/projects/${projectId}/`;
                console.log(`[API CALL] GET ${fullUrl}`);

                const response = await fetch(fullUrl, {
                     headers: { 'Authorization': `Bearer ${authToken}` }
                });

                if (response.status === 401) {
                    localStorage.removeItem('authToken');
                    localStorage.removeItem('userId');
                    setError("Your session has expired. Please log in again.");
                    navigate('/login');
                    return;
                }

                if (!response.ok) {
                    throw new Error(`Failed to fetch project data. Status: ${response.status} ${response.statusText}`);
                }

                const data = await response.json();
                console.log("Full API Response Received:", data);

                // --- DATA TRANSFORMATION ---
                const formattedBoardData = {
                    items: {},
                    sprints: [],
                    backlog: { id: 'backlog', name: 'Backlog', itemIds: [] },
                    itemCounter: data.tasks.length,
                };

                const transformedUsers = data.members.map(member => ({
                    id: member.user.id,
                    membershipId: member.id, // Store the membership ID
                    name: (member.user.first_name && member.user.last_name) 
                          ? `${member.user.first_name} ${member.user.last_name}`.trim()
                          : member.user.email,
                    email: member.user.email
                }));

                data.tasks.forEach(task => {
                    formattedBoardData.items[task.id] = {
                        ...task,
                        status: task.status ? task.status.title : 'TO DO',
                        assignee: task.assignees.length > 0 ? task.assignees[0].user.id : null 
                    };
                });

                formattedBoardData.sprints = data.sprints.map(sprint => {
                    const sprintItems = data.tasks.filter(task => task.sprint === sprint.id);
                    return {
                        id: sprint.id,
                        name: sprint.name,
                        goal: sprint.goal,
                        startDate: sprint.start_date,
                        endDate: sprint.end_date,
                        isActive: sprint.is_active,
                        itemIds: sprintItems.map(item => item.id),
                    };
                });
                
                const backlogItems = data.tasks.filter(task => task.sprint === null);
                formattedBoardData.backlog.itemIds = backlogItems.map(item => item.id);
                
                setBoardData(formattedBoardData);
                setUsers(transformedUsers);
                setEpics(data.epics);
                setProjectMembers(data.members); 

                console.log("Data fetching and transformation successful.");


            } catch (err) {
                setError(err.message);
                console.error("Failed to fetch initial data:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchInitialData();

    }, [projectId, navigate]); 

    // --- API HANDLERS ---
    const handleAddNewSprint = async (e) => {
        e.preventDefault();
        if (newSprintName.trim() === "") return;
        
        if (!epics || epics.length === 0) {
            console.error("Cannot create a sprint because no epics were found for this project.");
            setError("This project has no epics. Please create an epic before adding a sprint.");
            return;
        }

        const today = new Date();
        const twoWeeksFromNow = new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000);
        
        const formatDateForAPI = (date) => {
            const year = date.getFullYear();
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const day = date.getDate().toString().padStart(2, '0');
            return `${year}-${month}-${day}`;
        };

        const newSprintPayload = {
            name: newSprintName,
            goal: "",
            project: parseInt(projectId, 10),
            epic: parseInt(epics[0].id, 10),
            start_date: formatDateForAPI(today), 
            end_date: formatDateForAPI(twoWeeksFromNow)
        };
        
        const fullUrl = `http://127.0.0.1:8000/api/sprints/`;
        const authToken = localStorage.getItem('authToken');

        try {
            console.log(`[API CALL] POST ${fullUrl}`, newSprintPayload);
            const response = await fetch(fullUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authToken}` },
                body: JSON.stringify(newSprintPayload),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(JSON.stringify(errorData) || 'Network response was not ok.');
            }
            
            const createdSprint = await response.json();
            console.log("API Success: Sprint Created. Received:", createdSprint);
            
            setBoardData(prevData => ({
                ...prevData,
                sprints: [...prevData.sprints, { ...createdSprint, itemIds: [] }],
            }));

        } catch (error) {
            console.error('Error creating sprint:', error);
            setError("Failed to create the sprint. Please try again.");
        }

        setNewSprintName("");
        setIsCreatingSprint(false);
    };

    const handleUpdateSprint = async (sprintId, updates) => {
        const fullUrl = `http://127.0.0.1:8000/api/sprints/${sprintId}/`;
        const authToken = localStorage.getItem('authToken');

        
        const originalSprint = boardData.sprints.find(s => s.id === sprintId);
        if (!originalSprint) {
            console.error("Could not find sprint to update in the current state.");
            return;
        }

       
        const payload = {
            name: updates.name || originalSprint.name,
            goal: updates.goal || originalSprint.goal,
            start_date: updates.startDate || originalSprint.startDate,
            end_date: updates.endDate || originalSprint.endDate,
            duration: updates.duration || originalSprint.duration,
            is_active: originalSprint.isActive || false,
            is_ended: false, // Default is_ended to false for an update
            project: parseInt(projectId, 10),
            epic: originalSprint.epic || (epics.length > 0 ? epics[0].id : null)
        };

        try {
            console.log(`[API CALL] PUT ${fullUrl}`, payload);
            const response = await fetch(fullUrl, {
                method: 'PUT', 
                headers: { 
                    'Content-Type': 'application/json', 
                    'Authorization': `Bearer ${authToken}` 
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Backend validation error:", errorData);
                throw new Error(JSON.stringify(errorData) || 'Network response was not ok.');
            }
            
            const updatedSprintFromServer = await response.json();
            console.log("API Success: Sprint Updated. Received:", updatedSprintFromServer);
            
            
             setBoardData(prev => ({
                 ...prev,
                 sprints: prev.sprints.map(s => 
                     s.id === sprintId 
                     ? { ...s, ...updates, id: updatedSprintFromServer.id } 
                     : s
                 )
             }));

        } catch (error) {
             console.error('Error updating sprint:', error);
             setError("Failed to update sprint. Check console for details.");
        }
    };


    
    const handleStartSprint = async (sprintId, sprintData) => {
        const payload = { ...sprintData, status: 'active' };
        const fullUrl = `http://127.0.0.1:8000/api/sprints/${sprintId}/`;
        const authToken = localStorage.getItem('authToken');
        
        try {
            console.log(`[API CALL] POST ${fullUrl}`, payload);
            // const response = await fetch(fullUrl, {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authToken}` },
            //     body: JSON.stringify(payload),
            // });
            // if (!response.ok) throw new Error('Network response was not ok.');
            // console.log(`API Success: Sprint Started. Sent POST to ${fullUrl}`);
            
            setBoardData(prev => ({
                ...prev,
                sprints: prev.sprints.filter(s => s.id !== sprintId)
            }));
            
            navigate('/board');

        } catch (error) {
             console.error('Error starting sprint:', error);
        }
    };

    const handleDeleteSprint = async (sprintId) => {
        const fullUrl = `http://127.0.0.1:8000/api/sprints/${sprintId}/`;
        const authToken = localStorage.getItem('authToken');
        
        try {
            const response = await fetch(fullUrl, { 
                 method: 'DELETE',
                 headers: { 'Authorization': `Bearer ${authToken}` }
            });
            if (!response.ok) throw new Error('Network response was not ok.');
            console.log(`API Success: Sprint Deleted. Sent DELETE to ${fullUrl}`);
           
            setBoardData(prev => {
                const sprintToDelete = prev.sprints.find(s => s.id === sprintId);
                const itemsToMove = sprintToDelete ? sprintToDelete.itemIds : [];
                return {
                    ...prev,
                    sprints: prev.sprints.filter(s => s.id !== sprintId),
                    backlog: {
                        ...prev.backlog,
                        itemIds: [...prev.backlog.itemIds, ...itemsToMove]
                    }
                }
            });
        } catch(error) {
             console.error('Error deleting sprint:', error);
        }
    };

    const handleUpdateItemDB = async (itemId, updates) => {
        const authToken = localStorage.getItem('authToken');
        let fullUrl;
        let payload;

        if (updates.status) {
            fullUrl = `http://127.0.0.1:8000/api/tasks/${itemId}/status/`;
            
            const statuses = [
                { id: 1, title: 'TO DO' },
                { id: 2, title: 'IN PROGRESS' },
                { id: 3, title: 'IN REVIEW' },
                { id: 4, title: 'DONE' },
                { id: 5, title: 'Testing' }
            ];
            
            const statusObject = statuses.find(s => s.title === updates.status);
            if (statusObject) {
                payload = { status_id: statusObject.id }; 
            } else {
                console.error(`Unknown status: ${updates.status}`);
                return; 
            }
        } else {
            fullUrl = `http://127.0.0.1:8000/api/tasks/${itemId}/`;
            payload = { ...updates };

            if (updates.priority) {
                payload.priority = updates.priority.toUpperCase();
            }
        }
        
        try {
            console.log(`[API CALL] PATCH ${fullUrl}`, payload);
            const response = await fetch(fullUrl, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authToken}` },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                 const errorData = await response.json();
                console.error("Backend validation error:", errorData);
                throw new Error(JSON.stringify(errorData) || 'Network response was not ok.');
            }

            console.log(`API Success: Item Updated. Sent PATCH to ${fullUrl}`);

        } catch (error) {
            console.error(`Error updating item ${itemId}:`, error);
        }
    };
    
    const handleCreateItem = async (listId) => {
        const currentUserId = parseInt(localStorage.getItem('userId'), 10);

        if (!currentUserId) {
            setError("Could not find user ID. Please log in again.");
            return;
        }

        const currentUserMembership = projectMembers.find(member => member.user.id === currentUserId);

        if (!currentUserMembership) {
            setError("Your user is not a member of this project. Cannot create task.");
            console.error("Current user (id: ", currentUserId, ") not found in project members list:", projectMembers);
            return;
        }

        const reporterMembershipId = currentUserMembership.id; 

        // --- FIX: Ensure projectId is sent as a number, not a string ---
        const payload = {
            title: `New Task ${boardData.itemCounter + 1}`,
            description: "", 
            project: parseInt(projectId, 10), // Convert string from URL to number
            sprint: listId === 'backlog' ? null : listId,
            epic: epics.length > 0 ? epics[0].id : null,
            status_id: 1, 
            priority: "MEDIUM", 
            task_type: "FEATURE",
            assignees: [],
            reporter: reporterMembershipId, 
            tags: []
        };

        const fullUrl = `http://127.0.0.1:8000/api/tasks/`;
        const authToken = localStorage.getItem('authToken');

        try {
            console.log(`[API CALL] POST ${fullUrl}`, payload);
            const response = await fetch(fullUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authToken}` },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Backend validation error:", errorData);
                throw new Error(JSON.stringify(errorData) || 'Network response was not ok.');
            }
            
            const createdItem = await response.json();
            console.log("API Success: Item Created. Received:", createdItem);

            setBoardData(prev => {
                const newItems = { ...prev.items, [createdItem.id]: { ...createdItem, status: createdItem.status.title || 'TO DO' }};
                const sprints = prev.sprints.map(s => 
                    s.id === listId ? { ...s, itemIds: [...s.itemIds, createdItem.id] } : s
                );
                const backlog = listId === 'backlog'
                    ? { ...prev.backlog, itemIds: [...prev.backlog.itemIds, createdItem.id] }
                    : prev.backlog;

                return {
                    ...prev,
                    items: newItems,
                    sprints,
                    backlog,
                    itemCounter: prev.itemCounter + 1
                };
            });

        } catch (error) {
            console.error('Error creating task:', error);
            setError("Failed to create task. Check console for details from the server.");
        }
    };


    const handleDeleteItem = async (itemId) => {
        const fullUrl = `http://127.0.0.1:8000/api/tasks/${itemId}/`;
        const authToken = localStorage.getItem('authToken');

        try {
            const response = await fetch(fullUrl, { 
                 method: 'DELETE',
                 headers: { 'Authorization': `Bearer ${authToken}` }
            });
            if (!response.ok) throw new Error('Network response was not ok.');
            console.log(`API Success: Item Deleted. Sent DELETE to ${fullUrl}`);
            
            setBoardData(prev => {
                const newItems = { ...prev.items };
                delete newItems[itemId];
                
                const sprints = prev.sprints.map(s => ({
                    ...s,
                    itemIds: s.itemIds.filter(id => id !== itemId)
                }));
                const backlog = {
                    ...prev.backlog,
                    itemIds: prev.backlog.itemIds.filter(id => id !== itemId)
                };

                return { ...prev, items: newItems, sprints, backlog };
            });

        } catch (error) {
            console.error('Error deleting item:', error);
        }
    }
    
    const handleAddNewEpic = async ({ title, description }) => {
        const payload = {
            title,
            description,
            project: parseInt(projectId, 10),
        };
        const fullUrl = `http://127.0.0.1:8000/api/epics/`;
        const authToken = localStorage.getItem('authToken');

        try {
            console.log(`[API CALL] POST ${fullUrl}`, payload);
            const response = await fetch(fullUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authToken}` },
                body: JSON.stringify(payload),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(JSON.stringify(errorData) || 'Network response was not ok.');
            }
            const createdEpic = await response.json();
            console.log("API Success: Epic Created. Received:", createdEpic);

            setEpics(prev => [...prev, createdEpic]);
            setIsCreatingEpic(false);

        } catch (error) {
            console.error('Error creating epic:', error);
            setError("Failed to create epic. Please try again.");
        }
    };


    // --- UI HANDLERS (No API calls in these) ---
    useEffect(() => {
        if (isCreatingSprint) newSprintInputRef.current?.focus();
        if (editingSprintId) sprintNameInputRef.current?.focus();
        if (isEditingBacklogName) backlogNameInputRef.current?.focus();
        if (editingItemId) itemNameInputRef.current?.focus();
    }, [isCreatingSprint, editingSprintId, isEditingBacklogName, editingItemId]);
    
    const handleItemClick = (item) => setSelectedItem(item);
    const handleCloseModal = () => setSelectedItem(null);
    const handleCloseEditSprintModal = () => setSprintToEdit(null);
    const handleCloseStartSprintModal = () => setSprintToStart(null);
    const handleCloseCreateEpicModal = () => setIsCreatingEpic(false);

    const handleUpdateItem = (itemId, updates) => {
        setBoardData(prevData => {
            const newItems = {
                ...prevData.items,
                [itemId]: { ...prevData.items[itemId], ...updates }
            };
            return { ...prevData, items: newItems };
        });

        if (selectedItem && selectedItem.id === itemId) {
            setSelectedItem(prev => ({...prev, ...updates}));
        }
        handleUpdateItemDB(itemId, updates);
    };

    const handleStartRenameSprint = (sprintId) => setEditingSprintId(sprintId);
    const handleStartRenameBacklog = () => setIsEditingBacklogName(true);
    const handleStartRenameItem = (itemId) => setEditingItemId(itemId);

    const handleRenameSprint = (sprintId, newName) => {
        handleUpdateSprint(sprintId, { name: newName || "Untitled Sprint" });
        setEditingSprintId(null);
    };
    
    const handleRenameItem = (itemId, newTitle) => {
        handleUpdateItem(itemId, { title: newTitle || "Untitled Item" });
        setEditingItemId(null);
    };

    const handleRenameBacklog = (newName) => {
        setBoardData(prev => ({ ...prev, backlog: {...prev.backlog, name: newName || "Backlog"} }));
        setIsEditingBacklogName(false);
    };
    
    const handleDragStart = (e, itemId) => {
        setDraggedItemId(itemId);
        e.dataTransfer.effectAllowed = 'move';
        setTimeout(() => { e.target.style.opacity = '0.5'; }, 0);
    };
    
    const handleDragEnd = (e) => {
        if(e.target) e.target.style.opacity = '1';
        setDraggedItemId(null);
    };

    const handleDragOver = (e) => e.preventDefault();

    const findItemLocation = (itemId) => {
        if (!boardData) return null;
        for (const sprint of boardData.sprints) {
            if (sprint.itemIds.includes(itemId)) return { listId: sprint.id, sprintName: sprint.name };
        }
        if (boardData.backlog.itemIds.includes(itemId)) return { listId: 'backlog', sprintName: boardData.backlog.name };
        return null;
    };

    const handleDrop = (e, targetListId) => {
        e.preventDefault();
        if (!draggedItemId) return;
        
        const sourceLocation = findItemLocation(draggedItemId);
        if (!sourceLocation) return;
        
        const { listId: sourceListId } = sourceLocation;
        if (sourceListId === targetListId && !e.target.closest('[data-item-id]')) return;

        const sprintId = targetListId === 'backlog' ? null : targetListId;
        handleUpdateItemDB(draggedItemId, { sprint: sprintId });

        const newBoardData = JSON.parse(JSON.stringify(boardData));
        let sourceList = sourceListId === 'backlog' ? newBoardData.backlog.itemIds : newBoardData.sprints.find(s => s.id === sourceListId).itemIds;
        const sourceIndex = sourceList.indexOf(draggedItemId);
        if (sourceIndex > -1) sourceList.splice(sourceIndex, 1);
        
        let targetList = targetListId === 'backlog' ? newBoardData.backlog.itemIds : newBoardData.sprints.find(s => s.id === targetListId).itemIds;
        const dropTargetElement = e.target.closest('[data-item-id]');
        let dropIndex = targetList.length;

        if (dropTargetElement) {
            const dropTargetId = dropTargetElement.getAttribute('data-item-id');
            const index = targetList.indexOf(dropTargetId);
            if(index !== -1) dropIndex = index;
        }
        
        targetList.splice(dropIndex, 0, draggedItemId);
        setBoardData(newBoardData);
    };

    const handlePanelToggle = (panelName) => setActivePanel(current => (current === panelName ? null : panelName));
    const handleMoreMenuToggle = () => setIsMoreMenuOpen(prev => !prev);
    
    const filteredItems = useMemo(() => {
        if (!boardData || !boardData.items) return {};
        if (!searchTerm) return boardData.items;

        const lowercasedFilter = searchTerm.toLowerCase();
        const filtered = {};
        for (const itemId in boardData.items) {
            const item = boardData.items[itemId];
            if (item.title.toLowerCase().includes(lowercasedFilter) || item.id.toString().toLowerCase().includes(lowercasedFilter)) {
                filtered[itemId] = item;
            }
        }
        return filtered;
    }, [searchTerm, boardData]);
    
    const backlogItems = useMemo(() => {
        if (!boardData || !boardData.backlog) return [];
        return boardData.backlog.itemIds.map(id => filteredItems[id]).filter(Boolean);
    }, [boardData, filteredItems]);

    const usersWithUnassigned = useMemo(() => [{id: null, name: "Unassigned"}, ...users], [users]);
    
    const formatDate = (dateString) => {
        if (!dateString) return null;
        return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    const epicOptions = useMemo(() => {
        if (!epics) return [];
        const options = epics.map(epic => ({ value: epic.id, label: epic.title }));
        options.push({ value: 'create', label: '+ Create Epic' });
        return options;
    }, [epics]);

    // --- RENDER LOGIC ---
    if (isLoading) {
        return <div className="flex items-center justify-center h-full text-lg font-semibold" style={{background: 'linear-gradient(135deg, #ad97fd 0%, #f6a5dc 50%, #ffffff 100%)'}}>Loading backlog for project {projectId}...</div>;
    }
    
    if (error) {
        return <div className="flex items-center justify-center h-full text-red-600">Error: {error}</div>;
    }

    return (
        <>
        <DeveloperDashboardLayout>
            <div className="h-full flex flex-col font-sans text-[#172B4D]" style={{background: 'linear-gradient(135deg, #ad97fd 0%, #f6a5dc 50%, #ffffff 100%)'}}>
                <header className="sticky top-0 z-20 p-4 bg-white/80 backdrop-blur-sm border-b border-gray-200/50 flex items-center justify-between flex-shrink-0">
                    <div className="flex items-center space-x-4">
                        <div className="relative">
                            <SearchIcon />
                            <input 
                               type="text"
                               placeholder="Search backlog"
                               value={searchTerm}
                               onChange={(e) => setSearchTerm(e.target.value)}
                               className="pl-9 pr-4 py-1.5 text-sm border rounded bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                        <div className="flex items-center space-x-2 border-l pl-4">
                            <UserIcon user={users[0]} />
                            <Dropdown options={epicOptions} onSelect={(value) => { if(value === 'create') setIsCreatingEpic(true)}}>
                                <button className="flex items-center space-x-1 text-sm font-medium p-1 hover:bg-gray-200 rounded">
                                    <span>Epic</span><ChevronDownIcon />
                                </button>
                            </Dropdown>
                        </div>
                    </div>
                    <div className="flex items-center space-x-1 text-gray-600">
                        <button onClick={() => handlePanelToggle('insights')} className={`p-2 rounded ${activePanel === 'insights' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-200'}`}><NewInsightsIcon /></button>
                        <button onClick={() => handlePanelToggle('view-settings')} className={`p-2 rounded ${activePanel === 'view-settings' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-200'}`}><FiltersIcon /></button>
                        <div className="relative">
                            <button onClick={handleMoreMenuToggle} className="p-2 hover:bg-gray-200 rounded"><MoreHorizontalIcon /></button>
                            {isMoreMenuOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-20 border">
                                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Manage custom filters</a>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                <div className="flex flex-grow overflow-hidden">
                    <main className={`flex-grow transition-all duration-300 ease-in-out overflow-y-auto p-6 ${activePanel ? 'w-2/3' : 'w-full'}`}>
                        {/* PLANNED SPRINTS */}
                        {boardData.sprints.map(sprint => {
                            const sprintItems = sprint.itemIds.map(id => filteredItems[id]).filter(Boolean);
                             const sprintOptions = [
                                { value: 'edit', label: 'Edit sprint' },
                                { value: 'delete', label: 'Delete sprint', isDestructive: true },
                            ];
                            const handleSprintAction = (action) => {
                                if (action === 'edit') setSprintToEdit(sprint);
                                if (action === 'delete') handleDeleteSprint(sprint.id);
                            };
                             const formattedStartDate = formatDate(sprint.startDate);
                             const formattedEndDate = formatDate(sprint.endDate);

                            return (
                                <div key={sprint.id} className="mb-4">
                                  <div className="bg-[#f0eaff]/60 backdrop-blur-sm p-3 rounded-md shadow-sm border border-white/30" onDragOver={handleDragOver} onDrop={(e) => handleDrop(e, sprint.id)}>
                                      <div className="flex justify-between items-center mb-3">
                                          <div className="flex items-center gap-3">
                                              <input type="checkbox" className="form-checkbox h-4 w-4" />
                                                {editingSprintId === sprint.id ? (
                                                    <input
                                                        ref={sprintNameInputRef}
                                                        type="text"
                                                        defaultValue={sprint.name}
                                                        onBlur={(e) => handleRenameSprint(sprint.id, e.target.value)}
                                                        onKeyDown={(e) => { if(e.key === 'Enter') handleRenameSprint(sprint.id, e.target.value) }}
                                                        className="font-bold text-gray-800 bg-white border rounded px-1"
                                                    />
                                                ) : (
                                                    <div className="flex items-center gap-2">
                                                        <h2 className="font-bold text-gray-800">{sprint.name}</h2>
                                                        <button onClick={() => handleStartRenameSprint(sprint.id)} className="text-gray-500 hover:text-gray-800"><PencilIcon /></button>
                                                    </div>
                                                )}
                                                {formattedStartDate && formattedEndDate ? (
                                                     <span className="text-sm text-gray-500">{formattedStartDate} - {formattedEndDate}</span>
                                                ) : (
                                                    <button onClick={() => setSprintToEdit(sprint)} className="text-sm text-gray-500 hover:underline">Add dates</button>
                                                )}
                                              <span className="text-sm text-gray-500">({sprintItems.length} work item)</span>
                                          </div>
                                          <div className="flex items-center gap-4">
                                              <div className="flex space-x-1"><span className="text-xs font-bold bg-gray-200 text-gray-700 px-2 py-0.5 rounded">0</span><span className="text-xs font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded">0</span><span className="text-xs font-bold bg-green-100 text-green-800 px-2 py-0.5 rounded">0</span></div>
                                              <button onClick={() => setSprintToStart(sprint)} className="bg-blue-600 text-white px-3 py-1.5 text-sm font-semibold rounded hover:bg-blue-700 disabled:bg-blue-300" disabled={sprint.itemIds.length === 0}>Start sprint</button>
                                              <Dropdown options={sprintOptions} onSelect={handleSprintAction} customClasses="w-48">
                                                  <button className="text-gray-500 hover:bg-gray-200 p-1 rounded-full"><MoreHorizontalIcon /></button>
                                              </Dropdown>
                                          </div>
                                      </div>
                                      <div className="min-h-[80px] bg-purple-100/40 rounded p-2 border-2 border-dashed border-purple-200/50">
                                          {sprintItems.map((item) => (
                                              <div key={item.id} data-item-id={item.id} draggable="true" onDragStart={(e) => handleDragStart(e, item.id)} onDragEnd={handleDragEnd} className="group flex items-center p-2 mb-1 rounded bg-white border hover:bg-blue-50 cursor-pointer" onClick={() => handleItemClick(item)}>
                                                  <input type="checkbox" onClick={e => e.stopPropagation()} className="mr-3 form-checkbox h-4 w-4" />
                                                  <span className="text-sm text-gray-500 w-24 font-medium">{item.id}</span>
                                                    <span className="flex-grow text-sm text-gray-800 flex items-center gap-2">
                                                        {editingItemId === item.id ? (
                                                            <input
                                                                ref={itemNameInputRef}
                                                                type="text"
                                                                defaultValue={item.title}
                                                                onClick={e => e.stopPropagation()}
                                                                onBlur={(e) => handleRenameItem(item.id, e.target.value)}
                                                                onKeyDown={(e) => { if (e.key === 'Enter') handleRenameItem(item.id, e.target.value) }}
                                                                className="text-sm text-gray-800 bg-white border rounded px-1 w-full"
                                                            />
                                                        ) : (
                                                            <>
                                                                <span>{item.title}</span>
                                                                <button onClick={(e) => { e.stopPropagation(); handleStartRenameItem(item.id); }} className="text-gray-500 hover:text-gray-800 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                    <PencilIcon />
                                                                </button>
                                                            </>
                                                        )}
                                                    </span>
                                                  <div className="flex items-center space-x-4 ml-4" onClick={e => e.stopPropagation()}>
                                                      <StatusDropdown currentStatus={item.status} onItemUpdate={(updates) => handleUpdateItem(item.id, updates)} />
                                                      <PriorityDropdown currentPriority={item.priority} onItemUpdate={(updates) => handleUpdateItem(item.id, updates)} isIconOnly={true}/>
                                                      <UserSelector selectedUserId={item.assignee} users={usersWithUnassigned} onUpdate={(userId) => handleUpdateItem(item.id, { assignee: userId })} />
                                                       <button onClick={(e) => { e.stopPropagation(); handleDeleteItem(item.id); }} className="text-gray-500 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity">
                                                          <TrashIcon />
                                                      </button>
                                                  </div>
                                              </div>
                                          ))}
                                      </div>
                                      <button onClick={() => handleCreateItem(sprint.id)} className="mt-3 text-sm font-semibold text-gray-600 hover:bg-gray-200 px-3 py-1.5 rounded">+ Create</button>
                                  </div>
                                  <div className="text-center my-2 text-gray-700/80"><span className="text-xs font-semibold">{sprint.itemIds.length} work item • Estimate: 0</span></div>
                                </div>
                            )
                        })}

                        <div className="bg-[#fff0f9]/50 backdrop-blur-sm p-3 rounded-md border border-white/30" onDragOver={handleDragOver} onDrop={(e) => handleDrop(e, 'backlog')}>
                            <div className="flex justify-between items-center mb-3">
                                 <div className="flex items-center gap-4">
                                      <input type="checkbox" className="form-checkbox h-4 w-4" />
                                       {isEditingBacklogName ? (
                                           <input
                                                ref={backlogNameInputRef}
                                                type="text"
                                                defaultValue={boardData.backlog.name}
                                                onBlur={(e) => handleRenameBacklog(e.target.value)}
                                                onKeyDown={(e) => { if(e.key === 'Enter') handleRenameBacklog(e.target.value) }}
                                                className="font-bold text-gray-800 bg-white border rounded px-1"
                                            />
                                       ) : (
                                          <div className="flex items-center gap-2">
                                             <h2 className="font-bold text-gray-800">{boardData.backlog.name}</h2>
                                             <button onClick={handleStartRenameBacklog} className="text-gray-500 hover:text-gray-800"><PencilIcon /></button>
                                          </div>
                                       )}
                                     <span className="text-sm text-gray-500">{backlogItems.length} work items</span>
                                 </div>
                                <div className="flex items-center gap-4">
                                   <div className="flex space-x-1"><span className="text-xs font-bold bg-gray-200 text-gray-700 px-2 py-0.5 rounded">0</span><span className="text-xs font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded">0</span><span className="text-xs font-bold bg-green-100 text-green-800 px-2 py-0.5 rounded">0</span></div>
                                   {!isCreatingSprint && <button onClick={() => setIsCreatingSprint(true)} className="bg-gray-200 text-gray-800 px-3 py-1.5 text-sm font-semibold rounded hover:bg-gray-300">Create sprint</button>}
                                </div>
                            </div>
                           {isCreatingSprint && (
                                <form onSubmit={handleAddNewSprint} className="mb-3 p-2 bg-white rounded shadow">
                                    <input
                                        ref={newSprintInputRef}
                                        type="text"
                                        value={newSprintName}
                                        onChange={(e) => setNewSprintName(e.target.value)}
                                        placeholder="Enter new sprint name"
                                        className="w-full p-2 border rounded mb-2"
                                    />
                                    <div className="flex justify-end gap-2">
                                        <button type="button" onClick={() => setIsCreatingSprint(false)} className="bg-gray-200 text-gray-800 px-3 py-1 text-sm rounded">Cancel</button>
                                        <button type="submit" className="bg-blue-600 text-white px-3 py-1 text-sm rounded">Create</button>
                                    </div>
                                </form>
                            )}
                            <div className="min-h-[120px] bg-pink-100/30 rounded p-2 border-2 border-dashed border-pink-200/50">
                                {backlogItems.map((item) => (
                                    <div key={item.id} data-item-id={item.id} draggable="true" onDragStart={(e) => handleDragStart(e, item.id)} onDragEnd={handleDragEnd} className="group flex items-center p-2 mb-1 rounded bg-white border hover:bg-blue-50 cursor-pointer" onClick={() => handleItemClick(item)}>
                                        <input type="checkbox" onClick={e => e.stopPropagation()} className="mr-3 form-checkbox h-4 w-4" />
                                        <span className="text-sm text-gray-500 w-24 font-medium">{item.id}</span>
                                        <span className="flex-grow text-sm text-gray-800 flex items-center gap-2">
                                            {editingItemId === item.id ? (
                                                <input
                                                    ref={itemNameInputRef}
                                                    type="text"
                                                    defaultValue={item.title}
                                                    onClick={e => e.stopPropagation()}
                                                    onBlur={(e) => handleRenameItem(item.id, e.target.value)}
                                                    onKeyDown={(e) => { if (e.key === 'Enter') handleRenameItem(item.id, e.target.value) }}
                                                    className="text-sm text-gray-800 bg-white border rounded px-1 w-full"
                                                />
                                            ) : (
                                                <>
                                                    <span>{item.title}</span>
                                                    <button onClick={(e) => { e.stopPropagation(); handleStartRenameItem(item.id); }} className="text-gray-500 hover:text-gray-800 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <PencilIcon />
                                                    </button>
                                                </>
                                            )}
                                        </span>
                                        <div className="flex items-center space-x-4 ml-4" onClick={e => e.stopPropagation()}>
                                            <StatusDropdown currentStatus={item.status} onItemUpdate={(updates) => handleUpdateItem(item.id, updates)} />
                                            <PriorityDropdown currentPriority={item.priority} onItemUpdate={(updates) => handleUpdateItem(item.id, updates)} isIconOnly={true}/>
                                            <UserSelector selectedUserId={item.assignee} users={usersWithUnassigned} onUpdate={(userId) => handleUpdateItem(item.id, { assignee: userId })} />
                                             <button onClick={(e) => { e.stopPropagation(); handleDeleteItem(item.id); }} className="text-gray-500 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <TrashIcon />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button onClick={() => handleCreateItem('backlog')} className="mt-3 text-sm font-semibold text-gray-600 hover:bg-gray-200 px-3 py-1.5 rounded">+ Create</button>
                        </div>
                    </main>

                     {activePanel && ( <aside className="w-1/3 bg-white/80 backdrop-blur-sm border-l border-gray-200/50 p-4 transition-all duration-300 ease-in-out overflow-y-auto">{/* Side panel content */}</aside> )}
                </div>
            </div>
            
            <ItemDetailModal 
                item={selectedItem} 
                users={usersWithUnassigned}
                sprintName={selectedItem && boardData ? findItemLocation(selectedItem.id)?.sprintName : ''}
                onClose={handleCloseModal} 
                onUpdate={handleUpdateItem} 
            />
            <EditSprintModal
                sprint={sprintToEdit}
                onClose={handleCloseEditSprintModal}
                onUpdate={handleUpdateSprint}
            />
             <StartSprintModal
                sprint={sprintToStart}
                onClose={handleCloseStartSprintModal}
                onStart={handleStartSprint}
            />
             {isCreatingEpic && (
                <CreateEpicModal 
                    onClose={handleCloseCreateEpicModal}
                    onCreate={handleAddNewEpic}
                />
             )}
            </DeveloperDashboardLayout>
        </>
        
    );
}

