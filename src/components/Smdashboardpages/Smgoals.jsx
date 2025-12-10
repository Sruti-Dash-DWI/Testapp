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
  X
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const STATUS_OPTIONS = ['ON_TRACK', 'AT_RISK', 'OFF_TRACK'];

const Smgoals = () => {
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
      if (activeTab === 'all') endpoint = `/projects/${projectId}/goals/`;
      else if (activeTab === 'mine') endpoint = `/projects/${projectId}/goals/my-goals/`;
      else if (activeTab === 'off-track') endpoint = `/goals/off-track/?project_id=${projectId}`;

      try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
          }
        });
        if (!response.ok) throw new Error(`Server Error: ${response.status}`);
        const data = await response.json();
        setGoals(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchGoals();
  }, [projectId, activeTab]);

  const uniqueOwners = useMemo(() => {
    const owners = goals.map(g => g.owner_details?.email).filter(Boolean);
    return [...new Set(owners)];
  }, [goals]);

  const filteredGoals = goals.filter(goal => {
    const content = (goal.description || goal.title || "").toLowerCase();
    return content.includes(searchQuery.toLowerCase()) &&
           (statusFilter ? goal.status === statusFilter : true) &&
           (ownerFilter ? goal.owner_details?.email === ownerFilter : true);
  });

  const formatDate = (dateString) => {
    if (!dateString) return 'No Date';
    return new Date(dateString).toLocaleString('default', { month: 'short', day: 'numeric' });
  };

  const getStatusStyles = (status) => {
    const s = status?.toUpperCase();
    if (s === 'ON_TRACK') return { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-200', dot: 'bg-green-500' };
    if (s === 'AT_RISK') return { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200', dot: 'bg-yellow-600' };
    if (s === 'OFF_TRACK') return { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', dot: 'bg-red-500' };
    return { bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-200', dot: 'bg-gray-500' };
  };

  const getAvatarColor = (email) => {
    const avatarColors = ['bg-blue-100', 'bg-indigo-100', 'bg-sky-100', 'bg-cyan-100'];
    let hash = 0;
    for (let i = 0; i < email.length; i++) hash = email.charCodeAt(i) + ((hash << 5) - hash);
    return avatarColors[Math.abs(hash) % avatarColors.length];
  };

  return (
    <div className="min-h-screen p-6 md:p-10" style={{ backgroundColor: colors.background }}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-4" style={{ color: colors.text }}>Goals</h1>
        <div className="flex items-center justify-between border-b" style={{ borderColor: colors.border }}>
          <div className="flex gap-6">
            {['all', 'mine', 'off-track'].map((tabKey) => (
              <button
                key={tabKey}
                onClick={() => setActiveTab(tabKey)}
                className="pb-3 text-sm font-medium transition-colors"
                style={{ 
                  color: activeTab === tabKey ? '#2563EB' : colors.textSubtle, 
                  borderBottom: activeTab === tabKey ? '2px solid #2563EB' : 'none'
                }}
              >
                {tabKey === 'all' ? 'All goals' : tabKey === 'mine' ? 'Your goals' : 'Off-track goals'}
              </button>
            ))}
          </div>
          <button className="p-1 rounded-full mb-2 hover:opacity-80" style={{ backgroundColor: colors.backgroundHover }}>
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
            className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm focus:outline-none"
            style={{ backgroundColor: colors.card, color: colors.text, borderColor: colors.border }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <div className="relative">
            <button 
              onClick={() => { setShowStatusDropdown(!showStatusDropdown); setShowOwnerDropdown(false); }}
              className="flex items-center gap-2 px-3 py-1.5 border rounded-md text-sm"
              style={{ backgroundColor: colors.card, borderColor: colors.border, color: colors.text }}
            >
              <Bookmark className="w-4 h-4" />
              {statusFilter ? statusFilter.replace('_', ' ') : 'Status'}
              <ChevronDown className="w-3 h-3 ml-1" />
            </button>
            {showStatusDropdown && (
              <div className="absolute top-full left-0 mt-2 w-48 border rounded-lg shadow-xl z-50 py-1" style={{ backgroundColor: colors.card, borderColor: colors.border }}>
                {STATUS_OPTIONS.map(status => (
                  <button key={status} onClick={() => { setStatusFilter(status); setShowStatusDropdown(false); }} className="w-full text-left px-4 py-2 text-sm" style={{ color: colors.text }}>
                    {status.replace('_', ' ')}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="w-full overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b" style={{ borderColor: colors.border }}>
              <th className="text-left py-3 text-sm font-semibold w-[40%]" style={{ color: colors.textSubtle }}>Goal</th>
              <th className="text-left py-3 text-sm font-semibold w-[15%]" style={{ color: colors.textSubtle }}>Status</th>
              <th className="text-left py-3 text-sm font-semibold w-[15%]" style={{ color: colors.textSubtle }}>Date</th>
              <th className="text-left py-3 text-sm font-semibold w-[15%]" style={{ color: colors.textSubtle }}>Progress</th>
              <th className="text-left py-3 text-sm font-semibold w-[15%]" style={{ color: colors.textSubtle }}>Owner</th>
            </tr>
          </thead>
          <tbody>
            {filteredGoals.map((goal) => {
              const styles = getStatusStyles(goal.status);
              return (
                <tr key={goal.id} className="border-b" style={{ borderColor: colors.border }}>
                  <td className="py-4 pr-4">
                    <div className="flex items-center gap-2">
                      <ChevronRight className="w-4 h-4" style={{ color: colors.textSubtle }} />
                      {goal.id % 2 === 0 ? <Circle className="text-green-500 w-4 h-4" /> : <Target className="text-orange-500 w-4 h-4" />}
                      <span className="text-sm font-medium" style={{ color: colors.text }}>{goal.description || goal.title}</span>
                    </div>
                  </td>
                  <td className="py-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold border ${styles.bg} ${styles.text} ${styles.border}`}>{goal.status.replace('_', ' ')}</span>
                  </td>
                  <td className="py-4 text-sm" style={{ color: colors.textSubtle }}>{formatDate(goal.target_date)}</td>
                  <td className="py-4">
                    <div className="flex items-center gap-2 w-32">
                      <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ backgroundColor: colors.border }}>
                        <div className={`h-full ${styles.dot}`} style={{ width: `${goal.progress}%` }} />
                      </div>
                      <span className="text-xs" style={{ color: colors.textSubtle }}>{goal.progress}%</span>
                    </div>
                  </td>
                  <td className="py-4">
                    <div className="flex items-center gap-2 truncate text-blue-600 text-sm">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold border border-blue-200 ${getAvatarColor(goal.owner_details?.email || '')}`}>{goal.owner_details?.email?.[0].toUpperCase()}</div>
                      {goal.owner_details?.email}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Smgoals;