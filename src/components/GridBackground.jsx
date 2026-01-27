import React from 'react';

const GridBackground = ({ children, className = '' }) => {
  return (
    <div className={`relative w-full min-h-screen overflow-hidden ${className}`}>
      {/* Main background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-500 to-white dark:from-blue-100 dark:to-gray-100">
        {/* Grid pattern */}
        <div 
          className="absolute inset-0 opacity-20 dark:opacity-15"
          style={{
            backgroundImage: `
              linear-gradient(to right, #5bb0e5ff 1px, transparent 1px),
              linear-gradient(to bottom, #043bedff 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
          }}
        />
        
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-blue-200/90 to-transparent dark:from-blue-200/90" />
        
        {/* Content */}
        <div className="relative z-10 h-full w-full">
          {children}
        </div>
      </div>
    </div>
  );
};

export default GridBackground;