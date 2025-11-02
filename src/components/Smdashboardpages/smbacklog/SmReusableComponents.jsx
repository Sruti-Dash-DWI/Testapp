// ReusableComponents.jsx
import React, { useState, useRef, useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom';
import { useTheme } from '../../../context/ThemeContext';


import {
  DropdownChevronIcon,
  UserAvatar,
  PriorityHighestIcon,
  PriorityHighIcon,
  PriorityMediumIcon,
  PriorityLowIcon,
  PriorityLowestIcon,
} from '../../Icons';



export const Dropdown = ({
  options = [],
  onSelect = () => {},
  children,
  customClasses = 'w-40',
  menuAlign = 'right',
  closeDelay = 150,
  maxHeight = '18rem',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ left: 0, top: 0 }); // fixed coords
  const [placement, setPlacement] = useState({ horizontal: menuAlign, vertical: 'bottom' }); 
  const containerRef = useRef(null);
  const menuRef = useRef(null);
  const closeTimerRef = useRef(null);

  const clearCloseTimer = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  };
  const scheduleClose = useCallback(() => {
    clearCloseTimer();
    closeTimerRef.current = setTimeout(() => {
      setIsOpen(false);
      closeTimerRef.current = null;
    }, closeDelay);
  }, [closeDelay]);

  const openMenu = useCallback(() => {
    clearCloseTimer();
    setIsOpen(true);
  }, []);

  
  const calculatePosition = useCallback(() => {
    const trigger = containerRef.current;
    const menu = menuRef.current;
    if (!trigger || !menu) return;

    const triggerRect = trigger.getBoundingClientRect();
    const menuRect = menu.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    
    let left = triggerRect.left;
    if (menuAlign === 'right') {
      
      left = triggerRect.right - menuRect.width;
    }

   
    if (left + menuRect.width > vw - 8) left = Math.max(8, vw - menuRect.width - 8);
    if (left < 8) left = 8;

   
    let top = triggerRect.bottom;
    let vertical = 'bottom';
    if (triggerRect.bottom + menuRect.height > vh - 8) {
   
      top = triggerRect.top - menuRect.height;
      vertical = 'top';
     
      if (top < 8) top = 8;
    }

    if (menuRect.height > vh - 16) {
    
      top = 8;
      vertical = 'overlay';
    }

    setPosition({ left: Math.round(left), top: Math.round(top) });
    setPlacement({ horizontal: left === 8 && menuAlign === 'right' ? 'left-checked' : menuAlign, vertical });
  }, [menuAlign]);

  useEffect(() => {
    if (!isOpen) return;
    calculatePosition();

    const handleResize = () => calculatePosition();
    window.addEventListener('resize', handleResize);
  
    window.addEventListener('scroll', handleResize, true);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleResize, true);
    };
  }, [isOpen, calculatePosition]);


  useEffect(() => {
    if (!isOpen) return;
    const onDocClick = (e) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target) &&
        menuRef.current &&
        !menuRef.current.contains(e.target)
      ) {
        setIsOpen(false);
      }
    };
    const onKey = (e) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('click', onDocClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('click', onDocClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [isOpen]);

  
  const onOptionSelect = (option) => {
    const val = option && Object.prototype.hasOwnProperty.call(option, 'value') ? option.value : option;
    onSelect(val);
    setIsOpen(false);
  };

 
  const menuNode = isOpen ? (
    <div
      ref={menuRef}
     
      style={{
        position: 'fixed',
        left: `${position.left}px`,
        top: `${position.top}px`,
        zIndex: 9999,
        minWidth: '8rem',
      }}
      className={`bg-white rounded-md shadow-lg border ${customClasses}`}
      onMouseEnter={() => {
        clearCloseTimer();
      }}
      onMouseLeave={() => {
        scheduleClose();
      }}
      role="menu"
    >
      <div style={{ maxHeight: maxHeight, overflow: 'auto' }} className="py-1">
        {options.map((option, idx) => {
          const key = option && option.label ? `${option.label}-${idx}` : `${String(option && option.value != null ? option.value : option)}-${idx}`;
          return (
            <div
              key={key}
              role="menuitem"
              tabIndex={0}
              onMouseDown={(e) => {
                e.preventDefault(); 
                onOptionSelect(option);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onOptionSelect(option);
                }
              }}
              className={`block px-3 py-1.5 text-sm hover:bg-gray-100 cursor-pointer ${option && option.isDestructive ? 'text-red-600' : 'text-gray-700'}`}
            >
              {option && option.label}
            </div>
          );
        })}
      </div>
    </div>
  ) : null;

  return (
    <>
      <div
        ref={containerRef}
        className="relative inline-block"
        onMouseEnter={openMenu}
        onMouseLeave={() => scheduleClose()}
      
        onClick={() => setIsOpen((v) => !v)}
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        {children}
      </div>

      {isOpen && ReactDOM.createPortal(menuNode, document.body)}
    </>
  );
};

export const StatusDropdown = ({ currentStatus, onItemUpdate, menuAlign }) => {
  const statuses = [
    { id: 1, title: 'To Do' },
    { id: 2, title: 'In Progress' },
    { id: 3, title: 'In Review' },
    { id: 4, title: 'Done' },
    { id: 5, title: 'Testing' },
  ];

  const statusColors = {
    'To Do': 'bg-gray-200 text-gray-700',
    'In Progress': 'bg-blue-100 text-blue-800',
    'In Review': 'bg-purple-100 text-purple-800',
    Done: 'bg-green-100 text-green-800',
    Testing: 'bg-yellow-100 text-yellow-800',
  };

  const statusOptions = statuses.map((s) => ({ value: s, label: s.title }));

  const handleSelect = (selectedStatusObject) => {
    onItemUpdate({ status_id: selectedStatusObject.id });
  };

  const statusTitle = typeof currentStatus === 'object' && currentStatus !== null ? currentStatus.title : currentStatus || 'To Do';

  return (
    <Dropdown options={statusOptions} onSelect={handleSelect} menuAlign={menuAlign} customClasses="w-36">
      <div className={`inline-flex items-center gap-1 text-sm font-semibold px-2 py-1 rounded cursor-pointer ${statusColors[statusTitle] || 'bg-gray-100 text-gray-800'}`}>
        {statusTitle} <DropdownChevronIcon />
      </div>
    </Dropdown>
  );
};


export const PriorityDropdown = ({ currentPriority, onItemUpdate, isIconOnly = false }) => {
  const priorities = ['Highest', 'High', 'Medium', 'Low', 'Lowest'];
  const priorityOptions = priorities.map((p) => ({ value: p, label: p }));
  const { theme, toggleTheme, colors } = useTheme();

  const priorityIcons = {
    Highest: <PriorityHighestIcon />,
    High: <PriorityHighIcon />,
    Medium: <PriorityMediumIcon />,
    Low: <PriorityLowIcon />,
    Lowest: <PriorityLowestIcon />,
  };

  const handleSelect = (priority) => onItemUpdate({ priority });

  return (
    <Dropdown options={priorityOptions} onSelect={handleSelect} customClasses="w-36" maxHeight="12rem">
      <div className="flex items-center gap-2 text-sm text-gray-800 hover:bg-gray-200 p-1 rounded cursor-pointer"  style={{ backgroundColor: colors.card, borderColor: colors.border, color: colors.textSubtle }} >
        {priorityIcons[currentPriority] || <PriorityMediumIcon />}
        {!isIconOnly && <span>{currentPriority || 'Medium'}</span>}
      </div>
    </Dropdown>
  );
};


export const UserSelector = ({ selectedUserId, users = [], onUpdate }) => {
  const { theme, toggleTheme, colors } = useTheme();
  const selectedUser = users.find((u) => u && u.id === selectedUserId) || null;
  const userOptions = users.map((u) => ({ value: u.id, label: u.name || '—' }));
  const hasNullUser = users.some((u) => u && (u.id === null || u.id === undefined));
  if (hasNullUser) {
    const idx = userOptions.findIndex((o) => o.value === null || o.value === undefined);
    if (idx !== -1) userOptions[idx].label = 'Unassigned';
  } else {
    userOptions.unshift({ value: 'unassigned-sentinel', label: 'Unassigned' });
  }

  const handleSelect = (selectedValue) => {
    if (selectedValue === 'unassigned-sentinel') onUpdate(null);
    else onUpdate(selectedValue);
  };

  return (
    <Dropdown options={userOptions} onSelect={handleSelect} customClasses="w-48" maxHeight="14rem">
      <div className="flex items-center gap-2 text-sm text-gray-800 hover:bg-gray-200 p-1 rounded cursor-pointer"  style={{ backgroundColor: colors.card, color: colors.textSubtle, borderColor: colors.border }} >
        <UserAvatar user={selectedUser} />
        <span>{selectedUser ? selectedUser.name : 'Unassigned'}</span>
      </div>
    </Dropdown>
  );
};

export default Dropdown;
