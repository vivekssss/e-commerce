import React from 'react';

export const ProductSkeleton: React.FC = () => {
  return (
    <>
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="bg-white rounded-3xl overflow-hidden shadow-sm">
          <div className="shimmer-bg h-64 w-full" />
          <div className="p-6">
            <div className="shimmer-bg h-4 w-3/4 rounded mb-3" />
            <div className="shimmer-bg h-4 w-1/2 rounded mb-6" />
            <div className="flex justify-between items-center">
              <div className="shimmer-bg h-8 w-24 rounded-lg" />
              <div className="shimmer-bg h-8 w-8 rounded-full" />
            </div>
          </div>
        </div>
      ))}
    </>
  );
};
