import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Search, Calendar as CalendarIcon, MoreHorizontal, Plus, ChevronDown, X, AlertCircle, Grid } from 'lucide-react';

import { ItemDetailModal, EditSprintModal } from "../Dashboardpages/backlog/BacklogModals";

// --- START OF UNCHANGED CODE ---

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

const priorityOptions = ['HIGH','HIGHEST', 'MEDIUM', 'LOW', 'LOWEST'];


export default function CalendarUI() {
    const { projectId } = useParams();
    const navigate = useNavigate();

    // --- STATE MANAGEMENT ---
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
    const [selectedPriorities, setSelectedPriorities] = useState([]);
    const [sprints, setSprints] = useState([]);
    const [epics, setEpics] = useState([]);
    const [sprintToEdit, setSprintToEdit] = useState(null);
    const [selectedItemId, setSelectedItemId] = useState(null);
    const selectedItem = useMemo(() => tasks.find(t => t.id === selectedItemId) || null, [tasks, selectedItemId]);
    const [popover, setPopover] = useState({ type: null, data: null, style: {} });
    const popoverRef = useRef(null);

    // --- MEMOIZED VALUES ---
    const usersWithUnassigned = useMemo(() => [{ id: null, name: "Unassigned" }, ...projectMembers.map(m => ({ id: m.user.id, name: `${m.user.first_name || ''} ${m.user.last_name || ''}`.trim() || m.user.email }))], [projectMembers]);
    
    const uniqueTaskTypes = useMemo(() => {
        const types = new Set();
        tasks.forEach(task => {
            if (task.task_type) types.add(task.task_type);
        });
        return Array.from(types);
    }, [tasks]);

    const filteredTasks = useMemo(() => {
        return tasks.filter(task => {
            const searchMatch = searchTerm === '' || task.title.toLowerCase().includes(searchTerm.toLowerCase());
            const assigneeMatch = selectedAssignees.length === 0 || 
                (selectedAssignees.includes('unassigned') && task.assignees.length === 0) ||
                task.assignees.some(a => selectedAssignees.includes(a.user.id));
            const typeMatch = selectedTypes.length === 0 || selectedTypes.includes(task.task_type);
            const statusMatch = selectedStatuses.length === 0 || selectedStatuses.includes(task.status?.id);
            const priorityMatch = selectedPriorities.length === 0 || selectedPriorities.includes(task.priority?.toUpperCase());
            return searchMatch && assigneeMatch && typeMatch && statusMatch && priorityMatch;
        });
    }, [tasks, searchTerm, selectedAssignees, selectedTypes, selectedStatuses, selectedPriorities]);

    // --- DATA FETCHING ---
    useEffect(() => {
        const fetchAllData = async () => {
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
                const projectUrl = `http://127.0.0.1:8000/api/projects/${projectId}/`;
                const sprintUrl = `http://127.0.0.1:8000/api/sprints/dashboard/?project=${projectId}`;

                const [projectResponse, sprintResponse] = await Promise.all([
                    fetch(projectUrl, { headers: { Authorization: `Bearer ${authToken}` } }),
                    fetch(sprintUrl, { headers: { Authorization: `Bearer ${authToken}` } })
                ]);

                if (!projectResponse.ok || !sprintResponse.ok) throw new Error("Failed to fetch all project data.");
                
                const projectData = await projectResponse.json();
                const sprintData = await sprintResponse.json();

                setTasks(projectData.tasks || []);
                setProjectMembers(projectData.members || []);
                setEpics(projectData.epics || []);
                
                const allSprints = [
                    ...(sprintData.active_sprints || []),
                    ...(sprintData.upcoming_sprints || []),
                    ...(sprintData.completed_sprints || [])
                ];
                setSprints(allSprints);

            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };
        fetchAllData();
    }, [projectId, navigate]);
    
    // --- API HANDLERS ---
    const handleUpdateItemDB = async (itemId, updates) => {
    const authToken = localStorage.getItem("authToken");
    const projectIdInt = parseInt(projectId, 10);
    const updateKey = Object.keys(updates)[0];
    if (!updateKey) return;

    let fullUrl = `http://127.0.0.1:8000/api/tasks/${itemId}/`;
    let payload = {};

    switch (updateKey) {
        case "assignee":
            fullUrl += "assignees/";
            payload = { assignees: updates.assignee ? [updates.assignee] : [], project: projectIdInt };
            break;
        case "sprint":
            fullUrl += 'sprint/';
            payload = { sprint: updates.sprint };
            break;
        default:
            payload = { ...updates };
            if (payload.priority) payload.priority = payload.priority.toUpperCase();
            break;
    }

    try {
        const response = await fetch(fullUrl, {
            method: "PATCH",
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${authToken}` },
            body: JSON.stringify(payload),
        });
        
        let responseData = await response.json();
        if (!response.ok) throw new Error(JSON.stringify(responseData));
        
        if (responseData.assignees) {
            responseData.assignee = responseData.assignees.length > 0
                ? responseData.assignees[0].user.id
                : null;
        }

        setTasks(prev => prev.map(t => t.id === itemId ? { ...t, ...responseData } : t));
    } catch (error) {
        console.error(`Failed to update item ${itemId}:`, error.message);
        setError("Failed to update the task.");
    }
};
    
    const handleToggleTaskStatus = async (taskId) => {
        const authToken = localStorage.getItem("authToken");
        const task = tasks.find(t => t.id === taskId);
        if (!task) return;

        const newStatusId = task.status?.id === 4 ? 1 : 4; 
        
        const originalTasks = tasks;
        setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: statusOptions.find(s => s.id === newStatusId) } : t));

        try {
            const response = await fetch(`http://127.0.0.1:8000/api/tasks/${taskId}/status/`, {
                method: "PATCH",
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${authToken}` },
                body: JSON.stringify({ status: newStatusId, project: parseInt(projectId, 10) }),
            });
            if (!response.ok) throw new Error("Failed to update task status.");
            
            const updatedTask = await response.json();
            setTasks(prev => prev.map(t => t.id === taskId ? { ...t, ...updatedTask } : t));
        } catch (error) {
            console.error("Error toggling task status:", error);
            setError("Could not update task status.");
            setTasks(originalTasks);
        }
    };
    
    const handleDeleteSprint = async (sprintId) => {
        if (!window.confirm("Are you sure you want to delete this sprint? This action cannot be undone.")) return;
        
        const authToken = localStorage.getItem("authToken");
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/sprints/${sprintId}/`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${authToken}` },
            });
            if (!response.ok) throw new Error("Failed to delete sprint.");

            setSprints(prev => prev.filter(s => s.id !== sprintId));
            setPopover({ type: null });
        } catch (error) {
            console.error("Error deleting sprint:", error);
            setError("Could not delete the sprint.");
        }
    };

    const handleUpdateSprint = async (sprintId, updates) => {
        const authToken = localStorage.getItem("authToken");
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/sprints/${sprintId}/`, {
                method: "PATCH",
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${authToken}` },
                body: JSON.stringify(updates),
            });
            if (!response.ok) throw new Error("Failed to update sprint.");
            
            const updatedSprint = await response.json();
            setSprints(prev => prev.map(s => s.id === sprintId ? { ...s, ...updatedSprint } : s));
            setSprintToEdit(null);
        } catch (error) {
            console.error("Error updating sprint:", error);
            setError("Could not update the sprint.");
        }
    };

    

const handleFetchComments = async (taskId) => {
    const authToken = localStorage.getItem("authToken");
    try {
        const response = await fetch(`http://127.0.0.1:8000/api/tasks/${taskId}/activities/`, {
            headers: { Authorization: `Bearer ${authToken}` },
        });
        if (!response.ok) throw new Error("Failed to fetch comments.");
        const activities = await response.json();

        setTasks(prev => prev.map(t => t.id === taskId ? { ...t, activity_log: activities } : t));
    } catch (error) {
        console.error("Error fetching comments:", error);
    }
};

const handleAddComment = async (taskId, commentBody) => {
    if (!commentBody.trim()) return;
    const authToken = localStorage.getItem("authToken");
    try {
        const response = await fetch(`http://127.0.0.1:8000/api/tasks/${taskId}/add-activity/`, {
            method: "POST",
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${authToken}` },
            body: JSON.stringify({ comment_body: commentBody }),
        });
        if (!response.ok) throw new Error("Failed to post comment.");
        const newActivity = await response.json();

        setTasks(prev => prev.map(t => {
            if (t.id === taskId) {
                return { ...t, activity_log: [...(t.activity_log || []), newActivity] };
            }
            return t;
        }));
    } catch (error) {
        console.error("Error adding comment:", error);
        setError("Could not post your comment.");
    }
};

const handleUpdateComment = async (taskId, activityId, commentBody) => {
    const authToken = localStorage.getItem("authToken");
    try {
        const response = await fetch(`http://127.0.0.1:8000/api/tasks/${taskId}/update-activity/${activityId}/`, {
            method: "PUT",
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${authToken}` },
            body: JSON.stringify({ comment_body: commentBody }),
        });
        if (!response.ok) throw new Error("Failed to update comment.");
        const updatedActivity = await response.json();

        const updateLogs = (logs) => (logs || []).map(act => act.id === activityId ? updatedActivity : act);
        setTasks(prev => prev.map(t => t.id === taskId ? { ...t, activity_log: updateLogs(t.activity_log) } : t));
    } catch (error) {
        console.error("Error updating comment:", error);
        setError("Could not update your comment.");
    }
};

const handleDeleteComment = async (taskId, activityId) => {
    const authToken = localStorage.getItem("authToken");
    try {
        const response = await fetch(`http://127.0.0.1:8000/api/tasks/${taskId}/delete-activity/${activityId}/`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${authToken}` },
        });
        if (!response.ok) throw new Error("Failed to delete comment.");

        const updateLogs = (logs) => (logs || []).filter(act => act.id !== activityId);
        setTasks(prev => prev.map(t => t.id === taskId ? { ...t, activity_log: updateLogs(t.activity_log) } : t));
    } catch (error) {
        console.error("Error deleting comment:", error);
        setError("Could not delete your comment.");
    }
};

    const formatDateForAPI = (date) => {
        if (!date) return null;
        // If date is already a string in 'YYYY-MM-DD' format, return it
        if (typeof date === 'string') {
            return date.split('T')[0];
        }
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
                    task_type: 'FEATURE',
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
            setModalSelectedDate(null);
            setSelectedTaskType('Task');
            setSelectedParentTaskId('');
        } catch (error) {
            console.error("Error creating item:", error);
            setError(error.message);
        }
    };

   

const handleCreateSubtask = async (parentItemId, subtaskTitle) => {
    if (!subtaskTitle.trim() || !parentItemId) return;

    const authToken = localStorage.getItem("authToken");
    const currentUserId = parseInt(localStorage.getItem("userId"), 10);
    const currentUserMembership = projectMembers.find(m => m.user.id === currentUserId);
    
    if (!currentUserMembership) {
        setError("You are not a member of this project and cannot create subtasks.");
        return;
    }
    
    try {
        const taskPayload = {
            title: subtaskTitle,
            project: parseInt(projectId, 10),
            reporter: currentUserMembership.id,
            due_date: formatDateForAPI(tasks.find(t => t.id === parentItemId)?.due_date) || formatDateForAPI(new Date()),
            status_id: 1, 
            priority: "MEDIUM",
            task_type: 'FEATURE',
        };
        
        const taskResponse = await fetch(`http://127.0.0.1:8000/api/tasks/`, {
            method: "POST",
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${authToken}` },
            body: JSON.stringify(taskPayload),
        });

        const createdTask = await taskResponse.json();
        if (!taskResponse.ok) {
            throw new Error(JSON.stringify(createdTask) || "Failed to create subtask.");
        }

        const linkPayload = { parent_task: parentItemId };
        const linkResponse = await fetch(`http://127.0.0.1:8000/api/tasks/${createdTask.id}/parent/`, {
            method: "PATCH",
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${authToken}` },
            body: JSON.stringify(linkPayload),
        });
        if (!linkResponse.ok) throw new Error("Task created, but failed to link to parent.");

        const newSubtask = { ...createdTask, parent: parentItemId };

        setTasks(prevTasks => {
            const tasksWithUpdatedParent = prevTasks.map(task => {
                if (task.id === parentItemId) {
                    return { ...task, subtasks: [...(task.subtasks || []), newSubtask] };
                }
                return task;
            });
            return [...tasksWithUpdatedParent, newSubtask];
        });
    } catch (error) {
        console.error("Error creating subtask:", error);
        setError(error.message);
    }
};
    
// --- HELPER FUNCTIONS ---
    const getItemsForDate = (date) => {
        const localDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

        const tasksOnDate = filteredTasks
            .filter(task => {
                if (!task.due_date) return false;
                const taskDate = new Date(task.due_date + 'T00:00:00');
                return taskDate.getTime() === localDate.getTime();
            })
            .map(task => ({ ...task, itemType: 'task' }));

        let sprintsOnDate = [];
        const isAnyFilterActive = selectedAssignees.length > 0 || selectedTypes.length > 0 || selectedStatuses.length > 0 || selectedPriorities.length > 0;
        
        if (!isAnyFilterActive) {
            sprintsOnDate = sprints
                .filter(sprint => {
                    const startDate = new Date(sprint.start_date + 'T00:00:00');
                    const endDate = new Date(sprint.end_date + 'T00:00:00');
                    const isWithinDate = localDate >= startDate && localDate <= endDate;
                    const searchMatch = searchTerm === '' || sprint.name.toLowerCase().includes(searchTerm.toLowerCase());
                    return isWithinDate && searchMatch;
                })
                .map(sprint => ({ ...sprint, itemType: 'sprint' }));
        }

        return [...sprintsOnDate, ...tasksOnDate];
    };

    const toggleFilter = (filterType, value) => {
        const updater = (prev) => prev.includes(value) ? prev.filter(item => item !== value) : [...prev, value];
        if (filterType === 'assignee') setSelectedAssignees(updater);
        if (filterType === 'type') setSelectedTypes(updater);
        if (filterType === 'status') setSelectedStatuses(updater);
        if (filterType === 'priority') setSelectedPriorities(updater);
    };
    
    const calculatePopoverPosition = (event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        const popoverHeight = 250;
        const popoverWidth = 250;
        
        let style = {};

        if (rect.bottom + popoverHeight > window.innerHeight) {
            style.bottom = `${window.innerHeight - rect.top}px`;
        } else {
            style.top = `${rect.bottom}px`;
        }

        if (rect.left + popoverWidth > window.innerWidth) {
            style.right = `${window.innerWidth - rect.right}px`;
        } else {
            style.left = `${rect.left}px`;
        }
        
        return style;
    }

    const handleItemClick = (item, event) => {
        event.stopPropagation();
        if (item.itemType === 'task') {
            console.log("DATA FOR MODAL:", item); 
             setSelectedItemId(item.id);
        } else if (item.itemType === 'sprint') {
            setPopover({
                type: 'sprint',
                data: item,
                style: calculatePopoverPosition(event)
            });
        }
    };
    
    const handleMoreClick = (items, event) => {
        event.stopPropagation();
        setPopover({
            type: 'more',
            data: items,
            style: calculatePopoverPosition(event)
        });
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (popoverRef.current && !popoverRef.current.contains(event.target)) {
                setPopover({ type: null });
            }
        };
        const handleScroll = () => {
            setPopover({ type: null });
        };
        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("scroll", handleScroll, true);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("scroll", handleScroll, true);
        };
    }, []);

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
                weekDaysArr.push({ date: currentDay.getDate(), isCurrentMonth: currentDay.getMonth() === month, fullDate: new Date(currentDay) });
                currentDay.setDate(currentDay.getDate() + 1);
            }
            days.push(weekDaysArr);
        }
        return days;
    };
    const calendarDays = getCalendarDays();
    const navigateMonth = (direction) => setCurrentDate(prev => {
        const newDate = new Date(prev);
        newDate.setMonth(prev.getMonth() + direction);
        return newDate;
    });
    const goToToday = () => setCurrentDate(new Date());
    const closeAllDropdowns = () => {
        setShowTypeDropdown(false);
        setShowStatusDropdown(false);
        setShowAssigneeDropdown(false);
        setShowMoreFiltersDropdown(false);
        setShowTaskTypeMenu(false);
    };
// --- END OF UNCHANGED CODE ---


   if (isLoading) {
return (
     <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
       <div className="w-12 h-12 border-4 border-gray-300 border-solid rounded-full border-t-blue-500 animate-spin"></div>
       <p className="mt-4 text-lg font-semibold text-gray-700">Loading...</p>
     </div>
 );
}
    if (error) return <div className="flex items-center justify-center h-full text-red-500 p-10">Error: {error}</div>;
    
    // --- START OF STYLED RENDER ---
    return (
        <div className="bg-gray-50 min-h-screen p-4 sm:p-6 lg:p-8">
            {(showTypeDropdown || showStatusDropdown || showAssigneeDropdown || showMoreFiltersDropdown) && (<div className="fixed inset-0 z-10" onClick={closeAllDropdowns} />)}

            <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-full mx-auto">
            
                <div className="flex flex-wrap items-center justify-between mb-6 gap-4">
                    {/* Filters and Search */}
                    <div className="flex items-center space-x-2 flex-wrap gap-2">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input type="text" placeholder="Search events" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64 bg-white text-sm" />
                        </div>
                        <div className="flex items-center space-x-2">
                             <div className="relative">
                                 <button onClick={() => { closeAllDropdowns(); setShowAssigneeDropdown(!showAssigneeDropdown);}} className="flex items-center px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 hover:bg-gray-50 text-sm">
                                     All Assignees <ChevronDown className="ml-2 w-4 h-4 text-gray-500" />
                                 </button>
                                 {showAssigneeDropdown && ( 
                                     <div className="absolute top-full left-0 mt-1 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-30 p-2 space-y-1">
                                         <label className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded cursor-pointer">
                                             <input type="checkbox" className="rounded text-blue-600 focus:ring-blue-500" checked={selectedAssignees.includes('unassigned')} onChange={() => toggleFilter('assignee', 'unassigned')} />
                                             <span className="text-sm text-gray-700">Unassigned</span>
                                         </label>
                                         {projectMembers.map(member => (
                                             <label key={member.user.id} className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded cursor-pointer">
                                                 <input type="checkbox" className="rounded text-blue-600 focus:ring-blue-500" checked={selectedAssignees.includes(member.user.id)} onChange={() => toggleFilter('assignee', member.user.id)} />
                                                 <span className="text-sm text-gray-700">{member.user.first_name} {member.user.last_name}</span>
                                             </label>
                                         ))}
                                     </div>
                                 )}
                             </div>
                            <div className="relative">
                                 <button onClick={() => { closeAllDropdowns(); setShowTypeDropdown(!showTypeDropdown); }} className="flex items-center px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 hover:bg-gray-50 text-sm">
                                     All Types <ChevronDown className="ml-2 w-4 h-4 text-gray-500" />
                                 </button>
                                 {showTypeDropdown && ( 
                                     <div className="absolute top-full left-0 mt-1 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-30 p-2 space-y-1">
                                         {uniqueTaskTypes.map(type => (
                                             <label key={type} className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded cursor-pointer">
                                                 <input type="checkbox" className="rounded text-blue-600 focus:ring-blue-500" checked={selectedTypes.includes(type)} onChange={() => toggleFilter('type', type)} />
                                                 <span className="text-sm text-gray-700">{type}</span>
                                             </label>
                                         ))}
                                     </div>
                                 )}
                            </div>
                            <div className="relative">
                                 <button onClick={() => { closeAllDropdowns(); setShowStatusDropdown(!showStatusDropdown); }} className="flex items-center px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 hover:bg-gray-50 text-sm">
                                     All Status <ChevronDown className="ml-2 w-4 h-4 text-gray-500" />
                                 </button>
                                 {showStatusDropdown && ( 
                                     <div className="absolute top-full left-0 mt-1 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-30 p-2 space-y-1">
                                         {statusOptions.map(status => (
                                             <label key={status.id} className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded cursor-pointer">
                                                 <input type="checkbox" className="rounded text-blue-600 focus:ring-blue-500" checked={selectedStatuses.includes(status.id)} onChange={() => toggleFilter('status', status.id)} />
                                                 <span className="text-sm text-gray-700">{status.title}</span>
                                             </label>
                                         ))}
                                     </div>
                                 )}
                            </div>
                            <div className="relative">
                                 <button onClick={() => { closeAllDropdowns(); setShowMoreFiltersDropdown(!showMoreFiltersDropdown); }} className="flex items-center px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 hover:bg-gray-50 text-sm">
                                     More filters <ChevronDown className="ml-2 w-4 h-4 text-gray-500" />
                                 </button>
                                 {showMoreFiltersDropdown && (
                                     <div className="absolute top-full left-0 mt-1 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-30 max-h-96 overflow-y-auto p-3">
                                         <h4 className="text-xs font-bold text-gray-500 uppercase mb-2 px-2">Priority</h4>
                                         <div className='space-y-1 mb-3'>
                                             {priorityOptions.map((priority) => (
                                                 <label key={priority} className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded cursor-pointer">
                                                     <input type="checkbox" className="rounded w-4 h-4 text-blue-600 focus:ring-blue-500" checked={selectedPriorities.includes(priority)} onChange={() => toggleFilter('priority', priority)} />
                                                     <span className="text-sm text-gray-700">{priority.charAt(0) + priority.slice(1).toLowerCase()}</span>
                                                 </label>
                                             ))}
                                         </div>
                                     </div>
                                 )}
                            </div>
                        </div>
                    </div>

                    {/* Calendar Controls */}
                    <div className="flex items-center space-x-2">
                        <button onClick={goToToday} className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-all duration-300 text-sm font-medium">
                            Today
                        </button>
                        <div className="flex items-center space-x-1">
                            <button onClick={() => navigateMonth(-1)} className="p-2 hover:bg-gray-100 rounded-full transition-all duration-300">
                                <ChevronLeft className="w-5 h-5 text-gray-500" />
                            </button>
                            <span className="text-base font-semibold min-w-32 text-center text-gray-800">
                                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                            </span>
                            <button onClick={() => navigateMonth(1)} className="p-2 hover:bg-gray-100 rounded-full transition-all duration-300">
                                <ChevronRight className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>
                        <div className="flex items-center space-x-1 border-l pl-2 ml-2">
                            <button className="p-2 bg-gray-100 rounded-lg transition-all duration-300" title="Calendar View">
                                <CalendarIcon className="w-5 h-5 text-gray-700" />
                            </button>
                            <button className="p-2 hover:bg-gray-100 rounded-lg transition-all duration-300" title="More Options">
                                <MoreHorizontal className="w-5 h-5 text-gray-500" />
                            </button>
                            <button onClick={() => { setModalSelectedDate(new Date()); setShowTaskModal(true); }} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 text-sm font-medium">
                                <Plus className="w-4 h-4" />
                                <span>New Event</span>
                            </button>
                        </div>
                    </div>
                </div>
                
                <div className="flex flex-col border border-gray-200 rounded-lg overflow-hidden">
                    <div className="grid grid-cols-7 bg-gray-50 border-b border-gray-200">
                        {weekDays.map((day) => (<div key={day} className="py-3 px-2 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">{day}</div>))}
                    </div>
                    <div className="flex-1">
                        {calendarDays.map((week, weekIndex) => (
                            <div key={weekIndex} className="grid grid-cols-7" style={{ minHeight: '120px' }}>
                                {week.map((day, dayIndex) => {
                                    const items = getItemsForDate(day.fullDate);
                                    const displayItems = items.slice(0, 1);
                                    const hiddenItemsCount = items.length - displayItems.length;
                                    const today = new Date();
                                    today.setHours(0,0,0,0);
                                    const isToday = day.fullDate.getTime() === today.getTime();

                                    return (
                                        <div key={`${weekIndex}-${dayIndex}`} onClick={() => { if (day.isCurrentMonth) setShowTaskModal(true); setModalSelectedDate(day.fullDate) }} className={`border-b border-gray-200 ${dayIndex < 6 ? 'border-r' : ''} p-2 transition-colors duration-200 cursor-pointer relative ${!day.isCurrentMonth ? 'bg-gray-50' : 'bg-white hover:bg-gray-50'}`}>
                                            <div className={`text-sm font-semibold mb-1 ${isToday ? 'bg-orange-500 text-white rounded-full w-6 h-6 flex items-center justify-center' : (day.isCurrentMonth ? 'text-gray-700' : 'text-gray-400')}`}>
                                                {day.date}
                                            </div>
                                            <div className="mt-1 space-y-1">
                                                {displayItems.map((item) => {
                                                    const isOverdue = item.itemType === 'task' && item.due_date && new Date(item.due_date) < today && item.status?.id !== 4;
                                                    return (
                                                        <div 
                                                            key={`${item.itemType}-${item.id}`} 
                                                            onClick={(e) => handleItemClick(item, e)}
                                                            className={`text-xs p-1.5 rounded cursor-pointer transition-all duration-200 flex items-center space-x-1.5 truncate text-white ${item.itemType === 'task' && item.status?.id === 4 ? 'opacity-60 line-through bg-gray-500' : 'bg-gradient-to-r from-blue-500 to-cyan-400'}`}
                                                        >
                                                            {item.itemType === 'task' && (
                                                                <input 
                                                                    type="checkbox" 
                                                                    checked={item.status?.id === 4}
                                                                    onChange={() => {}}
                                                                    onClick={(e) => { e.stopPropagation(); handleToggleTaskStatus(item.id); }}
                                                                    className="w-3 h-3 rounded-sm form-checkbox text-blue-300 bg-transparent border-white/50 focus:ring-0 focus:ring-offset-0"
                                                                />
                                                            )}
                                                            <span className="flex-1 truncate font-medium">{item.itemType === 'sprint' ? `SCRUM ${item.name}` : item.title}</span>
                                                            {isOverdue && <AlertCircle className="w-3 h-3 text-white flex-shrink-0" title="Overdue" />}
                                      _                 </div>
                                                    );
                                                })}
                                                {hiddenItemsCount > 0 && (
                                                    <button onClick={(e) => handleMoreClick(items, e)} className="text-xs font-bold text-orange-700 bg-orange-100 rounded-full w-5 h-5 flex items-center justify-center mt-1">
                                                        {hiddenItemsCount}
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {popover.type && (
                <div 
                    ref={popoverRef}
                    style={popover.style}
                    className="fixed z-40 bg-white rounded-lg shadow-2xl border border-gray-200 min-w-[250px]"
                >
                    {popover.type === 'sprint' && (
                        <SprintPopover 
            _               sprint={popover.data} 
                            onEdit={() => { setSprintToEdit(popover.data); setPopover({ type: null }); }}
                            onDelete={() => handleDeleteSprint(popover.data.id)}
                            onClose={() => setPopover({ type: null })}
                        />
                    )}
                    {popover.type === 'more' && (
                        <MoreItemsPopover 
                            items={popover.data}
                            onItemClick={handleItemClick}
                            onToggleTask={handleToggleTaskStatus}
                        />
                   )}
                </div>
            )}
            
            {showTaskModal && (
                 <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                     <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-auto">
                         <div className="p-4 border-b border-gray-200">
                             <div className="flex items-center justify-between">
                                 <div>
                                     <h3 className="text-lg font-semibold text-gray-900">Create New Item</h3>
                                     {modalSelectedDate && selectedTaskType !== 'Epic' && (<p className="text-sm text-gray-500 mt-1">{modalSelectedDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>)}
                                 </div>
                                 <button onClick={() => { setShowTaskModal(false); setTaskInput(''); setSelectedDate(null); setModalSelectedDate(null);}} className="text-gray-400 hover:text-gray-600 p-1 rounded-full">
                                     <X className="w-6 h-6 text-gray-700" />
                                 </button>
                             </div>
                         </div>
                         <div className="p-4">
                             <input
                                 type="text"
                                 placeholder="What needs to be done?"
                                 value={taskInput}
                                 onChange={(e) => setTaskInput(e.target.value)}
                                 className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4 bg-white"
                                 autoFocus
                             />
                            {selectedTaskType !== 'Epic' && (
                                 <div className="mb-4">
                                  <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                                  <input 
                                      type="date"
                                      value={modalSelectedDate ? formatDateForAPI(modalSelectedDate) : ''}
                                      onChange={(e) => {
                                          const [year, month, day] = e.target.value.split('-').map(Number);
                                          setModalSelectedDate(new Date(year, month - 1, day));
                                      }}
                                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                                  />
                                 </div>
                             )}
                            <div className="relative mb-4">
                                <button onClick={() => setShowTaskTypeMenu(!showTaskTypeMenu)} className="w-full flex justify-between items-center p-3 border border-gray-300 rounded-lg bg-white">
                                    <span className='flex items-center gap-2'>
                                        <span>{taskTypes.find(t => t.name === selectedTaskType)?.icon}</span>
                                        <span className="text-gray-800">{selectedTaskType}</span>
                                    </span>
                                    <ChevronDown className="w-4 h-4 text-gray-500" />
                                </button>
                                 {showTaskTypeMenu && (
                                     <div className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                                         <div className="p-2">
                                             {taskTypes.map(type => (
                                                 <button key={type.name} onClick={() => { setSelectedTaskType(type.name); setShowTaskTypeMenu(false); setSelectedParentTaskId(''); }} className="w-full text-left flex items-center gap-2 p-2 hover:bg-gray-50 rounded text-gray-700">
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
                                <label className="block text-sm font-medium text-gray-700 mb-1">Parent Task</label>
                                  <select value={selectedParentTaskId} onChange={(e) => setSelectedParentTaskId(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                                      <option value="">Select a parent...</option>
                                      {tasks.map(task => (
                                         <option key={task.id} value={task.id}>{task.title}</option>
                                      ))}
                                  </select>
                                 </div>
                             )}
                        </div>
                        <div className="p-4 border-t border-gray-200 flex justify-end">
                            <button onClick={handleCreateTask} disabled={!taskInput.trim()} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-300 font-medium">
                                Create
                            </button>
                        </div>
                 </div>
                </div>
            )}
            
            <ItemDetailModal
                item={selectedItem}
                users={usersWithUnassigned}
                sprintName={sprints.find(s => s.id === selectedItem?.sprint)?.name || 'Backlog'}
                onClose={() => setSelectedItemId(null)} 
                onUpdate={handleUpdateItemDB}
              
                onCreateSubtask={handleCreateSubtask} 
                 onFetchComments={handleFetchComments}
    onAddComment={handleAddComment}
    onUpdateComment={handleUpdateComment}
    onDeleteComment={handleDeleteComment}
    currentUserId={parseInt(localStorage.getItem("userId"), 10)}
            />

            <EditSprintModal
                sprint={sprintToEdit}
                epics={epics}
                onClose={() => setSprintToEdit(null)}
                onUpdate={handleUpdateSprint}
            />
        </div>
    );
}

// --- Popover components (Neutral styling, no changes needed) ---

const SprintPopover = ({ sprint, onEdit, onDelete, onClose }) => {
    const [menuOpen, setMenuOpen] = useState(false);

    const getStatus = () => {
        if (sprint.is_ended) return { text: 'COMPLETED', color: 'bg-green-100 text-green-800' };
        if (sprint.is_active) return { text: 'ACTIVE', color: 'bg-blue-100 text-blue-800' };
        return { text: 'FUTURE', color: 'bg-gray-100 text-gray-800' };
    };
    const status = getStatus();

    return (
        <div className="p-3 text-sm">
            <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-gray-500">SPRINT</span>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${status.color}`}>{status.text}</span>
                </div>
                <div className='flex items-center'>
                    <div className="relative">
                        <button onClick={() => setMenuOpen(!menuOpen)} className="p-1 rounded-full hover:bg-gray-200"><MoreHorizontal size={16}/></button>
                        {menuOpen && (
                            <div className="absolute right-0 mt-1 w-32 bg-white border rounded shadow-lg z-50">
                                <button onClick={onEdit} className="block w-full text-left px-3 py-1.5 hover:bg-gray-100 text-sm text-gray-700">Edit sprint</button>
                                <button onClick={onDelete} className="block w-full text-left px-3 py-1.5 hover:bg-gray-100 text-sm text-red-600">Delete sprint</button>
                            </div>
                        )}
                    </div>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200"><X size={16}/></button>
                </div>
            </div>
            <p className="font-bold text-gray-800 mb-3">SCRUM {sprint.name}</p>
            <div className="grid grid-cols-2 gap-4 text-xs text-gray-600">
                <div>
                    <p className="font-semibold mb-1">Start date</p>
                    <p>{new Date(sprint.start_date + 'T00:00:00').toLocaleDateString()}</p>
                </div>
                <div>
                    <p className="font-semibold mb-1">End date</p>
                    <p>{new Date(sprint.end_date + 'T00:00:00').toLocaleDateString()}</p>
                </div>
            </div>
        </div>
    );
};

const MoreItemsPopover = ({ items, onItemClick, onToggleTask }) => {
    const today = new Date();
    today.setHours(0,0,0,0);

    return (
        <div className="p-2 max-h-60 overflow-y-auto space-y-1">
             <h4 className="font-bold text-sm mb-2 px-2 text-gray-800">Items for this day</h4>
            {items.map(item => {
                const isOverdue = item.itemType === 'task' && item.due_date && new Date(item.due_date) < today && item.status?.id !== 4;
                return (
                    <div 
                        key={`${item.itemType}-${item.id}`} 
                        onClick={(e) => onItemClick(item, e)}
                        className={`text-xs p-2 rounded cursor-pointer transition-all duration-200 flex items-center space-x-2 truncate hover:brightness-110 ${item.itemType === 'task' && item.status?.id === 4 ? 'opacity-60 line-through bg-gray-500 text-white' : 'bg-gradient-to-r from-blue-500 to-cyan-400 text-white'}`}
                    >
                        {item.itemType === 'task' && (
                            <input 
                                type="checkbox" 
                                checked={item.status?.id === 4}
                                onChange={() => {}}
                                onClick={(e) => { e.stopPropagation(); onToggleTask(item.id); }}
                                className="w-3 h-3 rounded-sm form-checkbox text-blue-300 bg-transparent border-white/50 focus:ring-0 focus:ring-offset-0"
                            />
                        )}
                        <span className="flex-1 truncate font-medium">
                            {item.itemType === 'sprint' ? `SCRUM ${item.name}` : item.title}
                        </span>
                        {isOverdue && <AlertCircle className="w-3 h-3 text-white flex-shrink-0" title="Overdue" />}
                    </div>
                );
            })}
        </div>
    );
};