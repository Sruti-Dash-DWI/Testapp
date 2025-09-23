import React from 'react';

import {
    Filter,
    CheckCircle,
    FileText,
    Clock,
    Calendar,
    User,
} from "lucide-react";
import DashboardLayout from '../../layout/DashboardLayout';

const Summary = () => {
    return (
       
            <div className="flex-1 flex flex-col bg-gradient-to-br from-purple-50 to-pink-50 p-6">
                {/* Filter */}
                <button className="flex items-center text-gray-700 mb-6 text-sm w-[90px] h-[43px] px-[10px] py-[10px] gap-[10px] border border-black rounded-[10px] bg-white/25 hover:bg-white/50 opacity-100">
                    <Filter className="w-4 h-4 mr-2" />
                    Filter
                </button>

                {/* Stats */}
                <div className="grid grid-cols-4 gap-4 mb-8">
                    {/* Completed */}
                    <div className="bg-white p-4 rounded-lg shadow border border-gray-300 flex items-center space-x-3">
                        <div className="bg-gray-100 p-2 rounded">
                            <CheckCircle className="w-6 h-6 text-gray-700" />
                        </div>
                        <div>
                            <div className="text-lg font-semibold">0 completed</div>
                            <div className="text-sm text-gray-500">in the last 7 days</div>
                        </div>
                    </div>

                    {/* Created */}
                    <div className="bg-white p-4 rounded-lg shadow border border-gray-300 flex items-center space-x-3">
                        <div className="bg-gray-100 p-2 rounded">
                            <FileText className="w-6 h-6 text-gray-700" />
                        </div>
                        <div>
                            <div className="text-lg font-semibold">2 created</div>
                            <div className="text-sm text-gray-500">in the last 7 days</div>
                        </div>
                    </div>

                    {/* Updated */}
                    <div className="bg-white p-4 rounded-lg shadow border border-gray-300 flex items-center space-x-3">
                        <div className="bg-gray-100 p-2 rounded">
                            <Clock className="w-6 h-6 text-gray-700" />
                        </div>
                        <div>
                            <div className="text-lg font-semibold">2 updated</div>
                            <div className="text-sm text-gray-500">in the last 7 days</div>
                        </div>
                    </div>

                    {/* Due Soon */}
                    <div className="bg-white p-4 rounded-lg shadow border border-gray-300 flex items-center space-x-3">
                        <div className="bg-gray-100 p-2 rounded">
                            <Calendar className="w-6 h-6 text-gray-700" />
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
                    <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
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
                    <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
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
                            {/* More activities can be added here */}
                        </div>
                    </div>
                </div>
            </div>
        
    );
};

export default Summary;
