import React, { useState, useEffect, useRef } from 'react'
import { Search, Filter, ChevronDown, ChevronRight, Settings, Calendar, User, Target, Zap, BarChart3, Eye, EyeOff, Expand, Minimize, Plus, Loader2, Edit, Trash2, X } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext';

const List = () => {
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isGroupOpen, setIsGroupOpen] = useState(false);
    const [issettingsOpen, setIssettingsOpen] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [collapsedTasks, setCollapsedTasks] = useState({});
    const [creatingSubtaskFor, setCreatingSubtaskFor] = useState(null);
    const [subtaskTitle, setSubtaskTitle] = useState('');
    const [assigneeDropdown, setAssigneeDropdown] = useState(null);
    const [availableUsers, setAvailableUsers] = useState([]);
    const [groupBy, setGroupBy] = useState(null);
    const [hideDoneItems, setHideDoneItems] = useState(false);
    const [currentUserId, setCurrentUserId] = useState(null);
    const [taskComments, setTaskComments] = useState({});
    const [commentText, setCommentText] = useState('');
    const [editComments, setEditComments] = useState([]);
    const [loadingComments, setLoadingComments] = useState(false);
    const { theme, toggleTheme, colors, isDark } = useTheme();

    const filterButtonRef = useRef(null);
    const filterDropdownRef = useRef(null);
    const groupButtonRef = useRef(null);
    const groupDropdownRef = useRef(null);
    const settingsButtonRef = useRef(null);
    const settingsDropdownRef = useRef(null);

    const [selectedFilters, setSelectedFilters] = useState({
        assignedtome: false,
        duethisweek: false,
        doneitems: false,
    });

    const [newTask, setNewTask] = useState({
        title: '',
        status_id: 1,
        assignees: [],
        priority: 'MEDIUM',
        due_date: ''
    });

    const API_BASE_URL = 'http://127.0.0.1:8000/api';

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (isFilterOpen && filterButtonRef.current && !filterButtonRef.current.contains(event.target) && filterDropdownRef.current && !filterDropdownRef.current.contains(event.target)) {
                setIsFilterOpen(false);
            }
            if (isGroupOpen && groupButtonRef.current && !groupButtonRef.current.contains(event.target) && groupDropdownRef.current && !groupDropdownRef.current.contains(event.target)) {
                setIsGroupOpen(false);
            }
            if (issettingsOpen && settingsButtonRef.current && !settingsButtonRef.current.contains(event.target) && settingsDropdownRef.current && !settingsDropdownRef.current.contains(event.target)) {
                setIssettingsOpen(false);
            }
        };
        if (isFilterOpen || isGroupOpen || issettingsOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isFilterOpen, isGroupOpen, issettingsOpen]);

    useEffect(() => {
        fetchTasks();
        fetchUsers();
        fetchCurrentUser();
    }, []);

    useEffect(() => {
        if (tasks.length > 0) {
            tasks.forEach(task => {
                fetchCommentsForTask(task.id);
            });
        }
    }, [tasks.length]);

    const fetchCurrentUser = async () => {
        try {
            const authToken = localStorage.getItem('authToken');
            if (!authToken) return;
            const response = await fetch(`${API_BASE_URL}/admin/users/me/`, {
                headers: { 'Authorization': `Bearer ${authToken}` }
            });
            if (response.ok) {
                const data = await response.json();
                setCurrentUserId(data.id);
            }
        } catch (error) {
            console.error('Error fetching current user:', error);
        }
    };

    const fetchUsers = async () => {
        try {
            const authToken = localStorage.getItem('authToken');
            const projectId = localStorage.getItem("activeProjectId");
            if (!authToken) return;
            const response = await fetch(`${API_BASE_URL}/projects/${projectId}/members/`, {
                headers: { 'Authorization': `Bearer ${authToken}` }
            });
            if (response.ok) setAvailableUsers(await response.json());
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const fetchCommentsForTask = async (taskId) => {
        try {
            const authToken = localStorage.getItem('authToken');
            if (!authToken) return;
            const response = await fetch(`${API_BASE_URL}/tasks/${taskId}/comments/`, {
                headers: { 'Authorization': `Bearer ${authToken}` }
            });
            if (response.ok) {
                const comments = await response.json();
                setTaskComments(prev => ({ ...prev, [taskId]: comments }));
            }
        } catch (error) {
            console.error('Error fetching comments:', error);
        }
    };

    const fetchTasks = async () => {
        setLoading(true);
        setError(null);
        try {
            const authToken = localStorage.getItem('authToken');
            if (!authToken) {
                setError('Please login to view tasks');
                setLoading(false);
                return;
            }
            const response = await fetch(`${API_BASE_URL}/tasks/`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                }
            });
            if (response.status === 401) {
                setError('Session expired. Please login again');
                setLoading(false);
                return;
            }
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();
            setTasks(Array.isArray(data) ? data : []);
        } catch (error) {
            setError('Failed to fetch tasks. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const createTask = async () => {
        if (!newTask.title.trim()) {
            alert('Please enter a task title');
            return;
        }
        setLoading(true);
        try {
            const authToken = localStorage.getItem('authToken');
            if (!authToken) {
                setError('Please login to create tasks');
                setLoading(false);
                return;
            }
            const projectId = localStorage.getItem("activeProjectId");
            const taskData = {
                title: newTask.title,
                status_id: newTask.status_id,
                project: projectId,
                priority: newTask.priority,
                assignees: newTask.assignees
            };
            if (newTask.due_date) taskData.due_date = newTask.due_date;
            const response = await fetch(`${API_BASE_URL}/tasks/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                },
                body: JSON.stringify(taskData)
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Failed to create task');
            }
            const createdTask = await response.json();

            if (commentText.trim()) {
                await createCommentForTask(createdTask.id, commentText);
                setCommentText('');
            }

            await fetchTasks();
            setNewTask({ title: '', status_id: 1, assignees: [], priority: 'MEDIUM', due_date: '' });
            setIsCreateModalOpen(false);
        } catch (error) {
            setError(error.message || 'Failed to create task. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const createSubtask = async (parentTaskId) => {
        if (!subtaskTitle.trim()) {
            alert('Please enter a subtask title');
            return;
        }
        try {
            const authToken = localStorage.getItem('authToken');
            const parentTask = tasks.find(t => t.id === parentTaskId);
            const response = await fetch(`${API_BASE_URL}/tasks/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                },
                body: JSON.stringify({
                    title: subtaskTitle,
                    project: parentTask.project,
                    status_id: parentTask.status?.id || 1,
                    parent_task: parentTaskId,
                    assignees: [],
                    priority: 'MEDIUM'
                })
            });
            if (response.ok) {
                await fetchTasks();
                setCreatingSubtaskFor(null);
                setSubtaskTitle('');
                setCollapsedTasks(prev => ({ ...prev, [parentTaskId]: false }));
            }
        } catch (error) {
            console.error('Error creating subtask:', error);
        }
    };

    const createCommentForTask = async (taskId, commentBody) => {
        try {
            const authToken = localStorage.getItem('authToken');
            if (!authToken) return;
            const response = await fetch(`${API_BASE_URL}/tasks/${taskId}/comments/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                },
                body: JSON.stringify({ body: commentBody })
            });
            if (response.ok) {
                await fetchCommentsForTask(taskId);
            }
        } catch (error) {
            console.error('Error creating comment:', error);
        }
    };

    const deleteComment = async (taskId, commentId) => {
        if (!window.confirm('Are you sure you want to delete this comment?')) return;
        try {
            const authToken = localStorage.getItem('authToken');
            if (!authToken) return;
            const response = await fetch(`${API_BASE_URL}/tasks/${taskId}/comments/${commentId}/`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${authToken}` }
            });
            if (response.ok) {
                await fetchCommentsForTask(taskId);
                const updatedComments = editComments.filter(c => c.id !== commentId);
                setEditComments(updatedComments);
            }
        } catch (error) {
            console.error('Error deleting comment:', error);
        }
    };

    const updateTask = async () => {
        if (!editingTask || !editingTask.title.trim()) {
            alert('Please enter a task title');
            return;
        }
        setLoading(true);
        try {
            const authToken = localStorage.getItem('authToken');
            if (!authToken) {
                setError('Please login to update tasks');
                setLoading(false);
                return;
            }
            const response = await fetch(`${API_BASE_URL}/tasks/${editingTask.id}/`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                },
                body: JSON.stringify({
                    title: editingTask.title,
                    status_id: editingTask.status_id,
                    priority: editingTask.priority,
                    due_date: editingTask.due_date,
                    assignees: editingTask.assignees || []
                })
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Failed to update task');
            }
            await fetchTasks();
            setIsEditModalOpen(false);
            setEditingTask(null);
            setEditComments([]);
            setCommentText('');
        } catch (error) {
            setError(error.message || 'Failed to update task. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const assignUserToTask = async (taskId, userId) => {
        try {
            const authToken = localStorage.getItem('authToken');
            const response = await fetch(`${API_BASE_URL}/tasks/${taskId}/assignees/`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                },
                body: JSON.stringify({ assignees: userId ? [userId] : [] })
            });
            if (response.ok) {
                await fetchTasks();
                setAssigneeDropdown(null);
            }
        } catch (error) {
            console.error('Error assigning user:', error);
        }
    };

    const deleteTask = async (taskId) => {
        if (!window.confirm('Are you sure you want to delete this task?')) return;
        setLoading(true);
        try {
            const authToken = localStorage.getItem('authToken');
            if (!authToken) {
                setError('Please login to delete tasks');
                setLoading(false);
                return;
            }
            const response = await fetch(`${API_BASE_URL}/tasks/${taskId}/`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${authToken}` }
            });
            if (!response.ok) throw new Error('Failed to delete task');
            await fetchTasks();
        } catch (error) {
            setError('Failed to delete task. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleEditTask = async (task) => {
        setEditingTask({
            ...task,
            status_id: task.status?.id || task.status_id,
            assignees: task.assignees?.map(a => a.id) || [],
            priority: task.priority || 'MEDIUM',
            due_date: task.due_date || ''
        });
        setLoadingComments(true);
        setIsEditModalOpen(true);

        try {
            const authToken = localStorage.getItem('authToken');
            const response = await fetch(`${API_BASE_URL}/tasks/${task.id}/comments/`, {
                headers: { 'Authorization': `Bearer ${authToken}` }
            });
            if (response.ok) {
                const comments = await response.json();
                setEditComments(comments);
            }
        } catch (error) {
            console.error('Error fetching comments:', error);
        } finally {
            setLoadingComments(false);
        }
    };

    const toggleCollapse = (taskId) => {
        setCollapsedTasks(prev => ({ ...prev, [taskId]: !prev[taskId] }));
    };

    const handleExpandAll = () => setCollapsedTasks({});

    const handleCollapseAll = () => {
        const allCollapsed = {};
        tasks.filter(t => !t.parent_task).forEach(task => { allCollapsed[task.id] = true; });
        setCollapsedTasks(allCollapsed);
    };

    const getStatusBadge = (status) => {
        const statusTitle = status?.title || 'Unknown';
        
        // Use theme-aware colors. These are just examples; adjust as needed.
        if (isDark) {
            const statusMap = {
                'To Do': 'bg-gray-700 text-gray-200',
                'In Progress': 'bg-blue-800 text-blue-100',
                'In Review': 'bg-purple-800 text-purple-100',
                'Done': 'bg-green-800 text-green-100',
                'Testing': 'bg-yellow-800 text-yellow-100',
            };
            return statusMap[statusTitle] || 'bg-gray-700 text-gray-200';
        }

        // Light mode (original)
        const statusMap = {
            'To Do': 'bg-gray-200 text-gray-700',
            'In Progress': 'bg-blue-100 text-blue-800',
            'In Review': 'bg-purple-100 text-purple-800',
            'Done': 'bg-green-100 text-green-800',
            'Testing': 'bg-yellow-100 text-yellow-800',
        };
        return statusMap[statusTitle] || 'bg-gray-100 text-gray-800';
    };

    const getPriorityBadge = (priority) => {
        const lightModeMap = {
            'HIGHEST': { class: 'bg-red-100 text-red-900', icon: '⇈' },
            'HIGH': { class: 'bg-red-100 text-red-700', icon: '↑' },
            'MEDIUM': { class: 'bg-yellow-100 text-yellow-800', icon: '=' },
            'LOW': { class: 'bg-green-100 text-green-700', icon: '↓' },
            'LOWEST': { class: 'bg-green-100 text-green-900', icon: '⇊' },
        };
        
        const darkModeMap = {
            'HIGHEST': { class: 'bg-red-800 text-red-100', icon: '⇈' },
            'HIGH': { class: 'bg-red-700 text-red-100', icon: '↑' },
            'MEDIUM': { class: 'bg-yellow-700 text-yellow-100', icon: '=' },
            'LOW': { class: 'bg-green-700 text-green-100', icon: '↓' },
            'LOWEST': { class: 'bg-green-800 text-green-100', icon: '⇊' },
        };

        const map = isDark ? darkModeMap : lightModeMap;
        return map[priority] || map['MEDIUM'];
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'No due date';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    };

    const activeProjectId = localStorage.getItem("activeProjectId");
    const filteredTasksProject = tasks.filter((task) => task.project == activeProjectId);

    const filteredTasks = filteredTasksProject.filter(task => {
        const searchLower = searchQuery.toLowerCase();
        const matchesSearch = (
            task.title?.toLowerCase().includes(searchLower) ||
            task.description?.toLowerCase().includes(searchLower) ||
            task.status?.title?.toLowerCase().includes(searchLower)
        );
        if (!matchesSearch) return false;
        if (selectedFilters.assignedtome && currentUserId) {
            const isAssignedToMe = task.assignees?.some(a => a.user?.id === currentUserId);
            if (!isAssignedToMe) return false;
        }
        if (selectedFilters.duethisweek) {
            if (!task.due_date) return false;
            const dueDate = new Date(task.due_date);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
            if (dueDate < today || dueDate > nextWeek) return false;
        }
        if (selectedFilters.doneitems && task.status?.title !== 'Done') return false;
        if (hideDoneItems && task.status?.title === 'Done') return false;
        return true;
    });

    const parentTasks = filteredTasks.filter(task => !task.parent_task);
    const getSubtasks = (parentId) => filteredTasks.filter(task => task.parent_task === parentId);

    const getGroupedTasks = () => {
        if (!groupBy) return { 'All Tasks': parentTasks };
        const grouped = {};
        parentTasks.forEach(task => {
            let groupKey;
            switch (groupBy) {
                case 'status':
                    groupKey = task.status?.title || 'Unknown';
                    break;
                case 'assignee':
                    groupKey = task.assignees?.length > 0 ? task.assignees[0].user?.email || 'Unassigned' : 'Unassigned';
                    break;
                case 'priority':
                    groupKey = task.priority || 'MEDIUM';
                    break;
                case 'sprint':
                    groupKey = 'Current Sprint';
                    break;
                case 'storypoint':
                    groupKey = task.story_points || 'No Estimate';
                    break;
                default:
                    groupKey = 'All Tasks';
            }
            if (!grouped[groupKey]) grouped[groupKey] = [];
            grouped[groupKey].push(task);
        });
        return grouped;
    };

    const groupedTasks = getGroupedTasks();

    const quickFilters = [
        { key: 'assignedtome', label: 'Assigned to me', icon: User },
        { key: 'duethisweek', label: 'Due this week', icon: Calendar },
        { key: 'doneitems', label: 'Done items', icon: Eye },
    ];

    const groupOptions = [
        { key: 'status', label: 'Status', icon: Target },
        { key: 'assignee', label: 'Assignee', icon: User },
        { key: 'priority', label: 'Priority', icon: Zap },
        { key: 'sprint', label: 'Sprint', icon: Target },
        { key: 'storypoint', label: 'Story point estimate', icon: BarChart3 },
    ];

    const settingsOptions = [
        { key: 'hidedone', label: 'Hide done items', icon: EyeOff, toggle: true },
        { key: 'expandall', label: 'Expand all items', icon: Expand },
        { key: 'collapseall', label: 'Collapse all items', icon: Minimize },
    ];

    const renderTaskRow = (task, isSubtask = false) => {
        const priorityInfo = getPriorityBadge(task.priority);
        const subtasks = getSubtasks(task.id);
        const hasSubtasks = subtasks.length > 0;
        const isCollapsed = collapsedTasks[task.id];
        const showCreateSubtask = creatingSubtaskFor === task.id;

        return (
            <React.Fragment key={task.id}>
                <div className="grid text-sm hover:bg-purple-50 border-b border-purple-100" style={{ gridTemplateColumns: '80px 350px 120px 130px 110px 130px 180px 100px', minWidth: '1200px' }}>
                    <div className="border-r border-purple-200 px-2 py-3 flex items-center justify-center gap-1">
                        {!isSubtask && (
                            <button onClick={() => toggleCollapse(task.id)} className="text-gray-500 hover:text-gray-700 p-1 hover:bg-gray-100 rounded transition-colors">
                                {hasSubtasks ? (isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />) : <span className="w-4 h-4 inline-block"></span>}
                            </button>
                        )}
                        {isSubtask && (
                            <div className="flex items-center">
                                <span className="w-4 h-4 inline-block"></span>
                                <svg className="w-4 h-4 text-gray-400 ml-1" viewBox="0 0 16 16">
                                    <path fill="currentColor" d="M3 2v10h2V4h8V2H3z" />
                                </svg>
                            </div>
                        )}
                        <div className="w-4 h-4 border-2 border-blue-600 rounded flex items-center justify-center bg-white cursor-pointer hover:bg-blue-50 transition-colors">
                            <svg className="w-3 h-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        {!isSubtask && (
                            <button onClick={() => setCreatingSubtaskFor(showCreateSubtask ? null : task.id)} className="text-purple-600 hover:text-purple-800 hover:bg-purple-100 rounded p-1 transition-colors" title="Create child work item">
                                {showCreateSubtask ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                            </button>
                        )}
                    </div>
                    <div className="border-r border-purple-200 px-3 py-3 flex items-center">
                        <span className={`truncate ${isSubtask ? 'ml-8' : 'font-medium'}`}>{task.title}</span>
                    </div>
                    <div className="border-r border-purple-200 px-3 py-3 flex items-center justify-center">
                        <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(task.status)}`}>
                            {task.status?.title || 'Unknown'}
                        </span>
                    </div>
                    <div className="border-r border-purple-200 px-3 py-3 flex items-center justify-center text-gray-600" style={{ color: colors.text }}>
                        <Calendar className="w-4 h-4 mr-1" />
                        <span className="text-xs">{formatDate(task.due_date)}</span>
                    </div>
                    <div className="border-r border-purple-200 px-3 py-3 flex items-center justify-center">
                        <span className={`inline-flex px-2 py-1 rounded text-xs font-medium items-center gap-1 ${priorityInfo.class}`}>
                            <span>{priorityInfo.icon}</span>
                            {task.priority}
                        </span>
                    </div>
                    <div className="border-r border-purple-200 px-3 py-3 flex items-center justify-center relative">
                        {task.assignees?.length > 0 ? (
                            <button onClick={() => setAssigneeDropdown(assigneeDropdown === task.id ? null : task.id)} className="flex items-center gap-1 hover:bg-purple-100 px-2 py-1 rounded transition-colors">
                                <div className="w-7 h-7 rounded-full bg-purple-500 text-white text-xs flex items-center justify-center font-medium">
                                    {task.assignees[0].user?.email?.charAt(0).toUpperCase() || 'U'}
                                </div>
                            </button>
                        ) : (
                            <button onClick={() => setAssigneeDropdown(assigneeDropdown === task.id ? null : task.id)} className="text-xs text-gray-400 hover:bg-purple-100 px-3 py-1 rounded flex items-center gap-1 transition-colors">
                                <User className="w-4 h-4" />
                                Unassigned
                            </button>
                        )}
                        {assigneeDropdown === task.id && (
                            <div className="absolute top-full left-0 mt-1 bg-white shadow-lg border border-purple-200 rounded-lg z-50 w-56" style={{ color: colors.text }}>
                                <div className="p-2 max-h-48 overflow-y-auto" style={{ color: colors.text }}>
                                    <div onClick={() => assignUserToTask(task.id, null)} className="px-3 py-2 hover:bg-purple-50 rounded cursor-pointer text-sm transition-colors">
                                        Unassigned
                                    </div>
                                    {availableUsers.map(member => (
                                        <div key={member.id} onClick={() => assignUserToTask(task.id, member.id)} className="px-3 py-2 hover:bg-purple-50 rounded cursor-pointer text-sm flex items-center gap-2 transition-colors">
                                            <div className="w-6 h-6 rounded-full bg-purple-500 text-white text-xs flex items-center justify-center">
                                                {member.user.email?.charAt(0).toUpperCase()}
                                            </div>
                                            {member.user.email}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="border-r border-purple-200 px-3 py-3 flex items-center">
                        {taskComments[task.id] && taskComments[task.id].length > 0 ? (
                            <div className="flex items-center w-full">
                                <svg className="w-4 h-4 text-purple-600 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z" clipRule="evenodd" />
                                </svg>
                                <span className="text-xs text-purple-700 font-medium">{taskComments[task.id].length} comment{taskComments[task.id].length !== 1 ? 's' : ''}</span>
                            </div>
                        ) : (
                            <div className="flex items-center w-full text-gray-400">
                                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z" clipRule="evenodd" />
                                </svg>
                                <span className="text-xs">No comments</span>
                            </div>
                        )}
                    </div>
                    <div className="px-3 py-3 flex items-center justify-center gap-2">
                        <button onClick={() => handleEditTask(task)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors" title="Edit task">
                            <Edit className="w-4 h-4" />
                        </button>
                        <button onClick={() => deleteTask(task.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors" title="Delete task">
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {showCreateSubtask && (
                    <div className="grid text-sm bg-purple-50 border-b border-purple-200" style={{ gridTemplateColumns: '80px 350px 120px 130px 180px 100px', minWidth: '1200px' }}>
                        <div className="border-r border-purple-200 px-2 py-3 flex items-center justify-center">
                            <div className="flex items-center gap-1">
                                <span className="w-4 h-4 inline-block"></span>
                                <svg className="w-4 h-4 text-gray-400 ml-1" viewBox="0 0 16 16">
                                    <path fill="currentColor" d="M3 2v10h2V4h8V2H3z" />
                                </svg>
                                <Plus className="w-4 h-4 text-purple-600" />
                            </div>
                        </div>
                        <div className="border-r border-purple-200 px-3 py-3 flex items-center gap-2">
                            <input
                                type="text"
                                value={subtaskTitle}
                                onChange={(e) => setSubtaskTitle(e.target.value)}
                                placeholder="What needs to be done?"
                                className="flex-1 ml-8 px-3 py-1.5 border border-purple-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                                autoFocus
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && subtaskTitle.trim()) createSubtask(task.id);
                                    if (e.key === 'Escape') {
                                        setCreatingSubtaskFor(null);
                                        setSubtaskTitle('');
                                    }
                                }}
                            />
                            <button onClick={() => createSubtask(task.id)} disabled={!subtaskTitle.trim()} className="px-3 py-1.5 bg-purple-600 text-white rounded text-xs hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                                Create
                            </button>
                            <button onClick={() => { setCreatingSubtaskFor(null); setSubtaskTitle(''); }} className="text-gray-500 hover:text-gray-700 p-1 hover:bg-gray-100 rounded transition-colors" title="Cancel">
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                        {[...Array(6)].map((_, i) => <div key={i} className="border-r border-purple-200"></div>)}
                    </div>
                )}

                {!isCollapsed && hasSubtasks && subtasks.map(subtask => renderTaskRow(subtask, true))}
            </React.Fragment>
        );
    };

    return (
        <div className="min-h-screen bg-purple-200 py-4 px-4"
        style={{
            backgroundColor: colors.background,
            color: colors.text,
            borderColor: colors.border,
        }}>

            <div className="w-full max-w-7xl mx-auto">
                {error && (
                    <div className="mb-4 p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded">
                        <p className="font-bold">Error</p>
                        <p>{error}</p>
                    </div>
                )}

                <div className="flex items-center gap-2 mb-4 p-2">

                    <div className="relative"
                    style={{
                        backgroundColor: colors.background,
                        color: colors.text,
                        borderColor: colors.border,
                    }}>
                        <button
                            ref={filterButtonRef}
                            className="flex items-center gap-2 px-4 py-2 border border-gray-400 rounded-md text-sm hover:bg-gray-400"
                            onClick={() => setIsFilterOpen(!isFilterOpen)}
                        >
                            <Filter className="w-4 h-4" />
                            Filter
                            <ChevronDown className={`w-4 h-4 transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {isFilterOpen && (
                            <div ref={filterDropdownRef} className="absolute top-full left-0 mt-2 w-80 bg-purple-50 rounded-lg shadow-lg border border-gray-200 z-10">
                                <div className="p-4">
                                    <h3 className="text-sm font-medium text-gray-700 mb-3">FILTERS</h3>
                                    <div className="space-y-2 mb-4">
                                        {quickFilters.map((filter) => {
                                            const IconComponent = filter.icon;
                                            return (
                                                <label key={filter.key} className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedFilters[filter.key]}
                                                        onChange={(e) => {
                                                            setSelectedFilters({
                                                                ...selectedFilters,
                                                                [filter.key]: e.target.checked
                                                            });
                                                        }}
                                                        className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                                                    />
                                                    <IconComponent className="w-4 h-4 text-gray-500" />
                                                    <span className="text-sm text-gray-700">{filter.label}</span>
                                                </label>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="relative w-170 pl-50">
                        <Search className="w-4 h-4 absolute left-53 top-3 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search list"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-8 pr-4 py-2 border border-gray-400 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
                        />
                    </div>

                    <div className="relative ml-auto">
                        <button
                            ref={groupButtonRef}
                            className="flex items-center gap-2 px-4 py-2 border border-gray-400 rounded-md text-sm hover:bg-gray-400"
                            onClick={() => setIsGroupOpen(!isGroupOpen)}
                        >
                            Group
                            <ChevronDown className={`w-4 h-4 transition-transform ${isGroupOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {isGroupOpen && (
                            <div ref={groupDropdownRef} className="absolute top-full right-0 mt-2 w-56 bg-purple-50 rounded-lg shadow-lg border border-gray-200 z-10">
                                <div className="p-2">
                                    <div className="text-xs text-gray-500 px-2 py-1 mb-1">Group by</div>
                                    <button
                                        onClick={() => {
                                            setGroupBy(null);
                                            setIsGroupOpen(false);
                                        }}
                                        className={`w-full flex items-center gap-3 px-2 py-2 text-sm hover:bg-gray-100 rounded ${!groupBy ? 'bg-purple-100' : ''}`}
                                    >
                                        None
                                    </button>
                                    {groupOptions.map((option) => {
                                        const IconComponent = option.icon;
                                        return (
                                            <button
                                                key={option.key}
                                                onClick={() => {
                                                    setGroupBy(option.key);
                                                    setIsGroupOpen(false);
                                                }}
                                                className={`w-full flex items-center gap-3 px-2 py-2 text-sm hover:bg-gray-100 rounded ${groupBy === option.key ? 'bg-purple-100' : ''}`}
                                            >
                                                <IconComponent className="w-4 h-4 text-gray-500" />
                                                {option.label}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="relative">
                        <button
                            ref={settingsButtonRef}
                            className="p-2 border border-gray-400 rounded-md hover:bg-gray-400"
                            onClick={() => setIssettingsOpen(!issettingsOpen)}
                        >
                            <Settings className="w-5 h-5" />
                        </button>

                        {issettingsOpen && (
                            <div ref={settingsDropdownRef} className="absolute top-full right-0 mt-2 w-56 bg-purple-50 rounded-lg shadow-lg border border-gray-200 z-10">
                                <div className="p-2">
                                    {settingsOptions.map((option) => {
                                        const IconComponent = option.icon;
                                        if (option.key === 'hidedone') {
                                            return (
                                                <button
                                                    key={option.key}
                                                    onClick={() => setHideDoneItems(!hideDoneItems)}
                                                    className="w-full flex items-center justify-between px-2 py-2 text-sm hover:bg-gray-100 rounded"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <IconComponent className="w-4 h-4 text-gray-500" />
                                                        {option.label}
                                                    </div>
                                                    <div className={`w-8 h-4 rounded-full relative transition-colors ${hideDoneItems ? 'bg-purple-600' : 'bg-gray-300'}`}>
                                                        <div className={`w-3 h-3 bg-white rounded-full absolute top-0.5 transition-transform ${hideDoneItems ? 'left-4' : 'left-0.5'}`}></div>
                                                    </div>
                                                </button>
                                            );
                                        } else if (option.key === 'expandall') {
                                            return (
                                                <button
                                                    key={option.key}
                                                    onClick={() => {
                                                        handleExpandAll();
                                                        setIssettingsOpen(false);
                                                    }}
                                                    className="w-full flex items-center justify-between px-2 py-2 text-sm hover:bg-gray-100 rounded"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <IconComponent className="w-4 h-4 text-gray-500" />
                                                        {option.label}
                                                    </div>
                                                </button>
                                            );
                                        } else if (option.key === 'collapseall') {
                                            return (
                                                <button
                                                    key={option.key}
                                                    onClick={() => {
                                                        handleCollapseAll();
                                                        setIssettingsOpen(false);
                                                    }}
                                                    className="w-full flex items-center justify-between px-2 py-2 text-sm hover:bg-gray-100 rounded"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <IconComponent className="w-4 h-4 text-gray-500" />
                                                        {option.label}
                                                    </div>
                                                </button>
                                            );
                                        }
                                        return null;
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {loading && (
                    <div className="flex justify-center items-center py-16">
                        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
                        <span className="ml-3 text-purple-700">Loading tasks...</span>
                    </div>
                )}

                {!loading && (
                    <div className="rounded-lg shadow-sm border overflow-hidden"
                    style={{
                        backgroundColor: colors.background,
                        color: colors.text,
                        borderColor: colors.border,
                    }}>
                        <div className="table-scroll overflow-x-auto">
                            {Object.entries(groupedTasks).map(([groupName, groupTasks]) => (
                                <div key={groupName}>
                                    {groupBy && (
                                        <div className="bg-purple-100 px-4 py-2 font-semibold text-gray-700 border-b border-gray-200">
                                            {groupName} ({groupTasks.length})
                                        </div>
                                    )}

                                    <div className="grid text-sm font-medium" style={{ gridTemplateColumns: '80px 350px 120px 130px 110px 130px 180px 100px', minWidth: '1200px' }}>
                                        <div className="border-b border-r border-gray-300 px-3 py-3 text-center" style={{ color: colors.text }}>Task Type</div>
                                        <div className="border-b border-r border-gray-300 px-3 py-3" style={{ color: colors.text }}>Summary</div>
                                        <div className="border-b border-r border-gray-300 px-3 py-3 text-center" style={{ color: colors.text }}>Status</div>
                                        <div className="border-b border-r border-gray-300 px-3 py-3 text-center" style={{ color: colors.text }}>Due Date</div>
                                        <div className="border-b border-r border-gray-300 px-3 py-3 text-center" style={{ color: colors.text }}>Priority</div>
                                        <div className="border-b border-r border-gray-300 px-3 py-3 text-center" style={{ color: colors.text }}>Assignee</div>
                                        <div className="border-b border-r border-gray-300 px-3 py-3 text-center" style={{ color: colors.text }}>Comments</div>
                                        <div className="border-b border-gray-300 px-3 py-3 text-center" style={{ color: colors.text }}>Actions</div>
                                    </div>

                                    <div>
                                        {groupTasks.length === 0 ? (
                                            <div className="text-center py-12 text-gray-500" style={{ minWidth: '1200px' }}>
                                                <p className="text-lg mb-2" style={{ color: colors.text }}>No tasks found</p>
                                                <p className="text-sm" style={{ color: colors.text }}>Create your first task to get started</p>
                                            </div>
                                        ) : (
                                            groupTasks.map(task => renderTaskRow(task))
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="p-2 border-t border-blue-200 bg-blue-100">
                            <button
                                onClick={() => setIsCreateModalOpen(true)}
                                className="flex items-center text-gray-500 hover:text-gray-800 text-sm font-medium"
                            >
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                                </svg>
                                Create
                            </button>
                        </div>
                    </div>
                )}

                {isCreateModalOpen && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => setIsCreateModalOpen(false)}>
                        <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Create New Task</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Task Title *</label>
                                    <input
                                        type="text"
                                        value={newTask.title}
                                        onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                                        placeholder="Enter task title"
                                        className="w-full px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                                    <select
                                        value={newTask.status_id}
                                        onChange={(e) => setNewTask({ ...newTask, status_id: parseInt(e.target.value) })}
                                        className="w-full px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    >
                                        <option value={1}>To Do</option>
                                        <option value={2}>In Progress</option>
                                        <option value={3}>In Review</option>
                                        <option value={4}>Done</option>
                                        <option value={5}>Testing</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                                    <select
                                        value={newTask.priority}
                                        onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                                        className="w-full px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    >
                                        <option value="LOWEST">Lowest</option>
                                        <option value="LOW">Low</option>
                                        <option value="MEDIUM">Medium</option>
                                        <option value="HIGH">High</option>
                                        <option value="HIGHEST">Highest</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
                                    <input
                                        type="date"
                                        value={newTask.due_date}
                                        onChange={(e) => setNewTask({ ...newTask, due_date: e.target.value })}
                                        className="w-full px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Assignee</label>
                                    <select
                                        value={newTask.assignees?.[0] || ''}
                                        onChange={(e) => {
                                            const userId = e.target.value;
                                            setNewTask({
                                                ...newTask,
                                                assignees: userId ? [parseInt(userId)] : []
                                            });
                                        }}
                                        className="w-full px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" style={{ color: colors.text }}
                                    >
                                        <option value="">Unassigned</option>
                                        {availableUsers.map(member => (
                                            <option key={member.id} value={member.id}>{member.user.email}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Comment</label>
                                    <textarea
                                        value={commentText}
                                        onChange={(e) => setCommentText(e.target.value)}
                                        placeholder="Add a comment..."
                                        rows={3}
                                        className="w-full px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                                    />
                                </div>
                                <div className="flex gap-3 pt-4">
                                    <button onClick={() => setIsCreateModalOpen(false)} className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                                        Cancel
                                    </button>
                                    <button onClick={createTask} disabled={loading} className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 flex items-center justify-center">
                                        {loading ? (
                                            <>
                                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                Creating...
                                            </>
                                        ) : (
                                            'Create Task'
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {isEditModalOpen && editingTask && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => setIsEditModalOpen(false)}>
                        <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Edit Task</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Summary *</label>
                                    <input
                                        type="text"
                                        value={editingTask.title}
                                        onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
                                        placeholder="Enter task title"
                                        className="w-full px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                                    <select
                                        value={editingTask.status_id}
                                        onChange={(e) => setEditingTask({ ...editingTask, status_id: parseInt(e.target.value) })}
                                        className="w-full px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    >
                                        <option value={1}>To Do</option>
                                        <option value={2}>In Progress</option>
                                        <option value={3}>In Review</option>
                                        <option value={4}>Done</option>
                                        <option value={5}>Testing</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                                    <select
                                        value={editingTask.priority}
                                        onChange={(e) => setEditingTask({ ...editingTask, priority: e.target.value })}
                                        className="w-full px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    >
                                        <option value="LOWEST">Lowest</option>
                                        <option value="LOW">Low</option>
                                        <option value="MEDIUM">Medium</option>
                                        <option value="HIGH">High</option>
                                        <option value="HIGHEST">Highest</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
                                    <input
                                        type="date"
                                        value={editingTask.due_date || ''}
                                        onChange={(e) => setEditingTask({ ...editingTask, due_date: e.target.value })}
                                        className="w-full px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Assignee</label>
                                    <select
                                        value={editingTask.assignees?.[0] || ''}
                                        onChange={(e) => {
                                            const userId = e.target.value;
                                            setEditingTask({
                                                ...editingTask,
                                                assignees: userId ? [parseInt(userId)] : []
                                            });
                                        }}
                                        className="w-full px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    >
                                        <option value="">Unassigned</option>
                                        {availableUsers.map(member => (
                                            <option key={member.id} value={member.id}>{member.user.email}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="border-t border-gray-200 pt-4 mt-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                        <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z" clipRule="evenodd" />
                                        </svg>
                                        Comments ({editComments.length})
                                    </h3>

                                    {loadingComments ? (
                                        <div className="flex justify-center py-4">
                                            <Loader2 className="w-6 h-6 animate-spin text-purple-600" />
                                        </div>
                                    ) : (
                                        <div className="space-y-3 max-h-60 overflow-y-auto mb-4">
                                            {editComments.length === 0 ? (
                                                <p className="text-sm text-gray-500 text-center py-4" style={{ color: colors.text }}>No comments yet</p>
                                            ) : (
                                                editComments.map((comment) => (
                                                    <div key={comment.id} className="bg-purple-50 rounded-lg p-3 border border-purple-200">
                                                        <div className="flex items-start justify-between gap-2">
                                                            <div className="flex-1">
                                                                <div className="flex items-center gap-2 mb-1">
                                                                    <div className="w-6 h-6 rounded-full bg-purple-500 text-white text-xs flex items-center justify-center">
                                                                        {comment.author?.user?.email?.charAt(0).toUpperCase() || 'U'}
                                                                    </div>
                                                                    <span className="text-xs font-medium text-gray-700" style={{ color: colors.text }}>
                                                                        {comment.author?.user?.email || 'Unknown User'}
                                                                    </span>
                                                                    <span className="text-xs text-gray-500">
                                                                        {new Date(comment.created_at).toLocaleDateString('en-GB', {
                                                                            day: 'numeric',
                                                                            month: 'short',
                                                                            hour: '2-digit',
                                                                            minute: '2-digit'
                                                                        })}
                                                                    </span>
                                                                </div>
                                                                <p className="text-sm text-gray-800 mt-1">{comment.body}</p>
                                                            </div>
                                                            <button
                                                                onClick={() => deleteComment(editingTask.id, comment.id)}
                                                                className="text-red-600 hover:bg-red-50 p-1 rounded transition-colors flex-shrink-0"
                                                                title="Delete comment"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    )}

                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">Add New Comment</label>
                                        <div className="flex gap-2">
                                            <textarea
                                                value={commentText}
                                                onChange={(e) => setCommentText(e.target.value)}
                                                placeholder="Write a comment..."
                                                rows={2}
                                                className="flex-1 px-3 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none text-sm"
                                            />
                                            <button
                                                onClick={async () => {
                                                    if (commentText.trim()) {
                                                        await createCommentForTask(editingTask.id, commentText);
                                                        setCommentText('');
                                                        const authToken = localStorage.getItem('authToken');
                                                        const response = await fetch(`${API_BASE_URL}/tasks/${editingTask.id}/comments/`, {
                                                            headers: { 'Authorization': `Bearer ${authToken}` }
                                                        });
                                                        if (response.ok) {
                                                            const comments = await response.json();
                                                            setEditComments(comments);
                                                        }
                                                    }
                                                }}
                                                disabled={!commentText.trim()}
                                                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                                            >
                                                Add
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <button
                                        onClick={() => {
                                            setIsEditModalOpen(false);
                                            setEditingTask(null);
                                            setEditComments([]);
                                            setCommentText('');
                                        }}
                                        className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button onClick={updateTask} disabled={loading} className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 flex items-center justify-center">
                                        {loading ? (
                                            <>
                                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                Updating...
                                            </>
                                        ) : (
                                            'Update Task'
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default List