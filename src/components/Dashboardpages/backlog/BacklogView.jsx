import React from 'react';

// --- Imports ---
import {
    StatusDropdown,
    PriorityDropdown,
    UserSelector,
    Dropdown
} from './ReusableComponents';
import {
    BacklogSearchIcon,
    DropdownChevronIcon,
    MoreHorizontalIcon,
    NewInsightsIcon,
    FiltersIcon,
    PencilIcon,
    ActionTrashIcon,
    UserAvatar,
} from '../../Icons';
import { useTheme } from '../../../context/ThemeContext';




const calculateStatusCounts = (itemIds, allItems) => {
    const counts = {
        todo: 0,
        inProgress: 0,
        done: 0,
    };

    itemIds.forEach(id => {
        const item = allItems[id];
        if (!item || !item.status || !item.status.title) {
            return;
        }

        const status = item.status.title.toUpperCase();

        if (status === 'DONE') {
            counts.done += 1;
        } else if (['IN PROGRESS', 'IN REVIEW', 'TESTING'].includes(status)) {
            counts.inProgress += 1;
        } else {
            counts.todo += 1;
        }
    });

    return counts;
};




const StatusSummaryDots = ({ todo, inProgress, done }) => (
    <div className="flex items-center space-x-1">

        <div className="relative group flex items-center">

            <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 whitespace-nowrap 
                       bg-gray-800 text-white text-xs rounded py-1 px-2 
                       opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                {`${todo} To Do`}
            </span>

            <span className="text-xs font-bold bg-gray-200 text-gray-700 w-6 h-5 flex items-center justify-center rounded-full">
                {todo}
            </span>
        </div>


        <div className="relative group flex items-center">
            <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 whitespace-nowrap 
                       bg-gray-800 text-white text-xs rounded py-1 px-2 
                       opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                {`${inProgress} In Progress`}
            </span>
            <span className="text-xs font-bold bg-blue-100 text-blue-800 w-6 h-5 flex items-center justify-center rounded-full">
                {inProgress}
            </span>
        </div>


        <div className="relative group flex items-center">
            <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 whitespace-nowrap 
                       bg-gray-800 text-white text-xs rounded py-1 px-2 
                       opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                {`${done} Done`}
            </span>
            <span className="text-xs font-bold bg-green-100 text-green-800 w-6 h-5 flex items-center justify-center rounded-full">
                {done}
            </span>
        </div>

    </div>
);

// --- Side Panel Components ---
const InsightsPanel = ({ onClose }) => {

    const { theme, toggleTheme, colors } = useTheme();



    return (
        <div className="p-4 flex flex-col h-full bg-white/80 backdrop-blur-sm" style={{ backgroundColor: colors.card, color: colors.text, borderColor: colors.border }}>
            <div className="flex justify-between items-center mb-6 flex-shrink-0" >
                <h3 className="text-lg font-bold text-gray-800" style={{ color: colors.text }}>Backlog insights</h3>
                <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708 .708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" /></svg>
                </button>
            </div>
            <div className="space-y-4 flex-grow overflow-y-auto pr-2" >
                <div className="p-4 border rounded-lg bg-white shadow-sm" style={{ backgroundColor: colors.card, color: colors.text, borderColor: colors.border }}>
                    <h4 className="font-semibold text-gray-700" style={{ color: colors.text }}>Sprint commitment</h4>
                    <p className="text-sm text-gray-500 mt-1" style={{ color: colors.text }}>Add estimates to plan sprints with more accuracy.</p>
                    <p className="text-sm text-gray-600 mt-2" style={{ color: colors.text }}>This insight compares how much effort was allocated to a sprint against how much was completed.</p>
                    <a href="#" className="text-sm text-blue-600 hover:underline mt-2 inline-block">Learn more</a>
                </div>
                <div className="p-4 border rounded-lg bg-white shadow-sm" style={{ backgroundColor: colors.card, color: colors.text, borderColor: colors.border }}>
                    <h4 className="font-semibold text-gray-700" style={{ color: colors.text }}>Work type breakdown</h4>
                    <p className="text-sm text-gray-500 mt-1" style={{ color: colors.text }}>Your top work item type to focus on in this sprint.</p>
                    <div className="mt-3">
                        <span className="text-sm text-gray-600" style={{ color: colors.text }}>Task</span>
                        <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                            {/* This inline style is perfectly fine! */}
                            <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '75%' }}></div>
                        </div>
                    </div>
                </div>
                <div className="p-4 border rounded-lg bg-white shadow-sm mt-auto" style={{ backgroundColor: colors.card, color: colors.text, borderColor: colors.border }}>
                    <button className="text-sm text-gray-600 w-full text-left" style={{ color: colors.text }}>Give feedback</button>
                </div>
            </div>
        </div>
    );
};

const ToggleSwitch = ({ label, defaultChecked = false }) => (
    <div className="flex items-center justify-between">
        <span className="text-sm text-gray-700">{label}</span>
        <label className="inline-flex items-center cursor-pointer">
            <input type="checkbox" value="" className="sr-only peer" defaultChecked={defaultChecked} />
            <div className="relative w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
        </label>
    </div>
);

const ViewSettingsPanel = ({ onClose }) => {

    const { theme, toggleTheme, colors } = useTheme();


    return (

        <div className="p-4 flex flex-col h-full bg-white/80 backdrop-blur-sm" style={{ backgroundColor: colors.card, color: colors.text, borderColor: colors.border }}>
            <div className="flex justify-between items-center mb-6 flex-shrink-0">

                <h3 className="text-lg font-bold text-gray-800" style={{ color: colors.text }}>View settings</h3>
                <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200" style={{ color: colors.text }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708 .708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" /></svg>
                </button>
            </div>
            <div className="space-y-6 flex-grow overflow-y-auto pr-2">
                <div>
                    <ToggleSwitch label={<span style={{ color: colors.text }}>Epic Panel</span>} />
                    <div className="mt-3">
                        <ToggleSwitch label={<span style={{ color: colors.text }}>Empty sprints</span>} defaultChecked={true} />
                    </div>
                </div>
                <div>

                    <h4 className="font-bold text-gray-800 mb-2" style={{ color: colors.text }}>Density</h4>
                    <div className="space-y-2">

                        <label className="flex items-center"><input type="radio" name="density" className="form-radio" defaultChecked /> <span className="ml-2 text-sm text-gray-700" style={{ color: colors.text }}>Default</span></label>

                        <label className="flex items-center"><input type="radio" name="density" className="form-radio" /> <span className="ml-2 text-sm text-gray-700" style={{ color: colors.text }}>Compact</span></label>
                    </div>
                </div>
                <div>

                    <h4 className="font-bold text-gray-800 mb-2" style={{ color: colors.text }}>Fields</h4>
                    <div className="space-y-3" >
                        {['Work type', 'Work item key', 'Epic', 'Status', 'Estimate', 'Priority', 'Assignee'].map(field => (
                            <ToggleSwitch
                                key={field}
                                defaultChecked={true}
                                label={<span style={{ color: colors.text }}>{field}</span>}
                            />
                        ))}

                    </div>
                </div>
            </div>
        </div>
    );
};


