import React, { useState, useEffect } from "react";
import { XIcon } from "./Icons";

const EditTaskModal = ({ show, onHide, onUpdateTask, task }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("");
  const [badges, setBadges] = useState("");

  useEffect(() => {
    if (task) {
      setTitle(task.title || "");
      setDescription(task.description || "");
      setStatus(task.status || "todo");
      setBadges(task.badges ? task.badges.join(", ") : "");
    }
  }, [task]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title) return;

    onUpdateTask(task.id, {
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

  if (!show || !task) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md">
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 w-full max-w-md text-white">
        <div className="flex justify-between items-center px-6 py-4 border-b border-white/20">
          <h2 className="text-2xl font-bold">Edit Task</h2>
          <button
            onClick={onHide}
            className="text-gray-300 hover:text-white transition"
          >
            <XIcon className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-6 space-y-6">
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
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-200 mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              rows="4"
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
              <option className="text-black" value="todo">To Do</option>
              <option className="text-black" value="inprogress">In Progress</option>
              <option className="text-black" value="done">Done</option>
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
              className="w-full p-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            />
          </div>

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
              className="px-5 py-2 bg-blue-500/80 hover:bg-blue-500 text-white font-semibold rounded-lg shadow-lg shadow-blue-500/30 transition"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTaskModal;