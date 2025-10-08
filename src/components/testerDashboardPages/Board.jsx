import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { initialTasks } from '../../data/initial-data';
import AddTaskModal from '../AddTaskModal';
import EditTaskModal from '../EditTaskModal';
import TaskColumn from '../TaskColumn';
import {
  MenuIcon, ChevronDownIcon, ShareIcon, BellIcon, AdminIcon,
  FilterIcon, SortIcon, SearchIcon, KebabMenuIcon, PlusIcon
} from '../Icons';
// CRITICAL CHANGE: Removed the import for DashboardLayout
// import DashboardLayout from '../../layout/DashboardLayout';

const Dropdown = ({ button, children, align = 'right' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="p-2 rounded-lg bg-white/20 backdrop-blur-sm border border-white/30 text-gray-200 hover:bg-white/30 focus:outline-none flex items-center gap-2"
      >
        {button}
      </button>
      {isOpen && (
        <div
          className={`absolute mt-2 z-50 bg-black/70 backdrop-blur-md border border-white/20 rounded-lg shadow-xl py-1 w-56 overflow-hidden ${
            align === 'right' ? 'right-0' : 'left-0'
          }`}
        >
          {children}
        </div>
      )}
    </div>
  );
};


const Board = () => {
  // All your existing state and logic remains the same...
  const [tasks, setTasks] = useState([]);
  const [columns, setColumns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [columnError, setColumnError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTerm, setFilterTerm] = useState('all');
  const [sortTerm, setSortTerm] = useState('default');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLocalSearchOpen, setIsLocalSearchOpen] = useState(false);
  const [newTaskStatus, setNewTaskStatus] = useState(null);
  const [isAddingColumn, setIsAddingColumn] = useState(false);
  const [newColumnTitle, setNewColumnTitle] = useState("");
  const [draggingTaskId, setDraggingTaskId] = useState(null);
  const [editingTask, setEditingTask] = useState(null);

  const fetchColumns = async () => {
    setColumnError(null);
    try {
      const authToken = localStorage.getItem('authToken'); // Ensure you have auth token logic
      const response = await fetch('http://localhost:8000/api/tasks/statuses/', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch columns from server.');
      }
      const data = await response.json();
      setColumns(data); // Update state with fetched columns
    } catch (err) {
      console.error(err);
      setColumnError('Could not load board columns. Please try again.');
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await fetchColumns();

      try {
        await new Promise((resolve) => setTimeout(resolve, 500));
        setTasks(initialTasks);
      } catch (err) {
        setError(err);
        console.error('Failed to fetch tasks:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleOpenAddTaskModal = (status) => {
    setNewTaskStatus(status);
    setIsModalOpen(true);
  };

  const handleAddTask = async (newTaskData) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const addedTask = {
        ...newTaskData,
        id: Date.now(),
        date: new Date().toISOString().split('T')[0],
      };
      setTasks((prevTasks) => [...prevTasks, addedTask]);
    } catch (err) {
      console.error('Failed to add task', err);
    }
  };

  const handleSaveNewColumn = async () => {
    const trimmedTitle = newColumnTitle.trim();
    if (!trimmedTitle) {
      setIsAddingColumn(false);
      return;
    }

    try {
      const authToken = localStorage.getItem('authToken');
      const response = await fetch('http://localhost:8000/api/tasks/create-status/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify({ title: trimmedTitle }),
      });

      if (!response.ok) {
        throw new Error('Failed to create the column on the server.');
      }
      
      // After successful creation, refetch all columns to get the latest list
      await fetchColumns();

      } catch (err) {
        console.error('Failed to save new column:', err);
        setColumnError('Failed to create the new column. Please try again.');
      } finally {
        // Reset the input form regardless of outcome
        setNewColumnTitle("");
        setIsAddingColumn(false);
      }
    };

  const handleUpdateTask = (taskId, updatedData) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id.toString() === taskId ? { ...task, ...updatedData } : task
      )
    );
  };

  const handleMoveColumn = (columnStatus, direction) => {
    setColumns(prevColumns => {
      const newColumns = [...prevColumns];
      const currentIndex = newColumns.findIndex(col => col.status === columnStatus);
      if (direction === 'left' && currentIndex > 0) {
        [newColumns[currentIndex - 1], newColumns[currentIndex]] =
        [newColumns[currentIndex], newColumns[currentIndex - 1]];
      } else if (direction === 'right' && currentIndex < newColumns.length - 1) {
        [newColumns[currentIndex], newColumns[currentIndex + 1]] =
        [newColumns[currentIndex + 1], newColumns[currentIndex]];
      }
      return newColumns;
    });
  };

  const handleSearchChange = (e) => setSearchTerm(e.target.value);

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterTerm === 'all' ||
      (task.badges && task.badges.some((b) => b.toLowerCase() === filterTerm.toLowerCase()));
    return matchesSearch && matchesFilter;
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortTerm === 'date-asc') return new Date(a.date) - new Date(b.date);
    if (sortTerm === 'date-desc') return new Date(b.date) - new Date(a.date);
    return 0;
  });

  const allBadges = ['all', ...new Set(tasks.flatMap((task) => task.badges || []))];
  const sortOptions = [
    { key: 'default', label: 'Default' },
    { key: 'date-asc', label: 'Date Ascending' },
    { key: 'date-desc', label: 'Date Descending' },
  ];

  if (loading) return <div className="flex items-center justify-center h-full text-white text-xl">Loading tasks...</div>;
  if (error) return <div className="flex items-center justify-center h-full text-red-400 text-xl">Error loading tasks.</div>;

  
  return (
    <div className="flex flex-col text-white p-4 md:p-6 h-full">
      <AddTaskModal
        show={isModalOpen}
        onHide={() => setIsModalOpen(false)}
        onAddTask={handleAddTask}
        columns={columns}
        initialStatus={newTaskStatus}
      />
      <EditTaskModal
        show={!!editingTask}
        onHide={() => setEditingTask(null)}
        onUpdateTask={handleUpdateTask}
        task={editingTask}
      />
      <header className="flex-shrink-0 flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <button className="text-gray-200 p-2 rounded-lg hover:bg-black/20">
            <MenuIcon />
          </button>
          <Dropdown
            button={
              <>
                <span className="font-semibold text-lg">Ongoing Task</span>
                <ChevronDownIcon />
                {sortedTasks.filter(task => task.status === 'inprogress').length > 0 && (
                  <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full border-2 border-black/10"></span>
                )}
              </>
            }
          >
            {sortedTasks.filter(task => task.status === 'inprogress').length > 0 ? (
              sortedTasks.filter(task => task.status === 'inprogress').map((task) => (
                <div key={task.id} className="px-4 py-2 text-sm text-gray-200 hover:bg-blue-500/40 cursor-pointer w-full truncate">
                  {task.title}
                </div>
              ))
            ) : (
              <div className="px-4 py-2 text-sm text-gray-400">No ongoing tasks</div>
            )}
          </Dropdown>
        </div>
        <div className="hidden lg:flex flex-1 justify-center px-8 ">
          <input type="text" placeholder="Search tasks, projects..." value={searchTerm} onChange={handleSearchChange} className="w-full max-w-lg p-2.5 border border-white/30 rounded-full focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm bg-white/20 backdrop-blur-sm text-white placeholder:text-gray-700"/>
        </div>
        <div className="flex items-center gap-2 md:gap-5">
          <button className="hidden md:flex items-center gap-2 p-2 rounded-lg text-gray-600 hover:bg-black/20">
            <ShareIcon /> <span >Share</span>
          </button>
          <button className="p-2 rounded-full text-gray-600 hover:bg-black/40 relative">
            <BellIcon className="h-7 w-7" />
            <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
          </button>
          <Link to="/login" className="p-1 rounded-full text-gray-600 hover:bg-black/40">
            <AdminIcon className="h-7 w-7"/>
          </Link>
        </div>
      </header>
      <div className="flex-shrink-0 flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
        <div className="flex items-center gap-3 self-start w-full md:w-auto">
          <Dropdown button={<FilterIcon />} align="left">
            {allBadges.map((badge) => (
              <div key={badge} onClick={() => setFilterTerm(badge)} className="px-4 py-2 text-sm text-gray-200 hover:bg-blue-500/40 cursor-pointer">
                {badge === 'all' ? 'All Categories' : badge}
              </div>
            ))}
          </Dropdown>
          <Dropdown button={<SortIcon />} align="left">
            {sortOptions.map((opt) => (
              <div key={opt.key} onClick={() => setSortTerm(opt.key)} className="px-4 py-2 text-sm text-gray-200 hover:bg-blue-500/40 cursor-pointer">
                {opt.label}
              </div>
            ))}
          </Dropdown>
          <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/20 backdrop-blur-sm border border-white/30 text-gray-200 hover:bg-white/30">
            <span className="text-lg font-bold text-gray-600">+</span> <span className="text-gray-700">Add Task</span>
          </button>
        </div>
        <div className="flex items-center gap-3 self-end w-full md:w-auto justify-end">
          <div className="relative">
            {isLocalSearchOpen ? (<input type="text" placeholder="Search..." value={searchTerm} onChange={handleSearchChange} className="w-48 p-2 rounded-lg border border-black/40 bg-white/10 backdrop-blur-sm text-gray-700 placeholder:text-gray-700 focus:ring-2 focus:ring-gray-400 focus:outline-none"/>
            ) : (<button onClick={() => setIsLocalSearchOpen(true)} className="p-2.5 rounded-lg bg-black/20 backdrop-blur-sm border border-white/30 text-gray-200 hover:bg-black/30">
                <SearchIcon />
              </button>
            )}
          </div>
          <button className="p-2 rounded-lg bg-black/20 backdrop-blur-sm border border-white/30 text-gray-200 hover:bg-black/30">
            <KebabMenuIcon />
          </button>
        </div>
      </div>
      <div className="flex-1 flex overflow-x-auto gap-6 pb-4 items-start">
        {columns.map(column => (
          <TaskColumn
            key={column.id}
            title={column.title}
            tasks={sortedTasks.filter(task => task.status === column.status)}
            status={column.status}
            onUpdateTask={handleUpdateTask}
            onAddTaskClick={handleOpenAddTaskModal}
            onMoveColumn={handleMoveColumn}
            onDeleteColumn={(status) => {
              // Replaced window.confirm with a direct action for this fix.
              // Consider implementing a custom modal for confirmation.
              setTasks(tasks.filter(task => task.status !== status));
              setColumns(columns.filter(col => col.status !== status));
            }}
            onEditTask={setEditingTask}
            columnIndex={columns.findIndex(col => col.status === column.status)}
            totalColumns={columns.length}
            draggingTaskId={draggingTaskId}
            setDraggingTaskId={setDraggingTaskId}
          />
        ))}
        <div className="w-80 flex-shrink-0">
          {isAddingColumn ? (
            <div className="bg-black/20 p-4 rounded-xl">
              <input
                type="text"
                value={newColumnTitle}
                onChange={(e) => setNewColumnTitle(e.target.value)}
                onBlur={handleSaveNewColumn}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSaveNewColumn();
                  if (e.key === 'Escape') {
                    setIsAddingColumn(false);
                    setNewColumnTitle("");
                  }
                }}
                placeholder="Enter column title"
                className="w-full p-2 bg-white/20 border border-white/30 rounded-lg text-white placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                autoFocus
              />
            </div>
          ) : (
            <button
              onClick={() => setIsAddingColumn(true)}
              className="w-12 h-7 flex items-center justify-center bg-black/10 backdrop-blur-sm p-4 rounded-xl text-gray-700 hover:bg-gray-200 transition-colors duration-200"
            >
              <PlusIcon />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Board;
