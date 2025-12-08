import React, { useState, useMemo, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Search,
  ChevronDown,
  ChevronRight,
  MoreHorizontal,
  User,
  Filter,
  Share,
  Plus,
  CheckCircle,
  AlertCircle,
  XCircle,
  Zap,
  Clock
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import TimelineModal from '../Timelinemodal';
import TimelineBar from '../TimelineBar';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


// --- HELPER FUNCTIONS ---
const getTagColor = (color) => {
  // ... (same as before)
  switch (color) {
    case 'green': return 'bg-green-100 text-green-700';
    case 'red': return 'bg-red-100 text-red-700';
    case 'blue': return 'bg-blue-100 text-blue-700';
    case 'yellow': return 'bg-yellow-100 text-yellow-700';
    default: return 'bg-gray-100 text-gray-700';
  }
};

const dateToDayOfYear = (dateString) => {
  // ... (same as before)
  try {
    const date = new Date(dateString);
    if (isNaN(date)) return 0;
    const yearStart = new Date(date.getFullYear(), 0, 1);
    const dayOfYear = Math.floor((date - yearStart) / (1000 * 60 * 60 * 24)); // 0-364
    return dayOfYear;
  } catch (e) {
    console.error("Error parsing date:", dateString, e);
    return 0;
  }
};
const DAYS_IN_YEAR = 365; // 2025 is not a leap year

// Convert a day of the year (0-364) back to a YYYY-MM-DD string for 2025
const dayOfYearToDate = (dayOfYear) => {
  const date = new Date(2025, 0, 1); // Start at Jan 1, 2025
  // Use setDate(day + 1) because day 0 is Jan 1
  date.setDate(dayOfYear + 1);
  return date.toISOString().split("T")[0]; // Format as YYYY-MM-DD
};

// Get timeline percentage from a date string
const getPercentFromDate = (dateString) => {
  if (!dateString) return 0;
  const day = dateToDayOfYear(dateString);
  return (day / DAYS_IN_YEAR) * 100;
};

// Get a YYYY-MM-DD date string from a timeline percentage
const getDateFromPercent = (percent) => {
  // Round to nearest day
  const day = Math.round((percent / 100) * DAYS_IN_YEAR);
  // Ensure day is within valid range (0-364)
  const clampedDay = Math.max(0, Math.min(DAYS_IN_YEAR - 1, day));
  return dayOfYearToDate(clampedDay);
};

// Helper to map icon names (from API) to JSX components
const getIconComponent = (iconName) => {
  // ... (same as before)
  switch (iconName) {
    case 'checkCircle': return <CheckCircle className="w-3 h-3" />;
    case 'alertCircle': return <AlertCircle className="w-3 h-3" />;
    case 'zap': return <Zap className="w-3 h-3" />;
    case 'clock': return <Clock className="w-3 h-3" />;
    case 'xCircle': return <XCircle className="w-3 h-3" />;
    default: return <Zap className="w-3 h-3" />;
  }
};

//  Helper to process epic data from the API
const processEpicData = (epic) => {
  // ... (same as before)
  const processedTags = Array.isArray(epic.tags)
    ? epic.tags.map(tag => ({
      ...tag,
      icon: getIconComponent(tag.icon)
    }))
    : [];

  return {
    ...epic,
    tags: processedTags,
    startDate: epic.start_date,
    endDate: epic.end_date,
  };
};
// --- END HELPER FUNCTIONS ---

// (Keeping mock data for modal)
const sampleUsers = [
  { id: 1, username: 'Alice' },
  { id: 2, username: 'Bob' },
  { id: 3, username: 'Charlie' },
];
const sampleLabels = [
  { id: 'bug', name: 'Bug' },
  { id: 'feature', name: 'Feature' },
  { id: 'docs', name: 'Documentation' },
];
const sampleTeams = [
  { id: 1, name: 'Frontend' },
  { id: 2, name: 'Backend' },
  { id: 3, name: 'QA' },
];
// --- END MOCK DATA ---

const SmTimeline = () => {
  const [selectedView, setSelectedView] = useState('Months');
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const [epicText, setEpicText] = useState('');
  const [items, setItems] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const { colors } = useTheme();

  const { projectId } = useParams();
  const authToken = localStorage.getItem("authToken");


  const refetchEpics = async () => {
    // --- MODIFIED --- Filter epics by project ID in the request
    if (!projectId) return; // Don't fetch if there's no project ID

    try {
      const response = await fetch(`${API_BASE_URL}/timeline/${projectId}`, { // --- MODIFIED ---
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        }
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      const processedData = data.map(processEpicData);
      setItems(processedData);

    } catch (error) {
      console.error("Error fetching epics:", error);
    }
  };

  useEffect(() => {
    refetchEpics(); // Call on initial load
  }, [projectId, authToken]); // Re-fetch if projectId changes

  // --- MODAL HANDLERS ---
  const handleOpenModal = (item) => {
    setSelectedTask(item);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTask(null);
  };

  const handleTaskUpdate = () => {
    console.log("Task update successful. In a real app, you would refetch data here.");
    refetchEpics();
  };

  // This function handles the PATCH request from the TimelineBar
  const handleBarDateUpdate = async (epicId, newDates) => {
    // 1. Optimistic UI Update (for instant feedback)
    setItems(prevItems =>
      prevItems.map(item =>
        item.id === epicId
          ? {
            ...item,
            // Update camelCase versions for the UI
            startDate: newDates.start_date || item.startDate,
            endDate: newDates.end_date || item.endDate,
            // Also merge snake_case versions
            ...newDates,
          }
          : item
      )
    );

    // 2. Send PATCH request to backend
    try {
      const response = await fetch(
        `${API_BASE_URL}/timeline/epics/${epicId}/dates/`, // Same endpoint as the modal
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify(newDates),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to update epic dates');
      }

      // 3. Refetch to ensure full consistency from server
      console.log("Bar drag update successful. Refetching for consistency.");
      await refetchEpics();

    } catch (error) {
      console.error(`Error updating epic dates:`, error);
      // If failed, refetch to revert the optimistic update
      alert("Failed to save date change. Reverting.");
      await refetchEpics();
    }
  };

  const viewOptions = ['Today', 'Weeks', 'Months', 'Quarters'];
  const statusOptions = [{ id: 'todo', name: 'To Do', checked: false }, { id: 'inprogress', name: 'In Progress', checked: false }, { id: 'done', name: 'Done', checked: false }];

  const handleCreateEpic = () => setShowInput(true);
  const handleInputChange = (e) => setEpicText(e.target.value);

  const handleAddNewEpic = async () => {
    const trimmedTitle = epicText.trim();
    if (!trimmedTitle) {
      setShowInput(false); // Just hide if empty
      return;
    }

    // projectId is now available from useParams()
    if (!projectId) {
      console.error("Project ID is missing from URL.");
      alert("Error: Project ID not found.");
      return;
    }

    // --- MODIFIED --- Payload now includes title and correct projectId
    const payload = {
      title: trimmedTitle,
      project: parseInt(projectId, 10),
    };

    console.log("Sending payload to backend:", payload);
    console.log("Project ID:", projectId);

    const fullUrl = `${API_BASE_URL}/epics/`;
    // authToken is already available from component scope

    try {
      const response = await fetch(fullUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(JSON.stringify(errorData));
      }
      const createdEpic = await response.json();

      // Process and add to state
      const newEpic = processEpicData(createdEpic);

      // --- MODIFIED --- Use correct state setters
      setItems((prev) => [...prev, newEpic]);
      setShowInput(false);
      setEpicText(""); // Clear input

    } catch (error) {
      // --- MODIFIED --- Use console.error and alert as 'setError' is not defined
      console.error("Failed to create epic:", error.message);
      alert(`Failed to create epic. Please try again. \nError: ${error.message}`);
    }
  };
  // --- END MODIFICATION ---


  const toggleItemExpansion = (id) => setItems(items.map(item => item.id === id ? { ...item, isExpanded: !item.isExpanded } : item));

  // ... (rest of the functions: getCurrentDate, today, quarters, generateWeeks, weeks, months, handleViewChange, todayLinePosition, timelineMinWidth)
  const getCurrentDate = () => {
    const now = new Date();
    return {
      month: now.getMonth(), day: now.getDate(), year: now.getFullYear(),
      dayName: now.toLocaleString('en-US', { weekday: 'long' }),
      fullDate: now.toLocaleString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    };
  };
  const today = getCurrentDate();
  const quarters = [{ name: 'Q1 2025', months: ['January', 'February', 'March'], range: 'Jan - Mar' }, { name: 'Q2 2025', months: ['April', 'May', 'June'], range: 'Apr - Jun' }, { name: 'Q3 2025', months: ['July', 'August', 'September'], range: 'Jul - Sep' }, { name: 'Q4 2025', months: ['October', 'November', 'December'], range: 'Oct - Dec' }];
  const generateWeeks = () => {
    const weeksArr = []; let weekNumber = 1;
    for (let i = 0; i < 52; i++) {
      const startDate = new Date(2025, 0, 1 + (i * 7)); const endDate = new Date(2025, 0, 7 + (i * 7));
      weeksArr.push({ name: `Week ${weekNumber}`, index: i, range: `${startDate.getDate()}/${startDate.getMonth() + 1} - ${endDate.getDate()}/${endDate.getMonth() + 1}`, month: startDate.getMonth() });
      weekNumber++;
    } return weeksArr.slice(0, 52);
  };
  const weeks = useMemo(generateWeeks, []);
  const months = [{ name: 'January', short: 'Jan', days: 31 }, { name: 'February', short: 'Feb', days: 28 }, { name: 'March', short: 'Mar', days: 31 }, { name: 'April', short: 'Apr', days: 30 }, { name: 'May', short: 'May', days: 31 }, { name: 'June', short: 'Jun', days: 30 }, { name: 'July', short: 'Jul', days: 31 }, { name: 'August', short: 'Aug', days: 31 }, { name: 'September', short: 'Sep', days: 30 }, { name: 'October', short: 'Oct', days: 31 }, { name: 'November', short: 'Nov', days: 30 }, { name: 'December', short: 'Dec', days: 31 }];
  const handleViewChange = (view) => setSelectedView(view);

  const todayLinePosition = useMemo(() => {
    const now = new Date();
    const currentDayOfYear = dateToDayOfYear(now); // 0-364
    const partialDay = (now.getHours() * 60 + now.getMinutes()) / (24 * 60);
    const percentOfYear = ((currentDayOfYear + partialDay) / DAYS_IN_YEAR) * 100;
    return `${percentOfYear}%`;
  }, [selectedView]);


  const timelineMinWidth = useMemo(() => {
    if (selectedView === 'Weeks') return `${weeks.length * 80}px`;
    if (selectedView === 'Months' || selectedView === 'Quarters') return '1800px';
    return '100%';
  }, [selectedView, weeks.length]);


  // --- START OF STYLED RENDER ---
  return (
    <div
      className="min-h-screen p-4 sm:p-6 lg:p-8"
      style={{ backgroundColor: colors.background }}
    >
      <div
        className="rounded-2xl shadow-lg p-6 w-full max-w-full mx-auto flex flex-col"
        style={{ minHeight: '90vh', backgroundColor: colors.card, color: colors.text }}
      >
        {/* Top Header */}
        <div
          className="flex items-center justify-between pb-4 border-b"
          style={{ borderColor: colors.border }}
        >
          {/* ... (header JSX unchanged) ... */}
          <div>
            <h1 className="text-lg font-semibold" style={{ color: colors.text }}>Project Beta</h1>
            <p className="text-sm" style={{ color: colors.textSubtle }}>Manage your project timeline and epics</p>
          </div>
          <div className="flex items-center space-x-2"> <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 text-sm font-medium"> <Share className="w-4 h-4" /> <span>Share</span> </button> <button onClick={handleCreateEpic} className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 transition-all duration-300 text-sm font-medium"> <Plus className="w-4 h-4" /> <span>Create Epic</span> </button> </div>
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between py-4">
          {/* ... (toolbar JSX unchanged) ... */}
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4" style={{ color: colors.textSubtle }} />
              <input
                type="text"
                placeholder="Search timeline"
                className="pl-9 pr-4 py-2 w-64 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                style={{ backgroundColor: colors.card, color: colors.text, borderColor: colors.border }}
              />
            </div>
            <div className="relative">
              <button
                className="flex items-center gap-2 px-4 py-2 border rounded-lg text-sm"
                onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                style={{ backgroundColor: colors.card, color: colors.text, borderColor: colors.border }}
              >
                All Status
                <ChevronDown className="h-4 w-4" style={{ color: colors.textSubtle }} />
              </button>
              {showStatusDropdown && (
                <div
                  className="absolute top-full left-0 mt-2 w-56 border rounded-lg shadow-xl z-50"
                  style={{ backgroundColor: colors.card, borderColor: colors.border }}
                >
                  <div className="p-3">
                    <div className="space-y-2">
                      {statusOptions.map((status) => (
                        <label key={status.id} className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded" style={{ '--tw-hover-bg-opacity': 0.1 }}>
                          <input type="checkbox" defaultChecked={status.checked} className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                          <span className="text-sm" style={{ color: colors.text }}>{status.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
            <button
              className="flex items-center gap-2 px-4 py-2 border rounded-lg text-sm"
              style={{ backgroundColor: colors.card, color: colors.text, borderColor: colors.border }}
            >
              <Filter className="h-4 w-4" style={{ color: colors.textSubtle }} />
              <span>Filter</span>
            </button>
          </div>
          <div
            className="flex items-center rounded-lg p-0.5"
            style={{ backgroundColor: colors.backgroundHover }}
          >
            {viewOptions.map((option) => (
              <button
                key={option}
                onClick={() => handleViewChange(option)}
                className={`px-3 py-1 text-sm font-medium transition-colors rounded-md`}
                style={
                  selectedView === option
                    ? { backgroundColor: colors.card, color: colors.text }
                    : { backgroundColor: 'transparent', color: colors.textSubtle }
                }
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content Area */}
        <div
          className="flex-1 flex border-t overflow-hidden"
          style={{ borderColor: colors.border }}
        >
          {/* Left Sidebar (Work Items) */}
          <div
            className="w-80 border-r flex-shrink-0 flex flex-col"
            style={{ backgroundColor: colors.card, borderColor: colors.border }}
          >
            <div
              className="flex items-center justify-between p-4 border-b"
              style={{ borderColor: colors.border }}
            >
              <h2 className="text-sm font-semibold" style={{ color: colors.text }}>Work Items</h2>
              <span
                className="text-xs font-medium px-2 py-0.5 rounded-full"
                style={{ color: colors.textSubtle, backgroundColor: colors.backgroundHover }}
              >
                {items.length} epics
              </span>
            </div>
            <div className="flex-1 overflow-y-auto">
              {/* ... (list rendering JSX unchanged) ... */}
              {items.length === 0 && !showInput && (
                <div className="text-center text-sm mt-8 px-4" style={{ color: colors.textSubtle }}>
                  Loading epics... or no items found.
                </div>
              )}
              {items.map((item, index) => (
                <div
                  key={item.id}
                  className={`border-b ${index === 0 ? 'border-t-0' : ''}`}
                  style={{ borderColor: colors.border }}
                >
                  <div
                    className="flex items-start p-4 cursor-pointer"
                    onClick={() => toggleItemExpansion(item.id)}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.backgroundHover}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    {item.isExpanded
                      ? <ChevronDown className="w-4 h-4 mt-1 mr-2 flex-shrink-0" style={{ color: colors.textSubtle }} />
                      : <ChevronRight className="w-4 h-4 mt-1 mr-2 flex-shrink-0" style={{ color: colors.textSubtle }} />
                    }
                    <div className="flex-1">
                      <p
                        className="text-sm font-medium cursor-pointer hover:underline"
                        style={{ color: colors.text }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenModal(item);
                        }}
                      >
                        {item.title}
                      </p>

                      {Array.isArray(item.tags) && item.tags.length > 0 && (
                        <div className="flex items-center flex-wrap gap-1.5 mt-2">
                          {item.tags.map(tag => (
                            <span key={tag.text} className={`flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${getTagColor(tag.color)}`}>
                              {tag.icon || <Zap className="w-3 h-3" />} {tag.text}
                            </span>
                          ))}
                        </div>
                      )}
                      {item.startDate && item.endDate && (
                        <p className="text-xs mt-2" style={{ color: colors.textSubtle }}>{item.startDate} - {item.endDate}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div
              className="p-4 border-t"
              style={{ borderColor: colors.border }}
            >
              {!showInput ? (
                <button onClick={handleCreateEpic} className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm font-medium p-2 rounded-md w-full text-left transition-colors">
                  <Plus className="w-4 h-4" /> Create Epic
                </button>
              ) : (
                <div
                  className="border-2 border-blue-500 rounded-lg p-2 shadow-lg"
                  style={{ backgroundColor: colors.card }}
                >
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-blue-500" />
                    <input
                      type="text"
                      value={epicText}
                      onChange={handleInputChange}
                      onKeyPress={(e) => { if (e.key === 'Enter') handleAddNewEpic() }}
                      onBlur={() => { if (!epicText.trim()) setShowInput(false) }}
                      placeholder="What needs to be done?"
                      className="flex-1 placeholder-gray-400 bg-transparent border-none outline-none text-sm"
                      style={{ color: colors.text }}
                      autoFocus
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Side (Timeline) */}
          <div className="flex-1 overflow-x-auto overflow-y-hidden">
            {/* ... (timeline grid, headers, and bars JSX unchanged) ... */}
            <div className="h-full flex flex-col" style={{ minWidth: timelineMinWidth }}>

              {/* Timeline Header */}
              <div
                className="flex-shrink-0 border-b sticky top-0 z-10"
                style={{ borderColor: colors.border, backgroundColor: colors.backgroundHover }}
              >
                {selectedView === 'Today' && (
                  <div
                    className="py-3 px-4 text-center border-b"
                    style={{ borderColor: colors.border }}
                  >
                    <div className="text-base font-medium" style={{ color: colors.text }}>{today.dayName}, {today.fullDate}</div>
                  </div>
                )}
                {selectedView === 'Months' && (
                  <div className="grid grid-cols-12">
                    {months.map(month => (
                      <div
                        key={month.name}
                        className="py-3 px-2 text-center text-xs font-semibold uppercase tracking-wider border-r"
                        style={{ color: colors.textSubtle, borderColor: colors.border }}
                      >
                        {month.name}
                      </div>
                    ))}
                  </div>
                )}
                {selectedView === 'Quarters' && (
                  <div className="grid grid-cols-4">
                    {quarters.map(q => (
                      <div
                        key={q.name}
                        className="py-3 px-2 text-center text-xs font-semibold uppercase tracking-wider border-r"
                        style={{ color: colors.textSubtle, borderColor: colors.border }}
                      >
                        {q.name} ({q.range})
                      </div>
                    ))}
                  </div>
                )}
                {selectedView === 'Weeks' && (
                  <div className="flex" style={{ width: `${weeks.length * 80}px` }}>
                    {weeks.map(w => (
                      <div
                        key={w.name}
                        className="py-3 px-2 text-center text-xs font-semibold uppercase tracking-wider border-r flex-shrink-0"
                        style={{ width: '80px', color: colors.textSubtle, borderColor: colors.border }}
                      >
                        {w.name}
                        <span className="font-normal normal-case" style={{ color: colors.textSubtle }}>({w.range})</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Timeline Grid Content - Scrollable Vertically */}
              <div className="flex-1 relative overflow-y-auto" style={{ backgroundColor: colors.card }}>
                <div className="relative" style={{ height: `${Math.max(items.length * 72 + 32, 500)}px` }}>

                  {/* Grid Lines (Vertical & Horizontal) & Today Line */}
                  <div className="absolute inset-0 pointer-events-none z-0">
                    {/* Vertical Lines */}
                    {selectedView === 'Months' && (
                      <div className="absolute inset-0 grid grid-cols-12">
                        {months.map(month => (<div key={month.name + '-v-line'} className="border-r h-full" style={{ borderColor: colors.border }}></div>))}
                      </div>
                    )}
                    {selectedView === 'Quarters' && (
                      <div className="absolute inset-0 grid grid-cols-4">
                        {quarters.map(q => (<div key={q.name + '-v-line'} className="border-r h-full" style={{ borderColor: colors.border }}></div>))}
                      </div>
                    )}
                    {selectedView === 'Weeks' && (
                      <div className="absolute inset-0 flex" style={{ width: `${weeks.length * 80}px` }}>
                        {weeks.map(w => (<div key={w.name + '-v-line'} className="border-r h-full flex-shrink-0" style={{ width: '80px', borderColor: colors.border }}></div>))}
                      </div>
                    )}
                    {/* Horizontal Lines */}
                    <div className="absolute inset-0">
                      {items.map((item, index) => (<div key={`row-${item.id}`} className="h-[72px] border-b" style={{ borderColor: colors.border }} ></div>))}
                      {items.length === 0 && <div className="h-[72px] border-b" style={{ borderColor: colors.border }}></div>}
                    </div>
                    {/* Today Line */}
                    {(selectedView === 'Months' || selectedView === 'Quarters' || selectedView === 'Weeks') && (
                      <div className="absolute top-0 bottom-0 w-0.5 bg-red-500 z-10" style={{ left: todayLinePosition }}>
                        <div className="absolute -top-1.5 -left-1.5 w-4 h-4 rounded-full bg-red-500 border-2 shadow" style={{ borderColor: colors.card }}></div>
                      </div>
                    )}
                  </div>

                  {/* Timeline Bars Area */}
                  {items.map((item, index) => {
                    // Calculate top position here to pass to the bar
                    // Formula: 16px top padding + (index * 72px row height) + (half of row height - half of bar height)
                    const itemTopPosition = 16 + (index * 72) + (72 - 32) / 2;

                    // Check visibility based on dates and selected view
                    const isVisible = !!(
                      item.startDate &&
                      item.endDate &&
                      selectedView !== 'Today'
                    );

                    return (
                      <TimelineBar
                        key={item.id}
                        item={item}
                        itemTopPosition={itemTopPosition}
                        onDateUpdate={handleBarDateUpdate} // Passes the PATCH request handler
                        getPercentFromDate={getPercentFromDate} // Passes date -> % helper
                        getDateFromPercent={getDateFromPercent} // Passes % -> date helper
                        onBarClick={() => handleOpenModal(item)} // Passes modal opener
                        isVisible={isVisible}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div
          className="flex items-center justify-between pt-4 border-t mt-auto"
          style={{ borderColor: colors.border }}
        >
          {/* ... (footer JSX unchanged) ... */}
          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500" />
              <span className="text-sm" style={{ color: colors.textSubtle }}>Strict Deadline</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500" />
              <span className="text-sm" style={{ color: colors.textSubtle }}>Flexible Deadline</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500" />
              <span className="text-sm" style={{ color: colors.textSubtle }}>Transit Date</span>
            </label>
          </div>
          <div className="text-sm" style={{ color: colors.textSubtle }}>
            Current View:
            <span className="font-medium" style={{ color: colors.text }}> {selectedView}</span>
          </div>
        </div>
      </div>

      {/* RENDER THE MODAL */}
      <TimelineModal
        show={isModalOpen}
        onHide={handleCloseModal}
        epic={selectedTask}
        onTaskUpdate={handleTaskUpdate}
        users={sampleUsers}
        labelsList={sampleLabels}
        teamsList={sampleTeams}
        parentTasks={items.filter(item => item.id !== selectedTask?.id)}
      />
    </div>
  );
};

export default SmTimeline;