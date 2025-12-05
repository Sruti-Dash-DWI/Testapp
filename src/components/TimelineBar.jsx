
import React, { useState, useEffect, useRef } from 'react';


const formatTooltipDate = (dateString) => {
  try {
    const date = new Date(dateString);
    const offsetDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
    return offsetDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  } catch (e) {
    return 'Invalid Date';
  }
};

const formatDateForBackend = (dateInput) => {
  try {
    const d = new Date(dateInput);
    const offsetDate = new Date(d.getTime() - (d.getTimezoneOffset() * 60000));
    return offsetDate.toISOString().split('T')[0];
  } catch (e) {
    return dateInput;
  }
};

const TimelineBar = ({
  item,
  itemTopPosition,
  onDateUpdate,
  getPercentFromDate,
  getDateFromPercent,
  onBarClick,
  isVisible,
}) => {
  
  const [localStartDate, setLocalStartDate] = useState(item.startDate);
  const [localEndDate, setLocalEndDate] = useState(item.endDate);
  const [isDragging, setIsDragging] = useState(null);


  const [tooltip, setTooltip] = useState({ visible: false, date: '', x: 0, y: 0 });

  
  const currentDatesRef = useRef({ start: item.startDate, end: item.endDate });
  const barRef = useRef(null);
  const timelineGridRef = useRef(null);

  
  useEffect(() => {
    if (!isDragging) {
      setLocalStartDate(item.startDate);
      setLocalEndDate(item.endDate);
     
      currentDatesRef.current = { start: item.startDate, end: item.endDate };
    }
  }, [item.startDate, item.endDate, isDragging]);

  
  useEffect(() => {
    const grid = document.querySelector('.overflow-x-auto.overflow-y-hidden');
    if (grid) {
      timelineGridRef.current = grid.querySelector('.relative[style*="height"]');
    }
  }, []);

  

  const handleDragStart = (e, handleSide) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(handleSide);

    
    currentDatesRef.current = { start: localStartDate, end: localEndDate };

    const initialDate = handleSide === 'start' ? localStartDate : localEndDate;
    setTooltip({
      visible: true,
      date: formatTooltipDate(initialDate),
      x: e.clientX,
      y: e.clientY,
    });

    document.addEventListener('mousemove', handleDragMove);
    document.addEventListener('mouseup', handleDragEnd);
  };

  const handleDragMove = (e) => {
    if (!timelineGridRef.current) return;
     const gridRect = timelineGridRef.current.getBoundingClientRect();
    const scrollLeft = timelineGridRef.current.parentElement.scrollLeft;
    const mouseX = e.clientX - gridRect.left + scrollLeft;
    const percent = Math.max(0, Math.min(100, (mouseX / gridRect.width) * 100));
    
    const newDate = getDateFromPercent(percent);

    const currentStart = new Date(currentDatesRef.current.start);
    const currentEnd = new Date(currentDatesRef.current.end);
    const newDateObj = new Date(newDate);
    let updatedStart = currentDatesRef.current.start;
    let updatedEnd = currentDatesRef.current.end; 
    setTooltip(prev => ({ ...prev, visible: true, date: formatTooltipDate(newDate), x: e.clientX, y: e.clientY })); 
  };

 
  const activeHandleRef = useRef(null);

  const stableDragStart = (e, side) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsDragging(side);
    activeHandleRef.current = side; 
    currentDatesRef.current = { start: localStartDate, end: localEndDate }; 

    setTooltip({
      visible: true,
      date: formatTooltipDate(side === 'start' ? localStartDate : localEndDate),
      x: e.clientX,
      y: e.clientY
    });

    document.addEventListener('mousemove', stableDragMove);
    document.addEventListener('mouseup', stableDragEnd);
  }

  const stableDragMove = (e) => {
    if (!activeHandleRef.current || !timelineGridRef.current) return;

    const gridRect = timelineGridRef.current.getBoundingClientRect();
    const scrollLeft = timelineGridRef.current.parentElement.scrollLeft;
    const mouseX = e.clientX - gridRect.left + scrollLeft;
    const percent = Math.max(0, Math.min(100, (mouseX / gridRect.width) * 100));
    const newDate = getDateFromPercent(percent);

  
    const side = activeHandleRef.current;
    const currentStart = new Date(currentDatesRef.current.start);
    const currentEnd = new Date(currentDatesRef.current.end);
    const newDateObj = new Date(newDate);

    let nextStart = currentDatesRef.current.start;
    let nextEnd = currentDatesRef.current.end;

    if (side === 'start') {
      if (newDateObj < currentEnd) {
        nextStart = newDate;
        setLocalStartDate(newDate);
      }
    } else {
      if (newDateObj > currentStart) {
        nextEnd = newDate;
        setLocalEndDate(newDate);
      }
    }

   
    currentDatesRef.current = { start: nextStart, end: nextEnd };

    setTooltip({
      visible: true,
      date: formatTooltipDate(newDate),
      x: e.clientX,
      y: e.clientY
    });
  };

  const stableDragEnd = () => {
    const side = activeHandleRef.current;
    if (!side) return;

    setTooltip(prev => ({ ...prev, visible: false }));
    
    
    document.removeEventListener('mousemove', stableDragMove);
    document.removeEventListener('mouseup', stableDragEnd);
    
  
    setIsDragging(null);
    activeHandleRef.current = null;

   
    const finalStart = currentDatesRef.current.start;
    const finalEnd = currentDatesRef.current.end;

    const payload = {};
    
    const formattedLocalStart = formatDateForBackend(finalStart);
    const formattedLocalEnd = formatDateForBackend(finalEnd);
    const formattedItemStart = formatDateForBackend(item.startDate);
    const formattedItemEnd = formatDateForBackend(item.endDate);

   
    if (side === "start" && formattedLocalStart !== formattedItemStart) {
      payload.start_date = formattedLocalStart;
    }
    if (side === "end" && formattedLocalEnd !== formattedItemEnd) {
      payload.end_date = formattedLocalEnd;
    }

    if (Object.keys(payload).length > 0) {
      onDateUpdate(item.id, payload);
    }
  };


  if (!isVisible) return null;

  const startDay = getPercentFromDate(localStartDate);
  const endDay = getPercentFromDate(localEndDate);
  const barLeftPercent = startDay;
  const barWidthPercent = endDay - startDay;

  const barColorClass = item.barColor === 'blue'
      ? 'bg-gradient-to-r from-blue-500 to-cyan-400'
      : 'bg-gradient-to-r from-green-500 to-emerald-400';

  return (
    <>
      {tooltip.visible && (
        <div
          className="fixed z-50 px-2 py-1 text-xs font-medium text-white bg-black rounded shadow-lg"
          style={{
            top: `${tooltip.y}px`,
            left: `${tooltip.x}px`,
            transform: 'translate(-50%, -150%)',
            pointerEvents: 'none',
          }}
        >
          {tooltip.date}
        </div>
      )}

      <div
        ref={barRef}
        className={`absolute h-8 flex items-center rounded transition-all duration-0 z-[5] ${barColorClass} ${isDragging ? 'opacity-80 shadow-lg' : 'hover:opacity-90'}`}
        style={{
          top: `${itemTopPosition}px`,
          left: `${barLeftPercent}%`,
          width: `${barWidthPercent}%`,
          minWidth: '10px',
        }}
        onClick={onBarClick}
      >
        
        <div
          className="absolute left-0 top-0 h-full w-2 cursor-ew-resize flex items-center justify-center rounded-l"
          onMouseDown={(e) => stableDragStart(e, 'start')}
        >
          <div className="h-1/2 w-0.5 bg-white/50 rounded-full"></div>
        </div>

        <span className="relative text-xs font-medium text-white truncate pointer-events-none px-3">
          {item.title}
        </span>

        
        <div
          className="absolute right-0 top-0 h-full w-2 cursor-ew-resize flex items-center justify-center rounded-r"
          onMouseDown={(e) => stableDragStart(e, 'end')}
        >
          <div className="h-1/2 w-0.5 bg-white/50 rounded-full"></div>
        </div>
      </div>
    </>
  );
};

export default TimelineBar;