import React from 'react'
import DashboardLayout from '../../layout/DashboardLayout'

const List = () => {
    return (
        
        <div>
            {/* List Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                {/* Table Header */}
                <div className="grid text-sm font-medium text-gray-700" style={{ gridTemplateColumns: '60px 80px 280px 140px 120px 100px 140px 200px' }}>
                    {/* Checklist Header */}
                    <div className="border-b border-r border-gray-300 px-3 py-3 bg-purple-100 flex items-center justify-center">
                        <input type="checkbox" className="rounded border-gray-300" />
                    </div>
                    <div className="border-b border-r border-gray-300 px-3 py-3 bg-purple-100 text-center">Type</div>
                    <div className="border-b border-r border-gray-300 px-3 py-3 bg-purple-100">Summary</div>
                    <div className="border-b border-r border-gray-300 px-3 py-3 bg-purple-100 text-center">Status</div>
                    <div className="border-b border-r border-gray-300 px-3 py-3 bg-purple-100 text-center">Due Date</div>
                    <div className="border-b border-r border-gray-300 px-3 py-3 bg-purple-100 text-center">Priority</div>
                    <div className="border-b border-r border-gray-300 px-3 py-3 bg-purple-100 text-center">Assignee</div>
                    <div className="border-b border-gray-300 px-3 py-3 bg-purple-100 text-center">Comments</div>
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
                        <div key={index} className="grid text-sm hover:bg-gray-50" style={{ gridTemplateColumns: '60px 80px 280px 140px 120px 100px 140px 200px' }}>
                            {/* Checklist Column */}
                            <div className="border-b border-r border-gray-300 px-3 py-3 flex items-center justify-center">
                                <input type="checkbox" className="rounded border-gray-300" />
                            </div>

                            {/* Type */}
                            <div className="border-b border-r border-gray-300 px-3 py-3 flex items-center justify-center">
                                <input type="checkbox" className="rounded border-gray-300" />
                            </div>

                            {/* Summary */}
                            <div className="border-b border-r border-gray-300 px-3 py-3 flex items-center text-gray-900">{row.summary}</div>

                            {/* Status */}
                            <div className="border-b border-r border-gray-300 px-3 py-3 flex items-center justify-center">
                                <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${row.status === "In Progress" ? "bg-orange-100 text-orange-800" :
                                        row.status === "To Do" ? "bg-blue-100 text-blue-800" : ""
                                    }`}>
                                    {row.status}
                                </span>
                            </div>

                            {/* Due Date */}
                            <div className="border-b border-r border-gray-300 px-3 py-3 flex items-center justify-center text-gray-600">
                                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                                </svg>
                                <span className="text-xs">{row.date}</span>
                            </div>

                            {/* Priority */}
                            <div className="border-b border-r border-gray-300 px-3 py-3 flex items-center justify-center">
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
                            <div className="border-b border-r border-gray-300 px-3 py-3 flex items-center justify-center text-gray-900 text-sm">{row.assignee}</div>

                            {/* Comments */}
                            <div className="border-b border-gray-300 px-3 py-3 flex items-center">
                                <svg className="w-4 h-4 text-gray-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z" clipRule="evenodd" />
                                </svg>
                                <span className="text-xs text-gray-500">Add comment...</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Create Button */}
                <div className="p-4 border-t border-gray-300 bg-white">
                    <button className="flex items-center text-purple-600 hover:text-purple-800 text-sm font-medium">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Create
                    </button>
                </div>
            </div>

        </div>
      
    )
}

export default List
