import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { 
  Bell, 
  UserPlus, 
  MessageSquare, 
  AlertCircle, 
  X,
  Calendar,
  Users,
  Loader2
} from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext'; 

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ;


const getAuthHeaders = () => {
    const token = localStorage.getItem('authToken');
    return {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : ''
    };
};

// --- SUB-COMPONENT: Project Invitation Modal ---
const ProjectInvitationModal = ({ isOpen, onClose, data, onRespond }) => {
  const { theme, colors } = useTheme();
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen || !data) return null;

  const handleAction = async (action) => {
      setIsProcessing(true);
      try {
          await onRespond(data.id, action);
          onClose();
      } catch (error) {
          console.error("Failed to respond:", error);
          alert("Failed to process request. Please try again.");
      } finally {
          setIsProcessing(false);
      }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
     
      <div 
        className="absolute inset-0 bg-black/60 transition-opacity" 
        onClick={!isProcessing ? onClose : undefined}
      ></div>

      
      <div 
        className="relative w-full max-w-md rounded-2xl overflow-hidden shadow-2xl transform transition-all scale-100 bg-white dark:bg-slate-900"
        style={{ color: colors.text }} 
      >
       
        <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-6 relative">
          <button 
            onClick={onClose}
            disabled={isProcessing}
            className="absolute top-4 right-4 p-1 rounded-full hover:bg-white/20 text-white transition-colors disabled:opacity-50"
          >
            <X size={20} />
          </button>
          
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-white flex items-center justify-center text-blue-600 shadow-sm">
               <UserPlus size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Project Invitation</h2>
              <div className="h-1 w-8 bg-white/40 rounded-full mt-2"></div>
            </div>
          </div>
          <p className="mt-4 text-blue-50 font-medium">
            You've been invited to collaborate
          </p>
        </div>
        <div className="p-6 space-y-4 bg-white dark:bg-slate-900">
            
          
            <div className="p-4 rounded-xl border bg-white dark:bg-slate-800" style={{ borderColor: colors.border }}>
                <p className="text-xs font-bold tracking-wider uppercase opacity-50 mb-1">Project Name</p>
                <p className="text-lg font-semibold text-blue-600 dark:text-blue-400">{data.team_name || 'Untitled Team'}</p>
            </div>

            {/* Invited By Card */}
            {/* <div className="p-4 rounded-xl border flex items-center gap-4 bg-white dark:bg-slate-800" style={{ borderColor: colors.border }}>
                 <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 flex items-center justify-center font-bold">
                    {data.user?.first_name ? data.user.first_name.charAt(0) : 'U'}
                 </div>
                 <div>
                    <p className="text-xs font-bold tracking-wider uppercase opacity-50 mb-0.5">Invited By</p>
                    <p className="font-medium">
                        {data.user ? `${data.user.first_name} ${data.user.last_name}` : 'Unknown User'}
                    </p>
                    <p className="text-xs opacity-50">{data.user?.email}</p>
                 </div>
            </div> */}

            {/* Stats Row */}
            <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border bg-white dark:bg-slate-800" style={{ borderColor: colors.border }}>
                    <div className="flex items-center gap-2 mb-1 opacity-50">
                        <Users size={14} />
                        <span className="text-xs font-bold tracking-wider uppercase">Role</span>
                    </div>
                    <p className="font-medium capitalize">{data.role?.toLowerCase() || 'Member'}</p>
                </div>
                <div className="p-4 rounded-xl border bg-white dark:bg-slate-800" style={{ borderColor: colors.border }}>
                    <div className="flex items-center gap-2 mb-1 opacity-50">
                        <Calendar size={14} />
                        <span className="text-xs font-bold tracking-wider uppercase">Status</span>
                    </div>
                    <p className="font-medium capitalize">{data.status?.toLowerCase()}</p>
                </div>
            </div>

            
            <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900 text-sm text-blue-800 dark:text-blue-200 leading-relaxed border border-blue-100 dark:border-blue-800">
                By accepting this invitation, you'll join the team <strong>{data.team_name}</strong> as a <strong>{data.role}</strong>.
            </div>
            
        
            <div className="flex gap-3 pt-2">
                <button 
                    onClick={() => handleAction('decline')}
                    disabled={isProcessing}
                    className="flex-1 py-3 rounded-lg border font-medium transition-colors hover:bg-gray-50 dark:hover:bg-slate-800 disabled:opacity-50"
                    style={{ borderColor: colors.border, color: colors.subText }}
                >
                    Decline
                </button>
                <button 
                    onClick={() => handleAction('accept')}
                    disabled={isProcessing}
                    className="flex-1 py-3 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50 flex justify-center items-center gap-2"
                >
                    {isProcessing && <Loader2 size={16} className="animate-spin" />}
                    {isProcessing ? 'Processing...' : 'Accept Invitation'}
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};



