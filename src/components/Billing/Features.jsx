import React from 'react';
import { Check } from 'lucide-react';

export default function QuotientFeatures() {
  const features = [
    { name: 'Issue Tracking & Management', category: 'core' },
    { name: 'Customizable Workflows', category: 'core' },
    { name: 'Agile Boards (Scrum & Kanban)', category: 'core' },
    { name: 'Sprint Planning & Management', category: 'agile' },
    { name: 'Backlog Prioritization', category: 'agile' },
    { name: 'Real-time Collaboration', category: 'collaboration' },
    { name: 'Advanced Permissions & Roles', category: 'security' },
    { name: 'Custom Fields & Issue Types', category: 'customization' },
    { name: 'Automation Rules & Triggers', category: 'automation' },
    { name: 'Reports & Analytics Dashboard', category: 'reporting' },
    { name: 'Email Notifications', category: 'communication' },
    { name: 'Advanced Search (JQL)', category: 'core' },
    { name: 'Release Management', category: 'deployment' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
      <div className="w-full max-w-2xl">
        <h1 className="text-4xl font-bold text-center mb-12 text-gray-900">
          Features
        </h1>
        
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-blue-600 text-white px-6 py-4 flex items-center gap-3">
            <svg 
              className="w-5 h-5" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" 
              />
            </svg>
            <span className="font-semibold text-lg">Features:</span>
          </div>

          {/* Features List */}
          <div className="divide-y divide-gray-200">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`px-6 py-4 flex items-center gap-3 ${
                  index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                }`}
              >
                <div className="shrink-0 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                  <Check className="w-3 h-3 text-white" strokeWidth={3} />
                </div>
                <span className="text-gray-900">
                  {feature.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer note */}
        <p className="text-center text-gray-500 text-sm mt-6">
          All features included in Qora-AI Standard and Premium plans.
        </p>
      </div>
    </div>
  );
}