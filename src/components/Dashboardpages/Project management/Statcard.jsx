import React from 'react';


const UserIcon = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.653-.122-1.28-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.653.122-1.28.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);
const CheckIcon = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);
const ProjectIcon = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
  </svg>
);


const cardStyles = {
  "Total Members": { 
    icon: <UserIcon />, 
    className: "bg-blue-100 text-blue-600" 
  },
  "Active Members": { 
    icon: <CheckIcon />, 
    className: "bg-green-100 text-green-600" 
  },
  "Active Projects": { 
    icon: <ProjectIcon />, 
    className: "bg-purple-100 text-purple-600" 
  },
};

const StatCard = ({ title, value }) => {
 
  const styleInfo = cardStyles[title] || {};

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 flex justify-between items-center shadow-sm">
      <div>
        <p className="text-gray-500">{title}</p>
        <h2 className="text-3xl font-bold text-gray-900 mt-1">{value}</h2>
      </div>

      
      {styleInfo.icon && (
        <div className={`p-3 rounded-lg ${styleInfo.className}`}>
          {styleInfo.icon}
        </div>
      )}
    </div>
  );
};

export default StatCard;