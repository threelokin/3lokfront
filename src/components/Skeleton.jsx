import React from 'react';

const Skeleton = () => {
  return (
    <div className="h-screen flex flex-col p-4 relative animate-pulse" style={{ scrollSnapAlign: 'start' }}>
      <div className="w-full h-52 bg-gray-300 rounded-lg mt-12"></div>
      <div className="w-3/4 h-6 bg-gray-300 rounded mt-4"></div>
      <div className="w-full h-4 bg-gray-300 rounded mt-2"></div>
      <div className="w-full h-4 bg-gray-300 rounded mt-2"></div>
      <div className="w-1/2 h-4 bg-gray-300 rounded mt-2"></div>
      <div className="w-1/4 h-4 bg-gray-300 rounded mt-2"></div>
    </div>
  );
};

export default Skeleton;
