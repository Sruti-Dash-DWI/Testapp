import React, { useState } from 'react'
import {
    Search,
    Filter,
    ChevronDown,
    Settings,
    MoreHorizontal,
    Calendar,
    User,
    Target,
    Zap,
    BarChart3,
    Eye,
    EyeOff,
    Expand,
    Minimize,
    FileText,
    PieChart
} from 'lucide-react'

const DeveloperList = () => {
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isGroupOpen, setIsGroupOpen] = useState(false);
    const [isMoreOpen, setIsMoreOpen] = useState(false);
    const [issettingsOpen, setIssettingsOpen] = useState(false);
    const [selectedFilters, setSelectedFilters] = useState({
        activesprints: false,
        assignedtome: false,
        duethisweek: false,
        doneitems: false,
    });

    const quickFilters = [
        { key: 'activesprints', label: 'Active sprints', icon: Target },
        { key: 'assignedtome', label: 'Assigned to me', icon: User },
        { key: 'duethisweek', label: 'Due this week', icon: Calendar },
        { key: 'doneitems', label: 'Done items', icon: Eye },
    ];

    const groupOptions = [
        { key: 'status', label: 'Status', icon: Target },
        { key: 'assignee', label: 'Assignee', icon: User },
        { key: 'priority', label: 'Priority', icon: Zap },
        { key: 'sprint', label: 'Sprint', icon: Target },
        { key: 'storypoint', label: 'Story point estimate', icon: BarChart3 },
    ];

    const settingsOptions = [
        { key: 'hidedone', label: 'Hide done items', icon: EyeOff, toggle: true },
        { key: 'expandall', label: 'Expand all items', icon: Expand },
        { key: 'collapseall', label: 'Collapse all items', icon: Minimize },
    ];

    const moreOptions = [
        { key: 'formatrules', label: 'Format rules', icon: FileText },
        { key: 'viewchart', label: 'View as chart', icon: PieChart },
    ];

    const handleFilterToggle = (filterKey) => {
        setSelectedFilters(prev => ({
            ...prev,
            [filterKey]: !prev[filterKey]
        }));
    };

    return (
        <div className="min-h-screen bg-purple-200 py-4 px-4">
            <div className="w-full max-w-7xl mx-auto">
                {/* Search and Controls Bar */}
                <div className="flex items-center gap-2 mb-4 bg-purple-200 p-2">
                    {/* Search */}
                    <div className="relative w-60">
                        <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search list"
                            className="w-full pl-10 pr-4 py-2 border border-gray-400 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                    </div>

                    {/* Filter Dropdown */}
                    <div className="relative">
                        <button
                            className="flex items-center gap-2 px-4 py-2 border border-gray-400 rounded-md text-sm hover:bg-gray-50"
                            onClick={() => setIsFilterOpen(!isFilterOpen)}
                        >
                            <Filter className="w-4 h-4" />
                            Filter
                            <ChevronDown className={`w-4 h-4 transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {isFilterOpen && (
                            <div className="absolute top-full left-0 mt-2 w-80 bg-purple-50 rounded-lg shadow-lg border border-gray-200 z-10">
                                <div className="p-4">
                                    <h3 className="text-sm font-medium text-gray-700 mb-3">FILTERS</h3>

                                    {/* Quick Filters */}
                                    <div className="space-y-2 mb-4">
                                        {quickFilters.map((filter) => {
                                            const IconComponent = filter.icon;
                                            return (
                                                <label key={filter.key} className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded">
                                                    <IconComponent className="w-4 h-4 text-gray-500" />
                                                    <span className="text-sm text-gray-700">{filter.label}</span>
                                                </label>
                                            );
                                        })}
                                    </div>

                                    {/* Date Range */}
                                    <div className="mb-4">
                                        <h4 className="text-sm font-medium text-gray-600 mb-2">Date range</h4>
                                        <div className="grid grid-cols-2 gap-2">
                                            <div>
                                                <label className="text-xs text-gray-500">Start date</label>
                                                <input
                                                    type="date"
                                                    className="w-full mt-1 px-2 py-1 border border-gray-300 rounded text-xs"
                                                    defaultValue="2018-02-18"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-xs text-gray-500">Due date</label>
                                                <input
                                                    type="date"
                                                    className="w-full mt-1 px-2 py-1 border border-gray-300 rounded text-xs"
                                                    defaultValue="2018-02-18"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Assignee */}
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-600 mb-2">Assignee</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {['SS', 'AK', 'JS', 'MR', 'TR', 'SK', 'VG', 'AS'].map((initial) => (
                                                <div key={initial} className="w-8 h-8 rounded-full bg-purple-500 text-white text-xs flex items-center justify-center font-medium cursor-pointer hover:bg-purple-600">
                                                    {initial}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Group Dropdown */}
                    <div className="relative ml-auto">
                        <button
                            className="flex items-center gap-2 px-4 py-2 border border-gray-400 rounded-md text-sm hover:bg-gray-50"
                            onClick={() => setIsGroupOpen(!isGroupOpen)}
                        >
                            Group
                            <ChevronDown className={`w-4 h-4 transition-transform ${isGroupOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {isGroupOpen && (
                            <div className="absolute top-full right-0 mt-2 w-56 bg-purple-50 rounded-lg shadow-lg border border-gray-200 z-10">
                                <div className="p-2">
                                    <div className="text-xs text-gray-500 px-2 py-1 mb-1">Group by</div>
                                    {groupOptions.map((option) => {
                                        const IconComponent = option.icon;
                                        return (
                                            <button key={option.key} className="w-full flex items-center gap-3 px-2 py-2 text-sm hover:bg-gray-50 rounded">
                                                <IconComponent className="w-4 h-4 text-gray-500" />
                                                {option.label}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Settings Button */}
                    <div className="relative">
                        <button 
                            className="p-2 border border-gray-400 rounded-md hover:bg-gray-50"
                            onClick={() => setIssettingsOpen(!issettingsOpen)}
                        >
                            <Settings className="w-4 h-4" />
                        </button>

                        {issettingsOpen && (
                            <div className="absolute top-full right-0 mt-2 w-56 bg-purple-50 rounded-lg shadow-lg border border-gray-200 z-10">
                                <div className="p-2">
                                    {settingsOptions.map((option) => {
                                        const IconComponent = option.icon;
                                        return (
                                            <button key={option.key} className="w-full flex items-center justify-between px-2 py-2 text-sm hover:bg-gray-50 rounded">
                                                <div className="flex items-center gap-3">
                                                    <IconComponent className="w-4 h-4 text-gray-500" />
                                                    {option.label}
                                                </div>
                                                {option.toggle && (
                                                    <div className="w-8 h-4 bg-gray-200 rounded-full relative">
                                                        <div className="w-3 h-3 bg-white rounded-full absolute top-0.5 left-0.5 transition-transform"></div>
                                                    </div>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* More Options */}
                    <div className="relative">
                        <button
                            className="p-2 border border-gray-400 rounded-md hover:bg-gray-50"
                            onClick={() => setIsMoreOpen(!isMoreOpen)}
                        >
                            <MoreHorizontal className="w-4 h-4" />
                        </button>

                        {isMoreOpen && (
                            <div className="absolute top-full right-0 mt-2 w-56 bg-purple-50 rounded-lg shadow-lg border border-gray-200 z-10">
                                <div className="p-2">
                                    {moreOptions.map((option) => {
                                        const IconComponent = option.icon;
                                        return (
                                            <button key={option.key} className="w-full flex items-center justify-between px-2 py-2 text-sm hover:bg-gray-50 rounded">
                                                <div className="flex items-center gap-3">
                                                    <IconComponent className="w-4 h-4 text-gray-500" />
                                                    {option.label}
                                                </div>
                                                {option.toggle && (
                                                    <div className="w-8 h-4 bg-gray-200 rounded-full relative">
                                                        <div className="w-3 h-3 bg-white rounded-full absolute top-0.5 left-0.5 transition-transform"></div>
                                                    </div>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* List Table */}
                <div className="bg-white rounded-lg shadow-sm border border-purple-200 overflow-hidden">
                    {/* Table Header */}
                    <div className="grid text-sm font-medium text-gray-700 bg-gray-200" style={{ gridTemplateColumns: '40px 80px 400px 140px 140px 140px 140px 150px' }}>
                        <div className="border-b border-r border-purple-300 px-3 py-3 flex items-center justify-center">
                            <input type="checkbox" className="rounded border-purple-300" />
                        </div>
                        <div className="border-b border-r border-purple-300 px-3 py-3 text-center">Type</div>
                        <div className="border-b border-r border-purple-300 px-3 py-3">Summary</div>
                        <div className="border-b border-r border-purple-300 px-3 py-3 text-center">Status</div>
                        <div className="border-b border-r border-purple-300 px-3 py-3 text-center">Due Date</div>
                        <div className="border-b border-r border-purple-300 px-3 py-3 text-center">Priority</div>
                        <div className="border-b border-r border-purple-300 px-3 py-3 text-center">Assignee</div>
                        <div className="border-b border-purple-300 px-3 py-3 text-center">Comments</div>
                    </div>

                    {/* Table Rows */}
                    <div>
                        {[
                            { summary: "Choose a color template", status: "To Do", date: "30 Sept 2025", priority: "High", assignee: "Adarsh Kumar" },
                            { summary: "Add a btn-primary", status: "In Progress", date: "20 Sept 2025", priority: "Medium", assignee: "Shahid" },
                            { summary: "Create the Login API", status: "In Progress", date: "20 Sept 2025", priority: "Medium", assignee: "Shahid" },
                            { summary: "Create the Login API", status: "In Progress", date: "20 Sept 2025", priority: "Medium", assignee: "Shahid" },
                            { summary: "Add a btn-primary", status: "In Progress", date: "20 Sept 2025", priority: "Medium", assignee: "Shahid" },
                            { summary: "Create the Login API", status: "In Progress", date: "20 Sept 2025", priority: "Medium", assignee: "Shahid" },
                            { summary: "Create the Login API", status: "In Progress", date: "20 Sept 2025", priority: "Medium", assignee: "Shahid" },
                            { summary: "Choose a color template", status: "To Do", date: "30 Sept 2025", priority: "High", assignee: "Adarsh Kumar" },
                            { summary: "Create the Login API", status: "In Progress", date: "20 Sept 2025", priority: "Medium", assignee: "Shahid" },
                            { summary: "Create the Login API", status: "In Progress", date: "20 Sept 2025", priority: "Medium", assignee: "Shahid" },
                            { summary: "Create the Login API", status: "In Progress", date: "20 Sept 2025", priority: "Medium", assignee: "Shahid" },
                        ].map((row, index) => (
                            <div key={index} className="grid text-sm hover:bg-purple-50 border-b border-purple-100" style={{ gridTemplateColumns: '40px 80px 400px 140px 140px 140px 140px 150px' }}>
                                {/* Checkbox Column */}
                                <div className="border-r border-purple-200 px-3 py-2 flex items-center justify-center">
                                    <input type="checkbox" className="rounded border-purple-300" />
                                </div>

                                {/* Type */}
                                <div className="border-r border-purple-200 px-3 py-2 flex items-center justify-center">
                                    <input type="checkbox" className="rounded border-purple-300" />
                                </div>

                                {/* Summary */}
                                <div className="border-r border-purple-200 px-3 py-2 flex items-center text-gray-900">{row.summary}</div>

                                {/* Status */}
                                <div className="border-r border-purple-200 px-3 py-2 flex items-center justify-center">
                                    <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${row.status === "In Progress" ? "bg-orange-100 text-orange-800" :
                                        row.status === "To Do" ? "bg-blue-100 text-blue-800" : ""
                                        }`}>
                                        {row.status}
                                    </span>
                                </div>

                                {/* Due Date */}
                                <div className="border-r border-purple-200 px-3 py-2 flex items-center justify-center text-gray-600">
                                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                                    </svg>
                                    <span className="text-xs">{row.date}</span>
                                </div>

                                {/* Priority */}
                                <div className="border-r border-purple-200 px-3 py-2 flex items-center justify-center">
                                    <span className={`inline-flex px-2 py-1 rounded text-xs font-medium items-center ${row.priority === "High" ? "bg-red-50 text-red-700" : "bg-yellow-50 text-yellow-700"
                                        }`}>
                                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                            {row.priority === "High" ? (
                                                <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                                            ) : (
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                            )}
                                        </svg>
                                        {row.priority}
                                    </span>
                                </div>

                                {/* Assignee */}
                                <div className="border-r border-purple-200 px-3 py-2 flex items-center justify-center text-gray-900 text-sm">{row.assignee}</div>

                                {/* Comments */}
                                <div className="px-3 py-2 flex items-center">
                                    <svg className="w-4 h-4 text-gray-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z" clipRule="evenodd" />
                                    </svg>
                                    <span className="text-xs text-gray-500">Add comment...</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Create Button */}
                    <div className="p-2 border-t border-purple-200 bg-purple-50">
                        <button className="flex items-center text-purple-600 hover:text-purple-800 text-sm font-medium">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                            </svg>
                            Create
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DeveloperList