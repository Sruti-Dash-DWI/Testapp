import React, { useState } from 'react';
import DashboardLayout from '../../layout/DashboardLayout';



const SearchIcon = () => (
    <svg className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" width="16" height="16" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" clipRule="evenodd" d="M11.396 10.396a6 6 0 111-1l5.317 5.317a.75.75 0 01-1.06 1.06l-5.317-5.317zm-5.396.604a5 5 0 100-10 5 5 0 000 10z" />
    </svg>
);

const ChevronDownIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M7 10l5 5 5-5H7z" />
    </svg>
);

const UserIcon = () => (
    <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="#5E6C84" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.33 4 18V20H20V18C20 15.33 14.67 14 12 14Z" />
        </svg>
    </div>
);

const EqualsIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M5 10H19" stroke="#5E6C84" strokeWidth="2" strokeLinecap="round" />
        <path d="M5 14H19" stroke="#5E6C84" strokeWidth="2" strokeLinecap="round" />
    </svg>
);

const MoreHorizontalIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <circle cx="6" cy="12" r="1.5" />
        <circle cx="12" cy="12" r="1.5" />
        <circle cx="18" cy="12" r="1.5" />
    </svg>
);

const NewInsightsIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
        <polyline points="3 17 9 11 13 15 21 7"></polyline>
        <polyline points="15 7 21 7 21 13"></polyline>
    </svg>
);

const FiltersIcon = () => (
     <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" xmlns="http://www.w3.org/2000/svg">
        <line x1="4" y1="8" x2="20" y2="8" />
        <line x1="4" y1="16" x2="20" y2="16" />
        <circle cx="8" cy="8" r="2" fill="white" strokeWidth="2"/>
        <circle cx="16" cy="16" r="2" fill="white" strokeWidth="2"/>
    </svg>
);

const CloseIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/>
    </svg>
);

// Reusable Toggle Switch Component for the View Settings panel
const ToggleSwitch = ({ isChecked, setIsChecked }) => {
    return (
        
        <button
            onClick={() => setIsChecked(!isChecked)}
            className={`relative inline-flex items-center h-5 rounded-full w-9 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${isChecked ? 'bg-green-500' : 'bg-gray-300'}`}
        >
            <span
                className={`inline-block w-3.5 h-3.5 transform bg-white rounded-full transition-transform ${isChecked ? 'translate-x-4' : 'translate-x-1'}`}
            />
        </button>
    );
};


// --- Initial Data ---
const initialData = {
    items: {
        'SCRUM-1': { id: 'SCRUM-1', title: 'Analyze user feedback for Q3', status: 'TO DO' },
        'SCRUM-2': { id: 'SCRUM-2', title: 'Develop new dashboard widget', status: 'TO DO' },
        'SCRUM-3': { id: 'SCRUM-3', title: 'Fix login authentication bug', status: 'TO DO' },
        'SCRUM-4': { id: 'SCRUM-4', title: 'Design marketing page mockups', status: 'TO DO' },
    },
    sprints: {
        'sprint-1': { id: 'sprint-1', name: 'SCRUM Sprint 1', itemIds: ['SCRUM-2'] },
    },
    backlog: { id: 'backlog', itemIds: ['SCRUM-1', 'SCRUM-3', 'SCRUM-4'] },
};