// --- Main BacklogView Component ---
export default function BacklogView({

    // Data Props
    boardData,
    users,
    usersWithUnassigned,
    epicOptions,
    filteredItems,
    backlogItems,
    epics,
    uncompletedSprints,
    completedSprints,

    // State Props
    searchTerm,
    activePanel,
    selectedEpicId,
    editingSprintId,
    editingItemId,
    isEditingBacklogName,
    isCreatingSprint,
    newSprintName,

    // State Ref Props
    sprintNameInputRef,
    backlogNameInputRef,
    itemNameInputRef,
    newSprintInputRef,

    // Handler Props
    setSelectedEpicId,
    setSearchTerm,
    setIsCreatingEpic,
    handlePanelToggle,
    setSprintToEdit,
    handleDeleteSprint,
    setSprintToStart,
    handleOpenCompleteSprintModal,
    handleDragOver,
    handleDrop,
    handleDragStart,
    handleDragEnd,
    handleItemClick,
    handleUpdateItem,
    handleStartRenameSprint,
    handleStartRenameItem,
    handleRenameSprint,
    handleRenameItem,
    handleDeleteItem,
    handleCreateItem,
    handleStartRenameBacklog,
    handleRenameBacklog,
    setIsCreatingSprint,
    setNewSprintName,
    handleAddNewSprint,
    hasActiveSprint
}) {
    const { theme, toggleTheme, colors } = useTheme();

    const formatDate = (dateString) => {
        if (!dateString) return null;
        return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    if (!boardData) {
        return <div>Loading...</div>;
    }

    const moreMenuOptions = [
        { value: 'manage-filters', label: 'Manage custom filters' }
    ];

    const SprintSection = ({ sprint }) => {
        const sprintItems = sprint.itemIds.map(id => filteredItems[id]).filter(Boolean);
        const statusCounts = calculateStatusCounts(sprint.itemIds, filteredItems);
        const sprintOptions = [
            { value: 'edit', label: 'Edit sprint' },
            { value: 'delete', label: 'Delete sprint', isDestructive: true },
        ];
        const handleSprintAction = (action) => {
            if (action === 'edit') setSprintToEdit(sprint);
            if (action === 'delete') handleDeleteSprint(sprint.id);
        };
        const formattedStartDate = formatDate(sprint.startDate);
        const formattedEndDate = formatDate(sprint.endDate);

        return (
            <div key={sprint.id} className="mb-4" >
                <div className={`p-3 rounded-md shadow-sm border ${sprint.is_ended ? 'bg-gray-100' : 'bg-[#f0eaff]/60 backdrop-blur-sm border-white/30'}`} onDragOver={handleDragOver} onDrop={(e) => !sprint.is_ended && handleDrop(e, sprint.id)} style={{
                    backgroundColor: colors.card,
                    color: colors.text,
                    borderColor: colors.border,
                    textSubtle: colors.textSubtle,
                }}>
                    <div className="flex justify-between items-center mb-3" >
                        <div className="flex items-center gap-3">
                            <input type="checkbox" className="form-checkbox h-4 w-4" />
                            <div className="flex items-center gap-2">
                                <h2 className={`font-bold ${sprint.is_ended ? 'text-gray-600' : 'text-gray-800'}`} style={{ color: colors.text }}>{sprint.name}</h2>
                                {sprint.isActive && <span className="text-xs font-bold bg-green-200 text-green-800 px-2 py-0.5 rounded-full">ACTIVE</span>}
                                {sprint.is_ended && <span className="text-xs font-bold bg-gray-300 text-gray-700 px-2 py-0.5 rounded-full">COMPLETED</span>}
                                {!sprint.is_ended && editingSprintId !== sprint.id && <button onClick={() => handleStartRenameSprint(sprint.id)} className="text-gray-500 hover:text-gray-800" style={{ color: colors.text }}><PencilIcon /></button>}
                            </div>
                            {editingSprintId === sprint.id && (
                                <input
                                    ref={sprintNameInputRef}
                                    type="text"
                                    defaultValue={sprint.name}
                                    onBlur={(e) => handleRenameSprint(sprint.id, e.target.value)}
                                    onKeyDown={(e) => { if (e.key === 'Enter') handleRenameSprint(sprint.id, e.target.value) }}
                                    className="font-bold text-gray-800 bg-white border rounded px-1"
                                />
                            )}
                            {formattedStartDate && formattedEndDate && <span className="text-sm text-gray-500" style={{ color: colors.text }}>{formattedStartDate} - {formattedEndDate}</span>}
                            <span className="text-sm text-gray-500" style={{ color: colors.text }}>({sprintItems.length} work item)</span >
                            <StatusSummaryDots
                                todo={statusCounts.todo}
                                inProgress={statusCounts.inProgress}
                                done={statusCounts.done}
                            />
                        </div>
                        <div className="flex items-center gap-4">
                            {!sprint.is_ended && (
                                <>
                                    {sprint.isActive ? (
                                        <button onClick={() => handleOpenCompleteSprintModal(sprint.id)} className="bg-green-600 text-white px-3 py-1.5 text-sm font-semibold rounded hover:bg-green-700">Complete Sprint</button>
                                    ) : (
                                        <button onClick={() => setSprintToStart(sprint)} className="bg-blue-600 text-white px-3 py-1.5 text-sm font-semibold rounded hover:bg-blue-700 disabled:bg-blue-300" disabled={sprint.itemIds.length === 0 || hasActiveSprint}>Start sprint</button>
                                    )}
                                    <Dropdown options={sprintOptions} onSelect={handleSprintAction}>
                                        <button className="text-gray-500 hover:bg-gray-200 p-1 rounded-full" style={{ color: colors.text }}><MoreHorizontalIcon /></button>
                                    </Dropdown>
                                </>
                            )}
                        </div>
                    </div>
                    <div className={`min-h-[80px] rounded p-2 border-2 border-dashed ${sprint.is_ended ? 'bg-gray-50 border-gray-200' : 'bg-blue-100 border-blue-200'}`} style={{
                        backgroundColor: colors.card,
                        color: colors.text,
                        borderColor: colors.border,
                        textSubtle: colors.textSubtle,
                    }}>
                        {sprintItems.map((item) => (
                            <div key={item.id} data-item-id={item.id} draggable={!sprint.is_ended} onDragStart={(e) => handleDragStart(e, item.id)} onDragEnd={handleDragEnd} className="group flex items-center p-2 mb-1 rounded bg-white border hover:bg-blue-50 cursor-pointer" onClick={() => handleItemClick(item)} style={{
                                backgroundColor: colors.card,
                                color: colors.text,
                                borderColor: colors.border,
                                textSubtle: colors.textSubtle,


                            }}>
                                <input type="checkbox" onClick={e => e.stopPropagation()} className="mr-3 form-checkbox h-4 w-4" />
                                <span className="text-sm text-gray-500 w-24 font-medium" style={{ color: colors.text }}>{item.id}</span>
                                <span className="flex-grow text-sm text-gray-800 flex items-center gap-2">
                                    {editingItemId === item.id ? (
                                        <input
                                            ref={itemNameInputRef}
                                            type="text"
                                            defaultValue={item.title}
                                            onClick={e => e.stopPropagation()}
                                            onBlur={(e) => handleRenameItem(item.id, e.target.value)}
                                            onKeyDown={(e) => { if (e.key === 'Enter') handleRenameItem(item.id, e.target.value) }}
                                            className="text-sm text-gray-800 bg-white border rounded px-1 w-full"
                                        />
                                    ) : (
                                        <>
                                            <span style={{ color: colors.text }}>{item.title}</span>
                                            <button onClick={(e) => { e.stopPropagation(); handleStartRenameItem(item.id); }} className="text-gray-500 hover:text-gray-800 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: colors.text }}>
                                                <PencilIcon />
                                            </button>
                                        </>
                                    )}
                                </span>
                                <div className="flex items-center space-x-4 ml-4" onClick={e => e.stopPropagation()}>
                                    <StatusDropdown currentStatus={item.status} onItemUpdate={(updates) => handleUpdateItem(item.id, updates)} />
                                    <PriorityDropdown currentPriority={item.priority} onItemUpdate={(updates) => handleUpdateItem(item.id, updates)} isIconOnly={true} />
                                    <UserSelector selectedUserId={item.assignee} users={usersWithUnassigned} onUpdate={(userId) => handleUpdateItem(item.id, { assignee: userId })} />
                                    <button onClick={(e) => { e.stopPropagation(); handleDeleteItem(item.id); }} className="text-gray-500 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity" color={{ color: colors.text }}>
                                        <ActionTrashIcon />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                    {!sprint.is_ended && <button onClick={() => handleCreateItem(sprint.id)} className="mt-3 text-sm font-semibold text-gray-600 hover:bg-gray-200 px-3 py-1.5 rounded" style={{ color: colors.text }}>+ Create</button>}
                </div>
            </div>
        );
    };

    const backlogStatusCounts = calculateStatusCounts(boardData.backlog.itemIds, filteredItems);
    return (
        <div className="h-full flex flex-col font-sans text-[#172B4D]" style={{
            backgroundColor: colors.card,
            color: colors.text,
            borderColor: colors.border,
            textSubtle: colors.textSubtle,


        }}>
            <header className="sticky top-0 z-20 p-4 bg-white/95 backdrop-blur-sm flex items-center justify-between flex-shrink-0" style={{
                backgroundColor: colors.card,
                color: colors.text,
                borderColor: colors.border,
                textSubtle: colors.textSubtle,
            }}>
                <div className="flex items-center space-x-4">
                    <div className="relative">
                        <BacklogSearchIcon />
                        <input
                            type="text"
                            placeholder="Search backlog"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-9 pr-4 py-1.5 text-sm border rounded bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            style={{ backgroundColor: colors.card, color: colors.text, borderColor: colors.border }} />
                    </div>
                    <div className="flex items-center space-x-2 border-l pl-4">
                        <UserAvatar user={users && users[0]} />
                        <Dropdown options={epicOptions} onSelect={(value) => { if (value === 'create') setIsCreatingEpic(true) }}>
                            <button className="flex items-center space-x-1 text-sm font-medium p-1 hover:bg-gray-200 rounded">
                                <span>Epic</span><DropdownChevronIcon />
                            </button>
                        </Dropdown>
                    </div>
                </div>
                <div className="flex items-center space-x-1 text-gray-600">
                    <button onClick={() => handlePanelToggle('insights')} className={`p-2 rounded ${activePanel === 'insights' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-200'}`}><NewInsightsIcon /></button>
                    <button onClick={() => handlePanelToggle('view-settings')} className={`p-2 rounded ${activePanel === 'view-settings' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-200'}`}><FiltersIcon /></button>
                    <Dropdown options={moreMenuOptions} onSelect={() => console.log("Manage filters selected")}>
                        <button className="p-2 hover:bg-gray-200 rounded"><MoreHorizontalIcon /></button>
                    </Dropdown>
                </div>
            </header>

            <div className="p-4 pt-2 flex items-center gap-2 flex-wrap bg-white/95 backdrop-blur-sm border-b shadow-sm" style={{ backgroundColor: colors.card, color: colors.text, borderColor: colors.border }}>
                <span className="text-sm font-semibold mr-2 text-gray-600">Filter by Epic:</span>
                <button
                    onClick={() => setSelectedEpicId(null)}
                    className={`px-3 py-1 text-sm font-semibold rounded-full transition ${selectedEpicId === null ? 'bg-blue-600 text-white shadow' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                >
                    All Sprints
                </button>
                {epics.map(epic => (
    <button
      key={epic.id}
      onClick={() => setSelectedEpicId(epic.id)}
      className={`px-3 py-1 text-sm font-semibold rounded-full transition 
        ${selectedEpicId === epic.id ? 'bg-blue-600 text-white shadow' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}
      `}
    >
      {epic.title}
    </button>
  ))}
            </div>

            <div className="flex flex-grow overflow-hidden">
                <main className={`flex-grow transition-all duration-300 ease-in-out overflow-y-auto p-6 ${activePanel ? 'w-2/3' : 'w-full'}`}>

                    {uncompletedSprints.map(sprint => (
                        <SprintSection key={sprint.id} sprint={sprint} />
                    ))}

                    <div className="backdrop-blur-sm p-3 rounded-md" onDragOver={handleDragOver} onDrop={(e) => handleDrop(e, 'backlog')}>
                        <div className="flex justify-between items-center mb-3">
                            <div className="flex items-center gap-4">
                                <input type="checkbox" className="form-checkbox h-4 w-4" />
                                {isEditingBacklogName ? (
                                    <input
                                        ref={backlogNameInputRef}
                                        type="text"
                                        defaultValue={boardData.backlog.name}
                                        onBlur={(e) => handleRenameBacklog(e.target.value)}
                                        onKeyDown={(e) => { if (e.key === 'Enter') handleRenameBacklog(e.target.value) }}
                                        className="font-bold text-gray-800 bg-white border rounded px-1"
                                    />
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <h2 className="font-bold text-gray-800" style={{ color: colors.text }}>{boardData.backlog.name}</h2>
                                        <button onClick={handleStartRenameBacklog} className="text-gray-500 hover:text-gray-800" style={{ color: colors.text }}><PencilIcon /></button>
                                    </div>
                                )}
                                <span className="text-sm text-gray-500" style={{ color: colors.text }}>{backlogItems.length} work items</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <StatusSummaryDots
                                    todo={backlogStatusCounts.todo}
                                    inProgress={backlogStatusCounts.inProgress}
                                    done={backlogStatusCounts.done}
                                />
                                {!isCreatingSprint && <button onClick={() => setIsCreatingSprint(true)} className="bg-blue-300 text-black px-3 py-1.5 text-sm font-semibold rounded hover:bg-blue-400">Create sprint</button>}
                            </div>
                        </div>
                        {isCreatingSprint && (
                            <form onSubmit={handleAddNewSprint} className="mb-3 p-2 bg-white rounded shadow" style={{
                                backgroundColor: colors.card,
                                color: colors.text,
                                borderColor: colors.border,
                                textSubtle: colors.textSubtle,
                            }}>
                                <input
                                    ref={newSprintInputRef}
                                    type="text"
                                    value={newSprintName}
                                    onChange={(e) => setNewSprintName(e.target.value)}
                                    placeholder="Enter new sprint name"
                                    className="w-full p-2 border rounded mb-2"
                                />
                                <div className="flex justify-end gap-2">
                                    <button type="button" onClick={() => setIsCreatingSprint(false)} className="bg-gray-200 text-gray-800 px-3 py-1 text-sm rounded">Cancel</button>
                                    <button type="submit" className="bg-blue-600 text-white px-3 py-1 text-sm rounded" style={{ backgroundColor: colors.card, color: colors.text, borderColor: colors.border }}>Create</button>
                                </div>
                            </form>
                        )}
                        <div className="min-h-[120px] rounded p-2">
                            {backlogItems.map((item) => (
                                <div key={item.id} data-item-id={item.id} draggable="true" onDragStart={(e) => handleDragStart(e, item.id)} onDragEnd={handleDragEnd} className="group flex items-center p-2 mb-1 rounded bg-white border hover:bg-blue-50 cursor-pointer" onClick={() => handleItemClick(item)} style={{ backgroundColor: colors.card, color: colors.text, borderColor: colors.border }}>
                                    <input type="checkbox" onClick={e => e.stopPropagation()} className="mr-3 form-checkbox h-4 w-4" />
                                    <span className="text-sm text-gray-500 w-24 font-medium" style={{ color: colors.text }}>{item.id}</span>
                                    <span className="flex-grow text-sm text-gray-800 flex items-center gap-2">
                                        {editingItemId === item.id ? (
                                            <input
                                                ref={itemNameInputRef}
                                                type="text"
                                                defaultValue={item.title}
                                                onClick={e => e.stopPropagation()}
                                                onBlur={(e) => handleRenameItem(item.id, e.target.value)}
                                                onKeyDown={(e) => { if (e.key === 'Enter') handleRenameItem(item.id, e.target.value) }}
                                                className="text-sm text-gray-800 bg-white border rounded px-1 w-full"
                                            />
                                        ) : (
                                            <>
                                                <span style={{ color: colors.text }}>{item.title}</span>
                                                <button onClick={(e) => { e.stopPropagation(); handleStartRenameItem(item.id); }} className="text-gray-500 hover:text-gray-800 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <PencilIcon />
                                                </button>
                                            </>
                                        )}
                                    </span>
                                    <div className="flex items-center space-x-4 ml-4" onClick={e => e.stopPropagation()}>
                                        <StatusDropdown currentStatus={item.status} onItemUpdate={(updates) => handleUpdateItem(item.id, updates)} />
                                        <PriorityDropdown currentPriority={item.priority} onItemUpdate={(updates) => handleUpdateItem(item.id, updates)} isIconOnly={true} />
                                        <UserSelector selectedUserId={item.assignee} users={usersWithUnassigned} onUpdate={(userId) => handleUpdateItem(item.id, { assignee: userId })} style={{ color: colors.textSubtle }} />
                                        <button onClick={(e) => { e.stopPropagation(); handleDeleteItem(item.id); }} className="text-gray-500 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: colors.textSubtle }}>
                                            <ActionTrashIcon />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button onClick={() => handleCreateItem('backlog')} className="mt-3 text-sm font-semibold text-black border border-blue-400 bg-blue-400 hover:bg-blue-400 px-3 py-1.5 rounded">+ Create Backlog</button>
                    </div>

                    {completedSprints.length > 0 && (
                        <div className="mt-8">
                            <h3 className="text-lg font-bold text-gray-500 mb-2 border-b pb-2" style={{ color: colors.text }}>Completed Sprints</h3>
                            {completedSprints.map(sprint => (
                                <SprintSection key={sprint.id} sprint={sprint} />
                            ))}
                        </div>
                    )}
                </main>

                {activePanel && (
                    <aside className="w-1/3 border-l border-gray-200/50 transition-all duration-300 ease-in-out" >
                        {activePanel === 'insights' && <InsightsPanel onClose={() => handlePanelToggle(null)} />}
                        {activePanel === 'view-settings' && <ViewSettingsPanel onClose={() => handlePanelToggle(null)} />}
                    </aside>
                )}
            </div>
        </div>
    );
}

