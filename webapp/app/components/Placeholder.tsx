import React from 'react';

const Placeholder: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full space-y-4 animate-pulse">
      <div className="w-16 h-16 bg-gray-300 rounded-full"></div>
      <div className="h-4 bg-gray-300 rounded w-3/4"></div>
      <div className="h-4 bg-gray-300 rounded w-1/2"></div>
      <div className="h-4 bg-gray-300 rounded w-2/3"></div>
      <div className="h-4 bg-gray-300 rounded w-1/3"></div>
    </div>
  );
};

export default Placeholder;
