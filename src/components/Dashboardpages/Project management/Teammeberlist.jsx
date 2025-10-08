import React from 'react';
import TeamMemberCard from './Teamcard'; 


const teamData = [
  {
    initials: 'AM',
    name: 'Deepak',
    role: 'Project Manager',
    email: 'deepak@gmail.com',
    phone: '+98567456789',
    status: 'Available',
  },
  {
    initials: 'FA',
    name: 'Sanmukh',
    role: 'Event Coordinator',
    email: 'sanmukh@gmail.com',
    phone: '+98523674567',
    status: 'Available',
  },
  {
    initials: 'KA',
    name: 'Arjun',
    role: 'Team Supervisor',
    email: 'arjun@gmail.com',
    phone: '+56845326945',
    status: 'Busy',
  },
];

const TeamMembersList = () => {
  return (
    <section className="mt-12">
      <div className="flex items-center gap-3">
        
        <h2 className="text-2xl font-bold text-gray-900">Team Members</h2>
      </div>

      <div className="mt-4 space-y-3">
        {teamData.map((member) => (
          <TeamMemberCard key={member.name} member={member} />
        ))}
      </div>
    </section>
  );
};

export default TeamMembersList;