import React, { useState } from 'react';


const InviteIcon= (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
   
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 14c2.5 0 4 1 4 3v1H5v-1c0-2 1.5-3 4-3m6-7a4 4 0 11-8 0 4 4 0 018 0z" />
    
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 5v4m2-2h-4" />
  </svg>
);


const CloseIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);


const Modal = ({ isOpen, onClose }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Worker');
  const [personalMessage, setPersonalMessage] = useState('');

  if (!isOpen) return null;

  
  const handleCloseAndReset = () => {
      setFirstName('');
      setLastName('');
      setEmail('');
      setRole('Worker');
      setPersonalMessage('');
      onClose();
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const invitationData = {
      firstName,
      lastName,
      email,
      role,
      personalMessage
    };

    console.log('Form Submitted. Data:', invitationData);
    
   
    handleCloseAndReset();
  };

  return (
    <div
      className="fixed inset-0 z-40 flex justify-center items-center p-4" 
      onClick={handleCloseAndReset}
    >
      <div
        className="bg-white p-6 rounded-lg shadow-2xl z-50 w-full max-w-lg relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            {InviteIcon} Invite New Member
          </h2>
          <button onClick={handleCloseAndReset} className="text-gray-500 hover:text-gray-800 focus:outline-none">
            {CloseIcon}
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">First Name</label>
              <input
                type="text"
                placeholder="First name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-gray-900 focus:border-gray-900 sm:text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Last Name</label>
              <input
                type="text"
                placeholder="Last name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-gray-900 focus:border-gray-900 sm:text-sm"
                required
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Email Address</label>
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block w-full pl-3 pr-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-gray-900 focus:border-gray-900 sm:text-sm"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-900 focus:border-gray-900 sm:text-sm"
            >
              <option>Worker</option>
              <option>Manager</option>
              <option>Administrator</option>
            </select>
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700">Personal Message (Optional)</label>
            <textarea
              rows="3"
              placeholder="Welcome message or additional details..."
              value={personalMessage}
              onChange={(e) => setPersonalMessage(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-gray-900 focus:border-gray-900 sm:text-sm resize-none"
            ></textarea>
          </div>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={handleCloseAndReset}
              className="px-5 py-2.5 bg-gray-200 text-gray-800 rounded-md font-semibold hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-gray-900 text-white rounded-md font-semibold hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
            >
              Send Invitation
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Modal;

