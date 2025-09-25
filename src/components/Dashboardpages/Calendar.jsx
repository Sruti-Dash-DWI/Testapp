import { useState } from 'react';
import { ChevronLeft, ChevronRight, Search, Calendar, MoreHorizontal, Plus, ChevronDown, X, Check } from 'lucide-react';

export default function CalendarUI() {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 8, 1)); // September 2025
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [taskInput, setTaskInput] = useState('');
  const [selectedTaskType, setSelectedTaskType] = useState('Task');
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showAssigneeDropdown, setShowAssigneeDropdown] = useState(false);
  const [showMoreFiltersDropdown, setShowMoreFiltersDropdown] = useState(false);
  const [showTaskTypeMenu, setShowTaskTypeMenu] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [tasks, setTasks] = useState([]);

  const monthNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const taskTypes = [
    { id: 'epic', name: 'Epic', icon: '✨', color: 'purple' },
    { id: 'subtask', name: 'Subtask', icon: '🔗', color: 'blue' },
    { id: 'task', name: 'Task', icon: '✓', color: 'blue' }
  ];

  const statusOptions = [
    { id: 'done', name: 'DONE', color: 'green' },
    { id: 'in-progress', name: 'IN PROGRESS', color: 'blue' },
    { id: 'todo', name: 'TO DO', color: 'gray' }
  ];

  // Get calendar data
  const getCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDay = new Date(year, month, 1);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - (firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1));

    const days = [];
    const currentDay = new Date(startDate);

    // Generate 6 weeks of days (to handle long months)
    for (let week = 0; week < 6; week++) {
      const weekDaysArr = [];
      for (let day = 0; day < 7; day++) {
        const isCurrentMonth = currentDay.getMonth() === month;
        const dayNumber = currentDay.getDate();
        const isWeekend = day === 5 || day === 6; // Saturday or Sunday

        weekDaysArr.push({
          date: dayNumber,
          isCurrentMonth,
          isWeekend,
          fullDate: new Date(currentDay)
        });

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

  const handleDayClick = (day) => {
    if (day.isCurrentMonth) {
      setSelectedDate(day.fullDate);
      setShowTaskModal(true);
    }
  };

  const handleCreateTask = () => {
    if (taskInput.trim()) {
      const newTask = {
        id: Date.now(),
        title: taskInput,
        type: selectedTaskType,
        date: selectedDate || new Date(),
        status: 'TO DO',
        completed: false
      };
      
      setTasks(prevTasks => [...prevTasks, newTask]);
      setTaskInput('');
      setShowTaskModal(false);
      setSelectedTaskType('Task');
      setSelectedDate(null);
    }
  };

  // Get tasks for a specific date
  const getTasksForDate = (date) => {
    return tasks.filter(task => {
      const taskDate = new Date(task.date);
      return taskDate.toDateString() === date.toDateString();
    });
  };

  // Toggle task completion
  const toggleTaskCompletion = (taskId) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const closeAllDropdowns = () => {
    setShowTypeDropdown(false);
    setShowStatusDropdown(false);
    setShowAssigneeDropdown(false);
    setShowMoreFiltersDropdown(false);
    setShowTaskTypeMenu(false);
  };

  // Dropdown component
  const Dropdown = ({ children, className = "" }) => (
    <div className={`relative ${className}`}>
      {children}
    </div>
  );

  return (
    <div className="bg-gradient-to-br from-purple-50 via-white to-purple-100 min-h-screen">
      {/* Backdrop for closing dropdowns */}
      {(showTypeDropdown || showStatusDropdown || showAssigneeDropdown || showMoreFiltersDropdown) && (
        <div
          className="fixed inset-0 z-10"
          onClick={closeAllDropdowns}
        />
      )}

      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-purple-100 bg-white/95 backdrop-blur-sm relative z-20">
        {/* Left side - Search and Filters */}
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
            <input
              type="text"
              placeholder="Search calendar"
              className="pl-10 pr-4 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64 bg-white"
            />
          </div>

          <div className="flex items-center space-x-2">
            {/* Assignee Dropdown */}
            <Dropdown>
              <button
                onClick={() => {
                  closeAllDropdowns();
                  setShowAssigneeDropdown(!showAssigneeDropdown);
                }}
                className="flex items-center px-3 py-2 border border-pink-300 rounded-lg hover:bg-gradient-to-r hover:from-pink-100 hover:to-rose-100 transition-all duration-300 bg-gradient-to-r from-white/90 to-pink-50/90 backdrop-blur-sm shadow-sm text-pink-600"
              >
                Assignee
                <ChevronDown className="ml-1 w-4 h-4" />
              </button>
              {showAssigneeDropdown && (
                <div className="absolute top-full left-0 mt-1 w-48 bg-white/95 backdrop-blur-sm border border-purple-200 rounded-lg shadow-lg z-30">
                  <div className="p-3">
                    <div className="relative mb-2">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400 w-4 h-4" />
                      <input
                        type="text"
                        placeholder="Search Assignee"
                        className="pl-9 pr-3 py-2 w-full border border-purple-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    <div className="text-xs text-purple-500">No assignees found</div>
                  </div>
                </div>
              )}
            </Dropdown>

            {/* Type Dropdown */}
            <Dropdown>
              <button
                onClick={() => {
                  closeAllDropdowns();
                  setShowTypeDropdown(!showTypeDropdown);
                }}
                className="flex items-center px-3 py-2 border border-blue-200 rounded-lg hover:bg-gradient-to-r hover:from-blue-100 hover:to-cyan-100 transition-all duration-300 bg-gradient-to-r from-white/90 to-blue-50/90 backdrop-blur-sm shadow-sm text-blue-700"
              >
                Type
                <ChevronDown className="ml-1 w-4 h-4" />
              </button>
              {showTypeDropdown && (
                <div className="absolute top-full left-0 mt-1 w-56 bg-white/95 backdrop-blur-sm border border-purple-200 rounded-lg shadow-lg z-30">
                  <div className="p-3">
                    <div className="relative mb-2">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400 w-4 h-4" />
                      <input
                        type="text"
                        placeholder="Search Type"
                        className="pl-9 pr-3 py-2 w-full border border-purple-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="flex items-center space-x-2 p-2 hover:bg-purple-50 rounded cursor-pointer">
                        <input type="checkbox" className="rounded" />
                        <span className="text-purple-500">✨</span>
                        <span className="text-sm">Epic</span>
                      </label>
                      <label className="flex items-center space-x-2 p-2 hover:bg-purple-50 rounded cursor-pointer">
                        <input type="checkbox" className="rounded" />
                        <span className="text-purple-500">🔗</span>
                        <span className="text-sm">Subtask</span>
                      </label>
                      <label className="flex items-center space-x-2 p-2 hover:bg-purple-50 rounded cursor-pointer bg-purple-100">
                        <input type="checkbox" className="rounded" defaultChecked />
                        <span className="text-purple-500">✓</span>
                        <span className="text-sm">Task</span>
                      </label>
                    </div>
                    <div className="mt-2 pt-2 border-t border-purple-200 text-xs text-purple-600 text-center">
                      3 of 3
                    </div>
                  </div>
                </div>
              )}
            </Dropdown>

            {/* Status Dropdown */}
            <Dropdown>
              <button
                onClick={() => {
                  closeAllDropdowns();
                  setShowStatusDropdown(!showStatusDropdown);
                }}
                className="flex items-center px-3 py-2 border border-green-200 rounded-lg hover:bg-gradient-to-r hover:from-green-100 hover:to-emerald-100 transition-all duration-300 bg-gradient-to-r from-white/90 to-green-50/90 backdrop-blur-sm shadow-sm text-green-700"
              >
                Status
                <ChevronDown className="ml-1 w-4 h-4" />
              </button>
              {showStatusDropdown && (
                <div className="absolute top-full left-0 mt-1 w-56 bg-white/95 backdrop-blur-sm border border-purple-200 rounded-lg shadow-lg z-30">
                  <div className="p-3">
                    <div className="relative mb-2">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400 w-4 h-4" />
                      <input
                        type="text"
                        placeholder="Search Status"
                        className="pl-9 pr-3 py-2 w-full border border-purple-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    <div className="space-y-1">
                      {statusOptions.map((status) => (
                        <label key={status.id} className="flex items-center space-x-2 p-2 hover:bg-purple-50 rounded cursor-pointer">
                          <input type="checkbox" className="rounded" />
                          <span className={`text-xs px-2 py-1 rounded font-medium ${status.color === 'green' ? 'bg-green-100 text-green-800' :
                              status.color === 'blue' ? 'bg-purple-100 text-purple-800' :
                                'bg-purple-100 text-purple-800'
                            }`}>
                            {status.name}
                          </span>
                        </label>
                      ))}
                    </div>
                    <div className="mt-2 pt-2 border-t border-purple-200 text-xs text-purple-600 text-center">
                      3 of 3
                    </div>
                  </div>
                </div>
              )}
            </Dropdown>

            {/* More Filters Dropdown */}
            <Dropdown>
              <button
                onClick={() => {
                  closeAllDropdowns();
                  setShowMoreFiltersDropdown(!showMoreFiltersDropdown);
                }}
                className="flex items-center px-3 py-2 border border-purple-200 rounded-lg hover:bg-gradient-to-r hover:from-purple-100 hover:to-violet-100 transition-all duration-300 bg-gradient-to-r from-white/90 to-purple-50/90 backdrop-blur-sm shadow-sm text-purple-700"
              >
                More filters
                <ChevronDown className="ml-1 w-4 h-4" />
              </button>
              {showMoreFiltersDropdown && (
                <div className="absolute top-full left-0 mt-1 w-64 bg-white/95 backdrop-blur-sm border border-purple-200 rounded-lg shadow-lg z-30 max-h-96 overflow-y-auto">
                  <div className="p-3">
                    <div className="relative mb-3">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400 w-4 h-4" />
                      <input
                        type="text"
                        placeholder="Search more filters"
                        className="pl-9 pr-3 py-2 w-full border border-purple-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    <div className="space-y-1">
                      {[
                        'Attachment',
                        'Comment',
                        'Created',
                        'Creator',
                        'Description',
                        'Design',
                        'Development',
                        'Due date',
                        'Environment',
                        'Epic Link',
                        'Fix Version',
                        'Labels',
                        'Last comment',
                        'Priority',
                        'Project',
                        'Reporter',
                        'Resolution',
                        'Sprint',
                        'Story Points',
                        'Team',
                        'Time in Status',
                        'Updated',
                        'Versions',
                        'Watchers'
                      ].map((filter) => (
                        <label key={filter} className="flex items-center space-x-2 p-2 hover:bg-purple-50 rounded cursor-pointer">
                          <input type="checkbox" className="rounded w-4 h-4" />
                          <span className="text-sm">{filter}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </Dropdown>
          </div>
        </div>

        {/* Right side - Today button and navigation */}
        <div className="flex items-center space-x-4">
          <button
            onClick={goToToday}
            className="px-4 py-2 border border-orange-200 rounded-lg hover:bg-gradient-to-r hover:from-orange-100 hover:to-amber-100 transition-all duration-300 bg-gradient-to-r from-white/90 to-orange-50/90 backdrop-blur-sm shadow-sm text-orange-700 font-medium"
          >
            Today
          </button>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => navigateMonth(-1)}
              className="p-2 hover:bg-gradient-to-r hover:from-violet-200 hover:to-purple-200 rounded-full transition-all duration-300 bg-gradient-to-r from-white/80 to-violet-50/80 shadow-sm"
            >
              <ChevronLeft className="w-5 h-5 text-violet-600" />
            </button>

            <span className="text-xl font-bold min-w-32 text-center bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </span>

            <button
              onClick={() => navigateMonth(1)}
              className="p-2 hover:bg-gradient-to-r hover:from-violet-200 hover:to-purple-200 rounded-full transition-all duration-300 bg-gradient-to-r from-white/80 to-violet-50/80 shadow-sm"
            >
              <ChevronRight className="w-5 h-5 text-violet-600" />
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <button className="p-2 hover:bg-gradient-to-r hover:from-cyan-200 hover:to-blue-200 rounded-full transition-all duration-300 bg-gradient-to-r from-white/80 to-cyan-50/80 shadow-sm">
              <Calendar className="w-5 h-5 text-cyan-600" />
            </button>
            <button
              onClick={() => setShowTaskModal(true)}
              className="p-2 hover:bg-gradient-to-r hover:from-rose-200 hover:to-pink-200 rounded-full transition-all duration-300 bg-gradient-to-r from-white/80 to-rose-50/80 shadow-sm"
            >
              <Plus className="w-5 h-5 text-rose-600" />
            </button>
            <button className="p-2 hover:bg-gradient-to-r hover:from-amber-200 hover:to-yellow-200 rounded-full transition-all duration-300 bg-gradient-to-r from-white/80 to-amber-50/80 shadow-sm">
              <MoreHorizontal className="w-5 h-5 text-amber-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="flex flex-col h-full">
        {/* Week headers */}
        <div className="grid grid-cols-7 border-b border-purple-100">
          {weekDays.map((day) => (
            <div
              key={day}
              className="p-4 text-center text-sm font-medium border-r border-purple-100 last:border-r-0 bg-purple-100 text-purple-700"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar days */}
        <div className="flex-1">
          {calendarDays.map((week, weekIndex) => (
            <div key={weekIndex} className="grid grid-cols-7 h-32">
              {week.map((day, dayIndex) => (
                <div
                  key={`${weekIndex}-${dayIndex}`} // Fixed template literal syntax
                  onClick={() => handleDayClick(day)}
                  className={`border-r border-b border-purple-100 last:border-r-0 p-3 transition-all duration-200 cursor-pointer relative overflow-hidden ${!day.isCurrentMonth
                      ? 'bg-purple-50/40 text-gray-400'
                      : 'bg-purple-50/70 hover:bg-purple-100/80'
                  }`}
                >
                  <div className="text-sm font-medium text-purple-700">
                    {day.date}
                  </div>
                  
                  {/* Display tasks for this date */}
                  <div className="mt-1 space-y-1 max-h-20 overflow-y-auto">
                    {getTasksForDate(day.fullDate).map((task) => (
                      <div
                        key={task.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleTaskCompletion(task.id);
                        }}
                        className={`text-sm p-1 rounded-sm cursor-pointer transition-all duration-200 flex items-center space-x-1 ${
                          task.type === 'Epic' ? 'bg-purple-200 text-purple-800' :
                          task.type === 'Subtask' ? 'bg-blue-200 text-blue-900' :
                          'bg-blue-100 text-blue-700'
                        } ${task.completed ? 'opacity-50 line-through' : 'hover:bg-opacity-80'}`}
                      >
                        <input
                          type="checkbox"
                          checked={task.completed}
                          onChange={() => toggleTaskCompletion(task.id)}
                          className="w-3 h-3 rounded"
                          onClick={(e) => e.stopPropagation()}
                        />
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

      {/* Task Creation Modal */}
      {showTaskModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
           <div className="bg-white rounded-lg shadow-xl w-96 max-w-md mx-4">
            <div className="p-4 border-b border-purple-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-purple-800">Create New Item</h3>
                  {selectedDate && (
                    <p className="text-sm text-purple-600 mt-1">
                      {selectedDate.toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => {
                    setShowTaskModal(false);
                    setTaskInput('');
                    setSelectedDate(null);
                  }}
                  className="text-purple-400 hover:text-purple-600"
                >
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

              <div className="flex items-center justify-between">
                <div className="relative">
                  <button
                    onClick={() => setShowTaskTypeMenu(!showTaskTypeMenu)}
                    className="flex items-center space-x-2 px-3 py-2 border border-purple-300 rounded-lg hover:bg-purple-50 bg-white/90 backdrop-blur-sm"
                  >
                    <Check className="w-4 h-4 text-purple-600" />
                    <span className="text-purple-700">{selectedTaskType}</span>
                    <ChevronDown className="w-4 h-4 text-purple-600" />
                  </button>

                  {showTaskTypeMenu && (
                    <div className="absolute top-full left-0 mt-1 w-48 bg-white/95 backdrop-blur-sm border border-purple-200 rounded-lg shadow-lg z-10">
                      <div className="p-2">
                        {taskTypes.map((type) => (
                          <button
                            key={type.id}
                            onClick={() => {
                              setSelectedTaskType(type.name);
                              setShowTaskTypeMenu(false);
                            }}
                            className="w-full flex items-center space-x-2 p-2 hover:bg-purple-50 rounded text-left"
                          >
                            <span>{type.icon}</span>
                            <span>{type.name}</span>
                          </button>
                        ))}
                        <div className="border-t border-purple-200 pt-2 mt-2">
                          <button className="w-full text-left p-2 hover:bg-purple-50 rounded text-sm text-purple-600">
                            Manage types
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <button
                  onClick={handleCreateTask}
                  disabled={!taskInput.trim()}
                  className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 disabled:bg-purple-300 disabled:cursor-not-allowed transition-all duration-300"
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}