const DevNotification = () => {
  const { theme, colors } = useTheme(); 
  
  
  const { refreshNotifications } = useOutletContext();

  const [activeTab, setActiveTab] = useState('All');
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  
  
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  
  const fetchNotifications = async () => {
      try {
          setLoading(true);
          const response = await fetch(`${API_BASE_URL}/teams/invitations/pending/`, {
              headers: getAuthHeaders()
          });
          
          if (!response.ok) throw new Error('Failed to fetch notifications');
          
          const data = await response.json();
          
          const formattedData = Array.isArray(data) ? data.map(item => ({
              ...item,
              type: 'invite', 
              title: 'Project Invitation',
              description: `You have been invited to join ${item.team_name}`,
              time: 'Recently',
              unread: true 
          })) : [];

          setNotifications(formattedData);
      } catch (err) {
          console.error(err);
          setError("Could not load notifications");
      } finally {
          setLoading(false);
      }
  };

  useEffect(() => {
      fetchNotifications();
  }, []);


  const handleRespondToInvitation = async (invitationId, action) => {
      const response = await fetch(`${API_BASE_URL}/teams/invitations/${invitationId}/respond/`, {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify({ action })
      });

      if (!response.ok) {
          throw new Error('Failed to update invitation status');
      }

     
      setNotifications(prev => prev.filter(n => n.id !== invitationId));

    
      setTimeout(() => {
          if (refreshNotifications) {
              refreshNotifications();
          }
      }, 500);
  };

  
  const filteredNotifications = notifications.filter((item) => {
    if (showUnreadOnly && !item.unread) return false;
   
    if (activeTab === 'Message' || activeTab === 'Alert') return false; 
    return true; 
  });

  const unreadCount = notifications.length; 

  const handleNotificationClick = (notification) => {
      if (notification.type === 'invite') {
          setSelectedNotification(notification);
      }
  };

  const getIcon = (type) => {
    switch(type) {
      case 'invite': return <UserPlus size={20} />;
      case 'comment': return <MessageSquare size={20} />;
      case 'alert': return <AlertCircle size={20} />;
      default: return <Bell size={20} />;
    }
  };

  const getIconStyles = (type) => {
    switch(type) {
      case 'invite': return 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400';
      case 'comment': return 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400';
      case 'alert': return 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div 
        className="w-full h-full p-6 md:p-8 overflow-y-auto"
        style={{ backgroundColor: colors.background, color: colors.text }}
    >
        <div className="max-w-5xl mx-auto">
            
           
            <header className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div className="flex items-center gap-4">
                  
                    <div className="relative p-3 bg-gradient-to-tr from-violet-600 to-blue-600 rounded-2xl shadow-lg shadow-blue-500/20 text-white">
                        <Bell size={24} />
                        {unreadCount > 0 && (
                            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold ring-2 ring-white dark:ring-slate-900">
                                {unreadCount}
                            </span>
                        )}
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                            Notifications
                        </h1>
                        <p className="text-sm opacity-60">
                            You have {unreadCount} pending invitations
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button 
                        onClick={fetchNotifications}
                        className="px-4 py-2.5 text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-xl transition-colors"
                    >
                        Refresh
                    </button>
                </div>
            </header>

         
            <div 
                className="p-1.5 rounded-2xl shadow-sm mb-6 flex overflow-x-auto border"
                style={{ backgroundColor: colors.cardBg, borderColor: colors.border }}
            >
                {['All', 'Invite', 'Message', 'Alert'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`flex-1 py-2 px-4 rounded-xl text-sm font-medium transition-all duration-200 ${
                            activeTab === tab
                            ? 'bg-blue-600 text-white shadow-md'
                            : 'opacity-60 hover:opacity-100 hover:bg-gray-50 dark:hover:bg-slate-700'
                        }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

           
            <div 
                className="rounded-2xl p-4 mb-6 shadow-sm border flex items-center justify-between"
                style={{ backgroundColor: colors.cardBg, borderColor: colors.border }}
            >
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-pink-50 dark:bg-pink-900/20 text-pink-500">
                        <Bell size={18} />
                    </div>
                    <div>
                        <p className="text-sm font-semibold">Show Unread Only</p>
                        <p className="text-xs opacity-60">Filter out read notifications</p>
                    </div>
                </div>
                
                <button 
                    onClick={() => setShowUnreadOnly(!showUnreadOnly)}
                    className={`w-12 h-7 rounded-full transition-colors relative ${
                        showUnreadOnly ? 'bg-slate-800 dark:bg-blue-600' : 'bg-slate-200 dark:bg-slate-600'
                    }`}
                >
                    <span className={`absolute top-1 left-1 bg-white w-5 h-5 rounded-full shadow transition-transform ${
                        showUnreadOnly ? 'translate-x-5' : 'translate-x-0'
                    }`} />
                </button>
            </div>

            <div className="space-y-4">
                {loading ? (
                    <div className="flex justify-center py-10 opacity-50">
                        <Loader2 className="animate-spin" />
                    </div>
                ) : error ? (
                    <div className="text-center py-10 text-red-500 bg-red-50 dark:bg-red-900/10 rounded-xl border border-red-100 dark:border-red-900/30">
                        {error}
                    </div>
                ) : filteredNotifications.length === 0 ? (
                    <div className="text-center py-10 opacity-50 border-2 border-dashed rounded-xl" style={{ borderColor: colors.border }}>
                        No notifications found
                    </div>
                ) : (
                    filteredNotifications.map((item) => (
                        <div 
                            key={item.id} 
                            onClick={() => handleNotificationClick(item)}
                            className={`group relative p-5 rounded-2xl shadow-sm hover:shadow-md transition-all border cursor-pointer bg-white dark:bg-slate-800`}
                            style={{ 
                                borderColor: item.unread ? '#3b82f6' : colors.border,
                                borderWidth: item.unread ? '1px' : '1px'
                            }}
                        >
                            {/* Blue dot for unread inside card */}
                            {item.unread && (
                                <div className="absolute top-6 right-6 h-2.5 w-2.5 rounded-full bg-blue-600 shadow-sm"></div>
                            )}

                            <div className="flex gap-4">
                                <div className={`h-12 w-12 rounded-xl flex items-center justify-center shrink-0 ${getIconStyles(item.type)}`}>
                                    {getIcon(item.type)}
                                </div>

                                <div className="flex-1 space-y-1">
                                    <h3 className="font-semibold text-slate-900 dark:text-white">{item.title}</h3>
                                    <p className="text-sm opacity-70 leading-relaxed">
                                        {item.description}
                                    </p>
                                    
                                    <div 
                                        className="inline-flex items-center px-2.5 py-1 rounded-md border text-xs font-medium mt-2"
                                        style={{ 
                                            backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.05)' : '#f8fafc',
                                            borderColor: colors.border
                                        }}
                                    >
                                        <span className="opacity-50 mr-1">Project:</span> {item.team_name}
                                    </div>

                                    <div className="flex items-center gap-2 mt-3 text-xs opacity-50">
                                        {item.user && (
                                            <>
                                                {/* <span>Invited by <span className="text-blue-600 dark:text-blue-400 font-medium">{item.user.first_name} {item.user.last_name}</span></span> */}
                                                <span>•</span>
                                            </>
                                        )}
                                        <span>{item.time}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>

       
        <ProjectInvitationModal 
            isOpen={!!selectedNotification} 
            onClose={() => setSelectedNotification(null)} 
            data={selectedNotification}
            onRespond={handleRespondToInvitation}
        />
    </div>
  );
};

export default DevNotification;