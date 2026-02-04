import React from 'react';
import { Check } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function QuotientFeatures() {
  const { isDark } = useTheme();
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
    { name: 'AI and Manual Test Cases execution', category: 'core' },
    { name: 'Test Cases reporting', category: 'core' },
  ];

  return (
    <div className={`min-h-screen flex items-center justify-center p-8 ${isDark ? 'bg-[#050505]' : 'bg-gray-50'}`}>
      <div className="w-full max-w-2xl">
        <h1 className={`text-4xl font-bold text-center mb-12 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Features
        </h1>
        
        <div className={`rounded-lg shadow-lg overflow-hidden ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
          {/* Header */}
          <div className="bg-blue-600 text-white px-70 py-4 flex items-center gap-3">
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
          <div className={`divide-y ${isDark ? 'divide-gray-700' : 'divide-gray-200'}`}>
            {features.map((feature, index) => (
              <div
                key={index}
                className={`px-35 py-4 flex items-center gap-10 ${
                  index % 2 === 0 ? (isDark ? 'bg-gray-800' : 'bg-gray-50') : (isDark ? 'bg-gray-900' : 'bg-white')
                }`}
              >
                <div className="shrink-0 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                  <Check className="w-3 h-3 text-white" strokeWidth={3} />
                </div>
                <span className={isDark ? 'text-white' : 'text-gray-900'}>
                  {feature.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer note */}
        <p className={`text-center text-sm mt-6 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
          All features included in Qora-AI plans.
        </p>
      </div>
    </div>
  );
}