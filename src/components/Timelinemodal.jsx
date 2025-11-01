import React, { useState, useEffect } from "react";
import { XIcon } from "./Icons"; // Assuming Icons.js is in the same folder
import { useParams } from "react-router-dom";

const formatDateForInput = (dateString) => {
  if (!dateString) return "";
  try {
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  } catch (e) {
    console.error("Invalid date string:", dateString);
    return "";
  }
};

const Timelinemodal = ({
  show,
  onHide,
  epic,
  onTaskUpdate,
  users = [],
  teamsList = [],
}) => {
  // States for the fields in the "Details" image
  const [assignee, setAssignee] = useState("");
  const [team, setTeam] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [startDate, setStartDate] = useState("");
  const [epic_id, setEpic_id] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (show && epic) {
      // Populate form with existing task data
      setAssignee(epic.assignee?.id || "");
      setTeam(epic.team?.id || "");
      setDueDate(formatDateForInput(epic.due_date));
      setEpic_id(epic?.id || null);
      setStartDate(formatDateForInput(epic.start_date));
    }
  }, [show, epic]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const authToken = localStorage.getItem("authToken");

    if (!authToken) {
      setError("You must be logged in to update a task.");
      setLoading(false);
      return;
    }

    // Prepare data for a PATCH request (partial update)
    const detailsData = {
      assignee_id: assignee || null,
      team_id: team || null,
      epic_id: epic_id || null,
      due_date: dueDate || null,
      start_date: startDate || null,
    };

    try {
      const response = await fetch(
        `http://localhost:8000/api/timeline/epics/${epic_id}/dates/`,
        {
          method: "PATCH", // Use PATCH for partial updates
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify(detailsData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = Object.entries(errorData)
          .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(", ") : value}`)
          .join("; ");
        throw new Error(errorMessage || `Failed to update task details`);
      }

      if (onTaskUpdate) {
        onTaskUpdate(); // Notify parent component to refetch or update data
      }

      onHide(); // Close the modal on success
    } catch (error) {
      console.error(`Error updating task details:`, error);
      setError(
        error.message ||
          "Failed to update details. Please check server connection."
      );
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
          <h2 className="text-2xl font-bold">Edit Details</h2>
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
          id="timeline-form"
          className="px-6 py-6 space-y-6"
        >
          {/* Error Message */}
          {error && (
            <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3 text-red-200 text-sm">
              {error}
            </div>
          )}

          {/* Assignee */}
          <div>
            <label className="block text-sm font-semibold text-gray-200 mb-1">
              Assignee
            </label>
            <select
              value={assignee}
              onChange={(e) => setAssignee(e.target.value)}
              className="w-full p-3 bg-white/20 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            >
              <option className="text-black" value="">
                Unassigned
              </option>
              {users.map((user) => (
                <option key={user.id} className="text-black" value={user.id}>
                  {user.username} {/* Assuming user object has id and username */}
                </option>
              ))}
            </select>
          </div>

          {/* Team */}
          <div>
            <label className="block text-sm font-semibold text-gray-200 mb-1">
              Team
            </label>
            <select
              value={team}
              onChange={(e) => setTeam(e.target.value)}
              className="w-full p-3 bg-white/20 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            >
              <option className="text-black" value="">
                None
              </option>
              {teamsList.map((team) => (
                <option key={team.id} className="text-black" value={team.id}>
                  {team.name} {/* Assuming team object has id and name */}
                </option>
              ))}
            </select>
          </div>

          {/* Start Date */}
          <div>
            <label className="block text-sm font-semibold text-gray-200 mb-1">
              Start date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full p-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition [color-scheme:dark]"
            />
          </div>

          {/* Due Date */}
          <div>
            <label className="block text-sm font-semibold text-gray-200 mb-1">
              Due date
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full p-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition [color-scheme:dark]"
            />
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
              form="timeline-form"
              disabled={loading}
              className="px-5 py-2 bg-blue-500/80 hover:bg-blue-500 text-white font-semibold rounded-lg shadow-lg shadow-blue-500/30 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Saving..." : "Save Details"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Timelinemodal;
