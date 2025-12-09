import React, { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { 
  Search, 
  Plus, 
  ChevronDown, 
  ChevronRight, 
  Calendar, 
  Target, 
  Circle, 
  Bookmark, 
  User, 
  Loader2,
  X,
  CornerDownRight
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';


const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const STATUS_OPTIONS = ['ON_TRACK', 'AT_RISK', 'OFF_TRACK'];

const Goals = () => {
  const { projectId } = useParams();
  const { colors } = useTheme(); 
  

  const [activeTab, setActiveTab] = useState('all'); 
  const [goals, setGoals] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');


  const [statusFilter, setStatusFilter] = useState('');
  const [ownerFilter, setOwnerFilter] = useState('');
  
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showOwnerDropdown, setShowOwnerDropdown] = useState(false);


  useEffect(() => {
    const fetchGoals = async () => {
      if (!projectId) return;

      setIsLoading(true);
      setError(null);
      
      const authToken = localStorage.getItem('authToken');

      let endpoint = '';
      if (activeTab === 'all') {
        endpoint = `/projects/${projectId}/goals/`; 
      } else if (activeTab === 'mine') {
        endpoint = `/projects/${projectId}/goals/my-goals/`;
      } else if (activeTab === 'off-track') {
        endpoint = `/goals/off-track/?project_id=${projectId}`;
      }

      try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
          }
        });

        if (!response.ok) {
          if (response.status === 401) throw new Error("Unauthorized");
          throw new Error(`Server Error: ${response.status}`);
        }

        const data = await response.json();
        setGoals(data);
      } catch (err) {
        console.error("Failed to fetch goals:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGoals();
    setStatusFilter('');
    setOwnerFilter('');
  }, [projectId, activeTab]);

 
  const uniqueOwners = useMemo(() => {
    const owners = goals.map(g => g.owner_details?.email).filter(Boolean);
    return [...new Set(owners)];
  }, [goals]);

  const filteredGoals = goals.filter(goal => {
    const matchesSearch = goal.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter ? goal.status === statusFilter : true;
    const matchesOwner = ownerFilter ? goal.owner_details?.email === ownerFilter : true;

    return matchesSearch && matchesStatus && matchesOwner;
  });

 
  const formatDate = (dateString) => {
    if (!dateString) return 'No Date';
    const date = new Date(dateString);
    return date.toLocaleString('default', { month: 'short', day: 'numeric' });
  };

  const getStatusStyles = (status) => {
    const s = status?.toUpperCase();
    if (s === 'ON_TRACK') return { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-200', dot: 'bg-green-500' };
    if (s === 'AT_RISK') return { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200', dot: 'bg-yellow-600' };
    if (s === 'OFF_TRACK') return { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', dot: 'bg-red-500' };
    return { bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-200', dot: 'bg-gray-500' };
  };

  const getAvatarColor = (email) => {
    const colors = ['bg-blue-100', 'bg-indigo-100', 'bg-sky-100', 'bg-cyan-100'];
    let hash = 0;
    for (let i = 0; i < email.length; i++) hash = email.charCodeAt(i) + ((hash << 5) - hash);
    return colors[Math.abs(hash) % colors.length];
  };

  const ProgressBar = ({ progress, status }) => {
    const styles = getStatusStyles(status);
    return (
      <div className="flex items-center gap-3 w-full max-w-[140px]">
        <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ backgroundColor: colors.border }}>
          <div 
            className={`h-full rounded-full transition-all duration-500 ${styles.dot}`} 
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="text-xs min-w-[30px]" style={{ color: colors.textSubtle }}>{progress}%</span>
      </div>
    );
  };

 
  return (
    <div className="min-h-screen p-6 md:p-10 font-sans" style={{ backgroundColor: colors.background }}>
      
    
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-4" style={{ color: colors.text }}>Goals</h1>
        <div className="flex items-center justify-between border-b" style={{ borderColor: colors.border }}>
          <div className="flex gap-6">
            {['all', 'mine', 'off-track'].map((tabKey) => {
              const isActive = activeTab === tabKey;
              const labels = { all: 'All goals', mine: 'Your goals', 'off-track': 'Off-track goals' };
              return (
                <button
                  key={tabKey}
                  onClick={() => setActiveTab(tabKey)}
                  className="pb-3 text-sm font-medium transition-colors relative"
                  style={{ 
                    color: isActive ? '#2563EB' : colors.textSubtle, 
                    borderBottom: isActive ? '2px solid #2563EB' : 'none'
                  }}
                >
                  {labels[tabKey]}
                </button>
              );
            })}
          </div>
          <button className="p-1 rounded-full mb-2 hover:opacity-80 transition-opacity" style={{ backgroundColor: colors.backgroundHover }}>
            <Plus className="w-5 h-5" style={{ color: colors.textSubtle }} />
          </button>
        </div>
      </div>


      <div className="space-y-4 mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: colors.textSubtle }} />
          <input 
            type="text" 
            placeholder="Search goals..." 
            className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            style={{ backgroundColor: colors.card, color: colors.text, borderColor: colors.border }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          
          <div className="relative">
            <button 
              onClick={() => { setShowStatusDropdown(!showStatusDropdown); setShowOwnerDropdown(false); }}
              className="flex items-center gap-2 px-3 py-1.5 border rounded-md text-sm shadow-sm transition-colors"
              style={{ 
                backgroundColor: statusFilter ? '#EFF6FF' : colors.card, 
                borderColor: statusFilter ? '#BFDBFE' : colors.border,
                color: statusFilter ? '#1D4ED8' : colors.text
              }}
            >
              <Bookmark className="w-4 h-4" />
              {statusFilter ? statusFilter.replace('_', ' ') : 'Status'}
              <ChevronDown className="w-3 h-3 ml-1" />
            </button>
            {showStatusDropdown && (
              <div className="absolute top-full left-0 mt-2 w-48 border rounded-lg shadow-xl z-50 py-1" style={{ backgroundColor: colors.card, borderColor: colors.border }}>
                <button onClick={() => { setStatusFilter(''); setShowStatusDropdown(false); }} className="w-full text-left px-4 py-2 text-sm flex justify-between" style={{ color: colors.text }}>
                  All Statuses {statusFilter === '' && <X className="w-3 h-3"/>}
                </button>
                {STATUS_OPTIONS.map(status => (
                  <button key={status} onClick={() => { setStatusFilter(status); setShowStatusDropdown(false); }} className="w-full text-left px-4 py-2 text-sm" style={{ color: colors.text }}>
                    {status.replace('_', ' ')}
                  </button>
                ))}
              </div>
            )}
          </div>
          
          <div className="relative">
            <button 
              onClick={() => { setShowOwnerDropdown(!showOwnerDropdown); setShowStatusDropdown(false); }}
              className="flex items-center gap-2 px-3 py-1.5 border rounded-md text-sm shadow-sm transition-colors"
              style={{ 
                backgroundColor: ownerFilter ? '#EFF6FF' : colors.card, 
                borderColor: ownerFilter ? '#BFDBFE' : colors.border,
                color: ownerFilter ? '#1D4ED8' : colors.text
              }}
            >
              <User className="w-4 h-4" />
              {ownerFilter ? ownerFilter.split('@')[0] : 'Owner'}
              <ChevronDown className="w-3 h-3 ml-1" />
            </button>
            {showOwnerDropdown && (
              <div className="absolute top-full left-0 mt-2 w-56 border rounded-lg shadow-xl z-50 py-1" style={{ backgroundColor: colors.card, borderColor: colors.border }}>
                <button onClick={() => { setOwnerFilter(''); setShowOwnerDropdown(false); }} className="w-full text-left px-4 py-2 text-sm flex justify-between" style={{ color: colors.text }}>
                  All Owners {ownerFilter === '' && <X className="w-3 h-3"/>}
                </button>
                {uniqueOwners.map(email => (
                  <button key={email} onClick={() => { setOwnerFilter(email); setShowOwnerDropdown(false); }} className="w-full text-left px-4 py-2 text-sm truncate" style={{ color: colors.text }}>
                    {email}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mb-4 text-sm" style={{ color: colors.textSubtle }}>
        {filteredGoals.length} goals {statusFilter && `(${statusFilter})`}
      </div>


      {isLoading ? (
        <div className="flex justify-center items-center py-20"><Loader2 className="w-8 h-8 animate-spin text-blue-500" /></div>
      ) : error ? (
        <div className="text-center text-red-500 py-10">{error}</div>
      ) : (
        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-[900px] border-collapse">
            <thead>
              <tr className="border-b" style={{ borderColor: colors.border }}>
                <th className="text-left py-3 text-sm font-semibold w-[40%]" style={{ color: colors.textSubtle }}>Name</th>
                <th className="text-left py-3 text-sm font-semibold w-[15%]" style={{ color: colors.textSubtle }}>Status</th>
                <th className="text-left py-3 text-sm font-semibold w-[15%]" style={{ color: colors.textSubtle }}>Target date</th>
                <th className="text-left py-3 text-sm font-semibold w-[15%]" style={{ color: colors.textSubtle }}>Progress</th>
                <th className="text-left py-3 text-sm font-semibold w-[15%]" style={{ color: colors.textSubtle }}>Owner</th>
              </tr>
            </thead>
            <tbody>
              {filteredGoals.length === 0 ? (
                <tr><td colSpan="5" className="py-8 text-center text-sm" style={{ color: colors.textSubtle }}>No goals found.</td></tr>
              ) : (
                filteredGoals.map((goal) => {
                  const styles = getStatusStyles(goal.status);
                  const hasDescription = !!goal.description;

                  return (
                    <React.Fragment key={goal.id}>
                    
                      <tr 
                        className={`group transition-colors ${hasDescription ? 'border-none' : 'border-b'}`}
                        style={{ borderColor: colors.border }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = colors.backgroundHover;
                          if (hasDescription && e.currentTarget.nextElementSibling) {
                            e.currentTarget.nextElementSibling.style.backgroundColor = colors.backgroundHover;
                          }
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                          if (hasDescription && e.currentTarget.nextElementSibling) {
                            e.currentTarget.nextElementSibling.style.backgroundColor = 'transparent';
                          }
                        }}
                      >
                        <td className="py-4 pr-4">
                          <div className="flex items-center gap-2">
                            <button className="p-1 hover:text-opacity-80" style={{ color: colors.textSubtle }}>
                              <ChevronRight className="w-4 h-4" />
                            </button>
                            {goal.id % 2 === 0 ? (
                              <Circle className="w-4 h-4 text-green-500" />
                            ) : (
                              <Target className="w-4 h-4 text-orange-500" />
                            )}
                            <span className="text-sm font-medium cursor-pointer hover:underline" style={{ color: colors.text }}>
                              {goal.title}
                            </span>
                          </div>
                        </td>

                        <td className="py-4">
                          <span className={`px-2 py-1 rounded text-xs font-bold border flex items-center gap-1 w-fit ${styles.bg} ${styles.text} ${styles.border}`}>
                            {goal.status.replace('_', ' ')} 
                          </span>
                        </td>

                        <td className="py-4">
                          <div className="flex items-center gap-2 text-sm" style={{ color: colors.textSubtle }}>
                            <Calendar className="w-4 h-4" />
                            {formatDate(goal.target_date)}
                          </div>
                        </td>

                        <td className="py-4">
                          <ProgressBar progress={goal.progress} status={goal.status} />
                        </td>

                        <td className="py-4">
                          <div className="flex items-center gap-2">
                            <div className={`w-7 h-7 rounded-full ${getAvatarColor(goal.owner_details?.email || '')} flex items-center justify-center text-blue-700 text-xs font-bold border border-blue-200`}>
                               {goal.owner_details?.email ? goal.owner_details.email[0].toUpperCase() : '?'}
                            </div>
                            <div className="text-sm text-blue-600 hover:underline cursor-pointer truncate max-w-[140px]" title={goal.owner_details?.email}>
                               {goal.owner_details?.email || '-'}
                            </div>
                          </div>
                        </td>
                      </tr>

                   
                      {hasDescription && (
                        <tr 
                          className="border-b"
                          style={{ borderColor: colors.border }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = colors.backgroundHover;
                            if (e.currentTarget.previousElementSibling) {
                              e.currentTarget.previousElementSibling.style.backgroundColor = colors.backgroundHover;
                            }
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                            if (e.currentTarget.previousElementSibling) {
                              e.currentTarget.previousElementSibling.style.backgroundColor = 'transparent';
                            }
                          }}
                        >
                          <td colSpan="5" className="pt-0 pb-4 pr-4">
                            <div className="flex items-start gap-3 pl-10">
                              <CornerDownRight className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: colors.textSubtle, opacity: 0.6 }} />
                              <span className="text-sm font-medium leading-relaxed" style={{ color: colors.text }}>
                                {goal.description}
                              </span>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Goals;