export default function BacklogPage() {

    const [boardData, setBoardData] = useState(initialData);
    const [draggedItemId, setDraggedItemId] = useState(null);
    const [activePanel, setActivePanel] = useState(null); 
    const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);

    
    const [showEpicPanel, setShowEpicPanel] = useState(false);
    const [showEmptySprints, setShowEmptySprints] = useState(true);
    const [density, setDensity] = useState('default');
    const [fieldToggles, setFieldToggles] = useState({
        workType: true, workItemKey: true, epic: true, status: true, priority: true
    });

    const handleFieldToggle = (field) => {
        setFieldToggles(prev => ({ ...prev, [field]: !prev[field] }));
    };

    const handlePanelToggle = (panelName) => {
        setActivePanel(currentPanel => (currentPanel === panelName ? null : panelName));
        setIsMoreMenuOpen(false);
    };

    const handleMoreMenuToggle = () => {
        setIsMoreMenuOpen(prevState => !prevState);
        setActivePanel(null);
    };

    const handleDragStart = (e, itemId) => {
        setDraggedItemId(itemId);
        e.dataTransfer.effectAllowed = 'move';
        setTimeout(() => { e.target.style.opacity = '0.5'; }, 0);
    };
    
    const handleDragEnd = (e) => {
        e.target.style.opacity = '1';
        setDraggedItemId(null);
    };

    const handleDragOver = (e) => e.preventDefault();

    const findItemLocation = (itemId) => {
        if (boardData.sprints['sprint-1'].itemIds.includes(itemId)) {
            return { listId: 'sprint-1' };
        }
        if (boardData.backlog.itemIds.includes(itemId)) {
            return { listId: 'backlog' };
        }
        return null;
    };

    const handleDrop = (e, targetListId) => {
        e.preventDefault();
        if (!draggedItemId) return;
        const sourceLocation = findItemLocation(draggedItemId);
        if (!sourceLocation) return;
        
        const { listId: sourceListId } = sourceLocation;
        if (sourceListId === targetListId && e.target.closest('[data-item-id]')?.getAttribute('data-item-id') === draggedItemId) return;

        const newBoardData = JSON.parse(JSON.stringify(boardData));

        const sourceList = sourceListId === 'backlog' ? newBoardData.backlog.itemIds : newBoardData.sprints[sourceListId].itemIds;
        const sourceIndex = sourceList.indexOf(draggedItemId);
        if (sourceIndex > -1) sourceList.splice(sourceIndex, 1);

        const targetList = targetListId === 'backlog' ? newBoardData.backlog.itemIds : newBoardData.sprints[targetListId].itemIds;
        const dropTargetElement = e.target.closest('[data-item-id]');
        let dropIndex = targetList.length;

        if (dropTargetElement) {
            const dropTargetId = dropTargetElement.getAttribute('data-item-id');
            const index = targetList.indexOf(dropTargetId);
            if(index !== -1) dropIndex = index;
        }
        
        targetList.splice(dropIndex, 0, draggedItemId);
        setBoardData(newBoardData);
    };

    const sprint = boardData.sprints['sprint-1'];
    const sprintItems = sprint.itemIds.map(id => boardData.items[id]);
    const backlogItems = boardData.backlog.itemIds.map(id => boardData.items[id]);

    return (
        <>
        <div className="h-full flex flex-col font-sans text-[#172B4D]" style={{background: 'linear-gradient(135deg, #ad97fd 0%, #f6a5dc 50%, #ffffff 100%)'}}>
           <header className="sticky top-0 z-10 p-4 bg-white/80 backdrop-blur-sm border-b border-gray-200/50 flex items-center justify-between flex-shrink-0">
  <div className="flex items-center space-x-4">
      <div className="relative">
          <SearchIcon />
          <input
              type="text"
              placeholder="Search backlog"
              className="pl-9 pr-4 py-1.5 text-sm border rounded bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
      </div>
      <div className="flex items-center space-x-2 border-l pl-4">
          <div className="w-7 h-7 flex items-center justify-center bg-red-500 text-white font-bold rounded-full text-xs">D</div>
          <button className="flex items-center space-x-1 text-sm font-medium p-1 hover:bg-gray-200 rounded">
              <span>Epic</span><ChevronDownIcon />
          </button>
      </div>
  </div>
  <div className="flex items-center space-x-1 text-gray-600">
      <button onClick={() => handlePanelToggle('insights')} className={`p-2 rounded ${activePanel === 'insights' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-200'}`}><NewInsightsIcon /></button>
      <button onClick={() => handlePanelToggle('view-settings')} className={`p-2 rounded ${activePanel === 'view-settings' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-200'}`}><FiltersIcon /></button>
      <div className="relative">
          <button onClick={handleMoreMenuToggle} className="p-2 hover:bg-gray-200 rounded"><MoreHorizontalIcon /></button>
          {isMoreMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-20 border">
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Manage custom filters</a>
              </div>
          )}
      </div>
  </div>
