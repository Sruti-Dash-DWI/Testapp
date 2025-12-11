import React, { useState } from 'react';
import { FolderOpen, Settings, ChevronDown, ChevronUp } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function CreateSuiteUI() {
  const [suiteName, setSuiteName] = useState('');
  const [description, setDescription] = useState('');
  const [suiteType, setSuiteType] = useState('manual');
  const [scriptsExpanded, setScriptsExpanded] = useState(true);
  const [userSettingsExpanded, setUserSettingsExpanded] = useState(false);
  const [reportConfigExpanded, setReportConfigExpanded] = useState(false);
  const { theme, toggleTheme, colors } = useTheme();

  return ( 
    <div className="min-h-screen bg-gray-100" style={{ backgroundColor: colors.card, color: colors.text, borderColor: colors.border}} >
      {/* Header */}
      <div className="px-6 py-4 border border-gray-200" style={{backgroundColor: colors.card, color: colors.text, borderColor: colors.border}}>
        <h1 className="text-lg font-semibold text-gray-900" style={{color: colors.text}} >Suites</h1>
      </div>

      {/* Top Bar */}
      <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between" style={{backgroundColor: colors.card, color: colors.text, borderColor: colors.border}}>
        <h2 className="text-xl font-semibold text-gray-900" style={{color: colors.text}}>Create Suite</h2>
        
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded hover:text-gray-900 text-sm font-medium">
            Cancel
          </button>
          <button className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 text-sm font-medium">
            Reset
          </button>
          <button className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 text-sm font-medium">
            Preview
          </button>
          <button className="px-6 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 text-sm font-medium">
            Create
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        {/* Scripts Section */}
        <div className="rounded-lg border border-gray-200 mb-4" style={{backgroundColor: colors.card, color: colors.text, borderColor: colors.border}}>
          <button
            onClick={() => setScriptsExpanded(!scriptsExpanded)}
            className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50"
          >
            <div className="flex items-center gap-3">
              <FolderOpen className="w-5 h-5 text-blue-600" />
              <span className="text-base font-medium text-gray-900" style={{color:colors.text}}>Scripts</span>
            </div>
            {scriptsExpanded ? (
              <ChevronUp className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-400" />
            )}
          </button>

          {scriptsExpanded && (
            <div className="px-6 pb-6 border-t border-gray-200">
              <div className="grid grid-cols-2 gap-6 mt-6" >
                {/* Name Field */}
                <div style={{color:colors.text}}>
                  <label className="block text-sm font-medium text-gray-700 mb-2" style={{color:colors.text}}>
                    <span className="text-red-500">*</span> Name
                  </label>
                  <input
                    type="text"
                    value={suiteName}
                    onChange={(e) => setSuiteName(e.target.value)}
                    placeholder="Enter suite name"
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 text-sm"
                  />
                </div>

                {/* Description Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2" style={{color:colors.text}}>
                    Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Your description goes here..."
                    rows={1}
                    maxLength={200}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 resize-none text-sm"
                  />
                  <div className="text-right text-xs text-gray-500 mt-1">
                    {description.length}/200
                  </div>
                </div>
              </div>

              {/* Suite Type */}
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-3" style={{color:colors.text}}>
                  <span className="text-red-500">*</span> Suite Type
                </label>
                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="suiteType"
                      value="automation"
                      checked={suiteType === 'automation'}
                      onChange={(e) => setSuiteType(e.target.value)}
                      className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700" style={{color:colors.text}}>Automation</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="suiteType"
                      value="manual"
                      checked={suiteType === 'manual'}
                      onChange={(e) => setSuiteType(e.target.value)}
                      className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700" style={{color:colors.text}}>Manual</span>
                  </label>
                </div>
              </div>

              {/* Select Modules/Scripts Button */}
              <div className="mt-6">
                <button className="px-4 py-2 text-gray-700 border border-gray-300 rounded hover:bg-gray-50 text-sm font-medium" style={{color:colors.text}}>
                  Select Modules/Scripts
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Settings Section */}
        <div className=" rounded-lg border border-gray-200" style={{backgroundColor: colors.card, color: colors.text, borderColor: colors.border}}>
          <button
            onClick={() => setUserSettingsExpanded(!userSettingsExpanded)}
            className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-500"
          >
            <div className="flex items-center gap-3">
              <Settings className="w-5 h-5 text-blue-600" />
              <span className="text-base font-medium text-gray-900" style={{color:colors.text}}>User Settings</span>
            </div>
            {userSettingsExpanded ? (
              <ChevronUp className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-400" />
            )}
          </button>

          {userSettingsExpanded && (
            <div className="px-6 pb-6">
              <div className="mt-6 text-sm text-gray-500" style={{color:colors.text}}>
                User settings content goes here...
              </div>
            </div>
          )}
        </div>

        {/* Report Configurations Section */}
        <br></br>
        <div className=" rounded-lg border border-gray-200" style={{backgroundColor: colors.card, color: colors.text, borderColor: colors.border}}>
          <button
            onClick={() => setReportConfigExpanded(!reportConfigExpanded)}
            className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-500"
          >
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 flex items-center justify-center">
                <span className="text-blue-600 font-bold text-lg">@</span>
              </div>
              <span className="text-base font-medium text-gray-900" style={{color:colors.text}}>Report Configurations</span>
            </div>
            {reportConfigExpanded ? (
              <ChevronUp className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-400" />
            )}
          </button>

          {reportConfigExpanded && (
            <div className="px-6 pb-6 border-t border-gray-200" style={{color:colors.text}}>
              <div className="mt-6 text-sm text-gray-500">
                Report configuration content goes here...
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}