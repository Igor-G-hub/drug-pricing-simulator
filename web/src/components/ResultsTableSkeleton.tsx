import React from 'react';

const ResultsTableSkeleton: React.FC = () => {
  return (
    <div className="h-full animate-fadeIn overflow-x-auto">
      <div className="w-full min-w-[900px] h-full rounded-lg border border-white/20 bg-[#1a4a4c]/55 flex flex-col">
        <div className="grid grid-cols-6 border-b border-white/20 px-4 py-3">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div key={`head-${idx}`} className="flex items-center">
              <div className="h-4 w-24 rounded bg-white/25 animate-pulse" />
            </div>
          ))}
        </div>

        <div className="flex-1">
          {Array.from({ length: 8 }).map((_, rowIdx) => (
            <div key={`row-${rowIdx}`} className="grid grid-cols-6 border-b border-white/10 px-4 py-3">
              {Array.from({ length: 6 }).map((__, colIdx) => (
                <div key={`cell-${rowIdx}-${colIdx}`} className="flex items-center">
                  <div className="h-3 w-20 rounded bg-white/15 animate-pulse" />
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* <div className="grid grid-cols-6 px-4 py-3 bg-white/5">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div key={`foot-${idx}`} className="flex items-center">
              <div className="h-4 w-20 rounded bg-white/20 animate-pulse" />
            </div>
          ))}
        </div> */}
      </div>
    </div>
  );
};

export default ResultsTableSkeleton;
