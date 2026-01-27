import React, { useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  PieChart, Pie, Cell, AreaChart, Area 
} from 'recharts';
import { 
  FaUsers, FaCrown, FaSearch, FaBell 
} from 'react-icons/fa';

// Make sure this points to your actual Context file
import { useTheme } from '../../../context/ThemeContext.jsx'; 

// --- DUMMY DATA ---
const userActivityData = [
  { name: 'Jan', total: 4000, active: 2400 },
  { name: 'Feb', total: 4500, active: 2800 },
  { name: 'Mar', total: 5000, active: 3200 },
  { name: 'Apr', total: 4800, active: 3100 },
  { name: 'May', total: 6000, active: 4500 },
  { name: 'Jun', total: 7500, active: 5800 },
];

const subscriptionData = [
  { name: 'Jan', subscribers: 120 },
  { name: 'Feb', subscribers: 200 },
  { name: 'Mar', subscribers: 350 },
  { name: 'Apr', subscribers: 450 },
  { name: 'May', subscribers: 600 },
  { name: 'Jun', subscribers: 850 },
];

const projectsData = [
  {
    id: 1,
    name: 'E-Commerce Platform Redesign',
    status: 'In Progress',
    completion: 75,
    lastUpdated: '2 hours ago',
    breakdown: [
      { name: 'Completed', value: 75, color: '#2563eb' },
      { name: 'Remaining', value: 25, color: '#e2e8f0' },
    ]
  },
  {
    id: 2,
    name: 'Mobile App Integration',
    status: 'Review',
    completion: 90,
    lastUpdated: '1 day ago',
    breakdown: [
      { name: 'Completed', value: 90, color: '#2563eb' },
      { name: 'Remaining', value: 10, color: '#e2e8f0' },
    ]
  },
  {
    id: 3,
    name: 'Internal Dashboard CRM',
    status: 'Development',
    completion: 40,
    lastUpdated: '3 days ago',
    breakdown: [
      { name: 'Completed', value: 40, color: '#2563eb' },
      { name: 'Remaining', value: 60, color: '#e2e8f0' },
    ]
  },
  {
    id: 4,
    name: 'Marketing Landing Page',
    status: 'Planning',
    completion: 15,
    lastUpdated: '5 days ago',
    breakdown: [
      { name: 'Completed', value: 15, color: '#2563eb' },
      { name: 'Remaining', value: 85, color: '#e2e8f0' },
    ]
  },
];

