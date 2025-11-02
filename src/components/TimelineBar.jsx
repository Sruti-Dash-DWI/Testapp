// Filename: TimelineBar.jsx
import React, { useState, useEffect, useRef } from 'react';

// Helper to format date for the tooltip
const formatTooltipDate = (dateString) => {
  try {
    const date = new Date(dateString);
    // Adds time zone offset to prevent "day-off" error
    const offsetDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
    return offsetDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  } catch (e) {
    return 'Invalid Date';
  }
};

const TimelineBar = ({
  item,
  itemTopPosition,
  onDateUpdate,
  getPercentFromDate, // Helper from parent
  getDateFromPercent, // Helper from parent
  onBarClick,
  isVisible,
}) => {
  // Local state for real-time visual updates
  const [localStartDate, setLocalStartDate] = useState(item.startDate);
  const [localEndDate, setLocalEndDate] = useState(item.endDate);
  const [isDragging, setIsDragging] = useState(null); // 'start', 'end', or null
  
  // Tooltip state
  const [tooltip, setTooltip] = useState({
    visible: false,
    date: '',
    x: 0,
  });

  const barRef = useRef(null);
  const timelineGridRef = useRef(null); // Ref to the main grid container

  // Reset local dates if the prop changes (e.g., after a parent refetch)
  useEffect(() => {
    setLocalStartDate(item.startDate);
    setLocalEndDate(item.endDate);
  }, [item.startDate, item.endDate]);

  // Find the timeline grid element once
  useEffect(() => {
    // Assumes the grid is the first element with 'overflow-x-auto'
    const grid = document.querySelector('.overflow-x-auto.overflow-y-hidden');
    if (grid) {
      timelineGridRef.current = grid.querySelector('.relative[style*="height"]');
    }
  }, []);

  const handleDragStart = (e, handleSide) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent modal from opening
    setIsDragging(handleSide);

    // Show initial tooltip
    const initialDate = handleSide === 'start' ? localStartDate : localEndDate;
    setTooltip({
      visible: true,
      date: formatTooltipDate(initialDate),
      x: e.clientX,
    });

    document.addEventListener('mousemove', handleDragMove);
    document.addEventListener('mouseup', handleDragEnd);
  };

  const handleDragMove = (e) => {
    if (!isDragging || !timelineGridRef.current) return;

    const gridRect = timelineGridRef.current.getBoundingClientRect();
    const scrollLeft = timelineGridRef.current.parentElement.scrollLeft;

    // Calculate mouse X relative to the timeline grid, accounting for scroll
    const mouseX = e.clientX - gridRect.left + scrollLeft;

    // Convert pixel position to a percentage of the total grid width
    const percent = (mouseX / gridRect.width) * 100;

    // Clamp percentage between 0 and 100
    const clampedPercent = Math.max(0, Math.min(100, percent));
    
    const newDate = getDateFromPercent(clampedPercent);

    // Update the UI optimistically
    if (isDragging === 'start') {
      // Prevent start date from crossing end date
      if (new Date(newDate) < new Date(localEndDate)) {
        setLocalStartDate(newDate);
      }
    } else { // isDragging === 'end'
      // Prevent end date from crossing start date
      if (new Date(newDate) > new Date(localStartDate)) {
        setLocalEndDate(newDate);
      }
    }

    // Update tooltip
    setTooltip({
      visible: true,
      date: formatTooltipDate(newDate),
      x: e.clientX,
    });
  };

  const handleDragEnd = () => {
    if (!isDragging) return;

    // Hide tooltip
    setTooltip({ visible: false, date: '', x: 0 });
    
    // Prepare the data for the PATCH request
    let payload;
    if (isDragging === 'start' && localStartDate !== item.startDate) {
      payload = { start_date: localStartDate };
    } else if (isDragging === 'end' && localEndDate !== item.endDate) {
      payload = { end_date: localEndDate };
    }

    // Only call API if a change was actually made
    if (payload) {
      onDateUpdate(item.id, payload);
    }

    // Clean up
    setIsDragging(null);
    document.removeEventListener('mousemove', handleDragMove);
    document.removeEventListener('mouseup', handleDragEnd);
  };

  // --- Render Logic ---
  if (!isVisible) return null;

  // Calculate bar position based on local state for live dragging
  const startDay = getPercentFromDate(localStartDate);
  const endDay = getPercentFromDate(localEndDate);
  
  const barLeftPercent = startDay;
  const barWidthPercent = endDay - startDay;

  // Dynamic bar color
  const barColorClass =
    item.barColor === 'blue'
      ? 'bg-gradient-to-r from-blue-500 to-cyan-400'
      : 'bg-gradient-to-r from-green-500 to-emerald-400';

  return (
    <>
      {/* Tooltip */}
      {tooltip.visible && (
        <div
          className="fixed z-50 px-2 py-1 text-xs font-medium text-white bg-black rounded shadow-lg"
          style={{
            top: `${itemTopPosition}px`, // Position above bar
            left: `${tooltip.x}px`,     // Follow mouse X
            transform: 'translate(-50%, -120%)', // Center on cursor, offset above
            pointerEvents: 'none',
          }}
        >
          {tooltip.date}
        </div>
      )}

      {/* Main Bar */}
      <div
        ref={barRef}
        className={`absolute h-8 flex items-center rounded transition-all duration-0 z-[5] ${barColorClass} ${isDragging ? 'opacity-80 shadow-lg' : 'hover:opacity-90'}`}
        style={{
          top: `${itemTopPosition}px`,
          left: `${barLeftPercent}%`,
          width: `${barWidthPercent}%`,
          minWidth: '10px', // Minimum 1% width
        }}
        title={`${item.title} (${localStartDate} - ${localEndDate})`}
        onClick={onBarClick}
      >
        {/* Left Drag Handle */}
        <div
          className="absolute left-0 top-0 h-full w-2 cursor-ew-resize flex items-center justify-center rounded-l"
          onMouseDown={(e) => handleDragStart(e, 'start')}
        >
          <div className="h-1/2 w-0.5 bg-white/50 rounded-full"></div>
        </div>

        {/* Bar Title */}
        <span className="relative text-xs font-medium text-white truncate pointer-events-none px-3">
          {item.title}
        </span>

        {/* Right Drag Handle */}
        <div
          className="absolute right-0 top-0 h-full w-2 cursor-ew-resize flex items-center justify-center rounded-r"
          onMouseDown={(e) => handleDragStart(e, 'end')}
        >
          <div className="h-1/2 w-0.5 bg-white/50 rounded-full"></div>
        </div>
      </div>
    </>
  );
};

export default TimelineBar;