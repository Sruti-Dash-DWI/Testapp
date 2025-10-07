import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Search, Calendar, MoreHorizontal, Plus, ChevronDown, X, Check } from 'lucide-react';

const taskTypes = [
    { name: 'Task', icon: '✓' },
    { name: 'Epic', icon: '✨' },
    { name: 'Subtask', icon: '🔗' }
];

const statusOptions = [
    { id: 1, title: 'To Do' },
    { id: 2, title: 'In Progress' },
    { id: 3, title: 'In Review' },
    { id: 4, title: 'Done' },
    { id: 5, title: 'Testing' },
];

export default function CalendarUI() {
    const { projectId } = useParams();
    const navigate = useNavigate();

    const [currentDate, setCurrentDate] = useState(new Date());
    const [tasks, setTasks] = useState([]);
    const [projectMembers, setProjectMembers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const [showTaskModal, setShowTaskModal] = useState(false);
    const [taskInput, setTaskInput] = useState('');
    const [selectedDate, setSelectedDate] = useState(null);
    const [modalSelectedDate, setModalSelectedDate] = useState(null);
    const [showTaskTypeMenu, setShowTaskTypeMenu] = useState(false);
    const [selectedTaskType, setSelectedTaskType] = useState('Task');
    const [selectedParentTaskId, setSelectedParentTaskId] = useState('');
    
    const [searchTerm, setSearchTerm] = useState('');
    const [showAssigneeDropdown, setShowAssigneeDropdown] = useState(false);
    const [showTypeDropdown, setShowTypeDropdown] = useState(false);
    const [showStatusDropdown, setShowStatusDropdown] = useState(false);
    const [showMoreFiltersDropdown, setShowMoreFiltersDropdown] = useState(false);
    const [selectedAssignees, setSelectedAssignees] = useState([]);
    const [selectedTypes, setSelectedTypes] = useState([]);
    const [selectedStatuses, setSelectedStatuses] = useState([]);

    useEffect(() => {
        const fetchProjectData = async () => {
            if (!projectId) {
                setError("Project ID is missing.");
                setIsLoading(false);
                return;
            }
            setIsLoading(true);
            const authToken = localStorage.getItem("authToken");
            if (!authToken) {
                navigate("/login");
                return;
            }

            try {
                const response = await fetch(`http://127.0.0.1:8000/api/projects/${projectId}/`, {
                    headers: { Authorization: `Bearer ${authToken}` },
                });
                if (!response.ok) throw new Error("Failed to fetch project data.");
                
                const projectData = await response.json();
                setTasks(projectData.tasks || []);
                setProjectMembers(projectData.members || []);

            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };
        fetchProjectData();
    }, [projectId, navigate]);

    const { uniqueTaskTypes } = useMemo(() => {
        const types = new Set();
        tasks.forEach(task => {
            if (task.task_type) types.add(task.task_type);
        });
        return { 
            uniqueTaskTypes: Array.from(types), 
        };
    }, [tasks]);

    const filteredTasks = useMemo(() => {
        return tasks.filter(task => {
            const searchMatch = searchTerm === '' || task.title.toLowerCase().includes(searchTerm.toLowerCase());
            const assigneeMatch = selectedAssignees.length === 0 || 
                (selectedAssignees.includes('unassigned') && task.assignees.length === 0) ||
                task.assignees.some(a => selectedAssignees.includes(a.user.id));
            const typeMatch = selectedTypes.length === 0 || selectedTypes.includes(task.task_type);
            const statusMatch = selectedStatuses.length === 0 || selectedStatuses.includes(task.status?.id);
            return searchMatch && assigneeMatch && typeMatch && statusMatch;
        });
    }, [tasks, searchTerm, selectedAssignees, selectedTypes, selectedStatuses]);
    
    const handleDayClick = (day) => {
        if (day.isCurrentMonth) {
            setSelectedDate(day.fullDate);
            setModalSelectedDate(day.fullDate);
            setShowTaskModal(true);
        }
    };
    
    const formatDateForAPI = (date) => {
        if (!date) return null;
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const handleCreateTask = async () => {
        if (!taskInput.trim()) return;
        if (selectedTaskType !== 'Epic' && !modalSelectedDate) {
            alert("Please select a due date for the item.");
            return;
        }
        if (selectedTaskType === 'Subtask' && !selectedParentTaskId) {
            alert("Please select a parent task for the subtask.");
            return;
        }
        
        const authToken = localStorage.getItem("authToken");
        const currentUserId = parseInt(localStorage.getItem("userId"), 10);
        const currentUserMembership = projectMembers.find(m => m.user.id === currentUserId);
        
        if (!currentUserMembership) {
            setError("You are not a member of this project and cannot create items.");
            return;
        }

        try {
            if (selectedTaskType === 'Epic') {
                const payload = { title: taskInput, project: parseInt(projectId, 10) };
                const response = await fetch(`http://127.0.0.1:8000/api/epics/`, {
                    method: "POST",
                    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${authToken}` },
                    body: JSON.stringify(payload),
                });
                if (!response.ok) throw new Error("Failed to create epic.");
                console.log("Epic created successfully!");

            } else {
                const taskPayload = {
                    title: taskInput,
                    project: parseInt(projectId, 10),
                    reporter: currentUserMembership.id,
                    due_date: formatDateForAPI(modalSelectedDate),
                    status_id: 1, 
                    priority: "MEDIUM",
                    task_type: 'FEATURE', // CORRECTED: Set task_type to a valid choice like 'FEATURE' for all tasks/subtasks.
                };
                
                const taskResponse = await fetch(`http://127.0.0.1:8000/api/tasks/`, {
                    method: "POST",
                    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${authToken}` },
                    body: JSON.stringify(taskPayload),
                });

                const createdTask = await taskResponse.json();
                if (!taskResponse.ok) {
                    throw new Error(JSON.stringify(createdTask) || "Failed to create task.");
                }

                let finalTask = createdTask;

                if (selectedTaskType === 'Subtask') {
                    const linkPayload = { parent_task: parseInt(selectedParentTaskId, 10) };
                    const linkResponse = await fetch(`http://127.0.0.1:8000/api/tasks/${createdTask.id}/parent/`, {
                        method: "PATCH",
                        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${authToken}` },
                        body: JSON.stringify(linkPayload),
                    });
                    if (!linkResponse.ok) throw new Error("Task created, but failed to link to parent.");
                    finalTask = await linkResponse.json(); 
                }

                setTasks(prev => [...prev, finalTask]);
            }
            
            setShowTaskModal(false);
            setTaskInput('');
            setSelectedDate(null);
            setModalSelectedDate(null);
            setSelectedTaskType('Task');
            setSelectedParentTaskId('');
        } catch (error) {
            console.error("Error creating item:", error);
            setError(error.message);
        }
    };
    
    const getTasksForDate = (date) => {
        const localDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        return filteredTasks.filter(task => {
            if (!task.due_date) return false;
            const taskDate = new Date(task.due_date);
            const localTaskDate = new Date(taskDate.getUTCFullYear(), taskDate.getUTCMonth(), taskDate.getUTCDate());
            return localTaskDate.getTime() === localDate.getTime();
        });
    };
    
    const toggleFilter = (filterType, value) => {
        const updater = (prev) => prev.includes(value) ? prev.filter(item => item !== value) : [...prev, value];
        if (filterType === 'assignee') setSelectedAssignees(updater);
        if (filterType === 'type') setSelectedTypes(updater);
        if (filterType === 'status') setSelectedStatuses(updater);
    };

    const toggleTaskCompletion = (taskId) => {
        setTasks(prevTasks =>
          prevTasks.map(task =>
            task.id === taskId ? { ...task, completed: !task.completed } : task
          )
        );
    };
    const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const getCalendarDays = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const firstDay = new Date(year, month, 1);
        const startDate = new Date(firstDay);
        startDate.setDate(startDate.getDate() - (firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1));
        const days = [];
        const currentDay = new Date(startDate);
        for (let week = 0; week < 6; week++) {
            const weekDaysArr = [];
            for (let day = 0; day < 7; day++) {
                const isCurrentMonth = currentDay.getMonth() === month;
                weekDaysArr.push({ date: currentDay.getDate(), isCurrentMonth, fullDate: new Date(currentDay) });
                currentDay.setDate(currentDay.getDate() + 1);
            }
            days.push(weekDaysArr);
        }
        return days;
    };
    const calendarDays = getCalendarDays();
    const navigateMonth = (direction) => {
        setCurrentDate(prev => {
            const newDate = new Date(prev);
            newDate.setMonth(prev.getMonth() + direction);
            return newDate;
        });
    };
    const goToToday = () => {
        setCurrentDate(new Date());
    };
    const closeAllDropdowns = () => {
        setShowTypeDropdown(false);
        setShowStatusDropdown(false);
        setShowAssigneeDropdown(false);
        setShowMoreFiltersDropdown(false);
        setShowTaskTypeMenu(false);
    };
    const Dropdown = ({ children, className = "" }) => (<div className={`relative ${className}`}>{children}</div>);

    if (isLoading) return <div className="flex items-center justify-center h-full">Loading Calendar...</div>;
    if (error) return <div className="flex items-center justify-center h-full text-red-500">Error: {error}</div>;

    return (
        <div className="bg-gradient-to-br from-purple-50 via-white to-purple-100 min-h-screen">
             {(showTypeDropdown || showStatusDropdown || showAssigneeDropdown || showMoreFiltersDropdown) && (<div className="fixed inset-0 z-10" onClick={closeAllDropdowns} />)}
 
             <div className="flex items-center justify-between px-6 py-4 border-b border-purple-100 bg-white/95 backdrop-blur-sm relative z-20">
                 <div className="flex items-center space-x-4">
                     <div className="relative">
                         <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
                         <input type="text" placeholder="Search calendar" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 pr-4 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64 bg-white" />
                     </div>
                     <div className="flex items-center space-x-2">
                         <Dropdown>
                            <button onClick={() => { closeAllDropdowns(); setShowAssigneeDropdown(!showAssigneeDropdown);}} className="flex items-center px-3 py-2 border border-pink-300 rounded-lg hover:bg-gradient-to-r hover:from-pink-100 hover:to-rose-100 transition-all duration-300 bg-gradient-to-r from-white/90 to-pink-50/90 backdrop-blur-sm shadow-sm text-pink-600">
                                 Assignee <ChevronDown className="ml-1 w-4 h-4" />
                             </button>
                             {showAssigneeDropdown && ( 
                                 <div className="absolute top-full left-0 mt-1 w-56 bg-white/95 backdrop-blur-sm border border-purple-200 rounded-lg shadow-lg z-30 p-2 space-y-1">
                                    <label className="flex items-center space-x-2 p-2 hover:bg-purple-50 rounded cursor-pointer">
                                        <input type="checkbox" className="rounded" checked={selectedAssignees.includes('unassigned')} onChange={() => toggleFilter('assignee', 'unassigned')} />
                                        <span className="text-sm">Unassigned</span>
                                    </label>
                                    {projectMembers.map(member => (
                                        <label key={member.user.id} className="flex items-center space-x-2 p-2 hover:bg-purple-50 rounded cursor-pointer">
                                            <input type="checkbox" className="rounded" checked={selectedAssignees.includes(member.user.id)} onChange={() => toggleFilter('assignee', member.user.id)} />
                                            <span className="text-sm">{member.user.first_name} {member.user.last_name}</span>
                                        </label>
                                    ))}
                                 </div>
                             )}
                         </Dropdown>
                         <Dropdown>
                             <button onClick={() => { closeAllDropdowns(); setShowTypeDropdown(!showTypeDropdown); }} className="flex items-center px-3 py-2 border border-blue-200 rounded-lg hover:bg-gradient-to-r hover:from-blue-100 hover:to-cyan-100 transition-all duration-300 bg-gradient-to-r from-white/90 to-blue-50/90 backdrop-blur-sm shadow-sm text-blue-700">
                                 Type <ChevronDown className="ml-1 w-4 h-4" />
                             </button>
                             {showTypeDropdown && ( 
                                 <div className="absolute top-full left-0 mt-1 w-56 bg-white/95 backdrop-blur-sm border border-purple-200 rounded-lg shadow-lg z-30 p-2 space-y-1">
                                    {uniqueTaskTypes.map(type => (
                                        <label key={type} className="flex items-center space-x-2 p-2 hover:bg-purple-50 rounded cursor-pointer">
                                            <input type="checkbox" className="rounded" checked={selectedTypes.includes(type)} onChange={() => toggleFilter('type', type)} />
                                            <span className="text-sm">{type}</span>
                                        </label>
                                    ))}
                                 </div>
                             )}
                         </Dropdown>
                         <Dropdown>
                             <button onClick={() => { closeAllDropdowns(); setShowStatusDropdown(!showStatusDropdown); }} className="flex items-center px-3 py-2 border border-green-200 rounded-lg hover:bg-gradient-to-r hover:from-green-100 hover:to-emerald-100 transition-all duration-300 bg-gradient-to-r from-white/90 to-green-50/90 backdrop-blur-sm shadow-sm text-green-700">
                                 Status <ChevronDown className="ml-1 w-4 h-4" />
                             </button>
                             {showStatusDropdown && ( 
                                <div className="absolute top-full left-0 mt-1 w-56 bg-white/95 backdrop-blur-sm border border-purple-200 rounded-lg shadow-lg z-30 p-2 space-y-1">
                                    {statusOptions.map(status => (
                                        <label key={status.id} className="flex items-center space-x-2 p-2 hover:bg-purple-50 rounded cursor-pointer">
                                            <input type="checkbox" className="rounded" checked={selectedStatuses.includes(status.id)} onChange={() => toggleFilter('status', status.id)} />
                                            <span className="text-sm">{status.title}</span>
                                        </label>
                                    ))}
                                </div>
                             )}
                         </Dropdown>
                         <Dropdown>
                             <button onClick={() => { closeAllDropdowns(); setShowMoreFiltersDropdown(!showMoreFiltersDropdown); }} className="flex items-center px-3 py-2 border border-purple-200 rounded-lg hover:bg-gradient-to-r hover:from-purple-100 hover:to-violet-100 transition-all duration-300 bg-gradient-to-r from-white/90 to-purple-50/90 backdrop-blur-sm shadow-sm text-purple-700">
                                 More filters <ChevronDown className="ml-1 w-4 h-4" />
                             </button>
                             {showMoreFiltersDropdown && ( <div className="absolute top-full left-0 mt-1 w-64 bg-white/95 backdrop-blur-sm border border-purple-200 rounded-lg shadow-lg z-30 max-h-96 overflow-y-auto"> <div className="p-3"> <div className="relative mb-3"> <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400 w-4 h-4" /> <input type="text" placeholder="Search more filters" className="pl-9 pr-3 py-2 w-full border border-purple-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" /> </div> <div className="space-y-1"> {['Attachment','Comment','Created','Creator','Description','Design','Development','Due date','Environment','Epic Link','Fix Version','Labels','Last comment','Priority','Project','Reporter','Resolution','Sprint','Story Points','Team','Time in Status','Updated','Versions','Watchers'].map((filter) => ( <label key={filter} className="flex items-center space-x-2 p-2 hover:bg-purple-50 rounded cursor-pointer"> <input type="checkbox" className="rounded w-4 h-4" /> <span className="text-sm">{filter}</span> </label> ))} </div> </div> </div> )}
                         </Dropdown>
                     </div>
                 </div>
 
                 <div className="flex items-center space-x-4">
                    <button onClick={goToToday} className="px-4 py-2 border border-orange-200 rounded-lg hover:bg-gradient-to-r hover:from-orange-100 hover:to-amber-100 transition-all duration-300 bg-gradient-to-r from-white/90 to-orange-50/90 backdrop-blur-sm shadow-sm text-orange-700 font-medium">
                        Today
                    </button>

                    <div className="flex items-center space-x-2">
                        <button onClick={() => navigateMonth(-1)} className="p-2 hover:bg-gradient-to-r hover:from-violet-200 hover:to-purple-200 rounded-full transition-all duration-300 bg-gradient-to-r from-white/80 to-violet-50/80 shadow-sm">
                            <ChevronLeft className="w-5 h-5 text-violet-600" />
                        </button>

                        <span className="text-xl font-bold min-w-32 text-center bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                        </span>

                        <button onClick={() => navigateMonth(1)} className="p-2 hover:bg-gradient-to-r hover:from-violet-200 hover:to-purple-200 rounded-full transition-all duration-300 bg-gradient-to-r from-white/80 to-violet-50/80 shadow-sm">
                            <ChevronRight className="w-5 h-5 text-violet-600" />
                        </button>
                    </div>

                    <div className="flex items-center space-x-2">
                        <button className="p-2 hover:bg-gradient-to-r hover:from-cyan-200 hover:to-blue-200 rounded-full transition-all duration-300 bg-gradient-to-r from-white/80 to-cyan-50/80 shadow-sm">
                            <Calendar className="w-5 h-5 text-cyan-600" />
                        </button>
                        <button onClick={() => { setModalSelectedDate(new Date()); setShowTaskModal(true); }} className="p-2 hover:bg-gradient-to-r hover:from-rose-200 hover:to-pink-200 rounded-full transition-all duration-300 bg-gradient-to-r from-white/80 to-rose-50/80 shadow-sm">
                            <Plus className="w-5 h-5 text-rose-600" />
                        </button>
                        <button className="p-2 hover:bg-gradient-to-r hover:from-amber-200 hover:to-yellow-200 rounded-full transition-all duration-300 bg-gradient-to-r from-white/80 to-amber-50/80 shadow-sm">
                            <MoreHorizontal className="w-5 h-5 text-amber-600" />
                        </button>
                    </div>
                 </div>
             </div>
 
             <div className="flex flex-col h-full">
                 <div className="grid grid-cols-7 border-b border-purple-100">
                     {weekDays.map((day) => (<div key={day} className="p-4 text-center text-sm font-medium border-r border-purple-100 last:border-r-0 bg-purple-100 text-purple-700">{day}</div>))}
                 </div>
                 <div className="flex-1">
                     {calendarDays.map((week, weekIndex) => (
                         <div key={weekIndex} className="grid grid-cols-7 h-32">
                             {week.map((day, dayIndex) => (
                                 <div key={`${weekIndex}-${dayIndex}`} onClick={() => handleDayClick(day)} className={`border-r border-b border-purple-100 last:border-r-0 p-3 transition-all duration-200 cursor-pointer relative overflow-hidden ${!day.isCurrentMonth ? 'bg-purple-50/40 text-gray-400' : 'bg-purple-50/70 hover:bg-purple-100/80'}`}>
                                     <div className="text-sm font-medium text-purple-700">{day.date}</div>
                                     <div className="mt-1 space-y-1 max-h-20 overflow-y-auto">
                                         {getTasksForDate(day.fullDate).map((task) => (
                                             <div key={task.id} onClick={(e) => { e.stopPropagation(); toggleTaskCompletion(task.id); }} className={`text-sm p-1 rounded-sm cursor-pointer transition-all duration-200 flex items-center space-x-1 ${task.type === 'Epic' ? 'bg-purple-200 text-purple-800' : task.type === 'Subtask' ? 'bg-blue-200 text-blue-900' : 'bg-blue-100 text-blue-700'} ${task.completed ? 'opacity-50 line-through' : 'hover:bg-opacity-80'}`}>
                                                 <input type="checkbox" checked={task.completed} onChange={() => toggleTaskCompletion(task.id)} className="w-3 h-3 rounded" onClick={(e) => e.stopPropagation()} />
                                                 <span className="flex-1 truncate">{task.title}</span>
                                             </div>
                                         ))}
                                     </div>
                                 </div>
                             ))}
                         </div>
                     ))}
                 </div>
             </div>
 
             {showTaskModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl w-96 max-w-md mx-4">
                        <div className="p-4 border-b border-purple-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-lg font-semibold text-purple-800">Create New Item</h3>
                                    {modalSelectedDate && selectedTaskType !== 'Epic' && (<p className="text-sm text-purple-600 mt-1">{modalSelectedDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>)}
                                </div>
                                <button onClick={() => { setShowTaskModal(false); setTaskInput(''); setSelectedDate(null); setModalSelectedDate(null);}} className="text-purple-400 hover:text-purple-600">
                                    <X className="w-7 h-7 text-purple-800" />
                                </button>
                            </div>
                        </div>

                        <div className="p-4">
                            <input
                                type="text"
                                placeholder="What needs to be done?"
                                value={taskInput}
                                onChange={(e) => setTaskInput(e.target.value)}
                                className="w-full p-3 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent mb-4 bg-white/90 backdrop-blur-sm"
                                autoFocus
                            />

                           {selectedTaskType !== 'Epic' && (
                               <div className="mb-4">
                                   <label className="block text-sm font-medium text-purple-700 mb-1">Due Date</label>
                                   <input 
                                       type="date"
                                       value={modalSelectedDate ? formatDateForAPI(modalSelectedDate) : ''}
                                       onChange={(e) => {
                                            const [year, month, day] = e.target.value.split('-').map(Number);
                                            setModalSelectedDate(new Date(year, month - 1, day));
                                       }}
                                       className="w-full p-3 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white/90 backdrop-blur-sm"
                                   />
                               </div>
                           )}

                            <div className="relative mb-4">
                               <button onClick={() => setShowTaskTypeMenu(!showTaskTypeMenu)} className="w-full flex justify-between items-center p-3 border border-purple-300 rounded-lg bg-white/90 backdrop-blur-sm">
                                   <span className='flex items-center gap-2'>
                                       <span>{taskTypes.find(t => t.name === selectedTaskType)?.icon}</span>
                                       <span className="text-purple-700">{selectedTaskType}</span>
                                   </span>
                                   <ChevronDown className="w-4 h-4 text-purple-600" />
                               </button>
                               {showTaskTypeMenu && (
                                   <div className="absolute top-full left-0 mt-1 w-full bg-white/95 backdrop-blur-sm border border-purple-200 rounded-lg shadow-lg z-10">
                                       <div className="p-2">
                                           {taskTypes.map(type => (
                                               <button key={type.name} onClick={() => { setSelectedTaskType(type.name); setShowTaskTypeMenu(false); setSelectedParentTaskId(''); }} className="w-full text-left flex items-center gap-2 p-2 hover:bg-purple-50 rounded">
                                                   <span>{type.icon}</span>
                                                   <span>{type.name}</span>
                                               </button>
                                           ))}
                                       </div>
                                   </div>
                               )}
                           </div>
                           
                           {selectedTaskType === 'Subtask' && (
                               <div className="mb-4">
                                   <label className="block text-sm font-medium text-purple-700 mb-1">Parent Task</label>
                                   <select value={selectedParentTaskId} onChange={(e) => setSelectedParentTaskId(e.target.value)} className="w-full p-3 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white/90 backdrop-blur-sm">
                                       <option value="">Select a parent...</option>
                                       {tasks.map(task => (
                                           <option key={task.id} value={task.id}>{task.title}</option>
                                       ))}
                                   </select>
                               </div>
                           )}

                        </div>
                        <div className="p-4 border-t flex justify-end">
                             <button onClick={handleCreateTask} disabled={!taskInput.trim()} className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 disabled:bg-purple-300 disabled:cursor-not-allowed transition-all duration-300">
                                 Create
                             </button>
                         </div>
                    </div>
                </div>
             )}
         </div>
     );
 }

