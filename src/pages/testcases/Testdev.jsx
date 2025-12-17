
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Add this import
import { useTheme } from '../../context/ThemeContext';

import { Home, RefreshCw, Play, Settings, Plus, Search, Filter, MoreVertical, HelpCircle, User, Grid, List, Menu, X } from 'lucide-react';

export default function TestScriptsUI() {
  const navigate = useNavigate();
  const [loadingModule, setLoadingModule] = useState(false);
const [loadingTestcase, setLoadingTestcase] = useState(false);

  const [activeTab, setActiveTab] = useState('scripts');
  const [showAddModule, setShowAddModule] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showManualTestCaseModal, setShowManualTestCaseModal] = useState(false);
  const [moduleName, setModuleName] = useState('');
  const [description, setDescription] = useState('');
  const { theme, toggleTheme, colors } = useTheme();

  const handleCreateModule = async () => {
  if (!moduleName.trim()) {
    alert("Module name is required");
    return;
  }
  setLoadingModule(true);

 
  
  setLoadingModule(false);
  setShowCreateModal(false);
  setShowAddModule(false);
  setModuleName('');
  setDescription('');
};

const handleCreateManualTestCase = async () => {
  if (!manualTestCaseData.name || !manualTestCaseData.type || !manualTestCaseData.parentModule) {
    alert("Name, Type and Parent Module are required");
    return;
  }
  setLoadingTestcase(true);

  
 
 

  setLoadingTestcase(false);
  setShowManualTestCaseModal(false);
  setManualTestCaseData({
    creationType: 'new',
    name: '',
    type: '',
    description: '',
    parentModule: '',
    testcaseTemplate: 'Manual Test Case Template',
    labels: '',
  });
};

  
  // Manual Test Case form state
  const [manualTestCaseData, setManualTestCaseData] = useState({
    creationType: 'new',
    name: '',
    type: '',
    description: '',
    parentModule: '',
    testcaseTemplate: 'Manual Test Case Template',
    labels: '',
  });

  return (
    <div className="min-h-screen" style={{backgroundColor: colors.card, color: colors.text, borderColor: colors.border}}>
      {/* Top Navigation Bar */}
      <div className="bg-white border-b border-gray-200 px-4 py-3" style={{backgroundColor: colors.card, color: colors.text, borderColor: colors.border}}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm">
            <Home className="w-5 h-5" />
            <span className="text-gray-400">{'>'}</span>
            <span className="hover:underline cursor-pointer font-medium" style={{color: colors.text}}>Test Development</span>
            <span className="text-gray-400">{'>'}</span>
            <span style={{color: colors.text}}>Scripts</span>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="p-2 hover:bg-black/30 rounded">
              <RefreshCw className="w-5 h-5" />
            </button>
            <div className="px-4 py-2 border border-gray-300 rounded text-sm text-gray-700" style={{color: colors.text}}>
              0 Running Of 1 Parallel Runs
            </div>
            <button className="p-2 hover:bg-black/30 rounded" >
              <HelpCircle className="w-5 h-5" />
            </button>
            <button className="p-2 hover:bg-black/30 rounded">
              <User className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200 px-4" style={{backgroundColor: colors.card, color: colors.text, borderColor: colors.border}}>
        <div className="flex items-center justify-between">
          <div className="flex gap-8">
            <button 
              onClick={() => setActiveTab('scripts')}
              className={`py-4 px-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'scripts' 
                  ? 'border-blue-400 text-gray-200' 
                  : 'border-transparent text-gray-400 hover:text-gray-400'
              }`}
            >
              Scripts
            </button>
            <button 
              onClick={() => setActiveTab('execution')}
              className={`py-4 px-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'execution' 
                  ? 'border-blue-400 text-gray-200' 
                  : 'border-transparent text-gray-400 hover:text-gray-400'
              }`}
            >
              Execution Dashboard
            </button>
          </div>
          <button className="p-2 hover:bg-gray-100 rounded">
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6" style={{backgroundColor: colors.card, color: colors.text, borderColor: colors.border}}>
        {/* Header */}
        <div className="flex items-center justify-between mb-6" >
          <h1 className="text-2xl font-semibold" style={{color: colors.text}}>Scripts</h1>
          
          <div className="flex items-center gap-3">
            <button className="p-2 hover:bg-black/30 rounded">
              <Search className="w-5 h-5" />
            </button>
            <button className="p-2 hover:bg-black/30 rounded">
              <Filter className="w-5 h-5" />
            </button>
            <button className="p-2 hover:bg-black/30 rounded">
              <Play className="w-5 h-5" />
            </button>
            <button className="p-2 hover:bg-black/30 rounded">
              <Settings className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setShowCreateModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2 text-sm font-medium shadow-md"
            >
              <Plus className="w-4 h-4" />
              Module
            </button>
            <button 
              onClick={() => setShowManualTestCaseModal(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center gap-2 text-sm font-medium shadow-md"
            >
              <Plus className="w-4 h-4" />
              Manual Test Case
            </button>
          </div>
        </div>

        {/* Table Header */}
        <div className="bg-white rounded-t-lg border border-gray-600" style={{backgroundColor: colors.card, color: colors.text, borderColor: colors.border}}>
          <div className="grid grid-cols-12 gap-4 px-4 py-3 bg-gray-50 border-b border-gray-200 text-sm font-medium text-gray-700" style={{backgroundColor: colors.card, color: colors.text, borderColor: colors.border}}>
            <div className="col-span-5 flex items-center gap-3">
              <span>MODULE</span>
              <Menu className="w-4 h-4 cursor-pointer" />
            </div>
            <div className="col-span-3">TEST CASE TYPE</div>
            <div className="col-span-3">TYPE</div>
            <div className="col-span-1">ACTIONS</div>
          </div>

          {/* Root Module Row */}
          <div className="grid grid-cols-12 gap-4 px-4 py-4 items-center hover:bg-black/20">
            <div className="col-span-5 flex items-center gap-3">
              <input type="checkbox" className="w-4 h-4 text-blue-600 rounded border-gray-300" />
              <span className="text-blue-400 font-semibold">Root Module</span>
              <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded font-semibold">MO</span>
              <span className="bg-gray-50 text-gray-700 text-xs px-2 py-1 rounded">S0</span>
              <button 
                className="p-1 hover:bg-gray-200 rounded"
                onClick={() => setShowAddModule(true)}
              >
                <Plus className="w-4 h-4 text-gray-400" />
              </button>
            </div>
            <div className="col-span-3"></div>
            <div className="col-span-3"></div>
            <div className="col-span-1"></div>
          </div>
          
          {/* Add Module Button Display */}
          {showAddModule && (
            <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
              <button 
                onClick={() => setShowCreateModal(true)}
                className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 text-sm"
              >
                Add Module
              </button>
            </div>
          )}
        </div>

        {/* Quick Start Guide */}
        <div className="bg-white rounded-b-lg border border-t-0 border-gray-200 p-12" style={{backgroundColor: colors.card, color: colors.text, borderColor: colors.border}}>
          <div className="max-w-2xl mx-auto text-center" style={{backgroundColor: colors.card, color: colors.text, borderColor: colors.border}}>
            <h2 className="text-xl font-semibold text-gray-900 mb-8" style={{color: colors.text}}>Quick Start</h2>
            
            <div className="space-y-4" style={{backgroundColor: colors.card, color: colors.text, borderColor: colors.border}}>
              <div className="flex items-center justify-center gap-3 text-gray-700" style={{color: colors.text}}>
                <span className="text-base">Step 1 : Click</span>
                <button 
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    setShowCreateModal(true);
                  }}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2 text-sm font-medium shadow-md cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  Module
                </button>
                <span className="text-base" style={{color: colors.text}}>to start adding the Modules</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Button */}
      <button className="fixed bottom-6 right-6 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      </button>
      
      {/* Right Arrow Button */}
      <button className="fixed bottom-6 right-24 bg-white border border-gray-300 text-gray-600 p-2 rounded shadow hover:bg-gray-50">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Create Module Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-md p-6 border border-gray-200" style={{backgroundColor: colors.card, color: colors.text, borderColor: colors.border}}>
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900" style={{color: colors.text}}>Create Module</h2>
              <button 
                onClick={() => setShowCreateModal(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="space-y-4" >
              {/* Name Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" style={{color: colors.text}} >
                  <span className="text-red-500">*</span> Name
                </label>
                <input
                  type="text"
                  value={moduleName}
                  onChange={(e) => setModuleName(e.target.value)}
                  placeholder="Enter module name"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Description Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" style={{color: colors.text}}>
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Your description goes here..."
                  rows={4}
                  maxLength={200}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 resize-none"
                />
                <div className="text-right text-sm text-gray-500 mt-1">
                  {description.length}/200
                </div>
              </div>

              {/* Parent Module Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" style={{color: colors.text}}>
                  <span className="text-red-500">*</span>Parent Module
                </label>
                <div className="px-3 py-2 border border-gray-300 rounded bg-gray-50 text-gray-700" style={{backgroundColor: colors.card, color: colors.text, borderColor: colors.border}}>
                  Root Module
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 mt-6">
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setModuleName('');
                  setDescription('');
                }}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded hover:bg-gray-200 text-sm font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateModule}

                //   // Handle create module logic here
                //   console.log('Creating module:', { moduleName, description });
                //   setShowCreateModal(false);
                //   setShowAddModule(false);
                //   setModuleName('');
                //   setDescription('');
                // }}
                className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 text-sm font-medium"
              >
{loadingModule ? "Creating..." : "Create"}
</button>

            </div>
          </div>
        </div>
      )}

      {/* Create Manual Test Case Modal */}
      {showManualTestCaseModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm overflow-y-auto pt-20">
          <div className="rounded-lg shadow-2xl w-full max-w-lg mx-4 mt-8 mb-8" style={{backgroundColor: colors.card, color: colors.text, borderColor: colors.border}}>
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-xl font-semibold text-gray-800" style={{color: colors.text}}>Create Manual Test Case</h2>
              <button 
                onClick={() => setShowManualTestCaseModal(false)}
                className="text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6" style={{backgroundColor: colors.card, color: colors.text, borderColor: colors.border}}>
              {/* Radio Buttons */}
              <div className="space-y-2">
                <p className="text-gray-700" style={{color: colors.text}}>
                  Do you want to create a new Manual test case or add to existing Automation script ?
                </p>
                <div className="space-y-2">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="testCaseType"
                      value="new"
                      checked={manualTestCaseData.creationType === 'new'}
                      onChange={() => setManualTestCaseData({...manualTestCaseData, creationType: 'new'})}
                      className="form-radio text-blue-600 h-4 w-4"
                    />
                    <span className="text-gray-900" style={{color: colors.text}}>Create new Manual test case</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="testCaseType"
                      value="add"
                      checked={manualTestCaseData.creationType === 'add'}
                      onChange={() => setManualTestCaseData({...manualTestCaseData, creationType: 'add'})}
                      className="form-radio text-blue-600 h-4 w-4"
                    />
                    <span className="text-gray-900" style={{color: colors.text}}>Add Manual test case to existing Automation script</span>
                  </label>
                </div>
              </div>

              {/* Input Fields Grid */}
              <div className="grid grid-cols-2 gap-4">
                {/* Name */}
                <div className="col-span-1">
                  <label htmlFor="mtc-name" className="block text-sm font-medium text-gray-700" style={{color: colors.text}}>
                    <span className="text-red-500">*</span> Name
                  </label>
                  <input
                    type="text"
                    id="mtc-name"
                    value={manualTestCaseData.name}
                    onChange={(e) => setManualTestCaseData({...manualTestCaseData, name: e.target.value})}
                    placeholder="Enter script name"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                    style={{backgroundColor: colors.card, color: colors.text, borderColor: colors.border}}
                  />
                </div>

                {/* Type */}
                <div className="col-span-1">
                  <label htmlFor="mtc-type" className="block text-sm font-medium text-gray-700" style={{color: colors.text}}>
                    <span className="text-red-500">*</span> Type
                  </label>
                  <select
                    id="mtc-type"
                    value={manualTestCaseData.type}
                    onChange={(e) => setManualTestCaseData({...manualTestCaseData, type: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white pr-8"
                    style={{backgroundColor: colors.card, color: colors.text, borderColor: colors.border}}
                  >
                    <option value="">Select script type</option>
                    <option value="functional">Functional</option>
                    <option value="regression">Regression</option>
                  </select>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label htmlFor="mtc-description" className="block text-sm font-medium text-gray-700" style={{color: colors.text}}>
                  Description
                </label>
                <textarea
                  id="mtc-description"
                  rows="3"
                  value={manualTestCaseData.description}
                  onChange={(e) => setManualTestCaseData({...manualTestCaseData, description: e.target.value})}
                  placeholder="Your description goes here"
                  maxLength="200"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 resize-none focus:ring-blue-500 focus:border-blue-500"
                  style={{backgroundColor: colors.card, color: colors.text, borderColor: colors.border}}
                />
                <div className="text-right text-xs text-gray-500">{manualTestCaseData.description.length}/200</div>
              </div>
              
              {/* Parent Module */}
              <div className="space-y-1">
                <label htmlFor="mtc-parentModule" className="block text-sm font-medium text-gray-700" style={{color: colors.text}}>
                  <span className="text-red-500">*</span> Parent Module
                </label>
                <select
                  id="mtc-parentModule"
                  value={manualTestCaseData.parentModule}
                  onChange={(e) => setManualTestCaseData({...manualTestCaseData, parentModule: e.target.value})}
                  className="w-full text-left bg-white border border-gray-300 rounded-md shadow-sm p-2 text-gray-700 hover:bg-gray-50 focus:outline-none appearance-none pr-8"
                  style={{backgroundColor: colors.card, color: colors.text, borderColor: colors.border}}
                >
                  <option value="">Choose Module</option>
                  <option value="module_1">Module A</option>
                  <option value="module_2">Module B</option>
                </select>
              </div>

              {/* Testcase Template */}
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700" style={{color: colors.text}}>
                  <span className="text-red-500">*</span> Testcase Template
                </label>
                <div className="flex justify-between items-center">
                  <select
                    id="mtc-testcaseTemplate"
                    value={manualTestCaseData.testcaseTemplate}
                    onChange={(e) => setManualTestCaseData({...manualTestCaseData, testcaseTemplate: e.target.value})}
                    className="flex-1 border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white pr-8"
                    style={{backgroundColor: colors.card, color: colors.text, borderColor: colors.border}}
                  >
                    <option>FireFlink Manual Test Case Template</option>
                  </select>
                  <button
                  onClick={() => navigate('/view-template')} // Add this onClick handler

                    className="ml-4 text-blue-600 hover:text-blue-800 text-sm font-medium whitespace-nowrap"
                  >
                    View Template
                  </button>
                </div>
              </div>
              
              {/* Labels */}
              <div className="space-y-1">
                <label htmlFor="mtc-labels" className="block text-sm font-medium text-gray-700" style={{color: colors.text}}>
                  Labels
                </label>
                <select
                  id="mtc-labels"
                  value={manualTestCaseData.labels}
                  onChange={(e) => setManualTestCaseData({...manualTestCaseData, labels: e.target.value})}
                  className="w-full border border-gray-300 rounded-md shadow-sm p-2 text-gray-500 appearance-none bg-white pr-8"
                  style={{backgroundColor: colors.card, color: colors.text, borderColor: colors.border}}
                >
                  <option value="">Labels</option>
                  <option value="critical">Critical</option>
                  <option value="ui">UI</option>
                </select>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end p-4 border-t space-x-2">
               <button
                onClick={() => {
                  setShowManualTestCaseModal(false);
                  setManualTestCaseData({
                    creationType: 'new',
                    name: '',
                    type: '',
                    description: '',
                    parentModule: '',
                    testcaseTemplate: 'FireFlink Manual Test Case Template',
                    labels: '',
                  });
                }}
                className="px-4 py-2 text-gray-700 border border-gray-700 rounded-md hover:bg-gray-50 focus:outline-none"
                style={{backgroundColor: colors.card, color: colors.text, borderColor: colors.border}}
              >
                Cancel
              </button>
              <button
                onClick={handleCreateManualTestCase}
                disabled={loadingTestcase}
                className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none disabled:opacity-60"
              >
                {loadingTestcase ? "Creating..." : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}