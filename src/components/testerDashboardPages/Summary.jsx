import React, { useState } from 'react'

import {
    Filter,
    CheckCircle,
    FileText,
    Clock,
    Calendar,
    User,
    ArrowUp,
    ChevronDown,
    Search,
} from "lucide-react";

const Summary = () => {
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [selectedFilters, setSelectedFilters] = useState({
        assignee: false,
        created: false,
        dueDate: false,
        parent: false,
        priority: false,
        status: false,
        updated: false,
        workType: false,
    });

    const filterOptions = [
        { key: 'assignee', label: 'Assignee' },
        { key: 'created', label: 'Created' },
        { key: 'dueDate', label: 'Due date' },
        { key: 'parent', label: 'Parent' },
        { key: 'priority', label: 'Priority' },
        { key: 'status', label: 'Status' },
        { key: 'updated', label: 'Updated' },
        { key: 'workType', label: 'Work type' },
    ];

    const handleFilterToggle = (filterKey) => {
        setSelectedFilters(prev => ({
            ...prev,
            [filterKey]: !prev[filterKey]
        }));
    };

    return (
        <>
            
                 <div className="flex-1 flex flex-col bg-gradient-to-br from-purple-300 via-purple-100 to-purple-50 p-6">
                    {/* Filter */}
                    <div className="relative mb-6">
                        <button 
                            className="flex items-center justify-center text-gray-700 text-sm w-[90px] h-[43px] px-[10px] py-[10px] gap-[8px] border border-black rounded-[10px] bg-white/25 hover:bg-white/50 opacity-100"
                            onClick={() => setIsFilterOpen(!isFilterOpen)}
                        >
                            <Filter className="w-4 h-4" />
                            Filter
                            <ChevronDown className={`w-4 h-4 transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {/* Filter Dropdown */}
                        {isFilterOpen && (
                            <div className="absolute top-full left-0 mt-2 w-80 bg-purple-100 rounded-lg shadow-lg border border-gray-200 z-10">
                                <div className="p-4">
                                    {/* Search */}
                                    <div className="relative mb-4">
                                        <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                                        <input
                                            type="text"
                                            placeholder="Search more filters"
                                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    {/* Filter Options */}
                                    <div className="space-y-0.5">
                                        {filterOptions.map((option) => (
                                            <label key={option.key} className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedFilters[option.key]}
                                                    onChange={() => handleFilterToggle(option.key)}
                                                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                                />
                                                <span className="text-sm text-gray-700">{option.label}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-4 gap-4 mb-8">
                        {/* Completed */}
                        <div className="bg-purple-100 p-4 rounded-lg shadow border border-purple-200 flex items-center space-x-3">
                            <div className="bg-purple-100 p-2 rounded">
                                <CheckCircle className="w-6 h-6 text-purple-700" />
                            </div>
                            <div>
                                <div className="text-lg font-semibold">0 completed</div>
                                <div className="text-sm text-gray-500">in the last 7 days</div>
                            </div>
                        </div>

                        {/* Created */}
                        <div className="bg-purple-100 p-4 rounded-lg shadow border border-purple-200 flex items-center space-x-3">
                            <div className="bg-purple-100 p-2 rounded">
                                <FileText className="w-6 h-6 text-purple-700" />
                            </div>
                            <div>
                                <div className="text-lg font-semibold">2 created</div>
                                <div className="text-sm text-gray-500">in the last 7 days</div>
                            </div>
                        </div>

                        {/* Updated */}
                        <div className="bg-purple-100 p-4 rounded-lg shadow border border-purple-200 flex items-center space-x-3">
                            <div className="bg-purple-100 p-2 rounded">
                                <Clock className="w-6 h-6 text-purple-700" />
                            </div>
                            <div>
                                <div className="text-lg font-semibold">2 updated</div>
                                <div className="text-sm text-gray-500">in the last 7 days</div>
                            </div>
                        </div>

                        {/* Due Soon */}
                        <div className="bg-purple-100 p-4 rounded-lg shadow border border-purple-200 flex items-center space-x-3">
                            <div className="bg-purple-100 p-2 rounded">
                                <Calendar className="w-6 h-6 text-purple-700" />
                            </div>
                            <div>
                                <div className="text-lg font-semibold">0 due soon</div>
                                <div className="text-sm text-gray-500">in the last 7 days</div>
                            </div>
                        </div>
                    </div>

                    {/* Main Grid */}
                    <div className="grid grid-cols-2 gap-6">
                        {/* Status Overview */}
                        <div className="bg-purple-100 p-6 rounded-lg shadow border border-purple-200">
                            <h3 className="text-lg font-medium mb-1">Status overview</h3>
                            <p className="text-sm text-gray-600 mb-6">
                                Get a snapshot of the status of your work items
                            </p>

                            {/* Donut Chart */}
                            <div className="flex items-center justify-center mb-6">
                                <div className="relative w-48 h-48">
                                    <svg
                                        className="w-48 h-48 transform -rotate-90"
                                        viewBox="0 0 160 160"
                                    >
                                        <circle
                                            cx="80"
                                            cy="80"
                                            r="60"
                                            stroke="#e5e7eb"
                                            strokeWidth="20"
                                            fill="none"
                                        />
                                        <circle
                                            cx="80"
                                            cy="80"
                                            r="60"
                                            stroke="#22c55e"
                                            strokeWidth="20"
                                            fill="none"
                                            strokeDasharray={`${(1 / 2) * 2 * Math.PI * 60} ${2 * Math.PI * 60
                                                }`}
                                        />
                                        <circle
                                            cx="80"
                                            cy="80"
                                            r="60"
                                            stroke="#60a5fa"
                                            strokeWidth="20"
                                            fill="none"
                                            strokeDasharray={`${(1 / 2) * 2 * Math.PI * 60} ${2 * Math.PI * 60
                                                }`}
                                            strokeDashoffset={`-${(1 / 2) * 2 * Math.PI * 60}`}
                                        />
                                    </svg>
                                    
                                    {/* Center content */}
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="text-center">
                                            <div className="text-2xl font-semibold">2</div>
                                            <div className="text-sm text-gray-600">Total work items</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Legend */}
                            <div className="space-y-2">
                                <div className="flex items-center">
                                    <div
                                        className="w-3 h-3 rounded-full mr-2"
                                        style={{ backgroundColor: "#22c55e" }}
                                    ></div>
                                    <span className="text-sm text-gray-600">To Do: 1</span>
                                </div>
                                <div className="flex items-center">
                                    <div
                                        className="w-3 h-3 rounded-full mr-2"
                                        style={{ backgroundColor: "#60a5fa" }}
                                    ></div>
                                    <span className="text-sm text-gray-600">In Progress: 1</span>
                                </div>
                            </div>
                        </div>

                        {/* Recent Activity */}
                        <div className="bg-purple-100 p-6 rounded-lg shadow border border-purple-200">
                            <h3 className="text-lg font-medium mb-1">Recent activity</h3>
                            <p className="text-sm text-gray-600 mb-4">
                                Stay up to date with what's happening across the project.
                            </p>
                            <div className="text-sm text-gray-500 mb-4">
                                Tuesday 16 September 2025
                            </div>

                            <div className="space-y-4">
                                {/* Example activity */}
                                <div className="flex items-start">
                                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center mr-3 mt-0.5">
                                        <User className="w-4 h-4 text-gray-600" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center flex-wrap gap-1 text-sm">
                                            <span className="font-medium">Adarsh Kumar</span>
                                            <span className="text-gray-600">
                                                updated field 'status' on
                                            </span>
                                            <span className="inline-flex items-center bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
                                                <CheckCircle className="w-4 h-4 text-blue-800 mr-1" />
                                                KAN-1: Choose a color template
                                            </span>
                                            <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">
                                                To Do
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                {/* You can add more activity items here */}
                                <div className="flex items-start">
                                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center mr-3 mt-0.5">
                                        <User className="w-4 h-4 text-gray-600" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center flex-wrap gap-1 text-sm">
                                            <span className="font-medium">Shahid</span>
                                            <span className="text-gray-600">changed the priority from</span>
                                            <div className="w-4 h-4 bg-gray-200 border border-gray-400 rounded"></div>
                                            <span className="text-gray-600">to</span>
                                            <div className="flex items-center text-red-600">
                                                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                                                </svg>
                                                <span className="font-medium">High on</span>
                                            </div>
                                            <span className="inline-flex items-center bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
                                                <CheckCircle className="w-4 h-4 text-blue-800 mr-1" />
                                                KAN-1: Choose a color template
                                            </span>
                                            <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">
                                                To Do
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
           
        </>
    )
}

export default Summary