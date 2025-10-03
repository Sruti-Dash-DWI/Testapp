import React from 'react';

const GradientBackground = ({ children, className = '' }) => {
  return (
    <div 
      className={`fixed top-0 left-0 w-screen h-screen ${className}`}
      style={{
        background: 'linear-gradient(140deg, #ede3ff 0%, #ffffff 70%, #ede3ff 100%), radial-gradient(circle at top left, #ffffffb3 50%, transparent 80%), radial-gradient(circle at top right, #ffffffb3 50%, transparent 80%), radial-gradient(circle at bottom left, #ffffffb3 50%, transparent 80%), radial-gradient(circle at bottom right, #ffffffb3 50%, transparent 80%)',
        backgroundAttachment: 'fixed',
        backgroundSize: 'cover',
        zIndex: -1,
      }}
    >
      <div style={{position: 'relative', width: '100vw', height: '100vh'}}>
        {children}
      </div>
    </div>
  );
};

export default GradientBackground;
