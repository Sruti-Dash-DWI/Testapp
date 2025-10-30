import React, { useState, useMemo } from 'react';
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
import {useTheme} from "../../context/ThemeContext";

// --- HELPER FUNCTIONS ---
const getTagColor = (color) => {
    switch (color) {
        case 'green': return 'bg-green-100 text-green-700';
        case 'red': return 'bg-red-100 text-red-700';
        case 'blue': return 'bg-blue-100 text-blue-700';
        case 'yellow': return 'bg-yellow-100 text-yellow-700';
        default: return 'bg-gray-100 text-gray-700';
    }
};

const monthToIndex = (dateString) => {
    try {
        const date = new Date(dateString);
        if (isNaN(date)) return 0;
        return date.getMonth();
    } catch (e) { console.error("Error parsing date:", dateString, e); return 0; }
};

// Helper to get approximate week index (0-51)
const dateToApproxWeekIndex = (dateString) => {
    try {
        const date = new Date(dateString);
        if (isNaN(date)) return 0;
        const yearStart = new Date(date.getFullYear(), 0, 1);
        // Calculate day number within the year (0-364 or 365)
        const dayOfYear = Math.floor((date - yearStart) / (1000 * 60 * 60 * 24));
        // Approximate week index by dividing by 7
        // Ensure index is within bounds [0, 51]
        return Math.max(0, Math.min(51, Math.floor(dayOfYear / 7)));
    } catch (e) {
        console.error("Error calculating week index:", dateString, e);
        return 0;
    }
};
// --- END HELPER FUNCTIONS ---

// --- STATIC SAMPLE DATA ---
const sampleItems = [
    { id: 1, title: 'User Authentication System', tags: [{ text: 'Completed', color: 'green', icon: <CheckCircle className="w-3 h-3" /> },{ text: 'Strict', color: 'red', icon: <AlertCircle className="w-3 h-3" /> }], startDate: 'Jan 1, 2025', endDate: 'Feb 28, 2025', isExpanded: true, barColor: 'blue' }, // Spans Jan & Feb (Weeks 0-8 approx)
    { id: 4, title: 'Mobile App Development', tags: [ { text: 'Active', color: 'blue', icon: <Zap className="w-3 h-3" /> }, { text: 'Target', color: 'yellow', icon: <AlertCircle className="w-3 h-3" /> }], startDate: 'Jul 1, 2025', endDate: 'Oct 31, 2025', isExpanded: true, barColor: 'orange' }, // Spans Jul, Aug, Sep, Oct (Weeks 26-43 approx)
    { id: 5, title: 'Testing & QA', tags: [ { text: 'Planned', color: 'gray', icon: <Clock className="w-3 h-3" /> }, { text: 'Strict', color: 'red', icon: <AlertCircle className="w-3 h-3" /> }], startDate: 'Oct 15, 2025', endDate: 'Nov 30, 2025', isExpanded: true, barColor: 'green' } // Spans Oct, Nov (Weeks 41-47 approx)
];
// --- END STATIC SAMPLE DATA ---

const Timeline = () => {
    const { theme, toggleTheme, colors } = useTheme();
    const [selectedView, setSelectedView] = useState('Months');
    const [showStatusDropdown, setShowStatusDropdown] = useState(false);
    const [showInput, setShowInput] = useState(false);
    const [epicText, setEpicText] = useState('');
    const [items, setItems] = useState(sampleItems);

  const viewOptions = ['Today', 'Weeks', 'Months', 'Quarters'];
  const statusOptions = [ { id: 'todo', name: 'To Do', checked: false }, { id: 'inprogress', name: 'In Progress', checked: false }, { id: 'done', name: 'Done', checked: false } ];

  const handleCreateEpic = () => setShowInput(true);
  const handleInputChange = (e) => setEpicText(e.target.value);
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && epicText.trim()) {
      const newEpic = { id: Date.now(), title: epicText, tags: [{ text: 'Planned', color: 'gray', icon: <Clock className="w-3 h-3" /> }], startDate: 'Mar 1, 2025', endDate: 'Mar 31, 2025', isExpanded: true, barColor: 'gray' };
      setItems(prevItems => [...prevItems, newEpic]);
      setEpicText(''); setShowInput(false);
    }
  };
  const toggleItemExpansion = (id) => setItems(items.map(item => item.id === id ? { ...item, isExpanded: !item.isExpanded } : item ));
  const getCurrentDate = () => {
    const now = new Date();
    return {
        month: now.getMonth(), day: now.getDate(), year: now.getFullYear(),
        dayName: now.toLocaleDateString('en-US', { weekday: 'long' }),
        fullDate: now.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    };
  };
  const today = getCurrentDate();
  const quarters = [ { name: 'Q1 2025', months: ['January', 'February', 'March'], range: 'Jan - Mar' }, { name: 'Q2 2025', months: ['April', 'May', 'June'], range: 'Apr - Jun' }, { name: 'Q3 2025', months: ['July', 'August', 'September'], range: 'Jul - Sep' }, { name: 'Q4 2025', months: ['October', 'November', 'December'], range: 'Oct - Dec' } ];
  const generateWeeks = () => {
    const weeksArr = []; let weekNumber = 1;
    for (let i = 0; i < 52; i++) {
        const startDate = new Date(2025, 0, 1 + (i * 7)); const endDate = new Date(2025, 0, 7 + (i * 7));
        weeksArr.push({ name: `Week ${weekNumber}`, index: i, range: `${startDate.getDate()}/${startDate.getMonth() + 1} - ${endDate.getDate()}/${endDate.getMonth() + 1}`, month: startDate.getMonth() }); // Added index
        weekNumber++;
    } return weeksArr.slice(0, 52);
  };
  const weeks = useMemo(generateWeeks, []); // Use memo for weeks generation
  const months = [ { name: 'January', short: 'Jan', days: 31 }, { name: 'February', short: 'Feb', days: 28 }, { name: 'March', short: 'Mar', days: 31 }, { name: 'April', short: 'Apr', days: 30 }, { name: 'May', short: 'May', days: 31 }, { name: 'June', short: 'Jun', days: 30 }, { name: 'July', short: 'Jul', days: 31 }, { name: 'August', short: 'Aug', days: 31 }, { name: 'September', short: 'Sep', days: 30 }, { name: 'October', short: 'Oct', days: 31 }, { name: 'November', short: 'Nov', days: 30 }, { name: 'December', short: 'Dec', days: 31 } ];
  const handleViewChange = (view) => setSelectedView(view);
  const todayLinePosition = useMemo(() => {
    const month = today.month; const day = today.day;
    const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    const percentOfMonth = day / (daysInMonth[month] || 30);
    let startPercent = 0;
    if(selectedView === 'Months' || selectedView === 'Quarters') {
         startPercent = (month / 12) * 100 + (percentOfMonth * (100 / 12));
    } else if (selectedView === 'Weeks') {
         const approxWeekIndex = dateToApproxWeekIndex(new Date()); // Get today's week index
         startPercent = (approxWeekIndex / 52) * 100 + ( (new Date().getDay() / 7) * (100 / 52) ); // Position within the week
    }
    return `${startPercent}%`;
  }, [today, selectedView]); // Recalculate if view changes

  // Dynamic minimum width for the timeline area based on view
  const timelineMinWidth = useMemo(() => {
      if (selectedView === 'Weeks') return `${weeks.length * 80}px`; // 80px per week
      if (selectedView === 'Months' || selectedView === 'Quarters') return '1800px'; // Fixed for month/quarter
      return '100%'; // For Today view
  }, [selectedView, weeks.length]);


  // --- START OF STYLED RENDER ---
  return (
    <div className="bg-gray-50 min-h-screen p-4 sm:p-6 lg:p-8"
    style={{
        backgroundColor: colors.background,
        color: colors.text,
        borderColor: colors.border,
      }}
    >
      <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-full mx-auto flex flex-col" style={{ minHeight: '90vh' }}>
        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-200">
            <div> <h1 className="text-lg font-semibold text-gray-900">Project Beta</h1> <p className="text-sm text-gray-500">Manage your project timeline and epics</p> </div>
            <div className="flex items-center space-x-2"> <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 text-sm font-medium"> <Share className="w-4 h-4" /> <span>Share</span> </button> <button onClick={handleCreateEpic} className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 transition-all duration-300 text-sm font-medium"> <Plus className="w-4 h-4" /> <span>Create Epic</span> </button> </div>
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between py-4">
             <div className="flex items-center space-x-2"> <div className="relative"> <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" /> <input type="text" placeholder="Search timeline" className="pl-9 pr-4 py-2 w-64 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white" /> </div> <div className="relative"> <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 bg-white" onClick={() => setShowStatusDropdown(!showStatusDropdown)}> All Status <ChevronDown className="h-4 w-4 text-gray-500" /> </button> {showStatusDropdown && ( <div className="absolute top-full left-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-xl z-50"> <div className="p-3"> <div className="space-y-2"> {statusOptions.map((status) => ( <label key={status.id} className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded"> <input type="checkbox" defaultChecked={status.checked} className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" /> <span className="text-sm text-gray-700">{status.name}</span> </label> ))} </div> </div> </div> )} </div> <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 bg-white"> <Filter className="h-4 w-4 text-gray-500" /> <span>Filter</span> </button> </div>
            <div className="flex items-center bg-gray-100 rounded-lg p-0.5"> {viewOptions.map((option) => ( <button key={option} onClick={() => handleViewChange(option)} className={`px-3 py-1 text-sm font-medium transition-colors rounded-md ${ selectedView === option ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700' }`} > {option} </button> ))} </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex border-t border-gray-200 overflow-hidden">
            {/* Left Sidebar (Work Items) */}
            <div className="w-80 border-r border-gray-200 flex-shrink-0 flex flex-col">
                <div className="flex items-center justify-between p-4 border-b border-gray-200"> <h2 className="text-sm font-semibold text-gray-800">Work Items</h2> <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full"> {items.length} epics </span> </div>
                <div className="flex-1 overflow-y-auto"> {items.length === 0 && !showInput && ( <div className="text-center text-gray-400 text-sm mt-8 px-4"> No work items found. Add one using 'Create Epic'. </div> )} {items.map((item, index) => ( <div key={item.id} className={`border-b border-gray-200 ${index === 0 ? 'border-t-0' : ''}`}> <div className="flex items-start p-4 cursor-pointer hover:bg-gray-50" onClick={() => toggleItemExpansion(item.id)}> {item.isExpanded ? <ChevronDown className="w-4 h-4 text-gray-500 mt-1 mr-2 flex-shrink-0" /> : <ChevronRight className="w-4 h-4 text-gray-500 mt-1 mr-2 flex-shrink-0" />} <div className="flex-1"> <p className="text-sm font-medium text-gray-800">{item.title}</p> {Array.isArray(item.tags) && item.tags.length > 0 && ( <div className="flex items-center flex-wrap gap-1.5 mt-2"> {item.tags.map(tag => ( <span key={tag.text} className={`flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${getTagColor(tag.color)}`}> {tag.icon || <Zap className="w-3 h-3" />} {tag.text} </span> ))} </div> )} {item.startDate && item.endDate && ( <p className="text-xs text-gray-400 mt-2">{item.startDate} - {item.endDate}</p> )} </div> </div> </div> ))} </div>
                <div className="p-4 border-t border-gray-200"> {!showInput ? ( <button onClick={handleCreateEpic} className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm font-medium p-2 rounded-md w-full text-left transition-colors"> <Plus className="w-4 h-4" /> Create Epic </button> ) : ( <div className="bg-white border-2 border-blue-500 rounded-lg p-2 shadow-lg"> <div className="flex items-center gap-2"> <Zap className="w-4 h-4 text-blue-500" /> <input type="text" value={epicText} onChange={handleInputChange} onKeyPress={handleKeyPress} onBlur={() => {if(!epicText.trim()) setShowInput(false)}} placeholder="What needs to be done?" className="flex-1 text-gray-600 placeholder-gray-400 bg-transparent border-none outline-none text-sm" autoFocus /> </div> </div> )} </div>
            </div>

            {/* Right Side (Timeline) */}
            <div className="flex-1 overflow-x-auto overflow-y-hidden">
                <div className="h-full flex flex-col" style={{ minWidth: timelineMinWidth }}> {/* Use dynamic min width */}

                    {/* Timeline Header */}
                    <div className="flex-shrink-0 border-b border-gray-200 bg-gray-50 sticky top-0 z-10">
                       {selectedView === 'Today' && ( <div className="py-3 px-4 text-center border-b border-gray-200"> <div className="text-base font-medium text-gray-800">{today.dayName}, {today.fullDate}</div> </div> )}
                       {selectedView === 'Months' && ( <div className="grid grid-cols-12"> {months.map(month => ( <div key={month.name} className="py-3 px-2 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider border-r border-gray-200"> {month.name} </div> ))} </div> )}
                       {selectedView === 'Quarters' && ( <div className="grid grid-cols-4"> {quarters.map(q => ( <div key={q.name} className="py-3 px-2 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider border-r border-gray-200"> {q.name} ({q.range}) </div> ))} </div> )}
                       {selectedView === 'Weeks' && ( <div className="flex" style={{ width: `${weeks.length * 80}px` }}> {weeks.map(w => ( <div key={w.name} className="py-3 px-2 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider border-r border-gray-200 flex-shrink-0" style={{ width: '80px' }}> {w.name} <span className="font-normal normal-case text-gray-400">({w.range})</span> </div> ))} </div> )}
                    </div>

                    {/* Timeline Grid Content - Scrollable Vertically */}
                    <div className="flex-1 relative overflow-y-auto">
                        {/* Height Container - Defines scroll height */}
                        <div className="relative" style={{ height: `${Math.max(items.length * 72 + 32, 500)}px` }}>

                            {/* Grid Lines (Vertical & Horizontal) & Today Line */}
                            <div className="absolute inset-0 pointer-events-none z-0">
                                {/* Vertical Lines */}
                                {selectedView === 'Months' && (
                                    <div className="absolute inset-0 grid grid-cols-12">
                                        {months.map(month => ( <div key={month.name + '-v-line'} className="border-r border-gray-200 h-full"></div> ))}
                                    </div>
                                )}
                                 {selectedView === 'Quarters' && (
                                    <div className="absolute inset-0 grid grid-cols-4">
                                        {quarters.map(q => ( <div key={q.name + '-v-line'} className="border-r border-gray-200 h-full"></div> ))}
                                    </div>
                                )}
                                {selectedView === 'Weeks' && (
                                    <div className="absolute inset-0 flex" style={{ width: `${weeks.length * 80}px` }}>
                                        {weeks.map(w => ( <div key={w.name + '-v-line'} className="border-r border-gray-200 h-full flex-shrink-0" style={{ width: '80px'}}></div> ))}
                                    </div>
                                )}
                                {/* Horizontal Lines */}
                                <div className="absolute inset-0">
                                    {items.map((item, index) => ( <div key={`row-${item.id}`} className="h-[72px] border-b border-gray-200" ></div> ))}
                                    {items.length === 0 && <div className="h-[72px] border-b border-gray-200"></div> }
                                </div>
                                {/* Today Line */}
                                {(selectedView === 'Months' || selectedView === 'Quarters' || selectedView === 'Weeks') && (
                                     <div className="absolute top-0 bottom-0 w-0.5 bg-red-500 z-10" style={{ left: todayLinePosition }}>
                                         <div className="absolute -top-1.5 -left-1.5 w-4 h-4 rounded-full bg-red-500 border-2 border-white shadow"></div>
                                     </div>
                                )}
                            </div>

                            {/* Timeline Bars Area */}
                            {items.map((item, index) => {
                                // Common calculations
                                if (!item.startDate || !item.endDate || selectedView === 'Today') return null;
                                const itemTopPosition = 16 + (index * 72) + (72 - 32) / 2;
                                const barColorClass = item.barColor === 'blue' ? 'bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500' :
                                                      item.barColor === 'orange' ? 'bg-gradient-to-r from-orange-500 to-yellow-400 hover:from-orange-600 hover:to-yellow-500' :
                                                      item.barColor === 'green' ? 'bg-gradient-to-r from-green-500 to-emerald-400 hover:from-green-600 hover:to-emerald-500' :
                                                      'bg-gray-400 hover:bg-gray-500';
                                const segments = [];

                                // --- MONTHS VIEW LOGIC ---
                                if (selectedView === 'Months') {
                                    const startMonthIdx = monthToIndex(item.startDate);
                                    const endMonthIdx = monthToIndex(item.endDate);
                                    if (endMonthIdx < startMonthIdx) return null; // Basic validation

                                    for (let monthIdx = startMonthIdx; monthIdx <= endMonthIdx; monthIdx++) {
                                        const monthStartPercent = (monthIdx / 12) * 100;
                                        const monthWidthPercent = (1 / 12) * 100;
                                        const segmentWidth = monthWidthPercent * 0.9;
                                        const segmentLeft = monthStartPercent + (monthWidthPercent * 0.05);

                                        segments.push(
                                            <div key={`${item.id}-m-${monthIdx}`} className={`absolute h-8 flex items-center px-3 rounded cursor-pointer transition-all duration-150 z-[5] ${barColorClass}`} style={{ top: `${itemTopPosition}px`, left: `${segmentLeft}%`, width: `${segmentWidth}%`, minWidth: '20px' }} title={`${item.title} (${months[monthIdx]?.name || ''})`}>
                                                <span className="relative text-xs font-medium text-white truncate pointer-events-none">{item.title}</span>
                                            </div>
                                        );
                                    }
                                }
                                // --- WEEKS VIEW LOGIC ---
                                else if (selectedView === 'Weeks') {
                                    const startWeekIdx = dateToApproxWeekIndex(item.startDate);
                                    const endWeekIdx = dateToApproxWeekIndex(item.endDate);
                                    if (endWeekIdx < startWeekIdx) return null; // Basic validation

                                    for (let weekIdx = startWeekIdx; weekIdx <= endWeekIdx; weekIdx++) {
                                        const weekStartPercent = (weekIdx / 52) * 100; // Position based on 52 weeks
                                        const weekWidthPercent = (1 / 52) * 100; // Width based on 52 weeks
                                        const segmentWidth = weekWidthPercent * 0.9;
                                        const segmentLeft = weekStartPercent + (weekWidthPercent * 0.05);

                                        segments.push(
                                            <div key={`${item.id}-w-${weekIdx}`} className={`absolute h-8 flex items-center px-3 rounded cursor-pointer transition-all duration-150 z-[5] ${barColorClass}`} style={{ top: `${itemTopPosition}px`, left: `${segmentLeft}%`, width: `${segmentWidth}%`, minWidth: '10px' }} title={`${item.title} (Week ${weekIdx + 1})`}>
                                                <span className="relative text-[10px] font-medium text-white truncate pointer-events-none">{item.title}</span> {/* Smaller text */}
                                            </div>
                                        );
                                    }
                                }
                                // --- QUARTERS VIEW LOGIC (Placeholder - similar to Months but with 4 cols) ---
                                else if (selectedView === 'Quarters') {
                                     // You would need logic here to determine which quarters the item spans
                                     // and render blocks within the 4 quarter columns.
                                     // Example (simple, needs refinement for accuracy):
                                     const startQuarter = Math.floor(monthToIndex(item.startDate) / 3);
                                     const endQuarter = Math.floor(monthToIndex(item.endDate) / 3);

                                     for (let quarterIdx = startQuarter; quarterIdx <= endQuarter; quarterIdx++) {
                                        const quarterStartPercent = (quarterIdx / 4) * 100;
                                        const quarterWidthPercent = (1 / 4) * 100;
                                        const segmentWidth = quarterWidthPercent * 0.9;
                                        const segmentLeft = quarterStartPercent + (quarterWidthPercent * 0.05);
                                        segments.push(
                                            <div key={`${item.id}-q-${quarterIdx}`} className={`absolute h-8 flex items-center px-3 rounded cursor-pointer transition-all duration-150 z-[5] ${barColorClass}`} style={{ top: `${itemTopPosition}px`, left: `${segmentLeft}%`, width: `${segmentWidth}%`, minWidth: '30px' }} title={`${item.title} (Q${quarterIdx + 1})`}>
                                                <span className="relative text-xs font-medium text-white truncate pointer-events-none">{item.title}</span>
                                            </div>
                                        );
                                     }
                                }


                                return segments; // Render all segments for the current view
                            })}
                        </div>
                    </div>
                </div>
            </div>

        </div>

        {/* Bottom Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200 mt-auto">
             <div className="flex items-center space-x-4"> <label className="flex items-center space-x-2 cursor-pointer"> <input type="checkbox" className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500" /> <span className="text-sm text-gray-600">Strict Deadline</span> </label> <label className="flex items-center space-x-2 cursor-pointer"> <input type="checkbox" className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500" /> <span className="text-sm text-gray-600">Flexible Deadline</span> </label> <label className="flex items-center space-x-2 cursor-pointer"> <input type="checkbox" className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500" /> <span className="text-sm text-gray-600">Transit Date</span> </label> </div> <div className="text-sm text-gray-500"> Current View: <span className="font-medium text-gray-700">{selectedView}</span> </div>
        </div>

      </div>
    </div>
  );
};

export default Timeline;