import React, { useState } from "react";
import { XIcon } from "./Icons"; 

const AddTaskModal = ({ show, onHide, onAddTask }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("todo");
  const [badges, setBadges] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title) return;
    onAddTask({
      title,
      description,
      status,
      badges: badges
        .split(",")
        .map((b) => b.trim())
        .filter((b) => b),
    });
    onHide();
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
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Write task details..."
              className="w-full p-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            ></textarea>
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
              <option className="text-black" value="todo">
                To Do
              </option>
              <option className="text-black" value="inprogress">
                In Progress
              </option>
              <option className="text-black" value="done">
                Done
              </option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-200 mb-1">
              Badges (comma-separated)
            </label>
            <input
              type="text"
              value={badges}
              onChange={(e) => setBadges(e.target.value)}
              placeholder="e.g., UI/UX, High Priority"
              className="w-full p-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            />
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 pt-4 border-t border-white/20">
            <button
              type="button"
              onClick={onHide}
              className="px-4 py-2 text-gray-300 font-semibold rounded-lg hover:text-white transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="add-task-form"
              className="px-5 py-2 bg-blue-500/80 hover:bg-blue-500 text-white font-semibold rounded-lg shadow-lg shadow-blue-500/30 transition"
            >
              Add Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTaskModal;
