import React, { useState, useEffect, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import AddTaskModal from '../AddTaskModal';
import TaskColumn from '../TaskColumn';
import {
  MenuIcon, ChevronDownIcon, ShareIcon, BellIcon, AdminIcon,
  FilterIcon, SortIcon, SearchIcon, KebabMenuIcon, PlusIcon
} from '../Icons';

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
          className={`absolute mt-2 z-50 bg-black/70 backdrop-blur-md border border-white/20 rounded-lg shadow-xl py-1 w-56 overflow-hidden ${align === 'right' ? 'right-0' : 'left-0'
            }`}
        >
          {children}
        </div>
      )}
    </div>
  );
};


const Board = () => {
  const { projectId } = useParams();
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
  const [newTaskColumnId, setNewTaskColumnId] = useState(null);
  const [isAddingColumn, setIsAddingColumn] = useState(false);
  const [newColumnTitle, setNewColumnTitle] = useState("");
  const [editingTask, setEditingTask] = useState(null);
  const [taskRefetchTrigger, setTaskRefetchTrigger] = useState(0);

  const fetchAndOrderColumns = async () => {
      setColumnError(null);
      try {
        const authToken = localStorage.getItem('authToken');
        const response = await fetch('http://localhost:8000/api/statuses/', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`,
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch columns from server.');
        }
        const data = await response.json();
        const savedOrder = JSON.parse(localStorage.getItem('columnOrder'));
        if (savedOrder) {
          const orderedColumns = data.sort((a, b) => {
            return savedOrder.indexOf(a.id) - savedOrder.indexOf(b.id);
          });
          setColumns(orderedColumns);
        } else {
          setColumns(data);
        }

      } catch (err) {
        console.error(err);
        setColumnError('Could not load board columns. Please try again.');
      }
    };

  useEffect(() => {
    fetchAndOrderColumns();
  }, []);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const authToken = localStorage.getItem('authToken');
        const response = await fetch('http://localhost:8000/api/tasks/', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`,
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch tasks.');
        }
        const data = await response.json();
        console.log(data, "data of tasks");
        setTasks(data);
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch tasks:', err);
        setError('Could not load tasks. Please try again.');
      }
    };
    fetchTasks();
  }, [taskRefetchTrigger]);

  const handleOpenAddTaskModal = (columnId) => {
    setNewTaskColumnId(columnId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setNewTaskColumnId(null);
  };


  const handleAddTask = async () => {
    // After a new task is successfully added in the modal,
    // we just need to refresh our list of tasks from the server.
    //await fetchTasks();
    setTaskRefetchTrigger(prev => prev + 1);
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

      //refetch all columns to get the latest list
      await fetchAndOrderColumns();

    } catch (err) {
      console.error('Failed to save new column:', err);
      setColumnError('Failed to create the new column. Please try again.');
    } finally {
      setNewColumnTitle("");
      setIsAddingColumn(false);
    }
  };

  const handleUpdateTask = async (taskId, updatedData) => {
    const originalTast = [...tasks];
    const newColumn = columns.find(col => col.id === updatedData.status);
    if (!newColumn) {
      console.error('Column not found');
      return;
    }
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id.toString() === taskId
          ? { ...task, status: newColumn }
          : task
      )
    );
    try {
      const authToken = localStorage.getItem('authToken');
      // Use PATCH for partial updates, targeting the specific task by its ID.
      const response = await fetch(`http://localhost:8000/api/tasks/${taskId}/status/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        throw new Error('Failed to update task on the server.');
      }

    } catch (err) {
      console.error('Error updating task:', err);
      // If the API call fails, revert the UI change to its original state.
      alert('Could not move the task. Please try again.');
      setTasks(originalTasks);
    }
  };


  const handleDeleteColumn = async (columnIdToDelete) => {
    const columnToDelete = columns.find(col => col.id === columnIdToDelete);
    if (!columnToDelete) return;
    const statusToDelete = columnToDelete.status;

    try {
      const authToken = localStorage.getItem('authToken');
      const response = await fetch(`http://localhost:8000/api/statuses/${columnIdToDelete}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete the column from the server.');
      }

      console.log(`Column with ID ${columnIdToDelete} deleted successfully.`);
      setColumns(prevColumns => prevColumns.filter(col => col.id !== columnIdToDelete));
      setTasks(prevTasks => prevTasks.filter(task => task.status !== statusToDelete));

    } catch (err) {
      console.error('Error deleting column:', err);
      setError('Could not delete the column. Please try again.');
    }
  };

  const handleMoveColumn = (columnId, direction) => {
    const newColumns = [...columns];
    const currentIndex = newColumns.findIndex(col => col.id === columnId);
    if (currentIndex === -1) return;
    if (direction === 'left' && currentIndex === 0) return;
    if (direction === 'right' && currentIndex === newColumns.length - 1) return;
    const targetIndex = direction === 'left' ? currentIndex - 1 : currentIndex + 1;

    [newColumns[currentIndex], newColumns[targetIndex]] = [newColumns[targetIndex], newColumns[currentIndex]];
    setColumns(newColumns);
    const columnOrder = newColumns.map(col => col.id);
    localStorage.setItem('columnOrder', JSON.stringify(columnOrder));
  };

  const handleChangeColumnTitle = async (columnId, newTitle) => {
    const trimmedTitle = newTitle.trim();
    if (!trimmedTitle) {
      alert('Column title cannot be empty');
      return;
    }

    // Optimistically update UI
    const originalColumns = [...columns];
    setColumns(prevColumns =>
      prevColumns.map(col =>
        col.id === columnId ? { ...col, title: trimmedTitle } : col
      )
    );

    try {
      const authToken = localStorage.getItem('authToken');
      const response = await fetch(`http://localhost:8000/api/statuses/${columnId}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify({ title: trimmedTitle }),
      });

      if (!response.ok) {
        throw new Error('Failed to update column title on the server.');
      }

      console.log(`Column ${columnId} title updated to "${trimmedTitle}"`);
    } catch (err) {
      console.error('Error updating column title:', err);
      alert('Could not update the column title. Please try again.');
      // Revert to original state on error
      setColumns(originalColumns);
    }
  };

  const handleSearchChange = (e) => setSearchTerm(e.target.value);

  const filteredTasks = tasks.filter((task) => {

    const matchesProject = task.project?.toString() === projectId;
    if (!matchesProject) {
      return false;
    }

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
        show={isModalOpen || !!editingTask}
        onHide={() => {
          handleCloseModal();
          setEditingTask(null);
        }}
        onAddTask={handleAddTask}
        columns={columns}
        initialColumnId={newTaskColumnId}
        projectId={projectId}
        task={editingTask}
        isEditMode={!!editingTask}
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
          <input type="text" placeholder="Search tasks, projects..." value={searchTerm} onChange={handleSearchChange} className="w-full max-w-lg p-2.5 border border-white/30 rounded-full focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm bg-white/20 backdrop-blur-sm text-white placeholder:text-gray-700" />
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
            <AdminIcon className="h-7 w-7" />
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
          <button onClick={() => { setIsModalOpen(true); setNewTaskColumnId(null) }} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/20 backdrop-blur-sm border border-white/30 text-gray-200 hover:bg-white/30">
            <span className="text-lg font-bold text-gray-600">+</span> <span className="text-gray-700">Add Task</span>
          </button>
        </div>
        <div className="flex items-center gap-3 self-end w-full md:w-auto justify-end">
          <div className="relative">
            {isLocalSearchOpen ? (<input type="text" placeholder="Search..." value={searchTerm} onChange={handleSearchChange} className="w-48 p-2 rounded-lg border border-black/40 bg-white/10 backdrop-blur-sm text-gray-700 placeholder:text-gray-700 focus:ring-2 focus:ring-gray-400 focus:outline-none" />
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
            tasks={sortedTasks.filter(task => task.status?.id === column.id)}
            status={column.status}
            columnId={column.id}
            onUpdateTask={handleUpdateTask}
            onAddTaskClick={handleOpenAddTaskModal}
            onMoveColumn={handleMoveColumn}
            onDeleteColumn={handleDeleteColumn}
            onChangeColumnTitle={handleChangeColumnTitle}
            onEditTask={setEditingTask}
            columnIndex={columns.findIndex(col => col.id === column.id)}
            totalColumns={columns.length}
          />
        ))}
        
        <div className="w-80 flex-shrink-0">
          {isAddingColumn ? (
            <div className="bg-black/20 p-4 rounded-xl">
              <input
                type="text"
                value={newColumnTitle} // <--- FIX: Use the correct state variable
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
