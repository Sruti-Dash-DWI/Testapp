// src/components/Dashboardpages/Project management/Teammanagement.jsx

import React from 'react';
import { useOutletContext } from 'react-router-dom'; // Import useOutletContext
import StatCard from './Statcard';
import Modal from './Modal';
import TeamMembersList from './Teammeberlist';

const PlusIcon = ({ className = "w-5 h-5" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
);

const teamData = [
  { title: "Total Members", value: 48 },
  { title: "Active Members", value: 42 },
  { title: "Active Projects", value: 12 },
];

const TeamManagement = () => {
  // REMOVED: const [isModalOpen, setIsModalOpen] = useState(false);
  // Get the modal state and functions from the parent layout
  const { isInviteModalOpen, openModal, closeModal } = useOutletContext();

  return (
    <section className="mt-12">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Project Management</h1>
          <p className="text-gray-500 mt-1">Manage team members, roles, and permissions</p>
        </div>
        <div className="relative">
          <button
            className="bg-gray-900 text-white font-semibold px-5 py-2.5 rounded-full flex items-center gap-2 hover:bg-gray-700"
            onClick={openModal} 
          >
            <PlusIcon />
            Invite Member
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        {teamData.map((stat) => (
          <StatCard key={stat.title} title={stat.title} value={stat.value} />
        ))}
      </div>

      {/* The Modal's props now come from the context */}
      <Modal isOpen={isInviteModalOpen} onClose={closeModal} />
      <TeamMembersList />
    </section>
  );
};

export default TeamManagement;