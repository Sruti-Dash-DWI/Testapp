import React, { useState, useEffect } from "react";
import { XIcon } from "./Icons";

const AddTaskModal = ({ show, onHide, onAddTask, columns, initialStatus }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState(1);
  const [taskType, setTaskType] = useState("");
  const [priority, setPriority] = useState("");
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (show) {
      // Set status to the initialStatus passed from Board, or the first column's status
      // const defaultStatus = 1;
      // setStatus(defaultStatus);
      fetchTasks();
    }
  }, [show, columns]);

  const fetchTasks = async () => {
    setLoading(true);
    setError(null);

    try {
      const authToken = localStorage.getItem('authToken');

      if (!authToken) {
        setError('Please login to view tasks');
        return;
      }

      const response = await fetch('http://localhost:8000/api/tasks/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
      });

      if (response.status === 401) {
        setError('Session expired. Please login again');
        return;
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const tasksData = await response.json();
      setTasks(tasksData);

    } catch (error) {
      console.error('Error fetching tasks:', error);
      setError('Failed to fetch tasks. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title) return;

    setLoading(true);
    setError(null);

    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
      setError('You must be logged in to create a task.');
      setLoading(false);
      return;
    }

    const taskData = {
      title,
      description,
      status,
      taskType,
      priority,
    };

    try {
      const response = await fetch('http://localhost:8000/api/tasks/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify(taskData)
      });

      if (!response.ok) {
        throw new Error('Failed to create task');
      }

      const newTask = await response.json();

      // Call the parent component's onAddTask if provided
      if (onAddTask) {
        onAddTask(newTask);
      }

      // Refresh the task list
      fetchTasks();

      // Reset form and close modal
      setTitle("");
      setDescription("");
      //const defaultStatus = initialStatus || (columns.length > 0 ? columns[0].status : "todo");
      setStatus(1);
      setTaskType("");
      setPriority("");
      onHide();

    } catch (error) {
      console.error('Error creating task:', error);
      setError('Failed to create task. Please check server connection.');
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md">
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 w-full max-w-md text-white">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-white/20">
          <h2 className="text-2xl font-bold">Add New Task</h2>
          <button
            onClick={onHide}
            className="text-gray-300 hover:text-white transition"
          >
            <XIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Body */}
        <form
          onSubmit={handleSubmit}
          id="add-task-form"
          className="px-6 py-6 space-y-6"
        >
          {/* Error Message */}
          {error && (
            <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3 text-red-200 text-sm">
              {error}
            </div>
          )}
          <div>
            <label className="block text-sm font-semibold text-gray-200 mb-1">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full p-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              placeholder="Enter task title"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-200 mb-1">
              Description
            </label>
            <input
              text="textarea"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Write task details..."
              className="w-full p-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            ></input>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-200 mb-1">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full p-3 bg-white/20 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            >
              {/* Dynamically generate options from the columns prop */}
              {columns.map((column, i) => (
                <option
                  key={i}
                  className="text-black"
                  value={column?.id}
                >
                  {column.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-200 mb-1">
              Task Type
            </label>
            <select
              value={taskType}
              onChange={(e) => setTaskType(e.target.value)}
              className="w-full p-3 bg-white/20 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            >
              <option className="text-black" value="BUG">
                Bug
              </option>
              <option className="text-black" value="FEATURE">
                Feature
              </option>
              <option className="text-black" value="IMPROVEMENT">
                Improvement
              </option>
              <option className="text-black" value="TEST_CASE">
                Test Case
              </option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-200 mb-1">
              Priority
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full p-3 bg-white/20 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            >
              <option className="text-black" value="LOWEST">
                Lowest
              </option>
              <option className="text-black" value="LOW">
                Low
              </option>
              <option className="text-black" value="MEDIUM">
                Medium
              </option>
              <option className="text-black" value="HIGH">
                High
              </option>
              <option className="text-black" value="HIGHEST">
                Highest
              </option>
            </select>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 pt-4 border-t border-white/20">
            <button
              type="button"
              onClick={onHide}
              disabled={loading}
              className="px-4 py-2 text-gray-300 font-semibold rounded-lg hover:text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="add-task-form"
              disabled={loading}
              className="px-5 py-2 bg-blue-500/80 hover:bg-blue-500 text-white font-semibold rounded-lg shadow-lg shadow-blue-500/30 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Adding...' : 'Add Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTaskModal;
