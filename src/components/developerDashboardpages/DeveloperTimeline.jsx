import React, { useState } from 'react';
import { Search, ChevronDown, ChevronRight, MoreHorizontal, Grid3X3, User } from 'lucide-react';

const DeveloperTimeline = () => {
  const [selectedView, setSelectedView] = useState('Months');
  const [showDays, setShowDays] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const [epicText, setEpicText] = useState('');
  const [epics, setEpics] = useState([]);

  const viewOptions = ['Today', 'Weeks', 'Months', 'Quarters'];

  // Status options
  const statusOptions = [
    { id: 'todo', name: 'To Do', checked: false },
    { id: 'inprogress', name: 'In Progress', checked: false },
    { id: 'done', name: 'Done', checked: false }
  ];

  // Handle Epic Creation
  const handleCreateEpic = () => {
    setShowInput(true);
  };

  const handleInputChange = (e) => {
    setEpicText(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && epicText.trim()) {
      const newEpic = {
        id: Date.now(),
        title: epicText,
        status: 'To Do',
        createdAt: new Date().toLocaleDateString()
      };
      setEpics([...epics, newEpic]);
      setEpicText('');
      setShowInput(false);
    }
  };

  // Get current date dynamically
  const getCurrentDate = () => {
    const now = new Date();
    return {
      month: now.getMonth(),
      day: now.getDate(),
      year: now.getFullYear(),
      dayName: now.toLocaleDateString('en-US', { weekday: 'long' }),
      fullDate: now.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })
    };
  };

  const today = getCurrentDate();

  // Quarters data
  const quarters = [
    { name: 'Q1 2025', months: ['January', 'February', 'March'], range: 'Jan - Mar' },
    { name: 'Q2 2025', months: ['April', 'May', 'June'], range: 'Apr - Jun' },
    { name: 'Q3 2025', months: ['July', 'August', 'September'], range: 'Jul - Sep' },
    { name: 'Q4 2025', months: ['October', 'November', 'December'], range: 'Oct - Dec' }
  ];

  // Weeks data
  const generateWeeks = () => {
    const weeks = [];
    let weekNumber = 1;
    for (let i = 0; i < 52; i++) {
      const startDate = new Date(2025, 0, 1 + (i * 7));
      const endDate = new Date(2025, 0, 7 + (i * 7));
      weeks.push({
        name: `Week ${weekNumber}`,
        range: `${startDate.getDate()}/${startDate.getMonth() + 1} - ${endDate.getDate()}/${endDate.getMonth() + 1}`,
        month: startDate.getMonth()
      });
      weekNumber++;
    }
    return weeks.slice(0, 52);
  };

  const weeks = generateWeeks();

  // 2025 calendar data
  const months = [
    { name: 'January', short: 'Jan', days: 31, startDay: 3 },
    { name: 'February', short: 'Feb', days: 28, startDay: 6 },
    { name: 'March', short: 'Mar', days: 31, startDay: 6 },
    { name: 'April', short: 'Apr', days: 30, startDay: 2 },
    { name: 'May', short: 'May', days: 31, startDay: 4 },
    { name: 'June', short: 'Jun', days: 30, startDay: 0 },
    { name: 'July', short: 'Jul', days: 31, startDay: 2 },
    { name: 'August', short: 'Aug', days: 31, startDay: 5 },
    { name: 'September', short: 'Sep', days: 30, startDay: 1 },
    { name: 'October', short: 'Oct', days: 31, startDay: 3 },
    { name: 'November', short: 'Nov', days: 30, startDay: 6 },
    { name: 'December', short: 'Dec', days: 31, startDay: 1 }
  ];

  const generateCalendarData = () => {
    const calendarData = [];
    
    months.forEach((month, monthIndex) => {
      const monthData = {
        ...month,
        monthIndex,
        weeks: []
      };

      let currentWeek = [];
      
      for (let i = 0; i < month.startDay; i++) {
        currentWeek.push({ type: 'empty' });
      }
      
      for (let day = 1; day <= month.days; day++) {
        const isToday = monthIndex === today.month && day === today.day;
        currentWeek.push({
          type: 'day',
          day,
          isToday,
          monthIndex
        });
        
        if (currentWeek.length === 7 || day === month.days) {
          while (currentWeek.length < 7) {
            currentWeek.push({ type: 'empty' });
          }
          monthData.weeks.push(currentWeek);
          currentWeek = [];
        }
      }
      
      while (monthData.weeks.length < 6) {
        monthData.weeks.push(Array(7).fill({ type: 'empty' }));
      }
      
      calendarData.push(monthData);
    });
    
    return calendarData;
  };

  const handleViewChange = (view) => {
    setSelectedView(view);
    setShowDays(false);
  };

  const calendarData = generateCalendarData();
  const dayLabels = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  return (
    <div className="bg-gradient-to-br from-purple-300 via-pink-300 to-pink-400 h-screen flex flex-col">
      {/* Top Header */}
      <div className="bg-gradient-to-r from-purple-200 to-pink-200 border-b border-purple-300 px-6 py-3 flex items-center justify-between flex-shrink-0 shadow-sm">
        {/* Left side - Search and Status */}
        <div className="flex items-center gap-4">
          {/* Search Timeline */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-purple-600" />
            <input
              type="text"
              placeholder="Search timeline"
              className="pl-10 pr-4 py-2 w-64 border border-purple-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white/80 backdrop-blur-sm"
            />
          </div>

          {/* User Avatar */}
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-purple-700" />
          </div>

          {/* Status Category Dropdown */}
          <div className="relative">
            <button 
              className="flex items-center gap-2 px-3 py-2 border border-purple-400 rounded-md text-sm text-purple-800 hover:bg-purple-100 bg-white/80 backdrop-blur-sm"
              onClick={() => setShowStatusDropdown(!showStatusDropdown)}
            >
              Status category
              <ChevronDown className="h-4 w-4" />
            </button>
            
            {showStatusDropdown && (
              <div className="absolute top-full left-0 mt-2 w-56 bg-white/95 backdrop-blur-sm border border-purple-200 rounded-lg shadow-xl z-50">
                <div className="p-3">
                  <div className="space-y-2">
                    {statusOptions.map((status) => (
                      <label key={status.id} className="flex items-center gap-3 cursor-pointer hover:bg-purple-50 p-2 rounded">
                        <input
                          type="checkbox"
                          defaultChecked={status.checked}
                          className="h-4 w-4 text-purple-600 border-purple-300 rounded focus:ring-purple-500"
                        />
                        <span className="text-sm text-gray-700">{status.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right side - Actions */}
        <div className="flex items-center gap-3">
          <button className="p-2 text-purple-600 hover:text-purple-800 hover:bg-purple-100 rounded-md">
            <Grid3X3 className="h-4 w-4" />
          </button>
          <button className="p-2 text-purple-600 hover:text-purple-800 hover:bg-purple-100 rounded-md">
            <MoreHorizontal className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <div className="w-80 bg-gradient-to-b from-purple-200 to-pink-200 border-r border-purple-300 flex flex-col flex-shrink-0">
          {/* Work Section Header */}
          <div className="px-6 py-4 bg-gradient-to-r from-white/90 to-pink-50/90 backdrop-blur-sm border-b border-purple-300">
            <h2 className="text-lg font-medium text-gray-900 mb-3">Work</h2>
            
            {/* Create Epic Section */}
            {!showInput ? (
              <button 
                onClick={handleCreateEpic}
                className="flex items-center gap-2 text-purple-700 hover:text-purple-900 text-sm font-medium hover:bg-purple-100 p-2 rounded-md w-full text-left transition-colors"
              >
                <span className="text-lg">+</span>
                Create Epic
              </button>
            ) : (
              <div className="bg-white/90 backdrop-blur-sm border-2 border-purple-400 rounded-lg p-3 shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="text-purple-600">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    value={epicText}
                    onChange={handleInputChange}
                    onKeyPress={handleKeyPress}
                    placeholder="What needs to be done?"
                    className="flex-1 text-gray-600 placeholder-gray-400 bg-transparent border-none outline-none text-sm"
                    autoFocus
                  />
                  <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Epics List */}
          <div className="flex-1 bg-gradient-to-b from-purple-200/50 to-pink-200/50 p-4">
            {epics.length > 0 ? (
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Epics</h3>
                {epics.map((epic) => (
                  <div key={epic.id} className="bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-sm border border-purple-200 hover:shadow-md transition-shadow">
                    <div className="flex items-start gap-3">
                      <div className="text-purple-600 mt-0.5">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{epic.title}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="inline-block px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded">
                            {epic.status}
                          </span>
                          <span className="text-xs text-gray-500">{epic.createdAt}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500 text-sm mt-8">
                <p>No epics created yet</p>
                <p className="text-xs mt-1">Click "Create Epic" to get started</p>
              </div>
            )}
          </div>
        </div>

        {/* Timeline Area */}
        <div className="flex-1 bg-gradient-to-br from-purple-200 to-pink-200 relative overflow-hidden">
          <div className="overflow-x-auto h-full">
            <div style={{ minWidth: '1200px' }} className="h-full flex flex-col">
              {/* Timeline Header */}
              <div className="bg-gradient-to-r from-white/95 to-pink-50/95 backdrop-blur-sm border-b border-purple-400 flex-shrink-0 shadow-sm">
                
                {/* Quarters View */}
                {selectedView === 'Quarters' && (
                  <div className="grid grid-cols-4 border-b border-purple-400">
                    {quarters.map((quarter, index) => (
                      <div key={index} className="text-center py-4 border-r border-purple-400 last:border-r-0 bg-gradient-to-b from-white/90 to-pink-50/90">
                        <div className="text-sm font-medium text-gray-900">{quarter.name}</div>
                        <div className="text-xs text-gray-600 mt-1">{quarter.range}</div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Weeks View */}
                {selectedView === 'Weeks' && (
                  <div className="overflow-x-auto">
                    <div className="grid grid-cols-52 border-b border-purple-400" style={{ minWidth: '2600px' }}>
                      {weeks.map((week, index) => (
                        <div key={index} className="text-center py-3 border-r border-purple-400 last:border-r-0 bg-gradient-to-b from-white/90 to-pink-50/90" style={{ minWidth: '50px' }}>
                          <div className="text-xs font-medium text-gray-900">{week.name}</div>
                          <div className="text-xs text-gray-600 mt-1">{week.range}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Months View */}
                {selectedView === 'Months' && (
                  <>
                    <div className="grid grid-cols-12 border-b border-purple-400">
                      {calendarData.map((month, index) => (
                        <div 
                          key={index} 
                          className="text-center py-4 border-r border-purple-400 last:border-r-0 bg-gradient-to-b from-white/90 to-pink-50/90 cursor-pointer hover:bg-pink-100/80 transition-colors"
                          onClick={() => setShowDays(!showDays)}
                        >
                          <span className="text-sm font-medium text-gray-900">{month.name}</span>
                        </div>
                      ))}
                    </div>

                    {showDays && (
                      <>
                        <div className="grid grid-cols-12 bg-pink-50/80 border-b border-purple-400">
                          {calendarData.map((month, monthIndex) => (
                            <div key={monthIndex} className="border-r border-purple-400 last:border-r-0">
                              <div className="grid grid-cols-7">
                                {dayLabels.map((day, dayIndex) => (
                                  <div
                                    key={dayIndex}
                                    className="text-center py-2 text-xs font-medium text-gray-600 border-r border-purple-300 last:border-r-0"
                                  >
                                    {day}
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="grid grid-cols-12 bg-white/90">
                          {calendarData.map((month, monthIndex) => (
                            <div key={monthIndex} className="border-r border-purple-400 last:border-r-0">
                              {month.weeks.map((week, weekIndex) => (
                                <div key={weekIndex} className="grid grid-cols-7">
                                  {week.map((cell, dayIndex) => (
                                    <div
                                      key={dayIndex}
                                      className={`h-8 text-xs flex items-center justify-center border-purple-300 last:border-r-0 ${
                                        cell.type === 'empty'
                                          ? 'bg-pink-50/50'
                                          : cell.isToday
                                          ? 'bg-pink-400 text-white font-bold'
                                          : 'text-gray-700 hover:bg-pink-50'
                                      }`}
                                    >
                                      {cell.type === 'day' ? cell.day : ''}
                                    </div>
                                  ))}
                                </div>
                              ))}
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </>
                )}

                {/* Today View */}
                {selectedView === 'Today' && (
                  <div className="border-b border-purple-400">
                    <div className="text-center py-4 bg-gradient-to-r from-purple-200 to-pink-200 border-b border-purple-400">
                      <div className="text-lg font-medium text-gray-900">Today - {today.fullDate}</div>
                      <div className="text-sm text-gray-600 mt-1">{today.dayName}</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Timeline Content Area */}
              <div className="flex-1 bg-gradient-to-br from-purple-200 to-pink-200 relative">
                {/* Current Date Indicator Line */}
                {selectedView === 'Months' && (
                  <div 
                    className="absolute top-0 bottom-0 w-0.5 bg-gradient-to-b from-pink-500 to-pink-600 z-10 shadow-sm"
                    style={{ 
                      left: `${((today.month + (today.day / 31)) / 12) * 100}%`
                    }}
                  />
                )}
                
                {/* Timeline Grid Lines */}
                {selectedView === 'Quarters' && (
                  <div className="absolute inset-0 grid grid-cols-4">
                    {quarters.map((quarter, quarterIndex) => (
                      <div key={quarterIndex} className="border-r border-purple-400 last:border-r-0 h-full" />
                    ))}
                  </div>
                )}

                {selectedView === 'Weeks' && (
                  <div className="absolute inset-0 overflow-x-auto">
                    <div className="grid grid-cols-52 h-full" style={{ minWidth: '2600px' }}>
                      {weeks.map((week, weekIndex) => (
                        <div key={weekIndex} className="border-r border-purple-400 last:border-r-0 h-full" style={{ minWidth: '50px' }} />
                      ))}
                    </div>
                  </div>
                )}

                {selectedView === 'Months' && (
                  <div className="absolute inset-0 grid grid-cols-12">
                    {calendarData.map((month, monthIndex) => (
                      <div key={monthIndex} className="border-r border-purple-400 last:border-r-0">
                        {showDays && (
                          <div className="grid grid-cols-7 h-full">
                            {Array.from({ length: 7 }).map((_, dayIndex) => (
                              <div
                                key={dayIndex}
                                className="border-r border-purple-300 last:border-r-0 h-full"
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {selectedView === 'Today' && (
                  <div className="absolute inset-0">
                    <div className="w-full h-full border-r border-purple-400" />
                  </div>
                )}

                {/* Epic Timeline Bars */}
                <div className="relative z-5 p-4">
                  {epics.map((epic, index) => (
                    <div 
                      key={epic.id} 
                      className="mb-3 flex items-center"
                      style={{ paddingTop: `${index * 40}px` }}
                    >
                      <div className="bg-gradient-to-r from-pink-500 to-pink-600 text-white px-3 py-2 rounded text-sm font-medium shadow-lg hover:shadow-xl transition-shadow">
                        {epic.title}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-6 right-6 z-30">
        <div className="flex items-center bg-white/95 backdrop-blur-sm rounded-lg shadow-xl border border-purple-200 overflow-hidden">
          {viewOptions.map((option, index) => (
            <button
              key={option}
              onClick={() => handleViewChange(option)}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                selectedView === option
                  ? 'bg-gradient-to-r from-pink-500 to-pink-600 text-white'
                  : 'text-gray-700 hover:bg-pink-100'
              } ${index > 0 ? 'border-l border-purple-200' : ''}`}
            >
              {option}
            </button>
          ))}
          
          <div className="flex items-center border-l border-purple-200">
            <button className="px-3 py-2 text-purple-600 hover:text-purple-800 hover:bg-pink-100">
              <div className="w-5 h-5 rounded-full bg-gradient-to-r from-pink-500 to-pink-600 flex items-center justify-center">
                <span className="text-xs text-white font-bold">?</span>
              </div>
            </button>
            <button className="px-2 py-2 text-purple-600 hover:text-purple-800 hover:bg-pink-100">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeveloperTimeline;