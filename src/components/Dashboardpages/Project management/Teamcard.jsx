import React from 'react';


const MailIcon = ({ className = "w-4 h-4" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);
const PhoneIcon = ({ className = "w-4 h-4" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
  </svg>
);
const ChatIcon = ({ className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
  </svg>
);
const EyeIcon = ({ className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);


const Teamcard = ({ member }) => {
  



 let statusStyle = {
  Available: 'bg-green-100 text-green-700',
  Busy: 'bg-yellow-100 text-yellow-700',
};

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center shadow-sm">
      <div className="w-12 h-12 rounded-full bg-gray-100 flex-shrink-0 flex items-center justify-center">
        <span className="font-bold text-gray-600">{member.initials}</span>
      </div>

    
      <div className="ml-4 flex-grow">
        <h3 className="font-bold text-gray-900">{member.name}</h3>
        <p className="text-gray-500 text-sm">{member.role}</p>
        <div className="flex items-center gap-4 text-gray-500 text-sm mt-2">
          <span className="flex items-center gap-1.5"><MailIcon /> {member.email}</span>
          <span className="flex items-center gap-1.5"><PhoneIcon /> {member.phone}</span>
        </div>
      </div>

      
      <div className="flex items-center gap-4 text-gray-500">
        <span className={`text-xs font-semibold px-3 py-1 rounded-full ${statusStyle}`}>
          {member.status}
        </span>
        <button className="hover:text-gray-800"><ChatIcon /></button>
        <button className="flex items-center gap-1.5 hover:text-gray-800">
          <EyeIcon />
          <span>View</span>
        </button>
      </div>
    </div>
  );
};

export default Teamcard;