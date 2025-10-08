import React, { useState, useRef, useEffect } from 'react';
import TaskCard from './Taskcard';
import { DotsVerticalIcon, ArrowLeftIcon, ArrowRightIcon, TrashIcon } from './Icons';

const TaskColumn = ({
  title,
  tasks,
  status,
  columnId,
  onUpdateTask,
  onAddTaskClick,
  onDeleteColumn,
  onMoveColumn,
  columnIndex,
  totalColumns,
  onEditTask
}) => {
    const [isDraggingOver, setIsDraggingOver] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    
    // Close dropdown when clicking outside
    useEffect(() => {
      function handleClickOutside(event) {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
          setIsDropdownOpen(false);
        }
      }
      
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, []);
    
    const handleDragOver = (e) => {
        e.preventDefault();
    };

   
    const handleDrop = (e) => {
        e.preventDefault();
        const taskId = e.dataTransfer.getData('taskId');
        
        if (taskId && onUpdateTask) {
            onUpdateTask(taskId, { status: columnId });
        }
        setIsDraggingOver(false); 
    };

    
    const handleDragEnter = () => setIsDraggingOver(true);
    const handleDragLeave = () => setIsDraggingOver(false);

    return (
        <div 
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={`bg-black/10 backdrop-blur-sm p-4 rounded-xl w-80 flex-shrink-0 max-h-[calc(100vh-200px)] flex flex-col transition-colors duration-300 ${isDraggingOver ? 'bg-blue-500/10' : ''}`}
        >
            <div className="flex justify-between items-center mb-4 pb-2 border-b-2 border-white/20">
                <h3 className="font-bold text-lg text-gray-100">{title}</h3>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-800 font-medium bg-white/60 rounded-full px-2 py-0.5">
                    {tasks.length}
                  </span>
                  <div className="relative" ref={dropdownRef}>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsDropdownOpen(!isDropdownOpen);
                      }}
                      className="p-1 rounded-lg hover:bg-white/20 text-gray-300 hover:text-white transition-colors"
                    >
                      <DotsVerticalIcon className="w-5 h-5" />
                    </button>
                    
                    {isDropdownOpen && (
                      <div className="absolute right-0 mt-1 w-48 bg-black/80 backdrop-blur-md border border-white/20 rounded-lg shadow-lg z-10 overflow-hidden">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onMoveColumn(status, 'left');
                            setIsDropdownOpen(false);
                          }}
                          disabled={columnIndex === 0}
                          className={`w-full px-4 py-2 text-left text-sm flex items-center gap-2 ${columnIndex === 0 ? 'text-gray-500 cursor-not-allowed' : 'text-gray-200 hover:bg-white/10'}`}
                        >
                          <ArrowLeftIcon className="w-4 h-4" />
                          Move left
                        </button>
                        
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onMoveColumn(status, 'right');
                            setIsDropdownOpen(false);
                          }}
                          disabled={columnIndex === totalColumns - 1}
                          className={`w-full px-4 py-2 text-left text-sm flex items-center gap-2 ${columnIndex === totalColumns - 1 ? 'text-gray-500 cursor-not-allowed' : 'text-gray-200 hover:bg-white/10'}`}
                        >
                          <ArrowRightIcon className="w-4 h-4" />
                          Move right
                        </button>
                        
                        <div className="border-t border-white/10 my-1"></div>
                        
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteColumn(columnId); // <-- Use columnId instead of status
                            setIsDropdownOpen(false);
                          }}
                          className="w-full px-4 py-2 text-left text-sm flex items-center gap-2 text-red-400 hover:bg-red-500/10"
                        >
                          <TrashIcon className="w-4 h-4" />
                          Delete column
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

            <div className="flex-1 flex flex-col gap-4 overflow-y-auto pr-2 scrollbar-hide">
                {tasks.map(task => (
                  <div 
                    key={task.id} 
                    onClick={() => onEditTask(task)}
                    className="cursor-pointer hover:bg-white/10 transition-colors"
                  >
                    <TaskCard task={task} onUpdateTask={onUpdateTask} />
                  </div>
                ))}
            </div>
            {onAddTaskClick && isHovered && (
                <button 
                    onClick={() => onAddTaskClick(status)}
                    className="mt-4 p-2 w-full rounded-lg bg-white/10 text-gray-300 hover:bg-gray-300 transition-colors duration-200 flex items-center justify-center gap-2"
                >
                    <span className="text-lg font-bold text-gray-700">+</span> <span className="text-gray-700">Create</span>
                </button>
            )}
        </div>
    );
};

export default TaskColumn;

