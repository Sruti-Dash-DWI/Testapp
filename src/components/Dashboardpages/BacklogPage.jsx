import React, { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";

// Import newly created components
import BacklogView from "../Dashboardpages/backlog/BacklogView";
import {
  ItemDetailModal,
  EditSprintModal,
  StartSprintModal,
  CreateEpicModal,
  CompleteSprintModal,
} from "../Dashboardpages/backlog/BacklogModals";

export default function BacklogPage() {
  // --- DYNAMIC ROUTE PARAMS & NAVIGATION ---
  const { projectId } = useParams();
  const navigate = useNavigate();

  // --- STATE MANAGEMENT ---
  const [boardData, setBoardData] = useState(null);
  const [users, setUsers] = useState([]);
  const [projectMembers, setProjectMembers] = useState([]);
  const [epics, setEpics] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [projectName, setProjectName] = useState("");
  const [selectedEpicId, setSelectedEpicId] = useState(null);

  const [draggedItemId, setDraggedItemId] = useState(null);
  const [activePanel, setActivePanel] = useState(null);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [selectedItem, setSelectedItem] = useState(null);
  const [sprintToEdit, setSprintToEdit] = useState(null);
  const [sprintToStart, setSprintToStart] = useState(null);
  const [sprintToComplete, setSprintToComplete] = useState(null);
  const [editingSprintId, setEditingSprintId] = useState(null);
  const [editingItemId, setEditingItemId] = useState(null);
  const [isEditingBacklogName, setIsEditingBacklogName] = useState(false);
  const [isCreatingSprint, setIsCreatingSprint] = useState(false);
  const [isCreatingEpic, setIsCreatingEpic] = useState(false);
  const [newSprintName, setNewSprintName] = useState("");

  const sprintNameInputRef = useRef(null);
  const backlogNameInputRef = useRef(null);
  const itemNameInputRef = useRef(null);
  const newSprintInputRef = useRef(null);

  // --- DATA FETCHING ---
  useEffect(() => {
    const fetchInitialData = async () => {
      if (!projectId) {
        setError(
          "Project ID is missing from the URL. Please ensure your route is configured correctly (e.g., /backlog/:projectId)."
        );
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      const authToken = localStorage.getItem("authToken");
      if (!authToken) {
        setError("Authentication token not found. Please log in.");
        setIsLoading(false);
        navigate("/login");
        return;
      }

      try {
        const fullUrl = `http://127.0.0.1:8000/api/projects/${projectId}/`;
        const response = await fetch(fullUrl, {
          headers: { Authorization: `Bearer ${authToken}` },
        });

        if (response.status === 401) {
          localStorage.removeItem("authToken");
          localStorage.removeItem("userId");
          setError("Your session has expired. Please log in again.");
          navigate("/login");
          return;
        }

        if (!response.ok) {
          throw new Error(
            `Failed to fetch project data. Status: ${response.status} ${response.statusText}`
          );
        }

        const data = await response.json();
        setProjectName(data.name);

        const formattedBoardData = {
          items: {},
          sprints: [],
          backlog: { id: "backlog", name: "Backlog", itemIds: [] },
          itemCounter: data.tasks.length,
        };

        const transformedUsers = data.members.map((member) => ({
          id: member.user.id,
          membershipId: member.id,
          name:
            member.user.first_name && member.user.last_name
              ? `${member.user.first_name} ${member.user.last_name}`.trim()
              : member.user.email,
          email: member.user.email,
        }));

        // Inside the useEffect in BacklogPage.jsx

        data.tasks.forEach((task) => {
          // ✅ NEW: Normalize the priority string on initial load
          if (task.priority && typeof task.priority === "string") {
            const priorityStr = task.priority;
            // Converts "HIGHEST" to "Highest"
            task.priority =
              priorityStr.charAt(0).toUpperCase() +
              priorityStr.slice(1).toLowerCase();
          }

          formattedBoardData.items[task.id] = {
            ...task, // 'task' now contains the corrected priority
            status: task.status,
            assignee:
              task.assignees.length > 0 ? task.assignees[0].user.id : null,
          };
        });

        formattedBoardData.sprints = data.sprints.map((sprint) => ({
          id: sprint.id,
          name: sprint.name,
          goal: sprint.goal,
          startDate: sprint.start_date,
          endDate: sprint.end_date,
          isActive: sprint.is_active,
          epic: sprint.epic,
          itemIds: data.tasks
            .filter((task) => task.sprint === sprint.id)
            .map((item) => item.id),
        }));

        formattedBoardData.backlog.itemIds = data.tasks
          .filter((task) => task.sprint === null)
          .map((item) => item.id);

        setBoardData(formattedBoardData);
        setUsers(transformedUsers);
        setEpics(data.epics);
        setProjectMembers(data.members);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, [projectId, navigate]);

  // --- API HANDLERS ---

  const handleAddNewSprint = async (e) => {
    e.preventDefault();
    if (newSprintName.trim() === "") return;

    const today = new Date();
    const twoWeeksFromNow = new Date(
      today.getTime() + 14 * 24 * 60 * 60 * 1000
    );

    const formatDateForAPI = (date) => {
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const day = date.getDate().toString().padStart(2, "0");
      return `${year}-${month}-${day}`;
    };

    const newSprintPayload = {
      name: newSprintName,
      goal: "",
      project: parseInt(projectId, 10),
      epic: epics && epics.length > 0 ? parseInt(epics[0].id, 10) : null,
      start_date: formatDateForAPI(today),
      end_date: formatDateForAPI(twoWeeksFromNow),
    };

    const fullUrl = `http://127.0.0.1:8000/api/sprints/`;
    const authToken = localStorage.getItem("authToken");

    try {
      const response = await fetch(fullUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(newSprintPayload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          JSON.stringify(errorData) || "Network response was not ok."
        );
      }

      const createdSprint = await response.json();
      setBoardData((prevData) => ({
        ...prevData,
        sprints: [...prevData.sprints, { ...createdSprint, itemIds: [] }],
      }));
      setError(null);
    } catch (error) {
      setError("Failed to create the sprint. Please try again.");
    }

    setNewSprintName("");
    setIsCreatingSprint(false);
  };

  const handleUpdateSprint = async (sprintId, updates) => {
    // --- Step 1: Store the original state for potential rollback ---
    const originalBoardData = boardData;

    // --- Step 2: Optimistically update the UI ---
    setBoardData((prev) => ({
      ...prev,
      sprints: prev.sprints.map((s) =>
        s.id === sprintId
          ? {
              ...s,
              name: updates.name,
              goal: updates.goal,
              startDate: updates.start_date,
              endDate: updates.end_date,
              duration: updates.duration,
            }
          : s
      ),
    }));

    // --- Step 3: Send the PATCH request in the background ---
    const fullUrl = `http://127.0.0.1:8000/api/sprints/${sprintId}/`;
    const authToken = localStorage.getItem("authToken");
    const payload = { ...updates };

    if (payload.duration !== undefined) {
      payload.duration = parseInt(payload.duration, 10);
      if (isNaN(payload.duration)) {
        payload.duration = 0;
      }
    }

    try {
      const response = await fetch(fullUrl, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        // If the server fails, an error is thrown and caught below
        throw new Error("Server rejected the update.");
      }

      // Optional: Re-sync with the exact data from the server for consistency
      const updatedSprintFromServer = await response.json();
      setBoardData((prev) => ({
        ...prev,
        sprints: prev.sprints.map((s) =>
          s.id === sprintId ? { ...s, ...updatedSprintFromServer } : s
        ),
      }));

      console.log("✅ Sprint updated successfully:", updatedSprintFromServer);
    } catch (error) {
      // --- Step 4: If the request fails, roll back the UI change ---
      console.error("❌ Update sprint error, rolling back UI:", error);
      setError("Failed to update sprint. Your changes have been reverted.");
      setBoardData(originalBoardData); // Revert to the state before the optimistic update
    }
  };

  const handleStartSprint = async (sprintId, sprintData) => {
    const originalBoardData = boardData;

    setBoardData((prev) => {
      const newSprints = prev.sprints.map((s) => {
        if (s.isActive && s.id !== sprintId) {
          return { ...s, isActive: false };
        }
        if (s.id === sprintId) {
          // We assume the server will set isActive to true
          return { ...s, ...sprintData, isActive: true };
        }
        return s;
      });
      return { ...prev, sprints: newSprints };
    });

    // Close the modal immediately
    setSprintToStart(null);

    // --- Step 3: Send the PATCH request in the background ---
    const authToken = localStorage.getItem("authToken");
    const fullUrl = `http://127.0.0.1:8000/api/sprints/${sprintId}/activate/`;
    const payload = {
      name: sprintData.name,
      goal: sprintData.goal,
      start_date: sprintData.startDate,
      end_date: sprintData.endDate,
    };

    try {
      const response = await fetch(fullUrl, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        // If the server returns an error, it will be caught below
        throw new Error("Server rejected the request.");
      }

      // Optional: Re-sync with the exact data from the server for perfect consistency
      const updatedSprintFromServer = await response.json();
      setBoardData((prev) => ({
        ...prev,
        sprints: prev.sprints.map((s) =>
          s.id === sprintId ? { ...s, ...updatedSprintFromServer } : s
        ),
      }));

      console.log("✅ Sprint started and saved successfully.");
    } catch (error) {
      // --- Step 4: If the request fails, roll back the UI and show an error ---
      console.error(
        "❌ Failed to start sprint, rolling back UI change:",
        error
      );
      setError("Failed to start the sprint. Please try again.");
      setBoardData(originalBoardData); // Revert to the original state
    }
  };

  const handleDeleteSprint = async (sprintId) => {
    const fullUrl = `http://127.0.0.1:8000/api/sprints/${sprintId}/`;
    const authToken = localStorage.getItem("authToken");

    try {
      const response = await fetch(fullUrl, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (!response.ok) throw new Error("Network response was not ok.");

      setBoardData((prev) => {
        const sprintToDelete = prev.sprints.find((s) => s.id === sprintId);
        const itemsToMove = sprintToDelete ? sprintToDelete.itemIds : [];
        return {
          ...prev,
          sprints: prev.sprints.filter((s) => s.id !== sprintId),
          backlog: {
            ...prev.backlog,
            itemIds: [...prev.backlog.itemIds, ...itemsToMove],
          },
        };
      });
    } catch (error) {
      console.error("Error deleting sprint:", error);
    }
  };

  // In BacklogPage.jsx
  //New functions!!!!!!!!!!
  // This is a reusable helper function to create any new task on the backend
  const createTaskOnBackend = async (taskPayload) => {
    const authToken = localStorage.getItem("authToken");
    const fullUrl = `http://127.0.0.1:8000/api/tasks/`;

    try {
      const response = await fetch(fullUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(taskPayload),
      });

      const createdTask = await response.json();
      if (!response.ok) {
        console.error("Backend error response:", createdTask);
        throw new Error(JSON.stringify(createdTask));
      }

      console.log("✅ SUCCESS: Task created on backend:", createdTask);
      return createdTask;
    } catch (error) {
      console.error(
        "❌ FAILURE: Could not create task on backend.",
        "Error:",
        error.message
      );
      setError("Failed to create the task. Please check the console.");
      return null;
    }
  };

  // This function specifically handles the two-step subtask creation process
  const handleCreateSubtask = async (parentItemId, subtaskTitle) => {
    const authToken = localStorage.getItem("authToken");
    const currentUserMembership = projectMembers.find(
      (member) =>
        member.user.id === parseInt(localStorage.getItem("userId"), 10)
    );

    if (!currentUserMembership) {
      setError("Cannot create subtask: User is not a project member.");
      return;
    }

    // 1. Prepare payload and create the subtask using the reusable function
    const subtaskPayload = {
      title: subtaskTitle,
      project: parseInt(projectId, 10),
      status_id: 1, // Use status_id for creation
      priority: "MEDIUM",
      task_type: "FEATURE",
      reporter: currentUserMembership.id,
    };

    const newSubtask = await createTaskOnBackend(subtaskPayload);

    if (newSubtask) {
      // 2. If creation succeeded, link it to the parent
      try {
        const linkPayload = { parent_task: parentItemId };
        const linkUrl = `http://127.0.0.1:8000/api/tasks/${newSubtask.id}/parent/`;

        const linkResponse = await fetch(linkUrl, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify(linkPayload),
        });

        if (!linkResponse.ok)
          throw new Error("Failed to link subtask to parent.");

        console.log("✅ SUCCESS: Subtask linked to parent.");

        // 3. Update the UI state to show the new subtask
        setBoardData((prevData) => {
          const parentItem = prevData.items[parentItemId];
          // Ensure the subtasks array exists before adding to it
          const updatedSubtasks = [...(parentItem.subtasks || []), newSubtask];

          return {
            ...prevData,
            items: {
              ...prevData.items,
              // Add the new subtask to the main items list so it can be looked up
              [newSubtask.id]: { ...newSubtask, parent: parentItemId },
              // Update the parent item to include the new subtask in its subtasks array
              [parentItemId]: { ...parentItem, subtasks: updatedSubtasks },
            },
          };
        });
      } catch (error) {
        console.error("❌ FAILURE: Could not link subtask.", error);
      }
    }
  };

  const handleUpdateItemDB = async (itemId, updates) => {
    const authToken = localStorage.getItem("authToken");
    // The projectId is available in the component's scope from useParams()
    const projectIdInt = parseInt(projectId, 10);

    // Determine which field is being updated
    const updateKey = Object.keys(updates)[0];
    if (!updateKey) {
      console.error("Update function called with empty updates object.");
      return;
    }

    let fullUrl = `http://127.0.0.1:8000/api/tasks/${itemId}/`;
    let payload = {};

    // This switch statement directs the request to the correct endpoint and builds the correct body
    switch (updateKey) {
      case "status_id":
        fullUrl += "status/";
        payload = {
          status: updates.status_id,
          project: projectIdInt,
        };
        break;

      case "assignee":
        fullUrl += "assignees/";
        // The API expects an array of user IDs for assignees.
        // If the assignee is null/undefined (Unassigned), we send an empty array.
        const assigneeId = updates.assignee;
        payload = {
          assignees: assigneeId ? [assigneeId] : [],
          project: projectIdInt,
        };
        break;

      case "due_date":
        fullUrl += "due-date/";
        payload = {
          due_date: updates.due_date,
          project: projectIdInt,
        };
        break;

      case "story_points":
        fullUrl += "story-points/";
        const points = parseInt(updates.story_points, 10);
        payload = {
          story_points: isNaN(points) ? null : points, // Send null if not a valid number
        };
        break;

      case "description":
        fullUrl += "description/";
        payload = {
          description: updates.description,
        };
        break;

      // Default case for fields that use the main task endpoint, like 'priority' and 'title'
      case "sprint":
      case "priority":
      case "title":
        // These updates use the base URL: /api/tasks/{itemId}/
        payload = { ...updates };
        if (payload.priority) {
          payload.priority = payload.priority.toUpperCase();
        }
        break;

      default:
        console.error(
          `❌ Unhandled update key: '${updateKey}'. No API endpoint is configured for this field.`
        );
        return; // Stop execution if the field is not recognized
    }

    console.log(
      `Attempting PATCH: ${fullUrl}`,
      `Payload: ${JSON.stringify(payload)}`
    );

    try {
      const response = await fetch(fullUrl, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(payload),
      });

      const responseData = await response.json();

      if (!response.ok) {
        // Throw an error to be caught by the catch block
        throw new Error(
          JSON.stringify(responseData) ||
            `Request failed with status ${response.status}`
        );
      }

      console.log(
        `✅ SUCCESS: Item ${itemId} updated.`,
        "Response:",
        responseData
      );
      return responseData;
    } catch (error) {
      console.error(
        `❌ FAILURE: Could not update item ${itemId}.`,
        "Error:",
        error.message
      );
      return null; // ✅ RETURN NULL ON FAILURE
    }
  };

  const handleCreateItem = async (listId) => {
    const currentUserId = parseInt(localStorage.getItem("userId"), 10);
    if (!currentUserId) {
      setError("Could not find user ID. Please log in again.");
      return;
    }

    const currentUserMembership = projectMembers.find(
      (member) => member.user.id === currentUserId
    );
    if (!currentUserMembership) {
      setError(
        "Your user is not a member of this project. Cannot create task."
      );
      return;
    }

    const reporterMembershipId = currentUserMembership.id;

    const payload = {
      title: `New Task ${boardData.itemCounter + 1}`,
      description: "",
      project: parseInt(projectId, 10),
      sprint: listId === "backlog" ? null : listId,
      epic: epics.length > 0 ? epics[0].id : null,
      status_id: 1,
      priority: "MEDIUM",
      task_type: "FEATURE",
      assignees: [],
      reporter: reporterMembershipId,
      tags: [],
    };

    const fullUrl = `http://127.0.0.1:8000/api/tasks/`;
    const authToken = localStorage.getItem("authToken");

    try {
      const response = await fetch(fullUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          JSON.stringify(errorData) || "Network response was not ok."
        );
      }

      const createdItem = await response.json();

      setBoardData((prev) => {
        const newItems = { ...prev.items, [createdItem.id]: createdItem };

        const sprints = prev.sprints.map((s) =>
          s.id === listId
            ? { ...s, itemIds: [...s.itemIds, createdItem.id] }
            : s
        );
        const backlog =
          listId === "backlog"
            ? {
                ...prev.backlog,
                itemIds: [...prev.backlog.itemIds, createdItem.id],
              }
            : prev.backlog;

        return {
          ...prev,
          items: newItems,
          sprints,
          backlog,
          itemCounter: prev.itemCounter + 1,
        };
      });
    } catch (error) {
      setError(
        "Failed to create task. Check console for details from the server."
      );
    }
  };

  const handleDeleteItem = async (itemId) => {
    const fullUrl = `http://127.0.0.1:8000/api/tasks/${itemId}/`;
    const authToken = localStorage.getItem("authToken");

    try {
      const response = await fetch(fullUrl, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (!response.ok) throw new Error("Network response was not ok.");

      setBoardData((prev) => {
        const newItems = { ...prev.items };
        delete newItems[itemId];

        const sprints = prev.sprints.map((s) => ({
          ...s,
          itemIds: s.itemIds.filter((id) => id !== itemId),
        }));
        const backlog = {
          ...prev.backlog,
          itemIds: prev.backlog.itemIds.filter((id) => id !== itemId),
        };

        return { ...prev, items: newItems, sprints, backlog };
      });
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  const handleAddNewEpic = async (formData) => {
    const payload = {
      title: formData.epicName,
      description: formData.description,
      project: parseInt(projectId, 10),
    };

    const fullUrl = `http://127.0.0.1:8000/api/epics/`;
    const authToken = localStorage.getItem("authToken");

    try {
      const response = await fetch(fullUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(JSON.stringify(errorData));
      }
      const createdEpic = await response.json();
      setEpics((prev) => [...prev, createdEpic]);
      setIsCreatingEpic(false);
    } catch (error) {
      setError("Failed to create epic. Please try again.");
    }
  };

  // In BacklogPage.jsx

const handleOpenCompleteSprintModal = (sprintId) => {
    const sprint = boardData.sprints.find((s) => s.id === sprintId);
    if (!sprint || !sprint.isActive) return;

    // ✅ CORRECTED LOGIC: Check the status title, not the object
    const completedIssues = sprint.itemIds.filter(
        (id) => boardData.items[id].status.title.toUpperCase() === 'DONE'
    );
    const openIssues = sprint.itemIds.filter(
        (id) => boardData.items[id].status.title.toUpperCase() !== 'DONE'
    );
    
    const futureSprints = boardData.sprints.filter(
        (s) => !s.isActive && s.id !== sprintId
    );

    setSprintToComplete({
        ...sprint,
        completedCount: completedIssues.length,
        openCount: openIssues.length,
        openIssueIds: openIssues,
        futureSprints: futureSprints,
    });
};

  // In BacklogPage.jsx

const handleCompleteSprint = async (sprintId, openIssueIds, destination) => {
    const authToken = localStorage.getItem("authToken");

    try {
        const newSprintId =
            destination === "backlog" ? null : parseInt(destination, 10);

        // This part that moves tasks on the backend is correct and remains the same
        const moveTasksPromises = openIssueIds.map((taskId) => {
            const moveUrl = `http://127.0.0.1:8000/api/tasks/${taskId}/`;
            return fetch(moveUrl, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${authToken}`,
                },
                body: JSON.stringify({ sprint: newSprintId }),
            });
        });
        await Promise.all(moveTasksPromises);

        // This part that completes the sprint on the backend also remains the same
        const completeSprintUrl = `http://127.0.0.1:8000/api/sprints/${sprintId}/end/`;
        const completeSprintResponse = await fetch(completeSprintUrl, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${authToken}`,
            },
            body: JSON.stringify({}),
        });

        if (!completeSprintResponse.ok) {
            throw new Error("Tasks were moved, but failed to complete the sprint.");
        }

        const updatedSprint = await completeSprintResponse.json();

        // ✅ CORRECTED STATE UPDATE LOGIC
        setBoardData((prevData) => {
            // Create a new sprints array to ensure immutability
            const newSprints = prevData.sprints.map(sprint => {
                // 1. Remove open issues from the sprint we just completed
                if (sprint.id === sprintId) {
                    return {
                        ...sprint,
                        isActive: updatedSprint.is_active,
                        is_ended: updatedSprint.is_ended,
                        itemIds: sprint.itemIds.filter(id => !openIssueIds.includes(id))
                    };
                }
                // 2. Add open issues to the destination sprint
                if (sprint.id === newSprintId) {
                    return {
                        ...sprint,
                        itemIds: [...sprint.itemIds, ...openIssueIds]
                    };
                }
                // 3. Return all other sprints unchanged
                return sprint;
            });

            // Handle moving issues to the backlog separately
            const newBacklog = destination === 'backlog'
                ? {
                    ...prevData.backlog,
                    itemIds: [...prevData.backlog.itemIds, ...openIssueIds]
                  }
                : prevData.backlog;

            return {
                ...prevData,
                sprints: newSprints,
                backlog: newBacklog,
            };
        });

    } catch (error) {
        console.error("Error completing sprint:", error);
        setError("Failed to complete the sprint. Please check the console.");
    } finally {
        setSprintToComplete(null);
    }
};
  // --- UI HANDLERS ---
  useEffect(() => {
    if (isCreatingSprint) newSprintInputRef.current?.focus();
    if (editingSprintId) sprintNameInputRef.current?.focus();
    if (isEditingBacklogName) backlogNameInputRef.current?.focus();
    if (editingItemId) itemNameInputRef.current?.focus();
  }, [isCreatingSprint, editingSprintId, isEditingBacklogName, editingItemId]);

  const handleItemClick = (item) => setSelectedItem(item);
  const handleCloseModal = () => setSelectedItem(null);
  const handleCloseEditSprintModal = () => setSprintToEdit(null);
  const handleCloseStartSprintModal = () => setSprintToStart(null);
  const handleCloseCreateEpicModal = () => setIsCreatingEpic(false);
  const handleCloseCompleteSprintModal = () => setSprintToComplete(null);

  // In BacklogPage.jsx (replace the existing handleUpdateItem)

  const handleUpdateItem = async (itemId, updates) => {
    const updatedItemFromServer = await handleUpdateItemDB(itemId, updates);

    if (updatedItemFromServer) {
      // ✅ NEW: Normalize the priority string format from the server
      if (
        updatedItemFromServer.priority &&
        typeof updatedItemFromServer.priority === "string"
      ) {
        const priorityStr = updatedItemFromServer.priority;
        // Converts "LOWEST" or "lowest" to "Lowest"
        updatedItemFromServer.priority =
          priorityStr.charAt(0).toUpperCase() +
          priorityStr.slice(1).toLowerCase();
      }

      // Update local state with the definitive, corrected data from the server
      setBoardData((prevData) => {
        const newItems = {
          ...prevData.items,
          [itemId]: {
            ...prevData.items[itemId],
            ...updatedItemFromServer,
          },
        };
        return { ...prevData, items: newItems };
      });

      if (selectedItem && selectedItem.id === itemId) {
        setSelectedItem((prev) => ({ ...prev, ...updatedItemFromServer }));
      }
    }
  };

  const handleStartRenameSprint = (sprintId) => setEditingSprintId(sprintId);
  const handleStartRenameBacklog = () => setIsEditingBacklogName(true);
  const handleStartRenameItem = (itemId) => setEditingItemId(itemId);

  const handleRenameSprint = (sprintId, newName) => {
    handleUpdateSprint(sprintId, { name: newName || "Untitled Sprint" });
    setEditingSprintId(null);
  };

  const handleRenameItem = (itemId, newTitle) => {
    handleUpdateItem(itemId, { title: newTitle || "Untitled Item" });
    setEditingItemId(null);
  };

  const handleRenameBacklog = (newName) => {
    setBoardData((prev) => ({
      ...prev,
      backlog: { ...prev.backlog, name: newName || "Backlog" },
    }));
    setIsEditingBacklogName(false);
  };

  const handleDragStart = (e, itemId) => {
    setDraggedItemId(itemId);
    e.dataTransfer.effectAllowed = "move";
    setTimeout(() => {
      e.target.style.opacity = "0.5";
    }, 0);
  };

  const handleDragEnd = (e) => {
    if (e.target) e.target.style.opacity = "1";
    setDraggedItemId(null);
  };

  const handleDragOver = (e) => e.preventDefault();

  const findItemLocation = (itemId) => {
    if (!boardData) return null;
    for (const sprint of boardData.sprints) {
      if (sprint.itemIds.includes(itemId))
        return { listId: sprint.id, sprintName: sprint.name };
    }
    if (boardData.backlog.itemIds.includes(itemId))
      return { listId: "backlog", sprintName: boardData.backlog.name };
    return null;
  };

  const handleDrop = (e, targetListId) => {
    e.preventDefault();
    if (!draggedItemId) return;

    const sourceLocation = findItemLocation(draggedItemId);
    if (!sourceLocation) return;

    const { listId: sourceListId } = sourceLocation;
    if (sourceListId === targetListId && !e.target.closest("[data-item-id]"))
      return;

    const sprintId = targetListId === "backlog" ? null : targetListId;
    handleUpdateItemDB(draggedItemId, { sprint: sprintId });

    const newBoardData = JSON.parse(JSON.stringify(boardData));
    let sourceList =
      sourceListId === "backlog"
        ? newBoardData.backlog.itemIds
        : newBoardData.sprints.find((s) => s.id === sourceListId).itemIds;
    const sourceIndex = sourceList.indexOf(draggedItemId);
    if (sourceIndex > -1) sourceList.splice(sourceIndex, 1);

    let targetList =
      targetListId === "backlog"
        ? newBoardData.backlog.itemIds
        : newBoardData.sprints.find((s) => s.id === targetListId).itemIds;
    const dropTargetElement = e.target.closest("[data-item-id]");
    let dropIndex = targetList.length;

    if (dropTargetElement) {
      const dropTargetId = dropTargetElement.getAttribute("data-item-id");
      const index = targetList.indexOf(dropTargetId);
      if (index !== -1) dropIndex = index;
    }

    targetList.splice(dropIndex, 0, draggedItemId);
    setBoardData(newBoardData);
  };

  const handlePanelToggle = (panelName) =>
    setActivePanel((current) => (current === panelName ? null : panelName));
  const handleMoreMenuToggle = () => setIsMoreMenuOpen((prev) => !prev);

  const filteredItems = useMemo(() => {
    if (!boardData || !boardData.items) return {};
    if (!searchTerm) return boardData.items;

    const lowercasedFilter = searchTerm.toLowerCase();
    const filtered = {};
    for (const itemId in boardData.items) {
      const item = boardData.items[itemId];
      if (
        item.title.toLowerCase().includes(lowercasedFilter) ||
        item.id.toString().toLowerCase().includes(lowercasedFilter)
      ) {
        filtered[itemId] = item;
      }
    }
    return filtered;
  }, [searchTerm, boardData]);

  const backlogItems = useMemo(() => {
    if (!boardData || !boardData.backlog) return [];
    return boardData.backlog.itemIds
      .map((id) => filteredItems[id])
      .filter(Boolean);
  }, [boardData, filteredItems]);

  const usersWithUnassigned = useMemo(
    () => [{ id: null, name: "Unassigned" }, ...users],
    [users]
  );

  const epicOptions = useMemo(() => {
    if (!epics) return [];
    const options = epics.map((epic) => ({
      value: epic.id,
      label: epic.title,
    }));
    options.push({ value: "create", label: "+ Create Epic" });
    return options;
  }, [epics]);

   const filteredSprints = useMemo(() => {
        if (!boardData || !boardData.sprints) return [];
        
        // If no epic is selected, show all sprints
        if (selectedEpicId === null) {
            return boardData.sprints;
        }

        // Otherwise, only show sprints that match the selected epic's ID
        return boardData.sprints.filter(sprint => sprint.epic === selectedEpicId);
    }, [selectedEpicId, boardData]);

  // --- RENDER LOGIC ---
  if (isLoading) {
    return (
      <div
        className="flex items-center justify-center h-full text-lg font-semibold"
        style={{
          background:
            "linear-gradient(135deg, #ad97fd 0%, #f6a5dc 50%, #ffffff 100%)",
        }}
      >
        Loading backlog for project {projectId}...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full text-red-600">
        Error: {error}
      </div>
    );
  }

  const currentUserId = parseInt(localStorage.getItem("userId"), 10);

  return (
    <>
      <BacklogView
        boardData={boardData}
        users={users}
        usersWithUnassigned={usersWithUnassigned}
        epicOptions={epicOptions}
        filteredItems={filteredItems}
        backlogItems={backlogItems}
        searchTerm={searchTerm}
        sprints={filteredSprints} // ✅ Pass the filtered list here
        setSearchTerm={setSearchTerm}
        activePanel={activePanel}
        isMoreMenuOpen={isMoreMenuOpen}
        editingSprintId={editingSprintId}
        editingItemId={editingItemId}
        isEditingBacklogName={isEditingBacklogName}
        isCreatingSprint={isCreatingSprint}
        newSprintName={newSprintName}
        sprintNameInputRef={sprintNameInputRef}
        backlogNameInputRef={backlogNameInputRef}
        itemNameInputRef={itemNameInputRef}
        newSprintInputRef={newSprintInputRef}
        setIsCreatingEpic={setIsCreatingEpic}
        handlePanelToggle={handlePanelToggle}
        handleMoreMenuToggle={handleMoreMenuToggle}
        setSprintToEdit={setSprintToEdit}
        handleDeleteSprint={handleDeleteSprint}
        setSprintToStart={setSprintToStart}
        handleOpenCompleteSprintModal={handleOpenCompleteSprintModal}
        handleDragOver={handleDragOver}
        handleDrop={handleDrop}
        handleDragStart={handleDragStart}
        handleDragEnd={handleDragEnd}
        handleItemClick={handleItemClick}
        handleUpdateItem={handleUpdateItem}
        handleStartRenameSprint={handleStartRenameSprint}
        handleStartRenameItem={handleStartRenameItem}
        handleRenameSprint={handleRenameSprint}
        handleRenameItem={handleRenameItem}
        handleDeleteItem={handleDeleteItem}
        handleCreateItem={handleCreateItem}
        handleStartRenameBacklog={handleStartRenameBacklog}
        handleRenameBacklog={handleRenameBacklog}
        setIsCreatingSprint={setIsCreatingSprint}
        setNewSprintName={setNewSprintName}
        handleAddNewSprint={handleAddNewSprint}
        selectedEpicId={selectedEpicId} 
        setSelectedEpicId={setSelectedEpicId} 
        epics={epics}
      />

      <ItemDetailModal
        item={selectedItem}
        users={usersWithUnassigned}
        sprintName={
          selectedItem && boardData
            ? findItemLocation(selectedItem.id)?.sprintName
            : ""
        }
        onClose={handleCloseModal}
        onUpdate={handleUpdateItem}
        onCreateSubtask={handleCreateSubtask}
      />
      <EditSprintModal
        sprint={sprintToEdit}
        onClose={handleCloseEditSprintModal}
        onUpdate={handleUpdateSprint}
      />
      <StartSprintModal
        sprint={sprintToStart}
        onClose={handleCloseStartSprintModal}
        onStart={handleStartSprint}
      />
      {isCreatingEpic && (
        <CreateEpicModal
          onClose={handleCloseCreateEpicModal}
          onCreate={handleAddNewEpic}
          sprints={boardData.sprints || []}
          users={usersWithUnassigned || []}
          reporterId={currentUserId}
          projectName={projectName}
        />
      )}
      {sprintToComplete && (
        <CompleteSprintModal
          sprint={sprintToComplete}
          onClose={handleCloseCompleteSprintModal}
          onComplete={handleCompleteSprint}
        />
      )}
    </>
  );
}
