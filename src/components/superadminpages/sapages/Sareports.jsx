import React, { useState, useEffect, useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  PieChart, Pie, Cell, AreaChart, Area 
} from 'recharts';
import { 
  FaUsers, FaCrown, FaSearch, FaBell, FaSpinner 
} from 'react-icons/fa';

import { useTheme } from '../../../context/ThemeContext'; 

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// --- DUMMY DATA FOR SUBSCRIPTIONS ---
const subscriptionData = [
  { name: 'Jan', subscribers: 120 },
  { name: 'Feb', subscribers: 200 },
  { name: 'Mar', subscribers: 350 },
  { name: 'Apr', subscribers: 450 },
  { name: 'May', subscribers: 600 },
  { name: 'Jun', subscribers: 850 },
];

const Sareports = () => {
  const { colors, isDark } = useTheme();
  
  // --- STATE ---
  const [userActivityData, setUserActivityData] = useState([]);
  const [projectsList, setProjectsList] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [projectProgress, setProjectProgress] = useState(null);
  
  const [loadingActivity, setLoadingActivity] = useState(true);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(false);

  // --- HELPER: Fill Missing Months ---
  const processActivityData = (apiData) => {
      const filledData = [];
      const today = new Date();
      for (let i = 5; i >= 0; i--) {
          const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
          const year = d.getFullYear();
          const month = String(d.getMonth() + 1).padStart(2, '0');
          const lookupKey = `${year}-${month}`;
          const found = apiData.find(item => item.period === lookupKey);

          filledData.push({
              name: d.toLocaleString('default', { month: 'short' }),
              total: found ? found.total_users : 0,
              active: found ? found.active_users : 0
          });
      }
      return filledData;
  };

  // --- 1. INITIAL DATA FETCH ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const headers = { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        };

        const today = new Date();
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(today.getMonth() - 5);
        sixMonthsAgo.setDate(1);
        
        const toDate = today.toISOString().split('T')[0];
        const fromDate = sixMonthsAgo.toISOString().split('T')[0];

        const [activityRes, projectsRes] = await Promise.all([
          fetch(`${API_BASE_URL}/reports/users/activity?from=${fromDate}&to=${toDate}&interval=month`, { headers }),
          fetch(`${API_BASE_URL}/reports/projects/ongoing?limit=10&offset=0`, { headers })
        ]);

        if (!activityRes.ok || !projectsRes.ok) throw new Error("Failed to fetch data");

        const activityData = await activityRes.json();
        const projectsData = await projectsRes.json();

        setUserActivityData(processActivityData(activityData));

        const formattedProjects = projectsData.results.map(p => ({
            id: p.project_id,
            name: p.project_name,
            org: p.organization_name,
            owner: p.project_owner, 
            status: p.status,
            lastUpdated: new Date(p.last_updated_at).toLocaleString() 
        }));
        
        setProjectsList(formattedProjects);

        if (formattedProjects.length > 0) {
            setSelectedProject(formattedProjects[0]);
        }

      } catch (error) {
        console.error("Dashboard Error:", error);
      } finally {
        setLoadingActivity(false);
        setLoadingProjects(false);
      }
    };

    fetchData();
  }, []);

  // --- 2. FETCH PROJECT PROGRESS ---
  useEffect(() => {
    if (!selectedProject) return;

    let isMounted = true;
    const fetchProgress = async () => {
        setLoadingProgress(true); 
        try {
            const token = localStorage.getItem('authToken');
            const res = await fetch(`${API_BASE_URL}/reports/projects/${selectedProject.id}/progress`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok && isMounted) {
                const data = await res.json();
                setProjectProgress(data);
            }
        } catch (error) {
            console.error("Progress Error:", error);
        } finally {
            if (isMounted) setLoadingProgress(false); 
        }
    };
    fetchProgress();

    return () => { isMounted = false; };
  }, [selectedProject]);

  // --- MEMOIZED DATA ---
  const pieChartData = useMemo(() => {
    if (!projectProgress) return [];
    return [
      { name: 'Completed', value: projectProgress.completion_percentage, color: '#2563eb' },
      { name: 'Remaining', value: 100 - projectProgress.completion_percentage, color: colors.border }
    ];
  }, [projectProgress, colors.border]);

  // --- STYLES ---
  const cardStyle = {
    backgroundColor: colors.card,
    borderColor: colors.border,
    color: colors.text,
    borderWidth: '1px',
    borderStyle: 'solid'
  };

  const inputStyle = {
    backgroundColor: isDark ? "rgba(0,0,0,0.2)" : "#f8fafc", 
    borderColor: colors.border,
    color: colors.text,
  };

  return (
    <div 
      className="w-full flex flex-col font-sans transition-colors duration-300 min-h-screen"
      style={{ backgroundColor: colors.background, color: colors.text }}
    >
      <div className="p-6 md:p-8 space-y-8">
        
        {/* --- Header --- */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Analytics Overview</h2>
            <p className="text-sm mt-1" style={{ color: colors.textSubtle }}>
               Track user growth and project velocity
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative w-full md:w-auto">
               <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 opacity-50" />
               <input 
                 type="text" 
                 placeholder="Search..." 
                 className="pl-10 pr-4 py-2.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-64 text-sm transition-all shadow-sm"
                 style={inputStyle}
               />
            </div>
            <button type="button" className="p-2.5 rounded-xl border hover:opacity-80" style={inputStyle}>
               <FaBell />
            </button>
          </div>
        </header>

        {/* --- Charts Row --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* User Activity Chart */}
            <div className="rounded-2xl shadow-sm p-6 transition-all duration-300" style={cardStyle}>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-bold">User Activity</h3>
                  <p className="text-sm" style={{ color: colors.textSubtle }}>Last 6 Months</p>
                </div>
                <div className="p-3 bg-blue-500/10 rounded-lg text-blue-600"><FaUsers size={20} /></div>
              </div>
              
              <div className="h-64 w-full relative">
                {loadingActivity ? (
                   <div className="absolute inset-0 flex items-center justify-center bg-white/50 z-10">
                      <FaSpinner className="animate-spin text-blue-600 text-2xl" />
                   </div>
                ) : (
                <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                  <BarChart data={userActivityData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={colors.border} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: colors.textSubtle, fontSize: 12 }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: colors.textSubtle, fontSize: 12 }} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: colors.card, borderColor: colors.border, color: colors.text, borderRadius: '12px' }}
                      itemStyle={{ color: colors.text }}
                      cursor={{ fill: colors.backgroundHover }} 
                    />
                    <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                    <Bar dataKey="total" fill={colors.border} name="Total Users" radius={[4, 4, 0, 0]} barSize={30} />
                    <Bar dataKey="active" fill="#2563eb" name="Active Users" radius={[4, 4, 0, 0]} barSize={30} />
                  </BarChart>
                </ResponsiveContainer>
                )}
              </div>
            </div>

            {/* Subscription Chart */}
            <div className="rounded-2xl shadow-sm p-6 flex flex-col justify-between transition-all duration-300" style={cardStyle}>
               <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-bold">Subscribers</h3>
                  <p className="text-sm" style={{ color: colors.textSubtle }}>Monthly Growth</p>
                </div>
                <div className="p-3 bg-indigo-500/10 rounded-lg text-indigo-500"><FaCrown size={20} /></div>
              </div>
              <div className="mb-4">
                 <h4 className="text-4xl font-bold">850</h4>
                 <p className="text-green-500 text-sm font-medium flex items-center gap-1">+12.5%</p>
              </div>
              <div className="h-40 w-full">
                <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                  <AreaChart data={subscriptionData}>
                    <defs>
                      <linearGradient id="colorSub" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={colors.border} />
                    <Tooltip contentStyle={{ backgroundColor: colors.card, borderColor: colors.border, borderRadius: '12px' }} itemStyle={{ color: colors.text }}/>
                    <Area type="monotone" dataKey="subscribers" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#colorSub)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
        </div>

        {/* --- Bottom Projects Section --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Project List */}
            <div className="lg:col-span-2 rounded-2xl shadow-sm overflow-hidden transition-all duration-300" style={cardStyle}>
              <div className="p-6 border-b flex justify-between items-center" style={{ borderColor: colors.border }}>
                <h3 className="text-lg font-bold">Ongoing Projects</h3>
                <button type="button" className="text-sm text-blue-600 font-medium hover:underline">View All</button>
              </div>
              <div className="overflow-x-auto relative">
                 {loadingProjects && (
                    <div className="absolute inset-0 bg-white/50 z-10 flex items-center justify-center">
                        <FaSpinner className="animate-spin text-blue-600 text-2xl" />
                    </div>
                 )}
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="text-sm uppercase tracking-wider" style={{ color: colors.textSubtle, backgroundColor: colors.backgroundHover }}>
                      <th className="p-4 font-medium">Project Name</th>
                      <th className="p-4 font-medium">Organization</th>
                      <th className="p-4 font-medium">Owner</th>
                      <th className="p-4 font-medium">Status</th>
                      <th className="p-4 font-medium">Last Update</th>
                      <th className="p-4 font-medium text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {projectsList.map((project) => (
                      <tr 
                        key={project.id} 
                        onClick={(e) => {
                            e.preventDefault();
                            setSelectedProject(project);
                        }}
                        className="cursor-pointer transition duration-150"
                        style={{ 
                            borderBottom: `1px solid ${colors.border}`,
                            backgroundColor: selectedProject?.id === project.id ? (isDark ? 'rgba(37, 99, 235, 0.15)' : '#eff6ff') : 'transparent' 
                        }}
                      >
                        <td className="p-4 font-medium whitespace-nowrap">
                            {project.name}
                        </td>
                        <td className="p-4 text-sm whitespace-nowrap" style={{ color: colors.textSubtle }}>
                            {project.org}
                        </td>
                        <td className="p-4 text-sm whitespace-nowrap text-blue-500/90">
                            {project.owner}
                        </td>
                        <td className="p-4 whitespace-nowrap">
                          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                            {project.status}
                          </span>
                        </td>
                        <td className="p-4 text-sm whitespace-nowrap" style={{ color: colors.textSubtle }}>{project.lastUpdated}</td>
                        <td className="p-4 text-right">
                           <button 
                             type="button" 
                             className="text-blue-600 hover:text-blue-500 text-sm font-medium"
                             onClick={(e) => {
                                 e.preventDefault();
                                 e.stopPropagation();
                                 setSelectedProject(project);
                             }}
                           >
                             Details
                           </button>
                        </td>
                      </tr>
                    ))}
                    {projectsList.length === 0 && !loadingProjects && (
                         <tr><td colSpan="6" className="p-8 text-center opacity-50">No projects found.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Project Details Chart */}
            <div className="rounded-2xl shadow-sm p-6 flex flex-col items-center justify-center transition-all duration-300 relative" style={cardStyle}>
              
              {loadingProgress && (
                  <div className="absolute inset-0 bg-white/60 dark:bg-black/30 z-20 flex items-center justify-center rounded-2xl backdrop-blur-sm">
                      <FaSpinner className="animate-spin text-blue-600 text-3xl" />
                  </div>
              )}

              {!projectProgress && !loadingProgress ? (
                  <div className="h-64 flex items-center justify-center opacity-50">Select a Project</div>
              ) : (
                projectProgress && (
                <>
                <h3 className="text-lg font-bold w-full mb-2">Project Progress</h3>
                <p className="text-sm w-full mb-6" style={{ color: colors.textSubtle }}>
                    Detail view for: <span className="text-blue-600 font-semibold">{projectProgress.project_name}</span>
                </p>
                
                <div className="relative h-64 w-full flex justify-center items-center">
                    <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                    <PieChart>
                        <Pie data={pieChartData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value" stroke="none">
                        {pieChartData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                        </Pie>
                        <Tooltip contentStyle={{ borderRadius: '8px', backgroundColor: colors.card, border: `1px solid ${colors.border}`, color: colors.text }}/>
                    </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-3xl font-bold">{projectProgress.completion_percentage}%</span>
                    <span className="text-xs uppercase" style={{ color: colors.textSubtle }}>Complete</span>
                    </div>
                </div>

                <div className="w-full mt-6 space-y-3">
                    <div className="flex justify-between items-center text-sm">
                    <span className="flex items-center gap-2" style={{ color: colors.textSubtle }}>
                        <span className="w-3 h-3 rounded-full bg-blue-600"></span> Completed Tasks
                    </span>
                    <span className="font-semibold">{projectProgress.completed_tasks}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                    <span className="flex items-center gap-2" style={{ color: colors.textSubtle }}>
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: colors.border }}></span> Remaining Tasks
                    </span>
                    <span className="font-semibold">{projectProgress.remaining_tasks}</span>
                    </div>
                </div>
                </>
                )
              )}
            </div>

        </div>
      </div>
    </div>
  );
};

export default Sareports;