const Sareports = () => {
  // 1. Get the colors object from your Context
  const { colors, isDark } = useTheme();
  const [selectedProject, setSelectedProject] = useState(projectsData[0]);

  // 2. Define standard styles using context colors
  const cardStyle = {
    backgroundColor: colors.card,
    borderColor: colors.border,
    color: colors.text,
    borderWidth: '1px',
    borderStyle: 'solid'
  };

  const inputStyle = {
    backgroundColor: isDark ? "rgba(0,0,0,0.2)" : "#f8fafc", // Slight transparency for dark mode input
    borderColor: colors.border,
    color: colors.text,
  };

  return (
    <div 
      className="w-full flex flex-col font-sans transition-colors duration-300 min-h-screen"
      style={{
        backgroundColor: colors.background,
        color: colors.text,
      }}
    >
      <div className="p-6 md:p-8 space-y-8">
        
        {/* --- Page Header --- */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">
              Analytics Overview
            </h2>
            <p className="text-sm mt-1" style={{ color: colors.textSubtle }}>
               Track user growth and project velocity
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative w-full md:w-auto">
               <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 opacity-50" />
               <input 
                 type="text" 
                 placeholder="Search reports..." 
                 className="pl-10 pr-4 py-2.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-64 text-sm transition-all shadow-sm"
                 style={inputStyle}
               />
            </div>
            <button 
              className="p-2.5 rounded-xl border transition-all hover:opacity-80" 
              style={inputStyle}
            >
               <FaBell />
            </button>
          </div>
        </header>

        {/* --- Content Grid --- */}
        <div className="space-y-8">
          
          {/* --- TOP ROW: STATISTICS --- */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* 1. User Statistics (Bar Chart) */}
            <div className="rounded-2xl shadow-sm p-6 transition-all duration-300" style={cardStyle}>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-bold">User Activity</h3>
                  <p className="text-sm" style={{ color: colors.textSubtle }}>Total vs Active Users</p>
                </div>
                <div className="p-3 bg-blue-500/10 rounded-lg text-blue-600">
                  <FaUsers size={20} />
                </div>
              </div>
              
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={userActivityData}>
                    {/* KEY FIX: Use colors.border for grid lines */}
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={colors.border} />
                    
                    {/* KEY FIX: Use colors.textSubtle for Axis Text */}
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: colors.textSubtle, fontSize: 12 }} 
                      dy={10} 
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: colors.textSubtle, fontSize: 12 }} 
                    />
                    
                    {/* KEY FIX: Style Tooltip with colors.card and colors.text */}
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: colors.card, 
                        borderColor: colors.border,
                        color: colors.text,
                        borderRadius: '12px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }}
                      itemStyle={{ color: colors.text }}
                      cursor={{ fill: colors.backgroundHover }} // Hover bar color
                    />
                    <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                    
                    {/* Use border color for the 'Total' bar so it looks ghosted */}
                    <Bar dataKey="total" fill={colors.border} name="Total Users" radius={[4, 4, 0, 0]} barSize={30} />
                    <Bar dataKey="active" fill="#2563eb" name="Active Users" radius={[4, 4, 0, 0]} barSize={30} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* 2. Subscription Statistics (Area Chart) */}
            <div className="rounded-2xl shadow-sm p-6 flex flex-col justify-between transition-all duration-300" style={cardStyle}>
               <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-bold">Subscribers</h3>
                  <p className="text-sm" style={{ color: colors.textSubtle }}>Monthly Growth</p>
                </div>
                <div className="p-3 bg-indigo-500/10 rounded-lg text-indigo-500">
                  <FaCrown size={20} />
                </div>
              </div>

              <div className="mb-4">
                 <h4 className="text-4xl font-bold">850</h4>
                 <p className="text-green-500 text-sm font-medium flex items-center gap-1">
                    +12.5% <span className="font-normal" style={{ color: colors.textSubtle }}>from last month</span>
                 </p>
              </div>

              <div className="h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={subscriptionData}>
                    <defs>
                      <linearGradient id="colorSub" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={colors.border} />
                    <Tooltip 
                        contentStyle={{ 
                            backgroundColor: colors.card, 
                            borderColor: colors.border,
                            color: colors.text,
                            borderRadius: '12px' 
                        }}
                        itemStyle={{ color: colors.text }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="subscribers" 
                      stroke="#2563eb" 
                      strokeWidth={3}
                      fillOpacity={1} 
                      fill="url(#colorSub)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* --- BOTTOM ROW: PROJECTS --- */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column: List of Projects */}
            <div className="lg:col-span-2 rounded-2xl shadow-sm overflow-hidden transition-all duration-300" style={cardStyle}>
              <div className="p-6 border-b flex justify-between items-center" style={{ borderColor: colors.border }}>
                <h3 className="text-lg font-bold">Ongoing Projects</h3>
                <button className="text-sm text-blue-600 font-medium hover:underline">View All</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="text-sm uppercase tracking-wider" style={{ color: colors.textSubtle, backgroundColor: colors.backgroundHover }}>
                      <th className="p-4 font-medium">Project Name</th>
                      <th className="p-4 font-medium">Status</th>
                      <th className="p-4 font-medium">Last Update</th>
                      <th className="p-4 font-medium text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {projectsData.map((project) => (
                      <tr 
                        key={project.id} 
                        onClick={() => setSelectedProject(project)}
                        className="cursor-pointer transition duration-150"
                        style={{ 
                            borderBottom: `1px solid ${colors.border}`,
                            // We use backgroundHover for the active selection
                            backgroundColor: selectedProject.id === project.id 
                                ? (isDark ? 'rgba(37, 99, 235, 0.15)' : '#eff6ff') 
                                : 'transparent' 
                        }}
                      >
                        <td className="p-4 font-medium whitespace-nowrap">{project.name}</td>
                        <td className="p-4 whitespace-nowrap">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold
                            ${project.status === 'Completed' ? 'bg-green-100 text-green-700' : 
                              project.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                              project.status === 'Planning' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'}
                          `}>
                            {project.status}
                          </span>
                        </td>
                        <td className="p-4 text-sm whitespace-nowrap" style={{ color: colors.textSubtle }}>{project.lastUpdated}</td>
                        <td className="p-4 text-right">
                           <button className="text-blue-600 hover:text-blue-500 text-sm font-medium">Details</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Right Column: Project Details (Pie Chart) */}
            <div className="rounded-2xl shadow-sm p-6 flex flex-col items-center justify-center transition-all duration-300" style={cardStyle}>
              <h3 className="text-lg font-bold w-full mb-2">Project Progress</h3>
              <p className="text-sm w-full mb-6" style={{ color: colors.textSubtle }}>
                Detail view for: <span className="text-blue-600 font-semibold">{selectedProject.name}</span>
              </p>

              <div className="relative h-64 w-full flex justify-center items-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={selectedProject.breakdown}
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="none"
                    >
                      {selectedProject.breakdown.map((entry, index) => (
                        <Cell 
                            key={`cell-${index}`} 
                            // FIX: If it's the "Remaining" slice, use the border color (grey/dark grey)
                            fill={entry.name === 'Remaining' ? colors.border : entry.color} 
                        />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: '8px', backgroundColor: colors.card, border: `1px solid ${colors.border}`, color: colors.text }}/>
                  </PieChart>
                </ResponsiveContainer>
                
                {/* Center Text in Pie Chart */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-3xl font-bold">{selectedProject.completion}%</span>
                  <span className="text-xs uppercase" style={{ color: colors.textSubtle }}>Complete</span>
                </div>
              </div>

              <div className="w-full mt-6 space-y-3">
                <div className="flex justify-between items-center text-sm">
                   <span className="flex items-center gap-2" style={{ color: colors.textSubtle }}>
                      <span className="w-3 h-3 rounded-full bg-blue-600"></span> Completed
                   </span>
                   <span className="font-semibold">{selectedProject.completion}%</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                   <span className="flex items-center gap-2" style={{ color: colors.textSubtle }}>
                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: colors.border }}></span> Remaining
                   </span>
                   <span className="font-semibold">{100 - selectedProject.completion}%</span>
                </div>
              </div>

            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Sareports;