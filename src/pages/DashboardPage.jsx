// import React, { useState, useEffect, useRef } from 'react';
// import { Link, useOutletContext } from 'react-router-dom';
// import { initialTasks } from '../data/initial-data';
// import AddTaskModal from '../components/AddTaskModal';
// import TaskColumn from '../components/TaskColumn';
// import {
//   MenuIcon,
//   ChevronDownIcon,
//   ShareIcon,
//   BellIcon,
//   AdminIcon,
//   FilterIcon,
//   SortIcon,
//   SearchIcon,
//   KebabMenuIcon,
// } from '../components/Icons';

// const Dropdown = ({ button, children, align = 'right' }) => {
//   const [isOpen, setIsOpen] = useState(false);
//   const dropdownRef = useRef(null);

//   useEffect(() => {
//     const handleClickOutside = (e) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
//         setIsOpen(false);
//       }
//     };
//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, []);

//   return (
//     <div className="relative inline-block" ref={dropdownRef}>
//       <button
//         onClick={() => setIsOpen((prev) => !prev)}
//         className="p-2 rounded-lg bg-white/20 backdrop-blur-sm border border-white/30 text-gray-200 hover:bg-white/30 focus:outline-none flex items-center gap-2"
//       >
//         {button}
//       </button>
//       {isOpen && (
//         <div
//           className={`absolute mt-2 z-50 bg-black/70 backdrop-blur-md border border-white/20 rounded-lg shadow-xl py-1 w-56 overflow-hidden ${
//             align === 'right' ? 'right-0' : 'left-0'
//           }`}
//         >
//           {children}
//         </div>
//       )}
//     </div>
//   );
// };

// const DashboardPage = () => {
//   // const { onToggleNav } = useOutletContext();

//   const [tasks, setTasks] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [filterTerm, setFilterTerm] = useState('all');
//   const [sortTerm, setSortTerm] = useState('default');
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [isLocalSearchOpen, setIsLocalSearchOpen] = useState(false);
  
//   const [draggingTaskId, setDraggingTaskId] = useState(null);

//   useEffect(() => {
//     const fetchTasks = async () => {
//       try {
//         setLoading(true);
//         await new Promise((resolve) => setTimeout(resolve, 500));
//         setTasks(initialTasks);
//       } catch (err) {
//         setError(err);
//         console.error('Failed to fetch tasks:', err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchTasks();
//   }, []);

//   const handleAddTask = async (newTaskData) => {
//     try {
//       await new Promise((resolve) => setTimeout(resolve, 500));
//       const addedTask = {
//         ...newTaskData,
//         id: Date.now(),
//         date: new Date().toISOString().split('T')[0],
//       };
//       setTasks((prevTasks) => [...prevTasks, addedTask]);
//     } catch (err) {
//       console.error('Failed to add task', err);
//     }
//   };

//   const handleUpdateTask = (taskId, updatedData) => {
//     setTasks(prevTasks =>
//       prevTasks.map(task =>
//         task.id.toString() === taskId ? { ...task, ...updatedData } : task
//       )
//     );
//   };

//   const handleSearchChange = (e) => setSearchTerm(e.target.value);

//   const filteredTasks = tasks.filter((task) => {
//     const matchesSearch =
//       task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       task.description.toLowerCase().includes(searchTerm.toLowerCase());
//     const matchesFilter =
//       filterTerm === 'all' ||
//       (task.badges && task.badges.some((b) => b.toLowerCase() === filterTerm.toLowerCase()));
//     return matchesSearch && matchesFilter;
//   });

//   const sortedTasks = [...filteredTasks].sort((a, b) => {
//     if (sortTerm === 'date-asc') {
//       return new Date(a.date) - new Date(b.date);
//     }
//     if (sortTerm === 'date-desc') {
//       return new Date(b.date) - new Date(a.date);
//     }
//     return 0;
//   });

//   const todoTasks = sortedTasks.filter((task) => task.status === 'todo');
//   const inprogressTasks = sortedTasks.filter((task) => task.status === 'inprogress');
//   const doneTasks = sortedTasks.filter((task) => task.status === 'done');
  
//   const allBadges = ['all', ...new Set(tasks.flatMap((task) => task.badges || []))];
//   const sortOptions = [
//     { key: 'default', label: 'Default' },
//     { key: 'date-asc', label: 'Date Ascending' },
//     { key: 'date-desc', label: 'Date Descending' },
//   ];

//   if (loading) return <div className="flex items-center justify-center h-full text-white text-xl">Loading tasks...</div>;
//   if (error) return <div className="flex items-center justify-center h-full text-red-400 text-xl">Error loading tasks.</div>;

//   return (
//     // <div className="flex flex-col h-full text-white p-4 md:p-6">
//     //   <AddTaskModal show={isModalOpen} onHide={() => setIsModalOpen(false)} onAddTask={handleAddTask} />
//     //   <header className="flex-shrink-0 flex justify-between items-center mb-6">
//     //     <div className="flex items-center gap-4">
//     //       <button onClick={onToggleNav} className="text-gray-200 p-2 rounded-lg hover:bg-black/20">
//     //         <MenuIcon />
//     //       </button>
//     //       <Dropdown
//     //         button={
//     //           <>
//     //             <span className="font-semibold text-lg">Ongoing Task</span>
//     //             <ChevronDownIcon />
//     //             {inprogressTasks.length > 0 && (
//     //               <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full border-2 border-black/10"></span>
//     //             )}
//     //           </>
//     //         }
//     //       >
//     //         {inprogressTasks.length > 0 ? (
//     //           inprogressTasks.map((task) => (
//     //             <div key={task.id} className="px-4 py-2 text-sm text-gray-200 hover:bg-blue-500/40 cursor-pointer w-full truncate">
//     //               {task.title}
//     //             </div>
//     //           ))
//     //         ) : (
//     //           <div className="px-4 py-2 text-sm text-gray-400">No ongoing tasks</div>
//     //         )}
//     //       </Dropdown>
//     //     </div>
//     //     <div className="hidden lg:flex flex-1 justify-center px-8">
//     //       <input type="text" placeholder="Search tasks, projects..." value={searchTerm} onChange={handleSearchChange} className="w-full max-w-lg p-2.5 border border-white/30 rounded-full focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm bg-white/20 backdrop-blur-sm text-white placeholder:text-gray-300"/>
//     //     </div>
//     //     <div className="flex items-center gap-2 md:gap-5">
//     //       <button className="hidden md:flex items-center gap-2 p-2 rounded-lg text-gray-200 hover:bg-black/20">
//     //         <ShareIcon /> <span>Share</span>
//     //       </button>
//     //       <button className="p-2 rounded-full text-gray-200 hover:bg-black/20 relative">
//     //         <BellIcon className="h-7 w-7" />
//     //         <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
//     //       </button>
//     //       <Link to="/login" className="p-1 rounded-full hover:bg-black/20">
//     //         <AdminIcon />
//     //       </Link>
//     //     </div>
//     //   </header>
//     //   <div className="flex-shrink-0 flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
//     //     <div className="flex items-center gap-3 self-start w-full md:w-auto">
//     //       <Dropdown button={<FilterIcon />} align="left">
//     //         {allBadges.map((badge) => (
//     //           <div key={badge} onClick={() => setFilterTerm(badge)} className="px-4 py-2 text-sm text-gray-200 hover:bg-blue-500/40 cursor-pointer">
//     //             {badge === 'all' ? 'All Categories' : badge}
//     //           </div>
//     //         ))}
//     //       </Dropdown>
//     //       <Dropdown button={<SortIcon />} align="left">
//     //         {sortOptions.map((opt) => (
//     //           <div key={opt.key} onClick={() => setSortTerm(opt.key)} className="px-4 py-2 text-sm text-gray-200 hover:bg-blue-500/40 cursor-pointer">
//     //             {opt.label}
//     //           </div>
//     //         ))}
//     //       </Dropdown>
//     //       <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/20 backdrop-blur-sm border border-white/30 text-gray-200 hover:bg-white/30">
//     //         <span className="text-lg font-bold">+</span> Add Task
//     //       </button>
//     //     </div>
//     //     <div className="flex items-center gap-3 self-end w-full md:w-auto justify-end">
//     //       <div className="relative">
//     //         {isLocalSearchOpen ? (<input type="text" placeholder="Search..." value={searchTerm} onChange={handleSearchChange} className="w-48 p-2 rounded-lg border border-white/30 bg-white/20 backdrop-blur-sm text-white placeholder:text-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"/>
//     //         ) : (<button onClick={() => setIsLocalSearchOpen(true)} className="p-2 rounded-lg bg-white/20 backdrop-blur-sm border border-white/30 text-gray-200 hover:bg-white/30">
//     //             <SearchIcon />
//     //           </button>
//     //         )}
//     //       </div>
//     //       <button className="p-2 rounded-lg bg-white/20 backdrop-blur-sm border border-white/30 text-gray-200 hover:bg-white/30">
//     //         <KebabMenuIcon />
//     //       </button>
//     //     </div>
//     //   </div>
//     //   <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//     //     <TaskColumn
//     //       title=" To Do"
//     //       tasks={todoTasks}
//     //       status="todo"
//     //       onUpdateTask={handleUpdateTask}
      
//     //       draggingTaskId={draggingTaskId}
//     //       setDraggingTaskId={setDraggingTaskId}
//     //     />
//     //     <TaskColumn
//     //       title=" In Progress"
//     //       tasks={inprogressTasks}
//     //       status="inprogress"
//     //       onUpdateTask={handleUpdateTask}
         
//     //       draggingTaskId={draggingTaskId}
//     //       setDraggingTaskId={setDraggingTaskId}
//     //     />
//     //     <TaskColumn
//     //       title="Done"
//     //       tasks={doneTasks}
//     //       status="done"
//     //       onUpdateTask={handleUpdateTask}
          
//     //       draggingTaskId={draggingTaskId}
//     //       setDraggingTaskId={setDraggingTaskId}
//     //     />
//     //   </div>
//     // </div>
//     <h1>Dashboard</h1>
//   );
// };

// export default DashboardPage;