</header>


            <div className="flex flex-grow overflow-hidden">
                <main className={`flex-grow transition-all duration-300 ease-in-out overflow-y-auto p-6 ${activePanel ? 'w-2/3' : 'w-full'}`}>
                    <div className="bg-[#f0eaff]/60 backdrop-blur-sm p-3 rounded-md shadow-sm border border-white/30" onDragOver={handleDragOver} onDrop={(e) => handleDrop(e, 'sprint-1')}>
                        <div className="flex justify-between items-center mb-3">
                            <div className="flex items-center gap-3"><input type="checkbox" className="form-checkbox h-4 w-4" /><h2 className="font-bold text-gray-800">{sprint.name}</h2><button className="text-sm text-gray-500 hover:underline">Add dates</button><span className="text-sm text-gray-500">({sprintItems.length} work item)</span></div>
                            <div className="flex items-center gap-4"><div className="flex space-x-1"><span className="text-xs font-bold bg-gray-200 text-gray-700 px-2 py-0.5 rounded">0</span><span className="text-xs font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded">0</span><span className="text-xs font-bold bg-green-100 text-green-800 px-2 py-0.5 rounded">0</span></div><button className="bg-blue-600 text-white px-3 py-1.5 text-sm font-semibold rounded hover:bg-blue-700">Start sprint</button><button className="text-gray-500 hover:bg-gray-200 p-1 rounded-full"><MoreHorizontalIcon /></button></div>
                        </div>
                        <div className="min-h-[80px] bg-purple-100/40 rounded p-2 border-2 border-dashed border-purple-200/50">{sprintItems.map((item) => (<div key={item.id} data-item-id={item.id} draggable="true" onDragStart={(e) => handleDragStart(e, item.id)} onDragEnd={handleDragEnd} className="flex items-center p-2 mb-1 rounded bg-white border hover:bg-blue-50 cursor-grab"><input type="checkbox" className="mr-3 form-checkbox h-4 w-4" /><span className="text-sm text-gray-500 w-24 font-medium">{item.id}</span><span className="flex-grow text-sm text-gray-800">{item.title}</span><div className="flex items-center space-x-4 ml-4"><span className="text-xs font-semibold bg-gray-200 text-gray-700 px-2 py-1 rounded">{item.status}</span><EqualsIcon /><UserIcon /></div></div>))}</div>
                        <button className="mt-3 text-sm font-semibold text-gray-600 hover:bg-gray-200 px-3 py-1.5 rounded">+ Create</button>
                    </div>

                    <div className="text-center my-2 text-gray-700/80"><span className="text-xs font-semibold">1 work item • Estimate: 0</span></div>

                    <div className="bg-[#fff0f9]/50 backdrop-blur-sm p-3 rounded-md border border-white/30" onDragOver={handleDragOver} onDrop={(e) => handleDrop(e, 'backlog')}>
                        <div className="flex justify-between items-center mb-3">
                             <div className="flex items-center gap-4"><input type="checkbox" className="form-checkbox h-4 w-4" /><h2 className="font-bold text-gray-800">Backlog</h2><span className="text-sm text-gray-500">{backlogItems.length} work items</span></div>
                            <div className="flex items-center gap-4"><div className="flex space-x-1"><span className="text-xs font-bold bg-gray-200 text-gray-700 px-2 py-0.5 rounded">0</span><span className="text-xs font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded">0</span><span className="text-xs font-bold bg-green-100 text-green-800 px-2 py-0.5 rounded">0</span></div><button className="bg-gray-200 text-gray-800 px-3 py-1.5 text-sm font-semibold rounded hover:bg-gray-300">Create sprint</button></div>
                        </div>
                         <div className="min-h-[120px] bg-pink-100/30 rounded p-2 border-2 border-dashed border-pink-200/50">{backlogItems.map((item) => (<div key={item.id} data-item-id={item.id} draggable="true" onDragStart={(e) => handleDragStart(e, item.id)} onDragEnd={handleDragEnd} className="flex items-center p-2 mb-1 rounded bg-white border hover:bg-blue-50 cursor-grab"><input type="checkbox" className="mr-3 form-checkbox h-4 w-4" /><span className="text-sm text-gray-500 w-24 font-medium">{item.id}</span><span className="flex-grow text-sm text-gray-800">{item.title}</span><div className="flex items-center space-x-4 ml-4"><span className="text-xs font-semibold bg-gray-200 text-gray-700 px-2 py-1 rounded">{item.status}</span><EqualsIcon /><UserIcon /></div></div>))}</div>
                        <button className="mt-3 text-sm font-semibold text-gray-600 hover:bg-gray-200 px-3 py-1.5 rounded">+ Create</button>
                    </div>
                </main>

                {activePanel && (
                    <aside className="w-1/3 bg-white/80 backdrop-blur-sm border-l border-gray-200/50 p-4 transition-all duration-300 ease-in-out overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-base">{activePanel === 'insights' ? 'Backlog insights' : 'View settings'}</h3>
                            <button onClick={() => setActivePanel(null)} className="p-1 hover:bg-gray-200 rounded-full"><CloseIcon /></button>
                        </div>
                        {activePanel === 'insights' && (<div className="space-y-4"><div className="p-4 bg-gray-50 rounded-md border"><h4 className="font-semibold text-sm">Sprint commitment</h4><p className="text-sm text-gray-600 mt-1">Add estimates to plan sprints with more accuracy.</p><a href="#" className="text-sm text-blue-600 hover:underline mt-2 inline-block">Learn more</a></div><div className="p-4 bg-gray-50 rounded-md border"><h4 className="font-semibold text-sm">Work type breakdown</h4><p className="text-sm text-gray-600 mt-2">Your top work item type to focus on in this sprint.</p><div className="mt-2"><span className="text-xs">Task</span><div className="w-full bg-gray-200 rounded-full h-2 mt-1"><div className="bg-blue-500 h-2 rounded-full" style={{width: "100%"}}></div></div></div></div></div>)}
                        {activePanel === 'view-settings' && (
                            <div className="space-y-6 text-sm">
                                <div>
                                    <h4 className="font-semibold text-gray-500 text-xs uppercase mb-2">View settings</h4>
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center"><label>Epic panel</label><ToggleSwitch isChecked={showEpicPanel} setIsChecked={setShowEpicPanel} /></div>
                                        <div className="flex justify-between items-center"><label>Empty sprints</label><ToggleSwitch isChecked={showEmptySprints} setIsChecked={setShowEmptySprints} /></div>
                                    </div>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-500 text-xs uppercase mb-2">Density</h4>
                                    <div className="space-y-2">
                                        <label className="flex items-center"><input type="radio" name="density" value="default" checked={density === 'default'} onChange={(e) => setDensity(e.target.value)} className="form-radio h-4 w-4 mr-2" /> Default</label>
                                        <label className="flex items-center"><input type="radio" name="density" value="compact" checked={density === 'compact'} onChange={(e) => setDensity(e.target.value)} className="form-radio h-4 w-4 mr-2" /> Compact</label>
                                    </div>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-500 text-xs uppercase mb-2">Fields</h4>
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center"><label>Work type</label><ToggleSwitch isChecked={fieldToggles.workType} setIsChecked={() => handleFieldToggle('workType')} /></div>
                                        <div className="flex justify-between items-center"><label>Work item key</label><ToggleSwitch isChecked={fieldToggles.workItemKey} setIsChecked={() => handleFieldToggle('workItemKey')} /></div>
                                        <div className="flex justify-between items-center"><label>Epic</label><ToggleSwitch isChecked={fieldToggles.epic} setIsChecked={() => handleFieldToggle('epic')} /></div>
                                        <div className="flex justify-between items-center"><label>Status</label><ToggleSwitch isChecked={fieldToggles.status} setIsChecked={() => handleFieldToggle('status')} /></div>
                                        <div className="flex justify-between items-center"><label>Priority</label><ToggleSwitch isChecked={fieldToggles.priority} setIsChecked={() => handleFieldToggle('priority')} /></div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </aside>
                )}
            </div>
        </div>
        </>
        
    );
}

