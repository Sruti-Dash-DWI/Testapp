import React from "react";

function PrimaryBackground({ className = "", children }) {
  return (
    <div 
      className={`primary-background ${className}`}
      style={{
        background: 'linear-gradient(135deg, #ad97fd 0%, #f6a5dc 50%, #ffffff 100%)',
        minHeight: '100vh',
        backgroundAttachment: 'fixed',
        backgroundSize: 'cover',
        zIndex: -1,
      }}
    >
      {children}
    </div>
  );
}

export default PrimaryBackground;